'use client';

import { useRef } from 'react';

import { gsap, useGSAP } from '@/lib/gsap';
import { MQ } from '@/lib/constants';

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Travel across the full scroll pass, in viewport-height units.
   * Negative = moves up faster than the page (foreground).
   * Positive = lags behind the page (background).
   */
  speed?: number;
  /** Horizontal drift, in vw. Used by the decorative glow layers. */
  x?: number;
  scale?: number;
}

/**
 * One parallax layer.
 *
 * Depth comes from stacking several of these at different speeds within a
 * section — background slow, image medium, type fast, decoration counter-
 * direction. The transform is scrubbed rather than tweened, so it is always
 * exactly proportional to scroll position and cannot drift out of sync.
 *
 * `will-change` is set only while the layer is in range: leaving it on for every
 * layer permanently would hold a compositor layer per element for the whole page.
 */
export function Parallax({ children, className = '', speed = 0.15, x = 0, scale }: ParallaxProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add({ reduced: MQ.reduced, motion: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
        if (ctx.conditions?.reduced) return;

        gsap.fromTo(
          el,
          { yPercent: 0, xPercent: 0, ...(scale ? { scale: 1 } : {}) },
          {
            yPercent: speed * 100,
            xPercent: x,
            ...(scale ? { scale } : {}),
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              // Recompute travel on resize instead of keeping stale pixel values.
              invalidateOnRefresh: true,
              onToggle: (self) => {
                el.style.willChange = self.isActive ? 'transform' : 'auto';
              },
            },
          },
        );
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
