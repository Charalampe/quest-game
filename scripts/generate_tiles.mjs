/**
 * Generate monument tile PNGs at 32x32 using the canvas package.
 * Run: node scripts/generate_tiles.mjs
 * Outputs PNGs to src/assets/tiles/ and generates manifest.json
 */
import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

const TILE_SIZE = 32;
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'assets', 'tiles');

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const manifest = { tiles: {} };

function saveTile(name, index, drawFn) {
    const canvas = createCanvas(TILE_SIZE, TILE_SIZE);
    const ctx = canvas.getContext('2d');
    drawFn(ctx, TILE_SIZE);
    const filename = `${name}.png`;
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), canvas.toBuffer('image/png'));
    manifest.tiles[name] = { file: filename, index };
}

function outlineRect(ctx, x, y, w, h) {
    ctx.fillStyle = '#1a0d00';
    ctx.fillRect(x, y, w, h);
}

function metallicFill(ctx, x, y, w, h, baseColor, highlightColor) {
    const grad = ctx.createLinearGradient(x, y, x + w, y);
    grad.addColorStop(0, highlightColor);
    grad.addColorStop(0.5, baseColor);
    grad.addColorStop(1, highlightColor);
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
}

// ══════════════════════════════════════════════════════════════
// PARIS — Eiffel Tower (indices 66-77)
// ══════════════════════════════════════════════════════════════

// Row 1: Spire
saveTile('eiffel_spire_L', 66, (ctx, s) => {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 26, 0, 6, s);
    metallicFill(ctx, 27, 1, 4, s - 2, '#4A5A6A', '#7D8D9E');
    ctx.fillStyle = '#3A4A5A';
    for (let i = 0; i < s; i += 6) ctx.fillRect(28, i, 2, 2);
});

saveTile('eiffel_spire_CL', 67, (ctx, s) => {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 0, 0, s, s);
    metallicFill(ctx, 1, 1, s - 2, s - 2, '#4A5A6A', '#6D7D8E');
    ctx.fillStyle = '#333';
    ctx.fillRect(s - 4, 0, 2, 8);
    ctx.fillStyle = '#3A4A5A';
    for (let i = 4; i < s - 4; i += 8) ctx.fillRect(4, i, s - 8, 2);
    ctx.fillStyle = '#5D6D7E';
    for (let i = 0; i < s; i += 4) {
        ctx.fillRect(i, i, 2, 2);
        ctx.fillRect(s - i - 2, i, 2, 2);
    }
    ctx.fillStyle = '#7D8D9E';
    ctx.fillRect(2, 2, 4, s - 4);
});

saveTile('eiffel_spire_CR', 68, (ctx, s) => {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 0, 0, s, s);
    metallicFill(ctx, 1, 1, s - 2, s - 2, '#4A5A6A', '#6D7D8E');
    ctx.fillStyle = '#333';
    ctx.fillRect(2, 0, 2, 8);
    ctx.fillStyle = '#3A4A5A';
    for (let i = 4; i < s - 4; i += 8) ctx.fillRect(4, i, s - 8, 2);
    ctx.fillStyle = '#5D6D7E';
    for (let i = 0; i < s; i += 4) {
        ctx.fillRect(i, i, 2, 2);
        ctx.fillRect(s - i - 2, i, 2, 2);
    }
    ctx.fillStyle = '#7D8D9E';
    ctx.fillRect(s - 6, 2, 4, s - 4);
});

saveTile('eiffel_spire_R', 69, (ctx, s) => {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 0, 0, 6, s);
    metallicFill(ctx, 1, 1, 4, s - 2, '#4A5A6A', '#7D8D9E');
    ctx.fillStyle = '#3A4A5A';
    for (let i = 0; i < s; i += 6) ctx.fillRect(2, i, 2, 2);
});

// Row 2: Upper body
saveTile('eiffel_upper_L', 70, (ctx, s) => {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 20, 0, 12, s);
    metallicFill(ctx, 21, 1, 10, s - 2, '#4A5A6A', '#7D8D9E');
    ctx.fillStyle = '#3A4A5A';
    for (let i = 0; i < s; i += 2) {
        ctx.fillRect(22 + Math.floor(i * 8 / s), i, 2, 2);
        ctx.fillRect(29 - Math.floor(i * 8 / s), i, 2, 2);
    }
    ctx.fillStyle = '#7D8D9E';
    ctx.fillRect(22, 2, 2, s - 4);
});

