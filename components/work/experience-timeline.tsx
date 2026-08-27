import { Chip } from '@/components/ui/chip';
import { data } from '@/lib/data';

export function ExperienceTimeline() {
  return (
    <div className="relative pl-7 max-w-[820px]">
      <div className="absolute left-1 top-2 bottom-2 w-0.5 bg-ink/15" />
      {data.experience.map((job) => (
        <div key={`${job.company}-${job.period}`} className="relative pb-9">
          <div
            className="absolute -left-7 top-1 w-3 h-3 rounded-full border-2 border-ink"
            style={{ background: job.dotColor }}
          />
          <div className="bg-white border-2 border-ink rounded-lg p-5.5">
            <div className="flex justify-between flex-wrap gap-2 mb-1.5">
              <div className="font-bold text-[17px]">{job.role}</div>
              <div className="font-mono text-xs text-ink-dim bg-cream-dim px-2.5 py-1 rounded-full whitespace-nowrap">
                {job.period}
              </div>
            </div>
            <div className="text-sm font-semibold text-accent-green mb-3">
              {job.company} · {job.location}
            </div>
            <ul className="list-disc pl-4.5 text-sm leading-relaxed text-ink-dim space-y-1">
              {job.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
            <div className="flex gap-2 flex-wrap mt-3">
              {job.tags.map((tag) => (
                <Chip key={tag}>{tag}</Chip>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
