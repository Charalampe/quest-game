// Tile indices reference:
// 0=cobble, 1=grass, 2=water, 3=sand, 4=dirt, 5=dark stone, 6=wood, 7=dark floor
// 8=beige wall, 9=brown wall, 10=grey wall, 11=red wall, 12=purple wall, 13=blue wall, 14=white wall, 15=red roof
// 16=tree, 17=flower, 18=fountain, 19=statue, 20=chest, 21=portal, 22=sign, 23=door
// 24=eiffel, 25=bridge, 26=bookshop, 27=park bench, 28=lamp, 29=awning, 30=window, 31=fence
// 32=phone box, 33=big ben, 34=museum wall, 35=dark brick, 36=purple door, 37=green park, 38=fog, 39=pavement
// 40=column, 41=ancient stone, 42=fountain water, 43=warm stone, 44=temple floor, 45=vine, 46=terracotta, 47=pink wall
// 48=red clay, 49=mosaic, 50=market stall, 51=purple fabric, 52=palm, 53=sandstone, 54=dark arch, 55=light clay
// 56=cherry tree, 57=light purple, 58=light blue, 59=jade, 60=lantern, 61=torii, 62=slate, 63=bamboo

export const CITIES = {
    paris: {
        name: 'Paris',
        description: 'The City of Light',
        width: 50,
        height: 40,
        playerStart: { x: 25, y: 33 },
        tileSize: 16,
        ground: null,
        walls: null,
        decor: null,
        connections: ['london', 'rome'],
        music: 'paris_theme',
        rooms: {}
    },
    london: {
        name: 'London',
        description: 'The Old Smoke',
        width: 50,
        height: 40,
        playerStart: { x: 25, y: 33 },
        tileSize: 16,
        ground: null,
        walls: null,
        decor: null,
        connections: ['paris', 'rome'],
        music: 'london_theme',
        rooms: {}
    },
    rome: {
        name: 'Rome',
        description: 'The Eternal City',
        width: 50,
        height: 40,
        playerStart: { x: 25, y: 33 },
        tileSize: 16,
        ground: null,
        walls: null,
        decor: null,
        connections: ['london', 'paris', 'marrakech'],
        music: 'rome_theme',
        rooms: {}
    },
    marrakech: {
        name: 'Marrakech',
        description: 'The Red City',
        width: 50,
        height: 40,
        playerStart: { x: 25, y: 33 },
        tileSize: 16,
        ground: null,
        walls: null,
        decor: null,
        connections: ['rome', 'tokyo'],
        music: 'marrakech_theme',
        rooms: {}
    },
    tokyo: {
        name: 'Tokyo',
        description: 'The City of Harmony',
        width: 50,
        height: 40,
        playerStart: { x: 25, y: 33 },
        tileSize: 16,
        ground: null,
        walls: null,
        decor: null,
        connections: ['marrakech'],
        music: 'tokyo_theme',
        rooms: {}
    }
};

// Room transition table: doorId -> { targetCity, targetRoom, spawnAt, requiresFlag?, lockedMessage? }
// spawnAt = where the player appears in the target room (near the return door)
export const ROOM_TRANSITIONS = {
    // === PARIS ===
    // main -> eiffel_ground: enter near bottom door (10,14), spawn 1 above
    'paris_door_24_9': { targetCity: 'paris', targetRoom: 'eiffel_ground', spawnAt: { x: 10, y: 13 } },
    // eiffel_ground -> main: exit back to Eiffel plaza, spawn near (24,9)
    'paris_eiffel_ground_door_10_14': { targetCity: 'paris', targetRoom: 'main', spawnAt: { x: 24, y: 10 } },
    // eiffel_ground -> eiffel_first: enter near bottom door (9,13), spawn 1 above
    'paris_eiffel_ground_door_10_0': { targetCity: 'paris', targetRoom: 'eiffel_first', spawnAt: { x: 9, y: 12 }, requiresFlag: 'paris_has_fastpass' },
    // eiffel_first -> eiffel_ground: return near top door (10,0), spawn 1 below
    'paris_eiffel_first_door_9_13': { targetCity: 'paris', targetRoom: 'eiffel_ground', spawnAt: { x: 10, y: 1 } },
    // eiffel_first -> eiffel_top: enter near bottom door (6,9), spawn 1 above
    'paris_eiffel_first_door_9_0': { targetCity: 'paris', targetRoom: 'eiffel_top', spawnAt: { x: 6, y: 8 } },
    // eiffel_top -> eiffel_first: return near top door (9,0), spawn 1 below
    'paris_eiffel_top_door_6_9': { targetCity: 'paris', targetRoom: 'eiffel_first', spawnAt: { x: 9, y: 1 } },

    // === LONDON ===
    // main -> museum_hall: enter near bottom door (11,15), spawn 1 above
    'london_door_22_15': { targetCity: 'london', targetRoom: 'museum_hall', spawnAt: { x: 11, y: 14 } },
    // museum_hall -> main: return near museum entrance (22,15)
    'london_museum_hall_door_11_15': { targetCity: 'london', targetRoom: 'main', spawnAt: { x: 22, y: 16 } },
    // museum_hall -> museum_gallery: enter near bottom door (10,17), spawn 1 above
    'london_museum_hall_door_21_0': { targetCity: 'london', targetRoom: 'museum_gallery', spawnAt: { x: 10, y: 16 } },
    // museum_hall -> museum_basement: enter near top door (8,0), spawn 1 below
    'london_museum_hall_door_0_8': { targetCity: 'london', targetRoom: 'museum_basement', spawnAt: { x: 8, y: 1 }, requiresFlag: 'london_has_research_pass' },
    // museum_gallery -> museum_hall: return near top-right door (21,0), spawn 1 below
    'london_museum_gallery_door_10_17': { targetCity: 'london', targetRoom: 'museum_hall', spawnAt: { x: 20, y: 1 } },
    // museum_basement -> museum_hall: return near left door (0,8), spawn 1 right
    'london_museum_basement_door_8_0': { targetCity: 'london', targetRoom: 'museum_hall', spawnAt: { x: 1, y: 8 } },

    // === ROME ===
    // main -> colosseum: enter near bottom door (11,17), spawn 1 above
    'rome_door_24_12': { targetCity: 'rome', targetRoom: 'colosseum', spawnAt: { x: 11, y: 16 } },
    // colosseum -> main: return near colosseum entrance (24,12)
    'rome_colosseum_door_11_17': { targetCity: 'rome', targetRoom: 'main', spawnAt: { x: 24, y: 13 } },
    // colosseum -> catacombs_upper: enter near top door (9,0), spawn 1 below
    'rome_colosseum_door_21_8': { targetCity: 'rome', targetRoom: 'catacombs_upper', spawnAt: { x: 9, y: 1 }, requiresFlag: 'rome_have_key' },
    // catacombs_upper -> colosseum: return near right door (21,8), spawn 1 left
    'rome_catacombs_upper_door_9_0': { targetCity: 'rome', targetRoom: 'colosseum', spawnAt: { x: 20, y: 8 } },
    // catacombs_upper -> catacombs_lower: enter near top door (7,0), spawn 1 below
    'rome_catacombs_upper_door_9_15': { targetCity: 'rome', targetRoom: 'catacombs_lower', spawnAt: { x: 7, y: 1 } },
    // catacombs_lower -> catacombs_upper: return near bottom door (9,15), spawn 1 above
    'rome_catacombs_lower_door_7_0': { targetCity: 'rome', targetRoom: 'catacombs_upper', spawnAt: { x: 9, y: 14 } },

    // === MARRAKECH ===
    // main -> souk: enter near bottom door (12,19), spawn 1 above
    'marrakech_door_24_19': { targetCity: 'marrakech', targetRoom: 'souk', spawnAt: { x: 12, y: 18 } },
    // main -> oasis: enter near bottom door (10,15), spawn 1 above
    'marrakech_door_48_20': { targetCity: 'marrakech', targetRoom: 'oasis', spawnAt: { x: 10, y: 14 }, requiresFlag: 'marrakech_has_amulet' },
    // souk -> main: return near souk entrance (24,19), 1 tile above door
    'marrakech_souk_door_12_19': { targetCity: 'marrakech', targetRoom: 'main', spawnAt: { x: 24, y: 18 } },
    // souk -> riad: enter near bottom door (8,13), spawn 1 above
    'marrakech_souk_door_23_0': { targetCity: 'marrakech', targetRoom: 'riad', spawnAt: { x: 8, y: 12 } },
    // riad -> souk: return near top-right door (23,0), spawn 1 below
    'marrakech_riad_door_8_13': { targetCity: 'marrakech', targetRoom: 'souk', spawnAt: { x: 22, y: 1 } },
    // oasis -> main: return near oasis entrance (48,20) on east border
    'marrakech_oasis_door_10_15': { targetCity: 'marrakech', targetRoom: 'main', spawnAt: { x: 47, y: 20 } },

    // === TOKYO ===
    // main -> shrine: enter near bottom door (9,15), spawn 1 above
    'tokyo_door_24_10': { targetCity: 'tokyo', targetRoom: 'shrine', spawnAt: { x: 9, y: 14 } },
    // shrine -> main: return near shrine entrance (24,10)
    'tokyo_shrine_door_9_15': { targetCity: 'tokyo', targetRoom: 'main', spawnAt: { x: 24, y: 11 } },
    // shrine -> bamboo_forest: enter near bottom door (11,19), spawn 1 above
    'tokyo_shrine_door_9_0': { targetCity: 'tokyo', targetRoom: 'bamboo_forest', spawnAt: { x: 11, y: 18 }, requiresFlag: 'tokyo_riddle_solved' },
    // bamboo_forest -> shrine: return near top door (9,0), spawn 1 below
    'tokyo_bamboo_forest_door_11_19': { targetCity: 'tokyo', targetRoom: 'shrine', spawnAt: { x: 9, y: 1 } },
    // bamboo_forest -> sacred_garden: enter near bottom door (7,11), spawn 1 above
    'tokyo_bamboo_forest_door_11_0': { targetCity: 'tokyo', targetRoom: 'sacred_garden', spawnAt: { x: 7, y: 10 }, requiresFlag: 'tokyo_has_jade_key' },
    // sacred_garden -> bamboo_forest: return near top door (11,0), spawn 1 below
    'tokyo_sacred_garden_door_7_11': { targetCity: 'tokyo', targetRoom: 'bamboo_forest', spawnAt: { x: 11, y: 1 } }
};

// Helper to create empty map arrays
function makeArrays(w, h, groundFill) {
    return {
        ground: Array(h).fill(null).map(() => Array(w).fill(groundFill)),
        walls: Array(h).fill(null).map(() => Array(w).fill(-1)),
        decor: Array(h).fill(null).map(() => Array(w).fill(-1))
    };
}

