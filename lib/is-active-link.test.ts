import { describe, it, expect } from 'vitest';
import { isActiveLink } from './is-active-link';

describe('isActiveLink', () => {
  it('matches the home route exactly', () => {
    expect(isActiveLink('/', '/')).toBe(true);
    expect(isActiveLink('/work', '/')).toBe(false);
  });

  it('matches non-home routes by prefix', () => {
    expect(isActiveLink('/work', '/work')).toBe(true);
    expect(isActiveLink('/blog', '/work')).toBe(false);
  });
});
