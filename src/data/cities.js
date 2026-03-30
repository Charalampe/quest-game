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
        music: 'paris_theme'
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
        music: 'london_theme'
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
        music: 'rome_theme'
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
        music: 'marrakech_theme'
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
        music: 'tokyo_theme'
    }
};

// ======================================================================
// Paris — Wider Seine, 2 bridges, expanded Eiffel plaza, Jardin du Luxembourg,
// winding Left Bank streets, market square, cafes, residential blocks
// ======================================================================
function generateParis() {
    const W = 50, H = 40;
    const ground = Array(H).fill(null).map(() => Array(W).fill(0)); // cobblestone
    const walls = Array(H).fill(null).map(() => Array(W).fill(-1));
    const decor = Array(H).fill(null).map(() => Array(W).fill(-1));

    // Seine river (rows 16-18, 3 tiles wide)
    for (let x = 0; x < W; x++) {
        for (let r = 16; r <= 18; r++) {
            ground[r][x] = 2;
            walls[r][x] = 2;
        }
    }
    // Bridge 1 at x=22-26 (main bridge)
    for (let x = 22; x <= 26; x++) {
        for (let r = 16; r <= 18; r++) {
            ground[r][x] = 0;
            walls[r][x] = -1;
            decor[r][x] = 25;
        }
    }
    // Bridge 2 at x=38-42
    for (let x = 38; x <= 42; x++) {
        for (let r = 16; r <= 18; r++) {
            ground[r][x] = 0;
            walls[r][x] = -1;
            decor[r][x] = 25;
        }
    }

    // === NORTH BANK (rows 1-15) ===

    // Jardin du Luxembourg (top-left, expanded park)
    for (let y = 1; y < 10; y++) {
        for (let x = 1; x < 14; x++) {
            ground[y][x] = 1;
        }
    }
    // Park trees
    walls[1][2] = 16; walls[1][6] = 16; walls[1][10] = 16; walls[1][13] = 16;
    walls[3][3] = 16; walls[3][8] = 16; walls[3][12] = 16;
    walls[5][1] = 16; walls[5][5] = 16; walls[5][10] = 16;
    walls[7][3] = 16; walls[7][7] = 16; walls[7][13] = 16;
    walls[9][2] = 16; walls[9][9] = 16;
    // Park flowers and benches
    decor[2][4] = 17; decor[4][7] = 17; decor[6][3] = 17; decor[2][11] = 17;
    decor[4][9] = 17; decor[8][6] = 17; decor[6][12] = 17;
    decor[4][4] = 27; decor[6][8] = 27; decor[8][3] = 27;
    // Park chest
    decor[5][7] = 20;

    // Eiffel Tower plaza (top-center, rows 1-10, cols 18-30)
    for (let y = 1; y < 10; y++) {
        for (let x = 18; x < 31; x++) {
            ground[y][x] = 5;
        }
    }
    // Eiffel tower structure
    walls[1][23] = 24; walls[1][24] = 24; walls[1][25] = 24; walls[1][26] = 24;
    walls[2][23] = 24; walls[2][24] = 24; walls[2][25] = 24; walls[2][26] = 24;
    walls[3][23] = 24; walls[3][24] = 24; walls[3][25] = 24; walls[3][26] = 24;
    walls[4][22] = 24; walls[4][23] = 24; walls[4][24] = 24; walls[4][25] = 24; walls[4][26] = 24; walls[4][27] = 24;
    walls[5][22] = 24; walls[5][27] = 24;
    walls[6][21] = 24; walls[6][28] = 24;
    // Fences around plaza
    decor[9][19] = 31; decor[9][22] = 31; decor[9][27] = 31; decor[9][30] = 31;
    // Statue near Eiffel tower
    walls[8][24] = 19;

    // Northern residential area (top-right)
    for (let y = 1; y < 6; y++) {
        for (let x = 33; x < 39; x++) walls[y][x] = 10;
        for (let x = 41; x < 47; x++) walls[y][x] = 8;
    }
    walls[5][36] = 23; walls[5][44] = 23;
    walls[1][34] = 30; walls[1][37] = 30; walls[1][42] = 30; walls[1][45] = 30;

    // Museum row (cols 33-48, rows 7-11)
    for (let y = 7; y < 11; y++) {
        for (let x = 33; x < 48; x++) walls[y][x] = 10;
    }
    walls[10][38] = 23; walls[10][42] = 23;
    walls[7][35] = 30; walls[7][37] = 30; walls[7][40] = 30; walls[7][43] = 30; walls[7][46] = 30;

    // === MAIN STREETS ===
    // Horizontal street (row 13-14)
    for (let x = 0; x < W; x++) { ground[13][x] = 0; ground[14][x] = 0; }
    // Vertical main boulevard
    for (let y = 0; y < H; y++) { ground[y][24] = 0; ground[y][25] = 0; }

    // === SOUTH BANK (rows 20-38) ===

    // Bookshop block (Left Bank, quest location)
    for (let y = 21; y < 26; y++) {
        for (let x = 2; x < 9; x++) walls[y][x] = 8;
    }
    walls[25][5] = 23;
    walls[21][3] = 30; walls[21][5] = 30; walls[21][7] = 30;
    decor[21][2] = 29; decor[21][8] = 29;
    decor[20][5] = 22; // bookshop sign

    // Cafe row
    for (let y = 21; y < 26; y++) {
        for (let x = 11; x < 18; x++) walls[y][x] = 11;
    }
    walls[25][14] = 23;
    walls[21][12] = 30; walls[21][14] = 30; walls[21][16] = 30;
    decor[21][11] = 29; decor[21][17] = 29;

    // Market square (cols 20-30, rows 27-32)
    for (let y = 27; y < 33; y++) {
        for (let x = 20; x < 31; x++) {
            ground[y][x] = 4; // dirt
        }
    }
    walls[28][22] = 50; walls[28][25] = 50; walls[28][28] = 50;
    decor[29][23] = 17; decor[29][26] = 17;

    // Residential blocks (south-east)
    for (let y = 21; y < 26; y++) {
        for (let x = 33; x < 39; x++) walls[y][x] = 9;
        for (let x = 41; x < 48; x++) walls[y][x] = 8;
    }
    walls[25][36] = 23; walls[25][44] = 23;
    walls[21][34] = 30; walls[21][37] = 30; walls[21][42] = 30; walls[21][46] = 30;

    // Grandmother's house (far right, south)
    for (let y = 27; y < 32; y++) {
        for (let x = 40; x < 48; x++) walls[y][x] = 8;
    }
    walls[31][44] = 23;
    walls[27][42] = 30; walls[27][45] = 30;
    decor[26][44] = 22;

    // Southern buildings
    for (let y = 33; y < 37; y++) {
        for (let x = 2; x < 10; x++) walls[y][x] = 9;
        for (let x = 12; x < 20; x++) walls[y][x] = 8;
        for (let x = 30; x < 38; x++) walls[y][x] = 11;
        for (let x = 40; x < 48; x++) walls[y][x] = 9;
    }
    walls[36][6] = 23; walls[36][16] = 23; walls[36][34] = 23; walls[36][44] = 23;

    // === STREET LAMPS ===
    decor[14][5] = 28; decor[14][12] = 28; decor[14][18] = 28;
    decor[14][30] = 28; decor[14][36] = 28; decor[14][44] = 28;
    decor[20][8] = 28; decor[20][16] = 28; decor[20][24] = 28;
    decor[20][34] = 28; decor[20][44] = 28;
    decor[32][5] = 28; decor[32][15] = 28; decor[32][25] = 28;
    decor[32][35] = 28; decor[32][45] = 28;

    // Flower beds along river bank
    decor[15][5] = 17; decor[15][10] = 17; decor[15][15] = 17;
    decor[15][30] = 17; decor[15][35] = 17; decor[15][45] = 17;
    decor[19][8] = 17; decor[19][16] = 17; decor[19][33] = 17; decor[19][42] = 17;

    // Fountain in main square
    walls[34][24] = 18; walls[34][25] = 18;

    // === BORDERS ===
    for (let y = 0; y < H; y++) { walls[y][0] = 16; walls[y][W - 1] = 16; }
    for (let x = 0; x < W; x++) { walls[0][x] = 16; walls[H - 1][x] = 16; }
    // South exit gap
    walls[H - 1][24] = -1; walls[H - 1][25] = -1; walls[H - 1][26] = -1;
    // North exit gap
    walls[0][24] = -1; walls[0][25] = -1;

    CITIES.paris.ground = ground;
    CITIES.paris.walls = walls;
    CITIES.paris.decor = decor;
}

