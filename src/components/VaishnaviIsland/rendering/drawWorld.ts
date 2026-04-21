// Draws water, sand strip, grass base, beach sunset, dirt paths — pixel-art 8-bit style

export interface CameraOffset {
  x: number;
  y: number;
}

const WORLD_W = 1600;
const WORLD_H = 1200;

// Draw pixel-art style water using discrete horizontal color bands
function drawPixelWater(ctx: CanvasRenderingContext2D) {
  // Sky bands (top of world, above island)
  const skyBands = [
    { color: '#5bc8f5', h: 40 },
    { color: '#4ab8e8', h: 30 },
    { color: '#5bc8f5', h: 20 },
    { color: '#3aaad8', h: 20 },
  ];
  let y = 0;
  for (const band of skyBands) {
    ctx.fillStyle = band.color;
    ctx.fillRect(0, y, WORLD_W, band.h);
    y += band.h;
  }

  // Deep ocean bands
  const waterBands = [
    { color: '#1a6fa8', h: 60 },
    { color: '#1e7fbc', h: 50 },
    { color: '#2490cc', h: 40 },
    { color: '#1e7fbc', h: 30 },
    { color: '#2890c8', h: 50 },
    { color: '#38a0d8', h: 40 },
    { color: '#2890c8', h: 30 },
    { color: '#48b0e0', h: 50 },
    { color: '#38a0d8', h: 30 },
    // Shallow/foam area near island
    { color: '#58c0e8', h: 40 },
    { color: '#78d0f0', h: 20 },
    { color: '#c8eef8', h: 12 }, // white foam strip
    { color: '#78d0f0', h: 20 },
    { color: '#58c0e8', h: 30 },
    { color: '#48b0e0', h: 40 },
    { color: '#38a0d8', h: 50 },
    { color: '#48b0e0', h: 40 },
    { color: '#58c0e8', h: 30 },
    { color: '#78d0f0', h: 20 },
    { color: '#c8eef8', h: 12 }, // second foam ring
    { color: '#78d0f0', h: 16 },
    { color: '#48b0e0', h: 50 },
    { color: '#38a0d8', h: 60 },
    { color: '#2890c8', h: 80 },
    { color: '#1e7fbc', h: 80 },
    { color: '#1a6fa8', h: 100 },
  ];
  for (const band of waterBands) {
    ctx.fillStyle = band.color;
    ctx.fillRect(0, y, WORLD_W, band.h);
    y += band.h;
    if (y >= WORLD_H) break;
  }
  // Fill any remaining space
  ctx.fillStyle = '#1a6fa8';
  ctx.fillRect(0, y, WORLD_W, WORLD_H - y);
}

// Pixel-art sand using discrete color rows (no gradients)
function drawPixelSand(ctx: CanvasRenderingContext2D) {
  ctx.save();
  // Clip to sand ellipse (slightly larger than grass)
  ctx.beginPath();
  ctx.ellipse(800, 600, 700, 520, 0, 0, Math.PI * 2);
  ctx.clip();

  // Sand color bands — warm orange/golden tones, top to bottom
  const sandBands = [
    { color: '#e8a84a', h: 40 },
    { color: '#d99a3a', h: 16 },
    { color: '#e8a84a', h: 24 },
    { color: '#f0b456', h: 16 },
    { color: '#e8a84a', h: 32 },
    { color: '#d99a3a', h: 16 },
    { color: '#e8a84a', h: 24 },
    { color: '#f0b456', h: 20 },
    { color: '#e8a84a', h: 16 },
    { color: '#d99a3a', h: 24 },
    { color: '#e8a84a', h: 32 },
    { color: '#f0b456', h: 16 },
    { color: '#e8a84a', h: 24 },
    { color: '#d99a3a', h: 16 },
    { color: '#e8a84a', h: 40 },
    { color: '#f0b456', h: 20 },
    { color: '#e8a84a', h: 24 },
    { color: '#d99a3a', h: 16 },
    { color: '#e8a84a', h: 32 },
    { color: '#f0b456', h: 16 },
    { color: '#e8a84a', h: 100 },
  ];
  let y = 0;
  for (const band of sandBands) {
    ctx.fillStyle = band.color;
    ctx.fillRect(0, y, WORLD_W, band.h);
    y += band.h;
    if (y >= WORLD_H) break;
  }
  ctx.fillStyle = '#e8a84a';
  ctx.fillRect(0, y, WORLD_W, WORLD_H - y);

  ctx.restore();
}

export function drawWorld(ctx: CanvasRenderingContext2D): void {
  ctx.imageSmoothingEnabled = false;

  // 1. Pixel-art water background
  drawPixelWater(ctx);

  // 2. Pixel-art sand strip
  drawPixelSand(ctx);

  // 3. Grass base
  ctx.fillStyle = '#7ec8a0';
  ctx.beginPath();
  ctx.ellipse(800, 600, 680, 500, 0, 0, Math.PI * 2);
  ctx.fill();

  // 4. Beach sunset — top of island (pixel banded, no gradient)
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(800, 600, 680, 500, 0, 0, Math.PI * 2);
  ctx.clip();

  const sunsetBands = [
    { color: '#ff6b35', h: 20 },
    { color: '#ff7a42', h: 16 },
    { color: '#ff8c50', h: 16 },
    { color: '#ffa060', h: 16 },
    { color: '#ffb347', h: 20 },
    { color: '#ffbe58', h: 16 },
    { color: '#ffcc66', h: 16 },
    { color: '#ffd878', h: 16 },
    { color: '#ffe48a', h: 16 },
    { color: '#ffee99', h: 20 },
    { color: '#d4e8c4', h: 16 }, // transition to grass
  ];
  let sy = 80;
  for (const band of sunsetBands) {
    ctx.fillStyle = band.color;
    ctx.fillRect(0, sy, WORLD_W, band.h);
    sy += band.h;
  }
  ctx.restore();

  // 5. Sun (pixel-art block sun, no blur)
  const SX = 800, SY = 90;
  // Outer glow (blocky halos)
  ctx.fillStyle = '#ffcc44';
  ctx.fillRect(SX - 36, SY - 36, 72, 72);
  ctx.fillStyle = '#ffdd66';
  ctx.fillRect(SX - 28, SY - 28, 56, 56);
  ctx.fillStyle = '#ffee88';
  ctx.fillRect(SX - 20, SY - 20, 40, 40);
  // Core
  ctx.fillStyle = '#fff9c4';
  ctx.fillRect(SX - 12, SY - 12, 24, 24);

  // 6. Dirt paths (pixel-art — 8px wide hard-edged strips)
  ctx.fillStyle = '#c9975a';
  ctx.fillRect(796, 200, 8, 650);
  ctx.fillRect(250, 846, 1100, 8);
  ctx.fillRect(900, 296, 350, 8);
}
