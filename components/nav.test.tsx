import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/work' }));

import { Nav } from './nav';

describe('Nav', () => {
  it('renders all four links with the active one marked', () => {
    render(<Nav />);
    const workLink = screen.getByRole('link', { name: /\.\/work/ });
    expect(workLink).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cd home/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cd blog/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cd contact/ })).toBeInTheDocument();
  });
});
