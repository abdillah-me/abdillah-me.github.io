import type { Metadata } from 'next';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { ExperienceTimeline } from '@/components/work/experience-timeline';
import { ProjectGrid } from '@/components/work/project-grid';
import { data } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Pengalaman & Proyek',
  description: `Riwayat kerja dan proyek yang dikerjakan oleh ${data.profile.name}.`,
};

export default function WorkPage() {
  return (
    <div className="font-sans text-ink min-h-screen flex flex-col">
      <Nav />
      <div className="flex-1 max-w-[1100px] mx-auto px-6 py-14 w-full">
        <div className="font-mono text-sm text-accent-green mb-2">$ git log --experience</div>
        <h1 className="text-[42px] font-bold mb-10 tracking-tight">Pengalaman & proyek</h1>

        <h2 className="font-mono text-sm tracking-[0.08em] text-ink-dim uppercase mb-6">/ / riwayat kerja</h2>
        <ExperienceTimeline />

        <h2 className="font-mono text-sm tracking-[0.08em] text-ink-dim uppercase mt-12 mb-6">/ / proyek</h2>
        <ProjectGrid />
      </div>
      <Footer />
    </div>
  );
}
