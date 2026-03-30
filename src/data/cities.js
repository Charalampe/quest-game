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
        width: 30,
        height: 25,
        playerStart: { x: 15, y: 20 },
        tileSize: 16,
        // Map layers: ground, walls (collision), decoration
        ground: null,   // generated below
        walls: null,     // generated below
        decor: null,     // generated below
        connections: ['london', 'rome'],
        music: 'paris_theme'
    },
    london: {
        name: 'London',
        description: 'The Old Smoke',
        width: 30,
        height: 25,
        playerStart: { x: 15, y: 20 },
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
        width: 30,
        height: 25,
        playerStart: { x: 15, y: 20 },
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
        width: 30,
        height: 25,
        playerStart: { x: 15, y: 20 },
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
        width: 30,
        height: 25,
        playerStart: { x: 15, y: 20 },
        tileSize: 16,
        ground: null,
        walls: null,
        decor: null,
        connections: ['marrakech'],
        music: 'tokyo_theme'
    }
};

// Generate Paris map
function generateParis() {
    const W = 30, H = 25;
    const ground = Array(H).fill(null).map(() => Array(W).fill(0)); // cobblestone
    const walls = Array(H).fill(null).map(() => Array(W).fill(-1));  // -1 = no wall
    const decor = Array(H).fill(null).map(() => Array(W).fill(-1));

    // Seine river (horizontal, rows 10-11)
    for (let x = 0; x < W; x++) {
        ground[10][x] = 2;
        ground[11][x] = 2;
    }
    // Bridge at x=13-16
    for (let x = 13; x <= 16; x++) {
        ground[10][x] = 0;
        ground[11][x] = 0;
        decor[10][x] = 25;
    }

    // Park area (top-left)
    for (let y = 1; y < 6; y++) {
        for (let x = 1; x < 8; x++) {
            ground[y][x] = 1;
        }
    }
    // Park trees and flowers
    walls[1][1] = 16; walls[1][4] = 16; walls[1][7] = 16;
    walls[3][2] = 16; walls[3][6] = 16;
    walls[5][1] = 16; walls[5][7] = 16;
    decor[2][3] = 17; decor[4][5] = 17; decor[2][6] = 17;
    decor[4][2] = 27; // park bench

    // Eiffel Tower area (top-center, rows 1-6, cols 12-17)
    for (let y = 1; y < 7; y++) {
        for (let x = 12; x < 18; x++) {
            ground[y][x] = 5; // dark stone platform
        }
    }
    walls[1][14] = 24; walls[1][15] = 24;
    walls[2][14] = 24; walls[2][15] = 24;
    walls[3][14] = 24; walls[3][15] = 24;
    walls[4][13] = 24; walls[4][14] = 24; walls[4][15] = 24; walls[4][16] = 24;
    decor[6][13] = 31; decor[6][16] = 31;  // fences

    // Buildings row (south side, row 14-17)
    // Bookshop (quest location)
    for (let y = 13; y < 17; y++) {
        for (let x = 2; x < 7; x++) {
            walls[y][x] = 8;
        }
    }
    walls[16][4] = 23; // door
    walls[13][3] = 30; walls[13][5] = 30; // windows
    decor[13][2] = 29; decor[13][6] = 29; // awnings
    decor[12][4] = 22; // bookshop sign

    // Cafe
    for (let y = 13; y < 17; y++) {
        for (let x = 9; x < 14; x++) {
            walls[y][x] = 11;
        }
    }
    walls[16][11] = 23;
    walls[13][10] = 30; walls[13][12] = 30;
    decor[13][9] = 29;

    // House
    for (let y = 13; y < 17; y++) {
        for (let x = 20; x < 25; x++) {
            walls[y][x] = 9;
        }
    }
    walls[16][22] = 23;
    walls[13][21] = 30; walls[13][23] = 30;

    // Grandmother's house (far right)
    for (let y = 13; y < 17; y++) {
        for (let x = 26; x < 30; x++) {
            walls[y][x] = 8;
        }
    }
    walls[16][27] = 23;
    walls[13][27] = 30;
    decor[12][27] = 22; // sign

    // Northern buildings (north bank)
    for (let y = 1; y < 5; y++) {
        for (let x = 21; x < 26; x++) {
            walls[y][x] = 10;
        }
    }
    walls[4][23] = 23;
    walls[1][22] = 30; walls[1][24] = 30;

    // Street lamps
    decor[8][5] = 28; decor[8][10] = 28; decor[8][15] = 28;
    decor[8][20] = 28; decor[8][25] = 28;
    decor[18][5] = 28; decor[18][15] = 28; decor[18][25] = 28;

    // Flower beds along streets
    decor[9][3] = 17; decor[9][7] = 17; decor[9][12] = 17;
    decor[9][22] = 17; decor[9][27] = 17;

    // Trees along edges
    for (let y = 0; y < H; y++) {
        walls[y][0] = 16;
    }
    for (let x = 0; x < W; x++) {
        walls[0][x] = 16;
        walls[H - 1][x] = 16;
    }
    walls[H - 1][15] = -1; // gap for exit south
    walls[H - 1][14] = -1;
    walls[0][14] = -1; walls[0][15] = -1; // gap north

    // Cobblestone paths
    for (let x = 0; x < W; x++) {
        ground[8][x] = 0;
        ground[9][x] = 0;
        ground[12][x] = 0;
        ground[18][x] = 0;
        ground[19][x] = 0;
    }

    // Main vertical path
    for (let y = 0; y < H; y++) {
        ground[y][14] = 0;
        ground[y][15] = 0;
    }

    // Interactable objects
    // Chest in park (contains a clue later)
    decor[3][4] = 20;

    // Fountain in main square
    walls[19][14] = 18;
    walls[19][15] = 18;

    // Statue near Eiffel tower
    walls[6][15] = 19;

    CITIES.paris.ground = ground;
    CITIES.paris.walls = walls;
    CITIES.paris.decor = decor;
}

