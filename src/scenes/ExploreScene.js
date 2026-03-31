import { Player } from '../entities/Player.js';
import { NPC } from '../entities/NPC.js';
import { CITIES, ROOM_TRANSITIONS } from '../data/cities.js';
import { NPC_DATA } from '../data/npcs.js';
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

        // Input for interaction (store refs for cleanup)
        this._onSpace = () => this.handleInteract();
        this._onI = () => this.toggleInventory();
        this._onQ = () => this.toggleQuestLog();
        this._onM = () => this.openWorldMap();
        this._onEsc = () => this.handleEscape();
        this.input.keyboard.on('keydown-SPACE', this._onSpace);
        this.input.keyboard.on('keydown-I', this._onI);
        this.input.keyboard.on('keydown-Q', this._onQ);
        this.input.keyboard.on('keydown-M', this._onM);
        this.input.keyboard.on('keydown-ESC', this._onEsc);

        // Cleanup on scene shutdown to prevent listener accumulation
        this.events.on('shutdown', () => {
            this.input.keyboard.off('keydown-SPACE', this._onSpace);
            this.input.keyboard.off('keydown-I', this._onI);
            this.input.keyboard.off('keydown-Q', this._onQ);
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
        this.wallLayer.setCollisionBetween(0, 63);
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
            }
        }
    }

    update(time, delta) {
        this.player.update();

        // Animate water tiles
        if (this.waterTiles && this.waterTiles.length > 0) {
            this.waterTimer += delta;
            if (this.waterTimer > 500) {
                this.waterTimer = 0;
                this.waterFrame = (this.waterFrame + 1) % 3;
                const waterIndices = [2, 64, 65];
                const tileIdx = waterIndices[this.waterFrame];
                const groundLayer = this.map.getLayer('ground').tilemapLayer;
                for (const wt of this.waterTiles) {
                    groundLayer.putTileAt(tileIdx, wt.x, wt.y);
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
