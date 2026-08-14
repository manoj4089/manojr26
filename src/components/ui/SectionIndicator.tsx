'use client';

import { useRef } from 'react';

import { SECTIONS, SECTION_COUNT } from '@/lib/constants';
import { gsap, useGSAP } from '@/lib/gsap';
import { pad2 } from '@/lib/math';
import { useAppStore } from '@/store/useAppStore';

/**
 * The persistent "03 / 06 · WORK" readout in the bottom-right corner.
 *
 * The digit swap is a two-element crossfade: the outgoing numeral slides up and
 * out, the incoming one slides in from below. `revertOnUpdate` clears the
 * previous tween's inline styles before the new one runs, so rapid section
 * changes cannot leave a numeral stranded mid-slide.
 */
export function SectionIndicator() {
  const root = useRef<HTMLDivElement>(null);
  const activeIndex = useAppStore((s) => s.activeIndex);
  const section = SECTIONS[activeIndex] ?? SECTIONS[0];

  useGSAP(
    () => {
      const num = root.current?.querySelector<HTMLElement>('[data-indicator-num]');
      const label = root.current?.querySelector<HTMLElement>('[data-indicator-label]');
      if (!num || !label) return;

      gsap
        .timeline()
        .fromTo(
          num,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
        )
        .fromTo(
          label,
          { yPercent: 60, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.45, ease: 'power3.out' },
          '<0.06',
        );
    },
    { dependencies: [activeIndex], revertOnUpdate: true, scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden
      className="fixed bottom-6 right-6 z-[var(--z-nav)] hidden items-baseline gap-2.5 lg:flex"
    >
      <span className="reveal-mask">
        <span
          data-indicator-num
          className="block font-mono text-sm tabular-nums leading-none text-acid"
        >
          {pad2(activeIndex + 1)}
        </span>
      </span>
      <span className="font-mono text-sm leading-none text-bone-dim/40">/</span>
      <span className="font-mono text-sm tabular-nums leading-none text-bone-dim">
        {pad2(SECTION_COUNT)}
      </span>
      <span className="reveal-mask ml-2 border-l hairline pl-2.5">
        <span
          data-indicator-label
          className="block font-mono text-[0.5625rem] uppercase tracking-[0.2em] leading-none text-bone-dim"
        >
          {section.label}
        </span>
      </span>
    </div>
  );
}
