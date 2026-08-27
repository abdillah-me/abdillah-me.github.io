import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/data', () => ({
  data: {
    projects: [
      {
        name: 'Screenshot Project',
        category: 'web',
        desc: 'A project with a real screenshot.',
        tags: ['React'],
        image: '/images/screenshot-project.png',
        liveUrl: null,
        codeUrl: null,
        featured: false,
      },
    ],
  },
}));

import { ProjectGrid } from './project-grid';

describe('ProjectGrid image rendering', () => {
  it('renders an img element when project.image is set instead of the placeholder text', () => {
    render(<ProjectGrid />);
    const image = screen.getByRole('img', { name: 'Screenshot Project' });
    expect(image).toBeInTheDocument();
    expect(screen.queryByText('screenshot proyek')).not.toBeInTheDocument();
  });
});
