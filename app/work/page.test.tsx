import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/work' }));

import WorkPage from './page';
import { data } from '@/lib/data';

describe('WorkPage', () => {
  it('renders the page heading, timeline, and project grid', () => {
    render(<WorkPage />);
    expect(screen.getByRole('heading', { name: 'Pengalaman & proyek' })).toBeInTheDocument();
    expect(screen.getAllByText(data.experience[0].role).length).toBeGreaterThan(0);
    expect(screen.getByText(data.projects[0].name)).toBeInTheDocument();
  });
});