saveTile('eiffel_upper_CL', 71, (ctx, s) => {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 0, 0, s, s);
    metallicFill(ctx, 1, 1, s - 2, s - 2, '#4A5A6A', '#6D7D8E');
    ctx.fillStyle = '#3A4A5A';
    for (let i = 2; i < s - 2; i += 6) ctx.fillRect(2, i, s - 4, 2);
    for (let i = 2; i < s; i += 4) ctx.fillRect(i, 2, 2, s - 4);
    ctx.fillStyle = '#7D8D9E';
    ctx.fillRect(4, 4, 6, 6);
    ctx.fillRect(s - 12, s - 12, 6, 6);
});

saveTile('eiffel_upper_CR', 72, (ctx, s) => {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 0, 0, s, s);
    metallicFill(ctx, 1, 1, s - 2, s - 2, '#4A5A6A', '#6D7D8E');
    ctx.fillStyle = '#3A4A5A';
    for (let i = 2; i < s - 2; i += 6) ctx.fillRect(2, i, s - 4, 2);
    for (let i = 2; i < s; i += 4) ctx.fillRect(i, 2, 2, s - 4);
    ctx.fillStyle = '#7D8D9E';
    ctx.fillRect(s - 10, 4, 6, 6);
    ctx.fillRect(4, s - 10, 6, 6);
});

saveTile('eiffel_upper_R', 73, (ctx, s) => {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 0, 0, 12, s);
    metallicFill(ctx, 1, 1, 10, s - 2, '#4A5A6A', '#7D8D9E');
    ctx.fillStyle = '#3A4A5A';
    for (let i = 0; i < s; i += 2) {
        ctx.fillRect(1 + Math.floor(i * 8 / s), i, 2, 2);
        ctx.fillRect(9 - Math.floor(i * 8 / s), i, 2, 2);
    }
    ctx.fillStyle = '#7D8D9E';
    ctx.fillRect(8, 2, 2, s - 4);
});

// Row 3: Deck/observation
saveTile('eiffel_deck_L', 74, (ctx, s) => {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 0, 0, s, 4);
    ctx.fillStyle = '#5D6D7E';
    ctx.fillRect(1, 1, s - 2, 2);
    for (let i = 4; i < s; i += 8) {
        outlineRect(ctx, i, 0, 3, 10);
        ctx.fillStyle = '#4A5A6A';
        ctx.fillRect(i + 1, 1, 1, 8);
    }
    outlineRect(ctx, 0, 8, s, s - 8);
    metallicFill(ctx, 1, 9, s - 2, s - 10, '#4A5A6A', '#6D7D8E');
    ctx.fillStyle = '#3A4A5A';
    ctx.fillRect(2, 14, s - 4, 2);
    ctx.fillRect(2, 22, s - 4, 2);
    outlineRect(ctx, s - 6, 10, 5, s - 10);
    metallicFill(ctx, s - 5, 11, 3, s - 12, '#3A4A5A', '#5D6D7E');
});

saveTile('eiffel_deck_CL', 75, (ctx, s) => {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 0, 0, s, 4);
    ctx.fillStyle = '#5D6D7E';
    ctx.fillRect(1, 1, s - 2, 2);
    for (let i = 4; i < s; i += 8) {
        outlineRect(ctx, i, 0, 3, 10);
        ctx.fillStyle = '#4A5A6A';
        ctx.fillRect(i + 1, 1, 1, 8);
    }
    outlineRect(ctx, 0, 8, s, s - 8);
    metallicFill(ctx, 1, 9, s - 2, s - 10, '#4A5A6A', '#6D7D8E');
    ctx.fillStyle = '#3A4A5A';
    ctx.fillRect(2, 14, s - 4, 2);
    ctx.fillRect(2, 22, s - 4, 2);
    ctx.fillStyle = '#5D6D7E';
    for (let i = 0; i < s; i += 4) ctx.fillRect(i, i + 10, 2, 2);
});

