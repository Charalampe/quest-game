# The Locket of Worlds

A top-down RPG exploration game built with [Phaser 3](https://phaser.io/), inspired by Zelda and Pokemon. Follow Lea, a 12-year-old Parisian girl, as she travels the world solving mysteries left behind by her great-great-grandmother.

![Phaser 3](https://img.shields.io/badge/Phaser-3.60-blue)
![Tests](https://img.shields.io/badge/tests-341%20passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **5 explorable cities**: Paris, London, Rome, Marrakech, Tokyo
- **20 rooms** across all cities with unique architecture and secrets
- **40 NPCs** with quest-driven dialog that evolves as the story progresses
- **Manga-style graphics**: 32x32 cel-shaded tiles with bold outlines, city-specific architecture
- **External character sprites**: PIPOYA anime-style characters with procedural fallback
- **Full quest system**: item collection, flag-based progression, chained objectives
- **Travel system**: trains, boats, and magic portals connecting cities on a world map
- **Save/load** via localStorage
- **Bilingual**: English and French (toggle on title screen)

## Quick Start

```bash
npm install
npm start
```

Opens at [http://localhost:8080](http://localhost:8080).

## Controls

| Key | Action |
|-----|--------|
| WASD / Arrow keys | Move |
| Space | Interact / advance dialog |
| I | Inventory |
| Q | Quest log |
| M | World map (main rooms only) |
| ESC | Close menus / advance dialog |

## Story

Lea discovers a mysterious locket that once belonged to her great-great-grandmother. Inside are cryptic clues pointing to locations around the world. With the help of her grandmother in Paris, Lea sets off on a journey through five cities, meeting locals, solving puzzles, and uncovering a family secret that spans generations.

**Paris** (train) **London** (train) **Rome** (boat) **Marrakech** (portal) **Tokyo**

## Architecture

```
src/
  main.js              Phaser config + scene registration
  constants.js         TILE_W=32, TILE_H=32, SPRITE_W=32, SPRITE_H=48, EXPLORE_ZOOM=2
  scenes/
    BootScene.js       Asset loading orchestrator (strategy pattern)
    TitleScene.js      Title screen with new game / continue
    ExploreScene.js    Core gameplay: tilemap, NPCs, interactions, particles
    WorldMapScene.js   City-to-city travel with animated routes
    UIScene.js         HUD overlay: dialog, inventory, quest log, NPC labels
  assets/
    MangaSpriteProvider.js   Manga-style procedural textures (32x32 tiles, 32x48 sprites)
    sprites/                 External PIPOYA character PNGs + manifest.json
    npcDefinitions.js        29 NPC sprite type definitions
    tileDefinitions.js       66 tile type definitions
    itemDefinitions.js       16 item icon definitions
  entities/
    Player.js          Player character (32x48, speed 90, WASD + arrows)
    NPC.js             NPC with idle animation, interaction indicator, breathing tween
  systems/
    DialogManager.js   Typewriter dialog with rewards and choices
    QuestManager.js    Flag-based quest routing and objective tracking
    InventoryManager.js
    TravelManager.js   Travel routes and city map positions
    SaveManager.js     localStorage persistence
  data/
    cities.js          Map data for all 20 rooms + room transitions
    npcs.js            40 NPC definitions across 5 cities
    quests.js          Quest chain, dialog routes, chest rewards
    dialogues.js       ~30 dialog entries
    i18n/              English + French translations
```

### Rendering

- **960x720 native resolution** with `pixelArt: true`
- ExploreScene uses camera zoom 2 on 32x32 tiles (480x360 logical viewport)
- UIScene runs at zoom 1 as a parallel overlay for crisp text
- External PIPOYA sprites (32x32 per frame) are auto-padded to 32x48 and remapped from 3-frame to 4-frame walk cycles

### External Sprites

Character sprites use [PIPOYA Free RPG Character Sprites 32x32](https://pipoya.itch.io/pipoya-free-rpg-character-sprites-32x32) (free, anime/JRPG style). The system auto-detects sprites via `src/assets/sprites/manifest.json` and falls back to procedural manga drawing when PNGs are absent.

## Testing

```bash
# Unit tests (no browser needed)
node tests/test_systems.mjs     # 341 tests

# Integration tests (requires server running on port 8080)
npm start &
node test_game.mjs              # 24 Playwright tests
```

Tests cover: data integrity, quest progression, collision bodies, room transitions, spawn positions, interaction distances, sprite bounds, source correctness, and dialog state management.

## Credits

- **Game engine**: [Phaser 3.60](https://phaser.io/) (MIT License)
- **Character sprites**: [PIPOYA](https://pipoya.itch.io/) Free RPG Character Sprites 32x32
- **Built with**: [Claude Code](https://claude.ai/code)
