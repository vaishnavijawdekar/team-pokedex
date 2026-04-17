// Draws water, sand strip, grass base, beach sunset gradient, dirt paths

export interface CameraOffset {
  x: number;
  y: number;
}

const WORLD_W = 1600;
const WORLD_H = 1200;

export function drawWorld(ctx: CanvasRenderingContext2D): void {
  // 1. Water background (ocean blue)
  ctx.fillStyle = '#4a9fd4';
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  // 2. Sand strip (ellipse slightly larger than grass)
  ctx.fillStyle = '#f5deb3';
  ctx.beginPath();
  ctx.ellipse(800, 600, 700, 520, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. Grass base
  ctx.fillStyle = '#7ec8a0';
  ctx.beginPath();
  ctx.ellipse(800, 600, 680, 500, 0, 0, Math.PI * 2);
  ctx.fill();

  // 4. Beach sunset gradient — top portion (y=0 to y=350)
  const sunsetGrad = ctx.createLinearGradient(0, 0, 0, 350);
  sunsetGrad.addColorStop(0, '#ff6b35');   // deep orange
  sunsetGrad.addColorStop(0.3, '#ffb347'); // warm amber
  sunsetGrad.addColorStop(0.6, '#ffe066'); // pale gold
  sunsetGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = sunsetGrad;
  ctx.beginPath();
  ctx.ellipse(800, 600, 680, 500, 0, 0, Math.PI * 2);
  ctx.fill();

  // 5. Sun circle with glow
  ctx.save();
  ctx.shadowColor = '#ffb347';
  ctx.shadowBlur = 40;
  ctx.fillStyle = '#ffe066';
  ctx.beginPath();
  ctx.arc(800, 60, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 6. Dirt paths
  ctx.fillStyle = '#c9975a';
  // Vertical center path (spawn → studio → beach)
  ctx.fillRect(796, 200, 8, 650);
  // Horizontal lower path (bakery → fountain → post office)
  ctx.fillRect(250, 846, 1100, 8);
  // Branch path top-right to library
  ctx.fillRect(900, 296, 350, 8);
}
