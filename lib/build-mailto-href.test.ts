import { describe, it, expect } from 'vitest';
import { buildMailtoHref } from './build-mailto-href';

const fields = {
  to: 'halo@example.com',
  name: 'Budi',
  email: 'budi@example.com',
  message: 'Halo!',
};

describe('buildMailtoHref', () => {
  it('addresses the mail to the recipient', () => {
    expect(buildMailtoHref(fields)).toMatch(/^mailto:halo@example\.com\?/);
  });

  it('carries the sender details and message in the body', () => {
    const body = new URL(buildMailtoHref(fields)).searchParams.get('body');
    expect(body).toContain('Nama: Budi');
    expect(body).toContain('budi@example.com');
    expect(body).toContain('Halo!');
  });

  it('percent-encodes characters that would otherwise break the URL', () => {
    const href = buildMailtoHref({ ...fields, message: 'a&b=c d' });
    expect(href).toContain('a%26b%3Dc%20d');
    expect(new URL(href).searchParams.get('body')).toContain('a&b=c d');
  });

  it('trims surrounding whitespace from every field', () => {
    const href = buildMailtoHref({ ...fields, name: '  Budi  ' });
    expect(new URL(href).searchParams.get('subject')).toBe('Halo dari Budi');
  });
});
