import { describe, it, expect } from 'vitest';
import { isActiveLink } from './is-active-link';

describe('isActiveLink', () => {
  it('matches the home route exactly', () => {
    expect(isActiveLink('/', '/')).toBe(true);
    expect(isActiveLink('/work', '/')).toBe(false);
  });

  it('matches non-home routes', () => {
    expect(isActiveLink('/work', '/work')).toBe(true);
    expect(isActiveLink('/blog', '/work')).toBe(false);
  });

  // trailingSlash: true means the browser reports "/work/", not "/work".
  // Without normalising, every route except home lost its active state.
  it('ignores a trailing slash on either side', () => {
    expect(isActiveLink('/work/', '/work')).toBe(true);
    expect(isActiveLink('/blog/', '/blog')).toBe(true);
    expect(isActiveLink('/contact/', '/contact')).toBe(true);
    expect(isActiveLink('/', '/')).toBe(true);
    expect(isActiveLink('/work/', '/blog')).toBe(false);
  });
});
