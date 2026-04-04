import { Player } from '../entities/Player.js';
import { NPC } from '../entities/NPC.js';
import { CITIES, ROOM_TRANSITIONS } from '../data/cities.js';
import { NPC_DATA } from '../data/npcs.js';
import { JOURNAL_PAGES } from '../data/journalPages.js';
import { PUZZLE_OBJECTS, PUZZLES } from '../data/puzzles.js';
import { HIDDEN_ITEMS } from '../data/sideQuests.js';
import { DialogManager } from '../systems/DialogManager.js';
import { QuestManager } from '../systems/QuestManager.js';
import { InventoryManager } from '../systems/InventoryManager.js';
import { SaveManager } from '../systems/SaveManager.js';
import { t, getItemText } from '../data/i18n/index.js';
import { TILE_W, TILE_H, EXPLORE_ZOOM } from '../constants.js';

export class ExploreScene extends Phaser.Scene {
    constructor() {
        super('Explore');
    }

    init(data) {
        this.cityId = data.city || 'paris';
        this.roomId = data.room || 'main';
        this.spawnAt = data.spawnAt || null; // override playerStart from door transitions
        this.dialogActive = false;
        this.menuOpen = false;
        this.exitTriggered = false;
        this.bellSequence = [];
        this.selectedPainting = null;
        this.paintingOrder = null;
    }

    getRoomData() {
        const cityData = CITIES[this.cityId];
        if (!cityData) return null;
        if (cityData.rooms && cityData.rooms[this.roomId]) {
            return cityData.rooms[this.roomId];
        }
        // Fallback: use city-level data for main room (backward compat)
        return cityData;
    }

    create() {
        const cityData = CITIES[this.cityId];
        if (!cityData) return;
        const roomData = this.getRoomData();
        if (!roomData) return;

        this.registry.set('currentCity', this.cityId);
        this.registry.set('currentRoom', this.roomId);

        // Track visited cities (only on main room)
        if (this.roomId === 'main') {
            const visited = this.registry.get('visitedCities') || ['paris'];
            if (!visited.includes(this.cityId)) {
                visited.push(this.cityId);
                this.registry.set('visitedCities', visited);
            }
        }

        // Create tilemap from room data
        this.buildTilemap(roomData);

        // Create player (spawnAt overrides playerStart when entering via door)
        const spawn = this.spawnAt || roomData.playerStart;
        const startX = spawn.x * TILE_W + TILE_W / 2;
        const startY = spawn.y * TILE_H + TILE_H / 2;
        this.player = new Player(this, startX, startY);
        this.player.setDepth(5);

        // Camera follows player (zoom 2 for manga-style 32x32 tiles)
        this.cameras.main.setZoom(EXPLORE_ZOOM);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setBounds(0, 0, roomData.width * TILE_W, roomData.height * TILE_H);
        this.physics.world.setBounds(0, 0, roomData.width * TILE_W, roomData.height * TILE_H);

        // Collisions
        this.physics.add.collider(this.player, this.wallLayer);

        // Initialize systems
        this.dialogManager = new DialogManager(this);
        this.questManager = new QuestManager(this);
        this.inventoryManager = new InventoryManager(this);

        // Create NPCs
        this.npcs = [];
        this.npcGroup = this.physics.add.staticGroup();
        this.createNPCs();
        this.physics.add.collider(this.player, this.npcGroup);

        // Create interactable objects
        this.interactables = [];
        this.createInteractables(roomData);

        // Create particle effects and environmental animations
        this.createParticles(roomData);
        this.createEnvironmentalAnimations(roomData);

        // Create journal page collectibles
        this.createJournalPages();

        // Create puzzle objects (bells, paintings)
        this.createPuzzleObjects();

        // Create hidden items (whistle, music sheets, cat)
        this.createHiddenItems();

        // Input for interaction (store refs for cleanup)
        this._onSpace = () => this.handleInteract();
        this._onI = () => this.toggleInventory();
        this._onQ = () => this.toggleQuestLog();
        this._onJ = () => this.toggleJournal();
        this._onM = () => this.openWorldMap();
        this._onEsc = () => this.handleEscape();
        this.input.keyboard.on('keydown-SPACE', this._onSpace);
        this.input.keyboard.on('keydown-I', this._onI);
        this.input.keyboard.on('keydown-Q', this._onQ);
        this.input.keyboard.on('keydown-J', this._onJ);
        this.input.keyboard.on('keydown-M', this._onM);
        this.input.keyboard.on('keydown-ESC', this._onEsc);

        // Cleanup on scene shutdown to prevent listener accumulation
        this.events.on('shutdown', () => {
            this.input.keyboard.off('keydown-SPACE', this._onSpace);
            this.input.keyboard.off('keydown-I', this._onI);
            this.input.keyboard.off('keydown-Q', this._onQ);
            this.input.keyboard.off('keydown-J', this._onJ);
            this.input.keyboard.off('keydown-M', this._onM);
            this.input.keyboard.off('keydown-ESC', this._onEsc);
            for (const npc of this.npcs) { npc.destroy(); }
            this.npcs = [];
            this.waterTiles = [];
            // Null out refs — Phaser auto-destroys scene game objects on shutdown
            this.particleEmitters = [];
            // Remove tweens (safe during shutdown — tweens aren't auto-cleaned)
            if (this.envTweens) {
                for (const tween of this.envTweens) {
                    if (tween && !tween.isDestroyed) tween.remove();
                }
                this.envTweens = [];
            }
            // Clean up cutscene timer
            if (this.cutsceneWalkTimer) {
                this.cutsceneWalkTimer.remove();
                this.cutsceneWalkTimer = null;
            }
            // Null out env object refs — Phaser auto-destroys them
            this.envObjects = [];
        });

        // Start UI overlay scene
        const displayName = roomData.displayName || cityData.name;
        const displayDesc = roomData.displayName ? (roomData.description || '') : t(`cities.${this.cityId}`);
        this.scene.launch('UI', {
            dialogManager: this.dialogManager,
            questManager: this.questManager,
            inventoryManager: this.inventoryManager,
            cityName: displayName,
            cityDescription: displayDesc
        });

        // Check for quest triggers on entering city (only main room)
        if (this.roomId === 'main') {
            this.questManager.onEnterCity(this.cityId);
        }

        // Auto-save on entering city/room
        SaveManager.save(this.registry);

        // Fade in
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Auto-play intro cutscene on first new game in Paris
        const flags = this.registry.get('flags') || {};
        if (this.cityId === 'paris' && this.roomId === 'main' && !flags.quest_started) {
            this.playIntroSequence();
        }
    }

