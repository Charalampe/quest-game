# Quest Game - Project Memory

## Architecture
- Phaser 3.60.0 game with 5 scenes: Boot, Title, Explore, WorldMap, UI
- **960x720 native resolution**, ExploreScene uses camera zoom 3 for pixel art
- UIScene runs at zoom 1 as parallel overlay — all text is crisp
- All assets generated programmatically in BootScene (no external files)
- Data-driven: cities, NPCs, quests, dialogues all in `src/data/`
- **i18n system** in `src/data/i18n/` — `en.js`, `fr.js`, `index.js` with `t()` helper
- Quest progression drives NPC dialog via flag-based routing in `quests.js`
- **City maps are 50x40** (main rooms), playerStart `{x:25, y:33}` for main rooms
- **Multi-room system**: each city has `rooms` object; ExploreScene accepts `{city, room}` params
- **ROOM_TRANSITIONS** table in cities.js maps doorId → targetCity/targetRoom/spawnAt
- Each transition has `spawnAt: {x, y}` — player spawns near the return door, not at default playerStart
- Room maps range from 12x10 to 24x20; each has own playerStart, ground/walls/decor
- **20 total rooms** (5 main + 15 sub-rooms), **40 NPCs** (up from 15)
- **Player 16x24**, NPC 16x24 with 4-frame idle + breathing tween
- 29 NPC sprite types in BootScene (6 original + 23 new)
- Tileset 10 rows (indices 64-65 = water variants), particle textures for effects

## Key Patterns
- NPC property named `npcData` (not `data`) to avoid Phaser's built-in DataManager conflict
- NPCs have `room` field (`'main'` default) — `createNPCs()` filters by `this.roomId`
- `getRoomData()` resolves room data: checks `city.rooms[roomId]` then falls back to city-level
- Door tiles (23) in decor become interactables with ROOM_TRANSITIONS lookup
- `enterDoor()` checks `transition.requiresFlag` before allowing entry, passes `transition.spawnAt`
- `ExploreScene.init()` accepts `spawnAt` param; `create()` uses it over `playerStart` when set
- Shutdown handler nulls particle/env refs — does NOT call `.destroy()` (Phaser auto-destroys)
- Chest IDs include room prefix: `paris_eiffel_top_chest_6_3`, `london_museum_basement_chest_8_6`
- Exit zones only on main rooms; sub-rooms have door tiles for navigation
- Registry now stores `currentRoom` alongside `currentCity`
- SaveManager persists `currentRoom` to localStorage
- Sign at `tokyo_shrine_sign_5_4` sets `tokyo_riddle_part3` flag when read
- Canvas textures created via `this.textures.createCanvas()` in BootScene's `create()` (not preload)

## Gotchas — see [gotchas.md](gotchas.md) for full list

## Bug History — see [bugs-and-fixes.md](bugs-and-fixes.md) for all bugs found and fixed

## Testing
- Unit tests: `node tests/test_systems.mjs` — 295 tests, pure data/logic, no Phaser runtime
- Integration tests: `node test_game.mjs` — 24 Playwright tests, requires server on port 8080
- `package.json` has `"type": "module"` for ESM support
- Both suites must pass before any change is considered complete
- Tests are room-aware: NPC placement checks resolve room maps

## File Reference — see [architecture.md](architecture.md) for detailed file descriptions

## User Preferences
- **All memory/docs/Claude instructions go in the repo** (`questGame/memory/`), NOT in `~/.claude/projects/`
- Keep repo copies in sync — they are the source of truth
