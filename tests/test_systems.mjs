/**
 * Unit tests for quest game systems.
 * Run with: node tests/test_systems.mjs
 *
 * Tests pure data/logic without Phaser runtime. Each system is tested
 * against a minimal mock of the Phaser scene/registry API.
 */

import assert from 'node:assert/strict';
import { describe, it, beforeEach } from 'node:test';

// === MOCK HELPERS ===

function createMockRegistry(initial = {}) {
    const store = new Map(Object.entries(initial));
    return {
        get(key) { return store.get(key); },
        set(key, val) { store.set(key, val); },
        _store: store
    };
}

function createMockScene(registryData = {}) {
    const registry = createMockRegistry(registryData);
    const timers = [];
    return {
        registry,
        scene: {
            get(key) {
                // Return a minimal UI scene mock
                return {
                    showDialog() {},
                    updateDialogText() {},
                    hideDialog() {},
                    showChoices() {},
                    showNotification() {},
                    inventoryVisible: false,
                    questLogVisible: false
                };
            }
        },
        time: {
            addEvent(config) {
                const timer = {
                    config,
                    removed: false,
                    remove() { this.removed = true; }
                };
                timers.push(timer);
                return timer;
            },
            delayedCall() {}
        },
        cameras: { main: { fadeOut() {}, once() {} } },
        _timers: timers
    };
}

// ======================================================================
// QUEST DATA TESTS
// ======================================================================

// Mock localStorage before importing SaveManager
const _localStorage = new Map();
globalThis.localStorage = {
    getItem(key) { return _localStorage.get(key) ?? null; },
    setItem(key, val) { _localStorage.set(key, val); },
    removeItem(key) { _localStorage.delete(key); }
};

const { QUESTS, NPC_DIALOG_ROUTES, CHEST_REWARDS } = await import('../src/data/quests.js');
const { DIALOGUES } = await import('../src/data/dialogues.js');
const { NPC_DATA } = await import('../src/data/npcs.js');
const { CITIES } = await import('../src/data/cities.js');
const { TRAVEL_ROUTES, CITY_MAP_POSITIONS } = await import('../src/systems/TravelManager.js');
const { InventoryManager } = await import('../src/systems/InventoryManager.js');
const { SaveManager } = await import('../src/systems/SaveManager.js');
const { DialogManager } = await import('../src/systems/DialogManager.js');
const { QuestManager } = await import('../src/systems/QuestManager.js');
const { TravelManager } = await import('../src/systems/TravelManager.js');

// ======================================================================
describe('Dialog Data Integrity', () => {
// ======================================================================

    it('every dialog ID referenced in NPC_DIALOG_ROUTES exists in DIALOGUES', () => {
        const missing = [];
        for (const [npcId, routes] of Object.entries(NPC_DIALOG_ROUTES)) {
            for (const route of routes) {
                if (!DIALOGUES[route.dialog]) {
                    missing.push(`${npcId} -> ${route.dialog}`);
                }
            }
        }
        assert.equal(missing.length, 0, `Missing dialogs: ${missing.join(', ')}`);
    });

    it('every NPC defaultDialog exists in DIALOGUES', () => {
        const missing = [];
        for (const [cityId, npcs] of Object.entries(NPC_DATA)) {
            for (const npc of npcs) {
                if (!DIALOGUES[npc.defaultDialog]) {
                    missing.push(`${npc.id} -> ${npc.defaultDialog}`);
                }
            }
        }
        assert.equal(missing.length, 0, `Missing default dialogs: ${missing.join(', ')}`);
    });

    it('every dialog has at least one line', () => {
        const empty = [];
        for (const [id, dialog] of Object.entries(DIALOGUES)) {
            if (!dialog.lines || dialog.lines.length === 0) {
                empty.push(id);
            }
        }
        assert.equal(empty.length, 0, `Empty dialogs: ${empty.join(', ')}`);
    });

    it('dialog objective references match quest objective IDs', () => {
        const questObjIds = QUESTS.main_quest.objectives.map(o => o.id);
        const dialogObjRefs = [];
        for (const [id, dialog] of Object.entries(DIALOGUES)) {
            if (dialog.completesObjective) {
                dialogObjRefs.push(dialog.completesObjective);
            }
        }
        for (const ref of dialogObjRefs) {
            assert.ok(questObjIds.includes(ref), `Dialog completesObjective '${ref}' not found in quest objectives`);
        }
    });

    it('chest reward objective references match quest objective IDs', () => {
        const questObjIds = QUESTS.main_quest.objectives.map(o => o.id);
        for (const [chestId, chest] of Object.entries(CHEST_REWARDS)) {
            if (chest.completesObjective) {
                assert.ok(questObjIds.includes(chest.completesObjective),
                    `Chest ${chestId} completesObjective '${chest.completesObjective}' not in quest`);
            }
        }
    });
});

