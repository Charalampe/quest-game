# Bugs Found & Fixed

## Bug 1 (HIGH): Water tiles walkable
- **Issue**: Paris Seine (rows 10-11) and London Thames (rows 12-13) had no wall collision — player could walk on water
- **Root cause**: Only ground tiles were set for water, no wall tiles for collision
- **Fix**: Added `walls[row][x] = 2` for all water tiles, with `walls[row][x] = -1` for bridge columns
- **Files**: `src/data/cities.js`
- **Tests**: "Water Tile Collision (Bug Fix)" — 4 tests

## Bug 2 (HIGH): Exit zone dialog loop
- **Issue**: Standing in south exit zone with only 1 city unlocked caused infinite "no routes" dialogs
- **Root cause**: `update()` checked exit zone every frame, calling `openWorldMap()` repeatedly
- **Fix**: Added `exitTriggered` flag in `init()`, set on first trigger, reset when player leaves zone
- **Files**: `src/scenes/ExploreScene.js`

## Bug 3 (MEDIUM): WorldMapScene ESC listener accumulation
- **Issue**: ESC keyboard listener added every time WorldMapScene was created, never removed
- **Root cause**: No cleanup on scene shutdown
- **Fix**: Stored handler ref in `_onEsc`, added `shutdown` event to call `.off()`
- **Files**: `src/scenes/WorldMapScene.js`

## Bug 4 (MEDIUM): Inventory/Quest log during dialog
- **Issue**: Pressing I/Q during active dialog opened menus overlaid on dialog
- **Root cause**: No `dialogActive` check in `toggleInventory()`/`toggleQuestLog()`
- **Fix**: Added `if (this.dialogActive) return;` guard to both methods
- **Files**: `src/scenes/ExploreScene.js`
- **Tests**: "Menu State Guards (Bug Fix)" — 3 tests

## Bug 5 (LOW): Dead key bindings in Player.js
- **Issue**: `addKey(SPACE)` and `addKey(I)` in Player constructor were unused
- **Fix**: Removed unused key bindings (SPACE/I/Q/M/ESC handled by ExploreScene)
- **Files**: `src/entities/Player.js`

## Bug 6 (LOW): WorldMap travel skips requiresFlag
- **Issue**: Clicking locked portal route city showed travel button without flag validation
- **Root cause**: `selectCity()` didn't check `route.requiresFlag`
- **Fix**: Added flag validation with "Route locked" message
- **Files**: `src/scenes/WorldMapScene.js`
- **Tests**: "Travel Route Flag Validation (Bug Fix)" — 4 tests

## Bug 7 (LOW): Missing Marrakech portal tile
- **Issue**: Story says "use the portal in Marrakech" but no portal tile existed in decor layer
- **Fix**: Added `decor[15][15] = 21` (portal tile in market square area)
- **Files**: `src/data/cities.js`
- **Tests**: "Portal Tile Placement (Bug Fix)" — 3 tests

## Bug 8: Text rendering blurry (resolution change)
- **Issue**: All text rendered at 320x240 then scaled 3x with nearest-neighbor — blocky and unreadable
- **Root cause**: Game used `width:320, height:240, zoom:3` — all text upscaled
- **Fix**: Changed to 960x720 native resolution, camera zoom 3 only in ExploreScene for pixel art
- **Files changed**: main.js, BootScene.js, ExploreScene.js, UIScene.js, TitleScene.js, WorldMapScene.js, NPC.js
- **Key decisions**:
  - All text/UI scenes at zoom 1 (960x720) for crisp rendering
  - Font sizes multiplied 3x across all scenes
  - TitleScene buttons changed from pixel art textures to rectangles
  - WorldMapScene positions multiplied by MAP_SCALE=3 at render time
  - NPC name labels moved from NPC.js (ExploreScene) to UIScene
  - City name display moved to UIScene.create() to avoid timing race

## Bug 9: NPC labels not showing after resolution change
- **Issue**: NPC name labels disappeared after moving them from NPC.js to UIScene
- **Root cause**: `npcLabelPool` initialized in UIScene `create()`, but ExploreScene `update()` calls `updateNPCLabels()` before UIScene's `create()` runs (scene.launch is async)
- **Fix**: Moved `npcLabelPool = []` to UIScene `init()`, added null guard in `updateNPCLabels()`
- **Also fixed**: Used `cam.worldView.x/y` instead of `cam.scrollX/Y` for more reliable world→screen conversion
- **Files**: `src/scenes/UIScene.js`, `src/scenes/ExploreScene.js`