function generateLondon() {
    const W = 30, H = 25;
    const ground = Array(H).fill(null).map(() => Array(W).fill(39)); // pavement
    const walls = Array(H).fill(null).map(() => Array(W).fill(-1));
    const decor = Array(H).fill(null).map(() => Array(W).fill(-1));

    // Thames river (rows 12-13)
    for (let x = 0; x < W; x++) {
        ground[12][x] = 2;
        ground[13][x] = 2;
    }
    // Bridge
    for (let x = 13; x <= 16; x++) {
        ground[12][x] = 39;
        ground[13][x] = 39;
    }

    // Green park areas
    for (let y = 1; y < 5; y++) {
        for (let x = 1; x < 8; x++) {
            ground[y][x] = 37;
        }
    }
    walls[2][2] = 16; walls[2][5] = 16; walls[4][3] = 16;
    decor[3][6] = 17;

    // Big Ben area (top right)
    for (let y = 1; y < 6; y++) {
        for (let x = 22; x < 28; x++) {
            ground[y][x] = 5;
        }
    }
    walls[1][24] = 33; walls[2][24] = 33; walls[3][24] = 33;
    walls[4][24] = 33; walls[1][25] = 33; walls[2][25] = 33;

    // British Museum (quest location)
    for (let y = 6; y < 11; y++) {
        for (let x = 10; x < 20; x++) {
            walls[y][x] = 34;
        }
    }
    walls[10][14] = 23; walls[10][15] = 23;
    walls[6][12] = 30; walls[6][14] = 30; walls[6][16] = 30; walls[6][18] = 30;
    // Museum columns
    walls[10][11] = 40; walls[10][18] = 40;
    decor[5][14] = 22; // museum sign

    // Row of houses (south bank)
    for (let y = 15; y < 19; y++) {
        for (let x = 2; x < 7; x++) walls[y][x] = 35;
        for (let x = 9; x < 14; x++) walls[y][x] = 11;
        for (let x = 16; x < 21; x++) walls[y][x] = 35;
        for (let x = 23; x < 28; x++) walls[y][x] = 9;
    }
    walls[18][4] = 23; walls[18][11] = 36; walls[18][18] = 23; walls[18][25] = 23;
    walls[15][3] = 30; walls[15][5] = 30;
    walls[15][10] = 30; walls[15][12] = 30;
    walls[15][17] = 30; walls[15][19] = 30;
    walls[15][24] = 30; walls[15][26] = 30;

    // Phone box
    walls[20][8] = 32;

    // Border trees
    for (let y = 0; y < H; y++) { walls[y][0] = 16; walls[y][W - 1] = 16; }
    for (let x = 0; x < W; x++) { walls[0][x] = 16; walls[H - 1][x] = 16; }
    walls[H - 1][14] = -1; walls[H - 1][15] = -1;
    walls[0][14] = -1; walls[0][15] = -1;

    // Street lamps
    decor[11][5] = 28; decor[11][10] = 28; decor[11][20] = 28; decor[11][25] = 28;
    decor[20][5] = 28; decor[20][15] = 28; decor[20][25] = 28;

    // Fountain
    walls[21][14] = 18;

    CITIES.london.ground = ground;
    CITIES.london.walls = walls;
    CITIES.london.decor = decor;
}

