import { describe, it, expect } from 'vitest';
import robots from './robots';

describe('robots', () => {
  it('allows all crawlers and points to the sitemap', () => {
    const result = robots();
    expect(result.rules).toEqual({ userAgent: '*', allow: '/' });
    expect(result.sitemap).toBe('https://rakapratama.dev/sitemap.xml');
  });
});
