import { describe, it, expect } from 'vitest';
import robots from './robots';
import { data } from '@/lib/data';

describe('robots', () => {
  it('allows all crawlers and points to the sitemap', () => {
    const result = robots();
    expect(result.rules).toEqual({ userAgent: '*', allow: '/' });
    expect(result.sitemap).toBe(`${data.seo.siteUrl}/sitemap.xml`);
  });
});
