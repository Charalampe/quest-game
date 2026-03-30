import { Player } from '../entities/Player.js';
import { NPC } from '../entities/NPC.js';
import { CITIES } from '../data/cities.js';
import { NPC_DATA } from '../data/npcs.js';
import { DialogManager } from '../systems/DialogManager.js';
import { QuestManager } from '../systems/QuestManager.js';
import { InventoryManager } from '../systems/InventoryManager.js';
import { SaveManager } from '../systems/SaveManager.js';

export class ExploreScene extends Phaser.Scene {
    constructor() {
        super('Explore');
    }

    init(data) {
        this.cityId = data.city || 'paris';
        this.dialogActive = false;
        this.menuOpen = false;
        this.exitTriggered = false;
    }

    create() {
        const cityData = CITIES[this.cityId];
        if (!cityData) return;

        this.registry.set('currentCity', this.cityId);

        // Track visited cities
        const visited = this.registry.get('visitedCities') || ['paris'];
        if (!visited.includes(this.cityId)) {
            visited.push(this.cityId);
            this.registry.set('visitedCities', visited);
        }

        // Create tilemap from city data
        this.buildTilemap(cityData);

        // Create player
        const startX = cityData.playerStart.x * 16 + 8;
        const startY = cityData.playerStart.y * 16 + 8;
        this.player = new Player(this, startX, startY);
        this.player.setDepth(5);

        // Camera follows player (zoom 3 for pixel art)
        this.cameras.main.setZoom(3);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setBounds(0, 0, cityData.width * 16, cityData.height * 16);
        this.physics.world.setBounds(0, 0, cityData.width * 16, cityData.height * 16);

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
        this.createInteractables(cityData);

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
        });

        // Start UI overlay scene
        this.scene.launch('UI', {
            dialogManager: this.dialogManager,
            questManager: this.questManager,
            inventoryManager: this.inventoryManager,
            cityName: cityData.name,
            cityDescription: cityData.description
        });

        // Check for quest triggers on entering city
        this.questManager.onEnterCity(this.cityId);

        // Auto-save on entering city
        SaveManager.save(this.registry);

        // Fade in
        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    buildTilemap(cityData) {
        const map = this.make.tilemap({
            tileWidth: 16,
            tileHeight: 16,
            width: cityData.width,
            height: cityData.height
        });

        const tileset = map.addTilesetImage('tileset', 'tileset', 16, 16, 0, 0);

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
    }

    createNPCs() {
        const cityNPCs = NPC_DATA[this.cityId] || [];
        cityNPCs.forEach(npcData => {
            // Check if NPC should be visible based on quest state
            if (npcData.requiresFlag) {
                const flags = this.registry.get('flags') || {};
                if (!flags[npcData.requiresFlag]) return;
            }

            const npc = new NPC(this, npcData.x * 16 + 8, npcData.y * 16 + 8, npcData);
            this.npcs.push(npc);
            this.npcGroup.add(npc);
        });
    }

    createInteractables(cityData) {
        // Find chests, signs, doors in decor layer
        for (let y = 0; y < cityData.height; y++) {
            for (let x = 0; x < cityData.width; x++) {
                const tileIdx = cityData.decor[y][x];
                if (tileIdx === 20) { // chest
                    this.interactables.push({
                        type: 'chest',
                        x: x * 16 + 8,
                        y: y * 16 + 8,
                        tileX: x,
                        tileY: y,
                        opened: false,
                        id: `${this.cityId}_chest_${x}_${y}`
                    });
                } else if (tileIdx === 22) { // sign
                    this.interactables.push({
                        type: 'sign',
                        x: x * 16 + 8,
                        y: y * 16 + 8,
                        tileX: x,
                        tileY: y,
                        id: `${this.cityId}_sign_${x}_${y}`
                    });
                } else if (tileIdx === 21) { // portal
                    this.interactables.push({
                        type: 'portal',
                        x: x * 16 + 8,
                        y: y * 16 + 8,
                        tileX: x,
                        tileY: y,
                        id: `${this.cityId}_portal_${x}_${y}`
                    });
                }
            }
        }

        // Check for exit zones at map edges
        this.exitZones = [];
        // South exit
        this.exitZones.push({
            rect: new Phaser.Geom.Rectangle(13 * 16, (cityData.height - 1) * 16, 3 * 16, 16),
            action: 'worldmap'
        });
    }

    handleInteract() {
        if (this.dialogActive) {
            this.dialogManager.advance();
            return;
        }

        if (this.menuOpen) return;

        const facingPoint = this.player.getFacingPoint(12);

        // Check NPCs
        for (const npc of this.npcs) {
            const dist = Phaser.Math.Distance.Between(facingPoint.x, facingPoint.y, npc.x, npc.y);
            if (dist < 16) {
                this.startNPCDialog(npc);
                return;
            }
        }

        // Check interactables
        for (const obj of this.interactables) {
            const dist = Phaser.Math.Distance.Between(facingPoint.x, facingPoint.y, obj.x, obj.y);
            if (dist < 16) {
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
        }
    }

    openChest(chest) {
        // Check persisted state
        const openedChests = this.registry.get('openedChests') || [];
        if (chest.opened || openedChests.includes(chest.id)) {
            chest.opened = true;
            this.dialogActive = true;
            this.dialogManager.showMessage("The chest is empty.", () => {
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
            this.dialogActive = true;
            this.dialogManager.showMessage(`Found: ${reward.name}!`, () => {
                this.dialogActive = false;
                this.questManager.onItemFound(reward.id);
            });
        } else {
            this.dialogActive = true;
            this.dialogManager.showMessage("The chest is locked.", () => {
                this.dialogActive = false;
            });
        }
    }

    readSign(sign) {
        const text = this.getSignText(sign.id);
        this.dialogActive = true;
        this.dialogManager.showMessage(text, () => {
            this.dialogActive = false;
        });
    }

    getSignText(signId) {
        const signs = {
            'paris_sign_4_12': 'Librairie du Pont - Books & Maps',
            'paris_sign_27_12': "Grand-m\u00E8re's House",
            'london_sign_14_5': 'The British Museum - Est. 1753',
            'rome_sign_14_9': 'Fontana di Trevi - Make a Wish',
            'marrakech_sign_23_7': "Merchant of Wonders",
            'tokyo_sign_14_5': 'Secret Garden - Enter with Care'
        };
        return signs[signId] || 'A weathered sign.';
    }

    usePortal(portal) {
        const flags = this.registry.get('flags') || {};
        if (flags.portal_unlocked) {
            this.dialogActive = true;
            this.dialogManager.showChoice(
                'The portal shimmers with magical energy. Where do you want to go?',
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
            this.dialogManager.showMessage('A strange shimmer hangs in the air, but nothing happens...', () => {
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
        destinations.push({ text: 'Cancel', value: 'cancel' });
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

        const unlocked = this.registry.get('unlockedCities') || ['paris'];
        if (unlocked.length > 1) {
            this.scene.stop('UI');
            this.scene.start('WorldMap', { from: this.cityId });
        } else {
            this.dialogActive = true;
            this.dialogManager.showMessage("You haven't unlocked any travel routes yet.", () => {
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

    travelToCity(cityId) {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.stop('UI');
            this.scene.restart({ city: cityId });
        });
    }

    update() {
        this.player.update();

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
        const facingPoint = this.player.getFacingPoint(12);
        const cam = this.cameras.main;
        const npcLabels = [];
        for (const npc of this.npcs) {
            const dist = Phaser.Math.Distance.Between(facingPoint.x, facingPoint.y, npc.x, npc.y);
            const canInteract = dist < 16;
            npc.setInteractable(canInteract);
            if (canInteract) {
                // Convert world position to screen position for UIScene (zoom 1)
                const screenX = (npc.x - cam.worldView.x) * cam.zoom;
                const screenY = (npc.y - cam.worldView.y) * cam.zoom + 30;
                npcLabels.push({ name: npc.npcData.name, screenX, screenY });
            }
        }
        const uiScene = this.scene.get('UI');
        if (uiScene && uiScene.updateNPCLabels) {
            uiScene.updateNPCLabels(npcLabels);
        }
    }
}