// ======================================================================
// London — Wider Thames, Tower Bridge, Big Ben complex, expanded museum,
// Victorian terraces, parks, phone boxes
// ======================================================================
function generateLondon() {
    const W = 50, H = 40;
    const ground = Array(H).fill(null).map(() => Array(W).fill(39)); // pavement
    const walls = Array(H).fill(null).map(() => Array(W).fill(-1));
    const decor = Array(H).fill(null).map(() => Array(W).fill(-1));

    // Thames river (rows 18-21, 4 tiles wide)
    for (let x = 0; x < W; x++) {
        for (let r = 18; r <= 21; r++) {
            ground[r][x] = 2;
            walls[r][x] = 2;
        }
    }
    // Tower Bridge (x=22-27)
    for (let x = 22; x <= 27; x++) {
        for (let r = 18; r <= 21; r++) {
            ground[r][x] = 39;
            walls[r][x] = -1;
        }
    }
    // Second bridge (x=38-42)
    for (let x = 38; x <= 42; x++) {
        for (let r = 18; r <= 21; r++) {
            ground[r][x] = 39;
            walls[r][x] = -1;
        }
    }

    // === NORTH BANK ===

    // Green Park (top-left)
    for (let y = 1; y < 8; y++) {
        for (let x = 1; x < 12; x++) ground[y][x] = 37;
    }
    walls[2][2] = 16; walls[2][6] = 16; walls[2][10] = 16;
    walls[4][4] = 16; walls[4][8] = 16;
    walls[6][2] = 16; walls[6][6] = 16; walls[6][10] = 16;
    decor[3][5] = 17; decor[5][3] = 17; decor[5][9] = 17;
    decor[3][8] = 27;

    // Big Ben complex (top-right, rows 1-9, cols 38-48)
    for (let y = 1; y < 9; y++) {
        for (let x = 38; x < 48; x++) ground[y][x] = 5;
    }
    walls[1][42] = 33; walls[2][42] = 33; walls[3][42] = 33; walls[4][42] = 33;
    walls[1][43] = 33; walls[2][43] = 33; walls[3][43] = 33;
    walls[5][41] = 33; walls[5][44] = 33;
    // Guard post
    for (let y = 6; y < 9; y++) {
        for (let x = 39; x < 42; x++) walls[y][x] = 35;
        for (let x = 44; x < 47; x++) walls[y][x] = 35;
    }

    // British Museum (expanded, quest location, rows 9-16, cols 14-34)
    for (let y = 9; y < 16; y++) {
        for (let x = 14; x < 35; x++) walls[y][x] = 34;
    }
    walls[15][22] = 23; walls[15][23] = 23; walls[15][24] = 23;
    walls[9][16] = 30; walls[9][19] = 30; walls[9][22] = 30; walls[9][25] = 30;
    walls[9][28] = 30; walls[9][31] = 30; walls[9][33] = 30;
    // Museum columns at entrance
    walls[15][17] = 40; walls[15][20] = 40; walls[15][27] = 40; walls[15][30] = 40;
    decor[8][24] = 22; // museum sign

    // Victorian terraces (north side)
    for (let y = 1; y < 5; y++) {
        for (let x = 14; x < 20; x++) walls[y][x] = 35;
        for (let x = 22; x < 28; x++) walls[y][x] = 11;
        for (let x = 30; x < 36; x++) walls[y][x] = 35;
    }
    walls[4][17] = 23; walls[4][25] = 36; walls[4][33] = 23;
    walls[1][15] = 30; walls[1][18] = 30; walls[1][23] = 30; walls[1][26] = 30;
    walls[1][31] = 30; walls[1][34] = 30;

    // === SOUTH BANK ===

    // Row of houses (south, rows 23-28)
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
    for (let y = 30; y < 37; y++) {
        for (let x = 2; x < 15; x++) ground[y][x] = 37;
    }
    walls[31][4] = 16; walls[31][8] = 16; walls[31][12] = 16;
    walls[34][3] = 16; walls[34][7] = 16; walls[34][11] = 16;
    decor[32][6] = 17; decor[33][10] = 17;

    // More houses south
    for (let y = 30; y < 35; y++) {
        for (let x = 18; x < 25; x++) walls[y][x] = 11;
        for (let x = 27; x < 34; x++) walls[y][x] = 35;
        for (let x = 36; x < 43; x++) walls[y][x] = 9;
    }
    walls[34][21] = 23; walls[34][30] = 23; walls[34][39] = 23;

    // Phone boxes
    walls[29][10] = 32; walls[36][30] = 32;

    // Street lamps
    decor[16][8] = 28; decor[16][18] = 28; decor[16][30] = 28; decor[16][40] = 28;
    decor[22][5] = 28; decor[22][15] = 28; decor[22][25] = 28; decor[22][35] = 28; decor[22][45] = 28;
    decor[29][8] = 28; decor[29][20] = 28; decor[29][35] = 28; decor[29][45] = 28;

    // Fountain
    walls[36][25] = 18;

    // === BORDERS ===
    for (let y = 0; y < H; y++) { walls[y][0] = 16; walls[y][W - 1] = 16; }
    for (let x = 0; x < W; x++) { walls[0][x] = 16; walls[H - 1][x] = 16; }
    walls[H - 1][24] = -1; walls[H - 1][25] = -1; walls[H - 1][26] = -1;
    walls[0][24] = -1; walls[0][25] = -1;

    CITIES.london.ground = ground;
    CITIES.london.walls = walls;
    CITIES.london.decor = decor;
}

