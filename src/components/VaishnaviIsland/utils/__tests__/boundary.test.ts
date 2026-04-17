import { describe, it, expect } from 'vitest';
import { clampToIsland } from '../boundary';

describe('clampToIsland', () => {
  it('returns same point when inside ellipse', () => {
    const result = clampToIsland(800, 600);
    expect(result.x).toBeCloseTo(800);
    expect(result.y).toBeCloseTo(600);
  });

  it('clamps point outside ellipse to boundary', () => {
    const result = clampToIsland(2000, 600);
    expect(result.x).toBeCloseTo(1480);
    expect(result.y).toBeCloseTo(600);
  });

  it('clamps point above island', () => {
    const result = clampToIsland(800, -500);
    expect(result.x).toBeCloseTo(800);
    expect(result.y).toBeCloseTo(100);
  });
});
