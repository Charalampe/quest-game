/**
 * Generate building tiles (doors, windows, roof, awning) as 32x32 pixel-art PNGs.
 * Each tile is a complete, self-contained design that fits in a single 32x32 cell.
 *
 * Usage: node scripts/generate_building_tiles.mjs
 */
import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

const S = 32; // tile size
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'assets', 'tiles');

function save(name, canvas) {
    const outPath = path.join(OUTPUT_DIR, `${name}.png`);
    fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
    console.log(`  Generated ${name}.png`);
}

// ─── Helper: draw a rectangle with 1px outline ───
function outlinedRect(ctx, x, y, w, h, fill, outline) {
    ctx.fillStyle = outline;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = fill;
    ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
}

// ─── Helper: draw a rounded-top arch shape ───
function drawArch(ctx, cx, y, halfW, h, color) {
    ctx.fillStyle = color;
    // Vertical sides
    ctx.fillRect(cx - halfW, y + halfW, 1, h - halfW);
    ctx.fillRect(cx + halfW - 1, y + halfW, 1, h - halfW);
    // Arch curve (simplified quarter-circles)
    const r = halfW;
    for (let dy = 0; dy <= r; dy++) {
        const dx = Math.round(Math.sqrt(r * r - (r - dy) * (r - dy)));
        ctx.fillRect(cx - dx, y + dy, dx * 2, 1);
    }
    // Fill body below arch
    ctx.fillRect(cx - halfW, y + r, halfW * 2, h - r);
}

// ═══════════════════════════════════════════════════
// DOORS
// ═══════════════════════════════════════════════════

function generateDoorWooden() {
    const c = createCanvas(S, S);
    const ctx = c.getContext('2d');

    // Door frame (dark brown)
    ctx.fillStyle = '#3B2510';
    ctx.fillRect(4, 0, 24, 32);

    // Door body (warm brown)
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(6, 2, 20, 28);

    // Wood grain: vertical planks
    ctx.fillStyle = '#7A5A10';
    ctx.fillRect(15, 2, 2, 28); // center divider

    // Panel insets (darker recessed areas)
    ctx.fillStyle = '#6B4E0E';
    ctx.fillRect(8, 4, 6, 10);   // top-left panel
    ctx.fillRect(18, 4, 6, 10);  // top-right panel
    ctx.fillRect(8, 18, 6, 10);  // bottom-left panel
    ctx.fillRect(18, 18, 6, 10); // bottom-right panel

    // Panel highlights (lighter edges)
    ctx.fillStyle = '#A07820';
    ctx.fillRect(8, 4, 6, 1);    // top edge of panels
    ctx.fillRect(18, 4, 6, 1);
    ctx.fillRect(8, 18, 6, 1);
    ctx.fillRect(18, 18, 6, 1);

    // Door handle (brass)
    ctx.fillStyle = '#D4A520';
    ctx.fillRect(22, 15, 2, 3);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(22, 15, 1, 2);

    // Top arch highlight
    ctx.fillStyle = '#5A3A0C';
    ctx.fillRect(6, 0, 20, 2);

    // Threshold
    ctx.fillStyle = '#4A3520';
    ctx.fillRect(4, 30, 24, 2);

    save('door_wooden', c);
}

function generateDoorOrnate() {
    const c = createCanvas(S, S);
    const ctx = c.getContext('2d');

    // Door frame (very dark, almost black)
    ctx.fillStyle = '#1A1020';
    ctx.fillRect(3, 0, 26, 32);

    // Door body (deep purple/mahogany)
    ctx.fillStyle = '#4A2040';
    ctx.fillRect(5, 2, 22, 28);

    // Center divider
    ctx.fillStyle = '#2A1030';
    ctx.fillRect(15, 2, 2, 28);

    // Ornate panels (raised)
    ctx.fillStyle = '#5A2850';
    ctx.fillRect(7, 4, 7, 8);    // top-left
    ctx.fillRect(18, 4, 7, 8);   // top-right
    ctx.fillRect(7, 16, 7, 10);  // bottom-left
    ctx.fillRect(18, 16, 7, 10); // bottom-right

    // Panel inner highlight
    ctx.fillStyle = '#6A3060';
    ctx.fillRect(8, 5, 5, 6);
    ctx.fillRect(19, 5, 5, 6);
    ctx.fillRect(8, 17, 5, 8);
    ctx.fillRect(19, 17, 5, 8);

    // Brass accents — decorative studs
    ctx.fillStyle = '#C0A040';
    ctx.fillRect(7, 3, 1, 1); ctx.fillRect(13, 3, 1, 1);
    ctx.fillRect(18, 3, 1, 1); ctx.fillRect(24, 3, 1, 1);
    ctx.fillRect(7, 13, 1, 1); ctx.fillRect(13, 13, 1, 1);
    ctx.fillRect(18, 13, 1, 1); ctx.fillRect(24, 13, 1, 1);

    // Door knocker (brass ring)
    ctx.fillStyle = '#D4A520';
    ctx.fillRect(21, 13, 3, 1);
    ctx.fillRect(21, 14, 1, 2);
    ctx.fillRect(23, 14, 1, 2);
    ctx.fillRect(21, 16, 3, 1);

    // Fanlight detail at top
    ctx.fillStyle = '#3A1830';
    ctx.fillRect(5, 0, 22, 2);
    ctx.fillStyle = '#806040';
    ctx.fillRect(9, 0, 1, 2); ctx.fillRect(13, 0, 1, 2);
    ctx.fillRect(18, 0, 1, 2); ctx.fillRect(22, 0, 1, 2);

    // Threshold
    ctx.fillStyle = '#0A0810';
    ctx.fillRect(3, 30, 26, 2);

    save('door_ornate', c);
}

