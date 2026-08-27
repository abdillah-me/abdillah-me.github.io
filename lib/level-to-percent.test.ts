import { describe, it, expect } from 'vitest';
import { levelToPercent } from './level-to-percent';

describe('levelToPercent', () => {
  it('maps level 1-4 to 25-100 percent', () => {
    expect(levelToPercent(1)).toBe(25);
    expect(levelToPercent(4)).toBe(100);
  });
});