saveTile('eiffel_deck_CR', 76, (ctx, s) => {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 0, 0, s, 4);
    ctx.fillStyle = '#5D6D7E';
    ctx.fillRect(1, 1, s - 2, 2);
    for (let i = 4; i < s; i += 8) {
        outlineRect(ctx, i, 0, 3, 10);
        ctx.fillStyle = '#4A5A6A';
        ctx.fillRect(i + 1, 1, 1, 8);
    }
    outlineRect(ctx, 0, 8, s, s - 8);
    metallicFill(ctx, 1, 9, s - 2, s - 10, '#4A5A6A', '#6D7D8E');
    ctx.fillStyle = '#3A4A5A';
    ctx.fillRect(2, 14, s - 4, 2);
    ctx.fillRect(2, 22, s - 4, 2);
    ctx.fillStyle = '#5D6D7E';
    for (let i = 0; i < s; i += 4) ctx.fillRect(s - i - 2, i + 10, 2, 2);
});

saveTile('eiffel_deck_R', 77, (ctx, s) => {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 0, 0, s, 4);
    ctx.fillStyle = '#5D6D7E';
    ctx.fillRect(1, 1, s - 2, 2);
    for (let i = 4; i < s; i += 8) {
        outlineRect(ctx, i, 0, 3, 10);
        ctx.fillStyle = '#4A5A6A';
        ctx.fillRect(i + 1, 1, 1, 8);
    }
    outlineRect(ctx, 0, 8, s, s - 8);
    metallicFill(ctx, 1, 9, s - 2, s - 10, '#4A5A6A', '#6D7D8E');
    ctx.fillStyle = '#3A4A5A';
    ctx.fillRect(2, 14, s - 4, 2);
    ctx.fillRect(2, 22, s - 4, 2);
    outlineRect(ctx, 1, 10, 5, s - 10);
    metallicFill(ctx, 2, 11, 3, s - 12, '#3A4A5A', '#5D6D7E');
});

// ══════════════════════════════════════════════════════════════
// LONDON — Big Ben (indices 78-85)
// ══════════════════════════════════════════════════════════════

saveTile('bigben_spire_L', 78, (ctx, s) => {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 18, 0, 14, s);
    const grad = ctx.createLinearGradient(18, 0, 32, 0);
    grad.addColorStop(0, '#6E4B00');
    grad.addColorStop(1, '#8E7B20');
    ctx.fillStyle = grad;
    ctx.fillRect(19, 1, 12, s - 2);
    ctx.fillStyle = '#555555';
    ctx.beginPath();
    ctx.moveTo(19, 0); ctx.lineTo(24, 0); ctx.lineTo(19, 12);
    ctx.fill();
    ctx.fillStyle = '#AAA';
    ctx.fillRect(28, 0, 3, 6);
});

saveTile('bigben_spire_R', 79, (ctx, s) => {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 0, 0, 14, s);
    const grad = ctx.createLinearGradient(0, 0, 14, 0);
    grad.addColorStop(0, '#8E7B20');
    grad.addColorStop(1, '#6E4B00');
    ctx.fillStyle = grad;
    ctx.fillRect(1, 1, 12, s - 2);
    ctx.fillStyle = '#555555';
    ctx.beginPath();
    ctx.moveTo(8, 0); ctx.lineTo(13, 0); ctx.lineTo(13, 12);
    ctx.fill();
    ctx.fillStyle = '#AAA';
    ctx.fillRect(1, 0, 3, 6);
});

// Clock face quadrants
saveTile('bigben_clock_TL', 80, (ctx, s) => {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 0, 0, s, s);
    ctx.fillStyle = '#6E4B00';
    ctx.fillRect(1, 1, s - 2, s - 2);
    ctx.fillStyle = '#1a0d00';
    ctx.beginPath();
    ctx.arc(s, s, s - 4, Math.PI, 1.5 * Math.PI);
    ctx.lineTo(s, 4); ctx.lineTo(s, s);
    ctx.fill();
    ctx.fillStyle = '#E5DCC0';
    ctx.beginPath();
    ctx.arc(s, s, s - 6, Math.PI, 1.5 * Math.PI);
    ctx.lineTo(s, 6); ctx.lineTo(s, s);
    ctx.fill();
    ctx.strokeStyle = '#8B6914';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(s, s, s - 5, Math.PI, 1.5 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = '#333';
    ctx.fillRect(4, s - 2, 4, 2);
    ctx.fillRect(s - 2, 4, 2, 4);
    ctx.fillRect(s - 12, s - 18, 2, 16);
});

