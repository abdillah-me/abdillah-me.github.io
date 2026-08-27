import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FeaturedProjects } from './featured-projects';

describe('FeaturedProjects', () => {
  it('renders only projects flagged as featured in data.json', () => {
    render(<FeaturedProjects />);
    expect(screen.getByText('Nimbus Analytics Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('DevFlow CLI')).not.toBeInTheDocument();
  });
});
