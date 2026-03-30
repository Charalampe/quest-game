# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**The Locket of Worlds** — A retro top-down RPG exploration game (Zelda/Pokemon style) built with Phaser 3. The player is Lea, a 12-year-old Parisian girl who travels the world solving mysteries following her great-great-grandmother's clues. Target audience: 12-year-old girls.

## Tech Stack

- **Phaser 3.60.0** loaded via CDN (no bundler)
- **Plain ES6 modules** — no build step, `"type": "module"` in package.json
- **localStorage** for save/load
- **http-server** for local dev server
- **Playwright** for integration tests

## Running

```bash
npm install
npm start       # Opens at http://localhost:8080
```

## Testing

```bash
node tests/test_systems.mjs   # 168 unit tests — pure data/logic, no Phaser runtime
node test_game.mjs             # 24 Playwright integration tests — requires server on port 8080
```

Both test suites must pass before merging changes.

## Architecture

### Resolution & Rendering
- **960x720 native resolution** — text renders at full resolution for crisp display
- **ExploreScene uses camera zoom 3** — pixel art world runs at 320x240 logical, zoomed 3x
- **UIScene runs at zoom 1** (960x720) as a parallel overlay — all text is sharp
- `pixelArt: true` in config for nearest-neighbor filtering on textures
- NPC name labels rendered in UIScene (not ExploreScene) to avoid zoom pixelation

### File Structure
- `src/main.js` — Phaser config + scene registration
- `src/scenes/` — BootScene (asset gen), TitleScene, ExploreScene (core gameplay), WorldMapScene, UIScene (HUD overlay)
- `src/systems/` — DialogManager, QuestManager, InventoryManager, TravelManager, SaveManager
- `src/entities/` — Player, NPC
- `src/data/` — cities.js (map data), npcs.js, quests.js (dialog routes + chest rewards), dialogues.js

### State Management
- Phaser Registry for global state: `currentCity`, `inventory`, `questState`, `unlockedCities`, `visitedCities`, `flags`, `openedChests`
- SaveManager persists registry to localStorage on city entry
- Flag-based quest progression: `NPC_DIALOG_ROUTES` in quests.js maps NPC IDs to ordered condition→dialog pairs

### Scene Lifecycle
- BootScene → TitleScene → ExploreScene + UIScene (parallel) ↔ WorldMapScene
- UIScene launched from ExploreScene as overlay, stopped when entering WorldMapScene
- Keyboard listeners MUST be cleaned up with `.off()` on scene `shutdown` event

## Game Controls

- WASD / Arrow keys: Move
- Space: Interact / advance dialog
- I: Inventory
- Q: Quest log
- M: World map
- ESC: Close menus / advance dialog

## Key Gotchas

- NPC property named `npcData` (not `data`) to avoid Phaser's built-in DataManager conflict
- Generate assets in BootScene `create()` not `preload()` — they're synchronous
- Water tiles need BOTH ground tile (visual) AND wall tile (collision)
- Exit zone checks in `update()` must be debounced (`exitTriggered` flag) to prevent dialog loops
- Menus (I/Q keys) must check `dialogActive` before opening
- `await import()` works at ESM top level but NOT inside `describe()`/`it()` callbacks
- Portal tiles (decor 21) must exist in cities connected by portal travel routes
- WorldMapScene uses `CITY_MAP_POSITIONS` at 320x240 scale, multiplied by `MAP_SCALE=3` at render time
- UIScene `npcLabelPool` initialized in `init()` (not `create()`) to avoid timing race with ExploreScene's first `update()` call
- Use `cam.worldView.x/y` not `cam.scrollX/Y` for world→screen coordinate conversion

## Story (5 cities)

Paris → London → Rome → Marrakech → Tokyo

Travel: Train (Europe) → Boat (to Marrakech) → Magic Portal (to Tokyo, requires `portal_unlocked` flag)
