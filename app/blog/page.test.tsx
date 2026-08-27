import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/blog' }));

import BlogPage from './page';

describe('BlogPage', () => {
  it('renders the page heading and the post list', () => {
    render(<BlogPage />);
    expect(screen.getByRole('heading', { name: 'Tulisan' })).toBeInTheDocument();
    expect(screen.getByText('Belajar dari Migrasi Monolith ke Microservices')).toBeInTheDocument();
  });
});
