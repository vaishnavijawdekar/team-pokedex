import { useEffect, useRef } from 'react';

export function useGameLoop(tick: (dt: number) => void): void {
  const tickRef = useRef(tick);
  tickRef.current = tick;

  useEffect(() => {
    let rafId: number;
    let last = performance.now();

    function loop(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05); // cap at 50ms
      last = now;
      tickRef.current(dt);
      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);
}