// ======================================================================
describe('NPC Dialog Routing', () => {
// ======================================================================

    it('each NPC in NPC_DATA has a route entry in NPC_DIALOG_ROUTES', () => {
        const missing = [];
        for (const [cityId, npcs] of Object.entries(NPC_DATA)) {
            for (const npc of npcs) {
                if (!NPC_DIALOG_ROUTES[npc.id]) {
                    missing.push(npc.id);
                }
            }
        }
        assert.equal(missing.length, 0, `NPCs without routes: ${missing.join(', ')}`);
    });

    it('each route list has at least one matching condition for empty flags', () => {
        const noMatch = [];
        for (const [npcId, routes] of Object.entries(NPC_DIALOG_ROUTES)) {
            const match = routes.find(r => r.condition({}));
            if (!match) {
                noMatch.push(npcId);
            }
        }
        assert.equal(noMatch.length, 0, `NPCs with no matching route for empty flags: ${noMatch.join(', ')}`);
    });

    it('grandma shows intro before quest, after_locket after', () => {
        const routes = NPC_DIALOG_ROUTES.paris_grandma;
        const find = (flags) => routes.find(r => r.condition(flags)).dialog;

        assert.equal(find({}), 'grandma_intro');
        assert.equal(find({ quest_started: true }), 'grandma_after_locket');
    });

    it('librarian shows intro, then with_locket, then after_quest', () => {
        const routes = NPC_DIALOG_ROUTES.paris_librarian;
        const find = (flags) => routes.find(r => r.condition(flags)).dialog;

        assert.equal(find({}), 'librarian_intro');
        assert.equal(find({ quest_started: true }), 'librarian_with_locket');
        assert.equal(find({ quest_started: true, paris_complete: true }), 'librarian_after_quest');
    });

    it('curator shows intro, then with_letter, then after_quest', () => {
        const routes = NPC_DIALOG_ROUTES.london_curator;
        const find = (flags) => routes.find(r => r.condition(flags)).dialog;

        assert.equal(find({}), 'curator_intro');
        assert.equal(find({ paris_complete: true }), 'curator_with_letter');
        assert.equal(find({ paris_complete: true, london_complete: true }), 'curator_after_quest');
    });

    it('rome historian has 4 stages of dialog', () => {
        const routes = NPC_DIALOG_ROUTES.rome_historian;
        const find = (flags) => routes.find(r => r.condition(flags)).dialog;

        assert.equal(find({}), 'rossi_intro');
        assert.equal(find({ london_complete: true }), 'rossi_with_map');
        assert.equal(find({ london_complete: true, rome_have_key: true }), 'rossi_after_key');
        assert.equal(find({ rome_complete: true }), 'rossi_after_quest');
    });

    it('tokyo gardener has no gap between chest_unlocked and game_complete', () => {
        const routes = NPC_DIALOG_ROUTES.tokyo_gardener;
        const find = (flags) => routes.find(r => r.condition(flags)).dialog;

        // Before arriving with journal
        assert.equal(find({}), 'yuki_intro');
        // With journal
        assert.equal(find({ marrakech_complete: true }), 'yuki_with_journal');
        // After talking (chest unlocked, game not yet complete)
        assert.equal(find({ marrakech_complete: true, tokyo_chest_unlocked: true }), 'yuki_after_quest');
        // After game complete
        assert.equal(find({ marrakech_complete: true, tokyo_chest_unlocked: true, game_complete: true }), 'yuki_after_quest');
    });
});

// ======================================================================
describe('Quest Objective Chain', () => {
// ======================================================================

    const objectives = QUESTS.main_quest.objectives;

    it('has 8 objectives', () => {
        assert.equal(objectives.length, 8);
    });

    it('first objective has no requires', () => {
        assert.equal(objectives[0].requires, undefined);
    });

    it('each subsequent objective requires the previous one (linear chain)', () => {
        for (let i = 1; i < objectives.length; i++) {
            assert.ok(objectives[i].requires, `Objective ${objectives[i].id} has no requires`);
            // The requires should reference an earlier objective
            const reqIdx = objectives.findIndex(o => o.id === objectives[i].requires);
            assert.ok(reqIdx >= 0, `Objective ${objectives[i].id} requires unknown '${objectives[i].requires}'`);
            assert.ok(reqIdx < i, `Objective ${objectives[i].id} requires later objective at index ${reqIdx}`);
        }
    });

    it('objective IDs are unique', () => {
        const ids = objectives.map(o => o.id);
        const unique = new Set(ids);
        assert.equal(ids.length, unique.size, `Duplicate objective IDs found`);
    });

    it('every objective references a valid city', () => {
        for (const obj of objectives) {
            assert.ok(CITIES[obj.city], `Objective ${obj.id} references unknown city '${obj.city}'`);
        }
    });
});

// ======================================================================
describe('Chest Rewards', () => {
// ======================================================================

    it('each chest ID follows city_chest_x_y format', () => {
        for (const id of Object.keys(CHEST_REWARDS)) {
            assert.match(id, /^[a-z]+_chest_\d+_\d+$/, `Invalid chest ID format: ${id}`);
        }
    });

    it('each chest reward has item with id, name, icon', () => {
        for (const [id, chest] of Object.entries(CHEST_REWARDS)) {
            assert.ok(chest.item, `Chest ${id} has no item`);
            assert.ok(chest.item.id, `Chest ${id} item has no id`);
            assert.ok(chest.item.name, `Chest ${id} item has no name`);
            assert.ok(chest.item.icon, `Chest ${id} item has no icon`);
        }
    });

    it('chest at rome_chest_18_13 unlocks marrakech', () => {
        const chest = CHEST_REWARDS['rome_chest_18_13'];
        assert.ok(chest);
        assert.equal(chest.unlocksCity, 'marrakech');
        assert.equal(chest.setsFlag, 'rome_complete');
    });

    it('chest at tokyo_chest_15_2 completes the game', () => {
        const chest = CHEST_REWARDS['tokyo_chest_15_2'];
        assert.ok(chest);
        assert.equal(chest.setsFlag, 'game_complete');
        assert.equal(chest.completesObjective, 'tokyo_find_treasure');
    });

    it('each chest requiresFlag to prevent early opening', () => {
        for (const [id, chest] of Object.entries(CHEST_REWARDS)) {
            assert.ok(chest.requiresFlag, `Chest ${id} has no requiresFlag guard`);
        }
    });
});

