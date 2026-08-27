import type { ReactNode } from 'react';

export function TerminalWindow({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-ink rounded-xl overflow-hidden shadow-[8px_8px_0_var(--color-accent-orange)]">
      <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-ink/90">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        <span className="ml-2 font-mono text-[11px] text-cream-dim">{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