function generateDoorPanel() {
    const c = createCanvas(S, S);
    const ctx = c.getContext('2d');

    // Frame (grey-blue)
    ctx.fillStyle = '#3A4A5A';
    ctx.fillRect(4, 0, 24, 32);

    // Door body (blue-grey)
    ctx.fillStyle = '#5A7A9A';
    ctx.fillRect(6, 2, 20, 28);

    // Horizontal planks
    ctx.fillStyle = '#4A6A8A';
    for (let y = 6; y < 28; y += 5) {
        ctx.fillRect(6, y, 20, 1);
    }

    // Cross brace (X pattern) — characteristic of French shuttered doors
    ctx.fillStyle = '#4A6A8A';
    // Diagonal lines (simplified)
    for (let i = 0; i < 20; i++) {
        const y1 = 2 + Math.floor(i * 28 / 20);
        ctx.fillRect(6 + i, y1, 1, 2);
        ctx.fillRect(25 - i, y1, 1, 2);
    }

    // Door handle
    ctx.fillStyle = '#2A3A4A';
    ctx.fillRect(22, 14, 2, 4);
    ctx.fillStyle = '#8090A0';
    ctx.fillRect(22, 14, 1, 3);

    // Threshold
    ctx.fillStyle = '#2A3A4A';
    ctx.fillRect(4, 30, 24, 2);

    save('door_panel', c);
}

function generateDoorArch() {
    const c = createCanvas(S, S);
    const ctx = c.getContext('2d');

    // Stone frame
    ctx.fillStyle = '#A09080';
    ctx.fillRect(3, 0, 26, 32);

    // Arch opening (dark interior)
    ctx.fillStyle = '#201810';
    // Arch shape: rounded top
    const cx = 16, halfW = 10;
    for (let dy = 0; dy <= halfW; dy++) {
        const dx = Math.round(Math.sqrt(halfW * halfW - (halfW - dy) * (halfW - dy)));
        ctx.fillRect(cx - dx, 2 + dy, dx * 2, 1);
    }
    ctx.fillRect(6, 12, 20, 18);

    // Wooden door inside arch
    ctx.fillStyle = '#6A4020';
    ctx.fillRect(7, 12, 18, 18);

    // Door planks
    ctx.fillStyle = '#5A3518';
    ctx.fillRect(15, 12, 2, 18); // center
    ctx.fillRect(7, 20, 18, 1);  // horizontal

    // Door highlight
    ctx.fillStyle = '#7A5030';
    ctx.fillRect(8, 13, 6, 6);
    ctx.fillRect(18, 13, 6, 6);

    // Stone arch voussoirs (keystone blocks)
    ctx.fillStyle = '#B0A090';
    ctx.fillRect(14, 2, 4, 3);   // keystone
    ctx.fillStyle = '#C0B0A0';
    ctx.fillRect(15, 2, 2, 2);   // keystone highlight

    // Handle
    ctx.fillStyle = '#404040';
    ctx.fillRect(21, 19, 2, 3);

    // Threshold
    ctx.fillStyle = '#807060';
    ctx.fillRect(3, 30, 26, 2);

    save('door_arch', c);
}