    buildTilemap(cityData) {
        const map = this.make.tilemap({
            tileWidth: TILE_W,
            tileHeight: TILE_H,
            width: cityData.width,
            height: cityData.height
        });

        const tileset = map.addTilesetImage('tileset', 'tileset', TILE_W, TILE_H, 0, 0);

        // Ground layer
        const groundLayer = map.createBlankLayer('ground', tileset);
        for (let y = 0; y < cityData.height; y++) {
            for (let x = 0; x < cityData.width; x++) {
                const tileIdx = cityData.ground[y][x];
                groundLayer.putTileAt(tileIdx, x, y);
            }
        }

        // Wall layer (collisions)
        this.wallLayer = map.createBlankLayer('walls', tileset);
        for (let y = 0; y < cityData.height; y++) {
            for (let x = 0; x < cityData.width; x++) {
                const tileIdx = cityData.walls[y][x];
                if (tileIdx >= 0) {
                    const tile = this.wallLayer.putTileAt(tileIdx, x, y);
                    tile.setCollision(true);
                }
            }
        }
        this.wallLayer.setCollisionBetween(0, 199);
        this.wallLayer.setDepth(2);

        // Decoration layer (no collision, visual only)
        this.decorLayer = map.createBlankLayer('decor', tileset);
        for (let y = 0; y < cityData.height; y++) {
            for (let x = 0; x < cityData.width; x++) {
                const tileIdx = cityData.decor[y][x];
                if (tileIdx >= 0) {
                    this.decorLayer.putTileAt(tileIdx, x, y);
                }
            }
        }
        this.decorLayer.setDepth(3);

        this.map = map;

        // Collect water tile positions for animation
        this.waterTiles = [];
        for (let y = 0; y < cityData.height; y++) {
            for (let x = 0; x < cityData.width; x++) {
                if (cityData.ground[y][x] === 2) {
                    this.waterTiles.push({ x, y });
                }
            }
        }
        this.waterFrame = 0;
        this.waterTimer = 0;
    }

    createNPCs() {
        const cityNPCs = NPC_DATA[this.cityId] || [];
        cityNPCs.forEach(npcData => {
            // Filter NPCs by room (default to 'main' if not specified)
            const npcRoom = npcData.room || 'main';
            if (npcRoom !== this.roomId) return;

            // Check if NPC should be visible based on quest state
            if (npcData.requiresFlag) {
                const flags = this.registry.get('flags') || {};
                if (!flags[npcData.requiresFlag]) return;
            }

            const npc = new NPC(this, npcData.x * TILE_W + TILE_W / 2, npcData.y * TILE_H + TILE_H / 2, npcData);
            this.npcs.push(npc);
            this.npcGroup.add(npc);
        });
    }

    createInteractables(roomData) {
        const roomPrefix = this.roomId === 'main' ? this.cityId : `${this.cityId}_${this.roomId}`;
        // Find chests, signs, doors, portals in decor layer
        for (let y = 0; y < roomData.height; y++) {
            for (let x = 0; x < roomData.width; x++) {
                const tileIdx = roomData.decor[y][x];
                if (tileIdx === 20) { // chest
                    this.interactables.push({
                        type: 'chest',
                        x: x * TILE_W + TILE_W / 2,
                        y: y * TILE_H + TILE_H / 2,
                        tileX: x,
                        tileY: y,
                        opened: false,
                        id: `${roomPrefix}_chest_${x}_${y}`
                    });
                } else if (tileIdx === 22) { // sign
                    this.interactables.push({
                        type: 'sign',
                        x: x * TILE_W + TILE_W / 2,
                        y: y * TILE_H + TILE_H / 2,
                        tileX: x,
                        tileY: y,
                        id: `${roomPrefix}_sign_${x}_${y}`
                    });
                } else if (tileIdx === 21) { // portal
                    this.interactables.push({
                        type: 'portal',
                        x: x * TILE_W + TILE_W / 2,
                        y: y * TILE_H + TILE_H / 2,
                        tileX: x,
                        tileY: y,
                        id: `${roomPrefix}_portal_${x}_${y}`
                    });
                } else if (tileIdx === 23) { // door (room transition)
                    const doorId = `${roomPrefix}_door_${x}_${y}`;
                    const transition = ROOM_TRANSITIONS[doorId];
                    if (transition) {
                        this.interactables.push({
                            type: 'door',
                            x: x * TILE_W + TILE_W / 2,
                            y: y * TILE_H + TILE_H / 2,
                            tileX: x,
                            tileY: y,
                            id: doorId,
                            transition
                        });
                    }
                }
            }
        }

        // Check for exit zones at map edges (only on main rooms)
        this.exitZones = [];
        if (this.roomId === 'main') {
            const exitX = Math.floor(roomData.width / 2 - 1) * TILE_W;
            this.exitZones.push({
                rect: new Phaser.Geom.Rectangle(exitX, (roomData.height - 1) * TILE_H, 3 * TILE_W, TILE_H),
                action: 'worldmap'
            });
        }
    }

