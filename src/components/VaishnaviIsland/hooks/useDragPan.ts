import { useRef, useEffect, useCallback } from 'react';

interface Vec2 { x: number; y: number; }

interface UseDragPanResult {
  getOffset: () => Vec2;
  clampOffset: (offset: Vec2, viewW: number, viewH: number, worldW: number, worldH: number) => Vec2;
}

export function useDragPan(canvasRef: React.RefObject<HTMLCanvasElement | null>): UseDragPanResult {
  const offset = useRef<Vec2>({ x: 0, y: 0 });
  const dragging = useRef(false);
  const dragStart = useRef<Vec2>({ x: 0, y: 0 });
  const offsetStart = useRef<Vec2>({ x: 0, y: 0 });

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    function onDown(e: MouseEvent) {
      dragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
      offsetStart.current = { ...offset.current };
    }
    function onMove(e: MouseEvent) {
      if (!dragging.current) return;
      offset.current = {
        x: offsetStart.current.x + (e.clientX - dragStart.current.x),
        y: offsetStart.current.y + (e.clientY - dragStart.current.y),
      };
    }
    function onUp() { dragging.current = false; }

    el.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [canvasRef]);

  const clampOffset = useCallback((
    off: Vec2, viewW: number, viewH: number, worldW: number, worldH: number
  ): Vec2 => ({
    x: Math.min(0, Math.max(viewW - worldW, off.x)),
    y: Math.min(0, Math.max(viewH - worldH, off.y)),
  }), []);

  const getOffset = useCallback(() => offset.current, []);

  return { getOffset, clampOffset };
}