function generateDoorIron() {
    const c = createCanvas(S, S);
    const ctx = c.getContext('2d');

    // Stone frame (sandstone color for Marrakech)
    ctx.fillStyle = '#B09070';
    ctx.fillRect(3, 0, 26, 32);

    // Arch top
    ctx.fillStyle = '#201810';
    const cx = 16, halfW = 10;
    for (let dy = 0; dy <= halfW; dy++) {
        const dx = Math.round(Math.sqrt(halfW * halfW - (halfW - dy) * (halfW - dy)));
        ctx.fillRect(cx - dx, 2 + dy, dx * 2, 1);
    }
    ctx.fillRect(6, 12, 20, 18);

    // Iron bars (vertical)
    ctx.fillStyle = '#505860';
    for (let x = 8; x < 24; x += 3) {
        ctx.fillRect(x, 4, 2, 26);
    }

    // Horizontal bar
    ctx.fillStyle = '#606870';
    ctx.fillRect(6, 16, 20, 2);

    // Bar highlights
    ctx.fillStyle = '#707880';
    for (let x = 8; x < 24; x += 3) {
        ctx.fillRect(x, 4, 1, 26);
    }
    ctx.fillRect(6, 16, 20, 1);

    // Decorative iron scrollwork (simplified)
    ctx.fillStyle = '#505860';
    ctx.fillRect(12, 8, 1, 1); ctx.fillRect(13, 7, 1, 1);
    ctx.fillRect(18, 8, 1, 1); ctx.fillRect(19, 7, 1, 1);

    // Rivets
    ctx.fillStyle = '#808890';
    ctx.fillRect(8, 16, 1, 1); ctx.fillRect(14, 16, 1, 1);
    ctx.fillRect(17, 16, 1, 1); ctx.fillRect(23, 16, 1, 1);

    // Threshold
    ctx.fillStyle = '#907860';
    ctx.fillRect(3, 30, 26, 2);

    save('door_iron', c);
}

function generateDoorGolden() {
    const c = createCanvas(S, S);
    const ctx = c.getContext('2d');

    // Frame (dark wood — Japanese style)
    ctx.fillStyle = '#2A1A0A';
    ctx.fillRect(3, 0, 26, 32);

    // Door body (golden/amber)
    ctx.fillStyle = '#C89830';
    ctx.fillRect(5, 2, 22, 28);

    // Shoji grid pattern (Japanese sliding door)
    ctx.fillStyle = '#A07820';
    // Vertical dividers
    ctx.fillRect(10, 2, 1, 28);
    ctx.fillRect(15, 2, 2, 28);
    ctx.fillRect(21, 2, 1, 28);
    // Horizontal dividers
    ctx.fillRect(5, 8, 22, 1);
    ctx.fillRect(5, 15, 22, 1);
    ctx.fillRect(5, 22, 22, 1);

    // Paper panels (lighter fill in grid cells)
    ctx.fillStyle = '#D8B040';
    ctx.fillRect(6, 3, 4, 5);
    ctx.fillRect(11, 3, 4, 5);
    ctx.fillRect(17, 3, 4, 5);
    ctx.fillRect(22, 3, 4, 5);
    ctx.fillRect(6, 9, 4, 6);
    ctx.fillRect(11, 9, 4, 6);
    ctx.fillRect(17, 9, 4, 6);
    ctx.fillRect(22, 9, 4, 6);

    // Handle indentation
    ctx.fillStyle = '#3A2A0A';
    ctx.fillRect(12, 16, 2, 6);
    ctx.fillRect(18, 16, 2, 6);

    // Gold accent at top
    ctx.fillStyle = '#E8C040';
    ctx.fillRect(5, 0, 22, 2);

    // Threshold (dark stone)
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(3, 30, 26, 2);

    save('door_golden', c);
}

// ═══════════════════════════════════════════════════
// WINDOW
// ═══════════════════════════════════════════════════

function generateWindow4Pane() {
    const c = createCanvas(S, S);
    const ctx = c.getContext('2d');

    // This tile is meant to overlay on a wall tile, so start transparent
    ctx.clearRect(0, 0, S, S);

    // Window frame (dark wood)
    ctx.fillStyle = '#3A2810';
    ctx.fillRect(6, 5, 20, 22);

    // Glass area (light blue)
    ctx.fillStyle = '#A0C8E8';
    ctx.fillRect(8, 7, 16, 18);

    // Cross divider (muntins)
    ctx.fillStyle = '#4A3818';
    ctx.fillRect(15, 7, 2, 18);  // vertical
    ctx.fillRect(8, 15, 16, 2);  // horizontal

    // Glass highlights (lighter blue patches)
    ctx.fillStyle = '#C0E0F8';
    ctx.fillRect(9, 8, 5, 3);    // top-left pane highlight
    ctx.fillRect(18, 8, 4, 3);   // top-right pane highlight

    // Glass reflections (small white spots)
    ctx.fillStyle = '#E0F0FF';
    ctx.fillRect(10, 9, 2, 1);
    ctx.fillRect(19, 9, 2, 1);

    // Darker bottom panes (less light)
    ctx.fillStyle = '#90B8D8';
    ctx.fillRect(9, 20, 5, 4);
    ctx.fillRect(18, 20, 5, 4);

    // Sill at bottom
    ctx.fillStyle = '#4A3818';
    ctx.fillRect(5, 26, 22, 3);
    ctx.fillStyle = '#5A4828';
    ctx.fillRect(6, 26, 20, 2); // sill highlight

    // Outer frame highlight
    ctx.fillStyle = '#5A4828';
    ctx.fillRect(6, 5, 20, 1); // top edge highlight

    save('window_4pane', c);
}

