import { data } from '@/lib/data';

export function Testimonials() {
  if (data.testimonials.length === 0) return null;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4.5 mb-16">
      {data.testimonials.map((t) => (
        <div key={t.name} className="bg-white border-2 border-ink rounded-lg p-5 flex flex-col">
          <div className="text-sm leading-relaxed text-ink flex-1">&quot;{t.quote}&quot;</div>
          <div className="flex items-center gap-2.5 mt-4">
            <div className="w-8.5 h-8.5 rounded-full bg-cream-dim shrink-0" />
            <div>
              <div className="font-bold text-[13px]">{t.name}</div>
              <div className="font-mono text-[11.5px] text-ink-dim">{t.role}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
