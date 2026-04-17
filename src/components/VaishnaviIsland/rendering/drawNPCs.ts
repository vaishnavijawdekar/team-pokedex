// Draws lego-style NPC characters at the bakery yard tables

function drawLegoFigure(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  topColor: string,
  pantsColor: string
): void {
  // Head
  ctx.fillStyle = '#ffe0b2';
  ctx.fillRect(x - 6, y - 22, 12, 12);
  // Body
  ctx.fillStyle = topColor;
  ctx.fillRect(x - 7, y - 10, 14, 14);
  // Legs
  ctx.fillStyle = pantsColor;
  ctx.fillRect(x - 6, y + 4, 5, 10);
  ctx.fillRect(x + 1, y + 4, 5, 10);
  // Feet (shoes)
  ctx.fillStyle = '#333';
  ctx.fillRect(x - 7, y + 14, 6, 4);
  ctx.fillRect(x + 1, y + 14, 6, 4);
}

export function drawNPCs(ctx: CanvasRenderingContext2D): void {
  // Table 1 — 2 NPCs sitting together (right of bakery)
  // Table surface
  ctx.fillStyle = '#a1887f';
  ctx.fillRect(370, 848, 36, 6);
  // NPC 1
  drawLegoFigure(ctx, 375, 830, '#f48fb1', '#3f51b5');
  // NPC 2
  drawLegoFigure(ctx, 395, 830, '#80cbc4', '#795548');

  // Table 2 — 1 NPC alone, reading (further right)
  ctx.fillStyle = '#a1887f';
  ctx.fillRect(418, 848, 24, 6);
  // NPC 3 with a "book" square
  drawLegoFigure(ctx, 430, 830, '#ce93d8', '#4caf50');
  // Book
  ctx.fillStyle = '#fff8e1';
  ctx.fillRect(420, 838, 10, 8);
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(424, 838, 1, 8);
}