// ======================================================================
// Rome — Larger Colosseum, expanded Pantheon, Trevi Fountain plaza,
// aqueduct section, winding cobbled streets
// ======================================================================
function generateRome() {
    const W = 50, H = 40;
    const ground = Array(H).fill(null).map(() => Array(W).fill(43)); // warm stone
    const walls = Array(H).fill(null).map(() => Array(W).fill(-1));
    const decor = Array(H).fill(null).map(() => Array(W).fill(-1));

    // Pantheon / Temple area (top-center, rows 1-9, cols 15-34)
    for (let y = 1; y < 9; y++) {
        for (let x = 15; x < 35; x++) ground[y][x] = 44;
    }
    // Colonnade
    for (let c = 15; c <= 34; c += 3) {
        walls[1][c] = 40;
        walls[8][c] = 40;
    }
    // Back wall
    for (let x = 15; x < 35; x++) walls[1][x] = walls[1][x] === -1 ? 41 : walls[1][x];

    // Side buildings (flanking temple)
    for (let y = 1; y < 6; y++) {
        for (let x = 2; x < 9; x++) walls[y][x] = 47;
        for (let x = 40; x < 48; x++) walls[y][x] = 14;
    }
    walls[5][5] = 23; walls[5][44] = 23;
    walls[1][3] = 30; walls[1][6] = 30; walls[1][41] = 30; walls[1][46] = 30;

    // Aqueduct section (rows 10-11, spanning width)
    for (let x = 1; x < W - 1; x++) {
        walls[10][x] = 41;
    }
    // Arched openings
    walls[10][8] = -1; walls[10][16] = -1; walls[10][24] = -1;
    walls[10][32] = -1; walls[10][40] = -1;

    // Trevi Fountain plaza (center, rows 16-24, cols 17-32)
    for (let y = 16; y < 24; y++) {
        for (let x = 17; x < 33; x++) ground[y][x] = 44;
    }
    // Fountain backing wall
    for (let x = 20; x < 30; x++) walls[16][x] = 14;
    // Fountain water
    walls[18][24] = 18; walls[18][25] = 18;
    walls[19][24] = 18; walls[19][25] = 18;
    decor[17][24] = 19; // statue above fountain
    decor[17][22] = 22; // sign

    // Chest near fountain
    decor[22][30] = 20;

    // Buildings (west side)
    for (let y = 13; y < 18; y++) {
        for (let x = 2; x < 10; x++) walls[y][x] = 46;
    }
    walls[17][6] = 23;
    walls[13][3] = 30; walls[13][5] = 30; walls[13][8] = 30;
    decor[13][2] = 45; decor[13][9] = 45;

    // Buildings (east side)
    for (let y = 13; y < 18; y++) {
        for (let x = 38; x < 48; x++) walls[y][x] = 47;
    }
    walls[17][42] = 23;
    walls[13][39] = 30; walls[13][42] = 30; walls[13][46] = 30;

    // Southern buildings
    for (let y = 27; y < 32; y++) {
        for (let x = 2; x < 10; x++) walls[y][x] = 46;
        for (let x = 13; x < 20; x++) walls[y][x] = 47;
        for (let x = 23; x < 28; x++) walls[y][x] = 14;
        for (let x = 31; x < 38; x++) walls[y][x] = 46;
        for (let x = 40; x < 48; x++) walls[y][x] = 47;
    }
    walls[31][6] = 23; walls[31][16] = 23; walls[31][25] = 23; walls[31][34] = 23; walls[31][44] = 23;

    // Cobbled streets
    for (let x = 0; x < W; x++) { ground[12][x] = 0; ground[26][x] = 0; }
    for (let y = 0; y < H; y++) { ground[y][24] = 0; ground[y][25] = 0; }

    // Trees and vines
    walls[1][12] = 16; walls[1][37] = 16;
    decor[12][5] = 17; decor[12][38] = 17; decor[26][10] = 17; decor[26][40] = 17;
    decor[27][2] = 45; decor[27][9] = 45; decor[27][31] = 45;

    // Street lamps
    decor[12][8] = 28; decor[12][16] = 28; decor[12][32] = 28; decor[12][42] = 28;
    decor[26][6] = 28; decor[26][18] = 28; decor[26][32] = 28; decor[26][44] = 28;
    decor[20][12] = 28; decor[20][36] = 28;

    // Southern fountain
    walls[35][24] = 18; walls[35][25] = 18;

    // === BORDERS ===
    for (let y = 0; y < H; y++) { walls[y][0] = 16; walls[y][W - 1] = 16; }
    for (let x = 0; x < W; x++) { walls[0][x] = 16; walls[H - 1][x] = 16; }
    walls[H - 1][24] = -1; walls[H - 1][25] = -1; walls[H - 1][26] = -1;
    walls[0][24] = -1; walls[0][25] = -1;

    CITIES.rome.ground = ground;
    CITIES.rome.walls = walls;
    CITIES.rome.decor = decor;
}

