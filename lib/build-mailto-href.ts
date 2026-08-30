export interface MailtoFields {
  to: string;
  name: string;
  email: string;
  message: string;
}

export function buildMailtoHref({ to, name, email, message }: MailtoFields): string {
  const subject = `Halo dari ${name.trim()}`;
  const body = [`Nama: ${name.trim()}`, `Email: ${email.trim()}`, '', message.trim()].join('\n');

  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
