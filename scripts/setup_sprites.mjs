/**
 * Maps PIPOYA sprite files to game NPC names and copies them to src/assets/sprites/.
 * Also generates manifest.json.
 *
 * Usage: node scripts/setup_sprites.mjs
 */
import { copyFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'scripts/_downloads/sprites/PIPOYA FREE RPG Character Sprites 32x32';
const DEST = 'src/assets/sprites';
mkdirSync(DEST, { recursive: true });

// ── Character mappings ──
// Lea: brown hair, pink/red top — Female 01-1 (brown hair, red outfit) is closest
// Each NPC mapped by visual similarity: hair color, outfit color, gender, age
const MAPPINGS = {
    // Player
    'lea.png':                    join(SRC, 'Female', 'Female 01-1.png'),  // brown hair, red top — Lea

    // Paris NPCs
    'npc_librarian.png':          join(SRC, 'Male', 'Male 12-1.png'),     // older, green outfit — glasses feel
    'npc_curator.png':            join(SRC, 'Female', 'Female 14-1.png'), // brown hair, white/formal — museum curator
    'npc_grandma.png':            join(SRC, 'Female', 'Female 18-1.png'), // darker skin, mature — grandma
    'npc_artist.png':             join(SRC, 'Male', 'Male 17-1.png'),     // hat, artsy look
    'npc_flower_seller.png':      join(SRC, 'Female', 'Female 07-1.png'), // pink hair, green — flower seller
    'npc_tourist.png':            join(SRC, 'Female', 'Female 03-1.png'), // brown hair, red scarf — tourist
    'npc_attendant.png':          join(SRC, 'Male', 'Male 16-1.png'),     // dark hair, dark outfit — attendant
    'npc_photographer.png':       join(SRC, 'Other', 'pipo-charachip_otaku01.png'), // glasses, camera vibe

    // London NPCs
    'npc_policeman.png':          join(SRC, 'Male', 'Male 05-1.png'),     // blue/white uniform feel
    'npc_professor.png':          join(SRC, 'Japanese school characters', 'teachers', 'Teacher male 01.png'), // professor/teacher
    'npc_schoolkid.png':          join(SRC, 'Japanese school characters', 'school uniform 1', 'su1 Student fmale 01.png'), // schoolkid
    'npc_clerk.png':              join(SRC, 'Female', 'Female 22-1.png'), // grey hair, casual — clerk

    // Rome NPCs
    'npc_gelato.png':             join(SRC, 'Male', 'Male 08-1.png'),     // green outfit — gelato vendor
    'npc_musician.png':           join(SRC, 'Male', 'Male 03-1.png'),     // green/brown — street musician
    'npc_tour_guide.png':         join(SRC, 'Female', 'Female 04-1.png'), // hat, red — tour guide
    'npc_cat_lady.png':           join(SRC, 'Female', 'Female 10-1.png'), // purple — eccentric cat lady

    // Marrakech NPCs
    'npc_merchant.png':           join(SRC, 'Male', 'Male 14-1.png'),     // orange/brown — merchant
    'npc_spice_merchant.png':     join(SRC, 'Male', 'Male 10-1.png'),     // green casual — spice merchant
    'npc_storyteller.png':        join(SRC, 'Male', 'Male 01-1.png'),     // red/white — storyteller
    'npc_carpet_merchant.png':    join(SRC, 'Male', 'Male 09-1.png'),     // dark outfit — carpet merchant
    'npc_riad_keeper.png':        join(SRC, 'Female', 'Female 20-1.png'), // green, warm — riad keeper
    'npc_desert_guide.png':       join(SRC, 'Male', 'Male 04-1.png'),     // tan/brown — desert guide

    // Tokyo NPCs
    'npc_ramen_chef.png':         join(SRC, 'Male', 'Male 06-1.png'),     // white/clean — chef
    'npc_manga_artist.png':       join(SRC, 'Female', 'Female 15-1.png'), // blue/light hair — manga artist
    'npc_shrine_keeper.png':      join(SRC, 'Japanese school characters', 'teachers', 'Teacher fmale 01.png'), // formal/elder

    // Shared NPCs
    'npc_guide.png':              join(SRC, 'Female', 'Female 01-2.png'), // variant of female 01
    'npc_gardener.png':           join(SRC, 'Male', 'Male 08-2.png'),     // green variant — gardener
};

// ── Copy files ──
let copied = 0;
let missing = 0;
for (const [destName, srcPath] of Object.entries(MAPPINGS)) {
    if (!existsSync(srcPath)) {
        console.log(`  MISSING: ${srcPath}`);
        missing++;
        continue;
    }
    const destPath = join(DEST, destName);
    copyFileSync(srcPath, destPath);
    console.log(`  ${destName} ← ${srcPath.replace(SRC + '/', '')}`);
    copied++;
}

console.log(`\nCopied ${copied} sprites, ${missing} missing.`);

// ── Generate manifest.json ──
const manifest = { player: 'lea.png', npcs: {} };

const NPC_NAMES = [
    'librarian', 'curator', 'merchant', 'guide', 'gardener', 'grandma',
    'artist', 'flower_seller', 'tourist', 'attendant', 'photographer',
    'policeman', 'professor', 'schoolkid', 'clerk',
    'gelato', 'musician', 'tour_guide', 'cat_lady',
    'spice_merchant', 'storyteller', 'carpet_merchant', 'riad_keeper', 'desert_guide',
    'ramen_chef', 'manga_artist', 'shrine_keeper'
];

for (const name of NPC_NAMES) {
    const file = `npc_${name}.png`;
    if (existsSync(join(DEST, file))) {
        manifest.npcs[name] = file;
    }
}

writeFileSync(join(DEST, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`\nManifest written: ${Object.keys(manifest.npcs).length} NPCs + player`);
console.log('Done! Restart the game to see external sprites.');
