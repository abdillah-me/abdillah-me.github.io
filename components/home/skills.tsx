import { SectionHeading } from '@/components/ui/section-heading';
import { Chip } from '@/components/ui/chip';
import { data } from '@/lib/data';
import { levelToPercent } from '@/lib/level-to-percent';

export function Skills() {
  const { skills } = data;

  return (
    <div className="mt-18">
      <SectionHeading eyebrow="/ / keahlian teknis" title="" />
      <div className="grid sm:grid-cols-2 gap-5">
        {skills.groups.map((group) => (
          <div key={group.title} className="bg-white border-2 border-ink rounded-lg p-5.5">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-2 h-2 rounded-sm" style={{ background: group.color }} />
              <div className="font-mono font-bold text-sm">{group.title}</div>
            </div>
            <div className="flex flex-col gap-3">
              {group.items.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-[13.5px] mb-1">
                    <span className="font-semibold">{item.name}</span>
                    <span className="font-mono text-ink-dim">
                      {['dasar', 'menengah', 'mahir', 'ahli'][item.level - 1]}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-cream-dim overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${levelToPercent(item.level)}%`, background: group.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2.5 flex-wrap mt-5">
        {skills.tools.map((tool) => (
          <Chip key={tool}>{tool}</Chip>
        ))}
      </div>
    </div>
  );
}
