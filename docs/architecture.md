# Architecture — Detailed File Reference

## Entry Points
- `index.html` — Loads Phaser 3 CDN + `src/main.js`, CSS has `canvas { image-rendering: pixelated; }`
- `src/main.js` — Phaser config: 960x720 native, pixelArt:true, roundPixels:true, arcade physics

## Scenes (`src/scenes/`)

### BootScene.js
- `preload()`: Shows "Loading..." text at 36px
- `create()`: Calls `generateAssets()` then creates player animations, transitions to Title
- `generateAssets()`: Creates ALL textures programmatically:
  - Player spritesheet: 4 dirs x 4 frames = 16 frames, 16x16 each
  - 6 NPC spritesheets: `npc_librarian`, `npc_curator`, `npc_merchant`, `npc_guide`, `npc_gardener`, `npc_grandma`
  - Tileset: 8x8 grid = 64 tiles (ground, walls, decor, city-specific)
  - UI assets: `dialog_bg`, `button_bg`, `button_hover`, `inventory_bg`, `interact_icon`, `quest_marker`, `arrow`
  - World map: `world_map_bg` (320x240), `city_dot`, `city_locked`, transport icons
  - Item icons: `item_locket`, `item_letter`, `item_map_fragment`, `item_key`, `item_book`, `item_coin`, `item_gem`, `item_journal`

### TitleScene.js
- Stars background, title text "The Locket of Worlds", locket icon with glow
- New Game / Continue buttons (rectangles, not textures — for crisp rendering at 960x720)
- `startNewGame()`: Resets all registry state, starts ExploreScene with paris
- `continueGame()`: Loads from SaveManager, falls back to new game

### ExploreScene.js (Core Gameplay)
- `init(data)`: Sets `cityId`, `dialogActive`, `menuOpen`, `exitTriggered` flags
- `create()`:
  - Sets camera zoom 3 for pixel art world
  - Builds tilemap from city data (ground, walls with collision, decor layers)
  - Creates Player, NPCs, interactables (chests/signs/portals)
  - Registers keyboard handlers (SPACE/I/Q/M/ESC) with cleanup on shutdown
  - Launches UIScene with city name/description for crisp text display
  - Auto-saves on city entry
- `update()`:
  - Player movement, exit zone debounce check
  - NPC interaction detection + sends screen-space label positions to UIScene via `updateNPCLabels()`
  - Uses `cam.worldView.x/y` for world-to-screen coordinate conversion
- Key methods: `handleInteract()`, `startNPCDialog()`, `openChest()`, `readSign()`, `usePortal()`, `openWorldMap()`, `travelToCity()`
- Exit zone at south edge (tiles 13-15) triggers world map

### WorldMapScene.js
- `MAP_SCALE = 3` constant for converting 320x240 coords to 960x720
- Background: `world_map_bg` texture at setScale(3)
- City dots at `CITY_MAP_POSITIONS[city] * MAP_SCALE`, scaled 3x
- Route lines drawn as dotted lines between unlocked cities (color-coded by type)
- Travel animation: dot moves along route, trailing line follows
- `selectCity()`: Validates `requiresFlag` for locked routes (e.g., portal)
- ESC listener with cleanup on shutdown

### UIScene.js (HUD Overlay)
- All positions/sizes at 960x720 scale (font sizes: 18-42px)
- `init()`: Stores managers, initializes `npcLabelPool = []` (must be in init, not create, for timing)
- `create()`: HUD bar, dialog box, choice menu, inventory panel, quest log, notifications, city name display
- `showCityName(name, description)`: Called from own `create()`, not from ExploreScene (timing safety)
- `updateNPCLabels(labels)`: Object pool of text labels, positioned at screen coordinates from ExploreScene
- `showDialog/updateDialogText/hideDialog`: Called by DialogManager via `scene.get('UI')`
- `showChoices()`: Dynamic choice buttons for portal destinations etc.
- `showNotification()`: Fade-in/out notification text (e.g., "New destination: London!")

## Entities (`src/entities/`)

### Player.js
- Extends `Phaser.Physics.Arcade.Sprite`, 16x16, speed 60
- WASD + arrow key movement, 4-direction walking animations
- Diagonal movement normalized (x 0.707)
- Stops on `dialogActive` or `menuOpen`
- `getFacingPoint(distance)`: Returns point 16px in front of player for interaction checks

