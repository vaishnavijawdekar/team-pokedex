// Draws all 4 buildings + bench

function drawDesignStudio(ctx: CanvasRenderingContext2D, x: number, y: number, hovered: boolean): void {
  ctx.save();
  if (hovered) ctx.translate(0, -4);
  // Walls
  ctx.fillStyle = '#fff8e1';
  ctx.fillRect(x - 40, y - 30, 80, 60);
  // Roof (pitched)
  ctx.fillStyle = '#f48fb1';
  ctx.beginPath();
  ctx.moveTo(x - 48, y - 30);
  ctx.lineTo(x, y - 70);
  ctx.lineTo(x + 48, y - 30);
  ctx.closePath();
  ctx.fill();
  // Window (warm light)
  ctx.fillStyle = '#ffe066';
  ctx.fillRect(x - 12, y - 20, 24, 18);
  // Door
  ctx.fillStyle = '#8b5e3c';
  ctx.fillRect(x - 8, y + 10, 16, 20);
  // Chimney
  ctx.fillStyle = '#e0e0e0';
  ctx.fillRect(x + 20, y - 60, 10, 22);
  ctx.restore();
}

function drawLibrary(ctx: CanvasRenderingContext2D, x: number, y: number, hovered: boolean): void {
  ctx.save();
  if (hovered) ctx.translate(0, -4);
  // Walls
  ctx.fillStyle = '#e8d5b7';
  ctx.fillRect(x - 44, y - 35, 88, 65);
  // Roof
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(x - 50, y - 42, 100, 12);
  // Columns
  ctx.fillStyle = '#f5f5f5';
  for (let i = -30; i <= 30; i += 20) {
    ctx.fillRect(x + i - 4, y - 35, 8, 65);
  }
  // Sign
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(x - 20, y - 60, 40, 14);
  ctx.restore();
}

function drawBakery(ctx: CanvasRenderingContext2D, x: number, y: number, hovered: boolean): void {
  ctx.save();
  if (hovered) ctx.translate(0, -4);
  // Walls
  ctx.fillStyle = '#fff8e1';
  ctx.fillRect(x - 44, y - 34, 88, 64);
  // Roof (pink)
  ctx.fillStyle = '#f06292';
  ctx.fillRect(x - 50, y - 40, 100, 10);
  // Awning
  ctx.fillStyle = '#f48fb1';
  ctx.fillRect(x - 44, y - 30, 88, 8);
  // Display window
  ctx.fillStyle = '#b3e5fc';
  ctx.fillRect(x - 30, y - 20, 60, 30);
  // Door
  ctx.fillStyle = '#8b5e3c';
  ctx.fillRect(x - 8, y + 10, 16, 20);
  // Outdoor tables
  ctx.fillStyle = '#a1887f';
  ctx.fillRect(x + 60, y - 10, 30, 4);  // table 1
  ctx.fillRect(x + 60, y + 20, 30, 4);  // table 2
  ctx.restore();
}

function drawPostOffice(ctx: CanvasRenderingContext2D, x: number, y: number, hovered: boolean): void {
  ctx.save();
  if (hovered) ctx.translate(0, -4);
  // Walls
  ctx.fillStyle = '#e3f2fd';
  ctx.fillRect(x - 44, y - 34, 88, 64);
  // Roof
  ctx.fillStyle = '#1565c0';
  ctx.fillRect(x - 50, y - 40, 100, 10);
  // Door (rounded arch feel)
  ctx.fillStyle = '#1565c0';
  ctx.fillRect(x - 12, y + 10, 24, 20);
  ctx.beginPath();
  ctx.arc(x, y + 10, 12, Math.PI, 0);
  ctx.fill();
  // Windows
  ctx.fillStyle = '#fff176';
  ctx.fillRect(x - 38, y - 20, 20, 18);
  ctx.fillRect(x + 18, y - 20, 20, 18);
  ctx.restore();
}

function drawBench(ctx: CanvasRenderingContext2D, x: number, y: number, playerSitting: boolean): void {
  ctx.fillStyle = '#8b5e3c';
  // Seat
  ctx.fillRect(x - 20, y - 4, 40, 6);
  // Legs
  ctx.fillRect(x - 18, y + 2, 4, 10);
  ctx.fillRect(x + 14, y + 2, 4, 10);
  // Back
  ctx.fillRect(x - 20, y - 12, 40, 4);

  if (playerSitting) {
    ctx.fillStyle = '#f9c6d0';
    ctx.fillRect(x - 8, y - 18, 16, 16);
  }
}

export interface BuildingHoverState {
  studio: boolean;
  library: boolean;
  bakery: boolean;
  postOffice: boolean;
}

export function drawBuildings(
  ctx: CanvasRenderingContext2D,
  hover: BuildingHoverState,
  playerSitting: boolean
): void {
  drawDesignStudio(ctx, 520, 330, hover.studio);
  drawLibrary(ctx, 1150, 290, hover.library);
  drawBakery(ctx, 300, 870, hover.bakery);
  drawPostOffice(ctx, 1280, 870, hover.postOffice);
  drawBench(ctx, 800, 180, playerSitting);
}

export const BUILDING_CENTERS = {
  studio:     { x: 520,  y: 330 },
  library:    { x: 1150, y: 290 },
  bakery:     { x: 300,  y: 870 },
  postOffice: { x: 1280, y: 870 },
  bench:      { x: 800,  y: 180 },
};
