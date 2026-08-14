'use client';

import { useRef } from 'react';

import { gsap, useGSAP } from '@/lib/gsap';
import { MQ } from '@/lib/constants';

/**
 * System 8 — the statement band.
 *
 * The two display lines are scrubbed in opposite directions as the section
 * crosses the viewport: "BUILD WEBSITES." drifts left, "I BUILD EXPERIENCES."
 * drifts right. The support paragraph moves with the right-hand line but less
 * far, so the whole band shears rather than sliding.
 *
 * Travel is expressed in vw so it scales with the viewport instead of leaving a
 * fixed pixel gap that looks generous at 1280 and absurd at 2560.
 */
export function StatementMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile, reduced: MQ.reduced }, (ctx) => {
        const { desktop, reduced } = ctx.conditions!;
        if (reduced) return;

        const left = el.querySelector<HTMLElement>('[data-statement-left]');
        const right = el.querySelector<HTMLElement>('[data-statement-right]');
        const support = el.querySelector<HTMLElement>('[data-statement-support]');

        // Mobile gets a much smaller shear — a big one just causes clipping
        // inside the reveal masks on a narrow screen.
        const travel = desktop ? 9 : 3;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        if (left) tl.fromTo(left, { xPercent: travel }, { xPercent: -travel, ease: 'none' }, 0);
        if (right) tl.fromTo(right, { xPercent: -travel }, { xPercent: travel, ease: 'none' }, 0);
        if (support) {
          tl.fromTo(support, { xPercent: -travel / 2 }, { xPercent: travel / 2, ease: 'none' }, 0);
        }
      });
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
