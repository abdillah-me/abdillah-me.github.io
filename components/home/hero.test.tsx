import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Hero } from './hero';

describe('Hero', () => {
  it('renders the profile name and tagline from data.json', () => {
    render(<Hero />);
    expect(screen.getByText(/Raka Pratama/)).toBeInTheDocument();
    expect(screen.getByText(/Fokus di web, mobile, dan otomasi berbasis AI/)).toBeInTheDocument();
  });

  it('shows the open-to-work badge when profile.openToWork is true', () => {
    render(<Hero />);
    expect(screen.getByText(/open to kolaborasi/)).toBeInTheDocument();
  });
});
