import { describe, it, expect } from 'vitest';
import { computeCounts } from './compute-counts';

describe('computeCounts', () => {
  it('returns all zeros at progress 0', () => {
    expect(computeCounts([4, 30, 12], 0)).toEqual([0, 0, 0]);
  });

  it('returns full targets at progress 1', () => {
    expect(computeCounts([4, 30, 12], 1)).toEqual([4, 30, 12]);
  });

  it('rounds intermediate progress', () => {
    expect(computeCounts([4, 30, 12], 0.5)).toEqual([2, 15, 6]);
  });
});
