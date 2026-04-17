// Draws the player (Vaishnavi's lego avatar) on the canvas
// Uses image if loaded; falls back to pixel-art lego figure

let avatarImage: HTMLImageElement | null = null;
let imageLoaded = false;

export function preloadAvatar(src: string): void {
  const img = new Image();
  img.onload = () => { imageLoaded = true; };
  img.src = src;
  avatarImage = img;
}

function drawLegoPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
): void {
  // Head (cream)
  ctx.fillStyle = '#ffe0b2';
  ctx.fillRect(x - 8, y - 30, 16, 14);
  // Hair (dark)
  ctx.fillStyle = '#4e342e';
  ctx.fillRect(x - 8, y - 30, 16, 5);
  // Body (cream top — matches lego)
  ctx.fillStyle = '#fff8e1';
  ctx.fillRect(x - 9, y - 16, 18, 16);
  // Blue jeans
  ctx.fillStyle = '#1565c0';
  ctx.fillRect(x - 8, y, 7, 12);
  ctx.fillRect(x + 1, y, 7, 12);
  // Pink crocs
  ctx.fillStyle = '#f48fb1';
  ctx.fillRect(x - 9, y + 12, 8, 5);
  ctx.fillRect(x + 1, y + 12, 8, 5);
}

export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  isMoving: boolean,
  frame: number
): void {
  ctx.save();

  // Walking bob: slight vertical offset when moving
  const bob = isMoving ? Math.sin(frame * 0.3) * 3 : 0;

  if (imageLoaded && avatarImage) {
    const size = 48;
    ctx.drawImage(avatarImage, x - size / 2, y - size + bob, size, size);
  } else {
    ctx.translate(0, bob);
    drawLegoPlayer(ctx, x, y);
  }

  ctx.restore();
}
