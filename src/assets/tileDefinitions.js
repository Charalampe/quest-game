export const TILE_DEFS = [
    // Row 0: ground tiles
    { color: '#c8b88a', detail: 'cobble' },   // 0: cobblestone
    { color: '#4a8c3f', detail: 'grass' },     // 1: grass
    { color: '#3b7dd8', detail: 'water' },     // 2: water
    { color: '#d4c5a0', detail: 'sand' },      // 3: sand
    { color: '#8B7355', detail: null },         // 4: dirt path
    { color: '#555555', detail: null },         // 5: dark stone
    { color: '#DEB887', detail: null },         // 6: wood floor
    { color: '#404040', detail: null },         // 7: dark floor

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
    { color: '#a93226', detail: null },          // 29: awning
    { color: '#d5d8dc', detail: null },          // 30: window
    { color: '#5d4e37', detail: null },          // 31: fence

    // Row 4: London-specific
    { color: '#c0392b', detail: 'phonebox' },   // 32: red phone box
    { color: '#873600', detail: 'bigben' },     // 33: big ben piece
    { color: '#6e2c00', detail: null },          // 34: museum wall
    { color: '#1c2833', detail: null },          // 35: dark brick
    { color: '#4a235a', detail: null },          // 36: purple door
    { color: '#0e6655', detail: null },          // 37: green park
    { color: '#d4e6f1', detail: null },          // 38: fog overlay
    { color: '#717d7e', detail: null },          // 39: pavement

    // Row 5: Rome-specific
    { color: '#f5eef8', detail: 'column' },     // 40: marble column
    { color: '#d7bde2', detail: null },          // 41: ancient stone
    { color: '#85c1e9', detail: null },          // 42: fountain water
    { color: '#f9e79f', detail: null },          // 43: warm stone
    { color: '#e8daef', detail: null },          // 44: temple floor
    { color: '#d5f5e3', detail: null },          // 45: vine
    { color: '#fad7a0', detail: null },          // 46: terracotta
    { color: '#f5b7b1', detail: null },          // 47: pink wall

    // Row 6: Marrakech-specific
    { color: '#e59866', detail: null },          // 48: red clay
    { color: '#d4ac0d', detail: 'mosaic' },     // 49: mosaic tile
    { color: '#af601a', detail: null },          // 50: market stall
    { color: '#7d3c98', detail: null },          // 51: purple fabric
    { color: '#28b463', detail: 'palm' },        // 52: palm tree
    { color: '#f0b27a', detail: null },          // 53: sandstone
    { color: '#2e4053', detail: null },          // 54: dark archway
    { color: '#f5cba7', detail: null },          // 55: light clay

    // Row 7: Tokyo-specific
    { color: '#f5b7b1', detail: 'cherry' },     // 56: cherry blossom tree
    { color: '#e8daef', detail: null },          // 57: light purple
    { color: '#aed6f1', detail: null },          // 58: light blue
    { color: '#a3e4d7', detail: null },          // 59: jade
    { color: '#f9e79f', detail: 'lantern' },    // 60: paper lantern
    { color: '#dc7633', detail: 'torii' },      // 61: torii gate
    { color: '#5d6d7e', detail: null },          // 62: slate
    { color: '#2ecc71', detail: 'bamboo' }      // 63: bamboo
];
