# Gotchas & Lessons Learned

## Phaser 3 Specific

### NPC data property conflict
- Phaser Sprite has a built-in `.data` property (DataManager)
- NEVER assign NPC data to `.data` — use `.npcData` instead
- Symptom: mysterious DataManager errors when accessing NPC properties

### Asset generation timing
- `this.scene.textures.createCanvas()` only works during scene `create()`, not `preload()`
- BootScene delegates to MangaSpriteProvider (strategy pattern) — provider uses `this.scene.textures`
- Provider must be created in `init()` (not constructor) — scene managers aren't available in constructor
- `loadSpriteSheets()` runs in `preload()`, `generateTextures()` + `createAnimations()` in `create()`
- External sprite loader listeners must be cleaned up after loading completes

### Keyboard listener accumulation
- `.on('keydown-X', handler)` listeners accumulate across scene restarts
- MUST store handler reference and call `.off()` on scene `shutdown` event
- Pattern: `this._onX = () => ...; this.input.keyboard.on('keydown-X', this._onX);`
- Cleanup: `this.events.on('shutdown', () => { this.input.keyboard.off('keydown-X', this._onX); });`

### Camera zoom and text rendering
- `pixelArt: true` sets NEAREST filtering globally — affects text too
- Text in zoomed scenes (ExploreScene zoom 2) gets pixelated
- Solution: render text in UIScene (zoom 1) at native 960x720 resolution
- World-to-screen conversion: `screenX = (worldX - cam.worldView.x) * cam.zoom`
- Use `cam.worldView.x/y` NOT `cam.scrollX/Y` for reliable conversion

### Tile size constants
- All tile/sprite dimensions centralized in `src/constants.js` (TILE_W, TILE_H, SPRITE_W, SPRITE_H, EXPLORE_ZOOM)
- ExploreScene must import and use these — NEVER hardcode `16` or `32` for tile math
- Interaction distance (24px facing, 32px threshold) is tuned for 32px tiles — reaches adjacent tile but not two away
- Player speed (90 px/s) tuned for ~2.8 tiles/sec in 32px world

### Scene launch timing
- `scene.launch('UI', data)` is async — UIScene's `create()` may not run until next frame
- Properties initialized in `create()` may be undefined when ExploreScene's first `update()` fires
- Solution: initialize critical properties in `init()` (runs synchronously during launch)
- Example: `npcLabelPool = []` in `init()` prevents TypeError in `updateNPCLabels()`

### Scene method availability
- `scene.get('UI')` returns the scene instance even before `create()` runs
- Methods on the prototype are always available, but instance properties may not be
- Always add guards: `if (!this.npcLabelPool) return;`

## Tilemap & Collision

### Water tiles need dual layers
- Ground layer provides visual (tile 2 = water)
- Wall layer provides collision (tile 2 = impassable)
- BOTH must be set — ground tile alone is walkable!
- Bridge gaps: set wall to -1 and ground to non-water (e.g., cobblestone/pavement)

### Exit zone dialog loops
- Checking exit zones in `update()` triggers every frame while player is in zone
- Without debouncing, `openWorldMap()` shows repeated "no routes" dialogs
- Solution: `exitTriggered` flag, set true on first trigger, reset when player leaves zone

### Portal tile requirement
- Decor tile 21 = portal, detected by `createInteractables()`
- Cities with portal travel routes MUST have a portal tile in their decor layer
- Otherwise players can't use portal travel from that city

## Dialog & Menu

### Dialog state guards
- I/Q keys must check `this.dialogActive` before opening inventory/quest log
- Without guard, menus overlay on top of active dialog
- Pattern: `toggleInventory() { if (this.dialogActive) return; ... }`

### Dialog advance cooldown
- 100ms cooldown between `advance()` calls prevents rapid-fire line skipping
- Without cooldown, a single key press can skip multiple dialog lines

## Testing

### ESM import in test callbacks
- `await import()` works at ESM top level (module scope)
- `await import()` does NOT work inside `describe()`/`it()` callbacks — SyntaxError
- Solution: move all imports to top-level `await import(...)` statements

### localStorage mock timing
- Mock must be defined BEFORE importing SaveManager
- SaveManager captures localStorage reference at import time
- If mock comes after import, SaveManager uses real localStorage

### NPC dialog route testing
- Don't assume the catch-all fallback route is the last entry
- Some NPCs (e.g., `paris_grandma`) have the catch-all as the first route
- Test "any route matches for empty flags" instead of "last route is fallback"