// ======================================================================
// Paris Main Map
// ======================================================================
function generateParis() {
    const W = 50, H = 40;
    const ground = Array(H).fill(null).map(() => Array(W).fill(0));
    const walls = Array(H).fill(null).map(() => Array(W).fill(-1));
    const decor = Array(H).fill(null).map(() => Array(W).fill(-1));

    // Seine river (rows 16-18)
    for (let x = 0; x < W; x++) {
        for (let r = 16; r <= 18; r++) { ground[r][x] = 2; walls[r][x] = 2; }
    }
    for (let x = 22; x <= 26; x++) { for (let r = 16; r <= 18; r++) { ground[r][x] = 0; walls[r][x] = -1; decor[r][x] = 25; } }
    for (let x = 38; x <= 42; x++) { for (let r = 16; r <= 18; r++) { ground[r][x] = 0; walls[r][x] = -1; decor[r][x] = 25; } }

    // Jardin du Luxembourg (top-left)
    for (let y = 1; y < 10; y++) for (let x = 1; x < 14; x++) ground[y][x] = 1;
    walls[1][2] = 16; walls[1][6] = 16; walls[1][10] = 16; walls[1][13] = 16;
    walls[3][3] = 16; walls[3][8] = 16; walls[3][12] = 16;
    walls[5][1] = 16; walls[5][5] = 16; walls[5][10] = 16;
    walls[7][3] = 16; walls[7][7] = 16; walls[7][13] = 16;
    walls[9][2] = 16; walls[9][9] = 16;
    decor[2][4] = 17; decor[4][7] = 17; decor[6][3] = 17; decor[2][11] = 17;
    decor[4][9] = 17; decor[8][6] = 17; decor[6][12] = 17;
    decor[4][4] = 27; decor[6][8] = 27; decor[8][3] = 27;
    decor[5][7] = 20; // park chest

    // Eiffel Tower plaza (top-center)
    for (let y = 1; y < 10; y++) for (let x = 18; x < 31; x++) ground[y][x] = 5;
    // Eiffel Tower — section-specific tiles (PNGs in src/assets/tiles/)
    walls[1][23] = 66; walls[1][24] = 67; walls[1][25] = 68; walls[1][26] = 69; // spire
    walls[2][23] = 70; walls[2][24] = 71; walls[2][25] = 72; walls[2][26] = 73; // upper
    walls[3][23] = 70; walls[3][24] = 71; walls[3][25] = 72; walls[3][26] = 73; // upper (repeat)
    walls[4][22] = 74; walls[4][23] = 74; walls[4][24] = 75; walls[4][25] = 76; walls[4][26] = 77; walls[4][27] = 77; // deck
    walls[5][22] = 74; walls[5][27] = 77; // arch legs
    walls[6][21] = 74; walls[6][28] = 77; // base legs
    decor[9][19] = 31; decor[9][22] = 31; decor[9][27] = 31; decor[9][30] = 31;
    walls[8][24] = 19;
    decor[9][24] = 23; // Door to Eiffel Tower Ground Floor

    // Northern residential
    for (let y = 1; y < 6; y++) { for (let x = 33; x < 39; x++) walls[y][x] = 10; for (let x = 41; x < 47; x++) walls[y][x] = 8; }
    walls[5][36] = 23; walls[5][44] = 23;
    walls[1][34] = 30; walls[1][37] = 30; walls[1][42] = 30; walls[1][45] = 30;

    // Museum row
    for (let y = 7; y < 11; y++) for (let x = 33; x < 48; x++) walls[y][x] = 10;
    walls[10][38] = 23; walls[10][42] = 23;
    walls[7][35] = 30; walls[7][37] = 30; walls[7][40] = 30; walls[7][43] = 30; walls[7][46] = 30;

    // Main streets
    for (let x = 0; x < W; x++) { ground[13][x] = 0; ground[14][x] = 0; }
    for (let y = 0; y < H; y++) { ground[y][24] = 0; ground[y][25] = 0; }

    // South bank buildings
    for (let y = 21; y < 26; y++) for (let x = 2; x < 9; x++) walls[y][x] = 8;
    walls[25][5] = 23; walls[21][3] = 30; walls[21][5] = 30; walls[21][7] = 30;
    decor[21][2] = 29; decor[21][8] = 29; decor[20][5] = 22;

    for (let y = 21; y < 26; y++) for (let x = 11; x < 18; x++) walls[y][x] = 11;
    walls[25][14] = 23; walls[21][12] = 30; walls[21][14] = 30; walls[21][16] = 30;
    decor[21][11] = 29; decor[21][17] = 29;

    // Market square
    for (let y = 27; y < 33; y++) for (let x = 20; x < 31; x++) ground[y][x] = 4;
    walls[28][22] = 50; walls[28][25] = 50; walls[28][28] = 50;
    decor[29][23] = 17; decor[29][26] = 17;

    // South-east residential
    for (let y = 21; y < 26; y++) { for (let x = 33; x < 39; x++) walls[y][x] = 9; for (let x = 41; x < 48; x++) walls[y][x] = 8; }
    walls[25][36] = 23; walls[25][44] = 23;
    walls[21][34] = 30; walls[21][37] = 30; walls[21][42] = 30; walls[21][46] = 30;

    // Grandmother's house
    for (let y = 27; y < 32; y++) for (let x = 40; x < 48; x++) walls[y][x] = 8;
    walls[31][44] = 23; walls[27][42] = 30; walls[27][45] = 30; decor[26][44] = 22;

    // Southern buildings
    for (let y = 33; y < 37; y++) {
        for (let x = 2; x < 10; x++) walls[y][x] = 9;
        for (let x = 12; x < 20; x++) walls[y][x] = 8;
        for (let x = 30; x < 38; x++) walls[y][x] = 11;
        for (let x = 40; x < 48; x++) walls[y][x] = 9;
    }
    walls[36][6] = 23; walls[36][16] = 23; walls[36][34] = 23; walls[36][44] = 23;

    // Street lamps
    decor[14][5] = 28; decor[14][12] = 28; decor[14][18] = 28;
    decor[14][30] = 28; decor[14][36] = 28; decor[14][44] = 28;
    decor[20][8] = 28; decor[20][16] = 28; decor[20][24] = 28;
    decor[20][34] = 28; decor[20][44] = 28;
    decor[32][5] = 28; decor[32][15] = 28; decor[32][25] = 28;
    decor[32][35] = 28; decor[32][45] = 28;

    // Flowers
    decor[15][5] = 17; decor[15][10] = 17; decor[15][15] = 17;
    decor[15][30] = 17; decor[15][35] = 17; decor[15][45] = 17;
    decor[19][8] = 17; decor[19][16] = 17; decor[19][33] = 17; decor[19][42] = 17;

    // Extra flowers along the Seine banks
    decor[15][20] = 17; decor[15][40] = 17;
    decor[19][5] = 17; decor[19][12] = 17; decor[19][25] = 17; decor[19][38] = 17;

    // Park benches in open areas
    decor[26][6] = 27; decor[26][12] = 27; decor[30][10] = 27;

    // More awnings on south bank buildings
    decor[21][4] = 29; decor[21][6] = 29; decor[21][14] = 29; decor[21][16] = 29;

    // Signs at key intersections
    decor[13][24] = 22; decor[26][25] = 22;

    // Flower planters along main streets
    decor[13][8] = 17; decor[13][16] = 17; decor[13][32] = 17; decor[13][40] = 17;

    // Extra trees in Jardin du Luxembourg gaps
    walls[2][5] = 16; walls[4][2] = 16; walls[6][11] = 16; walls[8][8] = 16;

    // Fence along Seine north bank
    decor[15][22] = 31; decor[15][26] = 31; decor[15][38] = 31; decor[15][42] = 31;

    // Fountain
    walls[34][24] = 18; walls[34][25] = 18;

    // ── Dense enrichment ──

    // Tidy park: south-west (neat rectangular lawn with fence border)
    for (let y = 26; y < 32; y++) for (let x = 2; x < 10; x++) {
        if (walls[y][x] === -1 && ground[y][x] === 0) ground[y][x] = 1;
    }
    decor[26][2] = 31; decor[26][5] = 31; decor[26][9] = 31;
    decor[31][2] = 31; decor[31][5] = 31; decor[31][9] = 31;

    // Tidy park: south-east (matching rectangular lawn)
    for (let y = 26; y < 32; y++) for (let x = 32; x < 39; x++) {
        if (walls[y][x] === -1 && ground[y][x] === 0) ground[y][x] = 1;
    }
    decor[26][32] = 31; decor[26][35] = 31; decor[26][38] = 31;
    decor[31][32] = 31; decor[31][35] = 31; decor[31][38] = 31;

    // Cobble paths connecting market to residential (no random dirt)
    for (let x = 10; x < 20; x++) { ground[27][x] = 4; ground[28][x] = 4; }
    for (let x = 31; x < 40; x++) { ground[27][x] = 4; ground[28][x] = 4; }

    // Sand promenade along Seine banks (refined, uniform)
    for (let x = 1; x < 22; x++) ground[15][x] = 3;
    for (let x = 27; x < 38; x++) ground[15][x] = 3;
    for (let x = 43; x < W-1; x++) ground[15][x] = 3;
    for (let x = 1; x < 22; x++) ground[19][x] = 3;
    for (let x = 27; x < 38; x++) ground[19][x] = 3;
    for (let x = 43; x < W-1; x++) ground[19][x] = 3;

    // Bookshop row along road
    walls[11][4] = 26; walls[11][8] = 26; walls[11][14] = 26;
    walls[11][36] = 26; walls[11][42] = 26; walls[11][46] = 26;

    // More fences along park edges and Eiffel plaza
    decor[10][19] = 31; decor[10][22] = 31;
    decor[10][2] = 31; decor[10][5] = 31; decor[10][8] = 31; decor[10][11] = 31;

    // Dense flowers: south sidewalks, open ground
    decor[26][3] = 17; decor[26][8] = 17; decor[26][14] = 17; decor[26][18] = 17;
    decor[26][28] = 17; decor[26][33] = 17; decor[26][38] = 17; decor[26][46] = 17;
    decor[30][4] = 17; decor[30][8] = 17; decor[30][14] = 17; decor[30][20] = 17;
    decor[30][28] = 17; decor[30][34] = 17; decor[30][40] = 17; decor[30][46] = 17;
    decor[37][4] = 17; decor[37][8] = 17; decor[37][14] = 17; decor[37][20] = 17;
    decor[37][28] = 17; decor[37][36] = 17; decor[37][42] = 17; decor[37][46] = 17;
    decor[11][16] = 17; decor[11][20] = 17; decor[11][32] = 17;

    // Benches along south sidewalks
    decor[26][10] = 27; decor[26][20] = 27; decor[26][36] = 27; decor[26][42] = 27;
    decor[30][6] = 27; decor[30][16] = 27; decor[30][22] = 27; decor[30][36] = 27;
    decor[37][10] = 27; decor[37][18] = 27; decor[37][30] = 27; decor[37][40] = 27;

    // Awnings on ALL building fronts
    decor[33][3] = 29; decor[33][7] = 29; decor[33][13] = 29; decor[33][17] = 29;
    decor[33][31] = 29; decor[33][35] = 29; decor[33][41] = 29; decor[33][45] = 29;
    decor[21][34] = 29; decor[21][36] = 29; decor[21][42] = 29; decor[21][46] = 29;

    // Windows on buildings missing them
    walls[33][4] = 30; walls[33][8] = 30; walls[33][14] = 30; walls[33][18] = 30;
    walls[33][32] = 30; walls[33][36] = 30; walls[33][42] = 30; walls[33][46] = 30;
    walls[27][41] = 30; walls[27][43] = 30; walls[27][46] = 30;
    walls[21][35] = 30; walls[21][44] = 30;

    // Statues: market square, museum row, boulevards, parks
    walls[30][25] = 19; walls[6][36] = 19;
    walls[20][10] = 19; walls[20][40] = 19;
    walls[28][6] = 19; walls[28][36] = 19;
    walls[12][20] = 19; walls[12][28] = 19;

    // Tree-lined boulevard (row 12 open sidewalk)
    walls[12][4] = 16; walls[12][10] = 16; walls[12][14] = 16;
    walls[12][30] = 16; walls[12][36] = 16; walls[12][42] = 16;

    // Extra trees in south grass patches
    walls[28][4] = 16; walls[28][8] = 16; walls[29][34] = 16; walls[29][38] = 16;

    // Curated Parisian decor — lamps at regular intervals along streets
    decor[11][6] = 28; decor[11][10] = 28; decor[11][24] = 28; decor[11][38] = 28; decor[11][44] = 28;
    decor[26][16] = 28; decor[26][30] = 28; decor[26][40] = 28;
    decor[30][26] = 28; decor[30][42] = 28;
    decor[37][6] = 28; decor[37][16] = 28; decor[37][24] = 28; decor[37][34] = 28; decor[37][44] = 28;

    // Flowers in parks (tidy rows inside fenced areas, not random)
    for (let x = 3; x <= 8; x += 2) { decor[27][x] = 17; decor[30][x] = 17; }
    for (let x = 33; x <= 38; x += 2) { decor[27][x] = 17; decor[30][x] = 17; }

    // Benches in parks (aligned, not scattered)
    decor[28][4] = 27; decor[28][8] = 27; decor[29][34] = 27; decor[29][38] = 27;
    decor[37][10] = 27; decor[37][18] = 27; decor[37][30] = 27; decor[37][40] = 27;

    // Fences along Eiffel plaza and boulevard
    decor[12][6] = 31; decor[12][16] = 31; decor[12][32] = 31; decor[12][38] = 31; decor[12][44] = 31;

    // Borders
    for (let y = 0; y < H; y++) { walls[y][0] = 16; walls[y][W-1] = 16; }
    for (let x = 0; x < W; x++) { walls[0][x] = 16; walls[H-1][x] = 16; }
    walls[H-1][24] = -1; walls[H-1][25] = -1; walls[H-1][26] = -1;
    walls[0][24] = -1; walls[0][25] = -1;

    CITIES.paris.ground = ground;
    CITIES.paris.walls = walls;
    CITIES.paris.decor = decor;
}

