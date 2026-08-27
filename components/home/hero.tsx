'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { data } from '@/lib/data';
import { getTypedText } from '@/lib/get-typed-text';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Hero() {
  const { profile } = data;
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
      profile.terminalLines.forEach((line, i) => {
        tl.to(
          {},
          {
            duration: line.text.length * 0.028,
            onUpdate: function () {
              const progress = this.progress();
              setLineIndex(i);
              setCharIndex(Math.round(progress * line.text.length));
            },
          }
        );
      });

      // Pause the (otherwise infinitely repeating) typewriter timeline while
      // the hero is scrolled out of view so it doesn't keep re-rendering at
      // ~60fps in the background, and resume it once it's visible again.
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onLeave: () => tl.pause(),
        onEnterBack: () => tl.resume(),
        onEnter: () => tl.resume(),
        onLeaveBack: () => tl.pause(),
      });
    },
    { scope: containerRef }
  );

  const typedLines = getTypedText(profile.terminalLines, lineIndex, charIndex);

  return (
    <div ref={containerRef} className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden bg-cream">
      <div className="relative max-w-[1100px] mx-auto px-6 w-full">
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            {profile.openToWork && (
              <div className="inline-flex items-center gap-2 bg-accent-green-soft border-[1.5px] border-ink rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-[blink_1.6s_ease-in-out_infinite]" />
                open to kolaborasi & full-time
              </div>
            )}
            <h1 className="text-[44px] md:text-[64px] leading-[1.02] font-bold mb-5 tracking-tight">
              Halo, saya<br />
              <span className="relative inline-block">{profile.name}</span>
            </h1>
            <p className="text-lg leading-relaxed text-ink-dim max-w-[520px] mb-7">{profile.tagline}</p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/work" className="no-underline bg-ink text-cream font-mono font-bold text-sm px-5 py-3.5 rounded-lg inline-block hover:bg-accent-green transition-colors">
                ./lihat-proyek.sh
              </Link>
              <Link href="/contact" className="no-underline bg-transparent text-ink font-mono font-bold text-sm px-5 py-3.5 rounded-lg border-2 border-ink inline-block hover:bg-cream-dim transition-colors">
                say hello --wave
              </Link>
            </div>
          </div>

          <div className="relative bg-ink rounded-xl overflow-hidden shadow-[8px_8px_0_var(--color-accent-orange)] animate-[floaty_5s_ease-in-out_infinite]">
            <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-ink/90">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              <span className="ml-2 font-mono text-[11px] text-cream-dim">whoami.sh</span>
            </div>
            <div className="px-5 pt-5 pb-6 font-mono text-[13.5px] leading-loose text-accent-green-soft min-h-[190px]">
              {typedLines.map((ln, i) => (
                <div key={i} className={ln.prefix === '$ ' && i > 0 ? 'mt-2.5' : ''}>
                  <span className="text-accent-orange">{ln.prefix}</span>
                  {ln.text}
                  {ln.showCursor && <span className="animate-[blink_1s_step-start_infinite]">▌</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