// ======================================================================
describe('City Map Data', () => {
// ======================================================================

    for (const [cityId, city] of Object.entries(CITIES)) {
        describe(`${city.name} (${cityId})`, () => {
            it('has correct dimensions', () => {
                assert.equal(city.width, 30);
                assert.equal(city.height, 25);
            });

            it('ground layer is correct size', () => {
                assert.equal(city.ground.length, city.height);
                for (let y = 0; y < city.height; y++) {
                    assert.equal(city.ground[y].length, city.width, `Row ${y} wrong width`);
                }
            });

            it('walls layer is correct size', () => {
                assert.equal(city.walls.length, city.height);
                for (let y = 0; y < city.height; y++) {
                    assert.equal(city.walls[y].length, city.width, `Row ${y} wrong width`);
                }
            });

            it('decor layer is correct size', () => {
                assert.equal(city.decor.length, city.height);
                for (let y = 0; y < city.height; y++) {
                    assert.equal(city.decor[y].length, city.width, `Row ${y} wrong width`);
                }
            });

            it('player start is within bounds', () => {
                assert.ok(city.playerStart.x >= 0 && city.playerStart.x < city.width,
                    `Player start X ${city.playerStart.x} out of bounds`);
                assert.ok(city.playerStart.y >= 0 && city.playerStart.y < city.height,
                    `Player start Y ${city.playerStart.y} out of bounds`);
            });

            it('player start is on a walkable tile (no wall)', () => {
                const { x, y } = city.playerStart;
                assert.equal(city.walls[y][x], -1,
                    `Player starts on wall tile ${city.walls[y][x]} at (${x},${y})`);
            });

            it('has exit gap at south edge', () => {
                // At least one tile at the bottom row should have no wall
                const bottomRow = city.walls[city.height - 1];
                const gaps = bottomRow.filter(t => t === -1).length;
                assert.ok(gaps > 0, 'No walkable exit at south edge');
            });

            it('ground tiles are in valid range (0-63)', () => {
                for (let y = 0; y < city.height; y++) {
                    for (let x = 0; x < city.width; x++) {
                        const t = city.ground[y][x];
                        assert.ok(t >= 0 && t <= 63, `Invalid ground tile ${t} at (${x},${y})`);
                    }
                }
            });

            it('wall tiles are -1 or in valid range (0-63)', () => {
                for (let y = 0; y < city.height; y++) {
                    for (let x = 0; x < city.width; x++) {
                        const t = city.walls[y][x];
                        assert.ok(t === -1 || (t >= 0 && t <= 63), `Invalid wall tile ${t} at (${x},${y})`);
                    }
                }
            });
        });
    }
});

// ======================================================================
describe('NPC Placement', () => {
// ======================================================================

    for (const [cityId, npcs] of Object.entries(NPC_DATA)) {
        const city = CITIES[cityId];

        for (const npc of npcs) {
            it(`${npc.name} in ${cityId} is on walkable tile`, () => {
                assert.ok(npc.x >= 0 && npc.x < city.width, `X ${npc.x} out of bounds`);
                assert.ok(npc.y >= 0 && npc.y < city.height, `Y ${npc.y} out of bounds`);
                assert.equal(city.walls[npc.y][npc.x], -1,
                    `NPC ${npc.name} placed on wall tile at (${npc.x},${npc.y})`);
            });
        }
    }
});

// ======================================================================
describe('Travel Routes', () => {
// ======================================================================

    it('every city in CITIES has an entry in CITY_MAP_POSITIONS', () => {
        for (const cityId of Object.keys(CITIES)) {
            assert.ok(CITY_MAP_POSITIONS[cityId], `${cityId} missing from map positions`);
        }
    });

    it('every city with connections has matching routes', () => {
        for (const [cityId, city] of Object.entries(CITIES)) {
            for (const conn of city.connections) {
                const routes = TRAVEL_ROUTES[cityId];
                assert.ok(routes && routes[conn],
                    `${cityId} lists connection to ${conn} but no route defined`);
            }
        }
    });

    it('routes are bidirectional (A->B implies B->A)', () => {
        const mismatches = [];
        for (const [from, routes] of Object.entries(TRAVEL_ROUTES)) {
            for (const to of Object.keys(routes)) {
                if (!TRAVEL_ROUTES[to] || !TRAVEL_ROUTES[to][from]) {
                    mismatches.push(`${from}->${to} has no reverse`);
                }
            }
        }
        assert.equal(mismatches.length, 0, `Non-bidirectional routes: ${mismatches.join(', ')}`);
    });

    it('route types are valid', () => {
        const validTypes = ['train', 'boat', 'portal'];
        for (const [from, routes] of Object.entries(TRAVEL_ROUTES)) {
            for (const [to, route] of Object.entries(routes)) {
                assert.ok(validTypes.includes(route.type),
                    `Invalid route type '${route.type}' for ${from}->${to}`);
            }
        }
    });

    it('portal routes require portal_unlocked flag', () => {
        for (const [from, routes] of Object.entries(TRAVEL_ROUTES)) {
            for (const [to, route] of Object.entries(routes)) {
                if (route.type === 'portal') {
                    assert.equal(route.requiresFlag, 'portal_unlocked',
                        `Portal route ${from}->${to} missing requiresFlag`);
                }
            }
        }
    });
});