// Paris: Eiffel Tower Ground Floor (20x15)
function generateParisEiffelGround() {
    const W = 20, H = 15;
    const { ground, walls, decor } = makeArrays(W, H, 5);
    for (let y = 0; y < H; y++) { walls[y][0] = 10; walls[y][W-1] = 10; }
    for (let x = 0; x < W; x++) { walls[0][x] = 10; walls[H-1][x] = 10; }
    walls[2][3] = 24; walls[2][4] = 24; walls[3][3] = 24; walls[3][4] = 24;
    walls[2][15] = 24; walls[2][16] = 24; walls[3][15] = 24; walls[3][16] = 24;
    walls[6][5] = 31; walls[6][8] = 31; walls[6][11] = 31; walls[6][14] = 31;
    walls[8][5] = 31; walls[8][8] = 31; walls[8][11] = 31; walls[8][14] = 31;
    for (let x = 7; x < 13; x++) walls[3][x] = 10;
    walls[4][10] = 30;
    for (let x = 1; x < W-1; x++) ground[7][x] = 7;
    decor[4][2] = 28; decor[4][17] = 28; decor[10][5] = 28; decor[10][14] = 28;
    decor[1][10] = 22;
    decor[0][10] = 23; walls[0][10] = -1;
    decor[H-1][10] = 23; walls[H-1][10] = -1;
    CITIES.paris.rooms.eiffel_ground = {
        width: W, height: H, playerStart: { x: 10, y: 13 },
        ground, walls, decor,
        displayName: 'Eiffel Tower - Ground Floor',
        description: 'The bustling ground floor'
    };
}

// Paris: Eiffel Tower 1st Floor (18x14)
function generateParisEiffelFirst() {
    const W = 18, H = 14;
    const { ground, walls, decor } = makeArrays(W, H, 5);
    for (let y = 0; y < H; y++) { walls[y][0] = 24; walls[y][W-1] = 24; }
    for (let x = 0; x < W; x++) { walls[0][x] = 24; walls[H-1][x] = 24; }
    for (let x = 1; x < W-1; x++) { ground[3][x] = 7; ground[7][x] = 7; ground[10][x] = 7; }
    walls[2][2] = 31; walls[2][15] = 31; walls[5][2] = 31; walls[5][15] = 31;
    walls[9][4] = 27; walls[9][8] = 27; walls[9][13] = 27;
    decor[4][3] = 28; decor[4][14] = 28; decor[8][3] = 28; decor[8][14] = 28;
    decor[H-1][9] = 23; walls[H-1][9] = -1;
    decor[0][9] = 23; walls[0][9] = -1;
    CITIES.paris.rooms.eiffel_first = {
        width: W, height: H, playerStart: { x: 9, y: 12 },
        ground, walls, decor,
        displayName: 'Eiffel Tower - 1st Floor',
        description: 'A viewing platform with a cafe'
    };
}

// Paris: Eiffel Tower Top (12x10)
function generateParisEiffelTop() {
    const W = 12, H = 10;
    const { ground, walls, decor } = makeArrays(W, H, 5);
    for (let y = 0; y < H; y++) { walls[y][0] = 24; walls[y][W-1] = 24; }
    for (let x = 0; x < W; x++) { walls[0][x] = 24; walls[H-1][x] = 24; }
    walls[1][3] = 31; walls[1][8] = 31;
    walls[2][9] = 19; // telescope
    decor[3][6] = 20; // chest: Madeleine's Letter
    decor[1][6] = 22; // sign
    decor[4][2] = 17; decor[4][9] = 17;
    decor[H-1][6] = 23; walls[H-1][6] = -1;
    CITIES.paris.rooms.eiffel_top = {
        width: W, height: H, playerStart: { x: 6, y: 8 },
        ground, walls, decor,
        displayName: 'Eiffel Tower - Top',
        description: 'The observation deck'
    };
}

// ======================================================================
// London Main Map
// ======================================================================
function generateLondon() {
    const W = 50, H = 40;
    const ground = Array(H).fill(null).map(() => Array(W).fill(39));
    const walls = Array(H).fill(null).map(() => Array(W).fill(-1));
    const decor = Array(H).fill(null).map(() => Array(W).fill(-1));

    // Thames (rows 18-21)
    for (let x = 0; x < W; x++) for (let r = 18; r <= 21; r++) { ground[r][x] = 2; walls[r][x] = 2; }
    for (let x = 22; x <= 27; x++) for (let r = 18; r <= 21; r++) { ground[r][x] = 39; walls[r][x] = -1; }
    for (let x = 38; x <= 42; x++) for (let r = 18; r <= 21; r++) { ground[r][x] = 39; walls[r][x] = -1; }

    // Green Park
    for (let y = 1; y < 8; y++) for (let x = 1; x < 12; x++) ground[y][x] = 37;
    walls[2][2] = 16; walls[2][6] = 16; walls[2][10] = 16;
    walls[4][4] = 16; walls[4][8] = 16;
    walls[6][2] = 16; walls[6][6] = 16; walls[6][10] = 16;
    decor[3][5] = 17; decor[5][3] = 17; decor[5][9] = 17; decor[3][8] = 27;

    // Big Ben
    for (let y = 1; y < 9; y++) for (let x = 38; x < 48; x++) ground[y][x] = 5;
    // Big Ben — section-specific tiles
    walls[1][42] = 78; walls[1][43] = 79; // spire
    walls[2][42] = 80; walls[2][43] = 81; // clock top
    walls[3][42] = 82; walls[3][43] = 83; // clock bottom
    walls[4][42] = 84; walls[4][43] = 85; // tower
    walls[5][41] = 84; walls[5][44] = 85; // base
    for (let y = 6; y < 9; y++) { for (let x = 39; x < 42; x++) walls[y][x] = 35; for (let x = 44; x < 47; x++) walls[y][x] = 35; }

    // British Museum (door goes to museum_hall)
    for (let y = 9; y < 16; y++) for (let x = 14; x < 35; x++) walls[y][x] = 34;
    walls[15][22] = -1; decor[15][22] = 23; // museum entrance door
    walls[15][23] = 23; walls[15][24] = 23;
    walls[9][16] = 30; walls[9][19] = 30; walls[9][22] = 30; walls[9][25] = 30;
    walls[9][28] = 30; walls[9][31] = 30; walls[9][33] = 30;
    walls[15][17] = 40; walls[15][20] = 40; walls[15][27] = 40; walls[15][30] = 40;
    decor[8][24] = 22;

    // Victorian terraces
    for (let y = 1; y < 5; y++) { for (let x = 14; x < 20; x++) walls[y][x] = 35; for (let x = 22; x < 28; x++) walls[y][x] = 11; for (let x = 30; x < 36; x++) walls[y][x] = 35; }
    walls[4][17] = 23; walls[4][25] = 36; walls[4][33] = 23;
    walls[1][15] = 30; walls[1][18] = 30; walls[1][23] = 30; walls[1][26] = 30; walls[1][31] = 30; walls[1][34] = 30;

    // South bank houses
    for (let y = 23; y < 28; y++) {
        for (let x = 2; x < 9; x++) walls[y][x] = 35;
        for (let x = 11; x < 18; x++) walls[y][x] = 11;
        for (let x = 20; x < 27; x++) walls[y][x] = 35;
        for (let x = 29; x < 36; x++) walls[y][x] = 9;
        for (let x = 38; x < 45; x++) walls[y][x] = 35;
    }
    walls[27][5] = 23; walls[27][14] = 36; walls[27][23] = 23; walls[27][32] = 23; walls[27][41] = 23;
    walls[23][3] = 30; walls[23][7] = 30; walls[23][12] = 30; walls[23][16] = 30;
    walls[23][21] = 30; walls[23][25] = 30; walls[23][30] = 30; walls[23][34] = 30;
    walls[23][39] = 30; walls[23][43] = 30;

    // Southern park
    for (let y = 30; y < 37; y++) for (let x = 2; x < 15; x++) ground[y][x] = 37;
    walls[31][4] = 16; walls[31][8] = 16; walls[31][12] = 16;
    walls[34][3] = 16; walls[34][7] = 16; walls[34][11] = 16;
    decor[32][6] = 17; decor[33][10] = 17;

    // More south houses
    for (let y = 30; y < 35; y++) { for (let x = 18; x < 25; x++) walls[y][x] = 11; for (let x = 27; x < 34; x++) walls[y][x] = 35; for (let x = 36; x < 43; x++) walls[y][x] = 9; }
    walls[34][21] = 23; walls[34][30] = 23; walls[34][39] = 23;

    walls[29][10] = 32; walls[36][30] = 32;
    decor[16][8] = 28; decor[16][18] = 28; decor[16][30] = 28; decor[16][40] = 28;
    decor[22][5] = 28; decor[22][15] = 28; decor[22][25] = 28; decor[22][35] = 28; decor[22][45] = 28;
    decor[29][8] = 28; decor[29][20] = 28; decor[29][35] = 28; decor[29][45] = 28;
    walls[36][25] = 18;

    // Extra phone boxes
    walls[17][3] = 32; walls[22][42] = 32;

    // More flowers in Green Park
    decor[2][4] = 17; decor[2][8] = 17; decor[4][3] = 17; decor[4][6] = 17; decor[4][10] = 17;
    decor[6][4] = 17; decor[6][8] = 17;

    // Park benches in Green Park
    decor[3][3] = 27; decor[5][7] = 27;

    // Extra park benches in southern park
    decor[33][5] = 27; decor[33][12] = 27; decor[35][8] = 27;

    // More flowers in southern park
    decor[31][6] = 17; decor[31][10] = 17; decor[34][5] = 17; decor[34][9] = 17; decor[35][12] = 17;

    // Statues near museum entrance
    walls[8][16] = 19; walls[8][31] = 19;

    // Additional street lamps
    decor[16][14] = 28; decor[16][24] = 28; decor[16][36] = 28;
    decor[29][14] = 28; decor[29][28] = 28; decor[29][42] = 28;

    // Signs
    decor[17][22] = 22; decor[29][24] = 22;

    // ── Dense enrichment ──

    // Ground variety: cobblestone accents near terraces
    for (let y = 1; y < 5; y++) for (let x = 12; x < 37; x++) { if (walls[y][x] === -1 && ground[y][x] === 39) ground[y][x] = 0; }
    // Grass patches near parks
    for (let y = 8; y < 17; y++) for (let x = 1; x < 13; x++) { if (walls[y][x] === -1 && ground[y][x] === 39) ground[y][x] = 37; }
    // Dirt paths in southern areas
    for (let x = 15; x < 48; x++) { ground[29][x] = 4; }
    for (let x = 1; x < 15; x++) { ground[29][x] = 0; }

    // Dense flowers in both parks
    decor[2][3] = 17; decor[2][5] = 17; decor[2][9] = 17; decor[2][11] = 17;
    decor[4][2] = 17; decor[4][5] = 17; decor[4][8] = 17; decor[4][11] = 17;
    decor[5][4] = 17; decor[5][7] = 17; decor[5][10] = 17;
    decor[7][3] = 17; decor[7][6] = 17; decor[7][9] = 17; decor[7][11] = 17;
    // Southern park flowers
    decor[30][4] = 17; decor[30][7] = 17; decor[30][11] = 17; decor[30][13] = 17;
    decor[32][3] = 17; decor[32][5] = 17; decor[32][8] = 17; decor[32][11] = 17; decor[32][13] = 17;
    decor[34][4] = 17; decor[34][7] = 17; decor[34][13] = 17;
    decor[35][3] = 17; decor[35][6] = 17; decor[35][10] = 17; decor[35][13] = 17;
    decor[36][5] = 17; decor[36][9] = 17; decor[36][13] = 17;
    // Street flowers
    decor[17][6] = 17; decor[17][12] = 17; decor[17][28] = 17; decor[17][36] = 17; decor[17][44] = 17;
    decor[28][6] = 17; decor[28][14] = 17; decor[28][24] = 17; decor[28][36] = 17; decor[28][44] = 17;

    // Park benches everywhere
    decor[3][2] = 27; decor[3][6] = 27; decor[3][10] = 27;
    decor[5][2] = 27; decor[5][8] = 27;
    decor[7][4] = 27; decor[7][8] = 27;
    decor[31][3] = 27; decor[31][7] = 27; decor[31][11] = 27;
    decor[33][4] = 27; decor[33][8] = 27;
    decor[35][5] = 27; decor[35][9] = 27;
    // Along Thames
    decor[17][8] = 27; decor[17][16] = 27; decor[17][32] = 27; decor[17][42] = 27;

    // More phone boxes
    walls[5][13] = 32; walls[17][46] = 32; walls[28][10] = 32;
    walls[35][20] = 32; walls[36][40] = 32; walls[9][13] = 32;

    // Fountains in parks
    walls[4][7] = 18; walls[33][9] = 18;

    // More statues
    walls[6][6] = 19; walls[3][42] = 19; walls[32][12] = 19; walls[36][36] = 19;

    // Fences around park perimeters
    for (let x = 1; x < 12; x += 3) { decor[1][x] = 31; decor[7][x] = 31; }
    for (let x = 2; x < 15; x += 3) { decor[30][x] = 31; decor[37][x] = 31; }

    // Trees — tree-lined streets and park density
    walls[9][3] = 16; walls[9][7] = 16; walls[9][11] = 16;
    walls[3][44] = 16; walls[5][46] = 16;
    walls[10][3] = 16; walls[10][7] = 16; walls[10][11] = 16;
    walls[32][4] = 16; walls[32][8] = 16; walls[32][12] = 16;
    walls[35][4] = 16; walls[35][8] = 16; walls[35][11] = 16;
    // Street trees
    walls[17][10] = 16; walls[17][20] = 16; walls[17][34] = 16; walls[17][44] = 16;
    walls[28][4] = 16; walls[28][12] = 16; walls[28][22] = 16; walls[28][32] = 16; walls[28][42] = 16;

    // Windows on south bank houses
    walls[23][4] = 30; walls[23][6] = 30; walls[23][13] = 30; walls[23][15] = 30;
    walls[23][22] = 30; walls[23][24] = 30; walls[23][31] = 30; walls[23][33] = 30;

    // More awnings
    decor[23][3] = 29; decor[23][8] = 29; decor[23][11] = 29; decor[23][17] = 29;
    decor[23][20] = 29; decor[23][26] = 29; decor[23][29] = 29; decor[23][35] = 29;
    decor[23][38] = 29; decor[23][44] = 29;

    // More lamps along under-lit streets
    decor[5][12] = 28; decor[8][13] = 28; decor[37][6] = 28; decor[37][12] = 28;
    decor[28][8] = 28; decor[28][18] = 28; decor[28][28] = 28; decor[28][38] = 28; decor[28][46] = 28;


    // === Additional enrichment pass ===
    // Ground variety on remaining pavement
    for (let y = 1; y < H-1; y++) for (let x = 1; x < W-1; x++) {
        if (ground[y][x] !== 39 || walls[y][x] !== -1 || decor[y][x] !== -1) continue;
        if (y >= 18 && y <= 21) continue; // protect Thames bridge tiles
        const h = (x * 5 + y * 11) % 13;
        if (h < 2) ground[y][x] = 0;
        else if (h === 2) ground[y][x] = 4;
    }
    // Scatter decor across remaining empty cells
    { const nz = [[12,35],[42,10],[8,29]];
    for (let y = 1; y < H-1; y++) for (let x = 1; x < W-1; x++) {
        if (walls[y][x] !== -1 || decor[y][x] !== -1 || ground[y][x] === 2) continue;
        let sk = false;
        for (const [nx,ny] of nz) { if (Math.abs(x-nx)<=2 && Math.abs(y-ny)<=2) { sk=true; break; } }
        if (sk || (x>=24 && x<=26 && y>=32 && y<=34)) continue;
        const h = (x*7 + y*13 + x*y) % 97;
        if (h < 8) decor[y][x] = 17;
        else if (h < 13) decor[y][x] = 28;
        else if (h < 17) decor[y][x] = 27;
        else if (h < 20) decor[y][x] = 31;
    } }

    for (let y = 0; y < H; y++) { walls[y][0] = 16; walls[y][W-1] = 16; }
    for (let x = 0; x < W; x++) { walls[0][x] = 16; walls[H-1][x] = 16; }
    walls[H-1][24] = -1; walls[H-1][25] = -1; walls[H-1][26] = -1;
    walls[0][24] = -1; walls[0][25] = -1;

    CITIES.london.ground = ground;
    CITIES.london.walls = walls;
    CITIES.london.decor = decor;
}

