import { describe, it, expect } from 'vitest';
import { lerp } from '../lerp';

describe('lerp', () => {
  it('returns a when t=0', () => expect(lerp(0, 10, 0)).toBe(0));
  it('returns b when t=1', () => expect(lerp(0, 10, 1)).toBe(10));
  it('returns midpoint when t=0.5', () => expect(lerp(0, 10, 0.5)).toBe(5));
  it('works with negative values', () => expect(lerp(-10, 10, 0.5)).toBe(0));
});
