import { SectionHeading } from '@/components/ui/section-heading';
import { data } from '@/lib/data';

export function Education() {
  return (
    <div className="mt-14">
      <SectionHeading eyebrow="/ / pendidikan" />
      <div className="flex flex-col">
        {data.education.map((e) => (
          <div key={e.school} className="flex gap-6 py-5 border-b-[1.5px] border-ink/15">
            <div className="font-mono text-[13px] text-accent-green w-[110px] shrink-0 font-bold">{e.year}</div>
            <div>
              <div className="font-bold text-[17px]">{e.school}</div>
              <div className="text-sm text-ink-dim mt-0.5">{e.degree}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
