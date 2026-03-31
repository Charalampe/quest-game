# Quest Game - Project Memory

## Architecture
- Phaser 3.60.0 game with 5 scenes: Boot, Title, Explore, WorldMap, UI
- **960x720 native resolution**, ExploreScene uses camera zoom 2 for manga-style 32x32 tiles
- UIScene runs at zoom 1 as parallel overlay — all text is crisp
- Assets via **MangaSpriteProvider** (manga-graphics branch) or **ProceduralAssetProvider** (main)
- Strategy pattern: BootScene imports the provider, calls loadSpriteSheets→generateTextures→createAnimations
- Constants in `src/constants.js`: TILE_W=32, TILE_H=32, SPRITE_W=32, SPRITE_H=48, EXPLORE_ZOOM=2
- Data-driven: cities, NPCs, quests, dialogues all in `src/data/`
- **i18n system** in `src/data/i18n/` — `en.js`, `fr.js`, `index.js` with `t()` helper
- Quest progression drives NPC dialog via flag-based routing in `quests.js`
- **City maps are 50x40** (main rooms), playerStart `{x:25, y:33}` for main rooms
- **Multi-room system**: each city has `rooms` object; ExploreScene accepts `{city, room}` params
- **ROOM_TRANSITIONS** table in cities.js maps doorId → targetCity/targetRoom/spawnAt
- Room maps range from 12x10 to 24x20; each has own playerStart, ground/walls/decor
- **20 total rooms** (5 main + 15 sub-rooms), **40 NPCs**
- **Player 32x48**, NPC 32x48, body sizes: Player 20x20 offset(6,28), NPC 24x24 offset(4,24)
- Player speed: 90 px/s (tuned for 32px world)
- 29 NPC sprite types with optional external PIPOYA PNG files
- Tileset 10 rows at 32x32 (indices 64-65 = water variants), manga cel-shaded style
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

## Testing
- Unit tests: `node tests/test_systems.mjs` — 295 tests, pure data/logic, no Phaser runtime
- Integration tests: `node test_game.mjs` — 24 Playwright tests, requires server on port 8080
- `package.json` has `"type": "module"` for ESM support
- Both suites must pass before any change is considered complete
- Tests are room-aware: NPC placement checks resolve room maps
- Sprite bounds tests updated for 32x48 sprites

## File Reference — see [architecture.md](architecture.md) for detailed file descriptions

## User Preferences
- **All memory/docs/Claude instructions go in the repo** (`questGame/memory/`), NOT in `~/.claude/projects/`
- Keep repo copies in sync — they are the source of truth
