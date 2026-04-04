/**
 * Generate bell sprite PNGs at 32x32 using the canvas package.
 * Run: node scripts/generate_bells.mjs
 * Outputs PNGs to src/assets/bells/
 *
 * Each bell is a classic hand-bell / church-bell shape:
 *   - Curved dome top with a handle/loop
 *   - Flared bell body
 *   - Wide lip at the bottom
 *   - Metallic gradient shading
 */
import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

const SIZE = 32;
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'assets', 'bells');

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function drawBell(ctx, s, baseColor, highlightColor, shadowColor) {
    ctx.clearRect(0, 0, s, s);

    const cx = s / 2;

    // --- Handle / loop at top ---
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, 6, 4, Math.PI, 0, false);
    ctx.stroke();

    ctx.strokeStyle = highlightColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, 6, 4, Math.PI, 0, false);
    ctx.stroke();

    // --- Bell body (a smooth bell curve) ---
    // Using a bezier to draw a classic bell silhouette
    const bodyTop = 9;
    const bodyBot = 26;
    const lipY = 28;
    const topWidth = 5;
    const botWidth = 13;
    const lipWidth = 15;

    // Metallic gradient for body
    const grad = ctx.createLinearGradient(cx - botWidth, 0, cx + botWidth, 0);
    grad.addColorStop(0, shadowColor);
    grad.addColorStop(0.25, highlightColor);
    grad.addColorStop(0.5, baseColor);
    grad.addColorStop(0.75, highlightColor);
    grad.addColorStop(1, shadowColor);

    // Draw bell body shape
    ctx.beginPath();
    ctx.moveTo(cx - topWidth, bodyTop);
    // Left side curve: narrow top flares to wide bottom
    ctx.bezierCurveTo(
        cx - topWidth - 1, bodyTop + 6,    // control 1
        cx - botWidth - 2, bodyBot - 8,     // control 2
        cx - botWidth, bodyBot              // end
    );
    // Bottom lip (left)
    ctx.lineTo(cx - lipWidth, lipY);
    // Lip bottom edge
    ctx.lineTo(cx + lipWidth, lipY);
    // Bottom lip (right)
    ctx.lineTo(cx + botWidth, bodyBot);
    // Right side curve
    ctx.bezierCurveTo(
        cx + botWidth + 2, bodyBot - 8,
        cx + topWidth + 1, bodyTop + 6,
        cx + topWidth, bodyTop
    );
    ctx.closePath();

    ctx.fillStyle = grad;
    ctx.fill();

    // Dark outline
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = 1;
    ctx.stroke();

    // --- Highlight arc on left side of dome ---
    ctx.strokeStyle = highlightColor;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - topWidth + 2, bodyTop + 2);
    ctx.bezierCurveTo(
        cx - topWidth, bodyTop + 8,
        cx - botWidth + 2, bodyBot - 10,
        cx - botWidth + 3, bodyBot - 2
    );
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // --- Lip detail line ---
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - lipWidth + 1, lipY - 1);
    ctx.lineTo(cx + lipWidth - 1, lipY - 1);
    ctx.stroke();

    // --- Clapper (small circle at bottom center) ---
    ctx.beginPath();
    ctx.arc(cx, lipY - 2, 2, 0, Math.PI * 2);
    ctx.fillStyle = shadowColor;
    ctx.fill();
}

// Gold bell
const goldCanvas = createCanvas(SIZE, SIZE);
drawBell(goldCanvas.getContext('2d'), SIZE, '#FFD700', '#FFF8B0', '#B8860B');
fs.writeFileSync(path.join(OUTPUT_DIR, 'bell_gold.png'), goldCanvas.toBuffer('image/png'));

// Silver bell
const silverCanvas = createCanvas(SIZE, SIZE);
drawBell(silverCanvas.getContext('2d'), SIZE, '#C0C0C0', '#E8E8E8', '#707070');
fs.writeFileSync(path.join(OUTPUT_DIR, 'bell_silver.png'), silverCanvas.toBuffer('image/png'));

// Bronze bell
const bronzeCanvas = createCanvas(SIZE, SIZE);
drawBell(bronzeCanvas.getContext('2d'), SIZE, '#CD7F32', '#E8A84C', '#8B5A20');
fs.writeFileSync(path.join(OUTPUT_DIR, 'bell_bronze.png'), bronzeCanvas.toBuffer('image/png'));

console.log('Generated 3 bell sprites in src/assets/bells/');