saveTile('bigben_clock_TR', 81, (ctx, s) => {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 0, 0, s, s);
    ctx.fillStyle = '#6E4B00';
    ctx.fillRect(1, 1, s - 2, s - 2);
    ctx.fillStyle = '#1a0d00';
    ctx.beginPath();
    ctx.arc(0, s, s - 4, 1.5 * Math.PI, 2 * Math.PI);
    ctx.lineTo(0, s);
    ctx.fill();
    ctx.fillStyle = '#E5DCC0';
    ctx.beginPath();
    ctx.arc(0, s, s - 6, 1.5 * Math.PI, 2 * Math.PI);
    ctx.lineTo(0, s);
    ctx.fill();
    ctx.strokeStyle = '#8B6914';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, s, s - 5, 1.5 * Math.PI, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 4, 2, 4);
    ctx.fillRect(s - 6, s - 2, 4, 2);
});

saveTile('bigben_clock_BL', 82, (ctx, s) => {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 0, 0, s, s);
    ctx.fillStyle = '#6E4B00';
    ctx.fillRect(1, 1, s - 2, s - 2);
    ctx.fillStyle = '#1a0d00';
    ctx.beginPath();
    ctx.arc(s, 0, s - 4, 0.5 * Math.PI, Math.PI);
    ctx.lineTo(s, 0);
    ctx.fill();
    ctx.fillStyle = '#E5DCC0';
    ctx.beginPath();
    ctx.arc(s, 0, s - 6, 0.5 * Math.PI, Math.PI);
    ctx.lineTo(s, 0);
    ctx.fill();
    ctx.strokeStyle = '#8B6914';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(s, 0, s - 5, 0.5 * Math.PI, Math.PI);
    ctx.stroke();
    ctx.fillStyle = '#333';
    ctx.fillRect(4, 0, 4, 2);
    ctx.fillRect(s - 2, s - 6, 2, 4);
    ctx.fillRect(s - 6, 2, 2, 12);
});

saveTile('bigben_clock_BR', 83, (ctx, s) => {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 0, 0, s, s);
    ctx.fillStyle = '#6E4B00';
    ctx.fillRect(1, 1, s - 2, s - 2);
    ctx.fillStyle = '#1a0d00';
    ctx.beginPath();
    ctx.arc(0, 0, s - 4, 0, 0.5 * Math.PI);
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.fillStyle = '#E5DCC0';
    ctx.beginPath();
    ctx.arc(0, 0, s - 6, 0, 0.5 * Math.PI);
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.strokeStyle = '#8B6914';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, s - 5, 0, 0.5 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = '#333';
    ctx.fillRect(0, s - 6, 2, 4);
    ctx.fillRect(s - 6, 0, 4, 2);
});

saveTile('bigben_tower_L', 84, (ctx, s) => {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 8, 0, s - 8, s);
    const grad = ctx.createLinearGradient(8, 0, s, 0);
    grad.addColorStop(0, '#8E7B20');
    grad.addColorStop(1, '#6E4B00');
    ctx.fillStyle = grad;
    ctx.fillRect(9, 1, s - 10, s - 2);
    outlineRect(ctx, 14, 8, 10, 14);
    ctx.fillStyle = '#8EC5E1';
    ctx.fillRect(15, 9, 8, 12);
    ctx.fillStyle = '#7E5B10';
    ctx.fillRect(9, s - 6, s - 10, 2);
    ctx.fillRect(9, 0, s - 10, 2);
});

saveTile('bigben_tower_R', 85, (ctx, s) => {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 0, 0, s - 8, s);
    const grad = ctx.createLinearGradient(0, 0, s - 8, 0);
    grad.addColorStop(0, '#6E4B00');
    grad.addColorStop(1, '#8E7B20');
    ctx.fillStyle = grad;
    ctx.fillRect(1, 1, s - 10, s - 2);
    outlineRect(ctx, 8, 8, 10, 14);
    ctx.fillStyle = '#8EC5E1';
    ctx.fillRect(9, 9, 8, 12);
    ctx.fillStyle = '#7E5B10';
    ctx.fillRect(1, s - 6, s - 10, 2);
    ctx.fillRect(1, 0, s - 10, 2);
});

// ══════════════════════════════════════════════════════════════
// ROME — Columns (indices 86-88)
// ══════════════════════════════════════════════════════════════

