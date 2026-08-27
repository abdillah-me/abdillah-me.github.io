import type { ReactNode } from 'react';

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-xs font-semibold bg-cream-dim rounded-lg px-3 py-1.5">
      {children}
    </span>
  );
}
