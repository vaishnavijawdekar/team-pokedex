import { useRef, useEffect, useCallback } from 'react';
import { lerp } from '../utils/lerp';
import { clampToIsland } from '../utils/boundary';

interface Vec2 { x: number; y: number; }

interface PlayerState {
  pos: Vec2;
  vel: Vec2;
  isMoving: boolean;
}

interface UsePlayerMovementResult {
  getState: () => PlayerState;
  update: (cameraOffset: Vec2) => void;
}

const LERP_FACTOR = 0.08;
const MOVE_THRESHOLD = 1.5;

export function usePlayerMovement(spawn: Vec2): UsePlayerMovementResult {
  const mouse = useRef<Vec2>({ x: spawn.x, y: spawn.y });
  const state = useRef<PlayerState>({
    pos: { ...spawn },
    vel: { x: 0, y: 0 },
    isMoving: false,
  });

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      mouse.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const update = useCallback((cameraOffset: Vec2) => {
    // Convert screen mouse to world coords
    const worldMouse = {
      x: mouse.current.x - cameraOffset.x,
      y: mouse.current.y - cameraOffset.y,
    };

    const prev = { ...state.current.pos };
    const newX = lerp(state.current.pos.x, worldMouse.x, LERP_FACTOR);
    const newY = lerp(state.current.pos.y, worldMouse.y, LERP_FACTOR);
    const clamped = clampToIsland(newX, newY);

    state.current.vel = { x: clamped.x - prev.x, y: clamped.y - prev.y };
    state.current.pos = clamped;
    const speed = Math.sqrt(state.current.vel.x ** 2 + state.current.vel.y ** 2);
    state.current.isMoving = speed > MOVE_THRESHOLD;
  }, []);

  const getState = useCallback(() => state.current, []);

  return { getState, update };
}
