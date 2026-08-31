import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const pathname = vi.hoisted(() => ({ current: '/work' }));
vi.mock('next/navigation', () => ({ usePathname: () => pathname.current }));

import { Nav } from './nav';

const topNav = () => within(screen.getByRole('navigation', { name: 'Navigasi utama' }));
const bottomNav = () => within(screen.getByRole('navigation', { name: 'Navigasi bawah' }));

describe('Nav', () => {
  beforeEach(() => {
    pathname.current = '/work';
  });

  it('renders all four links with the active one marked', () => {
    render(<Nav />);
    expect(topNav().getByRole('link', { name: /\.\/work/ })).toHaveAttribute('aria-current', 'page');
    expect(topNav().getByRole('link', { name: /cd home/ })).toBeInTheDocument();
    expect(topNav().getByRole('link', { name: /cd blog/ })).toBeInTheDocument();
    expect(topNav().getByRole('link', { name: /cd contact/ })).toBeInTheDocument();
  });

  it('offers the same four destinations in the mobile bottom bar', () => {
    render(<Nav />);
    const links = bottomNav().getAllByRole('link');
    expect(links.map((l) => l.getAttribute('href'))).toEqual(['/', '/work', '/blog', '/contact']);
    expect(bottomNav().getByRole('link', { name: 'work' })).toHaveAttribute('aria-current', 'page');
  });

  // trailingSlash: true means the browser reports "/work/". Before this was
  // handled, every route but home rendered with no active state at all.
  it.each(['/', '/work/', '/blog/', '/contact/'])(
    'marks exactly one link active on %s',
    (path) => {
      pathname.current = path;
      render(<Nav />);

      for (const nav of [topNav(), bottomNav()]) {
        const current = nav.getAllByRole('link').filter((l) => l.getAttribute('aria-current') === 'page');
        expect(current).toHaveLength(1);
        expect(current[0].getAttribute('href')).toBe(path === '/' ? '/' : path.slice(0, -1));
      }
    }
  );
});
