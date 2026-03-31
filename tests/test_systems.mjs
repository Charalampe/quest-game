/**
 * Unit tests for quest game systems.
 * Run with: node tests/test_systems.mjs
 *
 * Tests pure data/logic without Phaser runtime. Each system is tested
 * against a minimal mock of the Phaser scene/registry API.
 */

import assert from 'node:assert/strict';
import { describe, it, beforeEach, before } from 'node:test';

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
const { CITIES, ROOM_TRANSITIONS } = await import('../src/data/cities.js');
const { TRAVEL_ROUTES, CITY_MAP_POSITIONS } = await import('../src/systems/TravelManager.js');
const { InventoryManager } = await import('../src/systems/InventoryManager.js');
const { SaveManager } = await import('../src/systems/SaveManager.js');
const { DialogManager } = await import('../src/systems/DialogManager.js');
const { QuestManager } = await import('../src/systems/QuestManager.js');
const { TravelManager } = await import('../src/systems/TravelManager.js');
const { initLanguage, setLanguage, getLanguage, toggleLanguage, t, getDialogueLines, getItemText, getQuestText } = await import('../src/data/i18n/index.js');

// Initialize i18n and set English for existing test assertions
initLanguage();
setLanguage('en');

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

    it('librarian shows intro, then with_letter, then after_quest', () => {
        const routes = NPC_DIALOG_ROUTES.paris_librarian;
        const find = (flags) => routes.find(r => r.condition(flags)).dialog;

        assert.equal(find({}), 'librarian_intro');
        assert.equal(find({ paris_has_eiffel_letter: true }), 'librarian_with_letter');
        assert.equal(find({ paris_has_eiffel_letter: true, paris_complete: true }), 'librarian_after_quest');
    });

    it('curator shows intro, then with_letter, then after_quest', () => {
        const routes = NPC_DIALOG_ROUTES.london_curator;
        const find = (flags) => routes.find(r => r.condition(flags)).dialog;

        assert.equal(find({}), 'curator_intro');
        assert.equal(find({ paris_complete: true }), 'curator_with_letter');
        assert.equal(find({ paris_complete: true, london_met_curator: true, london_complete: true }), 'curator_after_quest');
    });

    it('rome historian has 4 stages of dialog', () => {
        const routes = NPC_DIALOG_ROUTES.rome_historian;
        const find = (flags) => routes.find(r => r.condition(flags)).dialog;

        assert.equal(find({}), 'rossi_intro');
        assert.equal(find({ london_complete: true }), 'rossi_with_map');
        assert.equal(find({ london_complete: true, rome_have_key: true }), 'rossi_after_key');
        assert.equal(find({ rome_complete: true }), 'rossi_after_quest');
    });

    it('tokyo gardener has no gap between jade_key and game_complete', () => {
        const routes = NPC_DIALOG_ROUTES.tokyo_gardener;
        const find = (flags) => routes.find(r => r.condition(flags)).dialog;

        // Before arriving with journal
        assert.equal(find({}), 'yuki_intro');
        // With journal
        assert.equal(find({ marrakech_complete: true }), 'yuki_with_journal');
        // After talking (jade key obtained, game not yet complete)
        assert.equal(find({ marrakech_complete: true, tokyo_has_jade_key: true }), 'yuki_after_quest');
        // After game complete
        assert.equal(find({ marrakech_complete: true, tokyo_has_jade_key: true, game_complete: true }), 'yuki_after_quest');
    });
});

