import { AssetProvider } from './AssetProvider.js';
import { NPC_DEFS } from './npcDefinitions.js';
import { ITEM_DEFS } from './itemDefinitions.js';
import { TILE_DEFS } from './tileDefinitions.js';

/**
 * Procedural asset provider — generates all game textures programmatically
 * using canvas drawing. This is the original rendering backend extracted
 * from BootScene.
 */
export class ProceduralAssetProvider extends AssetProvider {
    constructor(scene) {
        super(scene);
    }

    async generateTextures() {
        this.generatePlayerSpritesheet();
        this.generateNPCSpritesheet();
        this.generateTileset();
        this.generateParticleTextures();
        this.generateUIAssets();
        this.generateWorldMapAssets();
        this.generateItemIcons();
    }

    async createAnimations() {
        const anims = this.scene.anims;

        // Walk animations
        anims.create({
            key: 'player_down',
            frames: [{ key: 'player', frame: 0 }, { key: 'player', frame: 1 }, { key: 'player', frame: 0 }, { key: 'player', frame: 3 }],
            frameRate: 6,
            repeat: -1
        });
        anims.create({
            key: 'player_left',
            frames: [{ key: 'player', frame: 4 }, { key: 'player', frame: 5 }, { key: 'player', frame: 4 }, { key: 'player', frame: 7 }],
            frameRate: 6,
            repeat: -1
        });
        anims.create({
            key: 'player_right',
            frames: [{ key: 'player', frame: 8 }, { key: 'player', frame: 9 }, { key: 'player', frame: 8 }, { key: 'player', frame: 11 }],
            frameRate: 6,
            repeat: -1
        });
        anims.create({
            key: 'player_up',
            frames: [{ key: 'player', frame: 12 }, { key: 'player', frame: 13 }, { key: 'player', frame: 12 }, { key: 'player', frame: 15 }],
            frameRate: 6,
            repeat: -1
        });

        // Idle frames
        anims.create({ key: 'player_idle_down', frames: [{ key: 'player', frame: 0 }], frameRate: 1, repeat: 0 });
        anims.create({ key: 'player_idle_left', frames: [{ key: 'player', frame: 4 }], frameRate: 1, repeat: 0 });
        anims.create({ key: 'player_idle_right', frames: [{ key: 'player', frame: 8 }], frameRate: 1, repeat: 0 });
        anims.create({ key: 'player_idle_up', frames: [{ key: 'player', frame: 12 }], frameRate: 1, repeat: 0 });
    }

    getNPCTypeNames() {
        return NPC_DEFS.map(d => d.name);
    }

    // ─── Player ──────────────────────────────────────────────