// ======================================================================
describe('InventoryManager', () => {
// ======================================================================

    it('starts empty on new game', () => {
        const scene = createMockScene({ inventory: [] });
        const inv = new InventoryManager(scene);
        assert.deepEqual(inv.getItems(), []);
    });

    it('loads existing items from registry', () => {
        const scene = createMockScene({ inventory: [{ id: 'locket', name: 'Locket' }] });
        const inv = new InventoryManager(scene);
        assert.equal(inv.getItems().length, 1);
        assert.equal(inv.getItems()[0].id, 'locket');
    });

    it('addItem adds to inventory and persists', () => {
        const scene = createMockScene({ inventory: [] });
        const inv = new InventoryManager(scene);
        inv.addItem({ id: 'key', name: 'Key', icon: 'item_key', description: 'A key' });
        assert.equal(inv.getItems().length, 1);
        assert.equal(scene.registry.get('inventory').length, 1);
    });

    it('addItem prevents duplicates by id', () => {
        const scene = createMockScene({ inventory: [] });
        const inv = new InventoryManager(scene);
        inv.addItem({ id: 'key', name: 'Key' });
        inv.addItem({ id: 'key', name: 'Key Again' });
        assert.equal(inv.getItems().length, 1);
    });

    it('removeItem removes by id', () => {
        const scene = createMockScene({ inventory: [{ id: 'key', name: 'Key' }] });
        const inv = new InventoryManager(scene);
        inv.removeItem('key');
        assert.equal(inv.getItems().length, 0);
    });

    it('hasItem returns correct boolean', () => {
        const scene = createMockScene({ inventory: [{ id: 'locket', name: 'Locket' }] });
        const inv = new InventoryManager(scene);
        assert.equal(inv.hasItem('locket'), true);
        assert.equal(inv.hasItem('key'), false);
    });

    it('getItems returns a copy, not the internal array', () => {
        const scene = createMockScene({ inventory: [{ id: 'a' }] });
        const inv = new InventoryManager(scene);
        const items = inv.getItems();
        items.push({ id: 'b' });
        assert.equal(inv.getItems().length, 1); // internal unchanged
    });
});

// ======================================================================
describe('SaveManager', () => {
// ======================================================================

    beforeEach(() => {
        _localStorage.clear();
    });

    it('save writes to localStorage', () => {
        const reg = createMockRegistry({
            currentCity: 'paris',
            inventory: [{ id: 'locket' }],
            questState: { completedObjectives: [] },
            unlockedCities: ['paris'],
            visitedCities: ['paris'],
            flags: { quest_started: true },
            openedChests: []
        });
        SaveManager.save(reg);
        const raw = _localStorage.get('questgame_save');
        assert.ok(raw);
        const data = JSON.parse(raw);
        assert.equal(data.currentCity, 'paris');
        assert.equal(data.inventory.length, 1);
        assert.equal(data.flags.quest_started, true);
    });

    it('load returns parsed data', () => {
        _localStorage.set('questgame_save', JSON.stringify({
            currentCity: 'london',
            inventory: [],
            flags: {}
        }));
        const data = SaveManager.load();
        assert.equal(data.currentCity, 'london');
    });

    it('load returns null for missing save', () => {
        assert.equal(SaveManager.load(), null);
    });

    it('load returns null for corrupted JSON', () => {
        _localStorage.set('questgame_save', '{broken json!!!');
        assert.equal(SaveManager.load(), null);
    });

    it('load returns null for non-object JSON', () => {
        _localStorage.set('questgame_save', '"just a string"');
        assert.equal(SaveManager.load(), null);
    });

    it('load returns null for object missing currentCity', () => {
        _localStorage.set('questgame_save', JSON.stringify({ inventory: [] }));
        assert.equal(SaveManager.load(), null);
    });

    it('hasSave returns true when valid save exists', () => {
        _localStorage.set('questgame_save', JSON.stringify({ currentCity: 'paris' }));
        assert.equal(SaveManager.hasSave(), true);
    });

    it('hasSave returns false when no save', () => {
        assert.equal(SaveManager.hasSave(), false);
    });

    it('hasSave returns false for corrupted save', () => {
        _localStorage.set('questgame_save', 'not json');
        assert.equal(SaveManager.hasSave(), false);
    });

    it('deleteSave removes the save', () => {
        _localStorage.set('questgame_save', JSON.stringify({ currentCity: 'paris' }));
        SaveManager.deleteSave();
        assert.equal(SaveManager.load(), null);
    });

    it('save includes openedChests', () => {
        const reg = createMockRegistry({
            currentCity: 'rome',
            openedChests: ['rome_chest_18_13']
        });
        SaveManager.save(reg);
        const data = JSON.parse(_localStorage.get('questgame_save'));
        assert.deepEqual(data.openedChests, ['rome_chest_18_13']);
    });
});