function generateRome() {
    const W = 30, H = 25;
    const ground = Array(H).fill(null).map(() => Array(W).fill(43)); // warm stone
    const walls = Array(H).fill(null).map(() => Array(W).fill(-1));
    const decor = Array(H).fill(null).map(() => Array(W).fill(-1));

    // Ancient temple area (top center)
    for (let y = 1; y < 6; y++) {
        for (let x = 10; x < 20; x++) {
            ground[y][x] = 44; // temple floor
        }
    }
    // Columns
    walls[1][10] = 40; walls[1][13] = 40; walls[1][16] = 40; walls[1][19] = 40;
    walls[5][10] = 40; walls[5][13] = 40; walls[5][16] = 40; walls[5][19] = 40;
    for (let x = 10; x < 20; x++) walls[1][x] = walls[1][x] === -1 ? 41 : walls[1][x];

    // Trevi Fountain area (center) - quest location
    for (let y = 10; y < 14; y++) {
        for (let x = 11; x < 19; x++) {
            ground[y][x] = 44;
        }
    }
    walls[11][14] = 18; walls[11][15] = 18;
    walls[12][14] = 18; walls[12][15] = 18;
    // Fountain backing wall
    for (let x = 12; x < 18; x++) walls[10][x] = 14;
    decor[9][15] = 19; // statue above fountain
    decor[9][14] = 22; // sign

    // Buildings
    for (let y = 7; y < 10; y++) {
        for (let x = 1; x < 6; x++) walls[y][x] = 47; // pink
        for (let x = 24; x < 29; x++) walls[y][x] = 14; // white
    }
    walls[9][3] = 23; walls[9][26] = 23;
    walls[7][2] = 30; walls[7][4] = 30; walls[7][25] = 30; walls[7][27] = 30;

    // Southern buildings
    for (let y = 16; y < 20; y++) {
        for (let x = 2; x < 8; x++) walls[y][x] = 46;
        for (let x = 10; x < 15; x++) walls[y][x] = 47;
        for (let x = 17; x < 22; x++) walls[y][x] = 14;
        for (let x = 24; x < 29; x++) walls[y][x] = 46;
    }
    walls[19][5] = 23; walls[19][12] = 23; walls[19][19] = 23; walls[19][26] = 23;

    // Vines on walls
    decor[16][2] = 45; decor[16][7] = 45; decor[16][17] = 45;

    // Trees and flowers
    walls[1][2] = 16; walls[1][27] = 16;
    decor[6][5] = 17; decor[6][24] = 17;
    decor[15][8] = 17; decor[15][22] = 17;

    // Border
    for (let y = 0; y < H; y++) { walls[y][0] = 16; walls[y][W - 1] = 16; }
    for (let x = 0; x < W; x++) { walls[0][x] = 16; walls[H - 1][x] = 16; }
    walls[H - 1][14] = -1; walls[H - 1][15] = -1;
    walls[0][14] = -1; walls[0][15] = -1;

    // Street lamps
    decor[8][8] = 28; decor[8][21] = 28;
    decor[15][3] = 28; decor[15][14] = 28; decor[15][26] = 28;

    // Interactable chest near fountain
    decor[13][18] = 20;

    // Fountain in square
    walls[21][14] = 18;

    CITIES.rome.ground = ground;
    CITIES.rome.walls = walls;
    CITIES.rome.decor = decor;
}

function generateMarrakech() {
    const W = 30, H = 25;
    const ground = Array(H).fill(null).map(() => Array(W).fill(48)); // red clay
    const walls = Array(H).fill(null).map(() => Array(W).fill(-1));
    const decor = Array(H).fill(null).map(() => Array(W).fill(-1));

    // Medina paths (narrow winding streets)
    for (let y = 0; y < H; y++) {
        ground[y][7] = 55; ground[y][8] = 55;
        ground[y][14] = 55; ground[y][15] = 55;
        ground[y][22] = 55; ground[y][23] = 55;
    }
    for (let x = 0; x < W; x++) {
        ground[6][x] = 55; ground[7][x] = 55;
        ground[12][x] = 55; ground[13][x] = 55;
        ground[18][x] = 55; ground[19][x] = 55;
    }

    // Main market square (center)
    for (let y = 9; y < 16; y++) {
        for (let x = 10; x < 20; x++) {
            ground[y][x] = 49; // mosaic
        }
    }

    // Market stalls
    walls[10][11] = 50; walls[10][13] = 50; walls[10][16] = 50; walls[10][18] = 50;
    decor[10][12] = 51; decor[10][17] = 51;

    // Buildings (medina walls)
    for (let y = 1; y < 5; y++) {
        for (let x = 1; x < 6; x++) walls[y][x] = 12;
        for (let x = 10; x < 13; x++) walls[y][x] = 53;
        for (let x = 17; x < 20; x++) walls[y][x] = 53;
        for (let x = 25; x < 29; x++) walls[y][x] = 12;
    }
    walls[4][3] = 23; walls[4][11] = 54; walls[4][18] = 54; walls[4][27] = 23;

    // Southern buildings
    for (let y = 20; y < 24; y++) {
        for (let x = 1; x < 6; x++) walls[y][x] = 53;
        for (let x = 10; x < 14; x++) walls[y][x] = 12;
        for (let x = 17; x < 21; x++) walls[y][x] = 53;
        for (let x = 25; x < 29; x++) walls[y][x] = 12;
    }
    walls[20][3] = 23; walls[20][12] = 54; walls[20][19] = 54; walls[20][27] = 23;

    // Palm trees
    walls[1][8] = 52; walls[1][22] = 52;
    walls[8][3] = 52; walls[8][26] = 52;
    walls[16][5] = 52; walls[16][24] = 52;

    // Merchant's shop (quest location)
    for (let y = 8; y < 10; y++) {
        for (let x = 21; x < 26; x++) walls[y][x] = 53;
    }
    walls[9][23] = 54; // archway door
    decor[7][23] = 22; // sign

    // Mosaic decorations
    decor[12][12] = 49; decor[12][17] = 49;

    // Border
    for (let y = 0; y < H; y++) { walls[y][0] = 53; walls[y][W - 1] = 53; }
    for (let x = 0; x < W; x++) { walls[0][x] = 53; walls[H - 1][x] = 53; }
    walls[H - 1][14] = -1; walls[H - 1][15] = -1;
    walls[0][14] = -1; walls[0][15] = -1;

    // Fountain
    walls[12][14] = 18;

    CITIES.marrakech.ground = ground;
    CITIES.marrakech.walls = walls;
    CITIES.marrakech.decor = decor;
}

