import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Testimonials } from './testimonials';

describe('Testimonials', () => {
  it('renders every quote and author from data.json', () => {
    render(<Testimonials />);
    expect(screen.getByText(/Raka bikin fitur kompleks kerasa sederhana/)).toBeInTheDocument();
    expect(screen.getByText('Dewi Anggraini')).toBeInTheDocument();
  });
});
