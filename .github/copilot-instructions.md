# Copilot Instructions

## Project

**The Locket of Worlds** — A retro top-down RPG (Zelda/Pokemon style) built with Phaser 3.60.0. No bundler, no build step — plain ES6 modules served via `http-server`. Phaser is loaded from CDN in `index.html`.

## Commands

```bash
npm install
npm start                        # http-server on port 8080

node tests/test_systems.mjs      # 336 unit tests (pure data/logic, no browser)
node test_game.mjs               # 24 Playwright integration tests (needs server on 8080)
```

No linter. No build step. Both test suites must pass before merging.

There is no single-test runner — tests are grouped in `describe()` blocks inside `tests/test_systems.mjs`. To run a subset, temporarily comment out other `describe()` calls or add an early `process.exit()`.

## Architecture

### Dual-scene rendering model

The game uses two parallel Phaser scenes for rendering:

- **ExploreScene** renders the tile world at **camera zoom 2** (32×32 tiles → 480×360 logical viewport)
- **UIScene** runs at **zoom 1** (960×720 native) as an overlay for all text, dialogs, menus, and NPC name labels

This split exists because `pixelArt: true` applies nearest-neighbor filtering globally — text rendered in the zoomed ExploreScene would be pixelated. All UI text must go through UIScene.

### Scene lifecycle

```
BootScene → TitleScene → ExploreScene + UIScene (parallel) ↔ WorldMapScene
```

- UIScene is `launch()`ed from ExploreScene (async — `create()` may not run until next frame)
- Critical UIScene properties must be initialized in `init()`, not `create()`, to avoid race conditions with ExploreScene's first `update()` call
- Keyboard listeners MUST be cleaned up with `.off()` on scene `shutdown` event to prevent accumulation across scene restarts

### Asset strategy pattern

BootScene delegates all asset creation to `MangaSpriteProvider` (imported in a single line). The provider:
1. `loadSpriteSheets()` — attempts to load external PIPOYA PNGs, falls back to procedural
2. `generateTextures()` — creates canvas textures via `this.scene.textures.createCanvas()`
3. `createAnimations()` — registers Phaser animations

Canvas textures can only be created during `create()`, not `preload()`.

### State and quest progression

- **Phaser Registry** holds global state: `currentCity`, `inventory`, `questState`, `unlockedCities`, `visitedCities`, `flags`, `openedChests`
- **SaveManager** persists registry to `localStorage` on city entry
- Quest progression is flag-based: `NPC_DIALOG_ROUTES` in `quests.js` maps each NPC to an ordered list of `{condition, dialogId}` pairs — first matching condition wins

### Multi-room map system

- 5 cities × main room (50×40 tiles) + 15 sub-rooms = 20 rooms total
- `ROOM_TRANSITIONS` in `cities.js` maps `doorId → {targetCity, targetRoom, spawnAt}`
- ExploreScene accepts `{city, room}` params and filters NPCs by `room` field

### Coordinate system

All spatial constants live in `src/constants.js`:
- `TILE_W=32, TILE_H=32, SPRITE_W=32, SPRITE_H=48, EXPLORE_ZOOM=2`
- Player/NPC sprites are 32×48 (64×96 on screen at zoom 2)
- Player body: 20×20 offset(6,28); NPC body: 24×24 offset(4,24)
- WorldMapScene positions use 320×240 scale, multiplied by `MAP_SCALE=3` at render time
- World→screen conversion: use `cam.worldView.x/y`, NOT `cam.scrollX/Y`

## Key Conventions

### NPC `npcData` not `data`

NPC custom data is stored as `.npcData` — Phaser's `Sprite` class reserves `.data` for its built-in `DataManager`. Using `.data` causes silent conflicts.

### Tile layer rules

- Water tiles need BOTH a ground tile (visual) AND a wall tile (collision) — ground alone is walkable
- Special decor tile indices: 20=chest, 21=portal, 22=sign, 23=door
- Portal tiles (decor 21) must exist in any city connected by portal travel routes

### Exit zone debouncing

Exit zone checks run in `update()` every frame. The `exitTriggered` flag prevents repeated dialog/map triggers while the player stands in the zone.

### Menu dialog guards

Menu toggles (I for inventory, Q for quest log) must check `this.dialogActive` before opening to prevent overlay conflicts.

### External sprite remapping

PIPOYA character sprites use 3 frames per direction. `_remapExternalSprite()` maps them to a 4-frame layout: `[0, 1, 0, 2]`. NPCs `spirit_fox` and `ghost` have no `file` field and always use procedural rendering.

### ESM testing constraint

`await import()` works at ESM top level but NOT inside `describe()`/`it()` callbacks. All dynamic imports in tests must be at module scope. Mock `localStorage` before importing `SaveManager` (it captures the reference at import time).

### Import constants, don't hardcode

ExploreScene must import `TILE_W`/`TILE_H`/`EXPLORE_ZOOM` from `constants.js` — never hardcode tile sizes.