    handleInteract() {
        // Don't handle SPACE if choice menu is open (UIScene handles it)
        if (this.dialogManager.choiceMode) return;

        if (this.dialogActive) {
            this.dialogManager.advance();
            return;
        }

        if (this.menuOpen) return;

        const facingPoint = this.player.getFacingPoint(24);

        // Check NPCs
        for (const npc of this.npcs) {
            const dist = Phaser.Math.Distance.Between(facingPoint.x, facingPoint.y, npc.x, npc.y);
            if (dist < 32) {
                this.startNPCDialog(npc);
                return;
            }
        }

        // Check interactables
        for (const obj of this.interactables) {
            const dist = Phaser.Math.Distance.Between(facingPoint.x, facingPoint.y, obj.x, obj.y);
            if (dist < 32) {
                this.interactWith(obj);
                return;
            }
        }
    }

    startNPCDialog(npc) {
        this.dialogActive = true;
        const dialogId = this.questManager.getNPCDialogId(npc.npcData.id) || npc.npcData.defaultDialog;
        this.dialogManager.startDialog(dialogId, npc.npcData.name, () => {
            this.dialogActive = false;
            this.questManager.onDialogComplete(npc.npcData.id, dialogId);
        });
    }

    interactWith(obj) {
        switch (obj.type) {
            case 'chest':
                this.openChest(obj);
                break;
            case 'sign':
                this.readSign(obj);
                break;
            case 'portal':
                this.usePortal(obj);
                break;
            case 'door':
                this.enterDoor(obj);
                break;
            case 'journal_page':
                this.collectJournalPage(obj);
                break;
            case 'bell':
                this.ringBell(obj);
                break;
            case 'painting':
                this.interactPainting(obj);
                break;
            case 'hidden_item':
                this.collectHiddenItem(obj);
                break;
        }
    }

    openChest(chest) {
        // Check persisted state
        const openedChests = this.registry.get('openedChests') || [];
        if (chest.opened || openedChests.includes(chest.id)) {
            chest.opened = true;
            this.dialogActive = true;
            this.dialogManager.showMessage(t('ui.chestEmpty'), () => {
                this.dialogActive = false;
            });
            return;
        }

        const reward = this.questManager.getChestReward(chest.id);
        if (reward) {
            chest.opened = true;
            openedChests.push(chest.id);
            this.registry.set('openedChests', openedChests);
            this.inventoryManager.addItem(reward);
            const itemText = getItemText(reward.id);
            const localName = itemText ? itemText.name : reward.name;
            this.dialogActive = true;
            this.dialogManager.showMessage(t('ui.chestFound', { name: localName }), () => {
                this.dialogActive = false;
                this.questManager.onItemFound(reward.id);
            });
        } else {
            this.dialogActive = true;
            this.dialogManager.showMessage(t('ui.chestLocked'), () => {
                this.dialogActive = false;
            });
        }
    }

    readSign(sign) {
        const text = this.getSignText(sign.id);
        this.dialogActive = true;
        this.dialogManager.showMessage(text, () => {
            this.dialogActive = false;
            // Some signs set flags when read
            const signFlags = {
                'tokyo_shrine_sign_5_4': 'tokyo_riddle_part3'
            };
            const flagToSet = signFlags[sign.id];
            if (flagToSet) {
                const flags = this.registry.get('flags') || {};
                if (!flags[flagToSet]) {
                    flags[flagToSet] = true;
                    this.registry.set('flags', flags);
                }
            }
        });
    }

    getSignText(signId) {
        // Try room-specific sign key first, then generic
        const text = t(`signs.${signId}`);
        return text !== `signs.${signId}` ? text : t('ui.signDefault');
    }

    usePortal(portal) {
        const flags = this.registry.get('flags') || {};
        if (flags.portal_unlocked) {
            this.dialogActive = true;
            this.dialogManager.showChoice(
                t('ui.portalActive'),
                this.getPortalDestinations(),
                (choice) => {
                    this.dialogActive = false;
                    if (choice !== 'cancel') {
                        this.travelToCity(choice);
                    }
                }
            );
        } else {
            this.dialogActive = true;
            this.dialogManager.showMessage(t('ui.portalInactive'), () => {
                this.dialogActive = false;
            });
        }
    }

    getPortalDestinations() {
        const unlocked = this.registry.get('unlockedCities') || ['paris'];
        const destinations = [];
        for (const cityId of unlocked) {
            if (cityId !== this.cityId) {
                destinations.push({ text: CITIES[cityId].name, value: cityId });
            }
        }
        destinations.push({ text: t('ui.cancel'), value: 'cancel' });
        return destinations;
    }

    toggleInventory() {
        if (this.dialogActive) return;
        const uiScene = this.scene.get('UI');
        if (uiScene) {
            uiScene.toggleInventory();
            this.menuOpen = uiScene.inventoryVisible;
        }
    }

    toggleQuestLog() {
        if (this.dialogActive) return;
        const uiScene = this.scene.get('UI');
        if (uiScene) {
            uiScene.toggleQuestLog();
            this.menuOpen = uiScene.questLogVisible;
        }
    }

    openWorldMap() {
        if (this.dialogActive || this.menuOpen) return;

        // Block world map in sub-rooms — only accessible from main room
        if (this.roomId !== 'main') return;

        const unlocked = this.registry.get('unlockedCities') || ['paris'];
        if (unlocked.length > 1) {
            this.dialogActive = true; // freeze player during transition
            this.scene.stop('UI');
            this.scene.start('WorldMap', { from: this.cityId });
        } else {
            this.dialogActive = true;
            this.dialogManager.showMessage(t('ui.noTravelRoutes'), () => {
                this.dialogActive = false;
            });
        }
    }

