import { SectionHeading } from '@/components/ui/section-heading';
import { Chip } from '@/components/ui/chip';
import { data } from '@/lib/data';

export function About() {
  const { about } = data;

  return (
    <div id="about" className="mt-22 scroll-mt-20">
      <SectionHeading eyebrow="$ cat about.md" title="Tentang saya" />
      <div className="grid md:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
        <div className="bg-ink rounded-xl overflow-hidden shadow-[6px_6px_0_var(--color-accent-green)] aspect-square flex items-center justify-center font-mono text-xs text-cream/70">
          foto profil
        </div>
        <div className="text-base leading-loose text-ink space-y-4">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <div className="flex gap-2.5 flex-wrap pt-2">
            {about.traits.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
