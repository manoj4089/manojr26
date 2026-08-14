'use client';

import { useRef } from 'react';

import { gsap, useGSAP } from '@/lib/gsap';
import { MQ } from '@/lib/constants';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Children to stagger. Defaults to the direct children of the wrapper.
   * Pass a selector to target deeper elements (e.g. 'li', '[data-stat]').
   */
  selector?: string;
  stagger?: number;
  y?: number;
  delay?: number;
  start?: string;
}

/**
 * Entry reveal for non-text blocks — stat grids, cards, timeline rows, chips.
 *
 * Wraps server-rendered markup in a client boundary purely so useGSAP has a
 * scope to attach to and revert from. The children stay server components, so
 * this costs a div and no extra serialized props.
 *
 * Under reduced motion nothing is set at all — the content is simply already
 * there, which is the only version of "reduced" that cannot get stuck.
 */
export function Reveal({
  children,
  className = '',
  selector,
  stagger = 0.08,
  y = 28,
  delay = 0,
  start = 'top 85%',
}: RevealProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add({ reduced: MQ.reduced, motion: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
        if (ctx.conditions?.reduced) return;

        const targets = selector
          ? gsap.utils.toArray<HTMLElement>(selector, el)
          : (Array.from(el.children) as HTMLElement[]);

        if (!targets.length) return;

        gsap.from(targets, {
          y,
          opacity: 0,
          duration: 0.9,
          delay,
          stagger,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start, once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