// ======================================================================
// Marrakech — Expansive medina, Koutoubia minaret, large souk,
// riad courtyards, carpet market, portal area
// ======================================================================
function generateMarrakech() {
    const W = 50, H = 40;
    const ground = Array(H).fill(null).map(() => Array(W).fill(48)); // red clay
    const walls = Array(H).fill(null).map(() => Array(W).fill(-1));
    const decor = Array(H).fill(null).map(() => Array(W).fill(-1));

    // Medina paths (network of streets)
    for (let y = 0; y < H; y++) {
        ground[y][12] = 55; ground[y][13] = 55;
        ground[y][24] = 55; ground[y][25] = 55;
        ground[y][36] = 55; ground[y][37] = 55;
    }
    for (let x = 0; x < W; x++) {
        ground[9][x] = 55; ground[10][x] = 55;
        ground[19][x] = 55; ground[20][x] = 55;
        ground[29][x] = 55; ground[30][x] = 55;
    }

    // Main market square / souk (center, rows 13-26, cols 16-33)
    for (let y = 13; y < 27; y++) {
        for (let x = 16; x < 34; x++) ground[y][x] = 49;
    }
    // Market stalls
    walls[15][18] = 50; walls[15][21] = 50; walls[15][24] = 50; walls[15][28] = 50; walls[15][31] = 50;
    walls[17][19] = 50; walls[17][25] = 50; walls[17][30] = 50;
    decor[15][20] = 51; decor[15][27] = 51; decor[17][22] = 51; decor[17][28] = 51;

    // Medina buildings (north)
    for (let y = 1; y < 7; y++) {
        for (let x = 1; x < 8; x++) walls[y][x] = 12;
        for (let x = 16; x < 22; x++) walls[y][x] = 53;
        for (let x = 28; x < 34; x++) walls[y][x] = 53;
        for (let x = 42; x < 48; x++) walls[y][x] = 12;
    }
    walls[6][4] = 23; walls[6][19] = 54; walls[6][31] = 54; walls[6][45] = 23;

    // Riad courtyard (top-right)
    for (let y = 2; y < 7; y++) {
        for (let x = 38; x < 41; x++) ground[y][x] = 49;
    }

    // Merchant's shop (east side, quest location)
    for (let y = 13; y < 18; y++) {
        for (let x = 36; x < 44; x++) walls[y][x] = 53;
    }
    walls[17][40] = 54;
    decor[12][40] = 22;

    // Southern buildings
    for (let y = 31; y < 37; y++) {
        for (let x = 1; x < 8; x++) walls[y][x] = 53;
        for (let x = 16; x < 22; x++) walls[y][x] = 12;
        for (let x = 28; x < 34; x++) walls[y][x] = 53;
        for (let x = 42; x < 48; x++) walls[y][x] = 12;
    }
    walls[31][4] = 23; walls[31][19] = 54; walls[31][31] = 54; walls[31][45] = 23;

    // Palm trees
    walls[1][10] = 52; walls[1][14] = 52; walls[1][35] = 52; walls[1][40] = 52;
    walls[12][5] = 52; walls[12][44] = 52;
    walls[28][3] = 52; walls[28][46] = 52;
    walls[31][10] = 52; walls[31][38] = 52;

    // Carpet market area (south-east)
    for (let y = 22; y < 27; y++) {
        for (let x = 38; x < 46; x++) ground[y][x] = 49;
    }
    decor[23][39] = 51; decor[23][42] = 51; decor[25][40] = 51; decor[25][44] = 51;

    // Portal (unlocked during quest)
    decor[24][25] = 21;

    // Fountain in square
    walls[20][24] = 18; walls[20][25] = 18;

    // Mosaic decorations
    decor[19][18] = 49; decor[19][30] = 49;

    // === BORDERS ===
    for (let y = 0; y < H; y++) { walls[y][0] = 53; walls[y][W - 1] = 53; }
    for (let x = 0; x < W; x++) { walls[0][x] = 53; walls[H - 1][x] = 53; }
    walls[H - 1][24] = -1; walls[H - 1][25] = -1; walls[H - 1][26] = -1;
    walls[0][24] = -1; walls[0][25] = -1;

    CITIES.marrakech.ground = ground;
    CITIES.marrakech.walls = walls;
    CITIES.marrakech.decor = decor;
}

