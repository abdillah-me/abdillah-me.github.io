import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from './footer';
import { data } from '@/lib/data';

describe('Footer', () => {
  it('renders the tagline and social links from data.json', () => {
    const { footer } = data;
    render(<Footer />);

    expect(screen.getByText(footer.tagline)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'github' })).toHaveAttribute('href', footer.socialLinks.github);
    expect(screen.getByRole('link', { name: 'linkedin' })).toHaveAttribute('href', footer.socialLinks.linkedin);
    expect(screen.getByRole('link', { name: 'email' })).toHaveAttribute(
      'href',
      `mailto:${footer.socialLinks.email}`
    );
  });
});
