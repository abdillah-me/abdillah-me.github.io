import { describe, it, expect } from 'vitest';
import sitemap from './sitemap';
import { data } from '@/lib/data';

describe('sitemap', () => {
  it('lists all four routes under the configured site URL', () => {
    const { siteUrl } = data.seo;
    expect(sitemap().map((e) => e.url)).toEqual([
      siteUrl,
      `${siteUrl}/work`,
      `${siteUrl}/blog`,
      `${siteUrl}/contact`,
    ]);
  });
});
