import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Hero } from './hero';
import { data } from '@/lib/data';

describe('Hero', () => {
  it('renders the profile name and tagline from data.json', () => {
    render(<Hero />);
    expect(
      screen.getByRole('heading', { level: 1, name: new RegExp(data.profile.name) })
    ).toBeInTheDocument();
    expect(screen.getByText(data.profile.tagline)).toBeInTheDocument();
  });

  it('shows the open-to-work badge when profile.openToWork is true', () => {
    render(<Hero />);
    expect(screen.getByText(/open to kolaborasi/)).toBeInTheDocument();
  });
});
