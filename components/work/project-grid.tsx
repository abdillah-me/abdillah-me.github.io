'use client';

import { useState } from 'react';
import { Chip } from '@/components/ui/chip';
import { data } from '@/lib/data';
import { filterProjects, type ProjectFilter } from '@/lib/filter-projects';

const CATEGORIES: { value: ProjectFilter; label: string }[] = [
  { value: 'semua', label: 'semua' },
  { value: 'web', label: 'web' },
  { value: 'mobile', label: 'mobile' },
  { value: 'backend', label: 'backend' },
  { value: 'ai', label: 'ai/ml' },
  { value: 'automation', label: 'automasi' },
];

export function ProjectGrid() {
  const [active, setActive] = useState<ProjectFilter>('semua');
  const filtered = filterProjects(data.projects, active);

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setActive(c.value)}
            className={`font-mono text-sm font-bold rounded-full px-4 py-2 border-2 border-ink transition-colors ${
              active === c.value ? 'bg-ink text-cream' : 'bg-transparent text-ink hover:bg-cream-dim'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p) => (
          <div key={p.name} className="bg-white border-2 border-ink rounded-lg overflow-hidden flex flex-col">
            <div className="aspect-video bg-cream-dim flex items-center justify-center font-mono text-xs text-ink-dim">
              screenshot proyek
            </div>
            <div className="p-4.5 flex flex-col flex-1">
              <div className="font-mono text-xs font-bold text-accent-green uppercase mb-1.5">{p.category}</div>
              <div className="font-bold text-base mb-1.5">{p.name}</div>
              <div className="text-[13.5px] text-ink-dim leading-snug flex-1">{p.desc}</div>
              <div className="flex gap-1.5 flex-wrap my-3.5">
                {p.tags.map((tag) => (
                  <Chip key={tag}>{tag}</Chip>
                ))}
              </div>
              <div className="flex gap-3.5 font-mono text-xs font-bold">
                {p.liveUrl && <a href={p.liveUrl}>live →</a>}
                {p.codeUrl && <a href={p.codeUrl} className="text-ink">code →</a>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
