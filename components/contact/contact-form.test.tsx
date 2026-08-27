import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { ContactForm } from './contact-form';

describe('ContactForm', () => {
  it('shows a success message after submitting, without a network call', async () => {
    render(<ContactForm />);
    await userEvent.type(screen.getByLabelText(/name/i), 'Budi');
    await userEvent.type(screen.getByLabelText(/email/i), 'budi@example.com');
    await userEvent.type(screen.getByLabelText(/message/i), 'Halo!');
    await userEvent.click(screen.getByRole('button', { name: /kirim-pesan/ }));

    expect(screen.getByText(/pesan terkirim/i)).toBeInTheDocument();
  });
});
