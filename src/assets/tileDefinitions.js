export const TILE_DEFS = [
    // Row 0: ground tiles
    { color: '#c8b88a', detail: 'cobble' },   // 0: cobblestone
    { color: '#4a8c3f', detail: 'grass' },     // 1: grass
    { color: '#3b7dd8', detail: 'water' },     // 2: water
    { color: '#d4c5a0', detail: 'sand' },      // 3: sand
    { color: '#8B7355', detail: 'dirt' },       // 4: dirt path
    { color: '#555555', detail: 'darkstone' },  // 5: dark stone
    { color: '#DEB887', detail: 'wood' },       // 6: wood floor
    { color: '#404040', detail: 'darkfloor' },  // 7: dark floor

    // Row 1: building/wall tiles
    { color: '#d4c4a8', detail: 'brick' },     // 8: beige wall
    { color: '#a0522d', detail: 'brick' },     // 9: brown wall
    { color: '#708090', detail: 'brick' },     // 10: grey wall
    { color: '#c0392b', detail: 'brick' },     // 11: red wall
    { color: '#6c3483', detail: 'brick' },     // 12: purple wall (marrakech)
    { color: '#2e86c1', detail: 'brick' },     // 13: blue wall
    { color: '#f0e6d3', detail: 'brick' },     // 14: white wall (rome)
    { color: '#e74c3c', detail: null },         // 15: red roof

    // Row 2: decorative/interactive
    { color: '#2ecc71', detail: 'tree' },       // 16: tree
    { color: '#f39c12', detail: 'flower' },     // 17: flower
    { color: '#7f8c8d', detail: 'fountain' },   // 18: fountain
    { color: '#95a5a6', detail: 'statue' },     // 19: statue
    { color: '#d4a017', detail: 'chest' },      // 20: chest
    { color: '#8e44ad', detail: 'portal' },     // 21: portal
    { color: '#e67e22', detail: 'sign' },       // 22: sign
    { color: '#3498db', detail: 'door' },       // 23: door

    // Row 3: Paris-specific
    { color: '#2c3e50', detail: 'eiffel' },     // 24: eiffel tower piece
    { color: '#34495e', detail: 'bridge' },     // 25: bridge
    { color: '#1a5276', detail: 'bookshop' },   // 26: bookshop
    { color: '#196f3d', detail: 'park' },       // 27: park bench
    { color: '#7d6608', detail: 'lamp' },       // 28: street lamp
    { color: '#a93226', detail: 'awning' },     // 29: awning
    { color: '#d5d8dc', detail: 'window' },     // 30: window
    { color: '#5d4e37', detail: 'fence' },      // 31: fence

    // Row 4: London-specific
    { color: '#c0392b', detail: 'phonebox' },   // 32: red phone box
    { color: '#873600', detail: 'bigben' },     // 33: big ben piece
    { color: '#6e2c00', detail: 'museumwall' },  // 34: museum wall
    { color: '#1c2833', detail: 'darkbrick' },   // 35: dark brick
    { color: '#4a235a', detail: 'purpledoor' },   // 36: purple door
    { color: '#0e6655', detail: 'greenpark' },     // 37: green park
    { color: '#d4e6f1', detail: null },          // 38: fog overlay
    { color: '#717d7e', detail: 'pavement' },    // 39: pavement

    // Row 5: Rome-specific
    { color: '#f5eef8', detail: 'column' },     // 40: marble column
    { color: '#d7bde2', detail: 'ancientstone' },  // 41: ancient stone
    { color: '#85c1e9', detail: 'fountainwater' }, // 42: fountain water
    { color: '#f9e79f', detail: 'warmstone' },     // 43: warm stone
    { color: '#e8daef', detail: 'templefloor' },   // 44: temple floor
    { color: '#d5f5e3', detail: 'vine' },          // 45: vine
    { color: '#fad7a0', detail: 'terracotta' },    // 46: terracotta
    { color: '#f5b7b1', detail: 'pinkwall' },      // 47: pink wall

    // Row 6: Marrakech-specific
    { color: '#e59866', detail: 'redclay' },     // 48: red clay
    { color: '#d4ac0d', detail: 'mosaic' },     // 49: mosaic tile
    { color: '#af601a', detail: 'marketstall' }, // 50: market stall
    { color: '#7d3c98', detail: 'fabric' },      // 51: purple fabric
    { color: '#28b463', detail: 'palm' },        // 52: palm tree
    { color: '#f0b27a', detail: 'sandstone' },   // 53: sandstone
    { color: '#2e4053', detail: 'darkarch' },    // 54: dark archway
    { color: '#f5cba7', detail: 'lightclay' },   // 55: light clay

    // Row 7: Tokyo-specific
    { color: '#f5b7b1', detail: 'cherry' },     // 56: cherry blossom tree
    { color: '#e8daef', detail: 'lightpurple' },  // 57: light purple
    { color: '#aed6f1', detail: 'lightblue' },   // 58: light blue
    { color: '#a3e4d7', detail: 'jade' },         // 59: jade
    { color: '#f9e79f', detail: 'lantern' },    // 60: paper lantern
    { color: '#dc7633', detail: 'torii' },      // 61: torii gate
    { color: '#5d6d7e', detail: 'slate' },       // 62: slate
    { color: '#2ecc71', detail: 'bamboo' },      // 63: bamboo

    // Row 8: Water animation variants (64-65) generated in MangaSpriteProvider
    // Indices 64-65 are reserved for water — placeholders here
    { color: '#3b7dd8', detail: null },          // 64: water anim 1
    { color: '#3b7dd8', detail: null },          // 65: water anim 2

    // ── Monument section tiles (indices 66+) — PNG art in src/assets/tiles/ ──

    // Paris Eiffel Tower sections
    { color: '#2c3e50', detail: 'eiffel_spire_L', file: 'eiffel_spire_L.png' },     // 66
    { color: '#2c3e50', detail: 'eiffel_spire_CL', file: 'eiffel_spire_CL.png' },   // 67
    { color: '#2c3e50', detail: 'eiffel_spire_CR', file: 'eiffel_spire_CR.png' },   // 68
    { color: '#2c3e50', detail: 'eiffel_spire_R', file: 'eiffel_spire_R.png' },     // 69
    { color: '#2c3e50', detail: 'eiffel_upper_L', file: 'eiffel_upper_L.png' },     // 70
    { color: '#2c3e50', detail: 'eiffel_upper_CL', file: 'eiffel_upper_CL.png' },   // 71
    { color: '#2c3e50', detail: 'eiffel_upper_CR', file: 'eiffel_upper_CR.png' },   // 72
    { color: '#2c3e50', detail: 'eiffel_upper_R', file: 'eiffel_upper_R.png' },     // 73
    { color: '#2c3e50', detail: 'eiffel_deck_L', file: 'eiffel_deck_L.png' },       // 74
    { color: '#2c3e50', detail: 'eiffel_deck_CL', file: 'eiffel_deck_CL.png' },     // 75
    { color: '#2c3e50', detail: 'eiffel_deck_CR', file: 'eiffel_deck_CR.png' },     // 76
    { color: '#2c3e50', detail: 'eiffel_deck_R', file: 'eiffel_deck_R.png' },       // 77

    // London Big Ben sections
    { color: '#873600', detail: 'bigben_spire_L', file: 'bigben_spire_L.png' },     // 78
    { color: '#873600', detail: 'bigben_spire_R', file: 'bigben_spire_R.png' },     // 79
    { color: '#873600', detail: 'bigben_clock_TL', file: 'bigben_clock_TL.png' },   // 80
    { color: '#873600', detail: 'bigben_clock_TR', file: 'bigben_clock_TR.png' },   // 81
    { color: '#873600', detail: 'bigben_clock_BL', file: 'bigben_clock_BL.png' },   // 82
    { color: '#873600', detail: 'bigben_clock_BR', file: 'bigben_clock_BR.png' },   // 83
    { color: '#873600', detail: 'bigben_tower_L', file: 'bigben_tower_L.png' },     // 84
    { color: '#873600', detail: 'bigben_tower_R', file: 'bigben_tower_R.png' },     // 85

    // Rome column variants
    { color: '#f5eef8', detail: 'column_capital', file: 'column_capital.png' },      // 86
    { color: '#f5eef8', detail: 'column_shaft', file: 'column_shaft.png' },          // 87
    { color: '#f5eef8', detail: 'column_base', file: 'column_base.png' },            // 88

    // Marrakech variants
    { color: '#28b463', detail: 'palm_top', file: 'palm_top.png' },                  // 89
    { color: '#7D5A1E', detail: 'palm_trunk', file: 'palm_trunk.png' },              // 90
    { color: '#d4ac0d', detail: 'mosaic_star', file: 'mosaic_star.png' },            // 91
    { color: '#d4ac0d', detail: 'mosaic_diamond', file: 'mosaic_diamond.png' },      // 92

    // Tokyo variants
    { color: '#f5b7b1', detail: 'cherry_canopy_L', file: 'cherry_canopy_L.png' },   // 93
    { color: '#f5b7b1', detail: 'cherry_canopy_R', file: 'cherry_canopy_R.png' },   // 94
    { color: '#6B4226', detail: 'cherry_trunk', file: 'cherry_trunk.png' },          // 95
    { color: '#dc7633', detail: 'torii_beam_L', file: 'torii_beam_L.png' },          // 96
    { color: '#dc7633', detail: 'torii_beam_R', file: 'torii_beam_R.png' },          // 97
    { color: '#dc7633', detail: 'torii_post', file: 'torii_post.png' }               // 98
];
