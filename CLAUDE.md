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
node tests/test_systems.mjs   # 209 unit tests — pure data/logic, no Phaser runtime
node test_game.mjs             # 24 Playwright integration tests — requires server on port 8080
```

Both test suites must pass before merging changes.

## Architecture

### Resolution & Rendering
- **960x720 native resolution** — text renders at full resolution for crisp display
- **32x32 tiles**, camera zoom 2 → 480x360 logical viewport, 15x11 tiles visible
- **Player/NPC sprites 32x48** (64x96 on screen at zoom 2)
- **UIScene runs at zoom 1** (960x720) as a parallel overlay — all text is sharp
- `pixelArt: true` in config for nearest-neighbor filtering on textures
- NPC name labels rendered in UIScene (not ExploreScene) to avoid zoom pixelation
- Constants in `src/constants.js`: TILE_W=32, TILE_H=32, SPRITE_W=32, SPRITE_H=48, EXPLORE_ZOOM=2

### File Structure
- `src/main.js` — Phaser config + scene registration
- `src/constants.js` — tile/sprite dimensions and zoom constants
- `src/scenes/` — BootScene (thin orchestrator), TitleScene, ExploreScene (core gameplay), WorldMapScene, UIScene (HUD overlay)
- `src/assets/` — AssetProvider (base), MangaSpriteProvider (manga canvas drawing), ProceduralAssetProvider (original 16px), npcDefinitions, itemDefinitions, tileDefinitions
- `src/assets/sprites/` — external PIPOYA character sprite sheets (PNGs, optional)
- `src/assets/tiles/` — external PNG monument tiles (Eiffel Tower, Big Ben, columns, etc.)
- `scripts/` — generate_tiles.mjs (monument tile PNGs), setup_sprites.mjs (PIPOYA file mapping)
- `src/systems/` — DialogManager, QuestManager, InventoryManager, TravelManager, SaveManager
- `src/entities/` — Player, NPC
- `src/data/` — cities.js (map data + rooms), npcs.js, quests.js (dialog routes + chest rewards), dialogues.js, i18n/

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
- Asset generation uses strategy pattern: BootScene delegates to MangaSpriteProvider
- Canvas textures via `this.scene.textures.createCanvas()` in provider (not `preload()`)
- Water tiles need BOTH ground tile (visual) AND wall tile (collision)
- Exit zone checks in `update()` must be debounced (`exitTriggered` flag) to prevent dialog loops
- Menus (I/Q keys) must check `dialogActive` before opening
- `await import()` works at ESM top level but NOT inside `describe()`/`it()` callbacks
- Portal tiles (decor 21) must exist in cities connected by portal travel routes
- WorldMapScene uses `CITY_MAP_POSITIONS` at 320x240 scale, multiplied by `MAP_SCALE=3` at render time
- UIScene `npcLabelPool` initialized in `init()` (not `create()`) to avoid timing race with ExploreScene's first `update()` call
- Use `cam.worldView.x/y` not `cam.scrollX/Y` for world→screen coordinate conversion
- ExploreScene must import TILE_W/TILE_H/EXPLORE_ZOOM from constants.js — no hardcoded 16s
- MangaSpriteProvider.loadSpriteSheets() silently handles missing PNGs — procedural fallback
- PIPOYA sprites use 3 frames/direction — `_remapExternalSprite()` maps to 4-frame layout [0,1,0,2]
- `spirit_fox` and `ghost` NPCs have no `file` field — always procedural

## Story (5 cities)

Paris → London → Rome → Marrakech → Tokyo

Travel: Train (Europe) → Boat (to Marrakech) → Magic Portal (to Tokyo, requires `portal_unlocked` flag)

## Memory & Documentation

All memory files, docs, and Claude instructions must be placed in **this repo folder** (`memory/`), not in `~/.claude/projects/`. Files:
- `memory/MEMORY.md` — Top-level project memory (concise)
- `memory/architecture.md` — Detailed file reference
- `memory/bugs-and-fixes.md` — Bug history
- `memory/gotchas.md` — Full gotcha list