function generateTokyo() {
    const W = 30, H = 25;
    const ground = Array(H).fill(null).map(() => Array(W).fill(62)); // slate
    const walls = Array(H).fill(null).map(() => Array(W).fill(-1));
    const decor = Array(H).fill(null).map(() => Array(W).fill(-1));

    // Garden paths
    for (let y = 0; y < H; y++) {
        ground[y][7] = 3; ground[y][8] = 3;
        ground[y][14] = 3; ground[y][15] = 3;
        ground[y][22] = 3; ground[y][23] = 3;
    }
    for (let x = 0; x < W; x++) {
        ground[6][x] = 3; ground[7][x] = 3;
        ground[12][x] = 3; ground[13][x] = 3;
        ground[18][x] = 3; ground[19][x] = 3;
    }

    // Secret garden (top center) - quest location
    for (let y = 1; y < 6; y++) {
        for (let x = 10; x < 20; x++) {
            ground[y][x] = 59; // jade
        }
    }
    // Cherry trees
    walls[1][11] = 56; walls[1][14] = 56; walls[1][18] = 56;
    walls[4][12] = 56; walls[4][17] = 56;
    decor[2][13] = 17; decor[3][16] = 17; decor[2][18] = 17;

    // Torii gate entrance
    walls[5][14] = 61; walls[5][15] = 61;

    // Shrine area
    for (let y = 8; y < 11; y++) {
        for (let x = 3; x < 8; x++) {
            ground[y][x] = 57;
        }
    }
    walls[8][4] = 61; walls[8][6] = 61;
    decor[9][5] = 60; // lantern

    // Buildings (traditional style)
    for (let y = 8; y < 11; y++) {
        for (let x = 22; x < 28; x++) walls[y][x] = 58;
    }
    walls[10][25] = 23;
    decor[7][25] = 60;

    // Southern buildings
    for (let y = 15; y < 19; y++) {
        for (let x = 2; x < 7; x++) walls[y][x] = 58;
        for (let x = 10; x < 15; x++) walls[y][x] = 57;
        for (let x = 17; x < 22; x++) walls[y][x] = 58;
        for (let x = 24; x < 29; x++) walls[y][x] = 57;
    }
    walls[18][4] = 23; walls[18][12] = 23; walls[18][19] = 23; walls[18][26] = 23;

    // Bamboo groves
    walls[1][2] = 63; walls[1][3] = 63; walls[2][2] = 63;
    walls[1][26] = 63; walls[1][27] = 63; walls[2][27] = 63;
    walls[20][2] = 63; walls[21][3] = 63;
    walls[20][27] = 63; walls[21][26] = 63;

    // Lanterns
    decor[11][5] = 60; decor[11][24] = 60;
    decor[20][10] = 60; decor[20][20] = 60;

    // Portal location (unlocked during quest)
    decor[3][15] = 21;

    // Border
    for (let y = 0; y < H; y++) { walls[y][0] = 63; walls[y][W - 1] = 63; }
    for (let x = 0; x < W; x++) { walls[0][x] = 63; walls[H - 1][x] = 63; }
    walls[H - 1][14] = -1; walls[H - 1][15] = -1;
    walls[0][14] = -1; walls[0][15] = -1;

    // Chest (treasure location)
    decor[2][15] = 20;

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
