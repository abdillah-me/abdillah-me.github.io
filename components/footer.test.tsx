import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from './footer';

describe('Footer', () => {
  it('renders the tagline and social links from data.json', () => {
    render(<Footer />);
    expect(screen.getByText(/Software engineer di Jakarta/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'github' })).toHaveAttribute(
      'href',
      'https://github.com/rakapratama'
    );
    expect(screen.getByRole('link', { name: 'email' })).toHaveAttribute(
      'href',
      'mailto:hello@rakapratama.dev'
    );
  });
});