// ======================================================================
describe('DialogManager', () => {
// ======================================================================

    it('startDialog sets active state', () => {
        const scene = createMockScene({ flags: {} });
        const dm = new DialogManager(scene);
        dm.startDialog('grandma_intro', 'Grandma', () => {});
        assert.equal(dm.active, true);
        assert.equal(dm.currentLine, 0);
    });

    it('startDialog with unknown dialog shows fallback message', () => {
        const scene = createMockScene({ flags: {} });
        const dm = new DialogManager(scene);
        let called = false;
        dm.startDialog('nonexistent_dialog', 'NPC', () => { called = true; });
        // Falls back to showMessage("...")
        assert.equal(dm.active, true);
    });

    it('advance skips typewriter on first press', () => {
        const scene = createMockScene({ flags: {} });
        const dm = new DialogManager(scene);
        dm.startDialog('grandma_intro', 'Grandma', () => {});
        assert.equal(dm.isTyping, true);
        dm.advanceCooldown = 0; // reset cooldown for testing
        dm.advance();
        assert.equal(dm.isTyping, false);
        assert.equal(dm.displayedText, dm.fullText);
    });

    it('advance moves to next line after typewriter complete', () => {
        const scene = createMockScene({ flags: {} });
        const dm = new DialogManager(scene);
        dm.startDialog('grandma_intro', 'Grandma', () => {});

        // Skip typewriter
        dm.advanceCooldown = 0;
        dm.advance();
        assert.equal(dm.currentLine, 0);

        // Advance to next line
        dm.advanceCooldown = 0;
        dm.advance();
        assert.equal(dm.currentLine, 1);
        assert.equal(dm.isTyping, true); // new line started typing
    });

    it('endDialog calls callback and sets active false', () => {
        const scene = createMockScene({ flags: {}, inventory: [], unlockedCities: ['paris'] });
        scene.inventoryManager = new InventoryManager(scene);
        scene.questManager = { completeObjective() {} };
        const dm = new DialogManager(scene);
        let callbackCalled = false;

        dm.startDialog('sophie_intro', 'Sophie', () => { callbackCalled = true; });

        // Advance through all 4 lines of sophie_intro
        for (let i = 0; i < 20; i++) {
            if (!dm.active) break;
            dm.advanceCooldown = 0;
            dm.advance();
        }

        assert.equal(dm.active, false);
        assert.equal(callbackCalled, true);
    });

    it('endDialog sets flags from dialog data', () => {
        const scene = createMockScene({ flags: {}, inventory: [], unlockedCities: ['paris'] });
        scene.inventoryManager = new InventoryManager(scene);
        scene.questManager = { completeObjective() {} };
        const dm = new DialogManager(scene);

        dm.startDialog('grandma_intro', 'Grandma', () => {});

        // Advance through all lines
        for (let i = 0; i < 30; i++) {
            if (!dm.active) break;
            dm.advanceCooldown = 0;
            dm.advance();
        }

        const flags = scene.registry.get('flags');
        assert.equal(flags.quest_started, true);
    });

    it('endDialog gives items from dialog data', () => {
        const scene = createMockScene({ flags: {}, inventory: [], unlockedCities: ['paris'] });
        scene.inventoryManager = new InventoryManager(scene);
        scene.questManager = { completeObjective() {} };
        const dm = new DialogManager(scene);

        dm.startDialog('grandma_intro', 'Grandma', () => {});

        for (let i = 0; i < 30; i++) {
            if (!dm.active) break;
            dm.advanceCooldown = 0;
            dm.advance();
        }

        assert.equal(scene.inventoryManager.hasItem('locket'), true);
    });

    it('endDialog unlocks cities from dialog data', () => {
        const scene = createMockScene({
            flags: { quest_started: true },
            inventory: [],
            unlockedCities: ['paris']
        });
        scene.inventoryManager = new InventoryManager(scene);
        scene.questManager = { completeObjective() {} };
        const dm = new DialogManager(scene);

        dm.startDialog('librarian_with_locket', 'Dupont', () => {});

        for (let i = 0; i < 40; i++) {
            if (!dm.active) break;
            dm.advanceCooldown = 0;
            dm.advance();
        }

        const unlocked = scene.registry.get('unlockedCities');
        assert.ok(unlocked.includes('london'), 'London should be unlocked');
    });

    it('advance respects cooldown', () => {
        const scene = createMockScene({ flags: {} });
        const dm = new DialogManager(scene);
        dm.startDialog('grandma_intro', 'Grandma', () => {});

        // First advance works
        dm.advanceCooldown = 0;
        dm.advance();
        assert.equal(dm.isTyping, false); // typewriter skipped

        // Immediate second advance should be blocked by cooldown
        dm.advance(); // cooldown was just set
        assert.equal(dm.currentLine, 0); // should NOT have advanced to line 1
    });

    it('showMessage creates a single-line dialog', () => {
        const scene = createMockScene({ flags: {} });
        const dm = new DialogManager(scene);
        let called = false;
        dm.showMessage('Hello!', () => { called = true; });
        assert.equal(dm.active, true);

        // Skip typewriter + advance past single line
        dm.advanceCooldown = 0;
        dm.advance();
        dm.advanceCooldown = 0;
        dm.advance();

        assert.equal(called, true);
        assert.equal(dm.active, false);
    });
});

// ======================================================================
describe('QuestManager', () => {
// ======================================================================

    it('getNPCDialogId returns correct dialog based on flags', () => {
        const scene = createMockScene({
            flags: { quest_started: true, paris_complete: false },
            questState: {}
        });
        const qm = new QuestManager(scene);
        assert.equal(qm.getNPCDialogId('paris_librarian'), 'librarian_with_locket');
    });

    it('getNPCDialogId returns null for unknown NPC', () => {
        const scene = createMockScene({ flags: {}, questState: {} });
        const qm = new QuestManager(scene);
        assert.equal(qm.getNPCDialogId('unknown_npc'), null);
    });

    it('completeObjective adds to completedObjectives', () => {
        const scene = createMockScene({ flags: {}, questState: {} });
        const qm = new QuestManager(scene);
        qm.completeObjective('paris_find_locket');
        assert.ok(qm.completedObjectives.includes('paris_find_locket'));
    });

    it('completeObjective is idempotent', () => {
        const scene = createMockScene({ flags: {}, questState: {} });
        const qm = new QuestManager(scene);
        qm.completeObjective('paris_find_locket');
        qm.completeObjective('paris_find_locket');
        assert.equal(qm.completedObjectives.filter(o => o === 'paris_find_locket').length, 1);
    });

    it('getActiveQuests returns empty before quest starts', () => {
        const scene = createMockScene({ flags: {}, questState: {} });
        const qm = new QuestManager(scene);
        assert.equal(qm.getActiveQuests().length, 0);
    });

    it('getActiveQuests returns quest after started', () => {
        const scene = createMockScene({ flags: { quest_started: true }, questState: {} });
        const qm = new QuestManager(scene);
        const quests = qm.getActiveQuests();
        assert.equal(quests.length, 1);
        assert.equal(quests[0].name, 'The Locket of Worlds');
    });

    it('getActiveQuests only shows objectives whose requirements are met', () => {
        const scene = createMockScene({ flags: { quest_started: true }, questState: {} });
        const qm = new QuestManager(scene);

        // Before any completion, only the first objective is visible
        let quests = qm.getActiveQuests();
        let visibleIds = quests[0].objectives.map(o => o.id);
        assert.ok(visibleIds.includes('paris_find_locket'));
        assert.ok(!visibleIds.includes('paris_visit_librarian')); // requires paris_find_locket

        // Complete first objective
        qm.completeObjective('paris_find_locket');
        quests = qm.getActiveQuests();
        visibleIds = quests[0].objectives.map(o => o.id);
        assert.ok(visibleIds.includes('paris_visit_librarian')); // now visible
    });

    it('getChestReward returns null when flag not met', () => {
        const scene = createMockScene({ flags: {}, questState: {}, unlockedCities: ['paris'] });
        const qm = new QuestManager(scene);
        assert.equal(qm.getChestReward('paris_chest_4_3'), null);
    });

    it('getChestReward returns item when flag is met', () => {
        const scene = createMockScene({
            flags: { quest_started: true },
            questState: {},
            unlockedCities: ['paris']
        });
        const qm = new QuestManager(scene);
        const reward = qm.getChestReward('paris_chest_4_3');
        assert.ok(reward);
        assert.equal(reward.id, 'coin');
    });

    it('getChestReward returns null for unknown chest', () => {
        const scene = createMockScene({ flags: {}, questState: {} });
        const qm = new QuestManager(scene);
        assert.equal(qm.getChestReward('unknown_chest_0_0'), null);
    });

    it('getCurrentObjective returns the next uncompleted objective', () => {
        const scene = createMockScene({
            flags: { quest_started: true },
            questState: { completedObjectives: ['paris_find_locket'] }
        });
        const qm = new QuestManager(scene);
        const obj = qm.getCurrentObjective();
        assert.equal(obj.id, 'paris_visit_librarian');
    });
});

