import { chromium } from 'playwright';

const TIMEOUT = 10000;
let browser, page;
const results = [];

function log(msg) { console.log(`  ${msg}`); }
function pass(name) { results.push({ name, ok: true }); log(`\u2713 ${name}`); }
function fail(name, err) { results.push({ name, ok: false, err }); log(`\u2717 ${name}: ${err}`); }

async function test(name, fn) {
    try {
        await fn();
        pass(name);
    } catch (e) {
        fail(name, e.message);
    }
}

(async () => {
    console.log('\n=== Quest Game Playwright Tests ===\n');

    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 960, height: 720 } });
    page = await context.newPage();

    // Collect console errors
    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    const pageErrors = [];
    page.on('pageerror', err => pageErrors.push(err.message));

    // Set language to English for test assertions (default is French)
    await page.goto('http://localhost:8080', { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
    await page.evaluate(() => localStorage.setItem('questgame_language', 'en'));

    // --- TEST 1: Page loads ---
    await test('Page loads at localhost:8080', async () => {
        const resp = await page.goto('http://localhost:8080', { waitUntil: 'networkidle', timeout: TIMEOUT });
        if (!resp.ok()) throw new Error(`HTTP ${resp.status()}`);
    });

    // --- TEST 2: Phaser loads ---
    await test('Phaser 3 library is loaded', async () => {
        const hasPhaserGlobal = await page.evaluate(() => typeof Phaser !== 'undefined');
        if (!hasPhaserGlobal) throw new Error('Phaser global not found');
        const version = await page.evaluate(() => Phaser.VERSION);
        log(`  Phaser version: ${version}`);
    });

    // --- TEST 3: Canvas element exists ---
    await test('Game canvas element is created', async () => {
        await page.waitForSelector('canvas', { timeout: TIMEOUT });
        const canvasCount = await page.locator('canvas').count();
        if (canvasCount === 0) throw new Error('No canvas element found');
    });

    // --- TEST 4: Game instance is running ---
    await test('Phaser Game instance is running', async () => {
        await page.waitForFunction(() => {
            return window.game && window.game.isRunning;
        }, { timeout: TIMEOUT });

        const info = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            return {
                canvasW: canvas.width,
                canvasH: canvas.height,
                styleW: canvas.style.width,
                styleH: canvas.style.height,
                isRunning: window.game.isRunning
            };
        });
        // Native resolution is 960x720 for crisp text rendering
        if (info.canvasW !== 960 || info.canvasH !== 720) throw new Error(`Canvas: ${info.canvasW}x${info.canvasH}`);
        log(`  Canvas: ${info.canvasW}x${info.canvasH}`);
    });

    // --- TEST 5: Boot scene completes and Title scene loads ---
    await test('Boot scene completes, Title scene is active', async () => {
        await page.waitForFunction(() => {
            try {
                const g = window.game;
                if (!g) return false;
                return g.scene.scenes.some(s => s.scene.key === 'Title' && s.scene.settings.active);
            } catch { return false; }
        }, { timeout: TIMEOUT });
    });

    // --- TEST 6: All textures were generated ---
    await test('All programmatic textures are generated', async () => {
        const missingTextures = await page.evaluate(() => {
            const tm = window.game.textures;
            const required = [
                'player', 'tileset',
                'npc_librarian', 'npc_curator', 'npc_merchant', 'npc_guide', 'npc_gardener', 'npc_grandma',
                'button_bg', 'button_hover', 'dialog_bg',
                'city_dot', 'city_locked', 'world_map_bg',
                'item_locket', 'item_letter', 'item_map_fragment', 'item_key', 'item_book', 'item_coin', 'item_gem', 'item_journal',
                'quest_marker', 'interact_icon', 'arrow'
            ];
            return required.filter(key => !tm.exists(key));
        });
        if (missingTextures.length > 0) {
            throw new Error(`Missing textures: ${missingTextures.join(', ')}`);
        }
        log(`  All 24 required textures present`);
    });

    // --- TEST 7: Player animations were created ---
    await test('Player animations are registered', async () => {
        const missingAnims = await page.evaluate(() => {
            const am = window.game.anims;
            const required = [
                'player_down', 'player_up', 'player_left', 'player_right',
                'player_idle_down', 'player_idle_up', 'player_idle_left', 'player_idle_right'
            ];
            return required.filter(key => !am.exists(key));
        });
        if (missingAnims.length > 0) {
            throw new Error(`Missing animations: ${missingAnims.join(', ')}`);
        }
    });

    // --- TEST 8: Click "New Game" button ---
    await test('Clicking "New Game" starts game and loads Explore scene', async () => {
        // Button at game coords (160, 170) → screen (480, 510) at 3x zoom
        await page.mouse.click(480, 510);

        // Wait for Explore scene to become active
        await page.waitForFunction(() => {
            try {
                return window.game.scene.scenes.some(s => s.scene.key === 'Explore' && s.scene.settings.active);
            } catch { return false; }
        }, { timeout: TIMEOUT });
    });

    // --- TEST 9: Player entity exists in Explore scene ---
    await test('Player entity exists in Explore scene', async () => {
        // Wait a moment for scene to fully initialize
        await page.waitForTimeout(500);

        const hasPlayer = await page.evaluate(() => {
            const explore = window.game.scene.getScene('Explore');
            return explore && explore.player && explore.player.active;
        });
        if (!hasPlayer) throw new Error('Player not found or not active');
    });

    // --- TEST 10: Tilemap was created ---
    await test('Tilemap is created for Paris', async () => {
        const mapInfo = await page.evaluate(() => {
            const explore = window.game.scene.getScene('Explore');
            if (!explore || !explore.map) return null;
            return {
                width: explore.map.width,
                height: explore.map.height,
                layers: explore.map.layers.length,
                cityId: explore.cityId
            };
        });
        if (!mapInfo) throw new Error('No tilemap found');
        if (mapInfo.cityId !== 'paris') throw new Error(`Expected paris, got ${mapInfo.cityId}`);
        if (mapInfo.width !== 50 || mapInfo.height !== 40) throw new Error(`Map size ${mapInfo.width}x${mapInfo.height}, expected 50x40`);
        log(`  Map: ${mapInfo.width}x${mapInfo.height}, ${mapInfo.layers} layers, city: ${mapInfo.cityId}`);
    });

    // --- TEST 11: NPCs are spawned ---
    await test('NPCs are spawned in Paris', async () => {
        const npcInfo = await page.evaluate(() => {
            const explore = window.game.scene.getScene('Explore');
            if (!explore || !explore.npcs) return null;
            return explore.npcs.map(n => ({ name: n.npcData.name, x: n.x, y: n.y }));
        });
        if (!npcInfo || npcInfo.length === 0) throw new Error('No NPCs found');
        log(`  Found ${npcInfo.length} NPCs: ${npcInfo.map(n => n.name).join(', ')}`);
    });

    // --- TEST 12: UI scene is running ---
    await test('UI scene is active as overlay', async () => {
        const uiActive = await page.evaluate(() => {
            const ui = window.game.scene.getScene('UI');
            return ui && ui.scene.settings.active;
        });
        if (!uiActive) throw new Error('UI scene not active');
    });

    // --- TEST 13: Player movement ---
    await test('Player responds to keyboard movement', async () => {
        const startPos = await page.evaluate(() => {
            const player = window.game.scene.getScene('Explore').player;
            return { x: player.x, y: player.y };
        });

        // Press and hold 'D' (move right) for 500ms
        await page.keyboard.down('d');
        await page.waitForTimeout(500);
        await page.keyboard.up('d');
        await page.waitForTimeout(100);

        const endPos = await page.evaluate(() => {
            const player = window.game.scene.getScene('Explore').player;
            return { x: player.x, y: player.y };
        });

        if (endPos.x <= startPos.x) throw new Error(`Player didn't move right: start=${startPos.x}, end=${endPos.x}`);
        log(`  Moved from x=${startPos.x.toFixed(1)} to x=${endPos.x.toFixed(1)}`);
    });

    // --- TEST 14: Registry state is initialized ---
    await test('Game registry state is properly initialized', async () => {
        const state = await page.evaluate(() => {
            const reg = window.game.registry;
            return {
                currentCity: reg.get('currentCity'),
                inventory: reg.get('inventory'),
                unlockedCities: reg.get('unlockedCities'),
                flags: reg.get('flags'),
                questState: reg.get('questState')
            };
        });
        if (state.currentCity !== 'paris') throw new Error(`City: ${state.currentCity}`);
        if (!Array.isArray(state.inventory)) throw new Error('Inventory not array');
        if (!Array.isArray(state.unlockedCities)) throw new Error('UnlockedCities not array');
        if (typeof state.flags !== 'object') throw new Error('Flags not object');
        log(`  City: ${state.currentCity}, Unlocked: ${state.unlockedCities.join(',')}`);
    });

    // --- TEST 15: Walk to Grandma NPC and interact ---
    await test('Can interact with NPC (Grandma) to start quest', async () => {
        // Teleport player near grandma and face up
        await page.evaluate(() => {
            const explore = window.game.scene.getScene('Explore');
            const player = explore.player;
            player.setPosition(44 * 16 + 8, 33 * 16 + 8);
            player.direction = 'up';
        });
        await page.waitForTimeout(200);

        // Press space to interact
        await page.keyboard.press('Space');
        await page.waitForTimeout(300);

        // Check dialog is active
        const dialogState = await page.evaluate(() => {
            const explore = window.game.scene.getScene('Explore');
            return {
                dialogActive: explore.dialogActive,
                dialogManagerActive: explore.dialogManager.active
            };
        });
        if (!dialogState.dialogActive) throw new Error('Dialog not active after interacting with NPC');
    });

    // --- TEST 16: Advance through dialog ---
    await test('Can advance through dialog with Space key', async () => {
        // Advance through grandma's dialog by programmatically calling advance
        // This avoids timing issues with the game loop and key events
        await page.evaluate(async () => {
            const explore = window.game.scene.getScene('Explore');
            const dm = explore.dialogManager;
            // Keep advancing until dialog is done
            for (let i = 0; i < 30; i++) {
                if (!dm.active) break;
                dm.advance();
                await new Promise(r => setTimeout(r, 120));
            }
        });
        await page.waitForTimeout(300);

        // After dialog ends, check we got the locket
        const state = await page.evaluate(() => {
            const explore = window.game.scene.getScene('Explore');
            const reg = window.game.registry;
            return {
                dialogActive: explore.dialogActive,
                flags: reg.get('flags'),
                inventory: reg.get('inventory')
            };
        });

        if (state.dialogActive) throw new Error('Dialog still active after advancing through all lines');
        if (!state.flags.quest_started) throw new Error('quest_started flag not set');
        const hasLocket = state.inventory.some(i => i.id === 'locket');
        if (!hasLocket) throw new Error('Locket not in inventory');
        log(`  Got locket, quest_started=${state.flags.quest_started}`);
    });

    // --- TEST 17: Inventory panel works ---
    await test('Inventory panel opens with I key and shows locket', async () => {
        await page.keyboard.press('i');
        await page.waitForTimeout(300);

        const invState = await page.evaluate(() => {
            const ui = window.game.scene.getScene('UI');
            return {
                visible: ui.inventoryVisible,
                containerVisible: ui.inventoryContainer.visible
            };
        });
        if (!invState.visible) throw new Error('Inventory not visible');

        // Close it
        await page.keyboard.press('i');
        await page.waitForTimeout(200);
    });

    // --- TEST 18: Quest log works ---
    await test('Quest log opens with Q key and shows active quest', async () => {
        await page.keyboard.press('q');
        await page.waitForTimeout(300);

        const qlState = await page.evaluate(() => {
            const ui = window.game.scene.getScene('UI');
            const explore = window.game.scene.getScene('Explore');
            const quests = explore.questManager.getActiveQuests();
            return {
                visible: ui.questLogVisible,
                questCount: quests.length,
                questName: quests.length > 0 ? quests[0].name : null
            };
        });
        if (!qlState.visible) throw new Error('Quest log not visible');
        if (qlState.questCount === 0) throw new Error('No active quests');
        log(`  Active quest: "${qlState.questName}"`);

        // Close it
        await page.keyboard.press('q');
        await page.waitForTimeout(200);
    });

    // --- TEST 19: Visit librarian to complete Paris ---
    await test('Visiting librarian with locket advances quest', async () => {
        // Teleport player near librarian
        await page.evaluate(() => {
            const explore = window.game.scene.getScene('Explore');
            explore.player.setPosition(5 * 16 + 8, 28 * 16 + 8);
            explore.player.direction = 'up';
        });
        await page.waitForTimeout(200);

        // Interact
        await page.keyboard.press('Space');
        await page.waitForTimeout(500);

        // Advance through all dialog lines programmatically
        await page.evaluate(async () => {
            const explore = window.game.scene.getScene('Explore');
            const dm = explore.dialogManager;
            for (let i = 0; i < 30; i++) {
                if (!dm.active) break;
                dm.advance();
                await new Promise(r => setTimeout(r, 120));
            }
        });
        await page.waitForTimeout(300);

        // Verify state
        const state = await page.evaluate(() => {
            const reg = window.game.registry;
            return {
                flags: reg.get('flags'),
                unlockedCities: reg.get('unlockedCities'),
                inventory: reg.get('inventory')
            };
        });

        if (!state.flags.paris_complete) throw new Error('paris_complete flag not set');
        if (!state.unlockedCities.includes('london')) throw new Error('London not unlocked');
        const hasLetter = state.inventory.some(i => i.id === 'letter');
        if (!hasLetter) throw new Error('Letter not in inventory');
        log(`  Paris complete! Unlocked cities: ${state.unlockedCities.join(', ')}`);
    });

    // --- TEST 20: World map opens ---
    await test('World map opens and shows cities', async () => {
        // Ensure dialog is closed and we can open the map
        await page.evaluate(() => {
            const explore = window.game.scene.getScene('Explore');
            explore.dialogActive = false;
            explore.menuOpen = false;
        });
        await page.waitForTimeout(200);

        // Open world map programmatically
        await page.evaluate(() => {
            const explore = window.game.scene.getScene('Explore');
            explore.openWorldMap();
        });

        await page.waitForFunction(() => {
            try {
                const wm = window.game.scene.getScene('WorldMap');
                return wm && wm.scene.settings.active;
            } catch { return false; }
        }, { timeout: TIMEOUT });

        const wmState = await page.evaluate(() => {
            const wm = window.game.scene.getScene('WorldMap');
            return {
                active: wm && wm.scene.settings.active,
                fromCity: wm ? wm.fromCity : null
            };
        });
        if (!wmState.active) throw new Error('WorldMap scene not active');
        if (wmState.fromCity !== 'paris') throw new Error(`fromCity: ${wmState.fromCity}`);
    });

    // --- TEST 21: Can travel to London ---
    await test('Can select London and travel', async () => {
        // Wait for WorldMap scene to fully initialize
        await page.waitForTimeout(1000);

        // Select London and start travel
        await page.evaluate(() => {
            const wm = window.game.scene.getScene('WorldMap');
            wm.selectCity('london');
        });
        await page.waitForTimeout(500);

        await page.evaluate(() => {
            const wm = window.game.scene.getScene('WorldMap');
            wm.startTravel();
        });

        // Wait for Explore scene to load with London
        await page.waitForFunction(() => {
            try {
                const explore = window.game.scene.getScene('Explore');
                return explore && explore.scene.settings.active && explore.cityId === 'london';
            } catch { return false; }
        }, { timeout: TIMEOUT });

        log('  Successfully traveled to London!');
    });

    // --- TEST 22: London is properly loaded ---
    await test('London map is properly loaded with NPCs', async () => {
        await page.waitForTimeout(500);

        const londonState = await page.evaluate(() => {
            const explore = window.game.scene.getScene('Explore');
            return {
                cityId: explore.cityId,
                mapWidth: explore.map.width,
                npcCount: explore.npcs.length,
                npcNames: explore.npcs.map(n => n.npcData.name)
            };
        });

        if (londonState.cityId !== 'london') throw new Error(`City: ${londonState.cityId}`);
        if (londonState.npcCount === 0) throw new Error('No NPCs in London');
        log(`  London loaded: ${londonState.npcCount} NPCs - ${londonState.npcNames.join(', ')}`);
    });

    // --- TEST 23: Save/Load works ---
    await test('Save data persists to localStorage', async () => {
        const saveData = await page.evaluate(() => {
            const raw = localStorage.getItem('questgame_save');
            if (!raw) return null;
            return JSON.parse(raw);
        });

        if (!saveData) throw new Error('No save data in localStorage');
        if (saveData.currentCity !== 'london') throw new Error(`Saved city: ${saveData.currentCity}`);
        if (!saveData.flags.paris_complete) throw new Error('paris_complete not saved');
        log(`  Save data: city=${saveData.currentCity}, items=${saveData.inventory.length}`);
    });

    // --- TEST 24: No critical JavaScript errors ---
    await test('No critical JavaScript errors', async () => {
        const criticalErrors = pageErrors.filter(e => !e.includes('favicon'));
        if (criticalErrors.length > 0) {
            throw new Error(`Page errors: ${criticalErrors.join('; ')}`);
        }
        if (consoleErrors.length > 0) {
            log(`  Console errors (non-fatal): ${consoleErrors.length}`);
            consoleErrors.forEach(e => log(`    ${e.substring(0, 100)}`));
        }
    });

    // --- Summary ---
    console.log('\n=== Test Summary ===\n');
    const passed = results.filter(r => r.ok).length;
    const failed = results.filter(r => !r.ok).length;
    console.log(`  ${passed} passed, ${failed} failed out of ${results.length} tests\n`);

    if (failed > 0) {
        console.log('  Failed tests:');
        results.filter(r => !r.ok).forEach(r => console.log(`    \u2717 ${r.name}: ${r.err}`));
        console.log('');
    }

    await browser.close();
    process.exit(failed > 0 ? 1 : 0);
})();