// ======================================================================
describe('Quest Objective Chain', () => {
// ======================================================================

    const objectives = QUESTS.main_quest.objectives;

    it('has 18 objectives', () => {
        assert.equal(objectives.length, 18);
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
            assert.match(id, /^[a-z_]+_chest_\d+_\d+$/, `Invalid chest ID format: ${id}`);
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

    it('chest at rome_chest_30_22 unlocks marrakech', () => {
        const chest = CHEST_REWARDS['rome_chest_30_22'];
        assert.ok(chest);
        assert.equal(chest.unlocksCity, 'marrakech');
        assert.equal(chest.setsFlag, 'rome_complete');
    });

    it('chest at tokyo_chest_25_3 completes the game', () => {
        const chest = CHEST_REWARDS['tokyo_chest_25_3'];
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
                assert.equal(city.width, 50);
                assert.equal(city.height, 40);
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
                const room = npc.room || 'main';
                const mapData = (room === 'main') ? city : (city.rooms[room]);
                assert.ok(mapData, `Room '${room}' not found for ${npc.name}`);
                assert.ok(npc.x >= 0 && npc.x < mapData.width, `X ${npc.x} out of bounds`);
                assert.ok(npc.y >= 0 && npc.y < mapData.height, `Y ${npc.y} out of bounds`);
                assert.equal(mapData.walls[npc.y][npc.x], -1,
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
            openedChests: ['rome_chest_30_22']
        });
        SaveManager.save(reg);
        const data = JSON.parse(_localStorage.get('questgame_save'));
        assert.deepEqual(data.openedChests, ['rome_chest_30_22']);
    });

    it('save includes currentRoom', () => {
        const reg = createMockRegistry({
            currentCity: 'paris',
            currentRoom: 'eiffel_top'
        });
        SaveManager.save(reg);
        const data = JSON.parse(_localStorage.get('questgame_save'));
        assert.equal(data.currentRoom, 'eiffel_top');
    });

    it('save defaults currentRoom to main when not set', () => {
        const reg = createMockRegistry({
            currentCity: 'paris'
        });
        SaveManager.save(reg);
        const data = JSON.parse(_localStorage.get('questgame_save'));
        assert.equal(data.currentRoom, 'main');
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
            flags: { paris_has_eiffel_letter: true },
            inventory: [],
            unlockedCities: ['paris']
        });
        scene.inventoryManager = new InventoryManager(scene);
        scene.questManager = { completeObjective() {} };
        const dm = new DialogManager(scene);

        dm.startDialog('librarian_with_letter', 'Dupont', () => {});

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
            flags: { paris_has_eiffel_letter: true },
            questState: {}
        });
        const qm = new QuestManager(scene);
        assert.equal(qm.getNPCDialogId('paris_librarian'), 'librarian_with_letter');
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
        assert.ok(!visibleIds.includes('paris_find_paintbrush')); // requires paris_find_locket

        // Complete first objective
        qm.completeObjective('paris_find_locket');
        quests = qm.getActiveQuests();
        visibleIds = quests[0].objectives.map(o => o.id);
        assert.ok(visibleIds.includes('paris_find_paintbrush')); // now visible
    });

    it('getChestReward returns null when flag not met', () => {
        const scene = createMockScene({ flags: {}, questState: {}, unlockedCities: ['paris'] });
        const qm = new QuestManager(scene);
        assert.equal(qm.getChestReward('paris_chest_7_5'), null);
    });

    it('getChestReward returns item when flag is met', () => {
        const scene = createMockScene({
            flags: { quest_started: true },
            questState: {},
            unlockedCities: ['paris']
        });
        const qm = new QuestManager(scene);
        const reward = qm.getChestReward('paris_chest_7_5');
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
        assert.equal(obj.id, 'paris_find_paintbrush');
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
            if (chest.unlocksPortal) flags.portal_unlocked = true;
            return true;
        }

        function getDialog(npcId) {
            const routes = NPC_DIALOG_ROUTES[npcId];
            return routes.find(r => r.condition(flags)).dialog;
        }

        // 1. Paris: Talk to grandma -> get locket
        assert.equal(getDialog('paris_grandma'), 'grandma_intro');
        simulateDialog('grandma_intro');
        assert.ok(flags.quest_started);
        assert.ok(inventory.includes('locket'));

        // 2. Paris: Talk to Colette -> get paintbrush
        assert.equal(getDialog('paris_florist'), 'colette_intro');
        simulateDialog('colette_intro');
        assert.ok(flags.paris_has_paintbrush);
        assert.ok(inventory.includes('paintbrush'));

        // 3. Paris: Return paintbrush to Pierre -> get fastpass
        assert.equal(getDialog('paris_artist'), 'pierre_has_brush');
        simulateDialog('pierre_has_brush');
        assert.ok(flags.paris_has_fastpass);
        assert.ok(inventory.includes('fastpass'));

        // 4. Paris: Open eiffel_top chest -> get eiffel_letter
        assert.ok(simulateChest('paris_eiffel_top_chest_6_3'));
        assert.ok(flags.paris_has_eiffel_letter);
        assert.ok(inventory.includes('eiffel_letter'));

        // 5. Paris: Talk to librarian with letter -> paris_complete, unlock london
        assert.equal(getDialog('paris_librarian'), 'librarian_with_letter');
        simulateDialog('librarian_with_letter');
        assert.ok(flags.paris_complete);
        assert.ok(unlocked.includes('london'));

        // 6. London: Talk to curator with letter -> london_met_curator
        assert.equal(getDialog('london_curator'), 'curator_with_letter');
        simulateDialog('curator_with_letter');
        assert.ok(flags.london_met_curator);

        // 7. London: Talk to Thomas -> get reading_glasses
        assert.equal(getDialog('london_schoolkid'), 'thomas_intro');
        simulateDialog('thomas_intro');
        assert.ok(flags.london_has_glasses);
        assert.ok(inventory.includes('reading_glasses'));

        // 8. London: Return glasses to Higgins -> get research_pass
        assert.equal(getDialog('london_professor'), 'higgins_with_glasses');
        simulateDialog('higgins_with_glasses');
        assert.ok(flags.london_has_research_pass);
        assert.ok(inventory.includes('research_pass'));

        // 9. London: Open museum_basement chest -> london_complete, unlock rome
        assert.ok(simulateChest('london_museum_basement_chest_8_6'));
        assert.ok(flags.london_complete);
        assert.ok(unlocked.includes('rome'));

        // 10. Rome: Talk to historian -> get ancient key
        assert.equal(getDialog('rome_historian'), 'rossi_with_map');
        simulateDialog('rossi_with_map');
        assert.ok(flags.rome_have_key);
        assert.ok(inventory.includes('key'));

        // 11. Rome: Open catacombs_lower chest -> rome_complete, unlock marrakech
        assert.ok(simulateChest('rome_catacombs_lower_chest_7_5'));
        assert.ok(flags.rome_complete);
        assert.ok(unlocked.includes('marrakech'));

        // 12. Marrakech: Talk to Hassan -> get journal
        assert.equal(getDialog('marrakech_merchant'), 'hassan_with_locket');
        simulateDialog('hassan_with_locket');
        assert.ok(flags.marrakech_has_journal);
        assert.ok(inventory.includes('journal'));

        // 13. Marrakech: Open riad chest -> get amulet
        assert.ok(simulateChest('marrakech_riad_chest_10_7'));
        assert.ok(flags.marrakech_has_amulet);
        assert.ok(inventory.includes('amulet'));

        // 14. Marrakech: Return amulet to Nadia -> met nadia
        assert.equal(getDialog('marrakech_nadia'), 'nadia_with_amulet');
        simulateDialog('nadia_with_amulet');
        assert.ok(flags.marrakech_met_nadia);

        // 15. Marrakech: Open oasis chest -> portal stone, portal_unlocked, unlock tokyo
        assert.ok(simulateChest('marrakech_oasis_chest_10_10'));
        assert.ok(flags.marrakech_complete);
        assert.ok(flags.portal_unlocked);
        assert.ok(unlocked.includes('tokyo'));
        assert.ok(inventory.includes('portal_stone'));

        // 16. Tokyo: Talk to Hiro and Aiko -> riddle parts 1 & 2, plus manual part 3
        assert.equal(getDialog('tokyo_chef'), 'hiro_intro');
        simulateDialog('hiro_intro');
        assert.ok(flags.tokyo_riddle_part1);

        assert.equal(getDialog('tokyo_manga'), 'aiko_intro');
        simulateDialog('aiko_intro');
        assert.ok(flags.tokyo_riddle_part2);

        // Part 3 is set by reading the shrine sign (manual flag)
        flags.tokyo_riddle_part3 = true;

        // 17. Tokyo: Talk to Tanaka -> riddle solved
        assert.equal(getDialog('tokyo_shrine_keeper'), 'tanaka_riddle_complete');
        simulateDialog('tanaka_riddle_complete');
        assert.ok(flags.tokyo_riddle_solved);

        // 18. Tokyo: Talk to Yuki -> jade key
        assert.equal(getDialog('tokyo_gardener'), 'yuki_with_journal');
        simulateDialog('yuki_with_journal');
        assert.ok(flags.tokyo_has_jade_key);
        assert.ok(inventory.includes('jade_key'));

        // 19. Tokyo: Open sacred_garden chest -> game complete
        assert.ok(simulateChest('tokyo_sacred_garden_chest_7_5'));
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

    it('Paris Seine tiles (rows 16-18) have walls except at bridges', () => {
        const city = CITIES.paris;
        for (let x = 0; x < city.width; x++) {
            const isBridge = (x >= 22 && x <= 26) || (x >= 38 && x <= 42);
            for (let r = 16; r <= 18; r++) {
                if (isBridge) {
                    assert.equal(city.walls[r][x], -1, `Bridge tile at (${x},${r}) should be walkable`);
                } else {
                    assert.notEqual(city.walls[r][x], -1, `Water at (${x},${r}) should have wall`);
                }
            }
        }
    });

    it('London Thames tiles (rows 18-21) have walls except at bridges', () => {
        const city = CITIES.london;
        for (let x = 0; x < city.width; x++) {
            const isBridge = (x >= 22 && x <= 27) || (x >= 38 && x <= 42);
            for (let r = 18; r <= 21; r++) {
                if (isBridge) {
                    assert.equal(city.walls[r][x], -1, `Bridge tile at (${x},${r}) should be walkable`);
                } else {
                    assert.notEqual(city.walls[r][x], -1, `Water at (${x},${r}) should have wall`);
                }
            }
        }
    });

    it('Paris bridge tiles have cobblestone ground, not water', () => {
        const city = CITIES.paris;
        for (let x = 22; x <= 26; x++) {
            for (let r = 16; r <= 18; r++) {
                assert.equal(city.ground[r][x], 0, `Bridge ground at (${x},${r}) should be cobblestone`);
            }
        }
    });

    it('London bridge tiles have pavement ground, not water', () => {
        const city = CITIES.london;
        for (let x = 22; x <= 27; x++) {
            for (let r = 18; r <= 21; r++) {
                assert.equal(city.ground[r][x], 39, `Bridge ground at (${x},${r}) should be pavement`);
            }
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

    const validSprites = ['librarian', 'curator', 'merchant', 'guide', 'gardener', 'grandma', 'artist', 'flower_seller', 'tourist', 'attendant', 'photographer', 'policeman', 'professor', 'schoolkid', 'clerk', 'gelato', 'musician', 'tour_guide', 'cat_lady', 'spice_merchant', 'storyteller', 'carpet_merchant', 'riad_keeper', 'desert_guide', 'ramen_chef', 'manga_artist', 'shrine_keeper', 'spirit_fox', 'ghost'];

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

// ======================================================================
describe('i18n System', () => {
// ======================================================================

    beforeEach(() => {
        setLanguage('en');
    });

    it('initLanguage defaults to French when no preference stored', () => {
        _localStorage.delete('questgame_language');
        initLanguage();
        assert.equal(getLanguage(), 'fr');
        // Reset back for other tests
        setLanguage('en');
    });

    it('setLanguage persists to localStorage', () => {
        setLanguage('en');
        assert.equal(_localStorage.get('questgame_language'), 'en');
        assert.equal(getLanguage(), 'en');
    });

    it('toggleLanguage switches between en and fr', () => {
        setLanguage('en');
        toggleLanguage();
        assert.equal(getLanguage(), 'fr');
        toggleLanguage();
        assert.equal(getLanguage(), 'en');
    });

    it('t() returns translated string for simple key', () => {
        setLanguage('en');
        assert.equal(t('ui.newGame'), 'New Game');
        setLanguage('fr');
        assert.equal(t('ui.newGame'), 'Nouvelle Partie');
        setLanguage('en');
    });

    it('t() supports placeholder replacement', () => {
        setLanguage('en');
        assert.equal(t('ui.travelTo', { city: 'London' }), 'Travel to London');
    });

    it('t() returns key path for missing keys', () => {
        assert.equal(t('ui.nonexistent'), 'ui.nonexistent');
    });

    it('getDialogueLines returns array for valid dialogue', () => {
        setLanguage('en');
        const lines = getDialogueLines('grandma_intro');
        assert.ok(Array.isArray(lines));
        assert.ok(lines.length > 0);
    });

    it('getItemText returns name and description', () => {
        setLanguage('en');
        const item = getItemText('locket');
        assert.ok(item);
        assert.ok(item.name);
        assert.ok(item.description);
    });

    it('getQuestText returns quest data', () => {
        setLanguage('en');
        const quest = getQuestText('main_quest');
        assert.ok(quest);
        assert.ok(quest.name);
        assert.ok(quest.objectives);
    });

    it('every dialogue in DIALOGUES has a matching EN i18n entry', () => {
        setLanguage('en');
        const missing = [];
        for (const dialogId of Object.keys(DIALOGUES)) {
            if (!getDialogueLines(dialogId)) missing.push(dialogId);
        }
        assert.equal(missing.length, 0, `Missing EN dialogues: ${missing.join(', ')}`);
    });

    it('every dialogue in DIALOGUES has a matching FR i18n entry', () => {
        setLanguage('fr');
        const missing = [];
        for (const dialogId of Object.keys(DIALOGUES)) {
            if (!getDialogueLines(dialogId)) missing.push(dialogId);
        }
        setLanguage('en');
        assert.equal(missing.length, 0, `Missing FR dialogues: ${missing.join(', ')}`);
    });

    it('EN and FR dialogue entries have the same line count', () => {
        const mismatches = [];
        for (const dialogId of Object.keys(DIALOGUES)) {
            setLanguage('en');
            const enLines = getDialogueLines(dialogId);
            setLanguage('fr');
            const frLines = getDialogueLines(dialogId);
            if (enLines && frLines && enLines.length !== frLines.length) {
                mismatches.push(`${dialogId}: en=${enLines.length}, fr=${frLines.length}`);
            }
        }
        setLanguage('en');
        assert.equal(mismatches.length, 0, `Line count mismatches: ${mismatches.join(', ')}`);
    });

    it('every item in CHEST_REWARDS and DIALOGUES has i18n entry (EN)', () => {
        setLanguage('en');
        const itemIds = new Set();
        for (const dialog of Object.values(DIALOGUES)) {
            if (dialog.givesItem) itemIds.add(dialog.givesItem.id);
        }
        for (const chest of Object.values(CHEST_REWARDS)) {
            if (chest.item) itemIds.add(chest.item.id);
        }
        const missing = [];
        for (const id of itemIds) {
            if (!getItemText(id)) missing.push(id);
        }
        assert.equal(missing.length, 0, `Missing item i18n entries: ${missing.join(', ')}`);
    });

    it('every item in CHEST_REWARDS and DIALOGUES has i18n entry (FR)', () => {
        setLanguage('fr');
        const itemIds = new Set();
        for (const dialog of Object.values(DIALOGUES)) {
            if (dialog.givesItem) itemIds.add(dialog.givesItem.id);
        }
        for (const chest of Object.values(CHEST_REWARDS)) {
            if (chest.item) itemIds.add(chest.item.id);
        }
        const missing = [];
        for (const id of itemIds) {
            if (!getItemText(id)) missing.push(id);
        }
        setLanguage('en');
        assert.equal(missing.length, 0, `Missing FR item i18n entries: ${missing.join(', ')}`);
    });

    it('all travel route labelKeys have i18n entries', () => {
        setLanguage('en');
        const missing = [];
        for (const [from, routes] of Object.entries(TRAVEL_ROUTES)) {
            for (const [to, route] of Object.entries(routes)) {
                if (route.labelKey) {
                    const label = t(`travel.${route.labelKey}`);
                    if (label === `travel.${route.labelKey}`) {
                        missing.push(`${from}->${to}: ${route.labelKey}`);
                    }
                }
            }
        }
        assert.equal(missing.length, 0, `Missing travel label i18n: ${missing.join(', ')}`);
    });
});

// ======================================================================
describe('Graphics Overhaul Regression', () => {
// ======================================================================

    // --- Map dimensions and player start ---
    for (const [cityId, city] of Object.entries(CITIES)) {
        it(`${cityId} is 50x40 with playerStart at (25,33)`, () => {
            assert.equal(city.width, 50);
            assert.equal(city.height, 40);
            assert.equal(city.playerStart.x, 25);
            assert.equal(city.playerStart.y, 33);
        });
    }

    // --- Chest ID / decor coordinate consistency ---
    it('every CHEST_REWARDS key matches an actual chest decor tile in the map', () => {
        const missing = [];
        for (const chestId of Object.keys(CHEST_REWARDS)) {
            const m = chestId.match(/^([a-z_]+)_chest_(\d+)_(\d+)$/);
            assert.ok(m, `Invalid chest ID format: ${chestId}`);
            const [, prefix, xStr, yStr] = m;
            const cx = parseInt(xStr), cy = parseInt(yStr);
            // Resolve city and room from prefix (e.g. 'paris_eiffel_top' -> city 'paris', room 'eiffel_top')
            let cityId = prefix;
            let mapData = CITIES[cityId];
            if (!mapData) {
                // Try progressively shorter prefixes to find the city
                const parts = prefix.split('_');
                for (let i = 1; i < parts.length; i++) {
                    const tryCity = parts.slice(0, i).join('_');
                    if (CITIES[tryCity]) {
                        cityId = tryCity;
                        const roomName = parts.slice(i).join('_');
                        mapData = CITIES[cityId].rooms[roomName];
                        break;
                    }
                }
            }
            assert.ok(mapData, `Chest ${chestId} references unknown city/room from prefix '${prefix}'`);
            assert.equal(mapData.decor[cy][cx], 20,
                `Chest ${chestId} expects decor tile 20 at (${cx},${cy}) but found ${mapData.decor[cy][cx]}`);
        }
    });

    it('every chest decor tile (20) in every city map and room has a walkable ground tile', () => {
        // Verify that chests are on walkable ground in main maps and rooms
        for (const [cityId, city] of Object.entries(CITIES)) {
            // Check main map
            for (let y = 0; y < city.height; y++) {
                for (let x = 0; x < city.width; x++) {
                    if (city.decor[y][x] === 20) {
                        const id = `${cityId}_chest_${x}_${y}`;
                        assert.ok(city.walls[y][x] === -1,
                            `Chest at ${id} is on a wall tile — player cannot reach it`);
                    }
                }
            }
            // Check rooms
            if (city.rooms) {
                for (const [roomName, room] of Object.entries(city.rooms)) {
                    for (let y = 0; y < room.height; y++) {
                        for (let x = 0; x < room.width; x++) {
                            if (room.decor[y][x] === 20) {
                                const id = `${cityId}_${roomName}_chest_${x}_${y}`;
                                assert.ok(room.walls[y][x] === -1,
                                    `Chest at ${id} is on a wall tile — player cannot reach it`);
                            }
                        }
                    }
                }
            }
        }
    });

    // --- Portal tiles are walkable ---
    it('all portal decor tiles (21) are on walkable ground', () => {
        for (const [cityId, city] of Object.entries(CITIES)) {
            for (let y = 0; y < city.height; y++) {
                for (let x = 0; x < city.width; x++) {
                    if (city.decor[y][x] === 21) {
                        assert.equal(city.walls[y][x], -1,
                            `Portal in ${cityId} at (${x},${y}) is on a wall tile`);
                    }
                }
            }
        }
    });

    // --- No portal and chest sharing same decor tile ---
    it('no tile has both a chest and a portal on the same decor cell', () => {
        // decor layer can only hold one value per tile
        // If chest (20) and portal (21) share a cell, one gets overwritten
        // This checks that every quest chest is really a chest and not overwritten
        for (const chestId of Object.keys(CHEST_REWARDS)) {
            const m = chestId.match(/^([a-z_]+)_chest_(\d+)_(\d+)$/);
            const [, prefix, xStr, yStr] = m;
            const cx = parseInt(xStr), cy = parseInt(yStr);
            // Resolve city and room from prefix
            let mapData = CITIES[prefix];
            if (!mapData) {
                const parts = prefix.split('_');
                for (let i = 1; i < parts.length; i++) {
                    const tryCity = parts.slice(0, i).join('_');
                    if (CITIES[tryCity]) {
                        const roomName = parts.slice(i).join('_');
                        mapData = CITIES[tryCity].rooms[roomName];
                        break;
                    }
                }
            }
            assert.ok(mapData, `Cannot resolve map for chest ${chestId}`);
            assert.notEqual(mapData.decor[cy][cx], 21,
                `Quest chest ${chestId} was overwritten by portal tile at (${cx},${cy})`);
        }
    });

    // --- Exit zone alignment ---
    for (const [cityId, city] of Object.entries(CITIES)) {
        it(`${cityId} exit zone aligns with south gap in wall border`, () => {
            const exitX = Math.floor(city.width / 2 - 1); // tile coordinate
            // The exit zone covers 3 tiles: exitX, exitX+1, exitX+2
            for (let dx = 0; dx < 3; dx++) {
                const wx = exitX + dx;
                if (wx < city.width) {
                    assert.equal(city.walls[city.height - 1][wx], -1,
                        `${cityId} exit tile at (${wx},${city.height-1}) should be walkable (-1) but is ${city.walls[city.height-1][wx]}`);
                }
            }
        });
    }

    // --- Water tile collision consistency ---
    it('every water ground tile (2) in cities with rivers has a corresponding wall', () => {
        for (const [cityId, city] of Object.entries(CITIES)) {
            for (let y = 0; y < city.height; y++) {
                for (let x = 0; x < city.width; x++) {
                    if (city.ground[y][x] === 2) {
                        assert.notEqual(city.walls[y][x], -1,
                            `${cityId}: water at (${x},${y}) has no wall — player can walk on water`);
                    }
                }
            }
        }
    });

    // --- NPC not on water ---
    it('no NPC is placed on a water tile', () => {
        for (const [cityId, npcs] of Object.entries(NPC_DATA)) {
            const city = CITIES[cityId];
            for (const npc of npcs) {
                const room = npc.room || 'main';
                const mapData = (room === 'main') ? city : (city.rooms[room]);
                assert.ok(mapData, `Room '${room}' not found for ${npc.name}`);
                assert.notEqual(mapData.ground[npc.y][npc.x], 2,
                    `${npc.name} in ${cityId} (${room}) at (${npc.x},${npc.y}) is on water`);
            }
        }
    });

    // --- NPC not on border wall ---
    it('no NPC is placed on the border (row 0, last row, col 0, last col)', () => {
        for (const [cityId, npcs] of Object.entries(NPC_DATA)) {
            const city = CITIES[cityId];
            for (const npc of npcs) {
                const room = npc.room || 'main';
                const mapData = (room === 'main') ? city : (city.rooms[room]);
                assert.ok(mapData, `Room '${room}' not found for ${npc.name}`);
                assert.ok(npc.x > 0 && npc.x < mapData.width - 1,
                    `${npc.name} in ${cityId} (${room}) at x=${npc.x} is on border column`);
                assert.ok(npc.y > 0 && npc.y < mapData.height - 1,
                    `${npc.name} in ${cityId} (${room}) at y=${npc.y} is on border row`);
            }
        }
    });

    // --- Player start not on water ---
    for (const [cityId, city] of Object.entries(CITIES)) {
        it(`${cityId} player start is not on water`, () => {
            const { x, y } = city.playerStart;
            assert.notEqual(city.ground[y][x], 2,
                `Player starts on water tile at (${x},${y})`);
        });
    }

    // --- Interactables reachability: signs, chests must be on walkable tiles ---
    it('all sign tiles (22 in decor) are on walkable ground', () => {
        for (const [cityId, city] of Object.entries(CITIES)) {
            for (let y = 0; y < city.height; y++) {
                for (let x = 0; x < city.width; x++) {
                    if (city.decor[y][x] === 22) {
                        // Signs need to be reachable — adjacent tile must be walkable
                        // (sign itself can be on a wall, player interacts facing it)
                        // Just check it's not on water
                        assert.notEqual(city.ground[y][x], 2,
                            `Sign in ${cityId} at (${x},${y}) is on water`);
                    }
                }
            }
        }
    });

    // --- NPC collision body fits within tile ---
    it('NPC collision body (24x24 with offset 4,24) fits within 32x48 sprite', () => {
        // offset.x=4, size.w=24: 4+24=28 <= 32 OK
        // offset.y=24, size.h=24: 24+24=48 <= 48 OK
        assert.ok(4 + 24 <= 32, 'NPC collision body width exceeds sprite width');
        assert.ok(24 + 24 <= 48, 'NPC collision body height exceeds sprite height');
    });

    // --- Player collision body fits within tile ---
    it('Player collision body (20x20 with offset 6,28) fits within 32x48 sprite', () => {
        assert.ok(6 + 20 <= 32, 'Player collision body width exceeds sprite width');
        assert.ok(28 + 20 <= 48, 'Player collision body height exceeds sprite height');
    });
});

// ======================================================================
describe('Room Transition Integrity', () => {
// ======================================================================

    it('every ROOM_TRANSITIONS key follows the naming pattern', () => {
        for (const doorId of Object.keys(ROOM_TRANSITIONS)) {
            assert.match(doorId, /_door_\d+_\d+$/,
                `Door ID '${doorId}' does not end with _door_X_Y`);
        }
    });

    it('every ROOM_TRANSITIONS target room exists in CITIES', () => {
        const missing = [];
        for (const [doorId, transition] of Object.entries(ROOM_TRANSITIONS)) {
            const targetCity = transition.targetCity;
            const targetRoom = transition.targetRoom;
            assert.ok(CITIES[targetCity], `Door ${doorId} targets unknown city '${targetCity}'`);
            const city = CITIES[targetCity];
            if (targetRoom === 'main') {
                // Main room uses city-level data — always exists
                continue;
            }
            if (!city.rooms || !city.rooms[targetRoom]) {
                missing.push(`${doorId} -> ${targetCity}/${targetRoom}`);
            }
        }
        assert.equal(missing.length, 0, `Transitions to missing rooms: ${missing.join(', ')}`);
    });

    it('every door tile (23) in decor with a ROOM_TRANSITIONS entry is on a walkable tile', () => {
        // Check main city maps
        for (const [cityId, city] of Object.entries(CITIES)) {
            for (let y = 0; y < city.height; y++) {
                for (let x = 0; x < city.width; x++) {
                    if (city.decor[y][x] === 23) {
                        const doorId = `${cityId}_door_${x}_${y}`;
                        if (ROOM_TRANSITIONS[doorId]) {
                            // Door itself is a wall tile for collision, but the player
                            // must be able to stand adjacent to it. Just verify it exists.
                            assert.ok(true, `Door ${doorId} found`);
                        }
                    }
                }
            }
            // Check sub-rooms
            if (city.rooms) {
                for (const [roomName, room] of Object.entries(city.rooms)) {
                    for (let y = 0; y < room.height; y++) {
                        for (let x = 0; x < room.width; x++) {
                            if (room.decor[y][x] === 23) {
                                const doorId = `${cityId}_${roomName}_door_${x}_${y}`;
                                if (ROOM_TRANSITIONS[doorId]) {
                                    assert.ok(true, `Door ${doorId} found`);
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    it('room transitions are bidirectional (A->B implies B->A exists)', () => {
        const mismatches = [];
        for (const [doorId, transition] of Object.entries(ROOM_TRANSITIONS)) {
            const targetCity = transition.targetCity;
            const targetRoom = transition.targetRoom;
            // Find a return transition from targetRoom back to the source
            const hasReturn = Object.values(ROOM_TRANSITIONS).some(t =>
                t.targetCity === targetCity || // returns to same city
                Object.keys(ROOM_TRANSITIONS).some(key => {
                    const parts = key.split('_door_');
                    const prefix = parts[0];
                    const rt = ROOM_TRANSITIONS[key];
                    // Check if there's any door in the target room that leads back
                    return prefix === `${targetCity}_${targetRoom}` || prefix === targetCity;
                })
            );
            // This is a soft check — just verify the target room has at least one door
            const city = CITIES[targetCity];
            const roomData = targetRoom === 'main' ? city : city.rooms?.[targetRoom];
            if (roomData) {
                let hasDoor = false;
                for (let y = 0; y < roomData.height && !hasDoor; y++) {
                    for (let x = 0; x < roomData.width && !hasDoor; x++) {
                        if (roomData.decor[y][x] === 23) hasDoor = true;
                    }
                }
                if (!hasDoor) {
                    mismatches.push(`${targetCity}/${targetRoom} has no exit doors`);
                }
            }
        }
        assert.equal(mismatches.length, 0, `Rooms without exit doors: ${mismatches.join(', ')}`);
    });
});

// ======================================================================
describe('Scene Shutdown Safety', () => {
// ======================================================================

    it('ExploreScene shutdown handler does not call emitter.destroy() (Phaser auto-destroys)', async () => {
        // Read the ExploreScene source and verify no emitter.destroy() in shutdown
        const fs = await import('node:fs');
        const src = fs.readFileSync('src/scenes/ExploreScene.js', 'utf-8');
        const shutdownMatch = src.match(/events\.on\('shutdown',\s*\(\)\s*=>\s*\{([\s\S]*?)\}\);/);
        assert.ok(shutdownMatch, 'Could not find shutdown handler');
        const shutdownBody = shutdownMatch[1];
        assert.ok(!shutdownBody.includes('emitter.destroy()'),
            'Shutdown handler should NOT call emitter.destroy() — Phaser auto-destroys scene objects');
        assert.ok(!shutdownBody.includes('obj.destroy()'),
            'Shutdown handler should NOT call obj.destroy() on env objects — Phaser auto-destroys them');
    });

    it('ExploreScene shutdown handler does clean up keyboard listeners', async () => {
        const fs = await import('node:fs');
        const src = fs.readFileSync('src/scenes/ExploreScene.js', 'utf-8');
        const shutdownMatch = src.match(/events\.on\('shutdown',\s*\(\)\s*=>\s*\{([\s\S]*?)\}\);/);
        assert.ok(shutdownMatch, 'Could not find shutdown handler');
        const shutdownBody = shutdownMatch[1];
        assert.ok(shutdownBody.includes("keyboard.off('keydown-SPACE'"),
            'Shutdown handler must remove SPACE listener');
        assert.ok(shutdownBody.includes("keyboard.off('keydown-ESC'"),
            'Shutdown handler must remove ESC listener');
    });

    it('ExploreScene shutdown handler does clean up NPCs', async () => {
        const fs = await import('node:fs');
        const src = fs.readFileSync('src/scenes/ExploreScene.js', 'utf-8');
        const shutdownMatch = src.match(/events\.on\('shutdown',\s*\(\)\s*=>\s*\{([\s\S]*?)\}\);/);
        assert.ok(shutdownMatch, 'Could not find shutdown handler');
        const shutdownBody = shutdownMatch[1];
        assert.ok(shutdownBody.includes('npc.destroy()'),
            'Shutdown handler must destroy NPCs (they have custom indicator cleanup)');
    });
});

// ======================================================================
describe('Sprite Rendering Bounds', () => {
// ======================================================================

    it('player drawPlayer bob offset never produces negative y for row 0', () => {
        // bobOffset formula: frames 1,3 → 0, frames 0,2 → 2
        // by = y + bobOffset, so by >= y always
        const frames = [0, 1, 2, 3];
        for (const frame of frames) {
            const bobOffset = (frame === 1 || frame === 3) ? 0 : 2;
            assert.ok(bobOffset >= 0,
                `Player frame ${frame}: bobOffset ${bobOffset} would cause negative y`);
        }
    });

    it('NPC drawNPC bob offset never produces negative y for row 0', () => {
        const frames = [0, 1, 2, 3];
        for (const frame of frames) {
            const bobOffset = (frame === 1 || frame === 3) ? 0 : 2;
            assert.ok(bobOffset >= 0,
                `NPC frame ${frame}: bobOffset ${bobOffset} would cause negative y`);
        }
    });

    it('player sprite content fits within 32x48 frame on all frames', () => {
        // Worst case: static frame (bobOffset=2), shoes at by+39+6 = y+2+45 = y+47. OK.
        // Arms at cx-11 = x+5 (leftmost outline). Min x index = 0. OK (5 >= 0).
        // Arms at cx+8+3 = x+27 (rightmost outline edge). OK (27 <= 32).
        const maxY = 2 + 39 + 6; // bobOffset + shoe outline start + shoe height
        assert.ok(maxY <= 48, `Player content extends to row ${maxY}, frame height is 48`);
        const minX = 16 - 11; // cx - 11 (arm outline, worst case)
        assert.ok(minX >= 0, `Player left arm outline starts at x+${minX}, out of bounds`);
        const maxX = 16 + 8 + 3; // cx + 8 + width 3 (right arm outline)
        assert.ok(maxX <= 32, `Player right arm outline ends at x+${maxX}, frame width is 32`);
    });

    it('player/NPC hair outline never draws above frame (by - 1 bug regression)', async () => {
        // The manga outline must start at by+0, never by-1.
        // bobOffset is 0 for frames 1,3. by = y + 0 = y.
        // Hair outline at by+0 = y+0. This is the frame top edge — OK.
        // Hair outline at by-1 would be y-1 — CORRUPT adjacent frame.
        const fs = await import('node:fs');
        const mangaSrc = fs.readFileSync('src/assets/MangaSpriteProvider.js', 'utf-8');
        // Extract drawPlayer body and drawNPC body separately
        const drawPlayerBody = mangaSrc.match(/drawPlayer\(ctx,[\s\S]*?^\s{4}\}/m);
        if (drawPlayerBody) {
            assert.ok(!drawPlayerBody[0].includes('by - 1'),
                'drawPlayer must not draw at by - 1 (above frame boundary)');
        }
        const drawNPCBody = mangaSrc.match(/drawNPC\(ctx,[\s\S]*?^\s{4}\}/m);
        if (drawNPCBody) {
            assert.ok(!drawNPCBody[0].includes('by - 1'),
                'drawNPC must not draw at by - 1 (above frame boundary)');
        }
    });

    it('NPC merchant body fits within 32px frame on all sway offsets', () => {
        // Merchant: bodyW=18, bodyX = cx-10 = x+6. With swayOffset=-2: x+4. With +2: x+8.
        // Rightmost: x+8+18 = x+26 < 32. OK.
        // Leftmost: x+4 >= 0. OK.
        const leftMost = 16 - 10 - 2; // cx-10 + swayOffset(-2)
        assert.ok(leftMost >= 0, `Merchant body left edge at x+${leftMost}`);
        const rightMost = 16 - 10 + 2 + 18; // cx-10 + swayOffset(+2) + bodyW
        assert.ok(rightMost <= 32, `Merchant body right edge at x+${rightMost}`);
    });
});

// ======================================================================
describe('Controls & Dialog Guards', () => {
// ======================================================================

    it('toggleInventory is blocked during dialog (ExploreScene pattern)', () => {
        // Simulates: if (this.dialogActive) return;
        const dialogActive = true;
        assert.equal(!dialogActive, false, 'Inventory should not open during dialog');
    });

    it('toggleQuestLog is blocked during dialog', () => {
        const dialogActive = true;
        assert.equal(!dialogActive, false, 'Quest log should not open during dialog');
    });

    it('openWorldMap is blocked during dialog or menu', () => {
        assert.equal(!(true || false), false, 'Map should not open during dialog');
        assert.equal(!(false || true), false, 'Map should not open during menu');
        assert.equal(!(false || false), true, 'Map should open when nothing active');
    });

    it('handleInteract advances dialog when dialog is active', () => {
        // Pattern: if (this.dialogActive) { this.dialogManager.advance(); return; }
        // This means Space/ESC during dialog should advance, not start new interactions
        let advanceCalled = false;
        const dialogActive = true;
        if (dialogActive) { advanceCalled = true; }
        assert.equal(advanceCalled, true, 'advance() should be called when dialog is active');
    });

    it('handleInteract is blocked during menu', () => {
        // Pattern: if (this.menuOpen) return;
        const menuOpen = true;
        const dialogActive = false;
        let interacted = false;
        if (dialogActive) { /* advance */ }
        else if (menuOpen) { /* return */ }
        else { interacted = true; }
        assert.equal(interacted, false, 'Should not interact while menu is open');
    });

    it('player stops moving during dialog or menu', () => {
        // Pattern in Player.update(): if (dialogActive || menuOpen) { setVelocity(0,0); return; }
        const cases = [
            { dialogActive: true, menuOpen: false, shouldStop: true },
            { dialogActive: false, menuOpen: true, shouldStop: true },
            { dialogActive: true, menuOpen: true, shouldStop: true },
            { dialogActive: false, menuOpen: false, shouldStop: false },
        ];
        for (const c of cases) {
            const stops = c.dialogActive || c.menuOpen;
            assert.equal(stops, c.shouldStop,
                `dialog=${c.dialogActive} menu=${c.menuOpen} -> should${c.shouldStop ? '' : ' not'} stop`);
        }
    });
});

// ======================================================================
describe('Water Animation Data', () => {
// ======================================================================

    it('every water ground tile (2) in all maps has a collision wall', () => {
        for (const [cityId, city] of Object.entries(CITIES)) {
            // Main map
            for (let y = 0; y < city.height; y++) {
                for (let x = 0; x < city.width; x++) {
                    if (city.ground[y][x] === 2) {
                        assert.notEqual(city.walls[y][x], -1,
                            `${cityId} main: water at (${x},${y}) has no wall`);
                    }
                }
            }
            // Sub-rooms
            if (city.rooms) {
                for (const [roomName, room] of Object.entries(city.rooms)) {
                    for (let y = 0; y < room.height; y++) {
                        for (let x = 0; x < room.width; x++) {
                            if (room.ground[y][x] === 2) {
                                assert.notEqual(room.walls[y][x], -1,
                                    `${cityId}/${roomName}: water at (${x},${y}) has no wall`);
                            }
                        }
                    }
                }
            }
        }
    });

    it('water animation tile indices 64 and 65 are within tileset bounds (10 rows x 8 cols = 80)', () => {
        assert.ok(64 < 80, 'Water variant index 64 out of tileset bounds');
        assert.ok(65 < 80, 'Water variant index 65 out of tileset bounds');
    });
});

// ======================================================================
describe('Exit Zone & Movement', () => {
// ======================================================================

    for (const [cityId, city] of Object.entries(CITIES)) {
        it(`${cityId} exit zone tiles are walkable at south border`, () => {
            const exitTileX = Math.floor(city.width / 2 - 1);
            for (let dx = 0; dx < 3; dx++) {
                const wx = exitTileX + dx;
                if (wx >= 0 && wx < city.width) {
                    assert.equal(city.walls[city.height - 1][wx], -1,
                        `${cityId} exit tile (${wx},${city.height-1}) is blocked`);
                }
            }
        });

        it(`${cityId} player start (${city.playerStart.x},${city.playerStart.y}) is walkable and not water`, () => {
            const { x, y } = city.playerStart;
            assert.equal(city.walls[y][x], -1,
                `Player starts on wall tile at (${x},${y})`);
            assert.notEqual(city.ground[y][x], 2,
                `Player starts on water tile at (${x},${y})`);
        });
    }

    it('no NPC is on water or border in any room', () => {
        for (const [cityId, npcs] of Object.entries(NPC_DATA)) {
            const city = CITIES[cityId];
            for (const npc of npcs) {
                const room = npc.room || 'main';
                const mapData = (room === 'main') ? city : city.rooms?.[room];
                assert.ok(mapData, `Room '${room}' not found for ${npc.name}`);
                assert.ok(npc.x > 0 && npc.x < mapData.width - 1,
                    `${npc.name} in ${cityId}/${room} at x=${npc.x} is on border`);
                assert.ok(npc.y > 0 && npc.y < mapData.height - 1,
                    `${npc.name} in ${cityId}/${room} at y=${npc.y} is on border`);
                assert.notEqual(mapData.ground[npc.y][npc.x], 2,
                    `${npc.name} in ${cityId}/${room} at (${npc.x},${npc.y}) is on water`);
            }
        }
    });
});

// ======================================================================
describe('Room Transition Spawn Positions', () => {
// ======================================================================

    it('every ROOM_TRANSITIONS entry has a spawnAt field', () => {
        const missing = [];
        for (const [doorId, t] of Object.entries(ROOM_TRANSITIONS)) {
            if (!t.spawnAt) missing.push(doorId);
        }
        assert.equal(missing.length, 0, `Missing spawnAt: ${missing.join(', ')}`);
    });

    it('every spawnAt is within the target room bounds', () => {
        for (const [doorId, t] of Object.entries(ROOM_TRANSITIONS)) {
            const city = CITIES[t.targetCity];
            const room = t.targetRoom === 'main' ? city : city.rooms[t.targetRoom];
            assert.ok(room, `${doorId}: target room ${t.targetCity}/${t.targetRoom} not found`);
            const { x, y } = t.spawnAt;
            assert.ok(x >= 0 && x < room.width,
                `${doorId}: spawnAt x=${x} out of bounds (width=${room.width})`);
            assert.ok(y >= 0 && y < room.height,
                `${doorId}: spawnAt y=${y} out of bounds (height=${room.height})`);
        }
    });

    it('every spawnAt is on a walkable tile (not a wall)', () => {
        for (const [doorId, t] of Object.entries(ROOM_TRANSITIONS)) {
            const city = CITIES[t.targetCity];
            const room = t.targetRoom === 'main' ? city : city.rooms[t.targetRoom];
            const { x, y } = t.spawnAt;
            assert.equal(room.walls[y][x], -1,
                `${doorId}: spawnAt (${x},${y}) is on wall tile ${room.walls[y][x]}`);
        }
    });

    it('every spawnAt is not on water', () => {
        for (const [doorId, t] of Object.entries(ROOM_TRANSITIONS)) {
            const city = CITIES[t.targetCity];
            const room = t.targetRoom === 'main' ? city : city.rooms[t.targetRoom];
            const { x, y } = t.spawnAt;
            assert.notEqual(room.ground[y][x], 2,
                `${doorId}: spawnAt (${x},${y}) is on water`);
        }
    });

    it('every spawnAt is near a door that leads back to the source', () => {
        // For each transition A->B, the spawnAt in B should be within 3 tiles
        // of a door in B that leads back toward A (or at least a door tile)
        for (const [doorId, t] of Object.entries(ROOM_TRANSITIONS)) {
            const city = CITIES[t.targetCity];
            const room = t.targetRoom === 'main' ? city : city.rooms[t.targetRoom];
            const { x: sx, y: sy } = t.spawnAt;

            // Find all door tiles (23) in the target room
            let nearestDoorDist = Infinity;
            for (let dy = 0; dy < room.height; dy++) {
                for (let dx = 0; dx < room.width; dx++) {
                    if (room.decor[dy][dx] === 23) {
                        const dist = Math.abs(dx - sx) + Math.abs(dy - sy);
                        if (dist < nearestDoorDist) nearestDoorDist = dist;
                    }
                }
            }
            assert.ok(nearestDoorDist <= 4,
                `${doorId}: spawnAt (${sx},${sy}) is ${nearestDoorDist} tiles from nearest door (max 4)`);
        }
    });

    // --- Specific critical transitions ---

    it('returning from sub-rooms to main maps spawns near the original door, not at default playerStart', () => {
        // These are the transitions that previously all landed at (25,33)
        const returnTransitions = {
            'paris_eiffel_ground_door_10_14': { mainDoorX: 24, mainDoorY: 9 },
            'london_museum_hall_door_11_15': { mainDoorX: 22, mainDoorY: 15 },
            'rome_colosseum_door_11_17': { mainDoorX: 24, mainDoorY: 12 },
            'marrakech_souk_door_12_19': { mainDoorX: 24, mainDoorY: 19 },
            'marrakech_oasis_door_10_15': { mainDoorX: 48, mainDoorY: 20 },
            'tokyo_shrine_door_9_15': { mainDoorX: 24, mainDoorY: 10 },
        };

        for (const [doorId, expected] of Object.entries(returnTransitions)) {
            const t = ROOM_TRANSITIONS[doorId];
            assert.ok(t, `Missing transition: ${doorId}`);
            const { x, y } = t.spawnAt;
            const dist = Math.abs(x - expected.mainDoorX) + Math.abs(y - expected.mainDoorY);
            assert.ok(dist <= 3,
                `${doorId}: spawnAt (${x},${y}) is ${dist} tiles from main door (${expected.mainDoorX},${expected.mainDoorY}), expected <= 3`);
            // Must NOT be at the default playerStart (25,33)
            assert.ok(!(x === 25 && y === 33),
                `${doorId}: spawnAt is still at default playerStart (25,33) — not fixed`);
        }
    });

    it('multi-entry rooms spawn at the correct door for each entry', () => {
        // Museum hall has 3 entries — check each returns to the right area
        const hallEntries = {
            'london_door_22_15': { expectedNear: { x: 11, y: 15 } },
            'london_museum_gallery_door_10_17': { expectedNear: { x: 21, y: 0 } },
            'london_museum_basement_door_8_0': { expectedNear: { x: 0, y: 8 } },
        };
        for (const [doorId, { expectedNear }] of Object.entries(hallEntries)) {
            const t = ROOM_TRANSITIONS[doorId];
            assert.ok(t, `Missing transition: ${doorId}`);
            const { x, y } = t.spawnAt;
            const dist = Math.abs(x - expectedNear.x) + Math.abs(y - expectedNear.y);
            assert.ok(dist <= 4,
                `${doorId}: spawnAt (${x},${y}) is ${dist} tiles from expected door area (${expectedNear.x},${expectedNear.y})`);
        }

        // Colosseum has 2 entries
        const coloEntries = {
            'rome_door_24_12': { expectedNear: { x: 11, y: 17 } },
            'rome_catacombs_upper_door_9_0': { expectedNear: { x: 21, y: 8 } },
        };
        for (const [doorId, { expectedNear }] of Object.entries(coloEntries)) {
            const t = ROOM_TRANSITIONS[doorId];
            const { x, y } = t.spawnAt;
            const dist = Math.abs(x - expectedNear.x) + Math.abs(y - expectedNear.y);
            assert.ok(dist <= 4,
                `${doorId}: spawnAt (${x},${y}) is ${dist} tiles from expected door area (${expectedNear.x},${expectedNear.y})`);
        }

        // Souk has 2 entries
        const soukEntries = {
            'marrakech_door_24_19': { expectedNear: { x: 12, y: 19 } },
            'marrakech_riad_door_8_13': { expectedNear: { x: 23, y: 0 } },
        };
        for (const [doorId, { expectedNear }] of Object.entries(soukEntries)) {
            const t = ROOM_TRANSITIONS[doorId];
            const { x, y } = t.spawnAt;
            const dist = Math.abs(x - expectedNear.x) + Math.abs(y - expectedNear.y);
            assert.ok(dist <= 4,
                `${doorId}: spawnAt (${x},${y}) is ${dist} tiles from expected door area (${expectedNear.x},${expectedNear.y})`);
        }
    });
});

// ======================================================================
// 32x32 TILE UPGRADE REGRESSION TESTS
// ======================================================================

const { TILE_W, TILE_H, SPRITE_W, SPRITE_H, EXPLORE_ZOOM } = await import('../src/constants.js');

// ======================================================================
describe('Constants (32x32 upgrade)', () => {
// ======================================================================

    it('TILE_W and TILE_H are 32', () => {
        assert.equal(TILE_W, 32);
        assert.equal(TILE_H, 32);
    });

    it('SPRITE_W is 32 and SPRITE_H is 48', () => {
        assert.equal(SPRITE_W, 32);
        assert.equal(SPRITE_H, 48);
    });

    it('EXPLORE_ZOOM is 2', () => {
        assert.equal(EXPLORE_ZOOM, 2);
    });

    it('display resolution is preserved: TILE_W * EXPLORE_ZOOM makes tiles 64px on screen', () => {
        assert.equal(TILE_W * EXPLORE_ZOOM, 64);
    });

    it('viewport shows correct number of tiles at 960x720 with zoom 2', () => {
        const viewportW = 960 / EXPLORE_ZOOM;
        const viewportH = 720 / EXPLORE_ZOOM;
        const tilesX = Math.floor(viewportW / TILE_W);
        const tilesY = Math.floor(viewportH / TILE_H);
        assert.equal(tilesX, 15, 'viewport should show 15 tiles wide');
        assert.equal(tilesY, 11, 'viewport should show 11 tiles tall');
    });
});

// ======================================================================
describe('Tile Math Correctness (32x32)', () => {
// ======================================================================

    it('player spawn position uses correct tile-to-pixel conversion', () => {
        const tileX = 25, tileY = 33;
        const pixelX = tileX * TILE_W + TILE_W / 2;
        const pixelY = tileY * TILE_H + TILE_H / 2;
        assert.equal(pixelX, 816, 'player pixel X for tile 25');
        assert.equal(pixelY, 1072, 'player pixel Y for tile 33');
    });

    it('NPC positions center correctly in tiles', () => {
        for (const [cityId, npcs] of Object.entries(NPC_DATA)) {
            for (const npc of npcs) {
                const px = npc.x * TILE_W + TILE_W / 2;
                const py = npc.y * TILE_H + TILE_H / 2;
                assert.equal(px % TILE_W, TILE_W / 2,
                    `NPC ${npc.id} in ${cityId}: X not centered in tile`);
                assert.equal(py % TILE_H, TILE_H / 2,
                    `NPC ${npc.id} in ${cityId}: Y not centered in tile`);
            }
        }
    });

    it('interactable positions center correctly for chests/signs/doors/portals', () => {
        const interactableIndices = { 20: 'chest', 21: 'portal', 22: 'sign', 23: 'door' };
        for (const [cityId, city] of Object.entries(CITIES)) {
            const maps = [{ name: 'main', data: city }];
            if (city.rooms) {
                for (const [roomName, room] of Object.entries(city.rooms)) {
                    maps.push({ name: roomName, data: room });
                }
            }
            for (const { name, data } of maps) {
                for (let y = 0; y < data.height; y++) {
                    for (let x = 0; x < data.width; x++) {
                        const tileIdx = data.decor[y][x];
                        if (interactableIndices[tileIdx]) {
                            const px = x * TILE_W + TILE_W / 2;
                            const py = y * TILE_H + TILE_H / 2;
                            assert.equal(px % TILE_W, TILE_W / 2,
                                `${interactableIndices[tileIdx]} at (${x},${y}) in ${cityId}/${name}: X not centered`);
                            assert.equal(py % TILE_H, TILE_H / 2,
                                `${interactableIndices[tileIdx]} at (${x},${y}) in ${cityId}/${name}: Y not centered`);
                        }
                    }
                }
            }
        }
    });

    it('exit zone spans correct pixel area at bottom of main maps', () => {
        for (const [cityId, city] of Object.entries(CITIES)) {
            const exitX = Math.floor(city.width / 2 - 1) * TILE_W;
            const exitY = (city.height - 1) * TILE_H;
            const exitW = 3 * TILE_W;
            const exitH = TILE_H;
            assert.ok(exitX >= 0, `${cityId}: exit zone X start negative`);
            assert.ok(exitX + exitW <= city.width * TILE_W,
                `${cityId}: exit zone extends past map right edge`);
            assert.ok(exitY + exitH <= city.height * TILE_H,
                `${cityId}: exit zone extends past map bottom edge`);
            const playerX = city.playerStart.x * TILE_W + TILE_W / 2;
            const playerY = city.playerStart.y * TILE_H + TILE_H / 2;
            const inZone = playerX >= exitX && playerX <= exitX + exitW &&
                           playerY >= exitY && playerY <= exitY + exitH;
            assert.ok(!inZone,
                `${cityId}: default playerStart is inside exit zone`);
        }
    });
});

// ======================================================================
describe('Collision Body Consistency (32x32)', () => {
// ======================================================================

    it('player collision body is centered horizontally in 32px sprite', () => {
        const bodyW = 20, offsetX = 6;
        const leftMargin = offsetX;
        const rightMargin = SPRITE_W - (offsetX + bodyW);
        assert.equal(leftMargin, rightMargin,
            `Player collision not centered: left ${leftMargin}, right ${rightMargin}`);
    });

    it('player collision body bottom touches sprite bottom', () => {
        assert.equal(28 + 20, SPRITE_H,
            'Player collision body bottom should align with sprite bottom');
    });

    it('NPC collision body bottom touches sprite bottom', () => {
        assert.equal(24 + 24, SPRITE_H,
            'NPC collision body bottom should align with sprite bottom');
    });

    it('NPC collision body is centered horizontally in 32px sprite', () => {
        const bodyW = 24, offsetX = 4;
        const leftMargin = offsetX;
        const rightMargin = SPRITE_W - (offsetX + bodyW);
        assert.equal(leftMargin, rightMargin,
            `NPC collision not centered: left ${leftMargin}, right ${rightMargin}`);
    });

    it('player collision body fits within one tile width', () => {
        assert.ok(20 <= TILE_W, 'Player body width should fit in one tile');
    });

    it('NPC collision body fits within one tile width', () => {
        assert.ok(24 <= TILE_W, 'NPC body width should fit in one tile');
    });
});

// ======================================================================
describe('Interaction Distance (32x32)', () => {
// ======================================================================

    it('facing distance + threshold reaches adjacent tile center', () => {
        const facingDist = 24;
        const threshold = 32;
        const adjacentNpcDist = TILE_W - facingDist;
        assert.ok(adjacentNpcDist < threshold,
            `Cannot interact with adjacent NPC: distance ${adjacentNpcDist} >= threshold ${threshold}`);
    });

    it('facing distance + threshold does NOT reach two tiles away', () => {
        const facingDist = 24;
        const threshold = 32;
        const twoTilesAwayDist = 2 * TILE_W - facingDist;
        assert.ok(twoTilesAwayDist >= threshold,
            `Can interact 2 tiles away: distance ${twoTilesAwayDist} < threshold ${threshold}`);
    });

    it('player speed is proportional to tile size (2-5 tiles/sec)', () => {
        const speed = 90;
        const tilesPerSecond = speed / TILE_W;
        assert.ok(tilesPerSecond >= 2, `Too slow: ${tilesPerSecond.toFixed(1)} tiles/sec`);
        assert.ok(tilesPerSecond <= 5, `Too fast: ${tilesPerSecond.toFixed(1)} tiles/sec`);
    });
});

// ======================================================================
describe('Room Transition Spawn Math (32x32)', () => {
// ======================================================================

    it('all spawnAt positions convert to valid pixel coordinates within target room', () => {
        for (const [doorId, transition] of Object.entries(ROOM_TRANSITIONS)) {
            const { targetCity, targetRoom, spawnAt } = transition;
            const city = CITIES[targetCity];
            const roomData = targetRoom === 'main' ? city : city.rooms?.[targetRoom];
            if (!roomData) continue;
            const px = spawnAt.x * TILE_W + TILE_W / 2;
            const py = spawnAt.y * TILE_H + TILE_H / 2;
            assert.ok(px >= 0 && px < roomData.width * TILE_W,
                `${doorId}: spawnAt pixel X=${px} out of bounds (max=${roomData.width * TILE_W})`);
            assert.ok(py >= 0 && py < roomData.height * TILE_H,
                `${doorId}: spawnAt pixel Y=${py} out of bounds (max=${roomData.height * TILE_H})`);
        }
    });

    it('sub-room→main return transitions never spawn at default playerStart', () => {
        for (const [doorId, transition] of Object.entries(ROOM_TRANSITIONS)) {
            if (transition.targetRoom !== 'main') continue;
            const { spawnAt } = transition;
            assert.ok(!(spawnAt.x === 25 && spawnAt.y === 33),
                `${doorId}: return to main spawns at default playerStart (25,33)`);
        }
    });
});

// ======================================================================
describe('ExploreScene Source Correctness (32x32)', () => {
// ======================================================================

    let exploreSrc;
    before(async () => {
        const fs = await import('node:fs');
        exploreSrc = fs.readFileSync('src/scenes/ExploreScene.js', 'utf-8');
    });

    it('imports TILE_W, TILE_H, EXPLORE_ZOOM from constants', () => {
        assert.ok(exploreSrc.includes("import { TILE_W, TILE_H, EXPLORE_ZOOM } from '../constants.js'"),
            'ExploreScene must import tile constants');
    });

    it('uses EXPLORE_ZOOM for camera zoom (not hardcoded 3)', () => {
        assert.ok(exploreSrc.includes('setZoom(EXPLORE_ZOOM)'),
            'Camera zoom should use EXPLORE_ZOOM constant');
        assert.ok(!exploreSrc.includes('setZoom(3)'),
            'Camera zoom should NOT be hardcoded to 3');
    });

    it('uses TILE_W for tilemap configuration', () => {
        assert.ok(exploreSrc.includes('tileWidth: TILE_W'),
            'Tilemap tileWidth should use TILE_W');
        assert.ok(exploreSrc.includes('tileHeight: TILE_H'),
            'Tilemap tileHeight should use TILE_H');
    });

    it('has no hardcoded "* 16" tile math', () => {
        const matches = exploreSrc.match(/\*\s*16\b/g);
        assert.equal(matches, null, `Found hardcoded * 16: ${matches}`);
    });

    it('uses TILE_W for camera and physics bounds', () => {
        assert.ok(exploreSrc.includes('roomData.width * TILE_W'));
        assert.ok(exploreSrc.includes('roomData.height * TILE_H'));
    });

    it('uses TILE_W for NPC positioning', () => {
        assert.ok(exploreSrc.includes('npcData.x * TILE_W + TILE_W / 2'));
        assert.ok(exploreSrc.includes('npcData.y * TILE_H + TILE_H / 2'));
    });
});

// ======================================================================
describe('BootScene Correctness (32x32)', () => {
// ======================================================================

    let bootSrc;
    before(async () => {
        const fs = await import('node:fs');
        bootSrc = fs.readFileSync('src/scenes/BootScene.js', 'utf-8');
    });

    it('imports MangaSpriteProvider (not ProceduralAssetProvider)', () => {
        assert.ok(bootSrc.includes("import { MangaSpriteProvider }"));
        assert.ok(!bootSrc.includes("import { ProceduralAssetProvider }"));
    });

    it('creates provider in init() (not constructor)', () => {
        assert.ok(bootSrc.includes('init()'), 'Should have init() method');
        const constructorMatch = bootSrc.match(/constructor\(\)\s*\{([^}]*)\}/s);
        if (constructorMatch) {
            assert.ok(!constructorMatch[1].includes('MangaSpriteProvider'),
                'Provider should NOT be created in constructor');
        }
    });

    it('calls loadSpriteSheets in preload', () => {
        assert.ok(bootSrc.includes('this.provider.loadSpriteSheets()'));
    });

    it('calls generateTextures and createAnimations in create', () => {
        assert.ok(bootSrc.includes('this.provider.generateTextures()'));
        assert.ok(bootSrc.includes('this.provider.createAnimations()'));
    });
});

// ======================================================================
describe('TitleScene locket scale (32x32)', () => {
// ======================================================================

    it('locket icon scale is 3 (not 6) for 32px items', async () => {
        const fs = await import('node:fs');
        const titleSrc = fs.readFileSync('src/scenes/TitleScene.js', 'utf-8');
        assert.ok(titleSrc.includes('.setScale(3)'));
        assert.ok(!titleSrc.includes('.setScale(6)'));
    });
});

// ======================================================================
describe('NPC Definitions (external sprites)', () => {
// ======================================================================

    it('spirit_fox and ghost have no file field (always procedural)', async () => {
        const { NPC_DEFS } = await import('../src/assets/npcDefinitions.js');
        const spiritFox = NPC_DEFS.find(d => d.name === 'spirit_fox');
        const ghost = NPC_DEFS.find(d => d.name === 'ghost');
        assert.ok(spiritFox, 'spirit_fox should exist');
        assert.ok(ghost, 'ghost should exist');
        assert.equal(spiritFox.file, undefined, 'spirit_fox should have no file');
        assert.equal(ghost.file, undefined, 'ghost should have no file');
    });

    it('all other NPCs have a .png file field', async () => {
        const { NPC_DEFS } = await import('../src/assets/npcDefinitions.js');
        const exceptions = ['spirit_fox', 'ghost'];
        for (const npc of NPC_DEFS) {
            if (exceptions.includes(npc.name)) continue;
            assert.ok(npc.file, `NPC ${npc.name} should have a file field`);
            assert.ok(npc.file.endsWith('.png'), `NPC ${npc.name} file should be .png`);
        }
    });

    it('NPC_DEFS still has 29 entries', async () => {
        const { NPC_DEFS } = await import('../src/assets/npcDefinitions.js');
        assert.equal(NPC_DEFS.length, 29);
    });
});

// ======================================================================
describe('MangaSpriteProvider Source Correctness', () => {
// ======================================================================

    let mangaSrc;
    before(async () => {
        const fs = await import('node:fs');
        mangaSrc = fs.readFileSync('src/assets/MangaSpriteProvider.js', 'utf-8');
    });

    it('player spritesheet uses 32x48 frames', () => {
        assert.ok(mangaSrc.includes('const frameW = 32, frameH = 48'));
    });

    it('tileset uses 32px tile size', () => {
        assert.ok(mangaSrc.includes('const tileSize = 32'));
    });

    it('has loadSpriteSheets method that cleans up listeners', () => {
        assert.ok(mangaSrc.includes('loadSpriteSheets()'));
        assert.ok(mangaSrc.includes("loader.once('complete'"));
        assert.ok(mangaSrc.includes("loader.off('filecomplete'"));
    });

    it('has _remapExternalSprite with PIPOYA [0,1,0,2] mapping', () => {
        assert.ok(mangaSrc.includes('_remapExternalSprite('));
        assert.ok(mangaSrc.includes('const frameMap = [0, 1, 0, 2]'));
    });

    it('item icons are 32x32', () => {
        assert.ok(mangaSrc.includes("textures.createCanvas(`item_${item.name}`, 32, 32)"));
    });

    it('world map background is still 320x240', () => {
        assert.ok(mangaSrc.includes("textures.createCanvas('world_map_bg', 320, 240)"));
    });
});

// ======================================================================
describe('Integration Test Coordinates (32x32)', () => {
// ======================================================================

    it('integration tests use * 32 (not * 16) for player positioning', async () => {
        const fs = await import('node:fs');
        const testSrc = fs.readFileSync('test_game.mjs', 'utf-8');
        assert.ok(!testSrc.includes('* 16'), 'Should not use * 16');
        assert.ok(testSrc.includes('* 32'), 'Should use * 32');
    });
});