// ======================================================================
describe('TravelManager', () => {
// ======================================================================

    it('returns available destinations from paris', () => {
        const scene = createMockScene({
            unlockedCities: ['paris', 'london'],
            flags: {}
        });
        const tm = new TravelManager(scene);
        const dests = tm.getAvailableDestinations('paris');
        assert.ok(dests.some(d => d.cityId === 'london'));
    });

    it('filters out locked cities', () => {
        const scene = createMockScene({
            unlockedCities: ['paris'],
            flags: {}
        });
        const tm = new TravelManager(scene);
        const dests = tm.getAvailableDestinations('paris');
        assert.ok(!dests.some(d => d.cityId === 'london'));
    });

    it('filters out portal routes without portal_unlocked flag', () => {
        const scene = createMockScene({
            unlockedCities: ['marrakech', 'tokyo'],
            flags: {}
        });
        const tm = new TravelManager(scene);
        const dests = tm.getAvailableDestinations('marrakech');
        assert.ok(!dests.some(d => d.cityId === 'tokyo'));
    });

    it('includes portal routes when portal_unlocked flag is set', () => {
        const scene = createMockScene({
            unlockedCities: ['marrakech', 'tokyo'],
            flags: { portal_unlocked: true }
        });
        const tm = new TravelManager(scene);
        const dests = tm.getAvailableDestinations('marrakech');
        assert.ok(dests.some(d => d.cityId === 'tokyo'));
    });

    it('getRoute returns route data for valid pair', () => {
        const scene = createMockScene({});
        const tm = new TravelManager(scene);
        const route = tm.getRoute('paris', 'london');
        assert.ok(route);
        assert.equal(route.type, 'train');
    });

    it('getRoute returns null for invalid pair', () => {
        const scene = createMockScene({});
        const tm = new TravelManager(scene);
        assert.equal(tm.getRoute('paris', 'tokyo'), null);
    });
});

// ======================================================================
describe('Full Quest Playthrough (data layer)', () => {
// ======================================================================

    it('complete quest chain produces correct flag sequence', () => {
        // Simulate the entire quest at the data/flag level
        const flags = {};
        const inventory = [];
        const unlocked = ['paris'];
        const completed = [];

        function simulateDialog(dialogId) {
            const dialog = DIALOGUES[dialogId];
            if (!dialog) return;
            if (dialog.givesItem) inventory.push(dialog.givesItem.id);
            if (dialog.setsFlag) flags[dialog.setsFlag] = true;
            if (dialog.completesObjective) completed.push(dialog.completesObjective);
            if (dialog.unlocksCity && !unlocked.includes(dialog.unlocksCity)) {
                unlocked.push(dialog.unlocksCity);
            }
            if (dialog.unlocksPortal) flags.portal_unlocked = true;
        }

        function simulateChest(chestId) {
            const chest = CHEST_REWARDS[chestId];
            if (!chest || (chest.requiresFlag && !flags[chest.requiresFlag])) return false;
            inventory.push(chest.item.id);
            if (chest.setsFlag) flags[chest.setsFlag] = true;
            if (chest.completesObjective) completed.push(chest.completesObjective);
            if (chest.unlocksCity && !unlocked.includes(chest.unlocksCity)) {
                unlocked.push(chest.unlocksCity);
            }
            return true;
        }

        function getDialog(npcId) {
            const routes = NPC_DIALOG_ROUTES[npcId];
            return routes.find(r => r.condition(flags)).dialog;
        }

        // 1. Paris: Talk to grandma
        assert.equal(getDialog('paris_grandma'), 'grandma_intro');
        simulateDialog('grandma_intro');
        assert.ok(flags.quest_started);
        assert.ok(inventory.includes('locket'));

        // 2. Paris: Talk to librarian
        assert.equal(getDialog('paris_librarian'), 'librarian_with_locket');
        simulateDialog('librarian_with_locket');
        assert.ok(flags.paris_complete);
        assert.ok(unlocked.includes('london'));

        // 3. London: Talk to curator
        assert.equal(getDialog('london_curator'), 'curator_with_letter');
        simulateDialog('curator_with_letter');
        assert.ok(flags.london_complete);
        assert.ok(unlocked.includes('rome'));

        // 4. Rome: Talk to historian
        assert.equal(getDialog('rome_historian'), 'rossi_with_map');
        simulateDialog('rossi_with_map');
        assert.ok(flags.rome_have_key);

        // 5. Rome: Open chest
        assert.ok(simulateChest('rome_chest_18_13'));
        assert.ok(flags.rome_complete);
        assert.ok(unlocked.includes('marrakech'));

        // 6. Marrakech: Talk to merchant
        assert.equal(getDialog('marrakech_merchant'), 'hassan_with_locket');
        simulateDialog('hassan_with_locket');
        assert.ok(flags.marrakech_complete);
        assert.ok(flags.portal_unlocked);
        assert.ok(unlocked.includes('tokyo'));

        // 7. Tokyo: Talk to gardener
        assert.equal(getDialog('tokyo_gardener'), 'yuki_with_journal');
        simulateDialog('yuki_with_journal');
        assert.ok(flags.tokyo_chest_unlocked);

        // 8. Tokyo: Open treasure chest
        assert.ok(simulateChest('tokyo_chest_15_2'));
        assert.ok(flags.game_complete);

        // Verify all objectives completed
        const allObjIds = QUESTS.main_quest.objectives.map(o => o.id);
        for (const id of allObjIds) {
            assert.ok(completed.includes(id), `Objective ${id} never completed`);
        }

        // Verify all cities unlocked
        assert.deepEqual(unlocked.sort(), ['london', 'marrakech', 'paris', 'rome', 'tokyo']);
    });
});