// ═══════════════════════════════════════════════════
// ROOF
// ═══════════════════════════════════════════════════

function generateRoofShingle() {
    const c = createCanvas(S, S);
    const ctx = c.getContext('2d');

    // Base color (dark roof)
    ctx.fillStyle = '#5A3828';
    ctx.fillRect(0, 0, S, S);

    // Shingle rows (offset pattern)
    const colors = ['#6A4432', '#5A3828', '#7A5442', '#684030'];
    for (let row = 0; row < 8; row++) {
        const y = row * 4;
        const offset = (row % 2) * 8; // offset every other row
        for (let col = -1; col < 3; col++) {
            const x = col * 16 + offset;
            ctx.fillStyle = colors[(row + col) % colors.length];
            ctx.fillRect(x, y, 14, 3);
            // Shingle bottom edge (shadow)
            ctx.fillStyle = '#4A2818';
            ctx.fillRect(x, y + 3, 14, 1);
            // Shingle highlight (top edge)
            ctx.fillStyle = '#8A6452';
            ctx.fillRect(x + 1, y, 12, 1);
        }
    }

    // Ridge detail at top
    ctx.fillStyle = '#4A2818';
    ctx.fillRect(0, 0, S, 2);
    ctx.fillStyle = '#7A5442';
    ctx.fillRect(0, 0, S, 1);

    // Bottom edge drip
    ctx.fillStyle = '#3A2010';
    ctx.fillRect(0, 30, S, 2);

    save('roof_shingle', c);
}

// ═══════════════════════════════════════════════════
// AWNING
// ═══════════════════════════════════════════════════

function generateAwningBrown() {
    const c = createCanvas(S, S);
    const ctx = c.getContext('2d');

    // This tile is a decorative overlay — starts transparent
    ctx.clearRect(0, 0, S, S);

    // Awning mount bar at top
    ctx.fillStyle = '#3A2510';
    ctx.fillRect(2, 2, 28, 3);

    // Awning fabric — striped canopy
    const stripeA = '#8B4513';  // dark brown
    const stripeB = '#A0522D';  // medium brown
    for (let x = 2; x < 30; x += 4) {
        ctx.fillStyle = (Math.floor(x / 4) % 2 === 0) ? stripeA : stripeB;
        ctx.fillRect(x, 5, 4, 16);
    }

    // Scalloped bottom edge
    ctx.fillStyle = '#6A3510';
    for (let x = 2; x < 30; x += 4) {
        ctx.fillRect(x, 21, 4, 2);
        ctx.fillRect(x + 1, 23, 2, 1); // scallop point
    }

    // Shadow beneath awning
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(2, 24, 28, 4);

    // Highlight on top of awning
    ctx.fillStyle = '#B0724D';
    ctx.fillRect(2, 5, 28, 1);

    // Support brackets (small)
    ctx.fillStyle = '#3A2510';
    ctx.fillRect(4, 3, 2, 4);
    ctx.fillRect(26, 3, 2, 4);

    save('awning_brown', c);
}

// ═══════════════════════════════════════════════════
// CITY-SPECIFIC ROOFS
// ═══════════════════════════════════════════════════

function generateRoofMansard() {
    const c = createCanvas(S, S);
    const ctx = c.getContext('2d');

    // Cool grey-slate base
    ctx.fillStyle = '#5A6270';
    ctx.fillRect(0, 0, S, S);

    // Mansard shingle rows (staggered pattern, zinc palette)
    const colors = ['#4E5664', '#5A6270', '#6A7280', '#525E6C'];
    for (let row = 0; row < 8; row++) {
        const y = row * 4;
        const offset = (row % 2) * 8;
        for (let col = -1; col < 3; col++) {
            const x = col * 16 + offset;
            ctx.fillStyle = colors[(row + col) % colors.length];
            ctx.fillRect(x, y, 14, 3);
            // Shadow at shingle bottom
            ctx.fillStyle = '#3A4250';
            ctx.fillRect(x, y + 3, 14, 1);
            // Zinc highlight at top
            ctx.fillStyle = '#8090A0';
            ctx.fillRect(x + 1, y, 12, 1);
        }
    }

    // Ridge cap
    ctx.fillStyle = '#3A4250';
    ctx.fillRect(0, 0, S, 2);
    ctx.fillStyle = '#7A8898';
    ctx.fillRect(0, 0, S, 1);

    // Bottom drip edge
    ctx.fillStyle = '#2A3240';
    ctx.fillRect(0, 30, S, 2);

    save('roof_mansard', c);
}

