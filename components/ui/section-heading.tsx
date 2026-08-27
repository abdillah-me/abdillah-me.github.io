export function SectionHeading({ eyebrow, title }: { eyebrow: string; title?: string }) {
  return (
    <div className="mb-6">
      <div className="font-mono text-xs uppercase tracking-[0.08em] text-ink-dim mb-2">{eyebrow}</div>
      {title && <h2 className="text-2xl font-bold tracking-tight">{title}</h2>}
    </div>
  );
}
