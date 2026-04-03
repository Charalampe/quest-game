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
        // Also load tile manifest for external monument tile PNGs
        this.scene.load.json('tile_manifest', 'src/assets/tiles/manifest.json');
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
        // Load as plain images — we'll slice frames ourselves in _remapExternalSprite
        // because PIPOYA frames are 32x32, not 32x48
        let queued = false;

        if (manifest.player) {
            loader.image('player_ext', `src/assets/sprites/${manifest.player}`);
            queued = true;
        }

        if (manifest.npcs) {
            for (const [name, file] of Object.entries(manifest.npcs)) {
                loader.image(`npc_${name}_ext`, `src/assets/sprites/${file}`);
                queued = true;
            }
        }

        if (!queued) return Promise.resolve();

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

    /**
     * Load external tile PNGs listed in the tile manifest.
     * Falls back to procedural tiles for any that fail to load.
     */
    _loadExternalTiles() {
        const cache = this.scene.cache;
        if (!cache.json.has('tile_manifest')) return Promise.resolve();
        const manifest = cache.json.get('tile_manifest');
        if (!manifest || !manifest.tiles) return Promise.resolve();

        const loader = this.scene.load;
        let queued = false;
        this.loadedTiles = new Set();

        for (const [name, info] of Object.entries(manifest.tiles)) {
            loader.image(`tile_${name}`, `src/assets/tiles/${info.file}`);
            queued = true;
        }

        if (!queued) return Promise.resolve();

        return new Promise(resolve => {
            const onComplete = (key) => { this.loadedTiles.add(key); };
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
        // Load external tile PNGs if tile manifest was found
        await this._loadExternalTiles();

        this.generatePlayerSpritesheet();
        this.generateNPCSpritesheet();
        this.generateTileset();
        this.generateParticleTextures();
        this.generateUIAssets();
        this.generateWorldMapAssets();
        this.generateTravelAssets();
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
     * Remap an external spritesheet to the game's expected frame layout (32x48, 4 cols × 4 rows).
     *
     * Handles PIPOYA format: 96x128 = 3 cols × 4 rows at 32x32 per frame.
     * Detects source frame size from the image and pads vertically to fit 32x48
     * (sprite drawn at bottom of frame so feet align with collision box).
     *
     * Animation mapping: game frames 0,1,2,3 → PIPOYA cols 0,1,0,2 (stand/step1/stand/step2).
     */
    _remapExternalSprite(extKey, targetKey) {
        const textures = this.scene.textures;
        const srcTex = textures.get(extKey);
        if (!srcTex || !srcTex.source || !srcTex.source[0]) return;

        const srcImg = srcTex.source[0].image;
        const dstFW = SPRITE_W;  // 32 — target frame width
        const dstFH = SPRITE_H;  // 48 — target frame height

        // Detect source frame size from image dimensions
        // PIPOYA 32x32 pack: 96x128 = 3 cols × 4 rows, each frame 32x32
        // PIPOYA 32x48 pack: 96x192 = 3 cols × 4 rows, each frame 32x48
        const srcRows = 4; // always 4 directions (down, left, right, up)
        const srcFH = Math.floor(srcImg.height / srcRows);
        const srcFW = Math.floor(srcImg.width / 3);  // PIPOYA always 3 cols
        const srcCols = Math.floor(srcImg.width / srcFW);

        // Vertical offset: bottom-align sprite in the taller frame
        const yPad = dstFH - srcFH; // e.g. 48 - 32 = 16px padding at top

        // Create target canvas (4 cols × 4 rows at 32x48)
        const canvas = textures.createCanvas(targetKey, dstFW * 4, dstFH * 4);
        const ctx = canvas.getContext();

        const isPipoya = (srcCols === 3);
        const frameMap = [0, 1, 0, 2]; // PIPOYA 3-frame → 4-frame mapping

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const srcCol = isPipoya ? frameMap[col] : Math.min(col, srcCols - 1);
                ctx.drawImage(srcImg,
                    srcCol * srcFW, row * srcFH, srcFW, srcFH,         // source rect
                    col * dstFW, row * dstFH + yPad, srcFW, srcFH);    // dest rect (bottom-aligned)
            }
        }

        canvas.refresh();

        // Register frame indices at target frame size
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const frameIndex = row * 4 + col;
                textures.get(targetKey).add(frameIndex, 0, col * dstFW, row * dstFH, dstFW, dstFH);
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
        const rows = 16; // expanded from 10 to fit monument tiles (indices 66-98)
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
        // Frame 0 = tile 2 (base water in drawTileDetail 'water' case)
        // Frame 1 = tile 64: waves shifted down, different sparkle pattern
        // Frame 2 = tile 65: waves shifted further, brighter highlights
        const waterVariants = [
            { index: 64, waveYOff: 3, hue: '#5090e0', sparkleHue: '#c0e0ff' },
            { index: 65, waveYOff: 6, hue: '#4088d8', sparkleHue: '#ffffff' }
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

            // Gradient layers — shift tint per frame
            ctx.fillStyle = v.hue;
            ctx.fillRect(wx + 2, wy + 2, tileSize - 4, 14);
            ctx.fillStyle = '#4a8de8';
            ctx.fillRect(wx + 2, wy + 2, tileSize - 4, 7);

            // Wave crests shifted vertically per frame
            const wo = v.waveYOff;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(wx + 6, wy + 6 + wo, 10, 2);
            ctx.fillRect(wx + 18, wy + 10 + wo, 8, 2);
            ctx.fillRect(wx + 3, wy + 14 + wo, 12, 2);
            ctx.fillRect(wx + 16, wy + 20 + wo, 10, 2);
            ctx.fillRect(wx + 6, wy + 24 + wo, 14, 2);

            // Semi-transparent shimmer band
            ctx.fillStyle = v.sparkleHue;
            ctx.fillRect(wx + 4, wy + 3, 6, 2);
            ctx.fillRect(wx + 22, wy + 12 + wo, 4, 2);
            ctx.fillRect(wx + 10, wy + 22 + wo, 6, 2);
            ctx.fillRect(wx + 26, wy + 8, 3, 2);
            ctx.fillRect(wx + 2, wy + 28 - wo, 4, 2);
        });

        // Composite external tile PNGs over procedural tiles
        const cache = this.scene.cache;
        if (this.loadedTiles && cache.json.has('tile_manifest')) {
            const manifest = cache.json.get('tile_manifest');
            if (manifest && manifest.tiles) {
                for (const [name, info] of Object.entries(manifest.tiles)) {
                    const key = `tile_${name}`;
                    if (this.loadedTiles.has(key)) {
                        const tex = this.scene.textures.get(key);
                        if (tex && tex.source && tex.source[0]) {
                            const img = tex.source[0].image;
                            const col2 = info.index % cols;
                            const row2 = Math.floor(info.index / cols);
                            ctx.drawImage(img, col2 * tileSize, row2 * tileSize, tileSize, tileSize);
                        }
                    }
                }
            }
        }

        canvas.refresh();

        // Register all tile indices (TILE_DEFS covers 0-98, water at 64-65 already included)
        const totalTiles = Math.max(TILE_DEFS.length, 99);
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
            case 'roof': {
                const roofBase = tile.color;
                // Dark outline
                ctx.fillStyle = '#4a1a1a';
                ctx.fillRect(x, y, s, s);

                // Ridge cap (top decorative strip)
                ctx.fillStyle = '#8B2500';
                ctx.fillRect(x, y, s, 4);
                ctx.fillStyle = '#A03020';
                ctx.fillRect(x+1, y+1, s-2, 2);

                // Shingle rows — 4 overlapping rows with offset
                for (let row = 0; row < 4; row++) {
                    const ry = y + 4 + row * 7;
                    const offset = (row % 2) * 8;
                    for (let sx = -8; sx < s + 8; sx += 16) {
                        const shingleX = x + sx + offset;
                        const sw = 14;
                        const clippedX = Math.max(shingleX, x);
                        const clippedW = Math.min(shingleX + sw, x + s) - clippedX;
                        if (clippedW <= 0) continue;

                        // Shingle shadow
                        ctx.fillStyle = '#6B1A1A';
                        ctx.fillRect(clippedX, ry, clippedW, 7);

                        // Shingle body
                        ctx.fillStyle = roofBase;
                        ctx.fillRect(clippedX, ry, clippedW, 5);

                        // Shingle highlight (top edge)
                        ctx.fillStyle = '#E05040';
                        ctx.fillRect(clippedX, ry, clippedW, 2);

                        // Shingle bottom curve shadow
                        ctx.fillStyle = '#7B2020';
                        ctx.fillRect(clippedX + 1, ry + 5, clippedW - 2, 1);
                    }
                }

                // Bottom edge trim
                ctx.fillStyle = '#5B1515';
                ctx.fillRect(x, y + s - 2, s, 2);
                ctx.fillStyle = '#8B2500';
                ctx.fillRect(x, y + s - 2, s, 1);
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

            // ── Monument section tile fallbacks (PNG overrides these) ──
            case 'eiffel_spire_L': case 'eiffel_spire_CL': case 'eiffel_spire_CR': case 'eiffel_spire_R':
            case 'eiffel_upper_L': case 'eiffel_upper_CL': case 'eiffel_upper_CR': case 'eiffel_upper_R':
            case 'eiffel_deck_L': case 'eiffel_deck_CL': case 'eiffel_deck_CR': case 'eiffel_deck_R': {
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#4A5A6A';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#7D8D9E';
                ctx.fillRect(x+4, y+4, s-8, s-8);
                break;
            }
            case 'bigben_spire_L': case 'bigben_spire_R':
            case 'bigben_clock_TL': case 'bigben_clock_TR': case 'bigben_clock_BL': case 'bigben_clock_BR':
            case 'bigben_tower_L': case 'bigben_tower_R': {
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#6E4B00';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#8E7B20';
                ctx.fillRect(x+4, y+4, s-8, s-8);
                break;
            }
            case 'column_capital': case 'column_shaft': case 'column_base': {
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#E8E0D0';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#F8F0E0';
                ctx.fillRect(x+4, y+4, s-8, s-8);
                break;
            }
            case 'palm_top': case 'palm_trunk': {
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#1B7D3A';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                break;
            }
            case 'mosaic_star': case 'mosaic_diamond': {
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#D4AC0D';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                break;
            }
            case 'cherry_canopy_L': case 'cherry_canopy_R': case 'cherry_trunk': {
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#e8859a';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                break;
            }
            case 'torii_beam_L': case 'torii_beam_R': case 'torii_post': {
                ctx.fillStyle = '#1a0d00';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#AA2211';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                break;
            }

            // ── Ground tile details ──

            case 'sand': {
                ctx.fillStyle = '#c4a870';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#d4c5a0';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#e0d4b0';
                ctx.fillRect(x+2, y+2, s-4, s-4);
                // Sand ripples
                ctx.fillStyle = '#c8b890';
                ctx.fillRect(x+3, y+6, 12, 2);
                ctx.fillRect(x+16, y+10, 10, 2);
                ctx.fillRect(x+5, y+18, 14, 2);
                ctx.fillRect(x+18, y+24, 8, 2);
                ctx.fillRect(x+2, y+28, 10, 2);
                // Pebbles
                ctx.fillStyle = '#b0a080';
                ctx.fillRect(x+8, y+3, 3, 3);
                ctx.fillRect(x+22, y+15, 2, 2);
                ctx.fillRect(x+4, y+22, 3, 2);
                ctx.fillRect(x+26, y+6, 2, 3);
                // Highlight specks
                ctx.fillStyle = '#f0e8d0';
                ctx.fillRect(x+12, y+8, 2, 2);
                ctx.fillRect(x+24, y+20, 2, 2);
                ctx.fillRect(x+6, y+14, 2, 2);
                break;
            }
            case 'dirt': {
                ctx.fillStyle = '#6a5030';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#7a6040';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#8B7355';
                ctx.fillRect(x+2, y+2, s-4, s-4);
                // Ruts / wheel tracks
                ctx.fillStyle = '#7a6040';
                ctx.fillRect(x+4, y+10, 24, 2);
                ctx.fillRect(x+4, y+20, 24, 2);
                // Stones embedded in dirt
                ctx.fillStyle = '#a09070';
                ctx.fillRect(x+6, y+4, 4, 3);
                ctx.fillRect(x+20, y+7, 3, 3);
                ctx.fillRect(x+10, y+25, 4, 3);
                ctx.fillRect(x+24, y+23, 3, 2);
                // Dark patches
                ctx.fillStyle = '#6a5030';
                ctx.fillRect(x+14, y+14, 6, 4);
                ctx.fillRect(x+3, y+26, 4, 3);
                // Highlight
                ctx.fillStyle = '#9a8565';
                ctx.fillRect(x+8, y+2, 2, 2);
                ctx.fillRect(x+22, y+16, 2, 2);
                break;
            }
            case 'darkstone': {
                ctx.fillStyle = '#333333';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#444444';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#555555';
                ctx.fillRect(x+2, y+2, s-4, s-4);
                // Stone slab cracks
                ctx.fillStyle = '#3a3a3a';
                ctx.fillRect(x+14, y, 2, s);
                ctx.fillRect(x, y+14, s, 2);
                // Highlight edges
                ctx.fillStyle = '#666666';
                ctx.fillRect(x+2, y+2, 10, 2);
                ctx.fillRect(x+18, y+2, 10, 2);
                ctx.fillRect(x+2, y+18, 10, 2);
                ctx.fillRect(x+18, y+18, 10, 2);
                // Worn texture spots
                ctx.fillStyle = '#4a4a4a';
                ctx.fillRect(x+6, y+6, 4, 4);
                ctx.fillRect(x+22, y+22, 4, 4);
                break;
            }
            case 'wood': {
                ctx.fillStyle = '#b09060';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#c8a878';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#DEB887';
                ctx.fillRect(x+2, y+2, s-4, s-4);
                // Wood grain lines
                ctx.fillStyle = '#c8a060';
                ctx.fillRect(x+2, y+5, s-4, 1);
                ctx.fillRect(x+2, y+10, s-4, 1);
                ctx.fillRect(x+2, y+15, s-4, 1);
                ctx.fillRect(x+2, y+20, s-4, 1);
                ctx.fillRect(x+2, y+25, s-4, 1);
                // Knot
                ctx.fillStyle = '#b09060';
                ctx.fillRect(x+12, y+12, 6, 5);
                ctx.fillStyle = '#a08050';
                ctx.fillRect(x+13, y+13, 4, 3);
                // Plank seam
                ctx.fillStyle = '#a08050';
                ctx.fillRect(x+15, y, 2, s);
                // Highlight
                ctx.fillStyle = '#e8d0a0';
                ctx.fillRect(x+4, y+2, 8, 2);
                ctx.fillRect(x+20, y+2, 6, 2);
                break;
            }
            case 'darkfloor': {
                ctx.fillStyle = '#282828';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#343434';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#404040';
                ctx.fillRect(x+2, y+2, s-4, s-4);
                // Stone slab pattern
                ctx.fillStyle = '#333333';
                ctx.fillRect(x, y+15, s, 2);
                ctx.fillRect(x+15, y, 2, s);
                // Subtle highlights
                ctx.fillStyle = '#4a4a4a';
                ctx.fillRect(x+3, y+3, 8, 2);
                ctx.fillRect(x+19, y+3, 8, 2);
                ctx.fillRect(x+3, y+19, 8, 2);
                ctx.fillRect(x+19, y+19, 8, 2);
                // Scuff marks
                ctx.fillStyle = '#383838';
                ctx.fillRect(x+8, y+8, 3, 2);
                ctx.fillRect(x+20, y+24, 4, 2);
                break;
            }

            // ── Wall tile details ──

            case 'museumwall': {
                ctx.fillStyle = '#5a2000';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#6e2c00';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                // Large stone blocks
                ctx.fillStyle = '#7a3800';
                ctx.fillRect(x+2, y+2, 13, 13);
                ctx.fillRect(x+17, y+2, 13, 13);
                ctx.fillRect(x+2, y+17, 13, 13);
                ctx.fillRect(x+17, y+17, 13, 13);
                // Mortar lines
                ctx.fillStyle = '#4a1c00';
                ctx.fillRect(x+15, y, 2, s);
                ctx.fillRect(x, y+15, s, 2);
                // Highlight
                ctx.fillStyle = '#8a4810';
                ctx.fillRect(x+3, y+3, 10, 2);
                ctx.fillRect(x+18, y+3, 10, 2);
                break;
            }
            case 'darkbrick': {
                ctx.fillStyle = '#0e1518';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#1c2833';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                // Brick pattern
                ctx.fillStyle = '#243340';
                ctx.fillRect(x+2, y+2, 12, 6);
                ctx.fillRect(x+18, y+2, 12, 6);
                ctx.fillRect(x+9, y+10, 12, 6);
                ctx.fillRect(x+2, y+18, 12, 6);
                ctx.fillRect(x+18, y+18, 12, 6);
                ctx.fillRect(x+9, y+26, 12, 6);
                // Mortar
                ctx.fillStyle = '#141e28';
                ctx.fillRect(x, y+8, s, 2);
                ctx.fillRect(x, y+16, s, 2);
                ctx.fillRect(x, y+24, s, 2);
                ctx.fillRect(x+14, y, 2, 8);
                ctx.fillRect(x+8, y+10, 2, 6);
                ctx.fillRect(x+14, y+18, 2, 6);
                ctx.fillRect(x+8, y+26, 2, 6);
                break;
            }
            case 'terracotta': {
                ctx.fillStyle = '#c88040';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#e0a060';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#fad7a0';
                ctx.fillRect(x+2, y+2, s-4, s-4);
                // Terracotta tile pattern
                ctx.fillStyle = '#e0a060';
                ctx.fillRect(x+15, y, 2, s);
                ctx.fillRect(x, y+15, s, 2);
                // Warm highlights
                ctx.fillStyle = '#ffe4c0';
                ctx.fillRect(x+3, y+3, 8, 2);
                ctx.fillRect(x+19, y+3, 8, 2);
                // Aged spots
                ctx.fillStyle = '#d09050';
                ctx.fillRect(x+6, y+8, 4, 3);
                ctx.fillRect(x+22, y+22, 3, 3);
                break;
            }
            case 'pinkwall': {
                ctx.fillStyle = '#c09090';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#d8a0a0';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#f5b7b1';
                ctx.fillRect(x+2, y+2, s-4, s-4);
                // Plaster texture
                ctx.fillStyle = '#e8a8a0';
                ctx.fillRect(x+4, y+6, 8, 4);
                ctx.fillRect(x+18, y+14, 10, 4);
                ctx.fillRect(x+6, y+24, 6, 4);
                // Highlight wash
                ctx.fillStyle = '#ffd0c8';
                ctx.fillRect(x+3, y+3, 12, 2);
                ctx.fillRect(x+18, y+3, 8, 2);
                break;
            }
            case 'sandstone': {
                ctx.fillStyle = '#c89860';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#e0b080';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#f0b27a';
                ctx.fillRect(x+2, y+2, s-4, s-4);
                // Block courses
                ctx.fillStyle = '#d8a068';
                ctx.fillRect(x, y+10, s, 2);
                ctx.fillRect(x, y+22, s, 2);
                ctx.fillRect(x+16, y, 2, 10);
                ctx.fillRect(x+10, y+12, 2, 10);
                ctx.fillRect(x+22, y+24, 2, 8);
                // Weathering
                ctx.fillStyle = '#c89860';
                ctx.fillRect(x+4, y+4, 5, 3);
                ctx.fillRect(x+20, y+14, 4, 3);
                // Highlight
                ctx.fillStyle = '#fcc890';
                ctx.fillRect(x+3, y+2, 10, 2);
                ctx.fillRect(x+18, y+13, 8, 2);
                break;
            }
            case 'lightclay': {
                ctx.fillStyle = '#d8a880';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#e8c0a0';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#f5cba7';
                ctx.fillRect(x+2, y+2, s-4, s-4);
                // Subtle cracks
                ctx.fillStyle = '#e0b090';
                ctx.fillRect(x+6, y+4, 1, 8);
                ctx.fillRect(x+20, y+12, 1, 10);
                ctx.fillRect(x+12, y+22, 8, 1);
                // Texture spots
                ctx.fillStyle = '#ddb898';
                ctx.fillRect(x+10, y+8, 4, 3);
                ctx.fillRect(x+22, y+20, 3, 4);
                // Highlight
                ctx.fillStyle = '#fde0c4';
                ctx.fillRect(x+3, y+2, 12, 2);
                break;
            }
            case 'ancientstone': {
                ctx.fillStyle = '#b8a0c0';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#c8b0d0';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#d7bde2';
                ctx.fillRect(x+2, y+2, s-4, s-4);
                // Weathered cracks
                ctx.fillStyle = '#c0a8c8';
                ctx.fillRect(x+8, y+3, 1, 12);
                ctx.fillRect(x+4, y+18, 10, 1);
                ctx.fillRect(x+22, y+10, 1, 14);
                // Erosion pits
                ctx.fillStyle = '#b098b8';
                ctx.fillRect(x+14, y+6, 4, 3);
                ctx.fillRect(x+6, y+22, 3, 3);
                ctx.fillRect(x+24, y+24, 3, 3);
                // Lichen spot
                ctx.fillStyle = '#a0c8a0';
                ctx.fillRect(x+18, y+18, 3, 2);
                break;
            }

            // ── Decor tile details ──

            case 'awning': {
                ctx.fillStyle = '#801a15';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#a93226';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                // Striped awning
                ctx.fillStyle = '#c43e32';
                ctx.fillRect(x+2, y+2, 6, s-4);
                ctx.fillRect(x+12, y+2, 6, s-4);
                ctx.fillRect(x+22, y+2, 6, s-4);
                // Scalloped bottom edge
                ctx.fillStyle = '#801a15';
                ctx.fillRect(x+2, y+s-4, 4, 2);
                ctx.fillRect(x+10, y+s-4, 4, 2);
                ctx.fillRect(x+18, y+s-4, 4, 2);
                ctx.fillRect(x+26, y+s-4, 4, 2);
                // Shadow under edge
                ctx.fillStyle = '#601210';
                ctx.fillRect(x, y+s-2, s, 2);
                break;
            }
            case 'window': {
                ctx.fillStyle = '#a0a8b0';
                ctx.fillRect(x, y, s, s);
                // Window frame
                ctx.fillStyle = '#b8c0c8';
                ctx.fillRect(x+2, y+2, s-4, s-4);
                // Glass panes
                ctx.fillStyle = '#88b8e0';
                ctx.fillRect(x+4, y+4, 10, 10);
                ctx.fillRect(x+18, y+4, 10, 10);
                ctx.fillRect(x+4, y+18, 10, 10);
                ctx.fillRect(x+18, y+18, 10, 10);
                // Dividers
                ctx.fillStyle = '#d5d8dc';
                ctx.fillRect(x+15, y+2, 2, s-4);
                ctx.fillRect(x+2, y+15, s-4, 2);
                // Glass reflection
                ctx.fillStyle = '#a8d8f0';
                ctx.fillRect(x+5, y+5, 4, 3);
                ctx.fillRect(x+19, y+5, 4, 3);
                break;
            }
            case 'fence': {
                ctx.fillStyle = '#3a2818';
                ctx.fillRect(x, y, s, s);
                // Background (transparent-ish ground)
                ctx.fillStyle = '#4a8c3f';
                ctx.fillRect(x, y, s, s);
                // Fence posts
                ctx.fillStyle = '#3a2818';
                ctx.fillRect(x+3, y+4, 4, 24);
                ctx.fillRect(x+25, y+4, 4, 24);
                // Post detail
                ctx.fillStyle = '#5d4e37';
                ctx.fillRect(x+4, y+5, 2, 22);
                ctx.fillRect(x+26, y+5, 2, 22);
                // Horizontal rails
                ctx.fillStyle = '#4a3828';
                ctx.fillRect(x+2, y+10, 28, 3);
                ctx.fillRect(x+2, y+20, 28, 3);
                ctx.fillStyle = '#5d4e37';
                ctx.fillRect(x+2, y+11, 28, 1);
                ctx.fillRect(x+2, y+21, 28, 1);
                // Post caps
                ctx.fillStyle = '#5d4e37';
                ctx.fillRect(x+2, y+3, 6, 2);
                ctx.fillRect(x+24, y+3, 6, 2);
                break;
            }
            case 'purpledoor': {
                ctx.fillStyle = '#301840';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#4a235a';
                ctx.fillRect(x+2, y+1, s-4, s-1);
                // Door panels
                ctx.fillStyle = '#5a2d6a';
                ctx.fillRect(x+4, y+4, 10, 12);
                ctx.fillRect(x+18, y+4, 10, 12);
                ctx.fillRect(x+4, y+20, 24, 10);
                // Panel highlights
                ctx.fillStyle = '#6a3d7a';
                ctx.fillRect(x+5, y+5, 8, 2);
                ctx.fillRect(x+19, y+5, 8, 2);
                // Door handle
                ctx.fillStyle = '#d4ac0d';
                ctx.fillRect(x+22, y+16, 3, 3);
                // Arch top
                ctx.fillStyle = '#3a1848';
                ctx.fillRect(x+4, y+1, 24, 2);
                break;
            }
            case 'vine': {
                ctx.fillStyle = '#2a7a2a';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#b8d8b0';
                ctx.fillRect(x, y, s, s);
                // Vine stems
                ctx.fillStyle = '#3a8a30';
                ctx.fillRect(x+6, y, 2, s);
                ctx.fillRect(x+18, y+4, 2, s-4);
                ctx.fillRect(x+12, y+8, 6, 2);
                // Leaves
                ctx.fillStyle = '#4aaa40';
                ctx.fillRect(x+3, y+4, 4, 3);
                ctx.fillRect(x+8, y+10, 4, 3);
                ctx.fillRect(x+3, y+18, 4, 3);
                ctx.fillRect(x+8, y+24, 4, 3);
                ctx.fillRect(x+16, y+6, 4, 3);
                ctx.fillRect(x+20, y+14, 4, 3);
                ctx.fillRect(x+16, y+22, 4, 3);
                ctx.fillRect(x+22, y+28, 4, 3);
                // Leaf highlights
                ctx.fillStyle = '#6aca60';
                ctx.fillRect(x+4, y+5, 2, 1);
                ctx.fillRect(x+9, y+11, 2, 1);
                ctx.fillRect(x+17, y+7, 2, 1);
                ctx.fillRect(x+21, y+15, 2, 1);
                break;
            }
            case 'marketstall': {
                ctx.fillStyle = '#7a4a10';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#af601a';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                // Canopy
                ctx.fillStyle = '#c87020';
                ctx.fillRect(x+2, y+2, s-4, 10);
                // Canopy stripes
                ctx.fillStyle = '#e08830';
                ctx.fillRect(x+4, y+3, 6, 8);
                ctx.fillRect(x+14, y+3, 6, 8);
                ctx.fillRect(x+24, y+3, 4, 8);
                // Counter
                ctx.fillStyle = '#8B7355';
                ctx.fillRect(x+2, y+14, s-4, 4);
                ctx.fillStyle = '#a08860';
                ctx.fillRect(x+3, y+15, s-6, 2);
                // Wares on display
                ctx.fillStyle = '#e74c3c';
                ctx.fillRect(x+4, y+20, 4, 4);
                ctx.fillStyle = '#f39c12';
                ctx.fillRect(x+10, y+20, 4, 4);
                ctx.fillStyle = '#2ecc71';
                ctx.fillRect(x+16, y+20, 4, 4);
                ctx.fillStyle = '#3498db';
                ctx.fillRect(x+22, y+20, 4, 4);
                break;
            }
            case 'fabric': {
                ctx.fillStyle = '#5a2080';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#7d3c98';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                // Woven pattern
                ctx.fillStyle = '#9050b0';
                ctx.fillRect(x+3, y+3, 4, 4);
                ctx.fillRect(x+11, y+3, 4, 4);
                ctx.fillRect(x+19, y+3, 4, 4);
                ctx.fillRect(x+7, y+11, 4, 4);
                ctx.fillRect(x+15, y+11, 4, 4);
                ctx.fillRect(x+23, y+11, 4, 4);
                ctx.fillRect(x+3, y+19, 4, 4);
                ctx.fillRect(x+11, y+19, 4, 4);
                ctx.fillRect(x+19, y+19, 4, 4);
                ctx.fillRect(x+7, y+27, 4, 4);
                ctx.fillRect(x+15, y+27, 4, 4);
                // Gold thread accents
                ctx.fillStyle = '#d4ac0d';
                ctx.fillRect(x+5, y+5, 2, 2);
                ctx.fillRect(x+13, y+5, 2, 2);
                ctx.fillRect(x+21, y+5, 2, 2);
                ctx.fillRect(x+9, y+13, 2, 2);
                ctx.fillRect(x+17, y+13, 2, 2);
                ctx.fillRect(x+5, y+21, 2, 2);
                ctx.fillRect(x+13, y+21, 2, 2);
                ctx.fillRect(x+21, y+21, 2, 2);
                break;
            }
            case 'darkarch': {
                ctx.fillStyle = '#1a2830';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#2e4053';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                // Arch shape
                ctx.fillStyle = '#1a2830';
                ctx.fillRect(x+4, y+2, 24, 4);
                ctx.fillRect(x+2, y+6, 4, 24);
                ctx.fillRect(x+26, y+6, 4, 24);
                // Keystone
                ctx.fillStyle = '#4a6070';
                ctx.fillRect(x+14, y+2, 4, 4);
                // Inner opening
                ctx.fillStyle = '#0e1820';
                ctx.fillRect(x+8, y+8, 16, 22);
                // Depth shading
                ctx.fillStyle = '#182830';
                ctx.fillRect(x+8, y+8, 16, 4);
                break;
            }

            // ── City-specific ground details ──

            case 'greenpark': {
                ctx.fillStyle = '#084838';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#0a5840';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#0e6655';
                ctx.fillRect(x+2, y+2, s-4, s-4);
                // Lush grass tufts
                ctx.fillStyle = '#0a5840';
                ctx.fillRect(x+4, y+6, 6, 6);
                ctx.fillRect(x+18, y+4, 8, 5);
                ctx.fillRect(x+8, y+20, 6, 6);
                ctx.fillRect(x+22, y+22, 6, 5);
                // Darker clumps
                ctx.fillStyle = '#084838';
                ctx.fillRect(x+5, y+7, 4, 4);
                ctx.fillRect(x+19, y+5, 6, 3);
                // Daisies
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(x+14, y+10, 2, 2);
                ctx.fillRect(x+26, y+16, 2, 2);
                ctx.fillStyle = '#ffdd44';
                ctx.fillRect(x+14, y+10, 1, 1);
                ctx.fillRect(x+26, y+16, 1, 1);
                break;
            }
            case 'pavement': {
                ctx.fillStyle = '#585860';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#686870';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#717d7e';
                ctx.fillRect(x+2, y+2, s-4, s-4);
                // Paving slabs
                ctx.fillStyle = '#626870';
                ctx.fillRect(x+15, y, 2, s);
                ctx.fillRect(x, y+15, s, 2);
                // Worn edges
                ctx.fillStyle = '#808888';
                ctx.fillRect(x+3, y+3, 8, 2);
                ctx.fillRect(x+19, y+3, 8, 2);
                // Gum spots
                ctx.fillStyle = '#606068';
                ctx.fillRect(x+8, y+8, 2, 2);
                ctx.fillRect(x+22, y+22, 2, 2);
                break;
            }
            case 'warmstone': {
                ctx.fillStyle = '#d8c080';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#e8d098';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#f9e79f';
                ctx.fillRect(x+2, y+2, s-4, s-4);
                // Sun-baked texture
                ctx.fillStyle = '#e8d098';
                ctx.fillRect(x+4, y+6, 10, 2);
                ctx.fillRect(x+18, y+14, 8, 2);
                ctx.fillRect(x+6, y+24, 12, 2);
                // Warm glow spots
                ctx.fillStyle = '#fff0b0';
                ctx.fillRect(x+10, y+4, 4, 2);
                ctx.fillRect(x+22, y+10, 4, 2);
                ctx.fillRect(x+8, y+20, 4, 2);
                // Subtle crack
                ctx.fillStyle = '#d0c080';
                ctx.fillRect(x+20, y+3, 1, 10);
                break;
            }
            case 'templefloor': {
                ctx.fillStyle = '#c8b8d0';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#d8c8e0';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#e8daef';
                ctx.fillRect(x+2, y+2, s-4, s-4);
                // Marble veins
                ctx.fillStyle = '#d0c0d8';
                ctx.fillRect(x+4, y+8, 12, 1);
                ctx.fillRect(x+10, y+4, 1, 10);
                ctx.fillRect(x+18, y+16, 10, 1);
                ctx.fillRect(x+22, y+12, 1, 12);
                // Tile border
                ctx.fillStyle = '#c8b8d0';
                ctx.fillRect(x+14, y, 2, s);
                ctx.fillRect(x, y+14, s, 2);
                // Polish highlights
                ctx.fillStyle = '#f0e8f4';
                ctx.fillRect(x+6, y+4, 6, 2);
                ctx.fillRect(x+20, y+18, 6, 2);
                break;
            }
            case 'redclay': {
                ctx.fillStyle = '#c07848';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#d48858';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#e59866';
                ctx.fillRect(x+2, y+2, s-4, s-4);
                // Sun-dried cracks
                ctx.fillStyle = '#d08050';
                ctx.fillRect(x+8, y+2, 1, 14);
                ctx.fillRect(x+22, y+10, 1, 16);
                ctx.fillRect(x+4, y+20, 14, 1);
                // Texture spots
                ctx.fillStyle = '#c87848';
                ctx.fillRect(x+14, y+6, 5, 4);
                ctx.fillRect(x+4, y+24, 4, 3);
                // Highlight
                ctx.fillStyle = '#f0a878';
                ctx.fillRect(x+4, y+4, 8, 2);
                ctx.fillRect(x+18, y+18, 6, 2);
                break;
            }
            case 'jade': {
                ctx.fillStyle = '#78c0a8';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#90d0b8';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#a3e4d7';
                ctx.fillRect(x+2, y+2, s-4, s-4);
                // Zen raked gravel lines
                ctx.fillStyle = '#90d0b8';
                ctx.fillRect(x+3, y+6, s-6, 1);
                ctx.fillRect(x+3, y+12, s-6, 1);
                ctx.fillRect(x+3, y+18, s-6, 1);
                ctx.fillRect(x+3, y+24, s-6, 1);
                // Stone accent
                ctx.fillStyle = '#80b8a0';
                ctx.fillRect(x+12, y+10, 6, 5);
                ctx.fillStyle = '#70a890';
                ctx.fillRect(x+13, y+11, 4, 3);
                // Highlight
                ctx.fillStyle = '#b8f0e0';
                ctx.fillRect(x+4, y+3, 6, 2);
                break;
            }
            case 'slate': {
                ctx.fillStyle = '#485058';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#586068';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#5d6d7e';
                ctx.fillRect(x+2, y+2, s-4, s-4);
                // Slate layers
                ctx.fillStyle = '#506070';
                ctx.fillRect(x+2, y+7, s-4, 2);
                ctx.fillRect(x+2, y+15, s-4, 2);
                ctx.fillRect(x+2, y+23, s-4, 2);
                // Fracture lines
                ctx.fillStyle = '#485868';
                ctx.fillRect(x+10, y+2, 1, 6);
                ctx.fillRect(x+20, y+10, 1, 6);
                ctx.fillRect(x+8, y+18, 1, 6);
                // Highlight
                ctx.fillStyle = '#708898';
                ctx.fillRect(x+4, y+3, 8, 2);
                ctx.fillRect(x+16, y+11, 8, 2);
                ctx.fillRect(x+6, y+19, 8, 2);
                break;
            }
            case 'lightpurple': {
                ctx.fillStyle = '#c0b0d0';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#d0c0e0';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#e8daef';
                ctx.fillRect(x+2, y+2, s-4, s-4);
                // Shoji screen pattern
                ctx.fillStyle = '#d0c0d8';
                ctx.fillRect(x+10, y, 2, s);
                ctx.fillRect(x+20, y, 2, s);
                ctx.fillRect(x, y+10, s, 2);
                ctx.fillRect(x, y+20, s, 2);
                // Panel highlights
                ctx.fillStyle = '#f0e4f8';
                ctx.fillRect(x+3, y+3, 5, 5);
                ctx.fillRect(x+23, y+23, 5, 5);
                break;
            }
            case 'lightblue': {
                ctx.fillStyle = '#88b8d0';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#98c8e0';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#aed6f1';
                ctx.fillRect(x+2, y+2, s-4, s-4);
                // Tile grid pattern
                ctx.fillStyle = '#98c0d8';
                ctx.fillRect(x+15, y, 2, s);
                ctx.fillRect(x, y+15, s, 2);
                // Highlight
                ctx.fillStyle = '#c0e8ff';
                ctx.fillRect(x+4, y+4, 6, 2);
                ctx.fillRect(x+20, y+20, 6, 2);
                // Subtle pattern
                ctx.fillStyle = '#a0c8e0';
                ctx.fillRect(x+8, y+8, 4, 4);
                ctx.fillRect(x+22, y+8, 4, 4);
                break;
            }
            case 'fountainwater': {
                ctx.fillStyle = '#5898c0';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#70b0d8';
                ctx.fillRect(x+1, y+1, s-2, s-2);
                ctx.fillStyle = '#85c1e9';
                ctx.fillRect(x+2, y+2, s-4, s-4);
                // Ripple rings
                ctx.fillStyle = '#70b0d8';
                ctx.fillRect(x+8, y+8, 16, 16);
                ctx.fillStyle = '#85c1e9';
                ctx.fillRect(x+10, y+10, 12, 12);
                ctx.fillStyle = '#98d0f0';
                ctx.fillRect(x+12, y+12, 8, 8);
                // Sparkle
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(x+14, y+14, 3, 3);
                ctx.fillRect(x+6, y+6, 2, 2);
                ctx.fillRect(x+24, y+10, 2, 2);
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

        // Leaf particle (Paris) - 6x8
        canvas = textures.createCanvas('particle_leaf', 6, 8);
        ctx = canvas.getContext();
        ctx.fillStyle = '#2a6020';
        ctx.fillRect(1, 0, 4, 7);
        ctx.fillRect(0, 2, 6, 4);
        ctx.fillStyle = '#4a9040';
        ctx.fillRect(2, 1, 2, 5);
        ctx.fillRect(1, 3, 4, 2);
        ctx.fillStyle = '#6ab060';
        ctx.fillRect(2, 2, 2, 3);
        canvas.refresh();

        // Rain drop (London) - 2x6
        canvas = textures.createCanvas('particle_rain', 2, 6);
        ctx = canvas.getContext();
        ctx.fillStyle = '#8899bb';
        ctx.fillRect(0, 0, 2, 6);
        ctx.fillStyle = '#aabbdd';
        ctx.fillRect(0, 0, 1, 4);
        canvas.refresh();

        // Sand wisp (Marrakech) - 6x4
        canvas = textures.createCanvas('particle_sand', 6, 4);
        ctx = canvas.getContext();
        ctx.fillStyle = '#d4b880';
        ctx.fillRect(0, 1, 6, 2);
        ctx.fillStyle = '#e8d4a0';
        ctx.fillRect(1, 1, 4, 2);
        canvas.refresh();

        // Golden mote (Rome) - 4x4
        canvas = textures.createCanvas('particle_golden', 4, 4);
        ctx = canvas.getContext();
        ctx.fillStyle = '#d4a020';
        ctx.fillRect(0, 0, 4, 4);
        ctx.fillStyle = '#f0cc44';
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

    // ─── Travel Assets ──────────────────────────────────────────

    generateTravelAssets() {
        const textures = this.scene.textures;

        // --- Country Flags (48x32) ---

        // France: Blue-White-Red vertical tricolor
        let canvas = textures.createCanvas('flag_france', 48, 32);
        let ctx = canvas.getContext();
        ctx.fillStyle = '#002395';
        ctx.fillRect(0, 0, 16, 32);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(16, 0, 16, 32);
        ctx.fillStyle = '#ed2939';
        ctx.fillRect(32, 0, 16, 32);
        ctx.strokeStyle = '#1a0d00';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, 48, 32);
        canvas.refresh();

        // UK: Simplified Union Jack
        canvas = textures.createCanvas('flag_uk', 48, 32);
        ctx = canvas.getContext();
        ctx.fillStyle = '#012169';
        ctx.fillRect(0, 0, 48, 32);
        // White diagonals
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(48, 32);
        ctx.moveTo(48, 0); ctx.lineTo(0, 32);
        ctx.stroke();
        // Red diagonals (thinner)
        ctx.strokeStyle = '#c8102e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(48, 32);
        ctx.moveTo(48, 0); ctx.lineTo(0, 32);
        ctx.stroke();
        // White cross
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(24, 0); ctx.lineTo(24, 32);
        ctx.moveTo(0, 16); ctx.lineTo(48, 16);
        ctx.stroke();
        // Red cross
        ctx.strokeStyle = '#c8102e';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(24, 0); ctx.lineTo(24, 32);
        ctx.moveTo(0, 16); ctx.lineTo(48, 16);
        ctx.stroke();
        ctx.strokeStyle = '#1a0d00';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, 48, 32);
        canvas.refresh();

        // Italy: Green-White-Red vertical tricolor
        canvas = textures.createCanvas('flag_italy', 48, 32);
        ctx = canvas.getContext();
        ctx.fillStyle = '#008c45';
        ctx.fillRect(0, 0, 16, 32);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(16, 0, 16, 32);
        ctx.fillStyle = '#cd212a';
        ctx.fillRect(32, 0, 16, 32);
        ctx.strokeStyle = '#1a0d00';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, 48, 32);
        canvas.refresh();

        // Morocco: Red with green pentagram star outline
        canvas = textures.createCanvas('flag_morocco', 48, 32);
        ctx = canvas.getContext();
        ctx.fillStyle = '#c1272d';
        ctx.fillRect(0, 0, 48, 32);
        // Green pentagram star outline
        ctx.strokeStyle = '#006233';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const cx = 24, cy = 16, r = 8;
        for (let i = 0; i < 5; i++) {
            const angle = -Math.PI / 2 + (i * 4 * Math.PI) / 5;
            const method = i === 0 ? 'moveTo' : 'lineTo';
            ctx[method](cx + r * Math.cos(angle), cy + r * Math.sin(angle));
        }
        ctx.closePath();
        ctx.stroke();
        ctx.strokeStyle = '#1a0d00';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, 48, 32);
        canvas.refresh();

        // Japan: White with red circle
        canvas = textures.createCanvas('flag_japan', 48, 32);
        ctx = canvas.getContext();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 48, 32);
        ctx.fillStyle = '#bc002d';
        ctx.beginPath();
        ctx.arc(24, 16, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1a0d00';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, 48, 32);
        canvas.refresh();

        // --- Vehicles ---

        // Train: red engine + 2 grey cars (128x48)
        canvas = textures.createCanvas('travel_train', 128, 48);
        ctx = canvas.getContext();
        // Engine (front, right side)
        ctx.fillStyle = '#c0392b';
        ctx.fillRect(88, 8, 36, 24);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(90, 10, 32, 20);
        // Engine nose
        ctx.fillStyle = '#c0392b';
        ctx.fillRect(124, 12, 4, 18);
        // Engine window
        ctx.fillStyle = '#85c1e9';
        ctx.fillRect(108, 12, 12, 8);
        // Smokestack
        ctx.fillStyle = '#333333';
        ctx.fillRect(96, 2, 6, 8);
        // Car 1
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(44, 8, 40, 24);
        ctx.fillStyle = '#95a5a6';
        ctx.fillRect(46, 10, 36, 20);
        // Car 1 windows
        ctx.fillStyle = '#85c1e9';
        ctx.fillRect(50, 12, 8, 8);
        ctx.fillRect(62, 12, 8, 8);
        ctx.fillRect(74, 12, 6, 8);
        // Car 2
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(0, 8, 40, 24);
        ctx.fillStyle = '#95a5a6';
        ctx.fillRect(2, 10, 36, 20);
        // Car 2 windows
        ctx.fillStyle = '#85c1e9';
        ctx.fillRect(6, 12, 8, 8);
        ctx.fillRect(18, 12, 8, 8);
        ctx.fillRect(30, 12, 6, 8);
        // Wheels
        ctx.fillStyle = '#1a1a1a';
        for (const wx of [8, 28, 52, 72, 96, 116]) {
            ctx.fillRect(wx, 32, 6, 6);
        }
        // Coupling
        ctx.fillStyle = '#555555';
        ctx.fillRect(40, 18, 4, 4);
        ctx.fillRect(84, 18, 4, 4);
        // Rail line
        ctx.fillStyle = '#666666';
        ctx.fillRect(0, 38, 128, 2);
        canvas.refresh();

        // Boat: brown hull, white cabin, smokestack (96x48)
        canvas = textures.createCanvas('travel_boat', 96, 48);
        ctx = canvas.getContext();
        // Hull
        ctx.fillStyle = '#5d4037';
        ctx.beginPath();
        ctx.moveTo(4, 24);
        ctx.lineTo(16, 38);
        ctx.lineTo(80, 38);
        ctx.lineTo(92, 24);
        ctx.lineTo(4, 24);
        ctx.fill();
        ctx.fillStyle = '#795548';
        ctx.beginPath();
        ctx.moveTo(6, 24);
        ctx.lineTo(18, 36);
        ctx.lineTo(78, 36);
        ctx.lineTo(90, 24);
        ctx.lineTo(6, 24);
        ctx.fill();
        // Hull stripe
        ctx.fillStyle = '#d32f2f';
        ctx.fillRect(16, 28, 64, 3);
        // Cabin
        ctx.fillStyle = '#eceff1';
        ctx.fillRect(28, 10, 36, 14);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(30, 12, 32, 10);
        // Cabin windows
        ctx.fillStyle = '#85c1e9';
        ctx.fillRect(34, 14, 6, 6);
        ctx.fillRect(44, 14, 6, 6);
        ctx.fillRect(54, 14, 6, 6);
        // Smokestack
        ctx.fillStyle = '#333333';
        ctx.fillRect(38, 2, 6, 10);
        ctx.fillStyle = '#555555';
        ctx.fillRect(36, 2, 10, 3);
        // Water line
        ctx.fillStyle = '#2980b9';
        ctx.fillRect(0, 40, 96, 8);
        // Wave dashes
        ctx.fillStyle = '#3498db';
        for (let wx = 0; wx < 96; wx += 12) {
            ctx.fillRect(wx, 40, 8, 2);
        }
        canvas.refresh();

        // --- Backgrounds (960x180) ---

        // Land background: sky gradient, rolling hills, clouds
        canvas = textures.createCanvas('travel_bg_land', 960, 180);
        ctx = canvas.getContext();
        // Sky gradient (top to bottom)
        ctx.fillStyle = '#87ceeb';
        ctx.fillRect(0, 0, 960, 180);
        ctx.fillStyle = '#a8d8f0';
        ctx.fillRect(0, 60, 960, 120);
        ctx.fillStyle = '#c4e4f5';
        ctx.fillRect(0, 100, 960, 80);
        // Clouds
        ctx.fillStyle = '#ffffff';
        for (const [cx2, cy2, cw] of [[80, 30, 60], [240, 20, 80], [500, 40, 50], [700, 25, 70], [880, 35, 55]]) {
            ctx.fillRect(cx2, cy2, cw, 12);
            ctx.fillRect(cx2 + 10, cy2 - 6, cw - 20, 8);
            ctx.fillRect(cx2 + 5, cy2 + 8, cw - 10, 6);
        }
        // Far hills
        ctx.fillStyle = '#5a9c4f';
        for (let hx = 0; hx < 960; hx += 120) {
            const hh = 20 + Math.sin(hx * 0.01) * 10;
            ctx.fillRect(hx, 130 - hh, 130, hh + 50);
        }
        // Near hills
        ctx.fillStyle = '#4a8c3f';
        for (let hx = 0; hx < 960; hx += 100) {
            const hh = 25 + Math.sin(hx * 0.015 + 1) * 12;
            ctx.fillRect(hx, 145 - hh, 110, hh + 35);
        }
        // Ground
        ctx.fillStyle = '#3a7030';
        ctx.fillRect(0, 155, 960, 25);
        canvas.refresh();

        // Sea background: sky gradient, layered water, wave dashes
        canvas = textures.createCanvas('travel_bg_sea', 960, 180);
        ctx = canvas.getContext();
        // Sky
        ctx.fillStyle = '#87ceeb';
        ctx.fillRect(0, 0, 960, 80);
        ctx.fillStyle = '#a8d8f0';
        ctx.fillRect(0, 50, 960, 30);
        // Horizon line
        ctx.fillStyle = '#6ab0d4';
        ctx.fillRect(0, 78, 960, 4);
        // Water layers
        ctx.fillStyle = '#2980b9';
        ctx.fillRect(0, 82, 960, 98);
        ctx.fillStyle = '#2471a3';
        ctx.fillRect(0, 120, 960, 60);
        ctx.fillStyle = '#1a5276';
        ctx.fillRect(0, 150, 960, 30);
        // Wave dashes
        ctx.fillStyle = '#3498db';
        for (let wy = 85; wy < 175; wy += 15) {
            for (let wx = 0; wx < 960; wx += 24) {
                const offset = (wy % 30 === 0) ? 8 : 0;
                ctx.fillRect(wx + offset, wy, 12, 2);
            }
        }
        // Clouds
        ctx.fillStyle = '#ffffff';
        for (const [cx3, cy3, cw2] of [[100, 20, 50], [350, 15, 70], [600, 30, 45], [850, 18, 60]]) {
            ctx.fillRect(cx3, cy3, cw2, 10);
            ctx.fillRect(cx3 + 8, cy3 - 4, cw2 - 16, 6);
        }
        canvas.refresh();

        // --- Platform and Dock strips (960x60) ---

        // Train platform: grey stone with tile pattern
        canvas = textures.createCanvas('travel_platform', 960, 60);
        ctx = canvas.getContext();
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, 960, 60);
        ctx.fillStyle = '#909090';
        // Tile pattern
        for (let tx = 0; tx < 960; tx += 32) {
            for (let ty = 0; ty < 60; ty += 32) {
                ctx.fillRect(tx + 1, ty + 1, 30, 30);
            }
        }
        // Edge line
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(0, 0, 960, 3);
        // Platform dots
        ctx.fillStyle = '#666666';
        for (let tx = 16; tx < 960; tx += 32) {
            ctx.fillRect(tx - 1, 52, 2, 2);
        }
        canvas.refresh();

        // Dock: brown wood planks
        canvas = textures.createCanvas('travel_dock', 960, 60);
        ctx = canvas.getContext();
        ctx.fillStyle = '#6d4c2a';
        ctx.fillRect(0, 0, 960, 60);
        // Plank lines
        ctx.fillStyle = '#5d3c1a';
        for (let ty = 0; ty < 60; ty += 10) {
            ctx.fillRect(0, ty, 960, 1);
        }
        // Plank vertical gaps
        ctx.fillStyle = '#4d2c10';
        for (let tx = 0; tx < 960; tx += 80) {
            const offset = (Math.floor(tx / 80) % 2) * 40;
            ctx.fillRect(tx + offset, 0, 2, 60);
        }
        // Edge
        ctx.fillStyle = '#8d6c4a';
        ctx.fillRect(0, 0, 960, 2);
        // Rope coils
        ctx.fillStyle = '#a08060';
        for (let tx = 120; tx < 960; tx += 240) {
            ctx.beginPath();
            ctx.arc(tx, 50, 6, 0, Math.PI * 2);
            ctx.fill();
        }
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