function generateRoofSlate() {
    const c = createCanvas(S, S);
    const ctx = c.getContext('2d');

    // Dark blue-grey base
    ctx.fillStyle = '#3A4550';
    ctx.fillRect(0, 0, S, S);

    // Narrow Victorian slates (10px wide, finer texture)
    const colors = ['#2E3A44', '#3A4550', '#465260', '#344048'];
    for (let row = 0; row < 8; row++) {
        const y = row * 4;
        const offset = (row % 2) * 5;
        for (let col = -1; col < 4; col++) {
            const x = col * 10 + offset;
            ctx.fillStyle = colors[(row + col) % colors.length];
            ctx.fillRect(x, y, 9, 3);
            ctx.fillStyle = '#242E38';
            ctx.fillRect(x, y + 3, 9, 1);
            ctx.fillStyle = '#506070';
            ctx.fillRect(x + 1, y, 7, 1);
        }
    }

    ctx.fillStyle = '#242E38';
    ctx.fillRect(0, 0, S, 2);
    ctx.fillStyle = '#4A5668';
    ctx.fillRect(0, 0, S, 1);

    ctx.fillStyle = '#1A2430';
    ctx.fillRect(0, 30, S, 2);

    save('roof_slate', c);
}

function generateRoofClay() {
    const c = createCanvas(S, S);
    const ctx = c.getContext('2d');

    // Warm terracotta base
    ctx.fillStyle = '#B86B40';
    ctx.fillRect(0, 0, S, S);

    // Barrel-tile rows (alternating light/dark vertical stripes per row)
    for (let row = 0; row < 8; row++) {
        const y = row * 4;
        for (let x = 0; x < S; x++) {
            const phase = (x + (row % 2) * 4) % 8;
            if (phase < 4) {
                ctx.fillStyle = '#C87850';
                ctx.fillRect(x, y, 1, 3);
                ctx.fillStyle = '#D89060';
                ctx.fillRect(x, y, 1, 1);
            } else {
                ctx.fillStyle = '#A05830';
                ctx.fillRect(x, y, 1, 3);
                ctx.fillStyle = '#904820';
                ctx.fillRect(x, y + 2, 1, 1);
            }
        }
        // Row divider shadow
        ctx.fillStyle = '#804020';
        ctx.fillRect(0, y + 3, S, 1);
    }

    // Ridge
    ctx.fillStyle = '#905030';
    ctx.fillRect(0, 0, S, 2);
    ctx.fillStyle = '#D08050';
    ctx.fillRect(0, 0, S, 1);

    // Bottom edge
    ctx.fillStyle = '#703018';
    ctx.fillRect(0, 30, S, 2);

    save('roof_clay', c);
}

function generateRoofParapet() {
    const c = createCanvas(S, S);
    const ctx = c.getContext('2d');

    // Flat sandy roof base
    ctx.fillStyle = '#D0A880';
    ctx.fillRect(0, 0, S, S);

    // Subtle sand texture
    ctx.fillStyle = '#C0986E';
    for (let y = 6; y < S; y += 4) {
        for (let x = 0; x < S; x += 6) {
            ctx.fillRect(x + (y % 8 === 0 ? 0 : 3), y, 3, 1);
        }
    }

    // Crenellated parapet at top (alternating raised/lowered blocks)
    for (let x = 0; x < S; x += 8) {
        // Raised merlon (4px wide, 6px tall)
        ctx.fillStyle = '#B89068';
        ctx.fillRect(x, 0, 4, 6);
        ctx.fillStyle = '#C8A078';
        ctx.fillRect(x, 0, 4, 1); // highlight
        ctx.fillStyle = '#A08058';
        ctx.fillRect(x, 5, 4, 1); // shadow
        // Gap (crenel) — just the flat roof color (already filled)
    }

    // Zellige decorative band (blue and red) at y=14
    for (let x = 0; x < S; x += 4) {
        ctx.fillStyle = (x % 8 < 4) ? '#2E6EA6' : '#C03020';
        ctx.fillRect(x, 14, 4, 3);
    }
    ctx.fillStyle = '#A08058';
    ctx.fillRect(0, 13, S, 1);
    ctx.fillRect(0, 17, S, 1);

    // Bottom edge
    ctx.fillStyle = '#A08050';
    ctx.fillRect(0, 30, S, 2);

    save('roof_parapet', c);
}