// London: Museum Entrance Hall (22x16)
function generateLondonMuseumHall() {
    const W = 22, H = 16;
    const { ground, walls, decor } = makeArrays(W, H, 44);
    for (let y = 0; y < H; y++) { walls[y][0] = 34; walls[y][W-1] = 34; }
    for (let x = 0; x < W; x++) { walls[0][x] = 34; walls[H-1][x] = 34; }
    walls[3][4] = 40; walls[3][9] = 40; walls[3][12] = 40; walls[3][17] = 40;
    walls[8][4] = 40; walls[8][9] = 40; walls[8][12] = 40; walls[8][17] = 40;
    walls[5][9] = 10; walls[5][10] = 10; walls[5][11] = 10; walls[5][12] = 10;
    walls[10][3] = 10; walls[10][4] = 10; walls[10][17] = 10; walls[10][18] = 10;
    decor[1][11] = 22;
    decor[2][2] = 28; decor[2][19] = 28; decor[12][2] = 28; decor[12][19] = 28;
    decor[H-1][11] = 23; walls[H-1][11] = -1;
    decor[0][21] = 23; walls[0][21] = -1;
    decor[8][0] = 23; walls[8][0] = -1;
    CITIES.london.rooms.museum_hall = {
        width: W, height: H, playerStart: { x: 11, y: 14 },
        ground, walls, decor,
        displayName: 'British Museum - Entrance Hall',
        description: 'The grand entrance hall'
    };
}

// London: Main Gallery (20x18)
function generateLondonMuseumGallery() {
    const W = 20, H = 18;
    const { ground, walls, decor } = makeArrays(W, H, 44);
    for (let y = 0; y < H; y++) { walls[y][0] = 34; walls[y][W-1] = 34; }
    for (let x = 0; x < W; x++) { walls[0][x] = 34; walls[H-1][x] = 34; }
    walls[3][3] = 10; walls[3][4] = 10; walls[3][5] = 10; walls[3][14] = 10; walls[3][15] = 10; walls[3][16] = 10;
    walls[7][3] = 10; walls[7][4] = 10; walls[7][15] = 10; walls[7][16] = 10;
    walls[11][5] = 10; walls[11][6] = 10; walls[11][13] = 10; walls[11][14] = 10;
    walls[5][2] = 19; walls[5][17] = 19; walls[9][2] = 19; walls[9][17] = 19;
    walls[6][9] = 27; walls[6][10] = 27; walls[13][9] = 27; walls[13][10] = 27;
    decor[2][5] = 28; decor[2][14] = 28; decor[10][5] = 28; decor[10][14] = 28;
    decor[1][10] = 22;
    decor[H-1][10] = 23; walls[H-1][10] = -1;
    CITIES.london.rooms.museum_gallery = {
        width: W, height: H, playerStart: { x: 10, y: 16 },
        ground, walls, decor,
        displayName: 'British Museum - Main Gallery',
        description: 'Ancient artifacts and exhibits'
    };
}

// London: Basement Archive (16x14)
function generateLondonMuseumBasement() {
    const W = 16, H = 14;
    const { ground, walls, decor } = makeArrays(W, H, 6);
    for (let y = 0; y < H; y++) { walls[y][0] = 9; walls[y][W-1] = 9; }
    for (let x = 0; x < W; x++) { walls[0][x] = 9; walls[H-1][x] = 9; }
    walls[2][2] = 9; walls[2][3] = 9; walls[2][4] = 9; walls[2][11] = 9; walls[2][12] = 9; walls[2][13] = 9;
    walls[5][2] = 9; walls[5][3] = 9; walls[5][12] = 9; walls[5][13] = 9;
    walls[8][2] = 9; walls[8][3] = 9; walls[8][4] = 9; walls[8][11] = 9; walls[8][12] = 9; walls[8][13] = 9;
    walls[10][3] = 10; walls[10][12] = 10;
    decor[6][8] = 20; // chest: Map Fragment
    decor[1][8] = 22; // sign
    decor[4][7] = 28; decor[9][7] = 28;
    decor[0][8] = 23; walls[0][8] = -1;
    CITIES.london.rooms.museum_basement = {
        width: W, height: H, playerStart: { x: 8, y: 2 },
        ground, walls, decor,
        displayName: 'British Museum - Basement Archive',
        description: 'Dusty archives and old collections'
    };
}

