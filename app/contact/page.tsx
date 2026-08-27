import type { Metadata } from 'next';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { TerminalWindow } from '@/components/ui/terminal-window';
import { Testimonials } from '@/components/contact/testimonials';
import { ContactForm } from '@/components/contact/contact-form';
import { data } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Kontak',
  description: `Hubungi ${data.profile.name} untuk kolaborasi, proyek freelance, atau sekadar menyapa.`,
};

export default function ContactPage() {
  const { profile } = data;

  return (
    <div className="font-sans text-ink min-h-screen flex flex-col">
      <Nav />
      <div className="flex-1 max-w-[1000px] mx-auto px-6 py-14 w-full">
        <div className="font-mono text-sm text-accent-green mb-2">$ cat testimonials.log</div>
        <h2 className="font-mono text-sm tracking-[0.08em] text-ink-dim uppercase mb-5">/ / kata mereka</h2>
        <Testimonials />

        <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
          <div>
            <div className="font-mono text-sm text-accent-green mb-2">$ send --message</div>
            <h1 className="text-[38px] font-bold mb-4 tracking-tight">Mari mengobrol</h1>
            <p className="text-base leading-relaxed text-ink-dim mb-6">
              Terbuka untuk kolaborasi, proyek freelance, atau ngobrol soal ide baru. Balas biasanya dalam 1–2 hari kerja.
            </p>
            <div className="flex flex-col gap-2.5 font-mono text-sm">
              <a href={`mailto:${profile.email}`} className="font-bold">{profile.email}</a>
              <a href={profile.linkedin} target="_blank" rel="noopener" className="text-ink">
                {profile.linkedin.replace('https://', '')}
              </a>
              <a href={profile.github} target="_blank" rel="noopener" className="text-ink">
                {profile.github.replace('https://', '')}
              </a>
            </div>
          </div>

          <TerminalWindow title="contact-form.sh">
            <ContactForm />
          </TerminalWindow>
        </div>
      </div>
      <Footer />
    </div>
  );
}