function generateRoofKawara() {
    const c = createCanvas(S, S);
    const ctx = c.getContext('2d');

    // Dark charcoal base
    ctx.fillStyle = '#2A2E32';
    ctx.fillRect(0, 0, S, S);

    // Kawara tile rows with subtle curved bottom edges
    const colors = ['#222628', '#2A2E32', '#32363A', '#262A2E'];
    for (let row = 0; row < 8; row++) {
        const y = row * 4;
        const offset = (row % 2) * 8;
        for (let col = -1; col < 3; col++) {
            const x = col * 16 + offset;
            ctx.fillStyle = colors[(row + col) % colors.length];
            ctx.fillRect(x, y, 14, 3);
            // Curved bottom edge highlight
            ctx.fillStyle = '#3A3E44';
            ctx.fillRect(x + 2, y + 2, 10, 1);
            ctx.fillRect(x + 4, y + 3, 6, 1);
            // Shadow
            ctx.fillStyle = '#181C20';
            ctx.fillRect(x, y + 3, 2, 1);
            ctx.fillRect(x + 12, y + 3, 2, 1);
        }
    }

    // Ridge
    ctx.fillStyle = '#181C20';
    ctx.fillRect(0, 0, S, 2);
    ctx.fillStyle = '#3A3E44';
    ctx.fillRect(0, 0, S, 1);

    // Bottom drip
    ctx.fillStyle = '#101418';
    ctx.fillRect(0, 30, S, 2);

    save('roof_kawara', c);
}

// ═══════════════════════════════════════════════════
// CITY-SPECIFIC WINDOWS
// ═══════════════════════════════════════════════════

function generateWindowFrench() {
    const c = createCanvas(S, S);
    const ctx = c.getContext('2d');

    // Opaque cream stone background (matches Haussmann wall)
    ctx.fillStyle = '#C8B898';
    ctx.fillRect(0, 0, S, S);

    // Stone recess around window
    ctx.fillStyle = '#B8A888';
    ctx.fillRect(6, 2, 20, 26);

    // Iron frame (dark)
    ctx.fillStyle = '#2A2A2E';
    ctx.fillRect(8, 3, 16, 24);

    // Glass (muted grey-blue, not bright)
    ctx.fillStyle = '#7A98B0';
    ctx.fillRect(10, 5, 5, 20);
    ctx.fillRect(17, 5, 5, 20);

    // Center divider (iron)
    ctx.fillStyle = '#2A2A2E';
    ctx.fillRect(15, 3, 2, 24);

    // Horizontal muntin
    ctx.fillStyle = '#2A2A2E';
    ctx.fillRect(10, 14, 12, 1);

    // Glass highlights (subtle)
    ctx.fillStyle = '#90A8C0';
    ctx.fillRect(11, 6, 3, 3);
    ctx.fillRect(18, 6, 3, 3);

    // Darker lower panes
    ctx.fillStyle = '#6A8898';
    ctx.fillRect(10, 17, 5, 8);
    ctx.fillRect(17, 17, 5, 8);

    // Stone sill
    ctx.fillStyle = '#C0B098';
    ctx.fillRect(7, 26, 18, 3);
    ctx.fillStyle = '#D0C0A8';
    ctx.fillRect(8, 26, 16, 2);

    // Iron balcony railing (3 bars below sill)
    ctx.fillStyle = '#3A3A40';
    ctx.fillRect(8, 29, 16, 1); // rail bar
    ctx.fillRect(10, 29, 1, 3); // left bar
    ctx.fillRect(15, 29, 1, 3); // center bar
    ctx.fillRect(21, 29, 1, 3); // right bar

    // Top frame highlight
    ctx.fillStyle = '#4A4A50';
    ctx.fillRect(8, 3, 16, 1);

    save('window_french', c);
}

function generateWindowSash() {
    const c = createCanvas(S, S);
    const ctx = c.getContext('2d');

    // Opaque dark brick background (matches London dark brick walls)
    ctx.fillStyle = '#2A2833';
    ctx.fillRect(0, 0, S, S);

    // White/cream frame
    ctx.fillStyle = '#D8D0C0';
    ctx.fillRect(6, 4, 20, 24);

    // Glass area (muted grey-blue)
    ctx.fillStyle = '#7898B0';
    ctx.fillRect(8, 6, 16, 20);

    // Sash dividers — 3-over-3 grid
    ctx.fillStyle = '#E8E0D8';
    // Horizontal: top rail, meeting rail, bottom
    ctx.fillRect(8, 6, 16, 1);
    ctx.fillRect(8, 15, 16, 2);
    ctx.fillRect(8, 25, 16, 1);
    // Vertical: 3 panes per row
    ctx.fillRect(13, 6, 1, 20);
    ctx.fillRect(18, 6, 1, 20);

    // Glass highlights (subtle)
    ctx.fillStyle = '#90A8C0';
    ctx.fillRect(9, 7, 3, 3);
    ctx.fillRect(14, 7, 3, 3);
    ctx.fillRect(19, 7, 3, 3);

    // Darker lower panes
    ctx.fillStyle = '#688898';
    ctx.fillRect(9, 19, 3, 5);
    ctx.fillRect(14, 19, 3, 5);
    ctx.fillRect(19, 19, 3, 5);

    // Cream sill
    ctx.fillStyle = '#E8E0D8';
    ctx.fillRect(5, 27, 22, 3);
    ctx.fillStyle = '#F0E8E0';
    ctx.fillRect(6, 27, 20, 2);

    save('window_sash', c);
}

