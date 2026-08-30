import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ContactForm } from './contact-form';
import { data } from '@/lib/data';

async function fillAndSubmit(onOpenMailClient: (href: string) => void) {
  render(<ContactForm onOpenMailClient={onOpenMailClient} />);
  await userEvent.type(screen.getByLabelText(/name/i), 'Budi');
  await userEvent.type(screen.getByLabelText(/email/i), 'budi@example.com');
  await userEvent.type(screen.getByLabelText(/message/i), 'Halo!');
  await userEvent.click(screen.getByRole('button', { name: /kirim-pesan/ }));
}

describe('ContactForm', () => {
  it('hands the composed message to the mail client on submit', async () => {
    const openMailClient = vi.fn();
    await fillAndSubmit(openMailClient);

    expect(openMailClient).toHaveBeenCalledTimes(1);
    const href = openMailClient.mock.calls[0][0];
    expect(href).toMatch(new RegExp(`^mailto:${data.profile.email}\\?`));
    expect(new URL(href).searchParams.get('body')).toContain('Halo!');
  });

  it('announces the handoff and offers a manual fallback link', async () => {
    await fillAndSubmit(vi.fn());

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent(/aplikasi email dibuka/i);
    expect(screen.getByRole('link', { name: /buka manual/i })).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:')
    );
  });

  it('does not claim the message was delivered', async () => {
    await fillAndSubmit(vi.fn());
    expect(screen.queryByText(/pesan terkirim/i)).not.toBeInTheDocument();
  });
});
