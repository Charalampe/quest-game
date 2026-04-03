# Quest Game - Project Memory

## Architecture
- Phaser 3.60.0 game with 5 scenes: Boot, Title, Explore, WorldMap, UI
- **960x720 native resolution**, ExploreScene uses camera zoom 2 for manga-style 32x32 tiles
- UIScene runs at zoom 1 as parallel overlay — all text is crisp
- Assets via **MangaSpriteProvider** (active) — ProceduralAssetProvider kept as fallback reference
- Strategy pattern: BootScene imports the provider, calls loadSpriteSheets→generateTextures→createAnimations
- Constants in `src/constants.js`: TILE_W=32, TILE_H=32, SPRITE_W=32, SPRITE_H=48, EXPLORE_ZOOM=2
- Data-driven: cities, NPCs, quests, dialogues all in `src/data/`
- **i18n system** in `src/data/i18n/` — `en.js`, `fr.js`, `index.js` with `t()` helper
- Quest progression drives NPC dialog via flag-based routing in `quests.js`
- **City maps are 50x40** (main rooms), playerStart `{x:25, y:33}` for main rooms
- **Multi-room system**: each city has `rooms` object; ExploreScene accepts `{city, room}` params
- **ROOM_TRANSITIONS** table in cities.js maps doorId → targetCity/targetRoom/spawnAt
- Room maps range from 12x10 to 24x20; each has own playerStart, ground/walls/decor
- **20 total rooms** (5 main + 15 sub-rooms), **39 NPCs**
- **Player 32x48**, NPC 32x48, body sizes: Player 20x20 offset(6,28), NPC 24x24 offset(4,24)
- Player speed: 90 px/s (tuned for 32px world)
- 29 NPC sprite types with optional external PIPOYA PNG files
- Tileset 99 tiles at 32x32: base tiles (0-63), water variants (64-65), monument sections (66-98)
- Monument tiles: Eiffel Tower (66-77), Big Ben (78-85), columns (86-88), palms/mosaics (89-92), cherry/torii (93-98)
- External PNG monument tiles in `src/assets/tiles/` with manifest.json
- External sprite system: PIPOYA 3-frame layout remapped to 4-frame via `_remapExternalSprite()`
- `spirit_fox` and `ghost` always use procedural rendering (no external file)

## Key Patterns
- NPC property named `npcData` (not `data`) to avoid Phaser's built-in DataManager conflict
- NPCs have `room` field (`'main'` default) — `createNPCs()` filters by `this.roomId`
- ExploreScene uses TILE_W/TILE_H constants for all pixel calculations (imported from constants.js)
- Interaction distance: 32px (facing point 24px ahead), was 16px in 16px world
- `_remapExternalSprite()` maps PIPOYA 3-col → 4-col: frame indices [0,1,0,2]
- `loadSpriteSheets()` uses `filecomplete`/`loaderror` events for graceful fallback
- NPC defs have optional `file` field — if missing, procedural drawing is used
- Shutdown handler nulls particle/env refs — does NOT call `.destroy()` (Phaser auto-destroys)
- Canvas textures created via `this.scene.textures.createCanvas()` in provider
- BootScene stores provider as `this.provider`, calls loadSpriteSheets in preload

## Gotchas — see [gotchas.md](gotchas.md) for full list

## Bug History — see [bugs-and-fixes.md](bugs-and-fixes.md) for all bugs found and fixed

## Engagement Features (Phase 1)
- **Journal Pages**: 15 hidden collectibles (3 per city) in `src/data/journalPages.js`
  - Shimmer visual on ground, interact to collect, persist in `foundJournalPages` registry
  - Finding all 3 in a city sets `{city}_pages_complete` flag → unlocks bonus NPC dialog
  - Counter shown in Quest Log panel
- **Dialog Choices**: Branching dialog system in `src/data/dialogChoices.js`
  - 7 choice dialogs: Pierre, Thomas, Hassan, Tanaka (3 variants), Marco torch
  - DialogManager checks `DIALOG_CHOICES` before `DIALOGUES` — choice dialogs have preamble→choices→response flow
  - Each choice can set a unique flag; shared rewards (items, flags, objectives) apply regardless
  - Choices can also have `completionFlag` and `completesObjective` for conditional completion (e.g. riddle)
  - NPC_DIALOG_ROUTES references `_choice` suffixed IDs (e.g. `pierre_has_brush_choice`)
- **Lea's Journal**: Auto-populated diary entries in `src/data/leaJournal.js`
  - 25 entries triggered by flags, shown newest-first via J key
  - UIScene has `journalContainer` panel with `toggleJournal()` / `refreshJournal()`

## Engagement Features (Phase 2) — Puzzles + Side Quests
- **Puzzles** (5 cities): Data in `src/data/puzzles.js`
  - Paris: Bell sequence (ring Gold→Silver→Bronze near bookshop)
  - London: Painting swap (reorder 4 paintings in museum gallery)
  - Rome: Torch path choice (Marco's `marco_torch_choice` dialog)
  - Marrakech: Trading chain (Karim→Tariq→Youssef→Karim via flag-gated dialogs)
  - Tokyo: Enhanced riddle (wrong answers give hints, require re-talking to Tanaka)
- **Side Quests** (5): Data in `src/data/sideQuests.js`, tracked via `SIDE_QUESTS`
  - Paris: Flower Deliveries (Colette→Sophie/Marie/Librarian)
  - London: Bobby's Whistle (find in basement, return)
  - Rome: Enzo's Music Sheets (3 sheets: colosseum, catacombs, Giulia)
  - Marrakech: Fatima's Stories (collect from Amina/Karim/Zahra)
  - Tokyo: Aiko's Lost Cat (find Mochi in bamboo forest)
- **Hidden Items**: `HIDDEN_ITEMS` array, same shimmer pattern as journal pages
- **`removesItem`**: DialogManager supports removing items on dialog end (for trade-ins)
- **QuestManager** extended with `SIDE_QUESTS` — `getActiveQuests()` returns main + side quests
- **UIScene** shows side quests with ✦ marker below main quest in quest log
- **ExploreScene** has `createPuzzleObjects()`, `createHiddenItems()`, `ringBell()`, `interactPainting()`, `collectHiddenItem()`
- **Choice-level completion**: `completionFlag` and `completesObjective` on individual choices allow conditional reward (only correct answer completes)

## Testing
- Unit tests: `node tests/test_systems.mjs` — 506 tests, pure data/logic, no Phaser runtime
- Integration tests: `node test_game.mjs` — 25 Playwright tests, requires server on port 8080
- `package.json` has `"type": "module"` for ESM support
- Both suites must pass before any change is considered complete
- Tests are room-aware: NPC placement checks resolve room maps
- Sprite bounds tests updated for 32x48 sprites

## File Reference — see [architecture.md](architecture.md) for detailed file descriptions

## User Preferences
- **All memory/docs/Claude instructions go in the repo** (`questGame/memory/`), NOT in `~/.claude/projects/`
- Keep repo copies in sync — they are the source of truth