// ======================================================================
// Rome Main Map
// ======================================================================
function generateRome() {
    const W = 50, H = 40;
    const ground = Array(H).fill(null).map(() => Array(W).fill(43));
    const walls = Array(H).fill(null).map(() => Array(W).fill(-1));
    const decor = Array(H).fill(null).map(() => Array(W).fill(-1));

    // Pantheon
    for (let y = 1; y < 9; y++) for (let x = 15; x < 35; x++) ground[y][x] = 44;
    // Columns — capital at top row, base at bottom row
    for (let c = 15; c <= 34; c += 3) { walls[1][c] = 86; walls[8][c] = 88; }
    for (let x = 15; x < 35; x++) walls[1][x] = walls[1][x] === -1 ? 41 : walls[1][x];

    for (let y = 1; y < 6; y++) { for (let x = 2; x < 9; x++) walls[y][x] = 47; for (let x = 40; x < 48; x++) walls[y][x] = 14; }
    walls[5][5] = 23; walls[5][44] = 23;
    walls[1][3] = 30; walls[1][6] = 30; walls[1][41] = 30; walls[1][46] = 30;

    // Aqueduct
    for (let x = 1; x < W-1; x++) walls[10][x] = 41;
    walls[10][8] = -1; walls[10][16] = -1; walls[10][24] = -1; walls[10][32] = -1; walls[10][40] = -1;

    // Colosseum entrance area + door
    for (let y = 11; y < 14; y++) for (let x = 20; x < 29; x++) ground[y][x] = 41;
    decor[12][24] = 23; // door to colosseum room

    // Trevi Fountain plaza
    for (let y = 16; y < 24; y++) for (let x = 17; x < 33; x++) ground[y][x] = 44;
    for (let x = 20; x < 30; x++) walls[16][x] = 14;
    walls[18][24] = 18; walls[18][25] = 18; walls[19][24] = 18; walls[19][25] = 18;
    decor[17][24] = 19; decor[17][22] = 22;
    decor[22][30] = 20; // chest near fountain

    for (let y = 13; y < 18; y++) for (let x = 2; x < 10; x++) walls[y][x] = 46;
    walls[17][6] = 23; walls[13][3] = 30; walls[13][5] = 30; walls[13][8] = 30;
    decor[13][2] = 45; decor[13][9] = 45;

    for (let y = 13; y < 18; y++) for (let x = 38; x < 48; x++) walls[y][x] = 47;
    walls[17][42] = 23; walls[13][39] = 30; walls[13][42] = 30; walls[13][46] = 30;

    for (let y = 27; y < 32; y++) {
        for (let x = 2; x < 10; x++) walls[y][x] = 46;
        for (let x = 13; x < 20; x++) walls[y][x] = 47;
        for (let x = 23; x < 28; x++) walls[y][x] = 14;
        for (let x = 31; x < 38; x++) walls[y][x] = 46;
        for (let x = 40; x < 48; x++) walls[y][x] = 47;
    }
    walls[31][6] = 23; walls[31][16] = 23; walls[31][25] = 23; walls[31][34] = 23; walls[31][44] = 23;

    for (let x = 0; x < W; x++) { ground[12][x] = 0; ground[26][x] = 0; }
    for (let y = 0; y < H; y++) { ground[y][24] = 0; ground[y][25] = 0; }

    walls[1][12] = 16; walls[1][37] = 16;
    decor[12][5] = 17; decor[12][38] = 17; decor[26][10] = 17; decor[26][40] = 17;
    decor[27][2] = 45; decor[27][9] = 45; decor[27][31] = 45;
    decor[12][8] = 28; decor[12][16] = 28; decor[12][32] = 28; decor[12][42] = 28;
    decor[26][6] = 28; decor[26][18] = 28; decor[26][32] = 28; decor[26][44] = 28;
    decor[20][12] = 28; decor[20][36] = 28;
    walls[35][24] = 18; walls[35][25] = 18;

    // More vines on buildings
    decor[13][10] = 45; decor[13][38] = 45; decor[27][40] = 45; decor[27][47] = 45;
    decor[31][2] = 45; decor[31][9] = 45; decor[31][37] = 45;

    // Columns along Pantheon approach
    walls[8][18] = 88; walls[8][21] = 88; walls[8][27] = 88; walls[8][30] = 88; walls[8][33] = 88;

    // Flowers near Trevi Fountain
    decor[20][18] = 17; decor[20][20] = 17; decor[20][28] = 17; decor[20][30] = 17;
    decor[22][18] = 17; decor[22][32] = 17;

    // Extra flowers along streets
    decor[12][12] = 17; decor[12][20] = 17; decor[12][28] = 17; decor[12][44] = 17;
    decor[26][14] = 17; decor[26][22] = 17; decor[26][36] = 17;

    // Statues in open plazas
    walls[25][24] = 19; walls[14][8] = 19;

    // Additional lamps
    decor[12][10] = 28; decor[12][22] = 28; decor[12][36] = 28;
    decor[26][8] = 28; decor[26][24] = 28; decor[26][38] = 28;

    // Signs at crossroads
    decor[11][24] = 22; decor[25][24] = 22;

    // ── Dense enrichment ──

    // Ground variety: grass patches in side streets, temple floor extensions
    for (let y = 14; y < 16; y++) for (let x = 2; x < 10; x++) { if (walls[y][x] === -1) ground[y][x] = 1; }
    for (let y = 14; y < 16; y++) for (let x = 38; x < 48; x++) { if (walls[y][x] === -1) ground[y][x] = 1; }
    for (let y = 32; y < 38; y++) for (let x = 10; x < 13; x++) ground[y][x] = 1;
    for (let y = 32; y < 38; y++) for (let x = 38; x < 40; x++) ground[y][x] = 1;
    // Temple floor approach to Pantheon
    for (let y = 9; y < 12; y++) for (let x = 15; x < 35; x++) { if (walls[y][x] === -1) ground[y][x] = 44; }
    // Cobble accent paths
    for (let x = 2; x < 48; x++) ground[20][x] = 0;

    // Columns along main east-west streets
    walls[12][3] = 40; walls[12][7] = 40; walls[12][11] = 40;
    walls[12][30] = 40; walls[12][34] = 40; walls[12][38] = 40; walls[12][46] = 40;
    walls[26][3] = 40; walls[26][7] = 40; walls[26][11] = 40;
    walls[26][30] = 40; walls[26][34] = 40; walls[26][38] = 40; walls[26][46] = 40;
    // Column bases below Pantheon capitals
    for (let c = 15; c <= 34; c += 3) { if (walls[7][c] === -1) walls[7][c] = 88; }

    // More fountains — Rome should have many
    walls[6][6] = 18; walls[6][44] = 18; walls[24][8] = 18; walls[24][42] = 18;
    walls[34][10] = 18; walls[34][40] = 18;

    // Dense vines on residential wall edges
    decor[13][3] = 45; decor[13][8] = 45; decor[17][3] = 45; decor[17][8] = 45;
    decor[13][39] = 45; decor[13][46] = 45; decor[17][39] = 45; decor[17][46] = 45;
    decor[27][3] = 45; decor[27][7] = 45; decor[27][13] = 45; decor[27][19] = 45;
    decor[27][23] = 45; decor[27][27] = 45; decor[27][34] = 45; decor[27][41] = 45; decor[27][46] = 45;
    decor[31][3] = 45; decor[31][7] = 45; decor[31][13] = 45; decor[31][19] = 45;
    decor[31][34] = 45; decor[31][41] = 45; decor[31][46] = 45;

    // More statues at intersections and plazas
    walls[9][24] = 19; walls[14][24] = 19; walls[20][8] = 19; walls[20][42] = 19;
    walls[32][8] = 19; walls[32][42] = 19;

    // Dense flowers — lining plazas, near fountains, on paths
    decor[9][16] = 17; decor[9][18] = 17; decor[9][20] = 17; decor[9][28] = 17; decor[9][30] = 17; decor[9][32] = 17;
    decor[20][16] = 17; decor[20][22] = 17; decor[20][26] = 17; decor[20][32] = 17;
    decor[14][16] = 17; decor[14][20] = 17; decor[14][28] = 17; decor[14][32] = 17;
    decor[14][36] = 17; decor[14][40] = 17; decor[14][44] = 17;
    decor[24][16] = 17; decor[24][20] = 17; decor[24][28] = 17; decor[24][32] = 17;
    decor[24][36] = 17; decor[24][40] = 17; decor[24][44] = 17;
    decor[32][16] = 17; decor[32][20] = 17; decor[32][28] = 17; decor[32][36] = 17; decor[32][44] = 17;
    decor[36][8] = 17; decor[36][16] = 17; decor[36][28] = 17; decor[36][36] = 17; decor[36][44] = 17;

    // Terracotta ground accents near buildings
    for (let y = 18; y < 24; y++) { if (ground[y][10] === 43) ground[y][10] = 46; if (ground[y][36] === 43) ground[y][36] = 46; }

    // Park benches along streets
    decor[9][22] = 27; decor[14][10] = 27; decor[14][38] = 27;
    decor[20][14] = 27; decor[20][34] = 27;
    decor[24][10] = 27; decor[24][38] = 27;
    decor[32][10] = 27; decor[32][24] = 27; decor[32][38] = 27;

    // Trees in open areas
    walls[14][2] = 16; walls[14][48] = 16;
    walls[32][2] = 16; walls[32][12] = 16; walls[32][38] = 16; walls[32][48] = 16;
    walls[36][2] = 16; walls[36][12] = 16; walls[36][38] = 16; walls[36][48] = 16;

    // More lamps
    decor[9][18] = 28; decor[9][30] = 28; decor[14][6] = 28; decor[14][18] = 28; decor[14][30] = 28; decor[14][42] = 28;
    decor[20][6] = 28; decor[20][18] = 28; decor[20][30] = 28; decor[20][42] = 28;
    decor[24][6] = 28; decor[24][18] = 28; decor[24][30] = 28; decor[24][42] = 28;
    decor[32][6] = 28; decor[32][18] = 28; decor[32][30] = 28; decor[32][40] = 28;


    // === Additional enrichment pass ===
    // Ground variety on remaining warm stone
    for (let y = 1; y < H-1; y++) for (let x = 1; x < W-1; x++) {
        if (ground[y][x] !== 43 || walls[y][x] !== -1 || decor[y][x] !== -1) continue;
        const h = (x * 3 + y * 7) % 9;
        if (h < 2) ground[y][x] = 0;
        else if (h === 2) ground[y][x] = 1;
        else if (h === 3) ground[y][x] = 46;
    }
    // Scatter decor across remaining empty cells
    { const nz = [[35,35],[20,20],[8,12]];
    for (let y = 1; y < H-1; y++) for (let x = 1; x < W-1; x++) {
        if (walls[y][x] !== -1 || decor[y][x] !== -1 || ground[y][x] === 2) continue;
        let sk = false;
        for (const [nx,ny] of nz) { if (Math.abs(x-nx)<=2 && Math.abs(y-ny)<=2) { sk=true; break; } }
        if (sk || (x>=24 && x<=26 && y>=32 && y<=34)) continue;
        const h = (x*7 + y*13 + x*y) % 97;
        if (h < 14) decor[y][x] = 17;
        else if (h < 22) decor[y][x] = 28;
        else if (h < 28) decor[y][x] = 45;
        else if (h < 34) decor[y][x] = 27;
        else if (h < 40) decor[y][x] = 31;
    } }

    for (let y = 0; y < H; y++) { walls[y][0] = 16; walls[y][W-1] = 16; }
    for (let x = 0; x < W; x++) { walls[0][x] = 16; walls[H-1][x] = 16; }
    walls[H-1][24] = -1; walls[H-1][25] = -1; walls[H-1][26] = -1;
    walls[0][24] = -1; walls[0][25] = -1;

    CITIES.rome.ground = ground;
    CITIES.rome.walls = walls;
    CITIES.rome.decor = decor;
}

// Rome: Colosseum Entrance (22x18)
function generateRomeColosseum() {
    const W = 22, H = 18;
    const { ground, walls, decor } = makeArrays(W, H, 3);
    for (let y = 0; y < H; y++) { walls[y][0] = 41; walls[y][W-1] = 41; }
    for (let x = 0; x < W; x++) { walls[0][x] = 41; walls[H-1][x] = 41; }
    walls[3][4] = 40; walls[3][17] = 40; walls[7][6] = 40; walls[7][15] = 40;
    walls[5][1] = 41; walls[5][2] = 41; walls[5][19] = 41; walls[5][20] = 41;
    walls[10][1] = 41; walls[10][2] = 41; walls[10][19] = 41; walls[10][20] = 41;
    for (let x = 2; x < 6; x++) walls[2][x] = 41;
    for (let x = 16; x < 20; x++) walls[2][x] = 41;
    decor[1][11] = 22;
    decor[4][3] = 28; decor[4][18] = 28; decor[12][3] = 28; decor[12][18] = 28;
    decor[8][21] = 23; walls[8][21] = -1; // locked door to catacombs
    decor[H-1][11] = 23; walls[H-1][11] = -1; // door back
    CITIES.rome.rooms.colosseum = {
        width: W, height: H, playerStart: { x: 11, y: 16 },
        ground, walls, decor,
        displayName: 'The Colosseum',
        description: 'Ancient arena entrance'
    };
}

// Rome: Upper Catacombs (18x16)
function generateRomeCatacombsUpper() {
    const W = 18, H = 16;
    const { ground, walls, decor } = makeArrays(W, H, 5);
    for (let y = 0; y < H; y++) { walls[y][0] = 41; walls[y][W-1] = 41; }
    for (let x = 0; x < W; x++) { walls[0][x] = 41; walls[H-1][x] = 41; }
    walls[4][5] = 41; walls[4][6] = 41; walls[4][11] = 41; walls[4][12] = 41;
    walls[8][3] = 41; walls[8][4] = 41; walls[8][13] = 41; walls[8][14] = 41;
    walls[11][6] = 41; walls[11][7] = 41; walls[11][10] = 41; walls[11][11] = 41;
    for (let y = 3; y < 7; y++) walls[y][8] = 41;
    for (let x = 6; x < 12; x++) walls[6][x] = 41;
    walls[6][9] = -1;
    decor[2][3] = 28; decor[2][14] = 28; decor[7][2] = 28; decor[7][15] = 28; decor[13][4] = 28; decor[13][13] = 28;
    decor[3][2] = 45; decor[5][15] = 45; decor[10][2] = 45;
    decor[1][9] = 22;
    decor[0][9] = 23; walls[0][9] = -1;
    decor[H-1][9] = 23; walls[H-1][9] = -1;
    CITIES.rome.rooms.catacombs_upper = {
        width: W, height: H, playerStart: { x: 9, y: 2 },
        ground, walls, decor,
        displayName: 'Upper Catacombs',
        description: 'Dark tunnels beneath the Colosseum'
    };
}

