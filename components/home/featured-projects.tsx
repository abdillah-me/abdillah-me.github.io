import Link from 'next/link';
import Image from 'next/image';
import { data } from '@/lib/data';
import { getFeaturedProjects } from '@/lib/get-featured-projects';

export function FeaturedProjects() {
  const featured = getFeaturedProjects(data.projects);

  return (
    <div className="mt-18 pb-20">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
        <h2 className="font-mono text-sm tracking-[0.08em] text-ink-dim uppercase">/ / kerja terbaru</h2>
        <Link href="/work" className="font-mono text-sm font-bold text-accent-green">lihat semua →</Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {featured.map((p) => (
          <Link
            key={p.name}
            href="/work"
            className="no-underline text-ink bg-white border-2 border-ink rounded-lg overflow-hidden block hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-accent-orange)] transition-transform"
          >
            <div className="aspect-video bg-cream-dim flex items-center justify-center font-mono text-xs text-ink-dim">
              {p.image ? (
                <Image src={p.image} alt={p.name} width={400} height={250} className="w-full h-full object-cover" />
              ) : (
                'screenshot proyek'
              )}
            </div>
            <div className="p-4">
              <div className="font-bold text-[15px] mb-1.5">{p.name}</div>
              <div className="text-[13px] text-ink-dim leading-snug">{p.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
