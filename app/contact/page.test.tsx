import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/contact' }));

import ContactPage from './page';
import { data } from '@/lib/data';

describe('ContactPage', () => {
  it('renders the heading and contact form', () => {
    render(<ContactPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Mari mengobrol' })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('only shows the testimonials section when there are testimonials', () => {
    render(<ContactPage />);
    const heading = screen.queryByRole('heading', { name: /kata mereka/ });
    expect(heading === null).toBe(data.testimonials.length === 0);
  });
});