// ======================================================================
// Tokyo — Tokyo Tower plaza, pagoda temple, neon district,
// zen garden, expanded cherry blossom garden
// ======================================================================
function generateTokyo() {
    const W = 50, H = 40;
    const ground = Array(H).fill(null).map(() => Array(W).fill(62)); // slate
    const walls = Array(H).fill(null).map(() => Array(W).fill(-1));
    const decor = Array(H).fill(null).map(() => Array(W).fill(-1));

    // Garden paths
    for (let y = 0; y < H; y++) {
        ground[y][12] = 3; ground[y][13] = 3;
        ground[y][24] = 3; ground[y][25] = 3;
        ground[y][36] = 3; ground[y][37] = 3;
    }
    for (let x = 0; x < W; x++) {
        ground[9][x] = 3; ground[10][x] = 3;
        ground[19][x] = 3; ground[20][x] = 3;
        ground[29][x] = 3; ground[30][x] = 3;
    }

    // Secret cherry blossom garden (top-center, rows 1-8, cols 16-34)
    for (let y = 1; y < 8; y++) {
        for (let x = 16; x < 34; x++) ground[y][x] = 59;
    }
    // Cherry trees
    walls[1][18] = 56; walls[1][22] = 56; walls[1][26] = 56; walls[1][30] = 56;
    walls[3][20] = 56; walls[3][24] = 56; walls[3][28] = 56; walls[3][32] = 56;
    walls[5][17] = 56; walls[5][23] = 56; walls[5][29] = 56; walls[5][33] = 56;
    decor[2][21] = 17; decor[2][27] = 17; decor[4][19] = 17; decor[4][31] = 17;
    decor[6][22] = 17; decor[6][28] = 17;

    // Torii gate entrance to garden
    walls[7][24] = 61; walls[7][25] = 61;

    // Portal in garden
    decor[4][25] = 21;

    // Treasure chest in garden (separate tile from portal)
    decor[3][25] = 20;

    // Shrine / temple area (left, rows 11-17, cols 2-12)
    for (let y = 11; y < 17; y++) {
        for (let x = 2; x < 12; x++) ground[y][x] = 57;
    }
    walls[11][4] = 61; walls[11][7] = 61; walls[11][10] = 61;
    for (let y = 12; y < 16; y++) {
        for (let x = 3; x < 6; x++) walls[y][x] = 58;
        for (let x = 8; x < 11; x++) walls[y][x] = 58;
    }
    walls[15][4] = 23; walls[15][9] = 23;
    decor[13][6] = 60; decor[13][7] = 60;

    // Zen garden (right, rows 11-17, cols 38-48)
    for (let y = 11; y < 17; y++) {
        for (let x = 38; x < 48; x++) ground[y][x] = 3;
    }
    // Zen rocks (as statue tiles)
    walls[13][40] = 19; walls[14][44] = 19; walls[12][46] = 19;
    // Bamboo border
    walls[11][38] = 63; walls[11][42] = 63; walls[11][47] = 63;
    walls[16][38] = 63; walls[16][43] = 63; walls[16][47] = 63;

    // Neon district / shops (south, rows 22-28)
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

    // Bamboo groves
    walls[1][2] = 63; walls[1][3] = 63; walls[2][2] = 63; walls[2][4] = 63;
    walls[1][46] = 63; walls[1][47] = 63; walls[2][47] = 63; walls[2][45] = 63;
    walls[1][8] = 63; walls[1][40] = 63;
    walls[31][2] = 63; walls[31][3] = 63; walls[31][47] = 63; walls[31][46] = 63;

    // Lanterns
    decor[10][6] = 60; decor[10][10] = 60; decor[10][40] = 60; decor[10][44] = 60;
    decor[20][8] = 60; decor[20][16] = 60; decor[20][32] = 60; decor[20][42] = 60;
    decor[30][6] = 60; decor[30][18] = 60; decor[30][36] = 60; decor[30][44] = 60;

    // === BORDERS ===
    for (let y = 0; y < H; y++) { walls[y][0] = 63; walls[y][W - 1] = 63; }
    for (let x = 0; x < W; x++) { walls[0][x] = 63; walls[H - 1][x] = 63; }
    walls[H - 1][24] = -1; walls[H - 1][25] = -1; walls[H - 1][26] = -1;
    walls[0][24] = -1; walls[0][25] = -1;

    CITIES.tokyo.ground = ground;
    CITIES.tokyo.walls = walls;
    CITIES.tokyo.decor = decor;
}

// Generate all city maps
generateParis();
generateLondon();
generateRome();
generateMarrakech();
generateTokyo();
