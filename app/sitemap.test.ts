import { describe, it, expect } from 'vitest';
import sitemap from './sitemap';
import { data } from '@/lib/data';

describe('sitemap', () => {
  it('lists all four routes under the configured site URL', () => {
    const { siteUrl } = data.seo;
    expect(sitemap().map((e) => e.url)).toEqual([
      `${siteUrl}/`,
      `${siteUrl}/work/`,
      `${siteUrl}/blog/`,
      `${siteUrl}/contact/`,
    ]);
  });

  // trailingSlash: true makes /work redirect to /work/, so a sitemap listing
  // the unslashed form would point crawlers at redirects instead of pages.
  it('matches the trailing-slash form the export actually serves', () => {
    for (const entry of sitemap()) {
      expect(entry.url.endsWith('/')).toBe(true);
    }
  });
});