// Rome: Lower Catacombs (14x12)
function generateRomeCatacombsLower() {
    const W = 14, H = 12;
    const { ground, walls, decor } = makeArrays(W, H, 5);
    for (let y = 0; y < H; y++) { walls[y][0] = 41; walls[y][W-1] = 41; }
    for (let x = 0; x < W; x++) { walls[0][x] = 41; walls[H-1][x] = 41; }
    ground[4][3] = 2; walls[4][3] = 2; ground[4][4] = 2; walls[4][4] = 2;
    ground[7][9] = 2; walls[7][9] = 2; ground[7][10] = 2; walls[7][10] = 2;
    walls[3][5] = 41; walls[3][8] = 41; walls[6][3] = 41; walls[6][10] = 41; walls[9][5] = 41; walls[9][8] = 41;
    decor[5][7] = 20; // chest: Hidden Book
    decor[1][7] = 22;
    decor[3][2] = 28; decor[3][11] = 28; decor[8][2] = 28; decor[8][11] = 28;
    decor[0][7] = 23; walls[0][7] = -1;
    CITIES.rome.rooms.catacombs_lower = {
        width: W, height: H, playerStart: { x: 7, y: 2 },
        ground, walls, decor,
        displayName: 'Lower Catacombs',
        description: 'Deep beneath the ruins'
    };
}

// ======================================================================
// Marrakech Main Map
// ======================================================================
function generateMarrakech() {
    const W = 50, H = 40;
    const ground = Array(H).fill(null).map(() => Array(W).fill(48));
    const walls = Array(H).fill(null).map(() => Array(W).fill(-1));
    const decor = Array(H).fill(null).map(() => Array(W).fill(-1));

    for (let y = 0; y < H; y++) { ground[y][12] = 55; ground[y][13] = 55; ground[y][24] = 55; ground[y][25] = 55; ground[y][36] = 55; ground[y][37] = 55; }
    for (let x = 0; x < W; x++) { ground[9][x] = 55; ground[10][x] = 55; ground[19][x] = 55; ground[20][x] = 55; ground[29][x] = 55; ground[30][x] = 55; }

    for (let y = 13; y < 27; y++) for (let x = 16; x < 34; x++) ground[y][x] = 49;
    walls[15][18] = 50; walls[15][21] = 50; walls[15][24] = 50; walls[15][28] = 50; walls[15][31] = 50;
    walls[17][19] = 50; walls[17][25] = 50; walls[17][30] = 50;
    decor[15][20] = 51; decor[15][27] = 51; decor[17][22] = 51; decor[17][28] = 51;
    decor[19][24] = 23; // door to Grand Souk

    for (let y = 1; y < 7; y++) {
        for (let x = 1; x < 8; x++) walls[y][x] = 12;
        for (let x = 16; x < 22; x++) walls[y][x] = 53;
        for (let x = 28; x < 34; x++) walls[y][x] = 53;
        for (let x = 42; x < 48; x++) walls[y][x] = 12;
    }
    walls[6][4] = 23; walls[6][19] = 54; walls[6][31] = 54; walls[6][45] = 23;

    for (let y = 2; y < 7; y++) for (let x = 38; x < 41; x++) ground[y][x] = 49;

    for (let y = 13; y < 18; y++) for (let x = 36; x < 44; x++) walls[y][x] = 53;
    walls[17][40] = 54; decor[12][40] = 22;

    decor[20][48] = 23; // door to Desert Oasis (east border)

    for (let y = 31; y < 37; y++) {
        for (let x = 1; x < 8; x++) walls[y][x] = 53;
        for (let x = 16; x < 22; x++) walls[y][x] = 12;
        for (let x = 28; x < 34; x++) walls[y][x] = 53;
        for (let x = 42; x < 48; x++) walls[y][x] = 12;
    }
    walls[31][4] = 23; walls[31][19] = 54; walls[31][31] = 54; walls[31][45] = 23;

    // Palm trees — top canopy and trunk variants
    walls[1][10] = 89; walls[1][14] = 89; walls[1][35] = 89; walls[1][40] = 89;
    walls[12][5] = 89; walls[12][44] = 89; walls[28][3] = 89; walls[28][46] = 89;
    walls[31][10] = 89; walls[31][38] = 89;

    // Extra palm trees along streets
    walls[9][5] = 89; walls[9][44] = 89; walls[19][3] = 89; walls[19][46] = 89;
    walls[29][8] = 89; walls[29][42] = 89;

    for (let y = 22; y < 27; y++) for (let x = 38; x < 46; x++) ground[y][x] = 49;
    decor[23][39] = 51; decor[23][42] = 51; decor[25][40] = 51; decor[25][44] = 51;

    decor[24][25] = 21; // portal
    walls[20][24] = 18; walls[20][25] = 18;
    decor[19][18] = 91; decor[19][30] = 92; // mosaic star / diamond variants

    // More fabric drapes between buildings
    decor[6][8] = 51; decor[6][10] = 51; decor[6][39] = 51; decor[6][41] = 51;
    decor[31][8] = 51; decor[31][12] = 51; decor[31][40] = 51; decor[31][43] = 51;

    // Extra mosaic tiles in walkways
    decor[10][16] = 91; decor[10][33] = 92; decor[20][16] = 92; decor[20][33] = 91;
    decor[30][18] = 91; decor[30][31] = 92;

    // Market stalls in side areas
    walls[22][5] = 50; walls[22][8] = 50; walls[28][16] = 50; walls[28][33] = 50;

    // Flowers in courtyard areas
    decor[3][10] = 17; decor[3][14] = 17; decor[3][35] = 17; decor[3][40] = 17;
    decor[8][18] = 17; decor[8][31] = 17;
    decor[23][17] = 17; decor[23][32] = 17;

    // Street lamps
    decor[10][8] = 28; decor[10][18] = 28; decor[10][31] = 28; decor[10][42] = 28;
    decor[20][8] = 28; decor[20][18] = 28; decor[20][31] = 28; decor[20][42] = 28;
    decor[30][8] = 28; decor[30][18] = 28; decor[30][42] = 28;

    // ── Dense enrichment ──

    // Ground variety: mosaic paths between buildings
    for (let x = 1; x < 12; x++) { ground[7][x] = 49; ground[8][x] = 49; }
    for (let x = 38; x < 48; x++) { ground[7][x] = 49; ground[8][x] = 49; }
    for (let x = 1; x < 12; x++) { ground[27][x] = 49; ground[28][x] = 49; }
    for (let x = 38; x < 48; x++) { ground[27][x] = 49; ground[28][x] = 49; }
    // Sand corners
    for (let y = 1; y < 6; y++) for (let x = 8; x < 12; x++) ground[y][x] = 3;
    for (let y = 1; y < 6; y++) for (let x = 35; x < 38; x++) ground[y][x] = 3;
    for (let y = 34; y < 38; y++) for (let x = 8; x < 12; x++) ground[y][x] = 3;
    for (let y = 34; y < 38; y++) for (let x = 35; x < 38; x++) ground[y][x] = 3;

    // Palm trunks below every palm top
    for (let y = 1; y < H-2; y++) for (let x = 1; x < W-1; x++) {
        if (walls[y][x] === 89 && y+1 < H-1 && walls[y+1][x] === -1) walls[y+1][x] = 90;
    }

    // More market stalls along marketplace edges and side areas
    walls[15][5] = 50; walls[15][8] = 50; walls[15][42] = 50; walls[15][44] = 50;
    walls[17][5] = 50; walls[17][8] = 50; walls[17][42] = 50; walls[17][44] = 50;
    walls[25][5] = 50; walls[25][8] = 50; walls[25][42] = 50; walls[25][44] = 50;

    // More fabric drapes between buildings
    decor[7][3] = 51; decor[7][6] = 51; decor[7][43] = 51; decor[7][46] = 51;
    decor[11][3] = 51; decor[11][6] = 51; decor[11][43] = 51; decor[11][46] = 51;
    decor[18][3] = 51; decor[18][6] = 51; decor[18][43] = 51; decor[18][46] = 51;
    decor[27][3] = 51; decor[27][6] = 51; decor[27][43] = 51; decor[27][46] = 51;
    decor[15][16] = 51; decor[15][33] = 51; decor[17][16] = 51; decor[17][33] = 51;

    // Dense mosaic tiles in walkways
    decor[7][16] = 91; decor[7][20] = 92; decor[7][28] = 91; decor[7][33] = 92;
    decor[8][18] = 92; decor[8][22] = 91; decor[8][26] = 92; decor[8][30] = 91; decor[8][34] = 92;
    decor[11][16] = 92; decor[11][20] = 91; decor[11][28] = 92; decor[11][33] = 91;
    decor[18][16] = 91; decor[18][20] = 92; decor[18][28] = 91; decor[18][34] = 92;
    decor[27][16] = 91; decor[27][20] = 92; decor[27][28] = 91; decor[27][33] = 92;

    // Dense flowers in courtyard and open areas
    decor[2][3] = 17; decor[2][6] = 17; decor[2][43] = 17; decor[2][46] = 17;
    decor[4][10] = 17; decor[4][38] = 17;
    decor[7][10] = 17; decor[7][14] = 17; decor[7][36] = 17; decor[7][40] = 17;
    decor[11][10] = 17; decor[11][14] = 17; decor[11][36] = 17; decor[11][40] = 17;
    decor[18][10] = 17; decor[18][14] = 17; decor[18][36] = 17; decor[18][40] = 17;
    decor[27][10] = 17; decor[27][14] = 17; decor[27][36] = 17; decor[27][40] = 17;
    decor[33][3] = 17; decor[33][6] = 17; decor[33][10] = 17;
    decor[33][38] = 17; decor[33][43] = 17; decor[33][46] = 17;
    decor[36][3] = 17; decor[36][6] = 17; decor[36][43] = 17; decor[36][46] = 17;

    // More fountains — water features in courtyards
    walls[4][25] = 18; walls[34][25] = 18;

    // Statues at Souk entrance and main crossroads
    walls[12][25] = 19; walls[28][25] = 19;

    // Dark archways on building fronts
    decor[6][16] = 54; decor[6][28] = 54; decor[6][34] = 54;
    decor[31][16] = 54; decor[31][28] = 54; decor[31][34] = 54;

    // More lamps filling streets
    decor[7][8] = 28; decor[7][18] = 28; decor[7][31] = 28; decor[7][42] = 28;
    decor[11][8] = 28; decor[11][18] = 28; decor[11][31] = 28; decor[11][42] = 28;
    decor[18][8] = 28; decor[18][18] = 28; decor[18][31] = 28; decor[18][42] = 28;
    decor[27][8] = 28; decor[27][18] = 28; decor[27][31] = 28; decor[27][42] = 28;
    decor[33][8] = 28; decor[33][18] = 28; decor[33][31] = 28; decor[33][42] = 28;

    // Benches in open areas
    decor[8][4] = 27; decor[8][10] = 27; decor[8][40] = 27; decor[8][46] = 27;
    decor[11][10] = 27; decor[18][10] = 27; decor[27][10] = 27;
    decor[36][10] = 27; decor[36][40] = 27;


    // === Additional enrichment pass ===
    // Ground variety on remaining red clay
    for (let y = 1; y < H-1; y++) for (let x = 1; x < W-1; x++) {
        if (ground[y][x] !== 48 || walls[y][x] !== -1 || decor[y][x] !== -1) continue;
        const h = (x * 3 + y * 7) % 9;
        if (h < 2) ground[y][x] = 55;
        else if (h === 2) ground[y][x] = 3;
        else if (h === 3) ground[y][x] = 49;
    }
    // Scatter decor across remaining empty cells
    { const nz = [[25,22],[13,22],[19,16]];
    for (let y = 1; y < H-1; y++) for (let x = 1; x < W-1; x++) {
        if (walls[y][x] !== -1 || decor[y][x] !== -1 || ground[y][x] === 2) continue;
        let sk = false;
        for (const [nx,ny] of nz) { if (Math.abs(x-nx)<=2 && Math.abs(y-ny)<=2) { sk=true; break; } }
        if (sk || (x>=24 && x<=26 && y>=32 && y<=34)) continue;
        const h = (x*7 + y*13 + x*y) % 97;
        if (h < 12) decor[y][x] = 17;
        else if (h < 20) decor[y][x] = 28;
        else if (h < 27) decor[y][x] = 91 + (x+y)%2;
        else if (h < 33) decor[y][x] = 51;
        else if (h < 38) decor[y][x] = 27;
        else if (h < 42) decor[y][x] = 31;
    } }

    for (let y = 0; y < H; y++) { walls[y][0] = 53; walls[y][W-1] = 53; }
    for (let x = 0; x < W; x++) { walls[0][x] = 53; walls[H-1][x] = 53; }
    walls[H-1][24] = -1; walls[H-1][25] = -1; walls[H-1][26] = -1;
    walls[0][24] = -1; walls[0][25] = -1;
    walls[20][W-1] = -1; // open east border for oasis door

    CITIES.marrakech.ground = ground;
    CITIES.marrakech.walls = walls;
    CITIES.marrakech.decor = decor;
}