function generateWindowArched() {
    const c = createCanvas(S, S);
    const ctx = c.getContext('2d');

    // Opaque warm stone background (matches Rome walls)
    ctx.fillStyle = '#C8A888';
    ctx.fillRect(0, 0, S, S);

    // Green shutters (left)
    ctx.fillStyle = '#3A6A30';
    ctx.fillRect(4, 8, 6, 20);
    // Shutter slats
    ctx.fillStyle = '#2A5A20';
    for (let y = 10; y < 26; y += 3) {
        ctx.fillRect(5, y, 4, 1);
    }
    // Left shutter highlight
    ctx.fillStyle = '#4A7A40';
    ctx.fillRect(4, 8, 1, 20);

    // Green shutters (right)
    ctx.fillStyle = '#3A6A30';
    ctx.fillRect(22, 8, 6, 20);
    ctx.fillStyle = '#2A5A20';
    for (let y = 10; y < 26; y += 3) {
        ctx.fillRect(23, y, 4, 1);
    }
    ctx.fillStyle = '#4A7A40';
    ctx.fillRect(22, 8, 1, 20);

    // Arch opening
    ctx.fillStyle = '#201810';
    const cx = 16, halfW = 6;
    for (let dy = 0; dy <= halfW; dy++) {
        const dx = Math.round(Math.sqrt(halfW * halfW - (halfW - dy) * (halfW - dy)));
        ctx.fillRect(cx - dx, 4 + dy, dx * 2, 1);
    }
    ctx.fillRect(10, 10, 12, 18);

    // Glass inside arch (muted grey-blue)
    ctx.fillStyle = '#7898A8';
    for (let dy = 1; dy <= halfW - 1; dy++) {
        const dx = Math.round(Math.sqrt((halfW-1) * (halfW-1) - (halfW-1 - dy) * (halfW-1 - dy)));
        ctx.fillRect(cx - dx, 5 + dy, dx * 2, 1);
    }
    ctx.fillRect(11, 11, 10, 16);

    // Glass highlight (subtle)
    ctx.fillStyle = '#8AA8B8';
    ctx.fillRect(12, 12, 3, 4);

    // Stone sill
    ctx.fillStyle = '#C0B098';
    ctx.fillRect(9, 27, 14, 2);

    save('window_arched', c);
}

function generateWindowMashrabiya() {
    const c = createCanvas(S, S);
    const ctx = c.getContext('2d');

    // Opaque sandstone background (matches Marrakech walls)
    ctx.fillStyle = '#B89870';
    ctx.fillRect(0, 0, S, S);

    // Horseshoe arch outline (blue zellige trim)
    ctx.fillStyle = '#2E6EA6';
    const cx = 16, halfW = 8;
    for (let dy = 0; dy <= halfW; dy++) {
        const dx = Math.round(Math.sqrt(halfW * halfW - (halfW - dy) * (halfW - dy)));
        ctx.fillRect(cx - dx - 1, 3 + dy, dx * 2 + 2, 1);
    }
    ctx.fillRect(7, 11, 18, 1);
    // Extended horseshoe sides curve inward
    ctx.fillRect(7, 12, 1, 3);
    ctx.fillRect(24, 12, 1, 3);
    ctx.fillRect(8, 14, 1, 1);
    ctx.fillRect(23, 14, 1, 1);

    // Dark interior
    ctx.fillStyle = '#1A1008';
    for (let dy = 1; dy <= halfW - 1; dy++) {
        const dx = Math.round(Math.sqrt((halfW-1) * (halfW-1) - (halfW-1 - dy) * (halfW-1 - dy)));
        ctx.fillRect(cx - dx, 4 + dy, dx * 2, 1);
    }
    ctx.fillRect(9, 12, 14, 16);

    // Lattice grid (mashrabiya carved wood)
    ctx.fillStyle = '#4A3020';
    for (let x = 10; x < 22; x += 3) {
        ctx.fillRect(x, 12, 1, 16);
    }
    for (let y = 14; y < 28; y += 3) {
        ctx.fillRect(9, y, 14, 1);
    }

    // Stone sill
    ctx.fillStyle = '#C0A880';
    ctx.fillRect(8, 28, 16, 2);

    save('window_mashrabiya', c);
}