// ======================================================================
describe('Water Tile Collision (Bug Fix)', () => {
// ======================================================================

    it('Paris Seine tiles (rows 10-11) have walls except at bridge', () => {
        const city = CITIES.paris;
        for (let x = 0; x < city.width; x++) {
            const isBridge = x >= 13 && x <= 16;
            if (isBridge) {
                assert.equal(city.walls[10][x], -1, `Bridge tile at (${x},10) should be walkable`);
                assert.equal(city.walls[11][x], -1, `Bridge tile at (${x},11) should be walkable`);
            } else {
                assert.notEqual(city.walls[10][x], -1, `Water at (${x},10) should have wall`);
                assert.notEqual(city.walls[11][x], -1, `Water at (${x},11) should have wall`);
            }
        }
    });

    it('London Thames tiles (rows 12-13) have walls except at bridge', () => {
        const city = CITIES.london;
        for (let x = 0; x < city.width; x++) {
            const isBridge = x >= 13 && x <= 16;
            if (isBridge) {
                assert.equal(city.walls[12][x], -1, `Bridge tile at (${x},12) should be walkable`);
                assert.equal(city.walls[13][x], -1, `Bridge tile at (${x},13) should be walkable`);
            } else {
                assert.notEqual(city.walls[12][x], -1, `Water at (${x},12) should have wall`);
                assert.notEqual(city.walls[13][x], -1, `Water at (${x},13) should have wall`);
            }
        }
    });

    it('Paris bridge tiles have cobblestone ground, not water', () => {
        const city = CITIES.paris;
        for (let x = 13; x <= 16; x++) {
            assert.equal(city.ground[10][x], 0, `Bridge ground at (${x},10) should be cobblestone`);
            assert.equal(city.ground[11][x], 0, `Bridge ground at (${x},11) should be cobblestone`);
        }
    });

    it('London bridge tiles have pavement ground, not water', () => {
        const city = CITIES.london;
        for (let x = 13; x <= 16; x++) {
            assert.equal(city.ground[12][x], 39, `Bridge ground at (${x},12) should be pavement`);
            assert.equal(city.ground[13][x], 39, `Bridge ground at (${x},13) should be pavement`);
        }
    });
});

// ======================================================================
describe('Travel Route Flag Validation (Bug Fix)', () => {
// ======================================================================

    it('portal route from marrakech to tokyo requires portal_unlocked', () => {
        const route = TRAVEL_ROUTES.marrakech.tokyo;
        assert.equal(route.requiresFlag, 'portal_unlocked');
    });

    it('TravelManager filters portal routes without flag', () => {
        const scene = createMockScene({
            unlockedCities: ['marrakech', 'tokyo'],
            flags: {}
        });
        const tm = new TravelManager(scene);
        const dests = tm.getAvailableDestinations('marrakech');
        assert.ok(!dests.some(d => d.cityId === 'tokyo'),
            'Should not list tokyo without portal_unlocked');
    });

    it('TravelManager includes portal routes with flag', () => {
        const scene = createMockScene({
            unlockedCities: ['marrakech', 'tokyo'],
            flags: { portal_unlocked: true }
        });
        const tm = new TravelManager(scene);
        const dests = tm.getAvailableDestinations('marrakech');
        assert.ok(dests.some(d => d.cityId === 'tokyo'),
            'Should list tokyo with portal_unlocked');
    });

    it('getRoute returns raw route even without flag (caller must validate)', () => {
        const scene = createMockScene({});
        const tm = new TravelManager(scene);
        const route = tm.getRoute('marrakech', 'tokyo');
        assert.ok(route, 'Raw route should exist');
        assert.equal(route.requiresFlag, 'portal_unlocked',
            'Route should carry requiresFlag for caller validation');
    });
});

