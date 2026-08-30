// Every section needs a heading for the document outline to make sense. When a
// section has no separate title, the eyebrow is the section's name, so it is
// promoted to the h2 itself rather than left as an unlabelled div.
export function SectionHeading({ eyebrow, title }: { eyebrow: string; title?: string }) {
  const eyebrowClass = 'font-mono text-xs uppercase tracking-[0.08em] text-ink-dim mb-2';

  return (
    <div className="mb-6">
      {title ? (
        <>
          <div className={eyebrowClass}>{eyebrow}</div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        </>
      ) : (
        <h2 className={eyebrowClass}>{eyebrow}</h2>
      )}
    </div>
  );
}
