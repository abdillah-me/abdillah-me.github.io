import { describe, it, expect } from 'vitest';
import sitemap from './sitemap';

describe('sitemap', () => {
  it('lists all four routes under the configured site URL', () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toEqual([
      'https://rakapratama.dev',
      'https://rakapratama.dev/work',
      'https://rakapratama.dev/blog',
      'https://rakapratama.dev/contact',
    ]);
  });
});