    generatePlayerSpritesheet() {
        const frameW = 16, frameH = 24;
        const canvas = this.scene.textures.createCanvas('player', frameW * 4, frameH * 4);
        const ctx = canvas.getContext();

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

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const frameIndex = row * 4 + col;
                this.scene.textures.get('player').add(frameIndex, 0, col * frameW, row * frameH, frameW, frameH);
            }
        }
    }

    drawPlayer(ctx, x, y, w, h, opts) {
        const cx = x + w / 2;
        const bobOffset = (opts.frame === 1 || opts.frame === 3) ? 0 : 1;
        const by = y + bobOffset;
        const isLeft = opts.facing === 'left';
        const isRight = opts.facing === 'right';
        const isSide = isLeft || isRight;
        const isDown = opts.facing === 'down';
        const isUp = opts.facing === 'up';

        // === Hair (rows 0-3) ===
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(cx - 4, by + 0, 8, 4);
        ctx.fillStyle = '#A0612B';
        if (isDown) {
            ctx.fillRect(cx - 2, by + 0, 2, 1);
            ctx.fillRect(cx + 1, by + 1, 1, 1);
        } else if (isUp) {
            ctx.fillRect(cx - 1, by + 0, 3, 1);
        } else {
            ctx.fillRect(cx - 2, by + 0, 3, 1);
        }
        if (isDown || isSide) {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(cx - 4, by + 3, 1, 3);
            ctx.fillRect(cx + 3, by + 3, 1, 3);
        }

        // === Face/Head (rows 3-7) ===
        ctx.fillStyle = '#FDBCB4';
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
            } else {
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
        ctx.fillStyle = '#E84393';
        ctx.fillRect(cx - 4, by + 9, 8, 5);
        ctx.fillStyle = '#C73878';
        ctx.fillRect(cx - 4, by + 12, 8, 2);
        ctx.fillStyle = '#F06AAE';
        if (isDown) {
            ctx.fillRect(cx - 1, by + 9, 2, 2);
        } else if (isSide) {
            ctx.fillRect(isLeft ? cx : cx - 2, by + 9, 2, 2);
        }

        // === Arms with swing animation ===
        ctx.fillStyle = '#FDBCB4';
        const armSwing = opts.frame === 1 ? 1 : opts.frame === 3 ? -1 : 0;
        if (isDown || isUp) {
            ctx.fillRect(cx - 5, by + 9 + armSwing, 1, 4);
            ctx.fillRect(cx + 4, by + 9 - armSwing, 1, 4);
        } else if (isLeft) {
            ctx.fillRect(cx - 4, by + 9 + armSwing, 1, 4);
        } else {
            ctx.fillRect(cx + 3, by + 9 + armSwing, 1, 4);
        }

        // === Skirt with pleats (rows 14-17) ===
        ctx.fillStyle = '#6C5CE7';
        ctx.fillRect(cx - 4, by + 14, 8, 3);
        ctx.fillStyle = '#5B4CC7';
        ctx.fillRect(cx - 3, by + 14, 1, 3);
        ctx.fillRect(cx, by + 14, 1, 3);
        ctx.fillRect(cx + 2, by + 14, 1, 3);
        ctx.fillStyle = '#7E6FEF';
        ctx.fillRect(cx - 4, by + 16, 8, 1);

        // === Legs with stride animation (rows 17-20) ===
        ctx.fillStyle = '#FDBCB4';
        const legStride = opts.frame === 1 ? 1 : opts.frame === 3 ? -1 : 0;
        if (isDown || isUp) {
            ctx.fillRect(cx - 2 + legStride, by + 17, 2, 3);
            ctx.fillRect(cx + 0 - legStride, by + 17, 2, 3);
        } else {
            ctx.fillRect(cx - 2 + legStride, by + 17, 2, 3);
            ctx.fillRect(cx - 1 - legStride, by + 17, 2, 3);
        }

        // === Shoes (rows 20-23) ===
        ctx.fillStyle = '#5D4037';
        if (isDown || isUp) {
            ctx.fillRect(cx - 3 + legStride, by + 20, 3, 2);
            ctx.fillRect(cx + 0 - legStride, by + 20, 3, 2);
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

    // ─── NPCs ────────────────────────────────────────────────

    generateNPCSpritesheet() {
        const frameW = 16, frameH = 24;

        NPC_DEFS.forEach((npc) => {
            const canvas = this.scene.textures.createCanvas(`npc_${npc.name}`, frameW * 4, frameH);
            const ctx = canvas.getContext();

            for (let frame = 0; frame < 4; frame++) {
                this.drawNPC(ctx, frame * frameW, 0, frameW, frameH, npc, frame);
            }

            canvas.refresh();
            for (let f = 0; f < 4; f++) {
                this.scene.textures.get(`npc_${npc.name}`).add(f, 0, f * frameW, 0, frameW, frameH);
            }
        });
    }

    drawNPC(ctx, x, y, w, h, npc, frame) {
        const cx = x + w / 2;
        const swayOffset = frame === 1 ? -1 : frame === 3 ? 1 : 0;
        const bobOffset = (frame === 1 || frame === 3) ? 0 : 1;
        const by = y + bobOffset;

        // === Hair ===
        ctx.fillStyle = npc.hair;
        ctx.fillRect(cx - 4, by + 0, 8, 4);
        ctx.fillStyle = npc.hairHi;
        ctx.fillRect(cx - 2, by + 0, 3, 1);

        if (npc.accessory === 'shawl_bun') {
            ctx.fillStyle = npc.hair;
            ctx.fillRect(cx - 2, by, 4, 1);
            ctx.fillRect(cx - 1, by, 2, 1);
        } else if (npc.accessory === 'ponytail_scarf') {
            ctx.fillStyle = npc.hair;
            ctx.fillRect(cx + 3, by + 2, 2, 5);
        } else if (npc.accessory === 'hat_apron') {
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

        if (npc.accessory === 'glasses_vest') {
            ctx.fillStyle = '#888888';
            ctx.fillRect(cx - 3, by + 4, 2, 2);
            ctx.fillRect(cx + 1, by + 4, 2, 2);
            ctx.fillRect(cx - 1, by + 5, 2, 1);
            ctx.fillStyle = '#aaddff';
            ctx.fillRect(cx - 2, by + 5, 1, 1);
            ctx.fillRect(cx + 1, by + 5, 1, 1);
        }

        if (npc.accessory === 'apron_mustache') {
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(cx - 2, by + 7, 4, 1);
        }

        // Mouth
        ctx.fillStyle = '#e07c6a';
        ctx.fillRect(cx - 1, by + 7, 2, 1);

        // === Shirt/Body (rows 8-14) ===
        ctx.fillStyle = npc.shirt;
        const bodyW = npc.accessory === 'apron_mustache' ? 9 : 8;
        const bodyX = npc.accessory === 'apron_mustache' ? cx - 5 : cx - 4;
        ctx.fillRect(bodyX + swayOffset, by + 8, bodyW, 6);
        ctx.fillStyle = npc.shirtShadow;
        ctx.fillRect(bodyX + swayOffset, by + 12, bodyW, 2);

        if (npc.accessory === 'apron_mustache') {
            ctx.fillStyle = '#F5F5DC';
            ctx.fillRect(cx - 3 + swayOffset, by + 9, 6, 5);
        }
        if (npc.accessory === 'glasses_vest') {
            ctx.fillStyle = '#6B5B3E';
            ctx.fillRect(cx - 3 + swayOffset, by + 9, 2, 4);
            ctx.fillRect(cx + 1 + swayOffset, by + 9, 2, 4);
        }
        if (npc.accessory === 'necklace_blazer') {
            ctx.fillStyle = '#1F3A5F';
            ctx.fillRect(cx - 4 + swayOffset, by + 9, 2, 5);
            ctx.fillRect(cx + 2 + swayOffset, by + 9, 2, 5);
            ctx.fillStyle = '#F5E6CA';
            ctx.fillRect(cx - 2 + swayOffset, by + 8, 4, 1);
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(cx + swayOffset, by + 9, 1, 1);
        }
        if (npc.accessory === 'ponytail_scarf') {
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(cx - 1, by + 8, 2, 2);
            ctx.fillRect(cx - 2, by + 10, 1, 3);
        }
        if (npc.accessory === 'hat_apron') {
            ctx.fillStyle = '#27AE60';
            ctx.fillRect(cx - 3 + swayOffset, by + 9, 6, 5);
        }
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

    // ─── Tileset ─────────────────────────────────────────────

    generateTileset() {
        const tileSize = 16;
        const cols = 8;
        const rows = 10;
        const canvas = this.scene.textures.createCanvas('tileset', tileSize * cols, tileSize * rows);
        const ctx = canvas.getContext();

        TILE_DEFS.forEach((tile, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = col * tileSize;
            const y = row * tileSize;

            ctx.fillStyle = tile.color;
            ctx.fillRect(x, y, tileSize, tileSize);

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
            ctx.fillStyle = '#2a6ab8';
            ctx.fillRect(wx, wy, tileSize, tileSize);
            ctx.fillStyle = '#3b7dd8';
            ctx.fillRect(wx, wy, tileSize, 6);
            ctx.fillStyle = '#4a8de8';
            ctx.fillRect(wx, wy, tileSize, 3);
            ctx.fillStyle = '#5ba3f0';
            ctx.fillRect(wx + 2 + v.waveShift, wy + 4, 4, 1);
            ctx.fillRect(wx + 10 - v.waveShift, wy + 4, 3, 1);
            ctx.fillRect(wx + 1 + v.waveShift, wy + 8, 5, 1);
            ctx.fillRect(wx + 9 - v.waveShift, wy + 9, 4, 1);
            ctx.fillRect(wx + 4 + v.waveShift, wy + 13, 6, 1);
            ctx.fillStyle = '#8bc4f5';
            ctx.fillRect(wx + 3 + v.waveShift, wy + 3, 2, 1);
            ctx.fillRect(wx + 11 - v.waveShift, wy + 7, 1, 1);
            ctx.fillRect(wx + 6 + v.waveShift, wy + 12, 2, 1);
        });

        canvas.refresh();

        const totalTiles = TILE_DEFS.length + waterVariants.length;
        for (let i = 0; i < totalTiles; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            this.scene.textures.get('tileset').add(i, 0, col * tileSize, row * tileSize, tileSize, tileSize);
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
                ctx.fillStyle = '#b8a880';
                ctx.fillRect(x, y, s, s);
                const stones = [
                    [0,0,7,7], [8,0,8,6], [0,8,6,8], [7,7,9,9]
                ];
                stones.forEach(([sx,sy,sw,sh]) => {
                    ctx.fillStyle = '#c8b88a';
                    ctx.fillRect(x+sx+1, y+sy+1, sw-1, sh-1);
                    ctx.fillStyle = '#d8c89a';
                    ctx.fillRect(x+sx+1, y+sy+1, sw-2, 1);
                    ctx.fillRect(x+sx+1, y+sy+1, 1, sh-2);
                    ctx.fillStyle = '#a09070';
                    ctx.fillRect(x+sx+1, y+sy+sh-1, sw-1, 1);
                    ctx.fillRect(x+sx+sw-1, y+sy+1, 1, sh-1);
                });
                ctx.fillStyle = '#887860';
                ctx.fillRect(x+7, y, 1, s);
                ctx.fillRect(x, y+7, s, 1);
                break;
            }
            case 'grass': {
                ctx.fillStyle = '#4a8c3f';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#3a7030';
                ctx.fillRect(x+1, y+3, 3, 3);
                ctx.fillRect(x+8, y+10, 4, 3);
                ctx.fillRect(x+11, y+1, 3, 3);
                ctx.fillStyle = '#5ca84f';
                ctx.fillRect(x+2, y+2, 1, 3);
                ctx.fillRect(x+7, y+1, 1, 4);
                ctx.fillRect(x+12, y+5, 1, 3);
                ctx.fillRect(x+4, y+9, 1, 3);
                ctx.fillRect(x+14, y+10, 1, 3);
                ctx.fillStyle = '#ffd93d';
                ctx.fillRect(x+5, y+5, 1, 1);
                ctx.fillStyle = '#ff9ff3';
                ctx.fillRect(x+10, y+7, 1, 1);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(x+3, y+12, 1, 1);
                break;
            }
            case 'water': {
                ctx.fillStyle = '#2a6ab8';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#3b7dd8';
                ctx.fillRect(x, y, s, 6);
                ctx.fillStyle = '#4a8de8';
                ctx.fillRect(x, y, s, 3);
                ctx.fillStyle = '#5ba3f0';
                ctx.fillRect(x+2, y+4, 4, 1);
                ctx.fillRect(x+10, y+4, 3, 1);
                ctx.fillRect(x+1, y+8, 5, 1);
                ctx.fillRect(x+9, y+9, 4, 1);
                ctx.fillRect(x+4, y+13, 6, 1);
                ctx.fillStyle = '#8bc4f5';
                ctx.fillRect(x+3, y+3, 2, 1);
                ctx.fillRect(x+11, y+7, 1, 1);
                ctx.fillRect(x+6, y+12, 2, 1);
                break;
            }
            case 'brick': {
                const baseColor = tile.color;
                ctx.fillStyle = '#665544';
                ctx.fillRect(x, y, s, s);
                for (let row = 0; row < 4; row++) {
                    const offset = (row % 2) * 4;
                    for (let bx = 0; bx < 2; bx++) {
                        const brickX = x + offset + bx * 8;
                        const brickY = y + row * 4;
                        const bw = Math.min(7, x + s - brickX);
                        if (bw <= 0) continue;
                        ctx.fillStyle = baseColor;
                        ctx.fillRect(brickX, brickY + 1, bw, 3);
                        ctx.fillStyle = '#ffffff';
                        ctx.globalAlpha = 0.15;
                        ctx.fillRect(brickX, brickY + 1, bw, 1);
                        ctx.globalAlpha = 1;
                        ctx.fillStyle = '#000000';
                        ctx.globalAlpha = 0.15;
                        ctx.fillRect(brickX, brickY + 3, bw, 1);
                        ctx.globalAlpha = 1;
                    }
                }
                ctx.fillStyle = '#444444';
                ctx.globalAlpha = 0.2;
                ctx.fillRect(x+5, y+5, 1, 3);
                ctx.globalAlpha = 1;
                break;
            }
            case 'tree': {
                ctx.fillStyle = '#2a6628';
                ctx.fillRect(x+3, y+12, 10, 2);
                ctx.fillStyle = '#6B4226';
                ctx.fillRect(x+6, y+9, 4, 7);
                ctx.fillStyle = '#7B5236';
                ctx.fillRect(x+7, y+10, 2, 5);
                ctx.fillStyle = '#5B3216';
                ctx.fillRect(x+6, y+11, 1, 3);
                ctx.fillStyle = '#1a6a1a';
                ctx.fillRect(x+3, y+3, 10, 7);
                ctx.fillStyle = '#2a8a2a';
                ctx.fillRect(x+2, y+2, 10, 6);
                ctx.fillStyle = '#3aaa3a';
                ctx.fillRect(x+4, y+1, 6, 3);
                ctx.fillRect(x+3, y+2, 2, 2);
                ctx.fillRect(x+10, y+3, 2, 2);
                ctx.fillStyle = '#1a6a1a';
                ctx.fillRect(x+5, y+3, 1, 1);
                ctx.fillRect(x+8, y+2, 1, 1);
                ctx.fillRect(x+4, y+5, 1, 1);
                ctx.fillRect(x+9, y+6, 1, 1);
                break;
            }
            case 'flower': {
                ctx.fillStyle = '#4a8c3f';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#3a7030';
                ctx.fillRect(x+1, y+2, 4, 3);
                ctx.fillRect(x+9, y+8, 4, 3);
                ctx.fillStyle = '#ff4444';
                ctx.fillRect(x+3, y+2, 3, 3);
                ctx.fillStyle = '#ffdd00';
                ctx.fillRect(x+4, y+3, 1, 1);
                ctx.fillStyle = '#ffdd44';
                ctx.fillRect(x+10, y+7, 3, 3);
                ctx.fillStyle = '#ff8800';
                ctx.fillRect(x+11, y+8, 1, 1);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(x+6, y+11, 3, 3);
                ctx.fillStyle = '#ffdd00';
                ctx.fillRect(x+7, y+12, 1, 1);
                ctx.fillStyle = '#2d6a2d';
                ctx.fillRect(x+4, y+5, 1, 2);
                ctx.fillRect(x+11, y+10, 1, 2);
                ctx.fillRect(x+7, y+14, 1, 2);
                break;
            }
            case 'fountain': {
                ctx.fillStyle = '#666666';
                ctx.fillRect(x+2, y+3, 12, 11);
                ctx.fillStyle = '#888888';
                ctx.fillRect(x+3, y+3, 10, 1);
                ctx.fillStyle = '#555555';
                ctx.fillRect(x+2, y+13, 12, 1);
                ctx.fillStyle = '#3b7dd8';
                ctx.fillRect(x+4, y+5, 8, 7);
                ctx.fillStyle = '#5ba3f0';
                ctx.fillRect(x+5, y+6, 4, 3);
                ctx.fillStyle = '#777777';
                ctx.fillRect(x+7, y+5, 2, 4);
                ctx.fillStyle = '#aaddff';
                ctx.fillRect(x+7, y+2, 2, 3);
                ctx.fillRect(x+6, y+3, 1, 1);
                ctx.fillRect(x+9, y+3, 1, 1);
                break;
            }
            case 'chest': {
                ctx.fillStyle = '#5C4A1E';
                ctx.fillRect(x+3, y+5, 10, 9);
                ctx.fillStyle = '#7B6428';
                ctx.fillRect(x+3, y+5, 10, 4);
                ctx.fillStyle = '#8B7438';
                ctx.fillRect(x+4, y+5, 8, 1);
                ctx.fillStyle = '#6B5420';
                ctx.fillRect(x+3, y+9, 10, 5);
                ctx.fillStyle = '#888888';
                ctx.fillRect(x+3, y+8, 10, 1);
                ctx.fillRect(x+3, y+12, 10, 1);
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(x+7, y+9, 2, 3);
                ctx.fillStyle = '#FFA500';
                ctx.fillRect(x+7, y+10, 2, 1);
                ctx.fillStyle = '#333333';
                ctx.fillRect(x+8, y+10, 1, 1);
                break;
            }
            case 'portal': {
                ctx.fillStyle = '#6C3483';
                ctx.fillRect(x+3, y+1, 10, 14);
                ctx.fillStyle = '#8E44AD';
                ctx.fillRect(x+4, y+2, 8, 12);
                ctx.fillStyle = '#c39bd3';
                ctx.fillRect(x+5, y+3, 6, 10);
                ctx.fillStyle = '#d7bde2';
                ctx.fillRect(x+6, y+4, 4, 8);
                ctx.fillStyle = '#f4ecf7';
                ctx.fillRect(x+7, y+6, 2, 4);
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
                ctx.fillStyle = '#7B4A25';
                ctx.fillRect(x+5, y+4, 6, 4);
                ctx.fillRect(x+5, y+10, 6, 4);
                ctx.fillStyle = '#9B6A3F';
                ctx.fillRect(x+5, y+4, 6, 1);
                ctx.fillRect(x+5, y+10, 6, 1);
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(x+10, y+9, 2, 2);
                ctx.fillStyle = '#FFA500';
                ctx.fillRect(x+10, y+10, 1, 1);
                break;
            }
            case 'sign': {
                ctx.fillStyle = '#6B4226';
                ctx.fillRect(x+7, y+8, 2, 8);
                ctx.fillStyle = '#DEB887';
                ctx.fillRect(x+3, y+2, 10, 7);
                ctx.fillStyle = '#C8A070';
                ctx.fillRect(x+3, y+8, 10, 1);
                ctx.fillStyle = '#6B4226';
                ctx.fillRect(x+5, y+4, 6, 1);
                ctx.fillRect(x+5, y+6, 4, 1);
                ctx.fillStyle = '#888888';
                ctx.fillRect(x+8, y+2, 1, 1);
                break;
            }
            case 'eiffel': {
                ctx.fillStyle = '#4A5A6A';
                ctx.fillRect(x+6, y+0, 4, 16);
                ctx.fillRect(x+4, y+7, 8, 2);
                ctx.fillRect(x+2, y+13, 4, 3);
                ctx.fillRect(x+10, y+13, 4, 3);
                ctx.fillStyle = '#5D6D7E';
                ctx.fillRect(x+7, y+1, 2, 1);
                ctx.fillRect(x+6, y+3, 1, 1);
                ctx.fillRect(x+9, y+3, 1, 1);
                ctx.fillRect(x+6, y+5, 1, 1);
                ctx.fillRect(x+9, y+5, 1, 1);
                ctx.fillStyle = '#7D8D9E';
                ctx.fillRect(x+7, y+0, 1, 7);
                ctx.fillRect(x+5, y+7, 1, 1);
                ctx.fillStyle = '#3A4A5A';
                ctx.fillRect(x+5, y+10, 1, 3);
                ctx.fillRect(x+10, y+10, 1, 3);
                break;
            }
            case 'bigben': {
                ctx.fillStyle = '#6E4B00';
                ctx.fillRect(x+5, y+0, 6, 16);
                ctx.fillStyle = '#F5F5DC';
                ctx.fillRect(x+6, y+2, 4, 4);
                ctx.fillStyle = '#8B6914';
                ctx.fillRect(x+6, y+2, 4, 1);
                ctx.fillRect(x+6, y+5, 4, 1);
                ctx.fillRect(x+6, y+2, 1, 4);
                ctx.fillRect(x+9, y+2, 1, 4);
                ctx.fillStyle = '#333333';
                ctx.fillRect(x+8, y+3, 1, 2);
                ctx.fillRect(x+7, y+4, 2, 1);
                ctx.fillStyle = '#7E5B10';
                ctx.fillRect(x+6, y+7, 4, 1);
                ctx.fillRect(x+6, y+10, 4, 1);
                ctx.fillStyle = '#555555';
                ctx.fillRect(x+7, y+0, 2, 2);
                break;
            }
            case 'column': {
                ctx.fillStyle = '#E8E0D0';
                ctx.fillRect(x+4, y+1, 8, 14);
                ctx.fillStyle = '#F0E8D8';
                ctx.fillRect(x+3, y+1, 10, 2);
                ctx.fillStyle = '#D0C8B8';
                ctx.fillRect(x+3, y+13, 10, 2);
                ctx.fillStyle = '#C8C0B0';
                ctx.fillRect(x+5, y+3, 1, 10);
                ctx.fillRect(x+8, y+3, 1, 10);
                ctx.fillRect(x+11, y+3, 1, 10);
                ctx.fillStyle = '#FFFFFF';
                ctx.globalAlpha = 0.3;
                ctx.fillRect(x+6, y+3, 1, 10);
                ctx.globalAlpha = 1;
                break;
            }
            case 'mosaic': {
                const colors = ['#D4AC0D', '#C0392B', '#2980B9', '#27AE60', '#8E44AD'];
                for (let py = 0; py < 4; py++) {
                    for (let px = 0; px < 4; px++) {
                        ctx.fillStyle = colors[(px + py * 3) % colors.length];
                        ctx.fillRect(x + px * 4, y + py * 4, 3, 3);
                    }
                }
                ctx.fillStyle = '#BDC3C7';
                for (let i = 1; i < 4; i++) {
                    ctx.fillRect(x, y + i * 4 - 1, s, 1);
                    ctx.fillRect(x + i * 4 - 1, y, 1, s);
                }
                break;
            }
            case 'phonebox': {
                ctx.fillStyle = '#C0392B';
                ctx.fillRect(x+4, y+1, 8, 14);
                ctx.fillStyle = '#AED6F1';
                ctx.fillRect(x+5, y+3, 6, 4);
                ctx.fillRect(x+5, y+8, 6, 3);
                ctx.fillStyle = '#C0392B';
                ctx.fillRect(x+5, y+5, 6, 1);
                ctx.fillRect(x+8, y+3, 1, 4);
                ctx.fillStyle = '#F1C40F';
                ctx.fillRect(x+6, y+1, 4, 1);
                ctx.fillStyle = '#555555';
                ctx.fillRect(x+10, y+9, 1, 1);
                break;
            }
            case 'cherry': {
                ctx.fillStyle = '#6B4226';
                ctx.fillRect(x+6, y+10, 4, 6);
                ctx.fillStyle = '#7B5236';
                ctx.fillRect(x+7, y+11, 2, 4);
                ctx.fillStyle = '#e8859a';
                ctx.fillRect(x+2, y+2, 12, 9);
                ctx.fillStyle = '#f8a5c2';
                ctx.fillRect(x+3, y+1, 10, 8);
                ctx.fillStyle = '#ffc8d7';
                ctx.fillRect(x+4, y+2, 6, 5);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(x+5, y+3, 1, 1);
                ctx.fillRect(x+8, y+2, 1, 1);
                ctx.fillRect(x+10, y+5, 1, 1);
                ctx.fillRect(x+3, y+6, 1, 1);
                ctx.fillStyle = '#d8658a';
                ctx.fillRect(x+4, y+7, 2, 1);
                ctx.fillRect(x+9, y+4, 2, 1);
                break;
            }
            case 'palm': {
                ctx.fillStyle = '#7D5A1E';
                ctx.fillRect(x+7, y+5, 2, 11);
                ctx.fillStyle = '#8D6A2E';
                ctx.fillRect(x+7, y+7, 2, 2);
                ctx.fillRect(x+7, y+11, 2, 2);
                ctx.fillStyle = '#1B7D3A';
                ctx.fillRect(x+2, y+1, 5, 4);
                ctx.fillRect(x+9, y+1, 5, 4);
                ctx.fillStyle = '#22944A';
                ctx.fillRect(x+4, y+0, 8, 3);
                ctx.fillRect(x+1, y+2, 3, 2);
                ctx.fillRect(x+12, y+2, 3, 2);
                ctx.fillStyle = '#2AAA5A';
                ctx.fillRect(x+6, y+0, 4, 1);
                ctx.fillStyle = '#6B4226';
                ctx.fillRect(x+6, y+4, 2, 2);
                ctx.fillRect(x+8, y+5, 1, 1);
                break;
            }
            case 'torii': {
                ctx.fillStyle = '#AA2211';
                ctx.fillRect(x+0, y+2, 16, 2);
                ctx.fillRect(x+2, y+5, 12, 1);
                ctx.fillRect(x+3, y+2, 2, 14);
                ctx.fillRect(x+11, y+2, 2, 14);
                ctx.fillStyle = '#CC3322';
                ctx.fillRect(x+0, y+1, 2, 1);
                ctx.fillRect(x+14, y+1, 2, 1);
                ctx.fillStyle = '#DD4433';
                ctx.fillRect(x+1, y+2, 14, 1);
                break;
            }
            case 'lantern': {
                ctx.fillStyle = '#333333';
                ctx.fillRect(x+7, y+1, 2, 2);
                ctx.fillStyle = '#CC3322';
                ctx.fillRect(x+5, y+3, 6, 9);
                ctx.fillStyle = '#DD4433';
                ctx.fillRect(x+6, y+4, 4, 7);
                ctx.fillStyle = '#FFE0AA';
                ctx.fillRect(x+7, y+5, 2, 5);
                ctx.fillStyle = '#AA2211';
                ctx.fillRect(x+5, y+6, 6, 1);
                ctx.fillRect(x+5, y+9, 6, 1);
                ctx.fillStyle = '#333333';
                ctx.fillRect(x+6, y+12, 4, 1);
                ctx.fillStyle = '#CC3322';
                ctx.fillRect(x+7, y+13, 2, 2);
                break;
            }
            case 'bamboo': {
                ctx.fillStyle = '#2d7a2d';
                ctx.fillRect(x+3, y, 3, 16);
                ctx.fillRect(x+10, y, 3, 16);
                ctx.fillStyle = '#1a5a1a';
                ctx.fillRect(x+3, y+4, 3, 1);
                ctx.fillRect(x+3, y+10, 3, 1);
                ctx.fillRect(x+10, y+3, 3, 1);
                ctx.fillRect(x+10, y+9, 3, 1);
                ctx.fillStyle = '#3a9a3a';
                ctx.fillRect(x+4, y, 1, 16);
                ctx.fillRect(x+11, y, 1, 16);
                ctx.fillStyle = '#2d8a2d';
                ctx.fillRect(x+6, y+4, 3, 2);
                ctx.fillRect(x+7, y+9, 3, 2);
                break;
            }
            case 'statue': {
                ctx.fillStyle = '#95a5a6';
                ctx.fillRect(x+4, y+12, 8, 4);
                ctx.fillStyle = '#aab5b6';
                ctx.fillRect(x+4, y+12, 8, 1);
                ctx.fillStyle = '#b0bec5';
                ctx.fillRect(x+6, y+4, 4, 8);
                ctx.fillRect(x+6, y+1, 4, 4);
                ctx.fillRect(x+4, y+5, 2, 4);
                ctx.fillRect(x+10, y+5, 2, 4);
                break;
            }
            case 'bridge': {
                ctx.fillStyle = '#5A6B7E';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#6A7B8E';
                ctx.fillRect(x, y, s, 2);
                ctx.fillStyle = '#7A8B9E';
                ctx.fillRect(x+1, y, 2, 2);
                ctx.fillRect(x+5, y, 2, 2);
                ctx.fillRect(x+9, y, 2, 2);
                ctx.fillRect(x+13, y, 2, 2);
                ctx.fillStyle = '#4A5B6E';
                ctx.fillRect(x, y+3, s, s-3);
                break;
            }
            case 'bookshop': {
                ctx.fillStyle = '#1a5276';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x+2, y+3, 5, 10);
                ctx.fillRect(x+9, y+3, 5, 10);
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
                ctx.fillStyle = '#555555';
                ctx.fillRect(x+7, y+4, 2, 12);
                ctx.fillStyle = '#777777';
                ctx.fillRect(x+5, y+1, 6, 4);
                ctx.fillStyle = '#FFE082';
                ctx.fillRect(x+6, y+2, 4, 2);
                ctx.fillStyle = '#FFEE88';
                ctx.globalAlpha = 0.3;
                ctx.fillRect(x+4, y+0, 8, 5);
                ctx.globalAlpha = 1;
                break;
            }
            case 'park': {
                ctx.fillStyle = '#5D4037';
                ctx.fillRect(x+2, y+8, 12, 2);
                ctx.fillRect(x+2, y+5, 12, 2);
                ctx.fillRect(x+3, y+10, 2, 4);
                ctx.fillRect(x+11, y+10, 2, 4);
                ctx.fillStyle = '#795548';
                ctx.fillRect(x+3, y+5, 10, 1);
                ctx.fillRect(x+3, y+8, 10, 1);
                break;
            }
        }
    }

    // ─── Particles ───────────────────────────────────────────

    generateParticleTextures() {
        const textures = this.scene.textures;

        // White particle (fountain spray)
        let canvas = textures.createCanvas('particle_white', 4, 4);
        let ctx = canvas.getContext();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(1, 1, 2, 2);
        ctx.globalAlpha = 0.6;
        ctx.fillRect(0, 0, 4, 4);
        ctx.globalAlpha = 1;
        canvas.refresh();

        // Sparkle particle (portal)
        canvas = textures.createCanvas('particle_sparkle', 3, 3);
        ctx = canvas.getContext();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(1, 0, 1, 3);
        ctx.fillRect(0, 1, 3, 1);
        canvas.refresh();

        // Cherry blossom petal
        canvas = textures.createCanvas('particle_petal', 4, 6);
        ctx = canvas.getContext();
        ctx.fillStyle = '#f8a5c2';
        ctx.fillRect(1, 0, 2, 4);
        ctx.fillRect(0, 1, 4, 2);
        ctx.fillStyle = '#ffc8d7';
        ctx.fillRect(1, 1, 2, 2);
        canvas.refresh();

        // Dust mote
        canvas = textures.createCanvas('particle_dust', 2, 2);
        ctx = canvas.getContext();
        ctx.fillStyle = '#ffffcc';
        ctx.fillRect(0, 0, 2, 2);
        canvas.refresh();
    }

    // ─── UI Assets ───────────────────────────────────────────

    generateUIAssets() {
        const textures = this.scene.textures;

        // Dialog box background
        let canvas = textures.createCanvas('dialog_bg', 300, 64);
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
        canvas = textures.createCanvas('button_bg', 120, 24);
        ctx = canvas.getContext();
        ctx.fillStyle = '#2d1b69';
        ctx.fillRect(0, 0, 120, 24);
        ctx.strokeStyle = '#8866cc';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, 118, 22);
        canvas.refresh();

        // Button hover
        canvas = textures.createCanvas('button_hover', 120, 24);
        ctx = canvas.getContext();
        ctx.fillStyle = '#4a2d8e';
        ctx.fillRect(0, 0, 120, 24);
        ctx.strokeStyle = '#ccaaff';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, 118, 22);
        canvas.refresh();

        // Inventory panel
        canvas = textures.createCanvas('inventory_bg', 160, 200);
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
        canvas = textures.createCanvas('interact_icon', 8, 8);
        ctx = canvas.getContext();
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(3, 0, 2, 5);
        ctx.fillRect(3, 6, 2, 2);
        canvas.refresh();

        // Quest marker (?)
        canvas = textures.createCanvas('quest_marker', 8, 10);
        ctx = canvas.getContext();
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(2, 0, 4, 2);
        ctx.fillRect(5, 2, 2, 2);
        ctx.fillRect(3, 4, 3, 2);
        ctx.fillRect(3, 6, 2, 1);
        ctx.fillRect(3, 8, 2, 2);
        canvas.refresh();

        // Arrow indicator
        canvas = textures.createCanvas('arrow', 8, 8);
        ctx = canvas.getContext();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(3, 0, 2, 2);
        ctx.fillRect(2, 2, 4, 2);
        ctx.fillRect(1, 4, 6, 2);
        ctx.fillRect(0, 6, 8, 2);
        canvas.refresh();
    }

    // ─── World Map ───────────────────────────────────────────

    generateWorldMapAssets() {
        const textures = this.scene.textures;

        // City dot
        let canvas = textures.createCanvas('city_dot', 8, 8);
        let ctx = canvas.getContext();
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(2, 2, 4, 4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(3, 3, 2, 2);
        canvas.refresh();

        // Locked city dot
        canvas = textures.createCanvas('city_locked', 8, 8);
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
            canvas = textures.createCanvas(`transport_${t.name}`, 10, 10);
            ctx = canvas.getContext();
            ctx.fillStyle = t.color;
            ctx.fillRect(1, 1, 8, 8);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(3, 3, 4, 4);
            canvas.refresh();
        });

        // World map background
        canvas = textures.createCanvas('world_map_bg', 320, 240);
        ctx = canvas.getContext();

        // Ocean
        ctx.fillStyle = '#2c5f8a';
        ctx.fillRect(0, 0, 320, 240);

        // Subtle wave pattern
        ctx.fillStyle = '#2a5a82';
        for (let i = 0; i < 20; i++) {
            const wavey = 20 + i * 12;
            for (let x = 0; x < 320; x += 8) {
                ctx.fillRect(x + (i % 2) * 4, wavey, 6, 1);
            }
        }

        // Europe landmass
        ctx.fillStyle = '#4a8c3f';
        ctx.fillRect(80, 40, 80, 60);
        ctx.fillRect(100, 30, 50, 20);
        ctx.fillRect(90, 90, 60, 30);
        ctx.fillRect(85, 25, 20, 35);
        ctx.fillRect(130, 80, 15, 40);
        ctx.fillRect(160, 70, 40, 30);
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

    // ─── Item Icons ──────────────────────────────────────────

    generateItemIcons() {
        const textures = this.scene.textures;

        ITEM_DEFS.forEach(item => {
            const canvas = textures.createCanvas(`item_${item.name}`, 16, 16);
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
}
