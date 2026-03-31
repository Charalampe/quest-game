import { AssetProvider } from './AssetProvider.js';
import { NPC_DEFS } from './npcDefinitions.js';
import { ITEM_DEFS } from './itemDefinitions.js';
import { TILE_DEFS } from './tileDefinitions.js';
import { TILE_W, TILE_H, SPRITE_W, SPRITE_H } from '../constants.js';

/**
 * Manga sprite provider — generates all game textures programmatically
 * at 2× resolution (32x32 tiles, 32x48 sprites) for high-resolution rendering.
 * Enhanced with manga aesthetics: bold outlines, cel-shading, vibrant colors.
 */
export class MangaSpriteProvider extends AssetProvider {
    constructor(scene) {
        super(scene);
        this.loadedSprites = new Set(); // track which external sprites loaded
    }

    /**
     * Load external PIPOYA sprite sheets during preload phase.
     * Only attempts loads when src/assets/sprites/manifest.json exists.
     * Falls back to procedural generation for any sprites not listed or that fail to load.
     *
     * To enable external sprites:
     * 1. Place PNG spritesheets in src/assets/sprites/
     * 2. Create src/assets/sprites/manifest.json listing available files:
     *    { "player": "lea.png", "npcs": { "librarian": "npc_librarian.png", ... } }
     * 3. The system auto-detects and uses them on next load.
     */
    loadSpriteSheets() {
        // Only load the manifest — 1 request. If it 404s, no sprite loads are attempted.
        this.scene.load.json('sprite_manifest', 'src/assets/sprites/manifest.json');
    }

    /**
     * If manifest was loaded, queue sprite sheets and wait for them.
     * Returns a Promise that resolves when all sprites are loaded (or immediately if none).
     */
    _loadExternalSprites() {
        const cache = this.scene.cache;
        if (!cache.json.has('sprite_manifest')) return Promise.resolve();

        const manifest = cache.json.get('sprite_manifest');
        if (!manifest) return Promise.resolve();

        const loader = this.scene.load;
        const frameConfig = { frameWidth: SPRITE_W, frameHeight: SPRITE_H };
        let queued = false;

        // Queue player sprite
        if (manifest.player) {
            loader.spritesheet('player_ext', `src/assets/sprites/${manifest.player}`, frameConfig);
            queued = true;
        }

        // Queue NPC sprites listed in manifest
        if (manifest.npcs) {
            for (const [name, file] of Object.entries(manifest.npcs)) {
                loader.spritesheet(`npc_${name}_ext`, `src/assets/sprites/${file}`, frameConfig);
                queued = true;
            }
        }

        if (!queued) return Promise.resolve();

        // Return a promise that resolves when this load batch finishes
        return new Promise(resolve => {
            const onComplete = (key) => { this.loadedSprites.add(key); };
            loader.on('filecomplete', onComplete);
            loader.once('complete', () => {
                loader.off('filecomplete', onComplete);
                resolve();
            });
            loader.start();
        });
    }

