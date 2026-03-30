export class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Show loading text
        const { width, height } = this.cameras.main;
        this.add.text(width / 2, height / 2, 'Loading...', {
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#ccaaff'
        }).setOrigin(0.5);
    }

    generateAssets() {
        this.generatePlayerSpritesheet();
        this.generateNPCSpritesheet();
        this.generateTileset();
        this.generateUIAssets();
        this.generateWorldMapAssets();
        this.generateItemIcons();
    }

    generatePlayerSpritesheet() {
        const frameW = 16, frameH = 16;
        const canvas = this.textures.createCanvas('player', frameW * 4, frameH * 4);
        const ctx = canvas.getContext();

        // 4 directions x 4 frames: down, left, right, up
        const dirs = [
            { hair: '#8B4513', facing: 'down' },
            { hair: '#8B4513', facing: 'left' },
            { hair: '#8B4513', facing: 'right' },
            { hair: '#8B4513', facing: 'up' }
        ];

        dirs.forEach((dir, row) => {
            for (let col = 0; col < 4; col++) {
                const x = col * frameW;
                const y = row * frameH;
                this.drawCharacter(ctx, x, y, frameW, frameH, {
                    hair: '#8B4513',
                    skin: '#FDBCB4',
                    shirt: '#E84393',
                    skirt: '#6C5CE7',
                    facing: dir.facing,
                    frame: col
                });
            }
        });

        canvas.refresh();

        // Create individual frames for the spritesheet (4 dirs x 4 frames)
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const frameIndex = row * 4 + col;
                this.textures.get('player').add(frameIndex, 0, col * frameW, row * frameH, frameW, frameH);
            }
        }
    }

    drawCharacter(ctx, x, y, w, h, opts) {
        const cx = x + w / 2;
        const bobOffset = (opts.frame === 1 || opts.frame === 3) ? -1 : 0;

        // Hair
        ctx.fillStyle = opts.hair;
        ctx.fillRect(cx - 4, y + 1 + bobOffset, 8, 4);

        // Head / skin
        ctx.fillStyle = opts.skin;
        ctx.fillRect(cx - 3, y + 2 + bobOffset, 6, 5);

        // Eyes
        if (opts.facing !== 'up') {
            ctx.fillStyle = '#2d3436';
            if (opts.facing === 'down') {
                ctx.fillRect(cx - 2, y + 4 + bobOffset, 1, 1);
                ctx.fillRect(cx + 1, y + 4 + bobOffset, 1, 1);
            } else if (opts.facing === 'left') {
                ctx.fillRect(cx - 2, y + 4 + bobOffset, 1, 1);
            } else {
                ctx.fillRect(cx + 2, y + 4 + bobOffset, 1, 1);
            }
        }

        // Shirt
        ctx.fillStyle = opts.shirt;
        ctx.fillRect(cx - 4, y + 7 + bobOffset, 8, 4);

        // Skirt
        ctx.fillStyle = opts.skirt;
        ctx.fillRect(cx - 4, y + 11 + bobOffset, 8, 2);

        // Legs with walking animation
        ctx.fillStyle = opts.skin;
        const legOffset = (opts.frame === 1) ? 1 : (opts.frame === 3) ? -1 : 0;
        ctx.fillRect(cx - 2 + legOffset, y + 13 + bobOffset, 2, 2);
        ctx.fillRect(cx + 0 - legOffset, y + 13 + bobOffset, 2, 2);
    }

    generateNPCSpritesheet() {
        const frameW = 16, frameH = 16;
        // 6 NPC types, 2 frames each (idle animation)
        const npcDefs = [
            { name: 'librarian', hair: '#444444', shirt: '#2ecc71', skirt: '#27ae60' },
            { name: 'curator', hair: '#d4a574', shirt: '#3498db', skirt: '#2980b9' },
            { name: 'merchant', hair: '#1a1a1a', shirt: '#e67e22', skirt: '#d35400' },
            { name: 'guide', hair: '#c0392b', shirt: '#f1c40f', skirt: '#f39c12' },
            { name: 'gardener', hair: '#2c3e50', shirt: '#1abc9c', skirt: '#16a085' },
            { name: 'grandma', hair: '#bdc3c7', shirt: '#9b59b6', skirt: '#8e44ad' }
        ];

        npcDefs.forEach((npc, index) => {
            const canvas = this.textures.createCanvas(`npc_${npc.name}`, frameW * 2, frameH);
            const ctx = canvas.getContext();

            for (let frame = 0; frame < 2; frame++) {
                this.drawCharacter(ctx, frame * frameW, 0, frameW, frameH, {
                    hair: npc.hair,
                    skin: '#FDBCB4',
                    shirt: npc.shirt,
                    skirt: npc.skirt,
                    facing: 'down',
                    frame: frame
                });
            }

            canvas.refresh();
            this.textures.get(`npc_${npc.name}`).add(0, 0, 0, 0, frameW, frameH);
            this.textures.get(`npc_${npc.name}`).add(1, 0, frameW, 0, frameW, frameH);
        });
    }

    generateTileset() {
        const tileSize = 16;
        const cols = 8;
        const rows = 8;
        const canvas = this.textures.createCanvas('tileset', tileSize * cols, tileSize * rows);
        const ctx = canvas.getContext();

        const tiles = [
            // Row 0: ground tiles
            { color: '#c8b88a', detail: 'cobble' },   // 0: cobblestone
            { color: '#4a8c3f', detail: 'grass' },     // 1: grass
            { color: '#3b7dd8', detail: 'water' },     // 2: water
            { color: '#d4c5a0', detail: 'sand' },      // 3: sand
            { color: '#8B7355', detail: null },         // 4: dirt path
            { color: '#555555', detail: null },         // 5: dark stone
            { color: '#DEB887', detail: null },         // 6: wood floor
            { color: '#404040', detail: null },         // 7: dark floor

            // Row 1: building/wall tiles
            { color: '#d4c4a8', detail: 'brick' },     // 8: beige wall
            { color: '#a0522d', detail: 'brick' },     // 9: brown wall
            { color: '#708090', detail: 'brick' },     // 10: grey wall
            { color: '#c0392b', detail: 'brick' },     // 11: red wall
            { color: '#6c3483', detail: 'brick' },     // 12: purple wall (marrakech)
            { color: '#2e86c1', detail: 'brick' },     // 13: blue wall
            { color: '#f0e6d3', detail: 'brick' },     // 14: white wall (rome)
            { color: '#e74c3c', detail: null },         // 15: red roof

            // Row 2: decorative/interactive
            { color: '#2ecc71', detail: 'tree' },       // 16: tree
            { color: '#f39c12', detail: 'flower' },     // 17: flower
            { color: '#7f8c8d', detail: 'fountain' },   // 18: fountain
            { color: '#95a5a6', detail: 'statue' },     // 19: statue
            { color: '#d4a017', detail: 'chest' },      // 20: chest
            { color: '#8e44ad', detail: 'portal' },     // 21: portal
            { color: '#e67e22', detail: 'sign' },       // 22: sign
            { color: '#3498db', detail: 'door' },       // 23: door

            // Row 3: Paris-specific
            { color: '#2c3e50', detail: 'eiffel' },     // 24: eiffel tower piece
            { color: '#34495e', detail: 'bridge' },     // 25: bridge
            { color: '#1a5276', detail: 'bookshop' },   // 26: bookshop
            { color: '#196f3d', detail: 'park' },       // 27: park bench
            { color: '#7d6608', detail: 'lamp' },       // 28: street lamp
            { color: '#a93226', detail: null },          // 29: awning
            { color: '#d5d8dc', detail: null },          // 30: window
            { color: '#5d4e37', detail: null },          // 31: fence

            // Row 4: London-specific
            { color: '#c0392b', detail: 'phonebox' },   // 32: red phone box
            { color: '#873600', detail: 'bigben' },     // 33: big ben piece
            { color: '#6e2c00', detail: null },          // 34: museum wall
            { color: '#1c2833', detail: null },          // 35: dark brick
            { color: '#4a235a', detail: null },          // 36: purple door
            { color: '#0e6655', detail: null },          // 37: green park
            { color: '#d4e6f1', detail: null },          // 38: fog overlay
            { color: '#717d7e', detail: null },          // 39: pavement

            // Row 5: Rome-specific
            { color: '#f5eef8', detail: 'column' },     // 40: marble column
            { color: '#d7bde2', detail: null },          // 41: ancient stone
            { color: '#85c1e9', detail: null },          // 42: fountain water
            { color: '#f9e79f', detail: null },          // 43: warm stone
            { color: '#e8daef', detail: null },          // 44: temple floor
            { color: '#d5f5e3', detail: null },          // 45: vine
            { color: '#fad7a0', detail: null },          // 46: terracotta
            { color: '#f5b7b1', detail: null },          // 47: pink wall

            // Row 6: Marrakech-specific
            { color: '#e59866', detail: null },          // 48: red clay
            { color: '#d4ac0d', detail: 'mosaic' },     // 49: mosaic tile
            { color: '#af601a', detail: null },          // 50: market stall
            { color: '#7d3c98', detail: null },          // 51: purple fabric
            { color: '#28b463', detail: 'palm' },        // 52: palm tree
            { color: '#f0b27a', detail: null },          // 53: sandstone
            { color: '#2e4053', detail: null },          // 54: dark archway
            { color: '#f5cba7', detail: null },          // 55: light clay

            // Row 7: Tokyo-specific
            { color: '#f5b7b1', detail: 'cherry' },     // 56: cherry blossom tree
            { color: '#e8daef', detail: null },          // 57: light purple
            { color: '#aed6f1', detail: null },          // 58: light blue
            { color: '#a3e4d7', detail: null },          // 59: jade
            { color: '#f9e79f', detail: 'lantern' },    // 60: paper lantern
            { color: '#dc7633', detail: 'torii' },      // 61: torii gate
            { color: '#5d6d7e', detail: null },          // 62: slate
            { color: '#2ecc71', detail: 'bamboo' }      // 63: bamboo
        ];

        tiles.forEach((tile, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = col * tileSize;
            const y = row * tileSize;

            // Base color
            ctx.fillStyle = tile.color;
            ctx.fillRect(x, y, tileSize, tileSize);

            // Add detail patterns
            this.drawTileDetail(ctx, x, y, tileSize, tile);
        });

        canvas.refresh();

        // Add individual tile frames
        for (let i = 0; i < tiles.length; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            this.textures.get('tileset').add(i, 0, col * tileSize, row * tileSize, tileSize, tileSize);
        }
    }

    drawTileDetail(ctx, x, y, size, tile) {
        const s = size;
        ctx.globalAlpha = 0.3;

        switch (tile.detail) {
            case 'cobble':
                ctx.fillStyle = '#a09070';
                for (let i = 0; i < 4; i++) {
                    const cx = x + (i % 2) * 8 + 1;
                    const cy = y + Math.floor(i / 2) * 8 + 1;
                    ctx.fillRect(cx, cy, 6, 6);
                }
                break;
            case 'grass':
                ctx.fillStyle = '#2d7a2d';
                ctx.fillRect(x + 2, y + 4, 1, 3);
                ctx.fillRect(x + 7, y + 2, 1, 4);
                ctx.fillRect(x + 12, y + 6, 1, 3);
                break;
            case 'water':
                ctx.fillStyle = '#5ba3e6';
                ctx.fillRect(x + 2, y + 4, 4, 1);
                ctx.fillRect(x + 9, y + 8, 5, 1);
                ctx.fillRect(x + 4, y + 12, 6, 1);
                break;
            case 'brick':
                ctx.fillStyle = '#000000';
                ctx.globalAlpha = 0.15;
                for (let row = 0; row < 4; row++) {
                    const offset = (row % 2) * 4;
                    ctx.fillRect(x, y + row * 4, s, 1);
                    ctx.fillRect(x + offset, y + row * 4, 1, 4);
                    ctx.fillRect(x + offset + 8, y + row * 4, 1, 4);
                }
                break;
            case 'tree':
                ctx.globalAlpha = 1;
                ctx.fillStyle = '#1a7a1a';
                ctx.fillRect(x + 2, y + 1, 12, 10);
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x + 6, y + 11, 4, 5);
                break;
            case 'flower':
                ctx.globalAlpha = 1;
                ctx.fillStyle = '#4a8c3f';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#ff6b6b';
                ctx.fillRect(x + 3, y + 3, 3, 3);
                ctx.fillStyle = '#ffd93d';
                ctx.fillRect(x + 10, y + 8, 3, 3);
                ctx.fillStyle = '#ff6b6b';
                ctx.fillRect(x + 7, y + 11, 3, 3);
                break;
            case 'fountain':
                ctx.globalAlpha = 1;
                ctx.fillStyle = '#555';
                ctx.fillRect(x + 3, y + 3, 10, 10);
                ctx.fillStyle = '#3b7dd8';
                ctx.fillRect(x + 5, y + 5, 6, 6);
                break;
            case 'chest':
                ctx.globalAlpha = 1;
                ctx.fillStyle = '#8B6914';
                ctx.fillRect(x + 3, y + 5, 10, 8);
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(x + 7, y + 7, 2, 2);
                break;
            case 'portal':
                ctx.globalAlpha = 0.7;
                ctx.fillStyle = '#c39bd3';
                ctx.fillRect(x + 3, y + 1, 10, 14);
                ctx.fillStyle = '#f4ecf7';
                ctx.fillRect(x + 5, y + 3, 6, 10);
                break;
            case 'door':
                ctx.globalAlpha = 1;
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x + 3, y + 2, 10, 14);
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(x + 10, y + 9, 2, 2);
                break;
            case 'sign':
                ctx.globalAlpha = 1;
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x + 7, y + 8, 2, 8);
                ctx.fillStyle = '#DEB887';
                ctx.fillRect(x + 3, y + 2, 10, 7);
                break;
            case 'eiffel':
                ctx.globalAlpha = 1;
                ctx.fillStyle = '#5D6D7E';
                ctx.fillRect(x + 6, y, 4, 16);
                ctx.fillRect(x + 4, y + 8, 8, 2);
                ctx.fillRect(x + 2, y + 14, 12, 2);
                break;
            case 'cherry':
                ctx.globalAlpha = 1;
                ctx.fillStyle = '#f8a5c2';
                ctx.fillRect(x + 2, y + 1, 12, 10);
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x + 6, y + 11, 4, 5);
                break;
            case 'palm':
                ctx.globalAlpha = 1;
                ctx.fillStyle = '#1e8449';
                ctx.fillRect(x + 1, y + 0, 14, 6);
                ctx.fillStyle = '#7d6608';
                ctx.fillRect(x + 7, y + 4, 2, 12);
                break;
            case 'torii':
                ctx.globalAlpha = 1;
                ctx.fillStyle = '#c0392b';
                ctx.fillRect(x + 1, y + 2, 14, 3);
                ctx.fillRect(x + 3, y + 2, 2, 14);
                ctx.fillRect(x + 11, y + 2, 2, 14);
                break;
            case 'lantern':
                ctx.globalAlpha = 1;
                ctx.fillStyle = '#e74c3c';
                ctx.fillRect(x + 5, y + 3, 6, 8);
                ctx.fillStyle = '#f9e79f';
                ctx.fillRect(x + 6, y + 5, 4, 4);
                break;
        }

        ctx.globalAlpha = 1;
    }

    generateUIAssets() {
        // Dialog box background
        let canvas = this.textures.createCanvas('dialog_bg', 300, 64);
        let ctx = canvas.getContext();
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, 300, 64);
        ctx.strokeStyle = '#8866cc';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, 298, 62);
        ctx.strokeStyle = '#ccaaff';
        ctx.lineWidth = 1;
        ctx.strokeRect(3, 3, 294, 58);
        canvas.refresh();

        // Button background
        canvas = this.textures.createCanvas('button_bg', 120, 24);
        ctx = canvas.getContext();
        ctx.fillStyle = '#2d1b69';
        ctx.fillRect(0, 0, 120, 24);
        ctx.strokeStyle = '#8866cc';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, 118, 22);
        canvas.refresh();

        // Button hover
        canvas = this.textures.createCanvas('button_hover', 120, 24);
        ctx = canvas.getContext();
        ctx.fillStyle = '#4a2d8e';
        ctx.fillRect(0, 0, 120, 24);
        ctx.strokeStyle = '#ccaaff';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, 118, 22);
        canvas.refresh();

        // Inventory panel
        canvas = this.textures.createCanvas('inventory_bg', 160, 200);
        ctx = canvas.getContext();
        ctx.fillStyle = '#1a1a2e';
        ctx.globalAlpha = 0.95;
        ctx.fillRect(0, 0, 160, 200);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#8866cc';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, 158, 198);
        canvas.refresh();

        // Interaction indicator (!)
        canvas = this.textures.createCanvas('interact_icon', 8, 8);
        ctx = canvas.getContext();
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(3, 0, 2, 5);
        ctx.fillRect(3, 6, 2, 2);
        canvas.refresh();

        // Quest marker (?)
        canvas = this.textures.createCanvas('quest_marker', 8, 10);
        ctx = canvas.getContext();
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(2, 0, 4, 2);
        ctx.fillRect(5, 2, 2, 2);
        ctx.fillRect(3, 4, 3, 2);
        ctx.fillRect(3, 6, 2, 1);
        ctx.fillRect(3, 8, 2, 2);
        canvas.refresh();

        // Arrow indicator
        canvas = this.textures.createCanvas('arrow', 8, 8);
        ctx = canvas.getContext();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(3, 0, 2, 2);
        ctx.fillRect(2, 2, 4, 2);
        ctx.fillRect(1, 4, 6, 2);
        ctx.fillRect(0, 6, 8, 2);
        canvas.refresh();
    }

    generateWorldMapAssets() {
        // City dot
        let canvas = this.textures.createCanvas('city_dot', 8, 8);
        let ctx = canvas.getContext();
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(2, 2, 4, 4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(3, 3, 2, 2);
        canvas.refresh();

        // Locked city dot
        canvas = this.textures.createCanvas('city_locked', 8, 8);
        ctx = canvas.getContext();
        ctx.fillStyle = '#555555';
        ctx.fillRect(2, 2, 4, 4);
        ctx.fillStyle = '#888888';
        ctx.fillRect(3, 3, 2, 2);
        canvas.refresh();

        // Transport icons
        const transports = [
            { name: 'train', color: '#e74c3c' },
            { name: 'boat', color: '#3498db' },
            { name: 'portal', color: '#9b59b6' }
        ];

        transports.forEach(t => {
            canvas = this.textures.createCanvas(`transport_${t.name}`, 10, 10);
            ctx = canvas.getContext();
            ctx.fillStyle = t.color;
            ctx.fillRect(1, 1, 8, 8);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(3, 3, 4, 4);
            canvas.refresh();
        });

        // World map background
        canvas = this.textures.createCanvas('world_map_bg', 320, 240);
        ctx = canvas.getContext();

        // Ocean
        ctx.fillStyle = '#2c5f8a';
        ctx.fillRect(0, 0, 320, 240);

        // Add subtle wave pattern
        ctx.fillStyle = '#2a5a82';
        for (let i = 0; i < 20; i++) {
            const wavey = 20 + i * 12;
            for (let x = 0; x < 320; x += 8) {
                ctx.fillRect(x + (i % 2) * 4, wavey, 6, 1);
            }
        }

        // Europe landmass (simplified)
        ctx.fillStyle = '#4a8c3f';
        // Western Europe
        ctx.fillRect(80, 40, 80, 60);
        ctx.fillRect(100, 30, 50, 20);
        ctx.fillRect(90, 90, 60, 30);
        // UK
        ctx.fillRect(85, 25, 20, 35);
        // Italy boot
        ctx.fillRect(130, 80, 15, 40);
        // Eastern Mediterranean
        ctx.fillRect(160, 70, 40, 30);
        // Turkey
        ctx.fillRect(170, 60, 40, 20);

        // North Africa
        ctx.fillStyle = '#d4a950';
        ctx.fillRect(70, 120, 140, 40);

        // Asia
        ctx.fillStyle = '#5a9c4f';
        ctx.fillRect(200, 30, 120, 80);

        // Japan
        ctx.fillRect(285, 50, 10, 30);

        canvas.refresh();
    }

    generateItemIcons() {
        const items = [
            { name: 'locket', color: '#FFD700', detail: 'circle' },
            { name: 'letter', color: '#F5DEB3', detail: 'rect' },
            { name: 'map_fragment', color: '#D2B48C', detail: 'torn' },
            { name: 'key', color: '#C0C0C0', detail: 'key' },
            { name: 'book', color: '#8B4513', detail: 'book' },
            { name: 'coin', color: '#FFD700', detail: 'circle' },
            { name: 'gem', color: '#9b59b6', detail: 'diamond' },
            { name: 'journal', color: '#DEB887', detail: 'book' }
        ];

        items.forEach(item => {
            const canvas = this.textures.createCanvas(`item_${item.name}`, 16, 16);
            const ctx = canvas.getContext();

            ctx.fillStyle = item.color;

            switch (item.detail) {
                case 'circle':
                    ctx.fillRect(4, 4, 8, 8);
                    ctx.fillRect(5, 3, 6, 10);
                    ctx.fillRect(3, 5, 10, 6);
                    break;
                case 'rect':
                    ctx.fillRect(3, 2, 10, 12);
                    break;
                case 'key':
                    ctx.fillRect(3, 3, 6, 6);
                    ctx.fillRect(9, 5, 5, 2);
                    ctx.fillRect(12, 7, 2, 2);
                    break;
                case 'book':
                    ctx.fillRect(3, 2, 10, 12);
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(5, 4, 6, 1);
                    ctx.fillRect(5, 7, 6, 1);
                    break;
                case 'diamond':
                    ctx.fillRect(6, 2, 4, 4);
                    ctx.fillRect(4, 4, 8, 4);
                    ctx.fillRect(6, 8, 4, 4);
                    break;
                case 'torn':
                    ctx.fillRect(3, 2, 9, 12);
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(5, 5, 5, 1);
                    ctx.fillRect(5, 8, 3, 1);
                    break;
            }

            canvas.refresh();
        });
    }

    create() {
        // Generate all assets programmatically
        this.generateAssets();

        // Create player animations
        this.anims.create({
            key: 'player_down',
            frames: [{ key: 'player', frame: 0 }, { key: 'player', frame: 1 }, { key: 'player', frame: 0 }, { key: 'player', frame: 3 }],
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'player_left',
            frames: [{ key: 'player', frame: 4 }, { key: 'player', frame: 5 }, { key: 'player', frame: 4 }, { key: 'player', frame: 7 }],
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'player_right',
            frames: [{ key: 'player', frame: 8 }, { key: 'player', frame: 9 }, { key: 'player', frame: 8 }, { key: 'player', frame: 11 }],
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'player_up',
            frames: [{ key: 'player', frame: 12 }, { key: 'player', frame: 13 }, { key: 'player', frame: 12 }, { key: 'player', frame: 15 }],
            frameRate: 6,
            repeat: -1
        });

        // Idle frames
        this.anims.create({ key: 'player_idle_down', frames: [{ key: 'player', frame: 0 }], frameRate: 1, repeat: 0 });
        this.anims.create({ key: 'player_idle_left', frames: [{ key: 'player', frame: 4 }], frameRate: 1, repeat: 0 });
        this.anims.create({ key: 'player_idle_right', frames: [{ key: 'player', frame: 8 }], frameRate: 1, repeat: 0 });
        this.anims.create({ key: 'player_idle_up', frames: [{ key: 'player', frame: 12 }], frameRate: 1, repeat: 0 });

        this.scene.start('Title');
    }
}
