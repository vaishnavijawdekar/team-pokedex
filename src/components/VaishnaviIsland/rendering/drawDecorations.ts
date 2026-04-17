// Draws pixel-art trees, flowers, fountain

function drawPinkBlossomTree(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  // Trunk
  ctx.fillStyle = '#8b5e3c';
  ctx.fillRect(x - 4, y, 8, 20);
  // Canopy (pink blossom)
  ctx.fillStyle = '#f9c6d0';
  ctx.beginPath();
  ctx.arc(x, y - 8, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f48fb1';
  ctx.beginPath();
  ctx.arc(x - 10, y - 4, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 10, y - 4, 12, 0, Math.PI * 2);
  ctx.fill();
}

function drawGreenTree(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = '#8b5e3c';
  ctx.fillRect(x - 4, y, 8, 20);
  ctx.fillStyle = '#4caf50';
  ctx.beginPath();
  ctx.arc(x, y - 10, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#388e3c';
  ctx.beginPath();
  ctx.arc(x - 8, y - 4, 14, 0, Math.PI * 2);
  ctx.fill();
}

function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
  ctx.fillStyle = '#4caf50';
  ctx.fillRect(x - 1, y, 2, 10);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff176';
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawFountain(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  // Basin
  ctx.fillStyle = '#90caf9';
  ctx.beginPath();
  ctx.ellipse(x, y + 10, 28, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#5aafde';
  ctx.fillRect(x - 4, y - 20, 8, 30);
  // Water top
  ctx.fillStyle = '#90caf9';
  ctx.beginPath();
  ctx.arc(x, y - 22, 10, 0, Math.PI * 2);
  ctx.fill();
}

export function drawDecorations(ctx: CanvasRenderingContext2D): void {
  // Pink blossom trees
  drawPinkBlossomTree(ctx, 650, 350);
  drawPinkBlossomTree(ctx, 950, 420);
  drawPinkBlossomTree(ctx, 500, 480);

  // Green trees
  drawGreenTree(ctx, 400, 650);
  drawGreenTree(ctx, 1150, 550);
  drawGreenTree(ctx, 700, 700);

  // Flowers
  drawFlower(ctx, 600, 550, '#f48fb1');
  drawFlower(ctx, 900, 700, '#ce93d8');
  drawFlower(ctx, 1050, 620, '#ffcc02');
  drawFlower(ctx, 550, 750, '#f9c6d0');

  // Fountain (on path to post office)
  drawFountain(ctx, 900, 850);
}
