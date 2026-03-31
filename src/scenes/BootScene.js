export class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Show loading text
        const { width, height } = this.cameras.main;
        this.add.text(width / 2, height / 2, 'Loading...', {
            fontSize: '36px',
            fontFamily: 'monospace',
            color: '#ccaaff'
        }).setOrigin(0.5);
    }

    generateAssets() {
        this.generatePlayerSpritesheet();
        this.generateNPCSpritesheet();
        this.generateTileset();
        this.generateParticleTextures();
        this.generateUIAssets();
        this.generateWorldMapAssets();
        this.generateItemIcons();
    }

    generatePlayerSpritesheet() {
        const frameW = 16, frameH = 24;
        const canvas = this.textures.createCanvas('player', frameW * 4, frameH * 4);
        const ctx = canvas.getContext();

        // 4 directions x 4 frames: down, left, right, up
        const facings = ['down', 'left', 'right', 'up'];

        facings.forEach((facing, row) => {
            for (let col = 0; col < 4; col++) {
                const x = col * frameW;
                const y = row * frameH;
                this.drawPlayer(ctx, x, y, frameW, frameH, {
                    facing,
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

    drawPlayer(ctx, x, y, w, h, opts) {
        const cx = x + w / 2;
        // Shift base down by 1 so bob frames (offset -1) stay within frame bounds
        const bobOffset = (opts.frame === 1 || opts.frame === 3) ? 0 : 1;
        const by = y + bobOffset;
        const isLeft = opts.facing === 'left';
        const isRight = opts.facing === 'right';
        const isSide = isLeft || isRight;
        const isDown = opts.facing === 'down';
        const isUp = opts.facing === 'up';

        // === Hair (rows 0-3) ===
        ctx.fillStyle = '#8B4513'; // base brown
        ctx.fillRect(cx - 4, by + 0, 8, 4);
        // Hair highlight strand
        ctx.fillStyle = '#A0612B';
        if (isDown) {
            ctx.fillRect(cx - 2, by + 0, 2, 1);
            ctx.fillRect(cx + 1, by + 1, 1, 1);
        } else if (isUp) {
            ctx.fillRect(cx - 1, by + 0, 3, 1);
        } else {
            ctx.fillRect(cx - 2, by + 0, 3, 1);
        }
        // Side hair drape
        if (isDown || isSide) {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(cx - 4, by + 3, 1, 3);
            ctx.fillRect(cx + 3, by + 3, 1, 3);
        }

        // === Face/Head (rows 3-7) ===
        ctx.fillStyle = '#FDBCB4'; // skin
        ctx.fillRect(cx - 3, by + 3, 6, 5);

        // === Eyes (row 5) ===
        if (!isUp) {
            ctx.fillStyle = '#1a1a2e';
            if (isDown) {
                ctx.fillRect(cx - 2, by + 5, 1, 1);
                ctx.fillRect(cx + 1, by + 5, 1, 1);
            } else if (isLeft) {
                ctx.fillRect(cx - 2, by + 5, 1, 1);
                ctx.fillRect(cx, by + 5, 1, 1);
            } else { // right
                ctx.fillRect(cx + 1, by + 5, 1, 1);
                ctx.fillRect(cx - 1, by + 5, 1, 1);
            }
        }

        // === Mouth (row 6) ===
        if (isDown) {
            ctx.fillStyle = '#e07c6a';
            ctx.fillRect(cx - 1, by + 7, 2, 1);
        } else if (isSide) {
            ctx.fillStyle = '#e07c6a';
            ctx.fillRect(isLeft ? cx - 2 : cx + 1, by + 7, 1, 1);
        }

        // === Collar (row 8) ===
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - 3, by + 8, 6, 1);

        // === Shirt with shading (rows 9-14) ===
        ctx.fillStyle = '#E84393'; // pink shirt
        ctx.fillRect(cx - 4, by + 9, 8, 5);
        // Shirt shadow
        ctx.fillStyle = '#C73878';
        ctx.fillRect(cx - 4, by + 12, 8, 2);
        // Shirt highlight
        ctx.fillStyle = '#F06AAE';
        if (isDown) {
            ctx.fillRect(cx - 1, by + 9, 2, 2);
        } else if (isSide) {
            ctx.fillRect(isLeft ? cx : cx - 2, by + 9, 2, 2);
        }

        // === Arms with swing animation ===
        ctx.fillStyle = '#FDBCB4'; // skin
        const armSwing = opts.frame === 1 ? 1 : opts.frame === 3 ? -1 : 0;
        if (isDown || isUp) {
            // Left arm
            ctx.fillRect(cx - 5, by + 9 + armSwing, 1, 4);
            // Right arm
            ctx.fillRect(cx + 4, by + 9 - armSwing, 1, 4);
        } else if (isLeft) {
            // One visible arm in front
            ctx.fillRect(cx - 4, by + 9 + armSwing, 1, 4);
        } else {
            ctx.fillRect(cx + 3, by + 9 + armSwing, 1, 4);
        }

        // === Skirt with pleats (rows 14-17) ===
        ctx.fillStyle = '#6C5CE7'; // purple skirt
        ctx.fillRect(cx - 4, by + 14, 8, 3);
        // Skirt dark pleats
        ctx.fillStyle = '#5B4CC7';
        ctx.fillRect(cx - 3, by + 14, 1, 3);
        ctx.fillRect(cx, by + 14, 1, 3);
        ctx.fillRect(cx + 2, by + 14, 1, 3);
        // Skirt hem highlight
        ctx.fillStyle = '#7E6FEF';
        ctx.fillRect(cx - 4, by + 16, 8, 1);

        // === Legs with stride animation (rows 17-20) ===
        ctx.fillStyle = '#FDBCB4';
        const legStride = opts.frame === 1 ? 1 : opts.frame === 3 ? -1 : 0;
        if (isDown || isUp) {
            ctx.fillRect(cx - 2 + legStride, by + 17, 2, 3);
            ctx.fillRect(cx + 0 - legStride, by + 17, 2, 3);
        } else {
            // Side view: legs overlap
            ctx.fillRect(cx - 2 + legStride, by + 17, 2, 3);
            ctx.fillRect(cx - 1 - legStride, by + 17, 2, 3);
        }

        // === Shoes (rows 20-23) ===
        ctx.fillStyle = '#5D4037'; // dark brown shoes
        if (isDown || isUp) {
            ctx.fillRect(cx - 3 + legStride, by + 20, 3, 2);
            ctx.fillRect(cx + 0 - legStride, by + 20, 3, 2);
            // Shoe soles
            ctx.fillStyle = '#3E2723';
            ctx.fillRect(cx - 3 + legStride, by + 21, 3, 1);
            ctx.fillRect(cx + 0 - legStride, by + 21, 3, 1);
        } else {
            ctx.fillRect(cx - 3 + legStride, by + 20, 3, 2);
            ctx.fillRect(cx - 2 - legStride, by + 20, 3, 2);
            ctx.fillStyle = '#3E2723';
            ctx.fillRect(cx - 3 + legStride, by + 21, 3, 1);
            ctx.fillRect(cx - 2 - legStride, by + 21, 3, 1);
        }
    }

    generateNPCSpritesheet() {
        const frameW = 16, frameH = 24;
        // 29 NPC types, 4 frames each (idle animation)
        const npcDefs = [
            { name: 'librarian', hair: '#444444', hairHi: '#5a5a5a', shirt: '#2ecc71', shirtShadow: '#22a85c', pants: '#27ae60', pantsDark: '#1e8c4d', skin: '#FDBCB4', accessory: 'glasses_vest' },
            { name: 'curator', hair: '#d4a574', hairHi: '#e0b88a', shirt: '#3498db', shirtShadow: '#2a7ab8', pants: '#2980b9', pantsDark: '#20669a', skin: '#FDBCB4', accessory: 'necklace_blazer' },
            { name: 'merchant', hair: '#1a1a1a', hairHi: '#333333', shirt: '#e67e22', shirtShadow: '#c76a1c', pants: '#d35400', pantsDark: '#a84300', skin: '#D4A574', accessory: 'apron_mustache' },
            { name: 'guide', hair: '#c0392b', hairHi: '#d44535', shirt: '#f1c40f', shirtShadow: '#d4ac0d', pants: '#f39c12', pantsDark: '#d4850f', skin: '#FDBCB4', accessory: 'ponytail_scarf' },
            { name: 'gardener', hair: '#2c3e50', hairHi: '#3a5068', shirt: '#1abc9c', shirtShadow: '#149c81', pants: '#16a085', pantsDark: '#128570', skin: '#D4A574', accessory: 'hat_apron' },
            { name: 'grandma', hair: '#bdc3c7', hairHi: '#d5dade', shirt: '#9b59b6', shirtShadow: '#824a99', pants: '#8e44ad', pantsDark: '#763891', skin: '#F0C8B0', accessory: 'shawl_bun' },
            // Paris NPCs
            { name: 'artist', hair: '#6B4226', hairHi: '#7B5236', shirt: '#3498db', shirtShadow: '#2a7ab8', pants: '#2c3e50', pantsDark: '#1a252f', skin: '#FDBCB4', accessory: 'hat_apron' },
            { name: 'flower_seller', hair: '#F0D58C', hairHi: '#F5E0A0', shirt: '#27ae60', shirtShadow: '#1e8c4d', pants: '#2ecc71', pantsDark: '#22a85c', skin: '#FDBCB4', accessory: 'hat_apron' },
            { name: 'tourist', hair: '#A0612B', hairHi: '#B07838', shirt: '#e74c3c', shirtShadow: '#c0392b', pants: '#d4a574', pantsDark: '#b8895e', skin: '#FDBCB4', accessory: 'ponytail_scarf' },
            { name: 'attendant', hair: '#1a1a1a', hairHi: '#333333', shirt: '#c0392b', shirtShadow: '#a93226', pants: '#2c3e50', pantsDark: '#1a252f', skin: '#FDBCB4', accessory: 'glasses_vest' },
            { name: 'photographer', hair: '#1a1a1a', hairHi: '#333333', shirt: '#8e44ad', shirtShadow: '#763891', pants: '#2c3e50', pantsDark: '#1a252f', skin: '#FDBCB4', accessory: 'ponytail_scarf' },
            // London NPCs
            { name: 'policeman', hair: '#1a1a1a', hairHi: '#333333', shirt: '#2c3e80', shirtShadow: '#1a2d6b', pants: '#2c3e50', pantsDark: '#1a252f', skin: '#FDBCB4', accessory: 'glasses_vest' },
            { name: 'professor', hair: '#95a5a6', hairHi: '#aab5b6', shirt: '#8B6914', shirtShadow: '#7B5904', pants: '#6B5420', pantsDark: '#5B4410', skin: '#FDBCB4', accessory: 'glasses_vest' },
            { name: 'schoolkid', hair: '#A0612B', hairHi: '#B07838', shirt: '#2c3e80', shirtShadow: '#1a2d6b', pants: '#34495e', pantsDark: '#2c3e50', skin: '#FDBCB4', accessory: 'necklace_blazer' },
            { name: 'clerk', hair: '#c0392b', hairHi: '#d44535', shirt: '#1abc9c', shirtShadow: '#149c81', pants: '#2c3e50', pantsDark: '#1a252f', skin: '#FDBCB4', accessory: 'necklace_blazer' },
            // Rome NPCs
            { name: 'gelato', hair: '#1a1a1a', hairHi: '#333333', shirt: '#ecf0f1', shirtShadow: '#bdc3c7', pants: '#2c3e50', pantsDark: '#1a252f', skin: '#D4A574', accessory: 'apron_mustache' },
            { name: 'musician', hair: '#6B4226', hairHi: '#7B5236', shirt: '#ecf0f1', shirtShadow: '#bdc3c7', pants: '#2c3e50', pantsDark: '#1a252f', skin: '#FDBCB4', accessory: 'ponytail_scarf' },
            { name: 'tour_guide', hair: '#6B4226', hairHi: '#7B5236', shirt: '#f1c40f', shirtShadow: '#d4ac0d', pants: '#34495e', pantsDark: '#2c3e50', skin: '#FDBCB4', accessory: 'ponytail_scarf' },
            { name: 'cat_lady', hair: '#95a5a6', hairHi: '#aab5b6', shirt: '#8e44ad', shirtShadow: '#763891', pants: '#6c3483', pantsDark: '#5b2c6f', skin: '#F0C8B0', accessory: 'shawl_bun' },
            // Marrakech NPCs
            { name: 'spice_merchant', hair: '#1a1a1a', hairHi: '#333333', shirt: '#e67e22', shirtShadow: '#c76a1c', pants: '#d35400', pantsDark: '#a84300', skin: '#D4A574', accessory: 'apron_mustache' },
            { name: 'storyteller', hair: '#ecf0f1', hairHi: '#ffffff', shirt: '#f5f5dc', shirtShadow: '#ddd8c0', pants: '#c8b88a', pantsDark: '#a09070', skin: '#D4A574', accessory: 'shawl_bun' },
            { name: 'carpet_merchant', hair: '#1a1a1a', hairHi: '#333333', shirt: '#c0392b', shirtShadow: '#a93226', pants: '#8B6914', pantsDark: '#7B5904', skin: '#D4A574', accessory: 'glasses_vest' },
            { name: 'riad_keeper', hair: '#1a1a1a', hairHi: '#333333', shirt: '#16a085', shirtShadow: '#128570', pants: '#1abc9c', pantsDark: '#149c81', skin: '#D4A574', accessory: 'shawl_bun' },
            { name: 'desert_guide', hair: '#1a1a1a', hairHi: '#333333', shirt: '#d4a574', shirtShadow: '#b8895e', pants: '#8B6914', pantsDark: '#7B5904', skin: '#D4A574', accessory: 'ponytail_scarf' },
            // Tokyo NPCs
            { name: 'ramen_chef', hair: '#1a1a1a', hairHi: '#333333', shirt: '#ecf0f1', shirtShadow: '#bdc3c7', pants: '#2c3e50', pantsDark: '#1a252f', skin: '#F0C8B0', accessory: 'hat_apron' },
            { name: 'manga_artist', hair: '#e84393', hairHi: '#f06aae', shirt: '#9b59b6', shirtShadow: '#824a99', pants: '#2c3e50', pantsDark: '#1a252f', skin: '#F0C8B0', accessory: 'ponytail_scarf' },
            { name: 'shrine_keeper', hair: '#95a5a6', hairHi: '#aab5b6', shirt: '#ecf0f1', shirtShadow: '#bdc3c7', pants: '#c0392b', pantsDark: '#a93226', skin: '#F0C8B0', accessory: 'shawl_bun' },
            { name: 'spirit_fox', hair: '#e67e22', hairHi: '#f39c12', shirt: '#f39c12', shirtShadow: '#d4850f', pants: '#ecf0f1', pantsDark: '#bdc3c7', skin: '#f5f5dc', accessory: 'ponytail_scarf' },
            { name: 'ghost', hair: '#d7bde2', hairHi: '#e8d5f5', shirt: '#c39bd3', shirtShadow: '#a87bbf', pants: '#d7bde2', pantsDark: '#c39bd3', skin: '#e8d5f5', accessory: 'shawl_bun' }
        ];

        npcDefs.forEach((npc) => {
            const canvas = this.textures.createCanvas(`npc_${npc.name}`, frameW * 4, frameH);
            const ctx = canvas.getContext();

            for (let frame = 0; frame < 4; frame++) {
                this.drawNPC(ctx, frame * frameW, 0, frameW, frameH, npc, frame);
            }

            canvas.refresh();
            for (let f = 0; f < 4; f++) {
                this.textures.get(`npc_${npc.name}`).add(f, 0, f * frameW, 0, frameW, frameH);
            }
        });
    }

    drawNPC(ctx, x, y, w, h, npc, frame) {
        const cx = x + w / 2;
        // Gentle sway: frames 0,2 are center, 1 sways left, 3 sways right
        const swayOffset = frame === 1 ? -1 : frame === 3 ? 1 : 0;
        // Shift base down by 1 so bob frames stay within frame bounds
        const bobOffset = (frame === 1 || frame === 3) ? 0 : 1;
        const by = y + bobOffset;

        // === Hair ===
        ctx.fillStyle = npc.hair;
        ctx.fillRect(cx - 4, by + 0, 8, 4);
        ctx.fillStyle = npc.hairHi;
        ctx.fillRect(cx - 2, by + 0, 3, 1);

        // Special hair per type (accessories must not draw above y)
        if (npc.accessory === 'shawl_bun') {
            // Grandma: gray bun overlapping top of hair
            ctx.fillStyle = npc.hair;
            ctx.fillRect(cx - 2, by, 4, 1);
            ctx.fillRect(cx - 1, by, 2, 1);
        } else if (npc.accessory === 'ponytail_scarf') {
            // Guide: ponytail hanging back
            ctx.fillStyle = npc.hair;
            ctx.fillRect(cx + 3, by + 2, 2, 5);
        } else if (npc.accessory === 'hat_apron') {
            // Gardener: straw hat brim at top of hair
            ctx.fillStyle = '#D4A950';
            ctx.fillRect(cx - 5, by, 10, 1);
            ctx.fillRect(cx - 3, by, 6, 1);
        }

        // === Face ===
        ctx.fillStyle = npc.skin;
        ctx.fillRect(cx - 3, by + 3, 6, 5);

        // === Eyes ===
        ctx.fillStyle = '#2d3436';
        ctx.fillRect(cx - 2, by + 5, 1, 1);
        ctx.fillRect(cx + 1, by + 5, 1, 1);

        // Glasses for librarian
        if (npc.accessory === 'glasses_vest') {
            ctx.fillStyle = '#888888';
            ctx.fillRect(cx - 3, by + 4, 2, 2);
            ctx.fillRect(cx + 1, by + 4, 2, 2);
            ctx.fillRect(cx - 1, by + 5, 2, 1);
            // Clear inner lens
            ctx.fillStyle = '#aaddff';
            ctx.fillRect(cx - 2, by + 5, 1, 1);
            ctx.fillRect(cx + 1, by + 5, 1, 1);
        }

        // Mustache for merchant
        if (npc.accessory === 'apron_mustache') {
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(cx - 2, by + 7, 4, 1);
        }

        // Mouth
        ctx.fillStyle = '#e07c6a';
        ctx.fillRect(cx - 1, by + 7, 2, 1);

        // === Necklace for curator ===
        if (npc.accessory === 'necklace_blazer') {
            ctx.fillStyle = '#F5E6CA';
            ctx.fillRect(cx - 2, by + 8, 4, 1);
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(cx, by + 8, 1, 1);
        }

        // === Shirt/Body (rows 8-14) ===
        ctx.fillStyle = npc.shirt;
        const bodyW = npc.accessory === 'apron_mustache' ? 9 : 8;
        const bodyX = npc.accessory === 'apron_mustache' ? cx - 5 : cx - 4;
        ctx.fillRect(bodyX + swayOffset, by + 8, bodyW, 6);
        // Shirt shadow
        ctx.fillStyle = npc.shirtShadow;
        ctx.fillRect(bodyX + swayOffset, by + 12, bodyW, 2);

        // Apron for merchant
        if (npc.accessory === 'apron_mustache') {
            ctx.fillStyle = '#F5F5DC';
            ctx.fillRect(cx - 3 + swayOffset, by + 9, 6, 5);
        }
        // Vest detail for librarian
        if (npc.accessory === 'glasses_vest') {
            ctx.fillStyle = '#6B5B3E';
            ctx.fillRect(cx - 3 + swayOffset, by + 9, 2, 4);
            ctx.fillRect(cx + 1 + swayOffset, by + 9, 2, 4);
        }
        // Blazer for curator
        if (npc.accessory === 'necklace_blazer') {
            ctx.fillStyle = '#1F3A5F';
            ctx.fillRect(cx - 4 + swayOffset, by + 9, 2, 5);
            ctx.fillRect(cx + 2 + swayOffset, by + 9, 2, 5);
        }
        // Scarf for guide
        if (npc.accessory === 'ponytail_scarf') {
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(cx - 1, by + 8, 2, 2);
            ctx.fillRect(cx - 2, by + 10, 1, 3);
        }
        // Green apron for gardener
        if (npc.accessory === 'hat_apron') {
            ctx.fillStyle = '#27AE60';
            ctx.fillRect(cx - 3 + swayOffset, by + 9, 6, 5);
        }
        // Shawl for grandma
        if (npc.accessory === 'shawl_bun') {
            ctx.fillStyle = '#A87CB3';
            ctx.fillRect(cx - 4 + swayOffset, by + 8, 8, 3);
            ctx.fillStyle = npc.shirtShadow;
            ctx.fillRect(cx - 4 + swayOffset, by + 10, 2, 2);
            ctx.fillRect(cx + 2 + swayOffset, by + 10, 2, 2);
        }

        // === Pants/Skirt (rows 14-17) ===
        ctx.fillStyle = npc.pants;
        ctx.fillRect(cx - 4 + swayOffset, by + 14, 8, 3);
        ctx.fillStyle = npc.pantsDark;
        ctx.fillRect(cx - 3 + swayOffset, by + 14, 1, 3);
        ctx.fillRect(cx + swayOffset, by + 14, 1, 3);

        // === Legs (rows 17-20) ===
        ctx.fillStyle = npc.skin;
        const legOff = frame === 1 ? 1 : frame === 3 ? -1 : 0;
        ctx.fillRect(cx - 2 + legOff, by + 17, 2, 3);
        ctx.fillRect(cx + 0 - legOff, by + 17, 2, 3);

        // === Shoes (rows 20-22) ===
        ctx.fillStyle = '#3E2723';
        ctx.fillRect(cx - 3 + legOff, by + 20, 3, 2);
        ctx.fillRect(cx + 0 - legOff, by + 20, 3, 2);
    }

    generateTileset() {
        const tileSize = 16;
        const cols = 8;
        const rows = 10; // extra rows for water animation variants
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

        // Draw water animation variants (indices 64 and 65)
        const waterVariants = [
            { index: 64, waveShift: 1 },
            { index: 65, waveShift: 2 }
        ];
        waterVariants.forEach(v => {
            const col = v.index % cols;
            const row = Math.floor(v.index / cols);
            const wx = col * tileSize;
            const wy = row * tileSize;
            // Base water
            ctx.fillStyle = '#2a6ab8';
            ctx.fillRect(wx, wy, tileSize, tileSize);
            ctx.fillStyle = '#3b7dd8';
            ctx.fillRect(wx, wy, tileSize, 6);
            ctx.fillStyle = '#4a8de8';
            ctx.fillRect(wx, wy, tileSize, 3);
            // Wave lines shifted
            ctx.fillStyle = '#5ba3f0';
            ctx.fillRect(wx + 2 + v.waveShift, wy + 4, 4, 1);
            ctx.fillRect(wx + 10 - v.waveShift, wy + 4, 3, 1);
            ctx.fillRect(wx + 1 + v.waveShift, wy + 8, 5, 1);
            ctx.fillRect(wx + 9 - v.waveShift, wy + 9, 4, 1);
            ctx.fillRect(wx + 4 + v.waveShift, wy + 13, 6, 1);
            // Specular highlights shifted
            ctx.fillStyle = '#8bc4f5';
            ctx.fillRect(wx + 3 + v.waveShift, wy + 3, 2, 1);
            ctx.fillRect(wx + 11 - v.waveShift, wy + 7, 1, 1);
            ctx.fillRect(wx + 6 + v.waveShift, wy + 12, 2, 1);
        });

        canvas.refresh();

        // Add individual tile frames (including water variants)
        const totalTiles = tiles.length + waterVariants.length;
        for (let i = 0; i < totalTiles; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            this.textures.get('tileset').add(i, 0, col * tileSize, row * tileSize, tileSize, tileSize);
        }
    }

    dither(ctx, x, y, w, h, color1, color2) {
        for (let py = 0; py < h; py++) {
            for (let px = 0; px < w; px++) {
                ctx.fillStyle = ((px + py) % 2 === 0) ? color1 : color2;
                ctx.fillRect(x + px, y + py, 1, 1);
            }
        }
    }

    drawTileDetail(ctx, x, y, size, tile) {
        const s = size;

        switch (tile.detail) {
            case 'cobble': {
                // Individual stones with highlight/shadow edges
                ctx.fillStyle = '#b8a880';
                ctx.fillRect(x, y, s, s);
                const stones = [
                    [0,0,7,7], [8,0,8,6], [0,8,6,8], [7,7,9,9]
                ];
                stones.forEach(([sx,sy,sw,sh]) => {
                    ctx.fillStyle = '#c8b88a';
                    ctx.fillRect(x+sx+1, y+sy+1, sw-1, sh-1);
                    // Top-left highlight
                    ctx.fillStyle = '#d8c89a';
                    ctx.fillRect(x+sx+1, y+sy+1, sw-2, 1);
                    ctx.fillRect(x+sx+1, y+sy+1, 1, sh-2);
                    // Bottom-right shadow
                    ctx.fillStyle = '#a09070';
                    ctx.fillRect(x+sx+1, y+sy+sh-1, sw-1, 1);
                    ctx.fillRect(x+sx+sw-1, y+sy+1, 1, sh-1);
                });
                // Mortar lines
                ctx.fillStyle = '#887860';
                ctx.fillRect(x+7, y, 1, s);
                ctx.fillRect(x, y+7, s, 1);
                break;
            }
            case 'grass': {
                // 3 shades of grass with tiny flowers
                ctx.fillStyle = '#4a8c3f';
                ctx.fillRect(x, y, s, s);
                // Dark grass patches
                ctx.fillStyle = '#3a7030';
                ctx.fillRect(x+1, y+3, 3, 3);
                ctx.fillRect(x+8, y+10, 4, 3);
                ctx.fillRect(x+11, y+1, 3, 3);
                // Light grass blades
                ctx.fillStyle = '#5ca84f';
                ctx.fillRect(x+2, y+2, 1, 3);
                ctx.fillRect(x+7, y+1, 1, 4);
                ctx.fillRect(x+12, y+5, 1, 3);
                ctx.fillRect(x+4, y+9, 1, 3);
                ctx.fillRect(x+14, y+10, 1, 3);
                // Tiny flowers
                ctx.fillStyle = '#ffd93d';
                ctx.fillRect(x+5, y+5, 1, 1);
                ctx.fillStyle = '#ff9ff3';
                ctx.fillRect(x+10, y+7, 1, 1);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(x+3, y+12, 1, 1);
                break;
            }
            case 'water': {
                // Water with depth gradient and specular highlights
                ctx.fillStyle = '#2a6ab8';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#3b7dd8';
                ctx.fillRect(x, y, s, 6);
                ctx.fillStyle = '#4a8de8';
                ctx.fillRect(x, y, s, 3);
                // Wave lines
                ctx.fillStyle = '#5ba3f0';
                ctx.fillRect(x+2, y+4, 4, 1);
                ctx.fillRect(x+10, y+4, 3, 1);
                ctx.fillRect(x+1, y+8, 5, 1);
                ctx.fillRect(x+9, y+9, 4, 1);
                ctx.fillRect(x+4, y+13, 6, 1);
                // Specular highlights
                ctx.fillStyle = '#8bc4f5';
                ctx.fillRect(x+3, y+3, 2, 1);
                ctx.fillRect(x+11, y+7, 1, 1);
                ctx.fillRect(x+6, y+12, 2, 1);
                break;
            }
            case 'brick': {
                // Individual bricks with mortar, highlight/shadow
                const baseColor = tile.color;
                ctx.fillStyle = '#665544'; // mortar base
                ctx.fillRect(x, y, s, s);
                for (let row = 0; row < 4; row++) {
                    const offset = (row % 2) * 4;
                    for (let bx = 0; bx < 2; bx++) {
                        const brickX = x + offset + bx * 8;
                        const brickY = y + row * 4;
                        const bw = Math.min(7, x + s - brickX);
                        if (bw <= 0) continue;
                        // Brick body
                        ctx.fillStyle = baseColor;
                        ctx.fillRect(brickX, brickY + 1, bw, 3);
                        // Top highlight
                        ctx.fillStyle = '#ffffff';
                        ctx.globalAlpha = 0.15;
                        ctx.fillRect(brickX, brickY + 1, bw, 1);
                        ctx.globalAlpha = 1;
                        // Bottom shadow
                        ctx.fillStyle = '#000000';
                        ctx.globalAlpha = 0.15;
                        ctx.fillRect(brickX, brickY + 3, bw, 1);
                        ctx.globalAlpha = 1;
                    }
                }
                // Occasional crack
                ctx.fillStyle = '#444444';
                ctx.globalAlpha = 0.2;
                ctx.fillRect(x+5, y+5, 1, 3);
                ctx.globalAlpha = 1;
                break;
            }
            case 'tree': {
                // 3-shade canopy with bark texture
                // Ground shadow
                ctx.fillStyle = '#2a6628';
                ctx.fillRect(x+3, y+12, 10, 2);
                // Trunk with bark texture
                ctx.fillStyle = '#6B4226';
                ctx.fillRect(x+6, y+9, 4, 7);
                ctx.fillStyle = '#7B5236';
                ctx.fillRect(x+7, y+10, 2, 5);
                ctx.fillStyle = '#5B3216';
                ctx.fillRect(x+6, y+11, 1, 3);
                // Canopy: dark core
                ctx.fillStyle = '#1a6a1a';
                ctx.fillRect(x+3, y+3, 10, 7);
                // Canopy: medium body
                ctx.fillStyle = '#2a8a2a';
                ctx.fillRect(x+2, y+2, 10, 6);
                // Canopy: light highlights on top
                ctx.fillStyle = '#3aaa3a';
                ctx.fillRect(x+4, y+1, 6, 3);
                ctx.fillRect(x+3, y+2, 2, 2);
                ctx.fillRect(x+10, y+3, 2, 2);
                // Leaf detail dots
                ctx.fillStyle = '#1a6a1a';
                ctx.fillRect(x+5, y+3, 1, 1);
                ctx.fillRect(x+8, y+2, 1, 1);
                ctx.fillRect(x+4, y+5, 1, 1);
                ctx.fillRect(x+9, y+6, 1, 1);
                break;
            }
            case 'flower': {
                // Grass base with multiple flower types
                ctx.fillStyle = '#4a8c3f';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#3a7030';
                ctx.fillRect(x+1, y+2, 4, 3);
                ctx.fillRect(x+9, y+8, 4, 3);
                // Red flower with center
                ctx.fillStyle = '#ff4444';
                ctx.fillRect(x+3, y+2, 3, 3);
                ctx.fillStyle = '#ffdd00';
                ctx.fillRect(x+4, y+3, 1, 1);
                // Yellow flower
                ctx.fillStyle = '#ffdd44';
                ctx.fillRect(x+10, y+7, 3, 3);
                ctx.fillStyle = '#ff8800';
                ctx.fillRect(x+11, y+8, 1, 1);
                // White daisy
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(x+6, y+11, 3, 3);
                ctx.fillStyle = '#ffdd00';
                ctx.fillRect(x+7, y+12, 1, 1);
                // Stems
                ctx.fillStyle = '#2d6a2d';
                ctx.fillRect(x+4, y+5, 1, 2);
                ctx.fillRect(x+11, y+10, 1, 2);
                ctx.fillRect(x+7, y+14, 1, 2);
                break;
            }
            case 'fountain': {
                // Stone basin with water
                ctx.fillStyle = '#666666';
                ctx.fillRect(x+2, y+3, 12, 11);
                ctx.fillStyle = '#888888';
                ctx.fillRect(x+3, y+3, 10, 1); // rim highlight
                ctx.fillStyle = '#555555';
                ctx.fillRect(x+2, y+13, 12, 1); // rim shadow
                // Water inside
                ctx.fillStyle = '#3b7dd8';
                ctx.fillRect(x+4, y+5, 8, 7);
                ctx.fillStyle = '#5ba3f0';
                ctx.fillRect(x+5, y+6, 4, 3); // lighter water
                // Center spout
                ctx.fillStyle = '#777777';
                ctx.fillRect(x+7, y+5, 2, 4);
                // Water spray
                ctx.fillStyle = '#aaddff';
                ctx.fillRect(x+7, y+2, 2, 3);
                ctx.fillRect(x+6, y+3, 1, 1);
                ctx.fillRect(x+9, y+3, 1, 1);
                break;
            }
            case 'chest': {
                // Detailed treasure chest
                ctx.fillStyle = '#5C4A1E';
                ctx.fillRect(x+3, y+5, 10, 9);
                // Lid
                ctx.fillStyle = '#7B6428';
                ctx.fillRect(x+3, y+5, 10, 4);
                ctx.fillStyle = '#8B7438';
                ctx.fillRect(x+4, y+5, 8, 1); // lid highlight
                // Body
                ctx.fillStyle = '#6B5420';
                ctx.fillRect(x+3, y+9, 10, 5);
                // Metal bands
                ctx.fillStyle = '#888888';
                ctx.fillRect(x+3, y+8, 10, 1);
                ctx.fillRect(x+3, y+12, 10, 1);
                // Lock
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(x+7, y+9, 2, 3);
                ctx.fillStyle = '#FFA500';
                ctx.fillRect(x+7, y+10, 2, 1);
                // Keyhole
                ctx.fillStyle = '#333333';
                ctx.fillRect(x+8, y+10, 1, 1);
                break;
            }
            case 'portal': {
                // Glowing portal arch
                ctx.fillStyle = '#6C3483';
                ctx.fillRect(x+3, y+1, 10, 14);
                ctx.fillStyle = '#8E44AD';
                ctx.fillRect(x+4, y+2, 8, 12);
                // Inner glow
                ctx.fillStyle = '#c39bd3';
                ctx.fillRect(x+5, y+3, 6, 10);
                ctx.fillStyle = '#d7bde2';
                ctx.fillRect(x+6, y+4, 4, 8);
                // Center bright spot
                ctx.fillStyle = '#f4ecf7';
                ctx.fillRect(x+7, y+6, 2, 4);
                // Sparkle dots
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(x+5, y+5, 1, 1);
                ctx.fillRect(x+10, y+8, 1, 1);
                ctx.fillRect(x+7, y+11, 1, 1);
                break;
            }
            case 'door': {
                ctx.fillStyle = '#6B3A1F';
                ctx.fillRect(x+3, y+2, 10, 14);
                ctx.fillStyle = '#8B5A2F';
                ctx.fillRect(x+4, y+3, 8, 12);
                // Panels
                ctx.fillStyle = '#7B4A25';
                ctx.fillRect(x+5, y+4, 6, 4);
                ctx.fillRect(x+5, y+10, 6, 4);
                // Panel highlights
                ctx.fillStyle = '#9B6A3F';
                ctx.fillRect(x+5, y+4, 6, 1);
                ctx.fillRect(x+5, y+10, 6, 1);
                // Knob
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(x+10, y+9, 2, 2);
                ctx.fillStyle = '#FFA500';
                ctx.fillRect(x+10, y+10, 1, 1);
                break;
            }
            case 'sign': {
                // Post
                ctx.fillStyle = '#6B4226';
                ctx.fillRect(x+7, y+8, 2, 8);
                // Sign board
                ctx.fillStyle = '#DEB887';
                ctx.fillRect(x+3, y+2, 10, 7);
                ctx.fillStyle = '#C8A070';
                ctx.fillRect(x+3, y+8, 10, 1);
                // Text lines
                ctx.fillStyle = '#6B4226';
                ctx.fillRect(x+5, y+4, 6, 1);
                ctx.fillRect(x+5, y+6, 4, 1);
                // Nail
                ctx.fillStyle = '#888888';
                ctx.fillRect(x+8, y+2, 1, 1);
                break;
            }
            case 'eiffel': {
                // Eiffel Tower with cross-hatching
                ctx.fillStyle = '#4A5A6A';
                // Main tower body
                ctx.fillRect(x+6, y+0, 4, 16);
                // Viewing platform
                ctx.fillRect(x+4, y+7, 8, 2);
                // Base legs
                ctx.fillRect(x+2, y+13, 4, 3);
                ctx.fillRect(x+10, y+13, 4, 3);
                // Cross-hatching pattern
                ctx.fillStyle = '#5D6D7E';
                ctx.fillRect(x+7, y+1, 2, 1);
                ctx.fillRect(x+6, y+3, 1, 1);
                ctx.fillRect(x+9, y+3, 1, 1);
                ctx.fillRect(x+6, y+5, 1, 1);
                ctx.fillRect(x+9, y+5, 1, 1);
                // Highlight
                ctx.fillStyle = '#7D8D9E';
                ctx.fillRect(x+7, y+0, 1, 7);
                ctx.fillRect(x+5, y+7, 1, 1);
                // Arch
                ctx.fillStyle = '#3A4A5A';
                ctx.fillRect(x+5, y+10, 1, 3);
                ctx.fillRect(x+10, y+10, 1, 3);
                break;
            }
            case 'bigben': {
                // Big Ben with clock face
                ctx.fillStyle = '#6E4B00';
                ctx.fillRect(x+5, y+0, 6, 16);
                // Clock face area
                ctx.fillStyle = '#F5F5DC';
                ctx.fillRect(x+6, y+2, 4, 4);
                // Clock border
                ctx.fillStyle = '#8B6914';
                ctx.fillRect(x+6, y+2, 4, 1);
                ctx.fillRect(x+6, y+5, 4, 1);
                ctx.fillRect(x+6, y+2, 1, 4);
                ctx.fillRect(x+9, y+2, 1, 4);
                // Clock hands
                ctx.fillStyle = '#333333';
                ctx.fillRect(x+8, y+3, 1, 2); // hour hand
                ctx.fillRect(x+7, y+4, 2, 1); // minute hand
                // Tower details
                ctx.fillStyle = '#7E5B10';
                ctx.fillRect(x+6, y+7, 4, 1);
                ctx.fillRect(x+6, y+10, 4, 1);
                // Spire
                ctx.fillStyle = '#555555';
                ctx.fillRect(x+7, y+0, 2, 2);
                break;
            }
            case 'column': {
                // Marble column with fluting
                ctx.fillStyle = '#E8E0D0';
                ctx.fillRect(x+4, y+1, 8, 14);
                // Capital (top)
                ctx.fillStyle = '#F0E8D8';
                ctx.fillRect(x+3, y+1, 10, 2);
                // Base
                ctx.fillStyle = '#D0C8B8';
                ctx.fillRect(x+3, y+13, 10, 2);
                // Fluting (vertical grooves)
                ctx.fillStyle = '#C8C0B0';
                ctx.fillRect(x+5, y+3, 1, 10);
                ctx.fillRect(x+8, y+3, 1, 10);
                ctx.fillRect(x+11, y+3, 1, 10);
                // Highlight
                ctx.fillStyle = '#FFFFFF';
                ctx.globalAlpha = 0.3;
                ctx.fillRect(x+6, y+3, 1, 10);
                ctx.globalAlpha = 1;
                break;
            }
            case 'mosaic': {
                // Colorful mosaic tile pattern
                const colors = ['#D4AC0D', '#C0392B', '#2980B9', '#27AE60', '#8E44AD'];
                for (let py = 0; py < 4; py++) {
                    for (let px = 0; px < 4; px++) {
                        ctx.fillStyle = colors[(px + py * 3) % colors.length];
                        ctx.fillRect(x + px * 4, y + py * 4, 3, 3);
                    }
                }
                // Grout lines
                ctx.fillStyle = '#BDC3C7';
                for (let i = 1; i < 4; i++) {
                    ctx.fillRect(x, y + i * 4 - 1, s, 1);
                    ctx.fillRect(x + i * 4 - 1, y, 1, s);
                }
                break;
            }
            case 'phonebox': {
                // Red British phone box
                ctx.fillStyle = '#C0392B';
                ctx.fillRect(x+4, y+1, 8, 14);
                // Window panes
                ctx.fillStyle = '#AED6F1';
                ctx.fillRect(x+5, y+3, 6, 4);
                ctx.fillRect(x+5, y+8, 6, 3);
                // Cross bars
                ctx.fillStyle = '#C0392B';
                ctx.fillRect(x+5, y+5, 6, 1);
                ctx.fillRect(x+8, y+3, 1, 4);
                // Crown on top
                ctx.fillStyle = '#F1C40F';
                ctx.fillRect(x+6, y+1, 4, 1);
                // Door handle
                ctx.fillStyle = '#555555';
                ctx.fillRect(x+10, y+9, 1, 1);
                break;
            }
            case 'cherry': {
                // Cherry blossom tree
                // Trunk
                ctx.fillStyle = '#6B4226';
                ctx.fillRect(x+6, y+10, 4, 6);
                ctx.fillStyle = '#7B5236';
                ctx.fillRect(x+7, y+11, 2, 4);
                // Blossom canopy: pinks
                ctx.fillStyle = '#e8859a';
                ctx.fillRect(x+2, y+2, 12, 9);
                ctx.fillStyle = '#f8a5c2';
                ctx.fillRect(x+3, y+1, 10, 8);
                ctx.fillStyle = '#ffc8d7';
                ctx.fillRect(x+4, y+2, 6, 5);
                // Petal dots
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(x+5, y+3, 1, 1);
                ctx.fillRect(x+8, y+2, 1, 1);
                ctx.fillRect(x+10, y+5, 1, 1);
                ctx.fillRect(x+3, y+6, 1, 1);
                // Dark accent
                ctx.fillStyle = '#d8658a';
                ctx.fillRect(x+4, y+7, 2, 1);
                ctx.fillRect(x+9, y+4, 2, 1);
                break;
            }
            case 'palm': {
                // Palm tree with fronds and trunk
                // Trunk
                ctx.fillStyle = '#7D5A1E';
                ctx.fillRect(x+7, y+5, 2, 11);
                ctx.fillStyle = '#8D6A2E';
                ctx.fillRect(x+7, y+7, 2, 2);
                ctx.fillRect(x+7, y+11, 2, 2);
                // Fronds
                ctx.fillStyle = '#1B7D3A';
                ctx.fillRect(x+2, y+1, 5, 4);
                ctx.fillRect(x+9, y+1, 5, 4);
                ctx.fillStyle = '#22944A';
                ctx.fillRect(x+4, y+0, 8, 3);
                ctx.fillRect(x+1, y+2, 3, 2);
                ctx.fillRect(x+12, y+2, 3, 2);
                // Frond tips
                ctx.fillStyle = '#2AAA5A';
                ctx.fillRect(x+6, y+0, 4, 1);
                // Coconuts
                ctx.fillStyle = '#6B4226';
                ctx.fillRect(x+6, y+4, 2, 2);
                ctx.fillRect(x+8, y+5, 1, 1);
                break;
            }
            case 'torii': {
                // Torii gate with curved top beam
                ctx.fillStyle = '#AA2211';
                // Top beam (kasagi) — wider
                ctx.fillRect(x+0, y+2, 16, 2);
                // Nuki (lower beam)
                ctx.fillRect(x+2, y+5, 12, 1);
                // Pillars
                ctx.fillRect(x+3, y+2, 2, 14);
                ctx.fillRect(x+11, y+2, 2, 14);
                // Curved ends of kasagi
                ctx.fillStyle = '#CC3322';
                ctx.fillRect(x+0, y+1, 2, 1);
                ctx.fillRect(x+14, y+1, 2, 1);
                // Highlight
                ctx.fillStyle = '#DD4433';
                ctx.fillRect(x+1, y+2, 14, 1);
                break;
            }
            case 'lantern': {
                // Paper lantern with glow
                ctx.fillStyle = '#333333';
                ctx.fillRect(x+7, y+1, 2, 2); // hook
                ctx.fillStyle = '#CC3322';
                ctx.fillRect(x+5, y+3, 6, 9);
                // Paper body
                ctx.fillStyle = '#DD4433';
                ctx.fillRect(x+6, y+4, 4, 7);
                // Glow
                ctx.fillStyle = '#FFE0AA';
                ctx.fillRect(x+7, y+5, 2, 5);
                // Ribs
                ctx.fillStyle = '#AA2211';
                ctx.fillRect(x+5, y+6, 6, 1);
                ctx.fillRect(x+5, y+9, 6, 1);
                // Bottom cap
                ctx.fillStyle = '#333333';
                ctx.fillRect(x+6, y+12, 4, 1);
                // Tassel
                ctx.fillStyle = '#CC3322';
                ctx.fillRect(x+7, y+13, 2, 2);
                break;
            }
            case 'bamboo': {
                // Bamboo stalks
                ctx.fillStyle = '#2d7a2d';
                ctx.fillRect(x+3, y, 3, 16);
                ctx.fillRect(x+10, y, 3, 16);
                // Node joints
                ctx.fillStyle = '#1a5a1a';
                ctx.fillRect(x+3, y+4, 3, 1);
                ctx.fillRect(x+3, y+10, 3, 1);
                ctx.fillRect(x+10, y+3, 3, 1);
                ctx.fillRect(x+10, y+9, 3, 1);
                // Highlight
                ctx.fillStyle = '#3a9a3a';
                ctx.fillRect(x+4, y, 1, 16);
                ctx.fillRect(x+11, y, 1, 16);
                // Small leaves
                ctx.fillStyle = '#2d8a2d';
                ctx.fillRect(x+6, y+4, 3, 2);
                ctx.fillRect(x+7, y+9, 3, 2);
                break;
            }
            case 'statue': {
                // Statue on pedestal
                ctx.fillStyle = '#95a5a6';
                // Pedestal
                ctx.fillRect(x+4, y+12, 8, 4);
                ctx.fillStyle = '#aab5b6';
                ctx.fillRect(x+4, y+12, 8, 1);
                // Figure body
                ctx.fillStyle = '#b0bec5';
                ctx.fillRect(x+6, y+4, 4, 8);
                // Head
                ctx.fillRect(x+6, y+1, 4, 4);
                // Arms
                ctx.fillRect(x+4, y+5, 2, 4);
                ctx.fillRect(x+10, y+5, 2, 4);
                break;
            }
            case 'bridge': {
                // Stone bridge
                ctx.fillStyle = '#5A6B7E';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#6A7B8E';
                ctx.fillRect(x, y, s, 2);
                // Railing stones
                ctx.fillStyle = '#7A8B9E';
                ctx.fillRect(x+1, y, 2, 2);
                ctx.fillRect(x+5, y, 2, 2);
                ctx.fillRect(x+9, y, 2, 2);
                ctx.fillRect(x+13, y, 2, 2);
                // Road surface
                ctx.fillStyle = '#4A5B6E';
                ctx.fillRect(x, y+3, s, s-3);
                break;
            }
            case 'bookshop': {
                // Bookshop front
                ctx.fillStyle = '#1a5276';
                ctx.fillRect(x, y, s, s);
                // Bookshelves visible through window
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x+2, y+3, 5, 10);
                ctx.fillRect(x+9, y+3, 5, 10);
                // Books
                ctx.fillStyle = '#C0392B';
                ctx.fillRect(x+3, y+4, 1, 3);
                ctx.fillStyle = '#2980B9';
                ctx.fillRect(x+4, y+4, 1, 3);
                ctx.fillStyle = '#27AE60';
                ctx.fillRect(x+5, y+4, 1, 3);
                ctx.fillStyle = '#F1C40F';
                ctx.fillRect(x+10, y+4, 1, 3);
                ctx.fillStyle = '#9B59B6';
                ctx.fillRect(x+11, y+4, 1, 3);
                break;
            }
            case 'lamp': {
                // Street lamp
                ctx.fillStyle = '#555555';
                ctx.fillRect(x+7, y+4, 2, 12);
                // Lamp head
                ctx.fillStyle = '#777777';
                ctx.fillRect(x+5, y+1, 6, 4);
                // Glass
                ctx.fillStyle = '#FFE082';
                ctx.fillRect(x+6, y+2, 4, 2);
                // Glow
                ctx.fillStyle = '#FFEE88';
                ctx.globalAlpha = 0.3;
                ctx.fillRect(x+4, y+0, 8, 5);
                ctx.globalAlpha = 1;
                break;
            }
            case 'park': {
                // Park bench
                ctx.fillStyle = '#5D4037';
                // Seat
                ctx.fillRect(x+2, y+8, 12, 2);
                // Back rest
                ctx.fillRect(x+2, y+5, 12, 2);
                // Legs
                ctx.fillRect(x+3, y+10, 2, 4);
                ctx.fillRect(x+11, y+10, 2, 4);
                // Highlight
                ctx.fillStyle = '#795548';
                ctx.fillRect(x+3, y+5, 10, 1);
                ctx.fillRect(x+3, y+8, 10, 1);
                break;
            }
        }
    }

    generateParticleTextures() {
        // White particle (fountain spray)
        let canvas = this.textures.createCanvas('particle_white', 4, 4);
        let ctx = canvas.getContext();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(1, 1, 2, 2);
        ctx.globalAlpha = 0.6;
        ctx.fillRect(0, 0, 4, 4);
        ctx.globalAlpha = 1;
        canvas.refresh();

        // Sparkle particle (portal)
        canvas = this.textures.createCanvas('particle_sparkle', 3, 3);
        ctx = canvas.getContext();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(1, 0, 1, 3);
        ctx.fillRect(0, 1, 3, 1);
        canvas.refresh();

        // Cherry blossom petal
        canvas = this.textures.createCanvas('particle_petal', 4, 6);
        ctx = canvas.getContext();
        ctx.fillStyle = '#f8a5c2';
        ctx.fillRect(1, 0, 2, 4);
        ctx.fillRect(0, 1, 4, 2);
        ctx.fillStyle = '#ffc8d7';
        ctx.fillRect(1, 1, 2, 2);
        canvas.refresh();

        // Dust mote
        canvas = this.textures.createCanvas('particle_dust', 2, 2);
        ctx = canvas.getContext();
        ctx.fillStyle = '#ffffcc';
        ctx.fillRect(0, 0, 2, 2);
        canvas.refresh();
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
            { name: 'journal', color: '#DEB887', detail: 'book' },
            { name: 'paintbrush', color: '#8B4513', detail: 'key' },
            { name: 'fastpass', color: '#3498db', detail: 'rect' },
            { name: 'eiffel_letter', color: '#F5DEB3', detail: 'torn' },
            { name: 'reading_glasses', color: '#C0C0C0', detail: 'circle' },
            { name: 'research_pass', color: '#27AE60', detail: 'rect' },
            { name: 'amulet', color: '#FFD700', detail: 'diamond' },
            { name: 'portal_stone', color: '#9b59b6', detail: 'diamond' },
            { name: 'jade_key', color: '#2ecc71', detail: 'key' }
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
