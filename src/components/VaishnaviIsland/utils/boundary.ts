// Island ellipse: cx=800, cy=600, rx=680, ry=500
const CX = 800, CY = 600, RX = 680, RY = 500;

export function clampToIsland(x: number, y: number): { x: number; y: number } {
  const dx = (x - CX) / RX;
  const dy = (y - CY) / RY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist <= 1) return { x, y };
  return { x: CX + (dx / dist) * RX, y: CY + (dy / dist) * RY };
}
