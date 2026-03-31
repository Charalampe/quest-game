# Architecture — Detailed File Reference

## Entry Points
- `index.html` — Loads Phaser 3 CDN + `src/main.js`, CSS has `canvas { image-rendering: pixelated; }`
- `src/main.js` — Phaser config: 960x720 native, pixelArt:true, roundPixels:true, arcade physics
- `src/constants.js` — TILE_W=32, TILE_H=32, SPRITE_W=32, SPRITE_H=48, EXPLORE_ZOOM=2

## Scenes (`src/scenes/`)

### BootScene.js (~30 lines, thin orchestrator)
- `init()`: Creates `MangaSpriteProvider(this)` — must be in init, not constructor
- `preload()`: Shows "Loading..." text, calls `provider.loadSpriteSheets()` for external PNGs
- `create()`: Calls `provider.generateTextures()` + `provider.createAnimations()`, transitions to Title
- All asset generation logic lives in `src/assets/MangaSpriteProvider.js` (strategy pattern)
- To swap rendering backends, change the single import in BootScene

## Asset System (`src/assets/`)

### AssetProvider.js (base class)
- Strategy interface: `loadSpriteSheets()`, `generateTextures()`, `createAnimations()`, `getNPCTypeNames()`
- Receives Phaser scene via constructor

### MangaSpriteProvider.js (~2270 lines, active provider)
- Extends AssetProvider, generates 32x32 manga-style tiles with cel-shading and bold outlines
- Uses `this.scene.textures` / `this.scene.anims` (not a Scene itself)
- Player spritesheet: 4 dirs × 4 frames = 16 frames, 32x48 each
- 29 NPC spritesheets: `npc_librarian`, `npc_curator`, etc.
- Tileset: 8-col × 10-row = 66 tiles (64 + 2 water variants), all at 32x32
- External PIPOYA sprite support via `loadSpriteSheets()` and `_remapExternalSprite()`
- PIPOYA 3-frame → 4-frame remapping: [0,1,0,2] (stand/step1/stand/step2)
- Graceful fallback: if PNGs fail to load, procedural manga drawing is used
- `spirit_fox` and `ghost` always use procedural rendering (no `file` field in NPC_DEFS)
- Loader event listeners cleaned up via `loader.once('complete', ...)` handler
- Item icons: 32x32. World map: 320x240 (unchanged, scaled by MAP_SCALE at render time)

### ProceduralAssetProvider.js (~1370 lines, reference/fallback)
- Original 16x16 provider, kept for reference — not imported by BootScene

### npcDefinitions.js / itemDefinitions.js / tileDefinitions.js
- Pure data arrays used by both providers
- NPC_DEFS entries have optional `file` field for external PIPOYA sprite filename

### TitleScene.js
- Stars background, title text "The Locket of Worlds", locket icon with glow
- Locket scale = 3 (32px × 3 = 96px on screen)
- New Game / Continue buttons (rectangles, not textures — for crisp rendering at 960x720)
- `startNewGame()`: Resets all registry state, starts ExploreScene with paris
- `continueGame()`: Loads from SaveManager, falls back to new game

### ExploreScene.js (Core Gameplay)
- Imports TILE_W, TILE_H, EXPLORE_ZOOM from constants.js — no hardcoded tile sizes
- `init(data)`: Sets `cityId`, `roomId`, `spawnAt`, `dialogActive`, `menuOpen`, `exitTriggered`
- `create()`:
  - Camera zoom = EXPLORE_ZOOM (2), bounds = roomData.width * TILE_W
  - Builds tilemap at TILE_W × TILE_H resolution
  - Player spawn: `spawn.x * TILE_W + TILE_W/2` (centers in tile)
  - NPCs positioned: `npcData.x * TILE_W + TILE_W/2`
  - Interactables (chests/signs/portals/doors) at tile centers
  - Registers keyboard handlers (SPACE/I/Q/M/ESC) with cleanup on shutdown
  - Exit zone: 3 tiles wide at south map edge, in pixel coordinates
- `update()`:
  - Player movement, water tile animation, exit zone debounce
  - NPC interaction detection: `getFacingPoint(24)`, threshold `dist < 32`
  - Sends screen-space NPC label positions to UIScene via `updateNPCLabels()`
- Key methods: `handleInteract()`, `startNPCDialog()`, `openChest()`, `readSign()`, `usePortal()`, `enterDoor()`, `openWorldMap()`

### WorldMapScene.js
- `MAP_SCALE = 3` for converting 320x240 coords to 960x720
- Background: `world_map_bg` at setScale(3)
- City dots at `CITY_MAP_POSITIONS[city] * MAP_SCALE`
- ESC listener with cleanup on shutdown

### UIScene.js (HUD Overlay)
- All at 960x720 scale (zoom 1), font sizes 18-42px
- `init()`: Stores managers, initializes `npcLabelPool = []`
- Dialog box, choice menu, inventory panel, quest log, notifications, city name display

## Entities (`src/entities/`)

### Player.js
- Extends `Phaser.Physics.Arcade.Sprite`, body 20x20, offset(6,28), speed 90
- WASD + arrow key movement, 4-direction walking animations
- Diagonal movement normalized (× 0.707)
- Stops on `dialogActive` or `menuOpen`
- `getFacingPoint(distance=32)`: Point ahead of player for interaction checks

### NPC.js
- Extends `Phaser.Physics.Arcade.Sprite`, static body 24x24, offset(4,24)
- Uses `npcData` property (NOT `data`)
- `quest_marker` indicator 40px above sprite, with bob tween
- Idle animation: cycles through 4 frames every 600ms
- Name labels rendered in UIScene for crisp text

## Systems (`src/systems/`)

### DialogManager.js
- Typewriter effect, advance() skips or moves to next line
- `endDialog()`: Processes rewards — givesItem, setsFlag, unlocksCity, etc.

### QuestManager.js
- `getNPCDialogId(npcId)`: First matching dialog from NPC_DIALOG_ROUTES
- `getChestReward(chestId)`: Returns item if flag is met
- `completeObjective()`: Marks done, checks quest completion

### TravelManager.js
- `TRAVEL_ROUTES`, `CITY_MAP_POSITIONS` at 320x240 scale
- Bidirectional routes with type/duration/requiresFlag

### InventoryManager.js / SaveManager.js
- Add/remove items, save/load to localStorage

## Data (`src/data/`)

### cities.js
- 5 cities (50x40 main rooms) + 15 sub-rooms = 20 rooms total
- `ROOM_TRANSITIONS`: doorId → targetCity/targetRoom/spawnAt
- Tile indices: 0=cobble, 1=grass, 2=water, 20=chest, 21=portal, 22=sign, 23=door

### npcs.js / quests.js / dialogues.js / i18n/
- 40 NPCs, 1 main quest with 8 objectives, ~30 dialogs, EN/FR translations

## Tests

### tests/test_systems.mjs (336 unit tests)
- Covers: data integrity, quest chain, collision, room transitions, sprite bounds,
  controls, dialog guards, water animation, exit zones, spawn positions,
  32x32 constants, tile math, collision body consistency, interaction distances,
  source correctness (ExploreScene, BootScene, Player, NPC, TitleScene, MangaSpriteProvider),
  NPC definitions with external sprite fields, integration test coordinates

### test_game.mjs (24 Playwright integration tests)
- Requires http-server on port 8080
- Tests full game flow with 32px tile coordinates
