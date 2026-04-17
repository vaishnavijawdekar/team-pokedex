import { describe, it, expect } from 'vitest';
import { hitTest } from '../hitTest';

describe('hitTest', () => {
  it('returns true when point is inside radius', () => {
    expect(hitTest(50, 50, 50, 50, 60)).toBe(true);
  });

  it('returns true when point is exactly on boundary', () => {
    expect(hitTest(110, 50, 50, 50, 60)).toBe(true);
  });

  it('returns false when point is outside radius', () => {
    expect(hitTest(200, 200, 50, 50, 60)).toBe(false);
  });
});
