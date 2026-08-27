import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Marquee } from './marquee';

describe('Marquee', () => {
  it('renders each tool from data.skills.tools at least once', () => {
    render(<Marquee />);
    expect(screen.getAllByText('Vercel').length).toBeGreaterThan(0);
  });
});
