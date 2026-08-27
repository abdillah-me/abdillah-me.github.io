import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

import HomePage from './page';

describe('HomePage', () => {
  it('renders the hero heading and the about section', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /Halo, saya/ })).toBeInTheDocument();
    expect(screen.getByText('Tentang saya')).toBeInTheDocument();
  });
});