saveTile('column_capital', 86, (ctx, s) => {
    ctx.fillStyle = '#f9e79f';
    ctx.fillRect(0, 0, s, s);
    // Abacus
    outlineRect(ctx, 2, s - 10, s - 4, 3);
    ctx.fillStyle = '#F0E8D8';
    ctx.fillRect(3, s - 9, s - 6, 2);
    // Capital body
    outlineRect(ctx, 3, s - 8, s - 6, 8);
    ctx.fillStyle = '#E8E0D0';
    ctx.fillRect(4, s - 7, s - 8, 6);
    ctx.fillStyle = '#F8F0E0';
    ctx.fillRect(5, s - 6, s - 10, 4);
    // Ionic scrolls
    ctx.strokeStyle = '#C8C0B0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(8, s - 4, 4, 0, Math.PI * 1.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(s - 8, s - 4, 4, Math.PI * 1.5, Math.PI * 3);
    ctx.stroke();
    // Shaft top
    outlineRect(ctx, 7, 0, s - 14, s - 10);
    ctx.fillStyle = '#E8E0D0';
    ctx.fillRect(8, 0, s - 16, s - 10);
    ctx.fillStyle = '#C8C0B0';
    ctx.fillRect(10, 0, 2, s - 10);
    ctx.fillRect(16, 0, 2, s - 10);
    ctx.fillRect(22, 0, 2, s - 10);
});

saveTile('column_shaft', 87, (ctx, s) => {
    ctx.fillStyle = '#f9e79f';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 7, 0, s - 14, s);
    ctx.fillStyle = '#E8E0D0';
    ctx.fillRect(8, 0, s - 16, s);
    ctx.fillStyle = '#F8F0E0';
    ctx.fillRect(10, 0, 2, s);
    ctx.fillStyle = '#C8C0B0';
    ctx.fillRect(10, 0, 2, s);
    ctx.fillRect(16, 0, 2, s);
    ctx.fillRect(22, 0, 2, s);
    ctx.strokeStyle = '#D8D0C0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.bezierCurveTo(14, 10, 18, 20, 14, s);
    ctx.stroke();
});

saveTile('column_base', 88, (ctx, s) => {
    ctx.fillStyle = '#f9e79f';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 7, 0, s - 14, 16);
    ctx.fillStyle = '#E8E0D0';
    ctx.fillRect(8, 0, s - 16, 15);
    ctx.fillStyle = '#C8C0B0';
    ctx.fillRect(10, 0, 2, 15);
    ctx.fillRect(16, 0, 2, 15);
    ctx.fillRect(22, 0, 2, 15);
    outlineRect(ctx, 5, 14, s - 10, 6);
    ctx.fillStyle = '#D0C8B8';
    ctx.fillRect(6, 15, s - 12, 4);
    ctx.fillStyle = '#F0E8D8';
    ctx.fillRect(7, 15, s - 14, 2);
    outlineRect(ctx, 3, 20, s - 6, 12);
    ctx.fillStyle = '#C0B8A8';
    ctx.fillRect(4, 21, s - 8, 10);
    ctx.fillStyle = '#D0C8B8';
    ctx.fillRect(5, 21, s - 10, 4);
});

// ══════════════════════════════════════════════════════════════
// MARRAKECH — Palm & Mosaic (indices 89-92)
// ══════════════════════════════════════════════════════════════

