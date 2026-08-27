import Link from 'next/link';
import { data } from '@/lib/data';

export function Footer() {
  const { footer, profile } = data;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream font-mono px-6 pt-12 pb-7">
      <div className="max-w-[1100px] mx-auto flex justify-between gap-8 flex-wrap">
        <div className="max-w-[360px]">
          <div className="font-extrabold text-lg mb-2">
            raka@portfolio<span className="text-accent-green">:~$</span> echo &quot;let&apos;s build something&quot;
          </div>
          <div className="text-sm opacity-70 leading-relaxed">{footer.tagline}</div>
        </div>
        <div className="flex gap-12 flex-wrap">
          <div>
            <div className="text-[11px] opacity-50 tracking-[0.08em] mb-2.5">// navigate</div>
            <div className="flex flex-col gap-1.5 text-sm">
              <Link href="/" className="opacity-85 hover:opacity-100 hover:text-accent-green transition-colors">home</Link>
              <Link href="/work" className="opacity-85 hover:opacity-100 hover:text-accent-green transition-colors">work</Link>
              <Link href="/blog" className="opacity-85 hover:opacity-100 hover:text-accent-green transition-colors">blog</Link>
            </div>
          </div>
          <div>
            <div className="text-[11px] opacity-50 tracking-[0.08em] mb-2.5">// connect</div>
            <div className="flex flex-col gap-1.5 text-sm">
              <a href={footer.socialLinks.github} target="_blank" rel="noopener" className="opacity-85 hover:opacity-100 hover:text-accent-green transition-colors">github</a>
              <a href={footer.socialLinks.linkedin} target="_blank" rel="noopener" className="opacity-85 hover:opacity-100 hover:text-accent-green transition-colors">linkedin</a>
              <a href={`mailto:${footer.socialLinks.email}`} className="opacity-85 hover:opacity-100 hover:text-accent-green transition-colors">email</a>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1100px] mx-auto mt-8 pt-5 border-t border-cream/20 text-xs opacity-50 flex justify-between flex-wrap gap-2">
        <span>© {year} {profile.name} — process exited with code 0</span>
        <span>built with too much coffee</span>
      </div>
    </footer>
  );
}