    async generateTextures() {
        // Load external sprites if manifest was found during preload
        await this._loadExternalSprites();

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

        // Walk animations (same frame indices, just bigger frames)
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

    /**
     * Remap a PIPOYA-format external spritesheet to the game's expected frame layout.
     * PIPOYA uses 3 frames/direction (4 rows = down/left/right/up, 3 cols).
     * Game expects 4 frames/direction in a single row per direction.
     * Animation mapping: game frames 0,1,2,3 → PIPOYA frames 0,1,0,2 (stand/step1/stand/step2).
     *
     * If the external texture has ≥4 columns, it's already in our format — just copy frames.
     */
    _remapExternalSprite(extKey, targetKey) {
        const textures = this.scene.textures;
        const srcTex = textures.get(extKey);
        if (!srcTex || !srcTex.source || !srcTex.source[0]) return;

        const srcImg = srcTex.source[0].image;
        const fw = SPRITE_W;
        const fh = SPRITE_H;
        const srcCols = Math.floor(srcImg.width / fw);
        const srcRows = Math.floor(srcImg.height / fh);

        // Create target canvas (4 cols × 4 rows for procedural compat)
        const canvas = textures.createCanvas(targetKey, fw * 4, fh * 4);
        const ctx = canvas.getContext();

        // PIPOYA layout: 3 cols × 4 rows (down, left, right, up)
        // Game layout: 4 cols × 4 rows (each row = 1 direction, 4 frames)
        const isPipoya = (srcCols === 3 && srcRows >= 4);

        for (let row = 0; row < 4; row++) {
            if (isPipoya) {
                // Map 3-frame PIPOYA to 4-frame: stand, step1, stand, step2
                const frameMap = [0, 1, 0, 2]; // PIPOYA col indices
                for (let col = 0; col < 4; col++) {
                    const srcCol = frameMap[col];
                    ctx.drawImage(srcImg,
                        srcCol * fw, row * fh, fw, fh,
                        col * fw, row * fh, fw, fh);
                }
            } else {
                // Already 4+ columns — copy directly
                for (let col = 0; col < 4; col++) {
                    const srcCol = Math.min(col, srcCols - 1);
                    ctx.drawImage(srcImg,
                        srcCol * fw, row * fh, fw, fh,
                        col * fw, row * fh, fw, fh);
                }
            }
        }

        canvas.refresh();

        // Register frame indices
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const frameIndex = row * 4 + col;
                textures.get(targetKey).add(frameIndex, 0, col * fw, row * fh, fw, fh);
            }
        }
    }

    // ─── Player ──────────────────────────────────────────────

    generatePlayerSpritesheet() {
        // If external player sprite was loaded, copy it and remap frames
        if (this.loadedSprites.has('player_ext')) {
            this._remapExternalSprite('player_ext', 'player');
            return;
        }

        // Procedural fallback
        const frameW = 32, frameH = 48;
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
        const bobOffset = (opts.frame === 1 || opts.frame === 3) ? 0 : 2;
        const by = y + bobOffset;
        const isLeft = opts.facing === 'left';
        const isRight = opts.facing === 'right';
        const isSide = isLeft || isRight;
        const isDown = opts.facing === 'down';
        const isUp = opts.facing === 'up';

        // === Hair with flowing strands and outline (rows 0-6) ===
        ctx.fillStyle = '#1a0d00'; // Dark outline
        ctx.fillRect(cx - 9, by, 18, 9);
        ctx.fillRect(cx - 9, by + 5, 3, 8);
        ctx.fillRect(cx + 6, by + 5, 3, 8);

        ctx.fillStyle = '#6B3410'; // Shadow color
        ctx.fillRect(cx - 8, by + 0, 16, 8);
        ctx.fillRect(cx - 8, by + 6, 2, 6);
        ctx.fillRect(cx + 6, by + 6, 2, 6);

        ctx.fillStyle = '#8B4513'; // Base hair color
        ctx.fillRect(cx - 7, by + 1, 14, 6);
        if (isDown || isSide) {
            ctx.fillRect(cx - 7, by + 6, 2, 5);
            ctx.fillRect(cx + 5, by + 6, 2, 5);
        }

        ctx.fillStyle = '#B8651F'; // Highlight color
        if (isDown) {
            ctx.fillRect(cx - 3, by + 1, 3, 3);
            ctx.fillRect(cx + 1, by + 2, 2, 2);
        } else if (isUp) {
            ctx.fillRect(cx - 2, by + 1, 5, 2);
        } else {
            ctx.fillRect(cx - 3, by + 1, 5, 2);
        }

        // === Pink ribbon/bow in hair ===
        ctx.fillStyle = '#FF1493'; // Hot pink
        if (isDown || isSide) {
            ctx.fillRect(cx + 5, by + 2, 3, 2);
            ctx.fillRect(cx + 4, by + 3, 2, 2);
            ctx.fillRect(cx + 7, by + 3, 2, 2);
        }

        // === Face/Head with outline (rows 6-14) ===
        ctx.fillStyle = '#1a0d00'; // Dark outline
        ctx.fillRect(cx - 7, by + 5, 14, 12);

        ctx.fillStyle = '#E8A591'; // Shadow skin tone
        ctx.fillRect(cx - 6, by + 6, 12, 10);

        ctx.fillStyle = '#FDBCB4'; // Base skin tone
        ctx.fillRect(cx - 5, by + 7, 10, 8);

        // === Large anime-style eyes with highlights (row 10) ===
        if (!isUp) {
            // Eye outlines
            ctx.fillStyle = '#1a1a2e';
            if (isDown) {
                // Larger eyes for front view
                ctx.fillRect(cx - 5, by + 9, 3, 4);
                ctx.fillRect(cx + 2, by + 9, 3, 4);
                // White highlights
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(cx - 4, by + 10, 1, 1);
                ctx.fillRect(cx + 3, by + 10, 1, 1);
            } else if (isLeft) {
                ctx.fillRect(cx - 4, by + 10, 2, 3);
                ctx.fillRect(cx, by + 10, 2, 2);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(cx - 3, by + 10, 1, 1);
                ctx.fillRect(cx + 1, by + 10, 1, 1);
            } else {
                ctx.fillRect(cx + 2, by + 10, 2, 3);
                ctx.fillRect(cx - 2, by + 10, 2, 2);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(cx + 3, by + 10, 1, 1);
                ctx.fillRect(cx - 1, by + 10, 1, 1);
            }
        }

        // === Blush circles on cheeks when facing down ===
        if (isDown) {
            ctx.fillStyle = '#FF9999';
            ctx.globalAlpha = 0.5;
            ctx.fillRect(cx - 6, by + 11, 2, 2);
            ctx.fillRect(cx + 4, by + 11, 2, 2);
            ctx.globalAlpha = 1;
        }

        // === Mouth (row 14) ===
        if (isDown) {
            ctx.fillStyle = '#1a0d00'; // Outline
            ctx.fillRect(cx - 2, by + 13, 5, 3);
            ctx.fillStyle = '#e07c6a';
            ctx.fillRect(cx - 1, by + 14, 3, 2);
        } else if (isSide) {
            ctx.fillStyle = '#e07c6a';
            ctx.fillRect(isLeft ? cx - 3 : cx + 2, by + 14, 2, 2);
        }

        // === Collar with outline (row 16) ===
        ctx.fillStyle = '#1a0d00';
        ctx.fillRect(cx - 7, by + 15, 14, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - 6, by + 16, 12, 2);

        // === Shirt with cel-shading and outline (rows 18-28) ===
        ctx.fillStyle = '#1a0d00'; // Outline
        ctx.fillRect(cx - 9, by + 17, 18, 12);

        ctx.fillStyle = '#C73878'; // Shadow color
        ctx.fillRect(cx - 8, by + 18, 16, 10);
        ctx.fillRect(cx - 8, by + 24, 16, 4);

        ctx.fillStyle = '#E84393'; // Base shirt color
        ctx.fillRect(cx - 7, by + 19, 14, 8);

        ctx.fillStyle = '#F06AAE'; // Highlight color
        if (isDown) {
            ctx.fillRect(cx - 2, by + 19, 4, 3);
        } else if (isSide) {
            ctx.fillRect(isLeft ? cx : cx - 4, by + 19, 4, 3);
        }

        // === Arms with swing animation and outline ===
        const armSwing = opts.frame === 1 ? 2 : opts.frame === 3 ? -2 : 0;
        ctx.fillStyle = '#1a0d00'; // Outline
        if (isDown || isUp) {
            ctx.fillRect(cx - 11, by + 17 + armSwing, 3, 10);
            ctx.fillRect(cx + 8, by + 17 - armSwing, 3, 10);
        } else if (isLeft) {
            ctx.fillRect(cx - 9, by + 17 + armSwing, 3, 10);
        } else {
            ctx.fillRect(cx + 6, by + 17 + armSwing, 3, 10);
        }

        ctx.fillStyle = '#E8A591'; // Shadow skin tone
        if (isDown || isUp) {
            ctx.fillRect(cx - 10, by + 18 + armSwing, 2, 8);
            ctx.fillRect(cx + 8, by + 18 - armSwing, 2, 8);
        } else if (isLeft) {
            ctx.fillRect(cx - 8, by + 18 + armSwing, 2, 8);
        } else {
            ctx.fillRect(cx + 6, by + 18 + armSwing, 2, 8);
        }

        ctx.fillStyle = '#FDBCB4'; // Base skin tone
        if (isDown || isUp) {
            ctx.fillRect(cx - 9, by + 19 + armSwing, 1, 6);
            ctx.fillRect(cx + 9, by + 19 - armSwing, 1, 6);
        } else if (isLeft) {
            ctx.fillRect(cx - 7, by + 19 + armSwing, 1, 6);
        } else {
            ctx.fillRect(cx + 7, by + 19 + armSwing, 1, 6);
        }

        // === Skirt with pleats and outline (rows 28-34) ===
        ctx.fillStyle = '#1a0d00'; // Outline
        ctx.fillRect(cx - 9, by + 27, 18, 8);

        ctx.fillStyle = '#5B4CC7'; // Shadow color
        ctx.fillRect(cx - 8, by + 28, 16, 6);

        ctx.fillStyle = '#6C5CE7'; // Base skirt color
        ctx.fillRect(cx - 7, by + 29, 14, 4);

        // Pleat shadows
        ctx.fillStyle = '#5B4CC7';
        ctx.fillRect(cx - 6, by + 29, 2, 4);
        ctx.fillRect(cx, by + 29, 2, 4);
        ctx.fillRect(cx + 4, by + 29, 2, 4);

        // Pleat highlights
        ctx.fillStyle = '#7E6FEF';
        ctx.fillRect(cx - 7, by + 29, 1, 4);
        ctx.fillRect(cx - 1, by + 29, 1, 4);

        // === Legs with stride animation and outline (rows 34-40) ===
        const legStride = opts.frame === 1 ? 2 : opts.frame === 3 ? -2 : 0;
        ctx.fillStyle = '#1a0d00'; // Outline
        if (isDown || isUp) {
            ctx.fillRect(cx - 5 + legStride, by + 33, 5, 8);
            ctx.fillRect(cx + 0 - legStride, by + 33, 5, 8);
        } else {
            ctx.fillRect(cx - 5 + legStride, by + 33, 5, 8);
            ctx.fillRect(cx - 3 - legStride, by + 33, 5, 8);
        }

        ctx.fillStyle = '#E8A591'; // Shadow skin tone
        if (isDown || isUp) {
            ctx.fillRect(cx - 4 + legStride, by + 34, 4, 6);
            ctx.fillRect(cx + 0 - legStride, by + 34, 4, 6);
        } else {
            ctx.fillRect(cx - 4 + legStride, by + 34, 4, 6);
            ctx.fillRect(cx - 2 - legStride, by + 34, 4, 6);
        }

        ctx.fillStyle = '#FDBCB4'; // Base skin tone
        if (isDown || isUp) {
            ctx.fillRect(cx - 3 + legStride, by + 35, 2, 4);
            ctx.fillRect(cx + 1 - legStride, by + 35, 2, 4);
        } else {
            ctx.fillRect(cx - 3 + legStride, by + 35, 2, 4);
            ctx.fillRect(cx - 1 - legStride, by + 35, 2, 4);
        }

        // === Shoes with outline (rows 40-44) ===
        ctx.fillStyle = '#1a0d00'; // Outline
        if (isDown || isUp) {
            ctx.fillRect(cx - 7 + legStride, by + 39, 7, 6);
            ctx.fillRect(cx + 0 - legStride, by + 39, 7, 6);
        } else {
            ctx.fillRect(cx - 7 + legStride, by + 39, 7, 6);
            ctx.fillRect(cx - 5 - legStride, by + 39, 7, 6);
        }

        ctx.fillStyle = '#3E2723'; // Shadow color
        if (isDown || isUp) {
            ctx.fillRect(cx - 6 + legStride, by + 40, 6, 4);
            ctx.fillRect(cx + 0 - legStride, by + 40, 6, 4);
            ctx.fillRect(cx - 6 + legStride, by + 42, 6, 2);
            ctx.fillRect(cx + 0 - legStride, by + 42, 6, 2);
        } else {
            ctx.fillRect(cx - 6 + legStride, by + 40, 6, 4);
            ctx.fillRect(cx - 4 - legStride, by + 40, 6, 4);
            ctx.fillRect(cx - 6 + legStride, by + 42, 6, 2);
            ctx.fillRect(cx - 4 - legStride, by + 42, 6, 2);
        }

        ctx.fillStyle = '#5D4037'; // Base shoe color
        if (isDown || isUp) {
            ctx.fillRect(cx - 5 + legStride, by + 41, 4, 2);
            ctx.fillRect(cx + 1 - legStride, by + 41, 4, 2);
        } else {
            ctx.fillRect(cx - 5 + legStride, by + 41, 4, 2);
            ctx.fillRect(cx - 3 - legStride, by + 41, 4, 2);
        }
    }

    // ─── NPCs ────────────────────────────────────────────────

    generateNPCSpritesheet() {
        const frameW = 32, frameH = 48;

        NPC_DEFS.forEach((npc) => {
            const extKey = `npc_${npc.name}_ext`;
            const texKey = `npc_${npc.name}`;

            // If external sprite was loaded, remap it
            if (this.loadedSprites.has(extKey)) {
                this._remapExternalSprite(extKey, texKey);
                return;
            }

            // Procedural fallback
            const canvas = this.scene.textures.createCanvas(texKey, frameW * 4, frameH);
            const ctx = canvas.getContext();

            for (let frame = 0; frame < 4; frame++) {
                this.drawNPC(ctx, frame * frameW, 0, frameW, frameH, npc, frame);
            }

            canvas.refresh();
            for (let f = 0; f < 4; f++) {
                this.scene.textures.get(texKey).add(f, 0, f * frameW, 0, frameW, frameH);
            }
        });
    }

    drawNPC(ctx, x, y, w, h, npc, frame) {
        const cx = x + w / 2;
        const swayOffset = frame === 1 ? -2 : frame === 3 ? 2 : 0;
        const bobOffset = (frame === 1 || frame === 3) ? 0 : 2;
        const by = y + bobOffset;

        // === Hair with outline ===
        ctx.fillStyle = '#1a0d00'; // Dark outline
        ctx.fillRect(cx - 9, by, 18, 9);

        ctx.fillStyle = npc.hair;
        ctx.fillRect(cx - 8, by + 0, 16, 8);
        ctx.fillStyle = npc.hairHi;
        ctx.fillRect(cx - 4, by + 1, 6, 2);

        if (npc.accessory === 'shawl_bun') {
            ctx.fillStyle = npc.hair;
            ctx.fillRect(cx - 4, by, 8, 3);
            ctx.fillRect(cx - 2, by, 4, 3);
        } else if (npc.accessory === 'ponytail_scarf') {
            ctx.fillStyle = npc.hair;
            ctx.fillRect(cx + 6, by + 4, 4, 10);
        } else if (npc.accessory === 'hat_apron') {
            ctx.fillStyle = '#1a0d00';
            ctx.fillRect(cx - 11, by, 22, 3);
            ctx.fillStyle = '#D4A950';
            ctx.fillRect(cx - 10, by, 20, 2);
            ctx.fillRect(cx - 6, by, 12, 2);
        }

        // === Face with outline ===
        ctx.fillStyle = '#1a0d00'; // Dark outline
        ctx.fillRect(cx - 7, by + 5, 14, 12);

        ctx.fillStyle = npc.skin;
        ctx.fillRect(cx - 6, by + 6, 12, 10);

        // === Large anime-style eyes with highlights ===
        ctx.fillStyle = '#2d3436';
        ctx.fillRect(cx - 4, by + 9, 3, 3);
        ctx.fillRect(cx + 2, by + 9, 3, 3);

        // White highlights in eyes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - 3, by + 10, 1, 1);
        ctx.fillRect(cx + 3, by + 10, 1, 1);

        if (npc.accessory === 'glasses_vest') {
            ctx.fillStyle = '#1a0d00';
            ctx.fillRect(cx - 7, by + 7, 5, 5);
            ctx.fillRect(cx + 1, by + 7, 5, 5);
            ctx.fillStyle = '#888888';
            ctx.fillRect(cx - 6, by + 8, 4, 4);
            ctx.fillRect(cx + 2, by + 8, 4, 4);
            ctx.fillRect(cx - 2, by + 10, 4, 2);
            ctx.fillStyle = '#aaddff';
            ctx.fillRect(cx - 4, by + 10, 2, 2);
            ctx.fillRect(cx + 3, by + 10, 2, 2);
        }

        if (npc.accessory === 'apron_mustache') {
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(cx - 4, by + 13, 8, 3);
        }

        // Mouth with outline
        ctx.fillStyle = '#1a0d00';
        ctx.fillRect(cx - 2, by + 13, 5, 3);
        ctx.fillStyle = '#e07c6a';
        ctx.fillRect(cx - 1, by + 14, 3, 2);

        // === Shirt/Body with outline and cel-shading (rows 16-28) ===
        const bodyW = npc.accessory === 'apron_mustache' ? 18 : 16;
        const bodyX = npc.accessory === 'apron_mustache' ? cx - 10 : cx - 8;

        ctx.fillStyle = '#1a0d00'; // Outline
        ctx.fillRect(bodyX + swayOffset - 1, by + 15, bodyW + 2, 14);

        ctx.fillStyle = npc.shirtShadow;
        ctx.fillRect(bodyX + swayOffset, by + 16, bodyW, 12);
        ctx.fillRect(bodyX + swayOffset, by + 24, bodyW, 4);

        ctx.fillStyle = npc.shirt;
        ctx.fillRect(bodyX + swayOffset + 1, by + 17, bodyW - 2, 9);

        if (npc.accessory === 'apron_mustache') {
            ctx.fillStyle = '#1a0d00';
            ctx.fillRect(cx - 7 + swayOffset, by + 17, 14, 12);
            ctx.fillStyle = '#F5F5DC';
            ctx.fillRect(cx - 6 + swayOffset, by + 18, 12, 10);
            ctx.fillStyle = '#E5D5BC';
            ctx.fillRect(cx - 6 + swayOffset, by + 24, 12, 4);
        }
        if (npc.accessory === 'glasses_vest') {
            ctx.fillStyle = '#6B5B3E';
            ctx.fillRect(cx - 6 + swayOffset, by + 18, 4, 8);
            ctx.fillRect(cx + 2 + swayOffset, by + 18, 4, 8);
            ctx.fillStyle = '#5B4B2E';
            ctx.fillRect(cx - 6 + swayOffset, by + 24, 4, 2);
            ctx.fillRect(cx + 2 + swayOffset, by + 24, 4, 2);
        }
        if (npc.accessory === 'necklace_blazer') {
            ctx.fillStyle = '#1F3A5F';
            ctx.fillRect(cx - 8 + swayOffset, by + 18, 4, 10);
            ctx.fillRect(cx + 4 + swayOffset, by + 18, 4, 10);
            ctx.fillStyle = '#F5E6CA';
            ctx.fillRect(cx - 4 + swayOffset, by + 16, 8, 2);
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(cx + swayOffset, by + 18, 2, 2);
            ctx.fillStyle = '#FFA500';
            ctx.fillRect(cx + swayOffset, by + 19, 2, 1);
        }
        if (npc.accessory === 'ponytail_scarf') {
            ctx.fillStyle = '#1a0d00';
            ctx.fillRect(cx - 3, by + 15, 6, 6);
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(cx - 2, by + 16, 4, 4);
            ctx.fillRect(cx - 4, by + 20, 2, 6);
            ctx.fillStyle = '#c0392b';
            ctx.fillRect(cx - 4, by + 24, 2, 2);
        }
        if (npc.accessory === 'hat_apron') {
            ctx.fillStyle = '#1a0d00';
            ctx.fillRect(cx - 7 + swayOffset, by + 17, 14, 12);
            ctx.fillStyle = '#27AE60';
            ctx.fillRect(cx - 6 + swayOffset, by + 18, 12, 10);
            ctx.fillStyle = '#1E8449';
            ctx.fillRect(cx - 6 + swayOffset, by + 24, 12, 4);
        }
        if (npc.accessory === 'shawl_bun') {
            ctx.fillStyle = '#1a0d00';
            ctx.fillRect(cx - 9 + swayOffset, by + 15, 18, 8);
            ctx.fillStyle = '#A87CB3';
            ctx.fillRect(cx - 8 + swayOffset, by + 16, 16, 6);
            ctx.fillStyle = npc.shirtShadow;
            ctx.fillRect(cx - 8 + swayOffset, by + 20, 4, 4);
            ctx.fillRect(cx + 4 + swayOffset, by + 20, 4, 4);
        }

        // === Pants/Skirt with outline (rows 28-34) ===
        ctx.fillStyle = '#1a0d00'; // Outline
        ctx.fillRect(cx - 9 + swayOffset, by + 27, 18, 8);

        ctx.fillStyle = npc.pantsDark;
        ctx.fillRect(cx - 8 + swayOffset, by + 28, 16, 6);

        ctx.fillStyle = npc.pants;
        ctx.fillRect(cx - 7 + swayOffset, by + 29, 14, 4);

        ctx.fillStyle = npc.pantsDark;
        ctx.fillRect(cx - 6 + swayOffset, by + 29, 2, 4);
        ctx.fillRect(cx + swayOffset, by + 29, 2, 4);

        // === Legs with outline (rows 34-40) ===
        const legOff = frame === 1 ? 2 : frame === 3 ? -2 : 0;
        ctx.fillStyle = '#1a0d00'; // Outline
        ctx.fillRect(cx - 5 + legOff, by + 33, 5, 8);
        ctx.fillRect(cx + 0 - legOff, by + 33, 5, 8);

        ctx.fillStyle = npc.skin;
        ctx.fillRect(cx - 4 + legOff, by + 34, 4, 6);
        ctx.fillRect(cx + 0 - legOff, by + 34, 4, 6);

        // === Shoes with outline (rows 40-44) ===
        ctx.fillStyle = '#1a0d00'; // Outline
        ctx.fillRect(cx - 7 + legOff, by + 39, 7, 6);
        ctx.fillRect(cx + 0 - legOff, by + 39, 7, 6);

        ctx.fillStyle = '#3E2723';
        ctx.fillRect(cx - 6 + legOff, by + 40, 6, 4);
        ctx.fillRect(cx + 0 - legOff, by + 40, 6, 4);

        ctx.fillStyle = '#5D4037';
        ctx.fillRect(cx - 5 + legOff, by + 41, 4, 2);
        ctx.fillRect(cx + 1 - legOff, by + 41, 4, 2);
    }

    // ─── Tileset ─────────────────────────────────────────────

    generateTileset() {
        const tileSize = 32;
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
            { index: 64, waveShift: 2 },
            { index: 65, waveShift: 4 }
        ];
        waterVariants.forEach(v => {
            const col = v.index % cols;
            const row = Math.floor(v.index / cols);
            const wx = col * tileSize;
            const wy = row * tileSize;

            // Outline
            ctx.fillStyle = '#0a2a48';
            ctx.fillRect(wx, wy, tileSize, tileSize);

            // Deep water base
            ctx.fillStyle = '#1a4a78';
            ctx.fillRect(wx + 1, wy + 1, tileSize - 2, tileSize - 2);

            ctx.fillStyle = '#2a6ab8';
            ctx.fillRect(wx + 2, wy + 2, tileSize - 4, tileSize - 4);

            // Gradient layers
            ctx.fillStyle = '#3b7dd8';
            ctx.fillRect(wx + 2, wy + 2, tileSize - 4, 12);
            ctx.fillStyle = '#4a8de8';
            ctx.fillRect(wx + 2, wy + 2, tileSize - 4, 6);

            // Wave crests (manga-style)
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(wx + 4 + v.waveShift, wy + 8, 8, 2);
            ctx.fillRect(wx + 20 - v.waveShift, wy + 8, 6, 2);
            ctx.fillRect(wx + 2 + v.waveShift, wy + 16, 10, 2);
            ctx.fillRect(wx + 18 - v.waveShift, wy + 18, 8, 2);
            ctx.fillRect(wx + 8 + v.waveShift, wy + 26, 12, 2);

            // Sparkle highlights
            ctx.fillRect(wx + 6 + v.waveShift, wy + 6, 2, 2);
            ctx.fillRect(wx + 22 - v.waveShift, wy + 14, 2, 2);
            ctx.fillRect(wx + 12 + v.waveShift, wy + 24, 2, 2);
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
                // Dark mortar outline
                ctx.fillStyle = '#887860';
                ctx.fillRect(x, y, s, s);

                const stones = [
                    [0,0,14,14], [16,0,16,12], [0,16,12,16], [14,14,18,18]
                ];
                stones.forEach(([sx,sy,sw,sh]) => {
                    // Stone outline
                    ctx.fillStyle = '#806848';
                    ctx.fillRect(x+sx, y+sy, sw, sh);

                    // Shadow tone
                    ctx.fillStyle = '#a09070';
                    ctx.fillRect(x+sx+1, y+sy+1, sw-2, sh-2);

                    // Base tone
                    ctx.fillStyle = '#c8b88a';
                    ctx.fillRect(x+sx+2, y+sy+2, sw-4, sh-4);

                    // Highlight tone (top-left)
                    ctx.fillStyle = '#e8d8ba';
                    ctx.fillRect(x+sx+2, y+sy+2, sw-6, 2);
                    ctx.fillRect(x+sx+2, y+sy+2, 2, sh-6);

                    // Shadow tone (bottom-right)
                    ctx.fillStyle = '#908870';
                    ctx.fillRect(x+sx+sw-3, y+sy+3, 2, sh-4);
                    ctx.fillRect(x+sx+3, y+sy+sh-3, sw-4, 2);
                });

                // Bold mortar lines
                ctx.fillStyle = '#706050';
                ctx.fillRect(x+14, y, 2, s);
                ctx.fillRect(x, y+14, s, 2);
                break;
            }
            case 'grass': {
                // Outline around grass patch
                ctx.fillStyle = '#2a5020';
                ctx.fillRect(x, y, s, s);

                // Shadow tone
                ctx.fillStyle = '#3a7030';
                ctx.fillRect(x+1, y+1, s-2, s-2);

                // Base tone
                ctx.fillStyle = '#4a8c3f';
                ctx.fillRect(x+2, y+2, s-4, s-4);

                // Highlight tone
                ctx.fillStyle = '#5ca84f';
                ctx.fillRect(x+3, y+3, s-6, s-6);

                // Dark grass tufts with outline
                ctx.fillStyle = '#2a5020';
                ctx.fillRect(x+2, y+5, 8, 8);
                ctx.fillRect(x+15, y+19, 10, 8);
                ctx.fillRect(x+21, y+1, 8, 8);

                ctx.fillStyle = '#3a7030';
                ctx.fillRect(x+3, y+6, 6, 6);
                ctx.fillRect(x+16, y+20, 8, 6);
                ctx.fillRect(x+22, y+2, 6, 6);

                // Grass blades with outlines
                ctx.fillStyle = '#2a5020';
                ctx.fillRect(x+3, y+3, 4, 8);
                ctx.fillRect(x+13, y+1, 4, 10);
                ctx.fillRect(x+23, y+9, 4, 8);
                ctx.fillRect(x+7, y+17, 4, 8);
                ctx.fillRect(x+27, y+19, 4, 8);

                ctx.fillStyle = '#5ca84f';
                ctx.fillRect(x+4, y+4, 2, 6);
                ctx.fillRect(x+14, y+2, 2, 8);
                ctx.fillRect(x+24, y+10, 2, 6);
                ctx.fillRect(x+8, y+18, 2, 6);
                ctx.fillRect(x+28, y+20, 2, 6);

                // Wildflowers with outlines
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+9, y+9, 4, 4);
                ctx.fillRect(x+19, y+13, 4, 4);
                ctx.fillRect(x+5, y+23, 4, 4);

                ctx.fillStyle = '#ffd93d';
                ctx.fillRect(x+10, y+10, 2, 2);
                ctx.fillStyle = '#ff9ff3';
                ctx.fillRect(x+20, y+14, 2, 2);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(x+6, y+24, 2, 2);
                break;
            }
            case 'water': {
                // Dark outline
                ctx.fillStyle = '#0a2a48';
                ctx.fillRect(x, y, s, s);

                // Deep shadow
                ctx.fillStyle = '#1a4a78';
                ctx.fillRect(x+1, y+1, s-2, s-2);

                // Base water
                ctx.fillStyle = '#2a6ab8';
                ctx.fillRect(x+2, y+2, s-4, s-4);

                // Gradient layers (cel-shading)
                ctx.fillStyle = '#3b7dd8';
                ctx.fillRect(x+2, y+2, s-4, 12);
                ctx.fillStyle = '#4a8de8';
                ctx.fillRect(x+2, y+2, s-4, 6);

                // Manga-style wave crests (bold white)
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(x+4, y+8, 8, 2);
                ctx.fillRect(x+20, y+8, 6, 2);
                ctx.fillRect(x+2, y+16, 10, 2);
                ctx.fillRect(x+18, y+18, 8, 2);
                ctx.fillRect(x+8, y+26, 12, 2);

                // Sparkle highlights
                ctx.fillRect(x+6, y+6, 4, 2);
                ctx.fillRect(x+22, y+14, 2, 2);
                ctx.fillRect(x+12, y+24, 4, 2);
                ctx.fillRect(x+24, y+10, 2, 2);
                ctx.fillRect(x+4, y+22, 2, 2);
                break;
            }
            case 'brick': {
                const baseColor = tile.color;

                // Dark mortar outline
                ctx.fillStyle = '#443322';
                ctx.fillRect(x, y, s, s);

                for (let row = 0; row < 4; row++) {
                    const offset = (row % 2) * 8;
                    for (let bx = 0; bx < 2; bx++) {
                        const brickX = x + offset + bx * 16;
                        const brickY = y + row * 8;
                        const bw = Math.min(14, x + s - brickX);
                        if (bw <= 0) continue;

                        // Brick outline
                        ctx.fillStyle = '#1a0d00';
                        ctx.fillRect(brickX, brickY, bw, 8);

                        // Shadow tone
                        ctx.fillStyle = this.adjustBrightness(baseColor, -0.3);
                        ctx.fillRect(brickX+1, brickY+1, bw-2, 6);

                        // Base tone
                        ctx.fillStyle = baseColor;
                        ctx.fillRect(brickX+2, brickY+2, bw-4, 4);

                        // Highlight tone (top-left)
                        ctx.fillStyle = this.adjustBrightness(baseColor, 0.3);
                        ctx.fillRect(brickX+2, brickY+2, bw-4, 1);
                        ctx.fillRect(brickX+2, brickY+2, 1, 4);

                        // Shadow tone (bottom-right)
                        ctx.fillStyle = this.adjustBrightness(baseColor, -0.4);
                        ctx.fillRect(brickX+2, brickY+5, bw-4, 1);
                        ctx.fillRect(brickX+bw-3, brickY+2, 1, 4);
                    }
                }

                // Bold mortar lines
                ctx.fillStyle = '#554433';
                for (let row = 0; row <= 4; row++) {
                    ctx.fillRect(x, y + row * 8 - 1, s, 2);
                }
                break;
            }
            case 'tree': {
                // Ground shadow
                ctx.fillStyle = '#1a4618';
                ctx.fillRect(x+6, y+24, 20, 5);

                // Trunk with outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+11, y+17, 10, 16);

                ctx.fillStyle = '#5B3216'; // Shadow
                ctx.fillRect(x+12, y+18, 8, 14);

                ctx.fillStyle = '#6B4226'; // Base
                ctx.fillRect(x+13, y+19, 6, 12);

                ctx.fillStyle = '#7B5236'; // Highlight
                ctx.fillRect(x+14, y+20, 4, 10);

                // Canopy with bold outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+3, y+3, 26, 18);

                ctx.fillStyle = '#0a4a0a'; // Darkest green (shadow)
                ctx.fillRect(x+4, y+4, 24, 16);

                ctx.fillStyle = '#1a6a1a'; // Dark green
                ctx.fillRect(x+5, y+5, 22, 14);

                ctx.fillStyle = '#2a8a2a'; // Base green
                ctx.fillRect(x+6, y+6, 20, 12);

                ctx.fillStyle = '#3aaa3a'; // Highlight green
                ctx.fillRect(x+8, y+4, 12, 8);
                ctx.fillRect(x+6, y+6, 4, 4);
                ctx.fillRect(x+20, y+8, 4, 4);

                // Leaf cluster details
                ctx.fillStyle = '#0a4a0a';
                ctx.fillRect(x+10, y+8, 2, 2);
                ctx.fillRect(x+16, y+6, 2, 2);
                ctx.fillRect(x+8, y+12, 2, 2);
                ctx.fillRect(x+18, y+14, 2, 2);
                break;
            }
            case 'flower': {
                // Grass base
                ctx.fillStyle = '#2a5020';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#3a7030';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#4a8c3f';
                ctx.fillRect(x+2, y+2, s-4, s-4);

                // Dark grass patches
                ctx.fillStyle = '#3a7030';
                ctx.fillRect(x+2, y+4, 8, 6);
                ctx.fillRect(x+18, y+16, 8, 6);

                // Red flower with outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+5, y+3, 8, 8);
                ctx.fillStyle = '#cc0000'; // Shadow
                ctx.fillRect(x+6, y+4, 6, 6);
                ctx.fillStyle = '#ff4444'; // Base
                ctx.fillRect(x+7, y+5, 4, 4);
                ctx.fillStyle = '#ffdd00'; // Center
                ctx.fillRect(x+8, y+6, 2, 2);

                // Yellow flower with outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+19, y+13, 8, 8);
                ctx.fillStyle = '#cc9900'; // Shadow
                ctx.fillRect(x+20, y+14, 6, 6);
                ctx.fillStyle = '#ffdd44'; // Base
                ctx.fillRect(x+21, y+15, 4, 4);
                ctx.fillStyle = '#ff8800'; // Center
                ctx.fillRect(x+22, y+16, 2, 2);

                // White flower with outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+11, y+21, 8, 8);
                ctx.fillStyle = '#cccccc'; // Shadow
                ctx.fillRect(x+12, y+22, 6, 6);
                ctx.fillStyle = '#ffffff'; // Base
                ctx.fillRect(x+13, y+23, 4, 4);
                ctx.fillStyle = '#ffdd00'; // Center
                ctx.fillRect(x+14, y+24, 2, 2);

                // Stems with outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+7, y+9, 4, 6);
                ctx.fillRect(x+21, y+19, 4, 6);
                ctx.fillRect(x+13, y+27, 4, 5);

                ctx.fillStyle = '#2d6a2d';
                ctx.fillRect(x+8, y+10, 2, 4);
                ctx.fillRect(x+22, y+20, 2, 4);
                ctx.fillRect(x+14, y+28, 2, 4);
                break;
            }
            case 'fountain': {
                // Stone basin with bold outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+3, y+5, 26, 24);

                ctx.fillStyle = '#555555'; // Shadow
                ctx.fillRect(x+4, y+6, 24, 22);

                ctx.fillStyle = '#666666'; // Base
                ctx.fillRect(x+5, y+7, 22, 20);

                ctx.fillStyle = '#888888'; // Highlight rim
                ctx.fillRect(x+5, y+7, 22, 3);

                ctx.fillStyle = '#555555'; // Shadow rim
                ctx.fillRect(x+5, y+25, 22, 2);

                // Water with outline
                ctx.fillStyle = '#1a4a78';
                ctx.fillRect(x+7, y+9, 18, 16);

                ctx.fillStyle = '#2a6ab8'; // Shadow
                ctx.fillRect(x+8, y+10, 16, 14);

                ctx.fillStyle = '#3b7dd8'; // Base
                ctx.fillRect(x+9, y+11, 14, 12);

                ctx.fillStyle = '#5ba3f0'; // Highlight
                ctx.fillRect(x+10, y+12, 8, 6);

                // Central spout
                ctx.fillStyle = '#777777';
                ctx.fillRect(x+14, y+10, 4, 8);

                // Water spray with outline
                ctx.fillStyle = '#aaddff';
                ctx.fillRect(x+14, y+4, 4, 6);
                ctx.fillRect(x+12, y+6, 2, 2);
                ctx.fillRect(x+18, y+6, 2, 2);

                ctx.fillStyle = '#ffffff';
                ctx.fillRect(x+15, y+5, 2, 4);
                break;
            }
            case 'chest': {
                // Chest with bold outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+5, y+9, 22, 20);

                // Lid shadow
                ctx.fillStyle = '#4C3A0E';
                ctx.fillRect(x+6, y+10, 20, 8);

                // Lid base
                ctx.fillStyle = '#5C4A1E';
                ctx.fillRect(x+7, y+11, 18, 7);

                // Lid highlight
                ctx.fillStyle = '#8B7438';
                ctx.fillRect(x+8, y+11, 16, 2);

                // Body shadow
                ctx.fillStyle = '#5B4420';
                ctx.fillRect(x+6, y+18, 20, 10);

                // Body base
                ctx.fillStyle = '#6B5420';
                ctx.fillRect(x+7, y+19, 18, 8);

                // Body highlight
                ctx.fillStyle = '#7B6428';
                ctx.fillRect(x+8, y+19, 16, 2);

                // Metal bands with outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+5, y+16, 22, 3);
                ctx.fillRect(x+5, y+24, 22, 3);

                ctx.fillStyle = '#666666';
                ctx.fillRect(x+6, y+17, 20, 2);
                ctx.fillRect(x+6, y+25, 20, 2);

                ctx.fillStyle = '#888888';
                ctx.fillRect(x+7, y+17, 18, 1);
                ctx.fillRect(x+7, y+25, 18, 1);

                // Lock with gem - outlined
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+13, y+17, 6, 8);

                ctx.fillStyle = '#FFA500'; // Shadow
                ctx.fillRect(x+14, y+18, 4, 6);

                ctx.fillStyle = '#FFD700'; // Base
                ctx.fillRect(x+15, y+19, 2, 4);

                // Gem sparkle
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(x+15, y+19, 2, 2);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(x+16, y+19, 1, 1);
                break;
            }
            case 'portal': {
                // Outer ring (darkest purple)
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+5, y+1, 22, 30);

                ctx.fillStyle = '#4C2463';
                ctx.fillRect(x+6, y+2, 20, 28);

                ctx.fillStyle = '#6C3483';
                ctx.fillRect(x+7, y+3, 18, 26);

                // Middle ring
                ctx.fillStyle = '#8E44AD';
                ctx.fillRect(x+8, y+4, 16, 24);

                // Inner ring (lighter)
                ctx.fillStyle = '#c39bd3';
                ctx.fillRect(x+10, y+6, 12, 20);

                // Center glow
                ctx.fillStyle = '#d7bde2';
                ctx.fillRect(x+12, y+8, 8, 16);

                ctx.fillStyle = '#f4ecf7';
                ctx.fillRect(x+14, y+12, 4, 8);

                // Sparkle effects with outline
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(x+10, y+10, 2, 2);
                ctx.fillRect(x+20, y+16, 2, 2);
                ctx.fillRect(x+14, y+22, 2, 2);
                ctx.fillRect(x+8, y+18, 2, 2);
                ctx.fillRect(x+22, y+12, 2, 2);

                // Additional sparkle dots
                ctx.fillRect(x+16, y+8, 1, 1);
                ctx.fillRect(x+12, y+24, 1, 1);
                break;
            }
            case 'door': {
                // Door with bold outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+5, y+3, 22, 29);

                ctx.fillStyle = '#5B2A0F'; // Shadow
                ctx.fillRect(x+6, y+4, 20, 28);

                ctx.fillStyle = '#6B3A1F'; // Base
                ctx.fillRect(x+7, y+5, 18, 26);

                ctx.fillStyle = '#8B5A2F'; // Highlight
                ctx.fillRect(x+8, y+6, 16, 24);

                // Panel outlines and details
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+9, y+7, 14, 10);
                ctx.fillRect(x+9, y+19, 14, 10);

                ctx.fillStyle = '#7B4A25'; // Panel shadow
                ctx.fillRect(x+10, y+8, 12, 8);
                ctx.fillRect(x+10, y+20, 12, 8);

                ctx.fillStyle = '#9B6A3F'; // Panel highlight
                ctx.fillRect(x+10, y+8, 12, 2);
                ctx.fillRect(x+10, y+20, 12, 2);

                // Brass handle with outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+19, y+17, 5, 5);

                ctx.fillStyle = '#CC9900'; // Shadow
                ctx.fillRect(x+20, y+18, 4, 4);

                ctx.fillStyle = '#FFD700'; // Base
                ctx.fillRect(x+20, y+18, 3, 3);

                ctx.fillStyle = '#FFA500'; // Dark detail
                ctx.fillRect(x+21, y+19, 2, 2);
                break;
            }
            case 'sign': {
                // Post with outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+13, y+15, 6, 18);

                ctx.fillStyle = '#5B3216'; // Shadow
                ctx.fillRect(x+14, y+16, 4, 16);

                ctx.fillStyle = '#6B4226'; // Base
                ctx.fillRect(x+15, y+17, 2, 14);

                // Sign board with outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+5, y+3, 22, 16);

                ctx.fillStyle = '#C8A070'; // Shadow
                ctx.fillRect(x+6, y+4, 20, 14);

                ctx.fillStyle = '#DEB887'; // Base
                ctx.fillRect(x+7, y+5, 18, 12);

                ctx.fillStyle = '#E8C897'; // Highlight
                ctx.fillRect(x+8, y+5, 16, 2);

                // Wood grain
                ctx.fillStyle = '#C8A070';
                ctx.fillRect(x+7, y+16, 18, 2);

                // Carved text lines
                ctx.fillStyle = '#6B4226';
                ctx.fillRect(x+10, y+8, 12, 2);
                ctx.fillRect(x+10, y+12, 8, 2);

                // Iron nails with outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+15, y+3, 3, 3);
                ctx.fillRect(x+7, y+15, 3, 3);
                ctx.fillRect(x+22, y+15, 3, 3);

                ctx.fillStyle = '#888888';
                ctx.fillRect(x+16, y+4, 2, 2);
                ctx.fillRect(x+8, y+16, 2, 2);
                ctx.fillRect(x+23, y+16, 2, 2);
                break;
            }
            case 'eiffel': {
                // PARIS: Iconic lattice ironwork with cross-bracing
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+11, y-1, 10, 33);
                ctx.fillRect(x+7, y+13, 18, 6);
                ctx.fillRect(x+3, y+25, 10, 7);
                ctx.fillRect(x+19, y+25, 10, 7);

                // Shadow tone
                ctx.fillStyle = '#3A4A5A';
                ctx.fillRect(x+12, y+0, 8, 32);
                ctx.fillRect(x+8, y+14, 16, 4);
                ctx.fillRect(x+4, y+26, 8, 6);
                ctx.fillRect(x+20, y+26, 8, 6);

                // Base tone
                ctx.fillStyle = '#4A5A6A';
                ctx.fillRect(x+13, y+1, 6, 30);
                ctx.fillRect(x+9, y+15, 14, 3);
                ctx.fillRect(x+5, y+27, 6, 4);
                ctx.fillRect(x+21, y+27, 6, 4);

                // Highlight tone
                ctx.fillStyle = '#7D8D9E';
                ctx.fillRect(x+14, y+0, 2, 14);
                ctx.fillRect(x+10, y+14, 2, 2);
                ctx.fillRect(x+15, y+2, 2, 2);

                // Cross-bracing details
                ctx.fillStyle = '#5D6D7E';
                ctx.fillRect(x+12, y+6, 2, 2);
                ctx.fillRect(x+18, y+6, 2, 2);
                ctx.fillRect(x+12, y+10, 2, 2);
                ctx.fillRect(x+18, y+10, 2, 2);
                ctx.fillRect(x+10, y+20, 2, 6);
                ctx.fillRect(x+20, y+20, 2, 6);
                break;
            }
            case 'bigben': {
                // LONDON: Clock tower with detailed clock face
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+9, y-1, 14, 33);

                // Shadow tone
                ctx.fillStyle = '#5E3B00';
                ctx.fillRect(x+10, y+0, 12, 32);

                // Base tone (golden brown stone)
                ctx.fillStyle = '#6E4B00';
                ctx.fillRect(x+11, y+1, 10, 30);

                // Clock face outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+11, y+3, 10, 10);

                // Clock face background
                ctx.fillStyle = '#E5DCC0';
                ctx.fillRect(x+12, y+4, 8, 8);

                // Clock border
                ctx.fillStyle = '#8B6914';
                ctx.fillRect(x+12, y+4, 8, 2);
                ctx.fillRect(x+12, y+10, 8, 2);
                ctx.fillRect(x+12, y+4, 2, 8);
                ctx.fillRect(x+18, y+4, 2, 8);

                // Clock hands
                ctx.fillStyle = '#333333';
                ctx.fillRect(x+16, y+6, 2, 4);
                ctx.fillRect(x+14, y+8, 4, 2);

                // Stone detail bands
                ctx.fillStyle = '#7E5B10';
                ctx.fillRect(x+12, y+14, 8, 2);
                ctx.fillRect(x+12, y+20, 8, 2);

                // Spire
                ctx.fillStyle = '#555555';
                ctx.fillRect(x+14, y+0, 4, 4);

                // Highlight
                ctx.fillStyle = '#8E7B20';
                ctx.fillRect(x+11, y+1, 2, 30);
                break;
            }
            case 'column': {
                // ROME: Fluted marble column with capital detail
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+7, y+1, 18, 30);

                // Shadow tone
                ctx.fillStyle = '#C8C0B0';
                ctx.fillRect(x+8, y+2, 16, 28);

                // Base tone (white marble)
                ctx.fillStyle = '#E8E0D0';
                ctx.fillRect(x+9, y+3, 14, 26);

                // Highlight tone
                ctx.fillStyle = '#F8F0E0';
                ctx.fillRect(x+10, y+4, 2, 24);

                // Capital (top ornament) with outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+5, y+1, 22, 5);

                ctx.fillStyle = '#D0C8B8';
                ctx.fillRect(x+6, y+2, 20, 4);

                ctx.fillStyle = '#F0E8D8';
                ctx.fillRect(x+7, y+3, 18, 2);

                // Base (bottom) with outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+5, y+26, 22, 5);

                ctx.fillStyle = '#C0B8A8';
                ctx.fillRect(x+6, y+27, 20, 4);

                ctx.fillStyle = '#D0C8B8';
                ctx.fillRect(x+7, y+28, 18, 2);

                // Fluting (vertical grooves)
                ctx.fillStyle = '#C8C0B0';
                ctx.fillRect(x+10, y+6, 2, 20);
                ctx.fillRect(x+16, y+6, 2, 20);
                ctx.fillRect(x+22, y+6, 2, 20);

                // Highlight fluting
                ctx.fillStyle = '#FFFFFF';
                ctx.globalAlpha = 0.4;
                ctx.fillRect(x+12, y+6, 2, 20);
                ctx.globalAlpha = 1;
                break;
            }
            case 'mosaic': {
                // MARRAKECH: Intricate zellige pattern with bold grout
                const colors = [
                    { base: '#B8940D', shadow: '#A8840D', highlight: '#D4AC0D' },
                    { base: '#A0392B', shadow: '#903929', highlight: '#C0392B' },
                    { base: '#1970A9', shadow: '#1960B9', highlight: '#2980B9' },
                    { base: '#179E50', shadow: '#178E50', highlight: '#27AE60' },
                    { base: '#7E34AD', shadow: '#6E349D', highlight: '#8E44AD' }
                ];

                for (let py = 0; py < 4; py++) {
                    for (let px = 0; px < 4; px++) {
                        const colorSet = colors[(px + py * 3) % colors.length];

                        // Tile outline
                        ctx.fillStyle = '#1a0d00';
                        ctx.fillRect(x + px * 8, y + py * 8, 8, 8);

                        // Shadow
                        ctx.fillStyle = colorSet.shadow;
                        ctx.fillRect(x + px * 8 + 1, y + py * 8 + 1, 6, 6);

                        // Base
                        ctx.fillStyle = colorSet.base;
                        ctx.fillRect(x + px * 8 + 2, y + py * 8 + 2, 4, 4);

                        // Highlight
                        ctx.fillStyle = colorSet.highlight;
                        ctx.fillRect(x + px * 8 + 2, y + py * 8 + 2, 2, 2);
                    }
                }

                // Bold grout lines (dark gold)
                ctx.fillStyle = '#8B7938';
                for (let i = 1; i < 4; i++) {
                    ctx.fillRect(x, y + i * 8 - 2, s, 2);
                    ctx.fillRect(x + i * 8 - 2, y, 2, s);
                }
                break;
            }
            case 'phonebox': {
                // LONDON: Classic British red phone box
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+7, y+1, 18, 30);

                // Shadow tone
                ctx.fillStyle = '#A0392B';
                ctx.fillRect(x+8, y+2, 16, 28);

                // Base tone (iconic red)
                ctx.fillStyle = '#C0392B';
                ctx.fillRect(x+9, y+3, 14, 26);

                // Highlight tone
                ctx.fillStyle = '#E0594B';
                ctx.fillRect(x+10, y+3, 2, 26);

                // Window panes with outlines
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+9, y+5, 14, 10);
                ctx.fillRect(x+9, y+15, 14, 8);

                ctx.fillStyle = '#8EC5E1';
                ctx.fillRect(x+10, y+6, 12, 8);
                ctx.fillRect(x+10, y+16, 12, 6);

                ctx.fillStyle = '#AED6F1';
                ctx.fillRect(x+11, y+7, 10, 6);
                ctx.fillRect(x+11, y+17, 10, 4);

                // Window dividers
                ctx.fillStyle = '#C0392B';
                ctx.fillRect(x+10, y+10, 12, 2);
                ctx.fillRect(x+16, y+6, 2, 8);
                ctx.fillRect(x+16, y+16, 2, 6);

                // Crown emblem on top
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+11, y+1, 10, 3);
                ctx.fillStyle = '#F1C40F';
                ctx.fillRect(x+12, y+2, 8, 2);

                // Door handle
                ctx.fillStyle = '#555555';
                ctx.fillRect(x+20, y+18, 2, 2);
                break;
            }
            case 'cherry': {
                // TOKYO: Pink cherry blossom tree
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+11, y+19, 10, 14);

                ctx.fillStyle = '#5B3216'; // Trunk shadow
                ctx.fillRect(x+12, y+20, 8, 12);

                ctx.fillStyle = '#6B4226'; // Trunk base
                ctx.fillRect(x+13, y+21, 6, 10);

                ctx.fillStyle = '#7B5236'; // Trunk highlight
                ctx.fillRect(x+14, y+22, 4, 8);

                // Blossom canopy with bold outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+3, y+3, 26, 20);

                ctx.fillStyle = '#d8659a'; // Shadow pink
                ctx.fillRect(x+4, y+4, 24, 18);

                ctx.fillStyle = '#e8859a'; // Base pink
                ctx.fillRect(x+5, y+5, 22, 16);

                ctx.fillStyle = '#f8a5c2'; // Mid pink
                ctx.fillRect(x+6, y+3, 20, 16);

                ctx.fillStyle = '#ffc8d7'; // Highlight pink
                ctx.fillRect(x+8, y+5, 12, 10);

                // Individual petal clusters
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(x+10, y+6, 3, 3);
                ctx.fillRect(x+16, y+4, 3, 3);
                ctx.fillRect(x+20, y+10, 3, 3);
                ctx.fillRect(x+6, y+12, 3, 3);
                ctx.fillRect(x+14, y+14, 3, 3);

                // Dark pink accents
                ctx.fillStyle = '#d8658a';
                ctx.fillRect(x+8, y+14, 4, 3);
                ctx.fillRect(x+18, y+8, 4, 3);
                ctx.fillRect(x+12, y+10, 2, 2);
                break;
            }
            case 'palm': {
                // MARRAKECH: Tropical palm with detailed fronds
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+13, y+9, 6, 24);

                ctx.fillStyle = '#6D4A1E'; // Trunk shadow
                ctx.fillRect(x+14, y+10, 4, 22);

                ctx.fillStyle = '#7D5A1E'; // Trunk base
                ctx.fillRect(x+14, y+11, 4, 20);

                // Trunk segments (highlight)
                ctx.fillStyle = '#8D6A2E';
                ctx.fillRect(x+14, y+14, 4, 4);
                ctx.fillRect(x+14, y+22, 4, 4);

                // Frond outlines
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+3, y+1, 12, 10);
                ctx.fillRect(x+17, y+1, 12, 10);
                ctx.fillRect(x+7, y-1, 18, 8);
                ctx.fillRect(x+1, y+3, 8, 6);
                ctx.fillRect(x+23, y+3, 8, 6);

                // Frond shadows
                ctx.fillStyle = '#0B5D2A';
                ctx.fillRect(x+4, y+2, 10, 8);
                ctx.fillRect(x+18, y+2, 10, 8);
                ctx.fillRect(x+8, y+0, 16, 6);

                // Frond base color
                ctx.fillStyle = '#1B7D3A';
                ctx.fillRect(x+5, y+3, 8, 6);
                ctx.fillRect(x+19, y+3, 8, 6);
                ctx.fillRect(x+9, y+1, 14, 5);

                // Frond highlights
                ctx.fillStyle = '#2AAA5A';
                ctx.fillRect(x+6, y+4, 6, 4);
                ctx.fillRect(x+20, y+4, 6, 4);
                ctx.fillRect(x+12, y+0, 8, 3);

                ctx.fillStyle = '#22944A';
                ctx.fillRect(x+2, y+4, 6, 4);
                ctx.fillRect(x+24, y+4, 6, 4);

                // Coconut cluster
                ctx.fillStyle = '#6B4226';
                ctx.fillRect(x+12, y+8, 4, 4);
                ctx.fillRect(x+16, y+10, 2, 2);
                break;
            }
            case 'torii': {
                // TOKYO: Bold red torii gate with proper proportions
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x-1, y+3, 34, 6);
                ctx.fillRect(x+3, y+9, 26, 4);
                ctx.fillRect(x+5, y+3, 6, 30);
                ctx.fillRect(x+21, y+3, 6, 30);

                // Shadow tone
                ctx.fillStyle = '#8A1911';
                ctx.fillRect(x+0, y+4, 32, 4);
                ctx.fillRect(x+4, y+10, 24, 2);
                ctx.fillRect(x+6, y+4, 4, 28);
                ctx.fillRect(x+22, y+4, 4, 28);

                // Base tone (iconic red)
                ctx.fillStyle = '#AA2211';
                ctx.fillRect(x+1, y+5, 30, 3);
                ctx.fillRect(x+5, y+11, 22, 1);
                ctx.fillRect(x+7, y+5, 3, 26);
                ctx.fillRect(x+23, y+5, 3, 26);

                // Highlight tone
                ctx.fillStyle = '#DD4433';
                ctx.fillRect(x+2, y+5, 28, 1);
                ctx.fillRect(x+8, y+5, 1, 26);
                ctx.fillRect(x+24, y+5, 1, 26);

                // Top beam curve detail
                ctx.fillStyle = '#CC3322';
                ctx.fillRect(x+0, y+3, 4, 2);
                ctx.fillRect(x+28, y+3, 4, 2);
                break;
            }
            case 'lantern': {
                // TOKYO: Paper lantern with internal glow and kanji
                ctx.fillStyle = '#333333';
                ctx.fillRect(x+14, y+2, 4, 4);

                // Lantern body outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+9, y+5, 14, 20);

                ctx.fillStyle = '#AA2211'; // Shadow
                ctx.fillRect(x+10, y+6, 12, 18);

                ctx.fillStyle = '#CC3322'; // Base
                ctx.fillRect(x+11, y+7, 10, 16);

                ctx.fillStyle = '#DD4433'; // Highlight
                ctx.fillRect(x+12, y+8, 8, 14);

                // Internal glow (warm light)
                ctx.fillStyle = '#FFE0AA';
                ctx.fillRect(x+14, y+10, 4, 10);

                ctx.fillStyle = '#FFFFCC';
                ctx.fillRect(x+15, y+12, 2, 6);

                // Horizontal bands
                ctx.fillStyle = '#AA2211';
                ctx.fillRect(x+10, y+12, 12, 2);
                ctx.fillRect(x+10, y+18, 12, 2);

                // Bottom cap
                ctx.fillStyle = '#333333';
                ctx.fillRect(x+12, y+24, 8, 2);

                // Tassel
                ctx.fillStyle = '#CC3322';
                ctx.fillRect(x+14, y+26, 4, 4);

                // Kanji-style vertical line
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+15, y+14, 2, 4);
                break;
            }
            case 'bamboo': {
                // TOKYO: Segmented bamboo stalks with leaf sprays
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+5, y-1, 8, 34);
                ctx.fillRect(x+19, y-1, 8, 34);

                ctx.fillStyle = '#1a5a1a'; // Shadow
                ctx.fillRect(x+6, y, 6, 32);
                ctx.fillRect(x+20, y, 6, 32);

                ctx.fillStyle = '#2d7a2d'; // Base
                ctx.fillRect(x+7, y+1, 4, 30);
                ctx.fillRect(x+21, y+1, 4, 30);

                ctx.fillStyle = '#3a9a3a'; // Highlight
                ctx.fillRect(x+8, y+1, 2, 30);
                ctx.fillRect(x+22, y+1, 2, 30);

                // Segment joints (darker bands)
                ctx.fillStyle = '#1a5a1a';
                ctx.fillRect(x+6, y+8, 6, 2);
                ctx.fillRect(x+6, y+20, 6, 2);
                ctx.fillRect(x+20, y+6, 6, 2);
                ctx.fillRect(x+20, y+18, 6, 2);

                // Leaf sprays with outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+11, y+7, 8, 6);
                ctx.fillRect(x+13, y+17, 8, 6);

                ctx.fillStyle = '#2d8a2d';
                ctx.fillRect(x+12, y+8, 6, 4);
                ctx.fillRect(x+14, y+18, 6, 4);

                ctx.fillStyle = '#3aaa3a';
                ctx.fillRect(x+13, y+9, 4, 2);
                ctx.fillRect(x+15, y+19, 4, 2);
                break;
            }
            case 'statue': {
                // ROME: Classical marble statue with contrasting shadow
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+7, y+23, 18, 10);

                ctx.fillStyle = '#859596'; // Pedestal shadow
                ctx.fillRect(x+8, y+24, 16, 8);

                ctx.fillStyle = '#95a5a6'; // Pedestal base
                ctx.fillRect(x+9, y+25, 14, 6);

                ctx.fillStyle = '#aab5b6'; // Pedestal highlight
                ctx.fillRect(x+9, y+25, 14, 2);

                // Statue outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+11, y+1, 10, 24);
                ctx.fillRect(x+7, y+9, 6, 10);
                ctx.fillRect(x+19, y+9, 6, 10);

                // Statue shadow
                ctx.fillStyle = '#a0aeb5';
                ctx.fillRect(x+12, y+2, 8, 22);
                ctx.fillRect(x+8, y+10, 4, 8);
                ctx.fillRect(x+20, y+10, 4, 8);

                // Statue base
                ctx.fillStyle = '#b0bec5';
                ctx.fillRect(x+13, y+3, 6, 20);
                ctx.fillRect(x+9, y+11, 3, 7);
                ctx.fillRect(x+21, y+11, 3, 7);

                // Head
                ctx.fillRect(x+13, y+3, 6, 7);

                // Highlight
                ctx.fillStyle = '#d0dce5';
                ctx.fillRect(x+13, y+3, 2, 20);
                ctx.fillRect(x+9, y+11, 1, 7);
                ctx.fillRect(x+13, y+3, 6, 2);
                break;
            }
            case 'bridge': {
                // ROME/General: Stone bridge with arch detail
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x-1, y-1, s+2, s+2);

                ctx.fillStyle = '#4A5B6E'; // Shadow tone
                ctx.fillRect(x, y, s, s);

                ctx.fillStyle = '#5A6B7E'; // Base tone
                ctx.fillRect(x, y, s, s-6);

                // Top surface highlight
                ctx.fillStyle = '#7A8B9E';
                ctx.fillRect(x, y, s, 6);

                // Stone blocks on surface
                ctx.fillRect(x+2, y, 4, 6);
                ctx.fillRect(x+10, y, 4, 6);
                ctx.fillRect(x+18, y, 4, 6);
                ctx.fillRect(x+26, y, 4, 6);

                // Arch shadow underneath
                ctx.fillStyle = '#3A4B5E';
                ctx.fillRect(x, y+6, s, s-6);

                // Arch curve
                ctx.fillStyle = '#2A3B4E';
                ctx.fillRect(x+4, y+10, 24, 16);
                ctx.fillRect(x+8, y+14, 16, 12);
                break;
            }
            case 'bookshop': {
                // PARIS/LONDON: Bookshop window with colorful spines
                ctx.fillStyle = '#1a5276';
                ctx.fillRect(x, y, s, s);

                // Window frame outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+3, y+5, 12, 22);
                ctx.fillRect(x+17, y+5, 12, 22);

                ctx.fillStyle = '#6B4226'; // Shadow
                ctx.fillRect(x+4, y+6, 10, 20);
                ctx.fillRect(x+18, y+6, 10, 20);

                ctx.fillStyle = '#8B4513'; // Base
                ctx.fillRect(x+5, y+7, 8, 18);
                ctx.fillRect(x+19, y+7, 8, 18);

                // Book spines with outlines
                const books = [
                    { x: 6, y: 8, color: '#C0392B' },
                    { x: 8, y: 8, color: '#2980B9' },
                    { x: 10, y: 8, color: '#27AE60' },
                    { x: 20, y: 8, color: '#F1C40F' },
                    { x: 22, y: 8, color: '#9B59B6' },
                    { x: 24, y: 8, color: '#E67E22' }
                ];

                books.forEach(book => {
                    ctx.fillStyle = '#1a0d00';
                    ctx.fillRect(x+book.x, y+book.y, 3, 7);
                    ctx.fillStyle = book.color;
                    ctx.fillRect(x+book.x, y+book.y+1, 2, 6);
                    ctx.fillStyle = this.adjustBrightness(book.color, 0.3);
                    ctx.fillRect(x+book.x, y+book.y+1, 2, 2);
                });
                break;
            }
            case 'lamp': {
                // Street lamp with warm glow halo
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+13, y+7, 6, 26);

                ctx.fillStyle = '#444444'; // Post shadow
                ctx.fillRect(x+14, y+8, 4, 24);

                ctx.fillStyle = '#555555'; // Post base
                ctx.fillRect(x+15, y+9, 2, 22);

                // Lamp head outline
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+9, y+1, 14, 10);

                ctx.fillStyle = '#666666'; // Lamp shadow
                ctx.fillRect(x+10, y+2, 12, 8);

                ctx.fillStyle = '#777777'; // Lamp base
                ctx.fillRect(x+11, y+3, 10, 6);

                // Light source
                ctx.fillStyle = '#FFD666';
                ctx.fillRect(x+12, y+4, 8, 4);

                ctx.fillStyle = '#FFEE88';
                ctx.fillRect(x+13, y+5, 6, 2);

                // Glow halo (manga-style)
                ctx.fillStyle = '#FFEE88';
                ctx.globalAlpha = 0.4;
                ctx.fillRect(x+8, y+0, 16, 12);
                ctx.globalAlpha = 0.2;
                ctx.fillRect(x+6, y-1, 20, 14);
                ctx.globalAlpha = 1;
                break;
            }
            case 'park': {
                // Park bench with armrests and backrest detail
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x+3, y+9, 26, 6);
                ctx.fillRect(x+3, y+15, 26, 6);
                ctx.fillRect(x+5, y+19, 6, 10);
                ctx.fillRect(x+21, y+19, 6, 10);

                ctx.fillStyle = '#4D3027'; // Shadow
                ctx.fillRect(x+4, y+10, 24, 4);
                ctx.fillRect(x+4, y+16, 24, 4);
                ctx.fillRect(x+6, y+20, 4, 8);
                ctx.fillRect(x+22, y+20, 4, 8);

                ctx.fillStyle = '#5D4037'; // Base
                ctx.fillRect(x+5, y+11, 22, 3);
                ctx.fillRect(x+5, y+17, 22, 3);
                ctx.fillRect(x+7, y+21, 3, 6);
                ctx.fillRect(x+23, y+21, 3, 6);

                ctx.fillStyle = '#795548'; // Highlight
                ctx.fillRect(x+6, y+11, 20, 1);
                ctx.fillRect(x+6, y+17, 20, 1);
                ctx.fillRect(x+7, y+21, 1, 6);
                ctx.fillRect(x+23, y+21, 1, 6);

                // Backrest slats
                ctx.fillStyle = '#5D4037';
                ctx.fillRect(x+8, y+11, 2, 3);
                ctx.fillRect(x+13, y+11, 2, 3);
                ctx.fillRect(x+18, y+11, 2, 3);
                break;
            }
        }
    }

    // Helper method for color brightness adjustment
    adjustBrightness(hexColor, factor) {
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        const newR = Math.min(255, Math.max(0, Math.floor(r + (255 - r) * factor)));
        const newG = Math.min(255, Math.max(0, Math.floor(g + (255 - g) * factor)));
        const newB = Math.min(255, Math.max(0, Math.floor(b + (255 - b) * factor)));

        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }

    // ─── Particles ───────────────────────────────────────────

    generateParticleTextures() {
        const textures = this.scene.textures;

        // White particle (fountain spray) - 8x8 with outline
        let canvas = textures.createCanvas('particle_white', 8, 8);
        let ctx = canvas.getContext();
        ctx.fillStyle = '#cccccc';
        ctx.fillRect(1, 1, 6, 6);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(2, 2, 4, 4);
        ctx.globalAlpha = 0.6;
        ctx.fillRect(0, 0, 8, 8);
        ctx.globalAlpha = 1;
        canvas.refresh();

        // Sparkle particle (portal) - 6x6 with glow
        canvas = textures.createCanvas('particle_sparkle', 6, 6);
        ctx = canvas.getContext();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(2, 0, 2, 6);
        ctx.fillRect(0, 2, 6, 2);
        ctx.fillRect(1, 1, 4, 4);
        canvas.refresh();

        // Cherry blossom petal - 8x12 with more organic shape
        canvas = textures.createCanvas('particle_petal', 8, 12);
        ctx = canvas.getContext();
        // Outline
        ctx.fillStyle = '#e8859a';
        ctx.fillRect(1, 0, 6, 9);
        ctx.fillRect(0, 2, 8, 5);
        // Base
        ctx.fillStyle = '#f8a5c2';
        ctx.fillRect(2, 1, 4, 7);
        ctx.fillRect(1, 3, 6, 3);
        // Highlight
        ctx.fillStyle = '#ffc8d7';
        ctx.fillRect(2, 2, 4, 4);
        // White center
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(3, 3, 2, 2);
        canvas.refresh();

        // Dust mote - 4x4 with slight outline
        canvas = textures.createCanvas('particle_dust', 4, 4);
        ctx = canvas.getContext();
        ctx.fillStyle = '#ddddaa';
        ctx.fillRect(0, 0, 4, 4);
        ctx.fillStyle = '#ffffcc';
        ctx.fillRect(1, 1, 2, 2);
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

        // Interaction indicator (!) - 16x16
        canvas = textures.createCanvas('interact_icon', 16, 16);
        ctx = canvas.getContext();
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(6, 0, 4, 10);
        ctx.fillRect(6, 12, 4, 4);
        canvas.refresh();

        // Quest marker (?) - 16x20
        canvas = textures.createCanvas('quest_marker', 16, 20);
        ctx = canvas.getContext();
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(4, 0, 8, 4);
        ctx.fillRect(10, 4, 4, 4);
        ctx.fillRect(6, 8, 6, 4);
        ctx.fillRect(6, 12, 4, 2);
        ctx.fillRect(6, 16, 4, 4);
        canvas.refresh();

        // Arrow indicator - 16x16
        canvas = textures.createCanvas('arrow', 16, 16);
        ctx = canvas.getContext();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(6, 0, 4, 4);
        ctx.fillRect(4, 4, 8, 4);
        ctx.fillRect(2, 8, 12, 4);
        ctx.fillRect(0, 12, 16, 4);
        canvas.refresh();
    }

    // ─── World Map ───────────────────────────────────────────

    generateWorldMapAssets() {
        const textures = this.scene.textures;

        // City dot with outline
        let canvas = textures.createCanvas('city_dot', 8, 8);
        let ctx = canvas.getContext();
        ctx.fillStyle = '#1a0d00';
        ctx.fillRect(1, 1, 6, 6);
        ctx.fillStyle = '#d4a40f';
        ctx.fillRect(2, 2, 4, 4);
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(2, 2, 3, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(3, 3, 2, 2);
        canvas.refresh();

        // Locked city dot
        canvas = textures.createCanvas('city_locked', 8, 8);
        ctx = canvas.getContext();
        ctx.fillStyle = '#1a0d00';
        ctx.fillRect(1, 1, 6, 6);
        ctx.fillStyle = '#444444';
        ctx.fillRect(2, 2, 4, 4);
        ctx.fillStyle = '#555555';
        ctx.fillRect(2, 2, 3, 3);
        ctx.fillStyle = '#888888';
        ctx.fillRect(3, 3, 2, 2);
        canvas.refresh();

        // Transport icons with outlines
        const transports = [
            { name: 'train', color: '#e74c3c', shadow: '#c0392b' },
            { name: 'boat', color: '#3498db', shadow: '#2980b9' },
            { name: 'portal', color: '#9b59b6', shadow: '#8e44ad' }
        ];

        transports.forEach(t => {
            canvas = textures.createCanvas(`transport_${t.name}`, 10, 10);
            ctx = canvas.getContext();
            ctx.fillStyle = '#1a0d00';
            ctx.fillRect(0, 0, 10, 10);
            ctx.fillStyle = t.shadow;
            ctx.fillRect(1, 1, 8, 8);
            ctx.fillStyle = t.color;
            ctx.fillRect(2, 2, 6, 6);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(3, 3, 4, 4);
            canvas.refresh();
        });

        // World map background - manga painted style
        canvas = textures.createCanvas('world_map_bg', 320, 240);
        ctx = canvas.getContext();

        // Deep ocean base
        ctx.fillStyle = '#1a4a78';
        ctx.fillRect(0, 0, 320, 240);

        // Ocean gradient
        ctx.fillStyle = '#2c5f8a';
        ctx.fillRect(0, 0, 320, 180);

        ctx.fillStyle = '#2a5a82';
        ctx.fillRect(0, 0, 320, 120);

        // Wave pattern
        for (let i = 0; i < 20; i++) {
            const wavey = 20 + i * 12;
            ctx.fillStyle = i % 2 === 0 ? '#2a5a82' : '#285578';
            for (let x = 0; x < 320; x += 8) {
                ctx.fillRect(x + (i % 2) * 4, wavey, 6, 1);
            }
        }

        // Europe landmass with terrain variation
        ctx.fillStyle = '#3a7030'; // Dark green shadow
        ctx.fillRect(80, 40, 82, 62);
        ctx.fillRect(100, 30, 52, 22);
        ctx.fillRect(90, 90, 62, 32);

        ctx.fillStyle = '#4a8c3f'; // Base green
        ctx.fillRect(81, 41, 80, 60);
        ctx.fillRect(101, 31, 50, 20);
        ctx.fillRect(91, 91, 60, 30);
        ctx.fillRect(86, 26, 20, 35);
        ctx.fillRect(131, 81, 15, 40);
        ctx.fillRect(161, 71, 40, 30);
        ctx.fillRect(171, 61, 40, 20);

        // Mountain ranges (Alps)
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(120, 55, 30, 15);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(125, 55, 20, 3);

        // North Africa (desert)
        ctx.fillStyle = '#c49440'; // Shadow
        ctx.fillRect(70, 120, 142, 42);

        ctx.fillStyle = '#d4a950'; // Base sand
        ctx.fillRect(71, 121, 140, 40);

        // Dune details
        ctx.fillStyle = '#e4b960';
        ctx.fillRect(80, 125, 40, 8);
        ctx.fillRect(140, 135, 35, 10);

        // Asia landmass with terrain
        ctx.fillStyle = '#4a8040'; // Shadow
        ctx.fillRect(200, 30, 122, 82);

        ctx.fillStyle = '#5a9c4f'; // Base green
        ctx.fillRect(201, 31, 120, 80);

        // Mountain ranges (Himalayas)
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(210, 50, 40, 20);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(215, 50, 30, 4);

        // Japan islands
        ctx.fillStyle = '#4a8040';
        ctx.fillRect(285, 50, 12, 32);
        ctx.fillStyle = '#5a9c4f';
        ctx.fillRect(286, 51, 10, 30);

        canvas.refresh();
    }

    // ─── Item Icons ──────────────────────────────────────────

    generateItemIcons() {
        const textures = this.scene.textures;

        ITEM_DEFS.forEach(item => {
            const canvas = textures.createCanvas(`item_${item.name}`, 32, 32);
            const ctx = canvas.getContext();

            // Dark outline for all items
            ctx.fillStyle = '#1a0d00';

            switch (item.detail) {
                case 'circle':
                    // Outline
                    ctx.fillRect(7, 7, 18, 18);
                    ctx.fillRect(9, 5, 14, 22);
                    ctx.fillRect(5, 9, 22, 14);
                    // Shadow
                    ctx.fillStyle = this.adjustBrightness(item.color, -0.3);
                    ctx.fillRect(8, 8, 16, 16);
                    ctx.fillRect(10, 6, 12, 20);
                    ctx.fillRect(6, 10, 20, 12);
                    // Base
                    ctx.fillStyle = item.color;
                    ctx.fillRect(9, 9, 14, 14);
                    ctx.fillRect(11, 7, 10, 18);
                    ctx.fillRect(7, 11, 18, 10);
                    // Highlight
                    ctx.fillStyle = this.adjustBrightness(item.color, 0.4);
                    ctx.fillRect(10, 10, 6, 6);
                    // Shine
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(12, 12, 3, 3);
                    break;
                case 'rect':
                    // Outline
                    ctx.fillRect(5, 3, 22, 26);
                    // Shadow
                    ctx.fillStyle = this.adjustBrightness(item.color, -0.3);
                    ctx.fillRect(6, 4, 20, 24);
                    // Base
                    ctx.fillStyle = item.color;
                    ctx.fillRect(7, 5, 18, 22);
                    // Highlight
                    ctx.fillStyle = this.adjustBrightness(item.color, 0.4);
                    ctx.fillRect(8, 6, 14, 8);
                    // Shine
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(10, 8, 4, 4);
                    break;
                case 'key':
                    // Outline
                    ctx.fillRect(5, 5, 14, 14);
                    ctx.fillRect(17, 9, 12, 6);
                    ctx.fillRect(23, 13, 6, 6);
                    // Shadow
                    ctx.fillStyle = this.adjustBrightness(item.color, -0.3);
                    ctx.fillRect(6, 6, 12, 12);
                    ctx.fillRect(18, 10, 10, 4);
                    ctx.fillRect(24, 14, 4, 4);
                    // Base
                    ctx.fillStyle = item.color;
                    ctx.fillRect(7, 7, 10, 10);
                    ctx.fillRect(19, 11, 8, 3);
                    ctx.fillRect(25, 15, 3, 3);
                    // Highlight
                    ctx.fillStyle = this.adjustBrightness(item.color, 0.5);
                    ctx.fillRect(8, 8, 4, 4);
                    // Shine
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(9, 9, 2, 2);
                    break;
                case 'book':
                    // Outline
                    ctx.fillRect(5, 3, 22, 26);
                    // Shadow
                    ctx.fillStyle = this.adjustBrightness(item.color, -0.3);
                    ctx.fillRect(6, 4, 20, 24);
                    // Base
                    ctx.fillStyle = item.color;
                    ctx.fillRect(7, 5, 18, 22);
                    // Pages
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(10, 8, 12, 2);
                    ctx.fillRect(10, 14, 12, 2);
                    ctx.fillRect(10, 20, 12, 2);
                    // Binding shadow
                    ctx.fillStyle = this.adjustBrightness(item.color, -0.5);
                    ctx.fillRect(7, 5, 2, 22);
                    break;
                case 'diamond':
                    // Outline
                    ctx.fillRect(11, 3, 10, 10);
                    ctx.fillRect(7, 9, 18, 10);
                    ctx.fillRect(11, 15, 10, 10);
                    // Shadow facets
                    ctx.fillStyle = this.adjustBrightness(item.color, -0.3);
                    ctx.fillRect(12, 4, 8, 8);
                    ctx.fillRect(8, 10, 16, 8);
                    ctx.fillRect(12, 16, 8, 8);
                    // Base facets
                    ctx.fillStyle = item.color;
                    ctx.fillRect(13, 5, 6, 6);
                    ctx.fillRect(9, 11, 14, 6);
                    ctx.fillRect(13, 17, 6, 6);
                    // Highlight facets
                    ctx.fillStyle = this.adjustBrightness(item.color, 0.5);
                    ctx.fillRect(14, 6, 4, 4);
                    ctx.fillRect(10, 12, 6, 4);
                    // Sparkle
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(15, 7, 2, 2);
                    ctx.fillRect(11, 13, 2, 2);
                    ctx.fillRect(19, 13, 2, 2);
                    break;
                case 'torn':
                    // Outline
                    ctx.fillRect(5, 3, 20, 26);
                    // Shadow
                    ctx.fillStyle = this.adjustBrightness(item.color, -0.3);
                    ctx.fillRect(6, 4, 18, 24);
                    // Base
                    ctx.fillStyle = item.color;
                    ctx.fillRect(7, 5, 16, 22);
                    // Torn edge
                    ctx.fillRect(22, 5, 2, 4);
                    ctx.fillRect(20, 9, 2, 4);
                    ctx.fillRect(22, 13, 2, 4);
                    // Writing
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(10, 10, 10, 2);
                    ctx.fillRect(10, 16, 6, 2);
                    ctx.fillRect(10, 20, 8, 2);
                    break;
            }

            canvas.refresh();
        });
    }
}