saveTile('palm_top', 89, (ctx, s) => {
    ctx.fillStyle = '#e59866';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 13, s - 10, 6, 10);
    ctx.fillStyle = '#7D5A1E';
    ctx.fillRect(14, s - 9, 4, 9);
    ctx.fillStyle = '#6B4226';
    ctx.fillRect(12, s - 14, 4, 4);
    ctx.fillRect(16, s - 12, 4, 3);
    // Fronds
    ctx.strokeStyle = '#1B7D3A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(16, s - 12);
    ctx.bezierCurveTo(8, s - 18, 2, s - 14, 0, s - 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(16, s - 12);
    ctx.bezierCurveTo(24, s - 18, 30, s - 14, s, s - 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(16, s - 12);
    ctx.bezierCurveTo(12, s - 24, 10, s - 28, 6, 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(16, s - 12);
    ctx.bezierCurveTo(20, s - 24, 22, s - 28, 26, 2);
    ctx.stroke();
    // Frond outlines
    ctx.strokeStyle = '#1a0d00';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(16, s - 12);
    ctx.bezierCurveTo(8, s - 19, 1, s - 15, -1, s - 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(16, s - 12);
    ctx.bezierCurveTo(24, s - 19, 31, s - 15, s + 1, s - 8);
    ctx.stroke();
    // Highlights
    ctx.fillStyle = '#2AAA5A';
    ctx.fillRect(4, 6, 6, 4);
    ctx.fillRect(22, 6, 6, 4);
});

saveTile('palm_trunk', 90, (ctx, s) => {
    ctx.fillStyle = '#e59866';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 13, 0, 6, s);
    ctx.fillStyle = '#7D5A1E';
    ctx.fillRect(14, 0, 4, s);
    ctx.fillStyle = '#8D6A2E';
    for (let i = 2; i < s; i += 8) ctx.fillRect(14, i, 4, 4);
    ctx.fillStyle = '#6D4A1E';
    for (let i = 0; i < s; i += 8) ctx.fillRect(14, i, 4, 2);
    ctx.fillStyle = '#9D7A3E';
    ctx.fillRect(15, 1, 1, s - 2);
});

saveTile('mosaic_star', 91, (ctx, s) => {
    ctx.fillStyle = '#D4AC0D';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 0, 0, s, s);
    ctx.fillStyle = '#1970A9';
    ctx.beginPath();
    const cx = s / 2, cy = s / 2;
    ctx.moveTo(cx, 2);
    ctx.lineTo(cx + 6, cy - 6);
    ctx.lineTo(s - 2, cy);
    ctx.lineTo(cx + 6, cy + 6);
    ctx.lineTo(cx, s - 2);
    ctx.lineTo(cx - 6, cy + 6);
    ctx.lineTo(2, cy);
    ctx.lineTo(cx - 6, cy - 6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#A0392B';
    ctx.beginPath();
    ctx.moveTo(cx, 6);
    ctx.lineTo(cx + 4, cy - 4);
    ctx.lineTo(s - 6, cy);
    ctx.lineTo(cx + 4, cy + 4);
    ctx.lineTo(cx, s - 6);
    ctx.lineTo(cx - 4, cy + 4);
    ctx.lineTo(6, cy);
    ctx.lineTo(cx - 4, cy - 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#27AE60';
    ctx.fillRect(cx - 3, cy - 3, 6, 6);
    ctx.strokeStyle = '#8B7938';
    ctx.lineWidth = 1;
    ctx.strokeRect(1, 1, s - 2, s - 2);
});

saveTile('mosaic_diamond', 92, (ctx, s) => {
    ctx.fillStyle = '#D4AC0D';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 0, 0, s, s);
    const colors = ['#A0392B', '#1970A9', '#27AE60', '#7E34AD'];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const cx = col * 8 + 4, cy = row * 8 + 4;
            ctx.fillStyle = colors[(row + col) % 4];
            ctx.beginPath();
            ctx.moveTo(cx, cy - 3);
            ctx.lineTo(cx + 3, cy);
            ctx.lineTo(cx, cy + 3);
            ctx.lineTo(cx - 3, cy);
            ctx.closePath();
            ctx.fill();
        }
    }
    ctx.strokeStyle = '#8B7938';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath(); ctx.moveTo(0, i * 8); ctx.lineTo(s, i * 8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(i * 8, 0); ctx.lineTo(i * 8, s); ctx.stroke();
    }
});

// ══════════════════════════════════════════════════════════════
// TOKYO — Cherry & Torii (indices 93-98)
// ══════════════════════════════════════════════════════════════

saveTile('cherry_canopy_L', 93, (ctx, s) => {
    ctx.fillStyle = '#a3e4d7';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 0, 2, s, s - 6);
    const grad = ctx.createRadialGradient(s, s / 2, 4, s, s / 2, s);
    grad.addColorStop(0, '#ffc8d7');
    grad.addColorStop(0.5, '#e8859a');
    grad.addColorStop(1, '#d8659a');
    ctx.fillStyle = grad;
    ctx.fillRect(1, 3, s - 2, s - 8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(4, 6, 3, 3);
    ctx.fillRect(12, 12, 3, 3);
    ctx.fillRect(6, 20, 3, 3);
    ctx.fillRect(20, 8, 3, 3);
    ctx.fillStyle = '#d8658a';
    ctx.fillRect(8, 14, 4, 3);
    ctx.fillRect(18, 18, 4, 3);
    outlineRect(ctx, s - 8, s - 8, 8, 8);
    ctx.fillStyle = '#6B4226';
    ctx.fillRect(s - 7, s - 7, 7, 7);
});