// Marrakech: Grand Souk (24x20)
function generateMarrakechSouk() {
    const W = 24, H = 20;
    const { ground, walls, decor } = makeArrays(W, H, 49);
    for (let y = 0; y < H; y++) { walls[y][0] = 53; walls[y][W-1] = 53; }
    for (let x = 0; x < W; x++) { walls[0][x] = 53; walls[H-1][x] = 53; }
    for (let y = 1; y < H-1; y++) { ground[y][6] = 55; ground[y][7] = 55; ground[y][16] = 55; ground[y][17] = 55; }
    for (let x = 1; x < W-1; x++) { ground[5][x] = 55; ground[10][x] = 55; ground[14][x] = 55; }
    walls[3][3] = 50; walls[3][10] = 50; walls[3][20] = 50;
    walls[7][4] = 50; walls[7][13] = 50; walls[7][19] = 50;
    walls[12][3] = 50; walls[12][11] = 50; walls[12][20] = 50;
    decor[2][6] = 28; decor[2][17] = 28; decor[8][6] = 28; decor[8][17] = 28; decor[15][6] = 28; decor[15][17] = 28;
    decor[3][5] = 51; decor[7][8] = 51; decor[12][5] = 51; decor[3][15] = 51; decor[7][18] = 51; decor[12][15] = 51;
    decor[H-1][12] = 23; walls[H-1][12] = -1;
    decor[0][23] = 23; walls[0][23] = -1;
    CITIES.marrakech.rooms.souk = {
        width: W, height: H, playerStart: { x: 12, y: 18 },
        ground, walls, decor,
        displayName: 'Grand Souk',
        description: 'The labyrinthine marketplace'
    };
}

// Marrakech: Hidden Riad (16x14)
function generateMarrakechRiad() {
    const W = 16, H = 14;
    const { ground, walls, decor } = makeArrays(W, H, 49);
    for (let y = 0; y < H; y++) { walls[y][0] = 53; walls[y][W-1] = 53; }
    for (let x = 0; x < W; x++) { walls[0][x] = 53; walls[H-1][x] = 53; }
    for (let y = 4; y < 10; y++) for (let x = 4; x < 12; x++) ground[y][x] = 44;
    walls[6][7] = 18; walls[6][8] = 18;
    walls[4][4] = 16; walls[4][11] = 16; walls[9][4] = 16; walls[9][11] = 16;
    decor[5][6] = 17; decor[5][9] = 17; decor[8][6] = 17; decor[8][9] = 17;
    decor[7][10] = 20; // chest: Nadia's Amulet
    decor[2][8] = 49; decor[11][8] = 49;
    decor[3][3] = 28; decor[3][12] = 28;
    decor[H-1][8] = 23; walls[H-1][8] = -1;
    CITIES.marrakech.rooms.riad = {
        width: W, height: H, playerStart: { x: 8, y: 12 },
        ground, walls, decor,
        displayName: 'Hidden Riad',
        description: 'A secret courtyard garden'
    };
}

// Marrakech: Desert Oasis (20x16)
function generateMarrakechOasis() {
    const W = 20, H = 16;
    const { ground, walls, decor } = makeArrays(W, H, 3);
    for (let y = 0; y < H; y++) { walls[y][0] = 53; walls[y][W-1] = 53; }
    for (let x = 0; x < W; x++) { walls[0][x] = 53; walls[H-1][x] = 53; }
    for (let y = 5; y < 9; y++) for (let x = 7; x < 13; x++) { ground[y][x] = 2; walls[y][x] = 2; }
    walls[5][9] = -1; walls[5][10] = -1; ground[5][9] = 3; ground[5][10] = 3;
    walls[8][9] = -1; walls[8][10] = -1; ground[8][9] = 3; ground[8][10] = 3;
    walls[2][4] = 52; walls[2][15] = 52; walls[10][3] = 52; walls[10][16] = 52; walls[3][9] = 52; walls[3][10] = 52;
    walls[11][14] = 53; walls[11][15] = 53; walls[11][16] = 53; walls[12][14] = 53;
    decor[12][10] = 28;
    decor[10][10] = 20; // chest: Portal Stone
    decor[4][10] = 21; // portal
    decor[H-1][10] = 23; walls[H-1][10] = -1;
    CITIES.marrakech.rooms.oasis = {
        width: W, height: H, playerStart: { x: 10, y: 14 },
        ground, walls, decor,
        displayName: 'Desert Oasis',
        description: 'A hidden oasis in the desert'
    };
}

// ======================================================================
// Tokyo Main Map
// ======================================================================
function generateTokyo() {
    const W = 50, H = 40;
    const ground = Array(H).fill(null).map(() => Array(W).fill(62));
    const walls = Array(H).fill(null).map(() => Array(W).fill(-1));
    const decor = Array(H).fill(null).map(() => Array(W).fill(-1));

    for (let y = 0; y < H; y++) { ground[y][12] = 3; ground[y][13] = 3; ground[y][24] = 3; ground[y][25] = 3; ground[y][36] = 3; ground[y][37] = 3; }
    for (let x = 0; x < W; x++) { ground[9][x] = 3; ground[10][x] = 3; ground[19][x] = 3; ground[20][x] = 3; ground[29][x] = 3; ground[30][x] = 3; }

    // Cherry blossom garden (top)
    for (let y = 1; y < 8; y++) for (let x = 16; x < 34; x++) ground[y][x] = 59;
    // Cherry blossom trees — canopy L/R variants
    walls[1][18] = 93; walls[1][22] = 93; walls[1][26] = 94; walls[1][30] = 94;
    walls[3][20] = 93; walls[3][24] = 94; walls[3][28] = 93; walls[3][32] = 94;
    walls[5][17] = 93; walls[5][23] = 94; walls[5][29] = 93; walls[5][33] = 94;
    decor[2][21] = 17; decor[2][27] = 17; decor[4][19] = 17; decor[4][31] = 17;
    decor[6][22] = 17; decor[6][28] = 17;
    // Torii gate — beam L/R
    walls[7][24] = 96; walls[7][25] = 97;
    decor[4][25] = 21; // portal
    decor[3][25] = 20; // treasure chest

    // Shrine area (left)
    for (let y = 11; y < 17; y++) for (let x = 2; x < 12; x++) ground[y][x] = 57;
    walls[11][4] = 96; walls[11][7] = 97; walls[11][10] = 96; // torii beam variants
    for (let y = 12; y < 16; y++) { for (let x = 3; x < 6; x++) walls[y][x] = 58; for (let x = 8; x < 11; x++) walls[y][x] = 58; }
    walls[15][4] = 23; walls[15][9] = 23;
    decor[13][6] = 60; decor[13][7] = 60;

    // Door to Shrine Entrance room
    decor[10][24] = 23;

    // Zen garden (right)
    for (let y = 11; y < 17; y++) for (let x = 38; x < 48; x++) ground[y][x] = 3;
    walls[13][40] = 19; walls[14][44] = 19; walls[12][46] = 19;
    walls[11][38] = 63; walls[11][42] = 63; walls[11][47] = 63;
    walls[16][38] = 63; walls[16][43] = 63; walls[16][47] = 63;

    // Neon district
    for (let y = 22; y < 28; y++) {
        for (let x = 2; x < 10; x++) walls[y][x] = 58;
        for (let x = 14; x < 22; x++) walls[y][x] = 57;
        for (let x = 28; x < 36; x++) walls[y][x] = 58;
        for (let x = 38; x < 46; x++) walls[y][x] = 57;
    }
    walls[27][6] = 23; walls[27][18] = 23; walls[27][32] = 23; walls[27][42] = 23;
    walls[22][3] = 30; walls[22][8] = 30; walls[22][15] = 30; walls[22][20] = 30;
    walls[22][29] = 30; walls[22][34] = 30; walls[22][39] = 30; walls[22][44] = 30;

    // Southern buildings
    for (let y = 32; y < 37; y++) {
        for (let x = 2; x < 10; x++) walls[y][x] = 57;
        for (let x = 14; x < 22; x++) walls[y][x] = 58;
        for (let x = 28; x < 36; x++) walls[y][x] = 57;
        for (let x = 38; x < 46; x++) walls[y][x] = 58;
    }
    walls[36][6] = 23; walls[36][18] = 23; walls[36][32] = 23; walls[36][42] = 23;

    // Bamboo
    walls[1][2] = 63; walls[1][3] = 63; walls[2][2] = 63; walls[2][4] = 63;
    walls[1][46] = 63; walls[1][47] = 63; walls[2][47] = 63; walls[2][45] = 63;
    walls[1][8] = 63; walls[1][40] = 63;
    walls[31][2] = 63; walls[31][3] = 63; walls[31][47] = 63; walls[31][46] = 63;

    // Extra bamboo clusters along borders
    walls[8][2] = 63; walls[8][3] = 63; walls[8][46] = 63; walls[8][47] = 63;
    walls[18][2] = 63; walls[18][3] = 63; walls[18][46] = 63; walls[18][47] = 63;
    walls[28][2] = 63; walls[28][3] = 63; walls[28][46] = 63; walls[28][47] = 63;

    // Lanterns
    decor[10][6] = 60; decor[10][10] = 60; decor[10][40] = 60; decor[10][44] = 60;
    decor[20][8] = 60; decor[20][16] = 60; decor[20][32] = 60; decor[20][42] = 60;
    decor[30][6] = 60; decor[30][18] = 60; decor[30][36] = 60; decor[30][44] = 60;

    // Extra lanterns along all main roads
    decor[10][16] = 60; decor[10][26] = 60; decor[10][32] = 60;
    decor[20][6] = 60; decor[20][24] = 60; decor[20][36] = 60;
    decor[30][10] = 60; decor[30][24] = 60; decor[30][42] = 60;

    // More cherry trees along paths
    walls[7][16] = 93; walls[7][34] = 94;
    walls[18][16] = 93; walls[18][34] = 94;

    // Flowers along streets
    decor[9][8] = 17; decor[9][16] = 17; decor[9][32] = 17; decor[9][44] = 17;
    decor[19][8] = 17; decor[19][16] = 17; decor[19][32] = 17; decor[19][44] = 17;
    decor[29][8] = 17; decor[29][16] = 17; decor[29][32] = 17; decor[29][44] = 17;

    // Zen garden stones (statues) in open areas
    walls[14][14] = 19; walls[14][36] = 19;

    // Signs near shrine and districts
    decor[10][22] = 22; decor[20][22] = 22;

    // ── Dense enrichment ──

    // Ground variety: jade paths connecting shrine to cherry garden
    for (let y = 8; y < 12; y++) { ground[y][14] = 59; ground[y][15] = 59; ground[y][34] = 59; ground[y][35] = 59; }
    // Sand extensions in zen garden
    for (let y = 11; y < 17; y++) for (let x = 36; x < 38; x++) ground[y][x] = 3;
    // Grass patches in open areas
    for (let y = 17; y < 19; y++) for (let x = 2; x < 12; x++) { if (walls[y][x] === -1) ground[y][x] = 1; }
    for (let y = 17; y < 19; y++) for (let x = 38; x < 48; x++) { if (walls[y][x] === -1) ground[y][x] = 1; }
    for (let y = 28; y < 30; y++) for (let x = 2; x < 12; x++) { if (walls[y][x] === -1) ground[y][x] = 1; }
    for (let y = 28; y < 30; y++) for (let x = 38; x < 48; x++) { if (walls[y][x] === -1) ground[y][x] = 1; }
    // Cobble accents in neon district
    for (let x = 10; x < 14; x++) ground[21][x] = 0;
    for (let x = 22; x < 28; x++) ground[21][x] = 0;
    for (let x = 34; x < 38; x++) ground[21][x] = 0;

    // Dense bamboo clusters at all borders and corners
    walls[4][2] = 63; walls[4][3] = 63; walls[4][46] = 63; walls[4][47] = 63;
    walls[6][2] = 63; walls[6][47] = 63;
    walls[12][2] = 63; walls[12][3] = 63; walls[12][46] = 63; walls[12][47] = 63;
    walls[16][2] = 63; walls[16][3] = 63; walls[16][46] = 63; walls[16][47] = 63;
    walls[22][2] = 63; walls[22][47] = 63;
    walls[26][2] = 63; walls[26][47] = 63;
    walls[34][2] = 63; walls[34][3] = 63; walls[34][46] = 63; walls[34][47] = 63;
    walls[36][2] = 63; walls[36][3] = 63; walls[36][46] = 63; walls[36][47] = 63;

    // More cherry trees along paths
    walls[9][18] = 93; walls[9][22] = 94; walls[9][28] = 93; walls[9][32] = 94;
    walls[19][16] = 93; walls[19][22] = 94; walls[19][28] = 93; walls[19][34] = 94;
    walls[29][16] = 93; walls[29][22] = 94; walls[29][28] = 93; walls[29][34] = 94;
    // Cherry trunks below canopies where space allows
    for (let y = 1; y < H-2; y++) for (let x = 1; x < W-1; x++) {
        if ((walls[y][x] === 93 || walls[y][x] === 94) && y+1 < H-1 && walls[y+1][x] === -1 && decor[y+1][x] === -1) walls[y+1][x] = 95;
    }

    // Dense lanterns — every intersection and along paths
    decor[4][14] = 60; decor[4][36] = 60;
    decor[6][14] = 60; decor[6][36] = 60;
    decor[9][6] = 60; decor[9][10] = 60; decor[9][14] = 60; decor[9][36] = 60; decor[9][40] = 60;
    decor[14][12] = 60; decor[14][16] = 60; decor[14][34] = 60; decor[14][38] = 60;
    decor[17][6] = 60; decor[17][10] = 60; decor[17][40] = 60; decor[17][44] = 60;
    decor[19][6] = 60; decor[19][10] = 60; decor[19][14] = 60; decor[19][36] = 60; decor[19][40] = 60;
    decor[21][6] = 60; decor[21][14] = 60; decor[21][36] = 60; decor[21][44] = 60;
    decor[29][6] = 60; decor[29][14] = 60; decor[29][36] = 60;
    decor[31][6] = 60; decor[31][10] = 60; decor[31][40] = 60; decor[31][44] = 60;
    decor[37][6] = 60; decor[37][14] = 60; decor[37][36] = 60; decor[37][44] = 60;

    // Torii accents at major entrances
    walls[9][24] = 96; walls[9][25] = 97;
    walls[19][24] = 96; walls[19][25] = 97;
    walls[29][24] = 96; walls[29][25] = 97;
    walls[37][24] = 98; walls[37][25] = 98;

    // Fountains — zen garden water feature and near shrine
    walls[13][8] = 18;

    // Dense flowers — cherry garden floor, along jade paths, near buildings
    decor[2][18] = 17; decor[2][20] = 17; decor[2][24] = 17; decor[2][30] = 17; decor[2][32] = 17;
    decor[4][17] = 17; decor[4][20] = 17; decor[4][22] = 17; decor[4][28] = 17; decor[4][33] = 17;
    decor[6][18] = 17; decor[6][20] = 17; decor[6][24] = 17; decor[6][26] = 17; decor[6][30] = 17; decor[6][32] = 17;
    decor[8][18] = 17; decor[8][22] = 17; decor[8][28] = 17; decor[8][32] = 17;
    decor[14][4] = 17; decor[14][8] = 17; decor[14][40] = 17; decor[14][46] = 17;
    decor[17][8] = 17; decor[17][14] = 17; decor[17][36] = 17; decor[17][42] = 17;
    decor[21][8] = 17; decor[21][10] = 17; decor[21][40] = 17; decor[21][46] = 17;
    decor[28][6] = 17; decor[28][10] = 17; decor[28][40] = 17; decor[28][44] = 17;
    decor[31][8] = 17; decor[31][14] = 17; decor[31][36] = 17; decor[31][42] = 17;
    decor[37][8] = 17; decor[37][16] = 17; decor[37][34] = 17; decor[37][42] = 17;

    // Street lamps in neon district (28)
    decor[21][16] = 28; decor[21][22] = 28; decor[21][28] = 28; decor[21][34] = 28;
    decor[31][16] = 28; decor[31][22] = 28; decor[31][28] = 28; decor[31][34] = 28;

    // Zen garden stones (more statues)
    walls[13][40] = 19; walls[15][46] = 19;

    // Benches along paths
    decor[8][14] = 27; decor[8][36] = 27; decor[17][12] = 27; decor[17][38] = 27;
    decor[28][12] = 27; decor[28][38] = 27; decor[37][12] = 27; decor[37][38] = 27;


    // === Additional enrichment pass ===
    // Ground variety on remaining slate
    for (let y = 1; y < H-1; y++) for (let x = 1; x < W-1; x++) {
        if (ground[y][x] !== 62 || walls[y][x] !== -1 || decor[y][x] !== -1) continue;
        const h = (x * 3 + y * 7) % 9;
        if (h < 2) ground[y][x] = 59;
        else if (h === 2) ground[y][x] = 3;
        else if (h === 3) ground[y][x] = 1;
    }
    // Scatter decor across remaining empty cells
    { const nz = [[6,15],[35,31],[42,15],[18,21]];
    for (let y = 1; y < H-1; y++) for (let x = 1; x < W-1; x++) {
        if (walls[y][x] !== -1 || decor[y][x] !== -1 || ground[y][x] === 2) continue;
        let sk = false;
        for (const [nx,ny] of nz) { if (Math.abs(x-nx)<=2 && Math.abs(y-ny)<=2) { sk=true; break; } }
        if (sk || (x>=24 && x<=26 && y>=32 && y<=34)) continue;
        const h = (x*7 + y*13 + x*y) % 97;
        if (h < 12) decor[y][x] = 17;
        else if (h < 20) decor[y][x] = 60;
        else if (h < 26) decor[y][x] = 28;
        else if (h < 31) decor[y][x] = 27;
        else if (h < 35) decor[y][x] = 31;
    } }

    for (let y = 0; y < H; y++) { walls[y][0] = 63; walls[y][W-1] = 63; }
    for (let x = 0; x < W; x++) { walls[0][x] = 63; walls[H-1][x] = 63; }
    walls[H-1][24] = -1; walls[H-1][25] = -1; walls[H-1][26] = -1;
    walls[0][24] = -1; walls[0][25] = -1;

    CITIES.tokyo.ground = ground;
    CITIES.tokyo.walls = walls;
    CITIES.tokyo.decor = decor;
}