    handleEscape() {
        if (this.dialogActive) {
            this.dialogManager.advance();
        } else if (this.menuOpen) {
            const uiScene = this.scene.get('UI');
            if (uiScene) uiScene.closeAllMenus();
            this.menuOpen = false;
        }
    }

    enterDoor(door) {
        const transition = door.transition;
        // Check if door requires a flag
        if (transition.requiresFlag) {
            const flags = this.registry.get('flags') || {};
            if (!flags[transition.requiresFlag]) {
                this.dialogActive = true;
                const msg = transition.lockedMessage || t('ui.doorLocked');
                this.dialogManager.showMessage(msg, () => {
                    this.dialogActive = false;
                });
                return;
            }
        }
        this.enterRoom(transition.targetCity || this.cityId, transition.targetRoom, transition.spawnAt);
    }

    createJournalPages() {
        const cityPages = JOURNAL_PAGES[this.cityId] || [];
        const foundPages = this.registry.get('foundJournalPages') || [];

        for (const page of cityPages) {
            if (page.room !== this.roomId) continue;
            if (foundPages.includes(page.id)) continue; // already collected

            // Add as interactable
            this.interactables.push({
                type: 'journal_page',
                x: page.x * TILE_W + TILE_W / 2,
                y: page.y * TILE_H + TILE_H / 2,
                tileX: page.x,
                tileY: page.y,
                pageData: page,
                id: page.id
            });

            // Add shimmer visual effect
            const worldX = page.x * TILE_W + TILE_W / 2;
            const worldY = page.y * TILE_H + TILE_H / 2;
            const shimmer = this.add.rectangle(worldX, worldY, TILE_W - 4, TILE_H - 4, 0xf1c40f, 0.08);
            shimmer.setDepth(2);
            this.envObjects.push(shimmer);
            const tween = this.tweens.add({
                targets: shimmer,
                alpha: 0.25,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            this.envTweens.push(tween);
        }
    }

    collectJournalPage(obj) {
        const page = obj.pageData;
        const foundPages = this.registry.get('foundJournalPages') || [];

        if (foundPages.includes(page.id)) {
            this.dialogActive = true;
            this.dialogManager.showMessage(t('ui.journalPageAlready'), () => {
                this.dialogActive = false;
            });
            return;
        }

        // Mark as found
        foundPages.push(page.id);
        this.registry.set('foundJournalPages', foundPages);

        // Remove from interactables so it can't be picked up again
        const idx = this.interactables.indexOf(obj);
        if (idx >= 0) this.interactables.splice(idx, 1);

        // Show the page text
        this.dialogActive = true;
        this.dialogManager.showMessage(`${page.title}\n\n"${page.text}"`, () => {
            this.dialogActive = false;

            // Show notification
            const uiScene = this.scene.get('UI');
            if (uiScene && uiScene.showNotification) {
                const totalFound = foundPages.length;
                uiScene.showNotification(t('ui.journalPageFound') + ` (${totalFound}/15)`);
            }

            // Check if all 3 pages in this city are found
            const cityPages = JOURNAL_PAGES[this.cityId] || [];
            const cityPageIds = cityPages.map(p => p.id);
            const allCityFound = cityPageIds.every(id => foundPages.includes(id));
            if (allCityFound) {
                const flags = this.registry.get('flags') || {};
                flags[`${this.cityId}_pages_complete`] = true;
                this.registry.set('flags', flags);

                // Show bonus unlock notification after a short delay
                this.time.delayedCall(1500, () => {
                    const uiScene = this.scene.get('UI');
                    if (uiScene && uiScene.showNotification) {
                        const cityName = this.cityId.charAt(0).toUpperCase() + this.cityId.slice(1);
                        uiScene.showNotification(t('ui.journalBonusUnlocked', { city: cityName, npc: '' }));
                    }
                });
            }

            // Save progress
            SaveManager.save(this.registry);
        });
    }

    createPuzzleObjects() {
        const cityPuzzles = PUZZLE_OBJECTS[this.cityId] || [];
        const flags = this.registry.get('flags') || {};

        for (const obj of cityPuzzles) {
            if (obj.room !== this.roomId) continue;

            // Skip if puzzle already solved
            const puzzle = Object.values(PUZZLES).find(p => p.city === this.cityId && p.room === this.roomId && p.type === (obj.type === 'bell' ? 'bell_sequence' : 'painting_swap'));
            if (puzzle && flags[puzzle.completionFlag]) continue;

            const worldX = obj.x * TILE_W + TILE_W / 2;
            const worldY = obj.y * TILE_H + TILE_H / 2;

            this.interactables.push({
                type: obj.type,
                x: worldX,
                y: worldY,
                tileX: obj.x,
                tileY: obj.y,
                id: obj.id,
                label: obj.label,
                correctOrder: obj.correctOrder
            });

            if (obj.type === 'bell') {
                const bellColors = { bell_gold: 0xFFD700, bell_silver: 0xC0C0C0, bell_bronze: 0xCD7F32 };
                const color = bellColors[obj.id] || 0xFFD700;
                // Use sprite if available, fall back to procedural
                if (this.textures.exists(obj.id)) {
                    const bellSprite = this.add.image(worldX, worldY, obj.id);
                    bellSprite.setDepth(4);
                    this.envObjects.push(bellSprite);
                } else {
                    // Fallback: simple circle + base
                    const base = this.add.rectangle(worldX, worldY + 6, 20, 10, 0x4a3320);
                    base.setDepth(3);
                    this.envObjects.push(base);
                    const bell = this.add.circle(worldX, worldY - 2, 11, color);
                    bell.setDepth(4);
                    this.envObjects.push(bell);
                    const rim = this.add.rectangle(worldX, worldY + 4, 22, 4, color, 0.8);
                    rim.setDepth(4);
                    this.envObjects.push(rim);
                }
                // Subtle glow pulse
                const glow = this.add.circle(worldX, worldY - 2, 14, color, 0.15);
                glow.setDepth(3);
                this.envObjects.push(glow);
                const tween = this.tweens.add({
                    targets: glow,
                    alpha: 0.35,
                    scaleX: 1.3,
                    scaleY: 1.3,
                    duration: 1500,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                this.envTweens.push(tween);
            } else if (obj.type === 'painting') {
                // Draw visible painting: colored rectangle with frame
                const paintingColors = [0xc0392b, 0x2980b9, 0x27ae60, 0x8e44ad];
                const color = paintingColors[obj.correctOrder] || 0x3498db;
                // Frame (dark border)
                const frame = this.add.rectangle(worldX, worldY, TILE_W - 2, TILE_H - 2, 0x3d2b1f);
                frame.setDepth(3);
                this.envObjects.push(frame);
                // Canvas
                const canvas = this.add.rectangle(worldX, worldY, TILE_W - 8, TILE_H - 8, color);
                canvas.setDepth(4);
                this.envObjects.push(canvas);
                // Highlight detail
                const detail = this.add.rectangle(worldX, worldY - 4, 8, 8, 0xffffff, 0.4);
                detail.setDepth(4);
                this.envObjects.push(detail);
            }
        }

        // Initialize painting puzzle state if in London gallery
        if (this.cityId === 'london' && this.roomId === 'museum_gallery') {
            const puzzle = PUZZLES.london_paintings;
            if (puzzle && !flags[puzzle.completionFlag]) {
                this.paintingOrder = [...puzzle.initialOrder];
            }
        }
    }

    createHiddenItems() {
        const flags = this.registry.get('flags') || {};

        for (const item of HIDDEN_ITEMS) {
            if (item.city !== this.cityId || item.room !== this.roomId) continue;
            if (flags[item.setsFlag]) continue; // already collected
            if (item.requiresFlag && !flags[item.requiresFlag]) continue; // not yet available

            const worldX = item.x * TILE_W + TILE_W / 2;
            const worldY = item.y * TILE_H + TILE_H / 2;

            this.interactables.push({
                type: 'hidden_item',
                x: worldX,
                y: worldY,
                tileX: item.x,
                tileY: item.y,
                id: item.id,
                itemData: item
            });

            // Add shimmer visual (green for hidden items)
            const shimmer = this.add.rectangle(worldX, worldY, TILE_W - 4, TILE_H - 4, 0x2ecc71, 0.08);
            shimmer.setDepth(2);
            this.envObjects.push(shimmer);
            const tween = this.tweens.add({
                targets: shimmer,
                alpha: 0.25,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            this.envTweens.push(tween);
        }
    }

    ringBell(obj) {
        const flags = this.registry.get('flags') || {};
        if (flags.paris_bells_solved) {
            const bellName = obj.id.replace('bell_', '');
            this.dialogActive = true;
            this.dialogManager.startDialog('bell_ring_' + bellName, '', () => {
                this.dialogActive = false;
            });
            return;
        }

        // Show ring feedback
        const bellName = obj.id.replace('bell_', '');
        const bellKey = 'bell_ring_' + bellName;
        this.bellSequence.push(obj.id);

        this.dialogActive = true;
        this.dialogManager.startDialog(bellKey, '', () => {
            this.dialogActive = false;

            // Check sequence when 3 bells rung
            if (this.bellSequence.length >= 3) {
                const puzzle = PUZZLES.paris_bells;
                const correct = puzzle.correctSequence.every((id, i) => this.bellSequence[i] === id);

                this.dialogActive = true;
                if (correct) {
                    this.dialogManager.startDialog('bells_correct', '', () => {
                        this.dialogActive = false;
                        SaveManager.save(this.registry);
                    });
                } else {
                    this.dialogManager.startDialog('bells_wrong', '', () => {
                        this.dialogActive = false;
                    });
                }
                this.bellSequence = [];
            }
        });
    }

    interactPainting(obj) {
        const flags = this.registry.get('flags') || {};
        if (flags.london_paintings_solved || !this.paintingOrder) return;

        if (this.selectedPainting === null) {
            // Select first painting
            this.selectedPainting = obj.id;
            this.dialogActive = true;
            this.dialogManager.startDialog('painting_select', '', () => {
                this.dialogActive = false;
            });
        } else if (this.selectedPainting === obj.id) {
            // Deselect
            this.selectedPainting = null;
        } else {
            // Swap the two paintings
            const idx1 = this.paintingOrder.indexOf(this.selectedPainting);
            const idx2 = this.paintingOrder.indexOf(obj.id);
            if (idx1 >= 0 && idx2 >= 0) {
                [this.paintingOrder[idx1], this.paintingOrder[idx2]] = [this.paintingOrder[idx2], this.paintingOrder[idx1]];
            }
            this.selectedPainting = null;

            // Check if correct
            const puzzle = PUZZLES.london_paintings;
            const correct = puzzle.correctOrder.every((id, i) => this.paintingOrder[i] === id);

            this.dialogActive = true;
            if (correct) {
                this.dialogManager.startDialog('paintings_correct', '', () => {
                    this.dialogActive = false;
                    SaveManager.save(this.registry);
                });
            } else {
                this.dialogManager.startDialog('paintings_wrong', '', () => {
                    this.dialogActive = false;
                });
            }
        }
    }

    collectHiddenItem(obj) {
        const item = obj.itemData;
        const flags = this.registry.get('flags') || {};

        if (flags[item.setsFlag]) {
            this.dialogActive = true;
            this.dialogManager.showMessage(t('ui.chestEmpty'), () => {
                this.dialogActive = false;
            });
            return;
        }

        // Set flag and give item
        flags[item.setsFlag] = true;
        this.registry.set('flags', flags);
        this.inventoryManager.addItem(item.item);

        // Remove from interactables
        const idx = this.interactables.indexOf(obj);
        if (idx >= 0) this.interactables.splice(idx, 1);

        // Show notification
        const itemText = getItemText(item.item.id);
        const localName = itemText ? itemText.name : item.item.name;
        this.dialogActive = true;
        this.dialogManager.showMessage(t('ui.hiddenItemCollected', { name: localName }), () => {
            this.dialogActive = false;
            SaveManager.save(this.registry);
        });
    }

    toggleJournal() {
        if (this.dialogActive) return;
        const uiScene = this.scene.get('UI');
        if (uiScene) {
            uiScene.toggleJournal();
            this.menuOpen = uiScene.journalVisible;
        }
    }

    enterRoom(cityId, roomId, spawnAt) {
        this.dialogActive = true; // freeze player during fade
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.stop('UI');
            this.scene.restart({ city: cityId, room: roomId, spawnAt: spawnAt || null });
        });
    }

    travelToCity(cityId) {
        this.dialogActive = true; // freeze player during fade
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.stop('UI');
            this.scene.restart({ city: cityId, room: 'main' });
        });
    }

    createParticles(cityData) {
        this.particleEmitters = [];

        // Scan for special tiles
        for (let y = 0; y < cityData.height; y++) {
            for (let x = 0; x < cityData.width; x++) {
                const wallTile = cityData.walls[y][x];
                const decorTile = cityData.decor[y][x];
                const worldX = x * TILE_W + TILE_W / 2;
                const worldY = y * TILE_H + TILE_H / 2;

                // Fountain particles (tile 18)
                if (wallTile === 18) {
                    const emitter = this.add.particles(worldX, worldY - TILE_H / 2, 'particle_white', {
                        speed: { min: 15, max: 40 },
                        angle: { min: 250, max: 290 },
                        lifespan: 800,
                        frequency: 60,
                        quantity: 1,
                        scale: { start: 1.2, end: 0.3 },
                        alpha: { start: 0.8, end: 0 },
                        gravityY: 60
                    });
                    emitter.setDepth(6);
                    this.particleEmitters.push(emitter);
                }

                // Portal sparkle (decor tile 21)
                if (decorTile === 21) {
                    const emitter = this.add.particles(worldX, worldY, 'particle_sparkle', {
                        speed: { min: 8, max: 25 },
                        angle: { min: 0, max: 360 },
                        lifespan: 1000,
                        frequency: 150,
                        quantity: 1,
                        scale: { start: 1.0, end: 0.2 },
                        alpha: { start: 0.9, end: 0 },
                        tint: [0xc39bd3, 0xf4ecf7, 0x8e44ad]
                    });
                    emitter.setDepth(6);
                    this.particleEmitters.push(emitter);
                }
            }
        }

        // Cherry blossom petals in Tokyo
        if (this.cityId === 'tokyo') {
            const emitter = this.add.particles(cityData.width * TILE_W / 2, 0, 'particle_petal', {
                emitZone: {
                    type: 'random',
                    source: new Phaser.Geom.Rectangle(0, 0, cityData.width * TILE_W, TILE_H)
                },
                speedX: { min: 8, max: 25 },
                speedY: { min: 15, max: 40 },
                lifespan: 5000,
                frequency: 250,
                quantity: 1,
                scale: { start: 0.8, end: 0.4 },
                alpha: { start: 0.7, end: 0 },
                rotate: { min: 0, max: 360 }
            });
            emitter.setDepth(8);
            this.particleEmitters.push(emitter);
        }

        // Falling leaves in Paris
        if (this.cityId === 'paris') {
            const emitter = this.add.particles(cityData.width * TILE_W / 2, 0, 'particle_leaf', {
                emitZone: {
                    type: 'random',
                    source: new Phaser.Geom.Rectangle(0, 0, cityData.width * TILE_W, TILE_H)
                },
                speedX: { min: -15, max: 20 },
                speedY: { min: 12, max: 30 },
                lifespan: 6000,
                frequency: 500,
                quantity: 1,
                scale: { start: 0.9, end: 0.5 },
                alpha: { start: 0.6, end: 0 },
                rotate: { min: 0, max: 360 }
            });
            emitter.setDepth(8);
            this.particleEmitters.push(emitter);
        }

        // Light rain in London
        if (this.cityId === 'london') {
            const emitter = this.add.particles(cityData.width * TILE_W / 2, 0, 'particle_rain', {
                emitZone: {
                    type: 'random',
                    source: new Phaser.Geom.Rectangle(0, 0, cityData.width * TILE_W, TILE_H)
                },
                speedX: { min: 3, max: 8 },
                speedY: { min: 80, max: 140 },
                lifespan: 1500,
                frequency: 40,
                quantity: 1,
                scale: { start: 1.0, end: 0.8 },
                alpha: { start: 0.4, end: 0 }
            });
            emitter.setDepth(8);
            this.particleEmitters.push(emitter);
        }

        // Golden dust motes in Rome
        if (this.cityId === 'rome') {
            const emitter = this.add.particles(cityData.width * TILE_W / 2, cityData.height * TILE_H / 2, 'particle_golden', {
                emitZone: {
                    type: 'random',
                    source: new Phaser.Geom.Rectangle(0, 0, cityData.width * TILE_W, cityData.height * TILE_H)
                },
                speedY: { min: -8, max: -18 },
                speedX: { min: -4, max: 4 },
                lifespan: 4000,
                frequency: 300,
                quantity: 1,
                scale: { start: 0.8, end: 0.3 },
                alpha: { start: 0.5, end: 0 },
                blendMode: 'ADD'
            });
            emitter.setDepth(8);
            this.particleEmitters.push(emitter);
        }

        // Sand wisps in Marrakech
        if (this.cityId === 'marrakech') {
            const emitter = this.add.particles(0, cityData.height * TILE_H / 2, 'particle_sand', {
                emitZone: {
                    type: 'random',
                    source: new Phaser.Geom.Rectangle(0, 0, TILE_W, cityData.height * TILE_H)
                },
                speedX: { min: 20, max: 50 },
                speedY: { min: -5, max: 5 },
                lifespan: 4000,
                frequency: 350,
                quantity: 1,
                scale: { start: 1.0, end: 0.4 },
                alpha: { start: 0.35, end: 0 },
                rotate: { min: -10, max: 10 }
            });
            emitter.setDepth(8);
            this.particleEmitters.push(emitter);
        }

        // Ambient dust motes (all cities)
        const dustEmitter = this.add.particles(cityData.width * TILE_W / 2, cityData.height * TILE_H / 2, 'particle_dust', {
            emitZone: {
                type: 'random',
                source: new Phaser.Geom.Rectangle(0, 0, cityData.width * TILE_W, cityData.height * TILE_H)
            },
            speedY: { min: -5, max: -12 },
            speedX: { min: -3, max: 3 },
            lifespan: 3500,
            frequency: 400,
            quantity: 1,
            scale: { start: 0.6, end: 0.2 },
            alpha: { start: 0.3, end: 0 },
            blendMode: 'ADD'
        });
        dustEmitter.setDepth(7);
        this.particleEmitters.push(dustEmitter);
    }

    createEnvironmentalAnimations(cityData) {
        this.envTweens = [];
        this.envObjects = [];

        // Water shimmer overlays — one per water tile, staggered phase
        if (this.waterTiles) {
            for (let i = 0; i < this.waterTiles.length; i++) {
                const wt = this.waterTiles[i];
                const wx = wt.x * TILE_W + TILE_W / 2;
                const wy = wt.y * TILE_H + TILE_H / 2;
                const shimmer = this.add.rectangle(wx, wy, TILE_W, TILE_H, 0x80c0ff, 0);
                shimmer.setDepth(1);
                this.envObjects.push(shimmer);
                const tween = this.tweens.add({
                    targets: shimmer,
                    alpha: 0.15,
                    duration: 800 + (i % 5) * 200,
                    yoyo: true,
                    repeat: -1,
                    delay: (i % 7) * 150,
                    ease: 'Sine.easeInOut'
                });
                this.envTweens.push(tween);
            }
        }

        for (let y = 0; y < cityData.height; y++) {
            for (let x = 0; x < cityData.width; x++) {
                const decorTile = cityData.decor[y][x];
                const worldX = x * TILE_W + TILE_W / 2;
                const worldY = y * TILE_H + TILE_H / 2;

                // Chest pulsing glow
                if (decorTile === 20) {
                    const glow = this.add.rectangle(worldX, worldY, TILE_W, TILE_H, 0xFFD700, 0.05);
                    glow.setDepth(2);
                    this.envObjects.push(glow);
                    const tween = this.tweens.add({
                        targets: glow,
                        alpha: 0.15,
                        scaleX: 1.3,
                        scaleY: 1.3,
                        duration: 1200,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut'
                    });
                    this.envTweens.push(tween);
                }

                // Portal pulsing glow
                if (decorTile === 21) {
                    const glow = this.add.rectangle(worldX, worldY, TILE_W, TILE_H, 0x8E44AD, 0.05);
                    glow.setDepth(2);
                    this.envObjects.push(glow);
                    const tween = this.tweens.add({
                        targets: glow,
                        alpha: 0.2,
                        scaleX: 1.5,
                        scaleY: 1.5,
                        duration: 1500,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut'
                    });
                    this.envTweens.push(tween);
                }

                // Street lamp flicker (tile 28)
                if (decorTile === 28) {
                    const light = this.add.rectangle(worldX, worldY - 8, 24, 20, 0xFFEE88, 0.2);
                    light.setDepth(2);
                    this.envObjects.push(light);
                    const tween = this.tweens.add({
                        targets: light,
                        alpha: 0.4,
                        duration: 200 + Math.random() * 200,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut'
                    });
                    this.envTweens.push(tween);
                }

                // Flower sway (tile 17)
                if (decorTile === 17) {
                    const glow = this.add.rectangle(worldX, worldY + 4, TILE_W - 4, TILE_H - 4, 0xF39C12, 0.0);
                    glow.setDepth(2);
                    this.envObjects.push(glow);
                    const tween = this.tweens.add({
                        targets: glow,
                        alpha: 0.12,
                        scaleX: 1.15,
                        duration: 1800 + Math.random() * 600,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut',
                        delay: Math.random() * 1000
                    });
                    this.envTweens.push(tween);
                }

                // Lantern warm glow (tile 60)
                if (decorTile === 60) {
                    const glow = this.add.rectangle(worldX, worldY, TILE_W + 8, TILE_H + 8, 0xFFAA44, 0.08);
                    glow.setDepth(2);
                    this.envObjects.push(glow);
                    const tween = this.tweens.add({
                        targets: glow,
                        alpha: 0.22,
                        scaleX: 1.2,
                        scaleY: 1.2,
                        duration: 1000 + Math.random() * 400,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut',
                        delay: Math.random() * 800
                    });
                    this.envTweens.push(tween);
                }

                // Market stall warm ambience (tile 50)
                if (decorTile === 50 || (cityData.walls && cityData.walls[y] && cityData.walls[y][x] === 50)) {
                    const glow = this.add.rectangle(worldX, worldY + TILE_H / 2, TILE_W + 12, TILE_H, 0xE08830, 0.04);
                    glow.setDepth(2);
                    this.envObjects.push(glow);
                    const tween = this.tweens.add({
                        targets: glow,
                        alpha: 0.1,
                        duration: 2000,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut'
                    });
                    this.envTweens.push(tween);
                }

                // Vine sway (tile 45)
                if (decorTile === 45) {
                    const glow = this.add.rectangle(worldX, worldY, TILE_W, TILE_H, 0x4AAA40, 0.0);
                    glow.setDepth(2);
                    this.envObjects.push(glow);
                    const tween = this.tweens.add({
                        targets: glow,
                        alpha: 0.08,
                        scaleX: 1.08,
                        duration: 2200 + Math.random() * 800,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut',
                        delay: Math.random() * 1500
                    });
                    this.envTweens.push(tween);
                }
            }
        }
    }

    playIntroSequence() {
        this.dialogActive = true; // freeze player movement

        // Find grandma NPC
        const grandma = this.npcs.find(n => n.npcData.id === 'paris_grandma');
        if (!grandma) {
            this.dialogActive = false;
            return;
        }

        // Make player face left (toward approaching grandma)
        this.player.anims.play('player_idle_left', true);
        this.player.direction = 'left';

        // Place grandma at left edge of the open corridor (x=20..29 is wall-free at y=33)
        const startTileX = 20;
        const playerTileY = Math.round(this.player.y / TILE_H);
        grandma.setPosition(startTileX * TILE_W + TILE_W / 2, playerTileY * TILE_H + TILE_H / 2);
        grandma.body.reset(grandma.x, grandma.y);
        grandma.updateIndicatorPosition();
        grandma.setInteractable(false);
        grandma.cutsceneWalking = true;

        // Wait for fade-in to complete, then start the walk
        this.cameras.main.once('camerafadeincomplete', () => {
            this.time.delayedCall(800, () => {
                const targetTileX = 27;
                this.startGrandmaWalk(grandma, targetTileX * TILE_W + TILE_W / 2, grandma.y);
            });
        });
    }

    startGrandmaWalk(grandma, targetX, targetY) {
        // Walk animation: cycle right-walk frames [8, 9, 8, 11]
        const walkFrames = [8, 9, 8, 11];
        let frameIndex = 0;
        this.cutsceneWalkTimer = this.time.addEvent({
            delay: 150,
            callback: () => {
                grandma.setFrame(walkFrames[frameIndex]);
                frameIndex = (frameIndex + 1) % walkFrames.length;
            },
            loop: true
        });

        // Tween grandma to target position
        this.tweens.add({
            targets: grandma,
            x: targetX,
            y: targetY,
            duration: 2500,
            ease: 'Linear',
            onUpdate: () => {
                // Sync static body and indicator with sprite position
                grandma.body.reset(grandma.x, grandma.y);
                grandma.updateIndicatorPosition();
            },
            onComplete: () => {
                // Stop walk animation
                if (this.cutsceneWalkTimer) {
                    this.cutsceneWalkTimer.remove();
                    this.cutsceneWalkTimer = null;
                }
                // Final body sync at resting position
                grandma.body.reset(grandma.x, grandma.y);
                grandma.updateIndicatorPosition();
                // Set idle right-facing frame (grandma faces player)
                grandma.setFrame(8);
                grandma.cutsceneWalking = false;

                // Short pause before dialog
                this.time.delayedCall(400, () => {
                    this.startGrandmaCutsceneDialog(grandma);
                });
            }
        });
    }

    startGrandmaCutsceneDialog(grandma) {
        this.dialogManager.startDialog('grandma_intro', grandma.npcData.name, () => {
            this.dialogActive = false;
            this.questManager.onDialogComplete('paris_grandma', 'grandma_intro');
        });
    }

    update(time, delta) {
        this.player.update();

        // Animate water tiles (must update BOTH ground and wall layers —
        // wall layer at depth 2 covers ground, so both must cycle)
        if (this.waterTiles && this.waterTiles.length > 0) {
            this.waterTimer += delta;
            if (this.waterTimer > 350) {
                this.waterTimer = 0;
                this.waterFrame = (this.waterFrame + 1) % 3;
                const waterIndices = [2, 64, 65];
                const tileIdx = waterIndices[this.waterFrame];
                const groundLayer = this.map.getLayer('ground').tilemapLayer;
                const wallLayer = this.map.getLayer('walls').tilemapLayer;
                for (const wt of this.waterTiles) {
                    groundLayer.putTileAt(tileIdx, wt.x, wt.y);
                    const wallTile = wallLayer.putTileAt(tileIdx, wt.x, wt.y);
                    wallTile.setCollision(true);
                }
            }
        }

        // Check exit zones (only trigger once per entry)
        let inExitZone = false;
        for (const zone of this.exitZones) {
            if (Phaser.Geom.Rectangle.Contains(zone.rect, this.player.x, this.player.y)) {
                inExitZone = true;
                if (!this.exitTriggered && zone.action === 'worldmap') {
                    this.exitTriggered = true;
                    this.openWorldMap();
                }
            }
        }
        if (!inExitZone) {
            this.exitTriggered = false;
        }

        // Update NPC interaction indicators and UI labels
        const facingPoint = this.player.getFacingPoint(24);
        const cam = this.cameras.main;
        const npcLabels = [];
        for (const npc of this.npcs) {
            const dist = Phaser.Math.Distance.Between(facingPoint.x, facingPoint.y, npc.x, npc.y);
            const canInteract = dist < 32;
            npc.setInteractable(canInteract);
            if (canInteract) {
                // Convert world position to screen position for UIScene (zoom 1)
                const screenX = (npc.x - cam.worldView.x) * cam.zoom;
                const screenY = (npc.y - cam.worldView.y) * cam.zoom + 40;
                npcLabels.push({ name: npc.npcData.name, screenX, screenY });
            }
        }
        const uiScene = this.scene.get('UI');
        if (uiScene && uiScene.updateNPCLabels) {
            uiScene.updateNPCLabels(npcLabels);
        }
    }
}