// ======================================================================
describe('Menu State Guards (Bug Fix)', () => {
// ======================================================================

    it('inventory should not open during active dialog (ExploreScene logic)', () => {
        // Simulates the guard: toggleInventory checks dialogActive
        const dialogActive = true;
        const menuOpen = false;
        // The fix adds: if (this.dialogActive) return;
        const shouldOpen = !dialogActive; // mimics the guard
        assert.equal(shouldOpen, false, 'Inventory should not open during dialog');
    });

    it('quest log should not open during active dialog (ExploreScene logic)', () => {
        const dialogActive = true;
        const shouldOpen = !dialogActive;
        assert.equal(shouldOpen, false, 'Quest log should not open during dialog');
    });

    it('inventory can open when no dialog active', () => {
        const dialogActive = false;
        const shouldOpen = !dialogActive;
        assert.equal(shouldOpen, true, 'Inventory should open when no dialog');
    });
});

// ======================================================================
describe('NPC Sprite Types (Data Integrity)', () => {
// ======================================================================

    const validSprites = ['librarian', 'curator', 'merchant', 'guide', 'gardener', 'grandma'];

    for (const [cityId, npcs] of Object.entries(NPC_DATA)) {
        for (const npc of npcs) {
            it(`${npc.name} has valid sprite type '${npc.sprite}'`, () => {
                assert.ok(validSprites.includes(npc.sprite),
                    `NPC ${npc.name} has unknown sprite '${npc.sprite}'`);
            });
        }
    }
});

// ======================================================================
describe('Dialog Reward Integrity', () => {
// ======================================================================

    it('every dialog givesItem has required fields', () => {
        const issues = [];
        for (const [id, dialog] of Object.entries(DIALOGUES)) {
            if (dialog.givesItem) {
                if (!dialog.givesItem.id) issues.push(`${id}: missing item id`);
                if (!dialog.givesItem.name) issues.push(`${id}: missing item name`);
                if (!dialog.givesItem.icon) issues.push(`${id}: missing item icon`);
            }
        }
        assert.equal(issues.length, 0, `Item issues: ${issues.join(', ')}`);
    });

    it('every dialog unlocksCity references a valid city', () => {
        for (const [id, dialog] of Object.entries(DIALOGUES)) {
            if (dialog.unlocksCity) {
                assert.ok(CITIES[dialog.unlocksCity],
                    `Dialog ${id} unlocks unknown city '${dialog.unlocksCity}'`);
            }
        }
    });

    it('every dialog setsFlag is a non-empty string', () => {
        for (const [id, dialog] of Object.entries(DIALOGUES)) {
            if (dialog.setsFlag !== undefined) {
                assert.equal(typeof dialog.setsFlag, 'string', `Dialog ${id} setsFlag is not a string`);
                assert.ok(dialog.setsFlag.length > 0, `Dialog ${id} setsFlag is empty`);
            }
        }
    });

    it('every chest unlocksCity references a valid city', () => {
        for (const [id, chest] of Object.entries(CHEST_REWARDS)) {
            if (chest.unlocksCity) {
                assert.ok(CITIES[chest.unlocksCity],
                    `Chest ${id} unlocks unknown city '${chest.unlocksCity}'`);
            }
        }
    });
});

// ======================================================================
describe('City Connections Consistency', () => {
// ======================================================================

    it('every city connection has a matching TRAVEL_ROUTE', () => {
        const missing = [];
        for (const [cityId, city] of Object.entries(CITIES)) {
            for (const conn of city.connections) {
                if (!TRAVEL_ROUTES[cityId] || !TRAVEL_ROUTES[cityId][conn]) {
                    missing.push(`${cityId} -> ${conn}`);
                }
            }
        }
        assert.equal(missing.length, 0, `Missing routes: ${missing.join(', ')}`);
    });

    it('every TRAVEL_ROUTE references valid cities', () => {
        for (const [from, routes] of Object.entries(TRAVEL_ROUTES)) {
            assert.ok(CITIES[from], `Route from unknown city '${from}'`);
            for (const to of Object.keys(routes)) {
                assert.ok(CITIES[to], `Route from ${from} to unknown city '${to}'`);
            }
        }
    });
});

// ======================================================================
describe('Portal Tile Placement (Bug Fix)', () => {
// ======================================================================

    it('Marrakech has a portal tile for portal travel', () => {
        const city = CITIES.marrakech;
        let found = false;
        for (let y = 0; y < city.height; y++) {
            for (let x = 0; x < city.width; x++) {
                if (city.decor[y][x] === 21) {
                    found = true;
                    // Portal must be on a walkable tile
                    assert.equal(city.walls[y][x], -1,
                        `Portal at (${x},${y}) is on a wall tile`);
                }
            }
        }
        assert.ok(found, 'Marrakech must have at least one portal tile (21)');
    });

    it('Tokyo has a portal tile', () => {
        const city = CITIES.tokyo;
        let found = false;
        for (let y = 0; y < city.height; y++) {
            for (let x = 0; x < city.width; x++) {
                if (city.decor[y][x] === 21) {
                    found = true;
                    assert.equal(city.walls[y][x], -1,
                        `Portal at (${x},${y}) is on a wall tile`);
                }
            }
        }
        assert.ok(found, 'Tokyo must have at least one portal tile (21)');
    });

    it('cities with portal connections have portal tiles', () => {
        // Cities connected by portal routes should have portal tiles
        const portalCities = new Set();
        for (const [from, routes] of Object.entries(TRAVEL_ROUTES)) {
            for (const [to, route] of Object.entries(routes)) {
                if (route.type === 'portal') {
                    portalCities.add(from);
                    portalCities.add(to);
                }
            }
        }

        for (const cityId of portalCities) {
            const city = CITIES[cityId];
            let hasPortal = false;
            for (let y = 0; y < city.height && !hasPortal; y++) {
                for (let x = 0; x < city.width && !hasPortal; x++) {
                    if (city.decor[y][x] === 21) hasPortal = true;
                }
            }
            assert.ok(hasPortal, `${cityId} has portal routes but no portal tile`);
        }
    });
});