// Tokyo: Shrine Entrance (18x16)
function generateTokyoShrine() {
    const W = 18, H = 16;
    const { ground, walls, decor } = makeArrays(W, H, 57);
    for (let y = 0; y < H; y++) { walls[y][0] = 58; walls[y][W-1] = 58; }
    for (let x = 0; x < W; x++) { walls[0][x] = 58; walls[H-1][x] = 58; }
    walls[12][7] = 61; walls[12][10] = 61;
    walls[3][8] = 19; walls[3][9] = 19;
    walls[5][9] = 10;
    decor[2][4] = 60; decor[2][13] = 60; decor[7][4] = 60; decor[7][13] = 60; decor[11][4] = 60; decor[11][13] = 60;
    for (let y = 6; y < 12; y++) { ground[y][8] = 3; ground[y][9] = 3; }
    decor[4][5] = 22; // sign with riddle
    decor[0][9] = 23; walls[0][9] = -1;
    decor[H-1][9] = 23; walls[H-1][9] = -1;
    CITIES.tokyo.rooms.shrine = {
        width: W, height: H, playerStart: { x: 9, y: 14 },
        ground, walls, decor,
        displayName: 'Shrine Entrance',
        description: 'An ancient shrine with a riddle'
    };
}

// Tokyo: Bamboo Forest (22x20)
function generateTokyoBambooForest() {
    const W = 22, H = 20;
    const { ground, walls, decor } = makeArrays(W, H, 1);
    for (let y = 0; y < H; y++) { walls[y][0] = 63; walls[y][W-1] = 63; }
    for (let x = 0; x < W; x++) { walls[0][x] = 63; walls[H-1][x] = 63; }
    // Maze walls
    for (let x = 2; x < 8; x++) walls[4][x] = 63;
    for (let x = 12; x < 19; x++) walls[4][x] = 63;
    for (let x = 1; x < 6; x++) walls[8][x] = 63;
    for (let x = 10; x < 15; x++) walls[8][x] = 63;
    for (let x = 18; x < 21; x++) walls[8][x] = 63;
    for (let x = 3; x < 10; x++) walls[12][x] = 63;
    for (let x = 14; x < 20; x++) walls[12][x] = 63;
    for (let x = 1; x < 5; x++) walls[16][x] = 63;
    for (let x = 8; x < 14; x++) walls[16][x] = 63;
    for (let x = 17; x < 21; x++) walls[16][x] = 63;
    // Openings
    walls[4][5] = -1; walls[8][3] = -1; walls[8][13] = -1;
    walls[12][7] = -1; walls[12][17] = -1; walls[16][3] = -1; walls[16][11] = -1;
    // Clearing
    for (let y = 9; y < 12; y++) for (let x = 9; x < 13; x++) ground[y][x] = 59;
    // Lanterns
    decor[3][3] = 60; decor[3][18] = 60; decor[10][5] = 60; decor[10][16] = 60; decor[15][7] = 60; decor[15][18] = 60;
    decor[6][9] = 17; decor[7][16] = 17; decor[13][4] = 17; decor[14][14] = 17;
    // Stream
    ground[6][14] = 2; walls[6][14] = 2; ground[6][15] = 2; walls[6][15] = 2; ground[7][15] = 2; walls[7][15] = 2;
    decor[H-1][11] = 23; walls[H-1][11] = -1;
    decor[0][11] = 23; walls[0][11] = -1;
    CITIES.tokyo.rooms.bamboo_forest = {
        width: W, height: H, playerStart: { x: 11, y: 18 },
        ground, walls, decor,
        displayName: 'Bamboo Forest',
        description: 'An enchanted maze of bamboo'
    };
}

// Tokyo: Sacred Garden (14x12)
function generateTokyoSacredGarden() {
    const W = 14, H = 12;
    const { ground, walls, decor } = makeArrays(W, H, 59);
    for (let y = 0; y < H; y++) { walls[y][0] = 56; walls[y][W-1] = 56; }
    for (let x = 0; x < W; x++) { walls[0][x] = 56; walls[H-1][x] = 56; }
    walls[2][3] = 56; walls[2][10] = 56; walls[5][5] = 56; walls[5][8] = 56; walls[8][3] = 56; walls[8][10] = 56;
    decor[3][5] = 17; decor[3][8] = 17; decor[6][3] = 17; decor[6][10] = 17; decor[9][5] = 17; decor[9][8] = 17;
    for (let y = 4; y < 8; y++) for (let x = 5; x < 9; x++) ground[y][x] = 57;
    decor[5][7] = 20; // chest: Gem of Understanding
    decor[3][7] = 22; // sign
    decor[9][7] = 21; // portal
    decor[H-1][7] = 23; walls[H-1][7] = -1;
    CITIES.tokyo.rooms.sacred_garden = {
        width: W, height: H, playerStart: { x: 7, y: 10 },
        ground, walls, decor,
        displayName: 'Sacred Garden',
        description: 'The heart of the cherry blossom garden'
    };
}

// Generate all city maps and rooms
generateParis();
generateParisEiffelGround();
generateParisEiffelFirst();
generateParisEiffelTop();
generateLondon();
generateLondonMuseumHall();
generateLondonMuseumGallery();
generateLondonMuseumBasement();
generateRome();
generateRomeColosseum();
generateRomeCatacombsUpper();
generateRomeCatacombsLower();
generateMarrakech();
generateMarrakechSouk();
generateMarrakechRiad();
generateMarrakechOasis();
generateTokyo();
generateTokyoShrine();
generateTokyoBambooForest();
generateTokyoSacredGarden();
