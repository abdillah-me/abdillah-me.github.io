import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { About } from './about';

describe('About', () => {
  it('renders every paragraph and trait from data.json', () => {
    render(<About />);
    expect(screen.getByText(/mulai belajar coding dari mengutak-atik forum game/)).toBeInTheDocument();
    expect(screen.getByText('problem solver')).toBeInTheDocument();
  });
});
