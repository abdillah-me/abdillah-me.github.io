import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/contact' }));

import ContactPage from './page';

describe('ContactPage', () => {
  it('renders the heading, testimonials, and contact form', () => {
    render(<ContactPage />);
    expect(screen.getByRole('heading', { name: 'Mari mengobrol' })).toBeInTheDocument();
    expect(screen.getByText('Dewi Anggraini')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });
});