saveTile('cherry_canopy_R', 94, (ctx, s) => {
    ctx.fillStyle = '#a3e4d7';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 0, 2, s, s - 6);
    const grad = ctx.createRadialGradient(0, s / 2, 4, 0, s / 2, s);
    grad.addColorStop(0, '#ffc8d7');
    grad.addColorStop(0.5, '#e8859a');
    grad.addColorStop(1, '#d8659a');
    ctx.fillStyle = grad;
    ctx.fillRect(1, 3, s - 2, s - 8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(s - 7, 6, 3, 3);
    ctx.fillRect(s - 15, 12, 3, 3);
    ctx.fillRect(s - 9, 20, 3, 3);
    ctx.fillStyle = '#d8658a';
    ctx.fillRect(s - 12, 14, 4, 3);
    ctx.fillRect(s - 22, 18, 4, 3);
    outlineRect(ctx, 0, s - 8, 8, 8);
    ctx.fillStyle = '#6B4226';
    ctx.fillRect(0, s - 7, 7, 7);
});

saveTile('cherry_trunk', 95, (ctx, s) => {
    ctx.fillStyle = '#a3e4d7';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 11, 0, 10, s);
    ctx.fillStyle = '#5B3216';
    ctx.fillRect(12, 0, 8, s);
    ctx.fillStyle = '#6B4226';
    ctx.fillRect(13, 0, 6, s);
    ctx.fillStyle = '#7B5236';
    ctx.fillRect(14, 0, 4, s);
});

saveTile('torii_beam_L', 96, (ctx, s) => {
    ctx.fillStyle = '#a3e4d7';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 0, 2, s, 8);
    ctx.fillStyle = '#AA2211';
    ctx.fillRect(0, 3, s, 6);
    ctx.fillStyle = '#DD4433';
    ctx.fillRect(0, 3, s, 2);
    // Curved left end
    ctx.fillStyle = '#AA2211';
    ctx.beginPath();
    ctx.arc(2, 6, 6, Math.PI * 0.5, Math.PI * 1.5);
    ctx.fill();
    ctx.strokeStyle = '#1a0d00';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(2, 6, 6, Math.PI * 0.5, Math.PI * 1.5);
    ctx.stroke();
    outlineRect(ctx, 0, 14, s, 5);
    ctx.fillStyle = '#8A1911';
    ctx.fillRect(0, 15, s, 3);
    outlineRect(ctx, 5, 0, 6, s);
    ctx.fillStyle = '#AA2211';
    ctx.fillRect(6, 0, 4, s);
    ctx.fillStyle = '#DD4433';
    ctx.fillRect(7, 0, 1, s);
});

saveTile('torii_beam_R', 97, (ctx, s) => {
    ctx.fillStyle = '#a3e4d7';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 0, 2, s, 8);
    ctx.fillStyle = '#AA2211';
    ctx.fillRect(0, 3, s, 6);
    ctx.fillStyle = '#DD4433';
    ctx.fillRect(0, 3, s, 2);
    ctx.fillStyle = '#AA2211';
    ctx.beginPath();
    ctx.arc(s - 2, 6, 6, Math.PI * 1.5, Math.PI * 0.5);
    ctx.fill();
    ctx.strokeStyle = '#1a0d00';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(s - 2, 6, 6, Math.PI * 1.5, Math.PI * 0.5);
    ctx.stroke();
    outlineRect(ctx, 0, 14, s, 5);
    ctx.fillStyle = '#8A1911';
    ctx.fillRect(0, 15, s, 3);
    outlineRect(ctx, s - 11, 0, 6, s);
    ctx.fillStyle = '#AA2211';
    ctx.fillRect(s - 10, 0, 4, s);
    ctx.fillStyle = '#DD4433';
    ctx.fillRect(s - 9, 0, 1, s);
});

saveTile('torii_post', 98, (ctx, s) => {
    ctx.fillStyle = '#a3e4d7';
    ctx.fillRect(0, 0, s, s);
    outlineRect(ctx, 11, 0, 10, s);
    ctx.fillStyle = '#8A1911';
    ctx.fillRect(12, 0, 8, s);
    ctx.fillStyle = '#AA2211';
    ctx.fillRect(13, 0, 6, s);
    ctx.fillStyle = '#DD4433';
    ctx.fillRect(14, 0, 1, s);
});

// ── Write manifest ──
fs.writeFileSync(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
);

console.log(`Generated ${Object.keys(manifest.tiles).length} tile PNGs in ${OUTPUT_DIR}`);
console.log('Manifest written to src/assets/tiles/manifest.json');
