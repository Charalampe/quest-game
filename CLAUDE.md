# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**The Locket of Worlds** — A retro top-down RPG exploration game (Zelda/Pokemon style) built with Phaser 3. The player is Lea, a 12-year-old Parisian girl who travels the world solving mysteries following her great-great-grandmother's clues.

## Tech Stack

- **Phaser 3** loaded via CDN (no bundler)
- **Plain ES6 modules** — no build step
- **localStorage** for save/load
- **http-server** for local dev server

## Running

```bash
npm install
npm start
```

Opens at http://localhost:8080

## Architecture

- `src/main.js` — Phaser config + scene registration
- `src/scenes/` — BootScene (asset gen), TitleScene, ExploreScene (core gameplay), WorldMapScene, UIScene (HUD overlay)
- `src/systems/` — DialogManager, QuestManager, InventoryManager, TravelManager, SaveManager
- `src/entities/` — Player, NPC
- `src/data/` — cities.js (map data), npcs.js, quests.js, dialogues.js

## Key Design Decisions

- 320x240 base resolution scaled 3x (960x720) for retro pixel feel
- All assets generated programmatically in BootScene (no external asset files needed)
- Scene-based architecture with UIScene as parallel overlay
- Data-driven content — cities, NPCs, quests, dialogues all in JS data files
- Quest progression drives NPC dialog routing via flag-based conditions

## Game Controls

- WASD / Arrow keys: Move
- Space: Interact / advance dialog
- I: Inventory
- Q: Quest log
- M: World map
- ESC: Close menus
