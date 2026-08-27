import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/work' }));

import WorkPage from './page';

describe('WorkPage', () => {
  it('renders the page heading, timeline, and project grid', () => {
    render(<WorkPage />);
    expect(screen.getByRole('heading', { name: 'Pengalaman & proyek' })).toBeInTheDocument();
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('DevFlow CLI')).toBeInTheDocument();
  });
});
