import { data } from '@/lib/data';

export function Marquee() {
  const items = [...data.skills.tools, ...data.skills.tools];

  return (
    <div className="border-y-2 border-ink bg-cream-dim py-4 overflow-hidden">
      <div className="flex w-max animate-[marquee_26s_linear_infinite]">
        {items.map((tool, i) => (
          <span
            key={`${tool}-${i}`}
            className="font-mono text-sm font-bold whitespace-nowrap px-5.5 border-r-[1.5px] border-ink/20"
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}
