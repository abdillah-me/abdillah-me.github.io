import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { ProjectGrid } from './project-grid';

describe('ProjectGrid', () => {
  it('shows all projects by default and filters when a category button is clicked', async () => {
    render(<ProjectGrid />);
    expect(screen.getByText('DevFlow CLI')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'ai/ml' }));
    expect(screen.queryByText('DevFlow CLI')).not.toBeInTheDocument();
    expect(screen.getByText('Loop AI Assistant')).toBeInTheDocument();
  });
});
