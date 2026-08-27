'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isActiveLink } from '@/lib/is-active-link';

const LINKS = [
  { href: '/', label: 'home' },
  { href: '/work', label: 'work' },
  { href: '/blog', label: 'blog' },
  { href: '/contact', label: 'contact' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-50 bg-cream border-b-2 border-ink font-mono">
      <div className="max-w-[1100px] mx-auto px-6 py-3.5 flex items-center justify-between gap-4 flex-wrap">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-base hover:text-accent-green transition-colors">
          <span className="w-2.5 h-2.5 rounded-sm bg-accent-green inline-block" />
          raka@portfolio<span className="text-accent-green">:~$</span>
        </Link>
        <div className="flex gap-1 flex-wrap text-sm">
          {LINKS.map((item) => {
            const active = isActiveLink(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`no-underline px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  active ? 'bg-ink text-cream font-bold' : 'text-ink hover:bg-cream-dim'
                }`}
              >
                {active ? `./${item.label}` : `cd ${item.label}`}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