### NPC.js
- Extends `Phaser.Physics.Arcade.Sprite`, static body, 16x16
- Uses `npcData` property (NOT `data`) to store NPC definition
- `quest_marker` indicator (!) shown when interactable — pixel art, rendered in ExploreScene
- Name labels rendered in UIScene for crisp text (removed from NPC.js)
- Idle animation: alternates between frames 0 and 1 every 800ms

## Systems (`src/systems/`)

### DialogManager.js
- Typewriter effect at 25ms/char, advance() skips or moves to next line
- 100ms cooldown between advances to prevent rapid-fire skipping
- `endDialog()`: Processes rewards — `givesItem`, `setsFlag`, `unlocksCity`, `unlocksPortal`, `completesObjective`
- `showChoice()`: Delegates to UIScene.showChoices() for portal destinations

### QuestManager.js
- `getNPCDialogId(npcId)`: Iterates `NPC_DIALOG_ROUTES[npcId]` in order, returns first matching dialog
- `getChestReward(chestId)`: Returns item if `requiresFlag` is met
- `getActiveQuests()`: Returns quests with visible objectives (based on completed prerequisites)
- `completeObjective(id)`: Marks objective as done, checks for quest completion
- `onEnterCity()`: Triggers city-entry quest events
- `checkQuestCompletion()`: Sets `game_complete` flag when all objectives done

### TravelManager.js
- `TRAVEL_ROUTES`: Defines city-to-city routes with type (train/boat/portal), duration, optional `requiresFlag`
- `CITY_MAP_POSITIONS`: City coordinates at 320x240 scale (multiplied by MAP_SCALE at render time)
- Routes are bidirectional (A-to-B and B-to-A both defined)
- `getAvailableDestinations()`: Filters by unlocked cities AND flag requirements
- `getRoute()`: Returns raw route (caller validates flags)

### InventoryManager.js
- Add/remove/has/get items, prevents duplicates by ID
- Persists to registry on every change

### SaveManager.js
- Static class, saves/loads to `localStorage` key `questgame_save`
- Saves: currentCity, inventory, questState, unlockedCities, visitedCities, flags, openedChests
- `load()` validates: must be valid JSON, must be object, must have `currentCity`

## Data (`src/data/`)

### cities.js
- 5 cities: paris (30x25), london (30x25), rome (30x20), marrakech (30x20), tokyo (30x20)
- Each city: `{ name, description, width, height, ground[][], walls[][], decor[][], playerStart: {x,y} }`
- Ground tiles: 0=cobblestone, 1=grass, 2=water, 3=sand, etc.
- Wall tiles: -1=walkable, 0-63=collision
- Decor tiles: -1=none, 20=chest, 21=portal, 22=sign, 23=door
- Water rows (Seine/Thames) have BOTH ground tile 2 AND wall tile 2 for collision, with bridge gaps

### npcs.js
- `NPC_DATA[cityId]`: Array of NPC definitions per city
- Each NPC: `{ id, name, x, y, sprite, defaultDialog, requiresFlag? }`
- 3 NPCs per city, 15 total

### quests.js
- `QUEST_DATA`: Single main quest "The Locket of Worlds" with 8 chained objectives
- `NPC_DIALOG_ROUTES`: Maps npcId to ordered array of `{ condition, dialogId }`
  - Conditions checked in order, first match wins
  - Empty condition `{}` = catch-all fallback (usually first or last entry)
- `CHEST_REWARDS`: Maps chestId to `{ item, requiresFlag, unlocksCity?, completesObjective? }`

### dialogues.js
- `DIALOGUES[dialogId]`: `{ lines: string[], givesItem?, setsFlag?, unlocksCity?, unlocksPortal?, completesObjective? }`
- ~30 dialog entries across all NPCs and quest stages

## Tests

### tests/test_systems.mjs (168 unit tests)
- All `await import()` at top level (NOT inside describe/it callbacks)
- localStorage mock (`_localStorage`) defined before imports
- Covers: dialog data integrity, NPC routing, quest chain, chest rewards, city maps, NPC placement, travel routes, InventoryManager, SaveManager, DialogManager, QuestManager, TravelManager, full playthrough, water collision, travel flags, menu guards, NPC sprites, dialog rewards, city connections, portal tiles

### test_game.mjs (24 Playwright integration tests)
- Requires http-server running on port 8080
- Tests full game flow: boot, title, explore, interact, dialog, quest, worldmap, travel, london
- Checks: canvas 960x720, textures, animations, movement, NPC interaction, inventory, quest log, save/load, no JS errors