function generateWindowLattice() {
    const c = createCanvas(S, S);
    const ctx = c.getContext('2d');

    // Opaque dark slate background (matches Tokyo walls)
    ctx.fillStyle = '#484858';
    ctx.fillRect(0, 0, S, S);

    // Dark wood frame
    ctx.fillStyle = '#2A1A0A';
    ctx.fillRect(6, 5, 20, 22);

    // Warm paper backing (shoji paper)
    ctx.fillStyle = '#E8D8C0';
    ctx.fillRect(8, 7, 16, 18);

    // Vertical wooden slats (koshi lattice)
    ctx.fillStyle = '#3A2410';
    for (let x = 8; x < 24; x += 3) {
        ctx.fillRect(x, 7, 1, 18);
    }

    // Horizontal rail
    ctx.fillStyle = '#3A2410';
    ctx.fillRect(8, 15, 16, 1);

    // Paper glow (lighter center)
    ctx.fillStyle = '#F0E8D8';
    ctx.fillRect(10, 8, 4, 6);
    ctx.fillRect(16, 8, 4, 6);

    // Dark wood sill
    ctx.fillStyle = '#2A1A0A';
    ctx.fillRect(5, 26, 22, 3);
    ctx.fillStyle = '#3A2A18';
    ctx.fillRect(6, 26, 20, 2);

    save('window_lattice', c);
}

// ═══════════════════════════════════════════════════
// PARIS CORNICE
// ═══════════════════════════════════════════════════

function generateAwningCornice() {
    const c = createCanvas(S, S);
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, S, S);

    // Main limestone molding
    ctx.fillStyle = '#D4C4A8';
    ctx.fillRect(2, 6, 28, 10);

    // Top molding profile
    ctx.fillStyle = '#E0D0B8';
    ctx.fillRect(1, 4, 30, 3);
    ctx.fillStyle = '#C8B898';
    ctx.fillRect(2, 7, 28, 1);

    // Bottom molding edge
    ctx.fillStyle = '#B8A888';
    ctx.fillRect(2, 15, 28, 2);
    ctx.fillStyle = '#C0B098';
    ctx.fillRect(3, 14, 26, 1);

    // Bracket supports (small decorative corbels)
    ctx.fillStyle = '#C0B098';
    ctx.fillRect(5, 16, 3, 6);
    ctx.fillRect(14, 16, 3, 6);
    ctx.fillRect(24, 16, 3, 6);

    // Bracket highlights
    ctx.fillStyle = '#D8C8B0';
    ctx.fillRect(5, 16, 3, 1);
    ctx.fillRect(14, 16, 3, 1);
    ctx.fillRect(24, 16, 3, 1);

    // Bracket shadows
    ctx.fillStyle = '#A09078';
    ctx.fillRect(5, 21, 3, 1);
    ctx.fillRect(14, 21, 3, 1);
    ctx.fillRect(24, 21, 3, 1);

    // Shadow beneath cornice
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.fillRect(2, 22, 28, 4);

    save('awning_cornice', c);
}

// ═══════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════

async function main() {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('Generating building tiles...\n');

    // Doors
    generateDoorWooden();
    generateDoorOrnate();
    generateDoorPanel();
    generateDoorArch();
    generateDoorIron();
    generateDoorGolden();

    // Window (generic)
    generateWindow4Pane();

    // Roof (generic)
    generateRoofShingle();

    // Awning (generic)
    generateAwningBrown();

    // City-specific roofs
    generateRoofMansard();
    generateRoofSlate();
    generateRoofClay();
    generateRoofParapet();
    generateRoofKawara();

    // City-specific windows
    generateWindowFrench();
    generateWindowSash();
    generateWindowArched();
    generateWindowMashrabiya();
    generateWindowLattice();

    // Paris cornice
    generateAwningCornice();

    // Update manifest
    const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
    let manifest = { tiles: {} };
    if (fs.existsSync(manifestPath)) {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    }

    const newEntries = {
        roof_mansard:      { file: 'roof_mansard.png',      index: 103 },
        window_french:     { file: 'window_french.png',     index: 104 },
        roof_slate:        { file: 'roof_slate.png',        index: 105 },
        window_sash:       { file: 'window_sash.png',       index: 106 },
        roof_clay:         { file: 'roof_clay.png',         index: 107 },
        window_arched:     { file: 'window_arched.png',     index: 108 },
        roof_parapet:      { file: 'roof_parapet.png',      index: 109 },
        window_mashrabiya: { file: 'window_mashrabiya.png', index: 110 },
        roof_kawara:       { file: 'roof_kawara.png',       index: 111 },
        window_lattice:    { file: 'window_lattice.png',    index: 112 },
        awning_cornice:    { file: 'awning_cornice.png',    index: 113 }
    };

    Object.assign(manifest.tiles, newEntries);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('  Updated manifest.json');

    console.log('\nDone! All building tiles generated in src/assets/tiles/');
}

main().catch(err => { console.error(err); process.exit(1); });
