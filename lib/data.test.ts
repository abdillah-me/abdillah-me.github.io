import { describe, it, expect } from 'vitest';
import { data } from './data';

describe('portfolio data', () => {
  it('has all required top-level sections', () => {
    expect(data.profile).toBeDefined();
    expect(Array.isArray(data.stats)).toBe(true);
    expect(data.about).toBeDefined();
    expect(data.skills).toBeDefined();
    expect(Array.isArray(data.education)).toBe(true);
    expect(Array.isArray(data.experience)).toBe(true);
    expect(Array.isArray(data.projects)).toBe(true);
    expect(Array.isArray(data.blog)).toBe(true);
    expect(Array.isArray(data.testimonials)).toBe(true);
    expect(data.footer).toBeDefined();
    expect(data.seo).toBeDefined();
  });

  it('has at least one featured project', () => {
    expect(data.projects.some((p) => p.featured)).toBe(true);
  });

  it('has three stats matching the hero counters', () => {
    expect(data.stats).toHaveLength(3);
  });
});
