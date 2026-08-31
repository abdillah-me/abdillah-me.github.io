'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { isActiveLink } from '@/lib/is-active-link';
import { data } from '@/lib/data';

// Square caps and a 2px stroke so the icons read as part of the same hard-edged
// language as the 2px borders, rather than the soft rounded set every app ships.
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const LINKS = [
  {
    href: '/',
    label: 'home',
    icon: (
      <Icon>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5.5 9.5V21h13V9.5" />
      </Icon>
    ),
  },
  {
    href: '/work',
    label: 'work',
    icon: (
      <Icon>
        <path d="M3 7.5h18v13H3z" />
        <path d="M9 7.5V4h6v3.5" />
      </Icon>
    ),
  },
  {
    href: '/blog',
    label: 'blog',
    icon: (
      <Icon>
        <path d="M5 3h9l5 5v13H5z" />
        <path d="M9 12h7M9 16h7" />
      </Icon>
    ),
  },
  {
    href: '/contact',
    label: 'contact',
    icon: (
      <Icon>
        <path d="M3 5h18v14H3z" />
        <path d="m3 6 9 7 9-7" />
      </Icon>
    ),
  },
];

export function Nav() {
  const pathname = usePathname();
  const { profile } = data;

  return (
    <>
      <nav
        aria-label="Navigasi utama"
        className="sticky top-0 z-50 bg-cream border-b-2 border-ink font-mono"
      >
        <div className="max-w-[1100px] mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-extrabold text-base hover:text-accent-green transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-accent-green inline-block" />
            {profile.handle}@portfolio<span className="text-accent-green">:~$</span>
          </Link>

          {/* Below md this row is display:none, so the bottom bar below is the
              only navigation in the accessibility tree — never both at once. */}
          <div className="hidden md:flex gap-1 flex-wrap text-sm">
            {LINKS.map((item) => {
              const active = isActiveLink(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
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
      </nav>

      <nav
        aria-label="Navigasi bawah"
        className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-cream border-t-2 border-ink font-mono pb-[env(safe-area-inset-bottom)]"
      >
        <div className="flex items-stretch justify-around px-2 py-2">
          {LINKS.map((item) => {
            const active = isActiveLink(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`no-underline flex flex-col items-center gap-1 flex-1 px-2 py-1.5 rounded-md text-[11px] font-bold transition-colors ${
                  active ? 'bg-ink text-cream' : 'text-ink active:bg-cream-dim'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
