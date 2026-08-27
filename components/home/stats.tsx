'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { data } from '@/lib/data';
import { computeCounts } from '@/lib/compute-counts';

gsap.registerPlugin(ScrollTrigger);

export function Stats() {
  const { stats } = data;
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const obj = { value: 0 };
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            value: 1,
            duration: 0.9,
            ease: 'power1.out',
            onUpdate: () => setProgress(obj.value),
          });
        },
      });
    },
    { scope: sectionRef }
  );

  const counts = computeCounts(stats.map((s) => s.value), progress);

  return (
    <div ref={sectionRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <div key={stat.label} className="bg-white border-2 border-ink rounded-lg p-5">
          <div className="font-mono text-3xl font-extrabold text-accent-green">
            {counts[i]}
            {stat.suffix}
          </div>
          <div className="text-sm text-ink-dim mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
