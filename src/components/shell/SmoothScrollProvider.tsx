'use client';

import { useRef } from 'react';
import Lenis from 'lenis';

import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { setLenis } from '@/lib/lenis';
import { useAppStore } from '@/store/useAppStore';

/**
 * Owns the single Lenis instance and welds it to the GSAP ticker.
 *
 * FRAME ORDER — the whole site depends on this running in exactly this sequence
 * once per frame:
 *
 *   gsap.ticker → [1] lenis.raf()  → 'scroll' event → ScrollTrigger.update()
 *                                     (scrubbed tweens write DOM transforms)
 *               → [2] ScrollPublisher (damps velocity, writes scrollData)
 *               → [3] FrameDriver     (three.advance — same frame's numbers)
 *
 * gsap.ticker invokes callbacks in registration order, but mount order does NOT
 * produce the registration order this needs, and relying on it silently
 * inverted steps [1] and [2]. Two reasons, either one sufficient:
 *
 *   - useGSAP runs as a layout effect, and React commits child effects before
 *     parent ones. ScrollPublisher is rendered as a CHILD of this component, so
 *     its ticker callback is always registered first.
 *   - the `ready` gate below returns early until detectQuality() resolves in
 *     AppShell's passive effect, so [1] is not registered until several frames
 *     after the children mounted.
 *
 * Step [1] therefore registers with gsap's `prioritize` flag, which puts it at
 * the head of the list regardless of when it was added. That makes the ordering
 * an enforced property rather than a convention a future refactor can break.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const quality = useAppStore((s) => s.quality);
  const ready = useAppStore((s) => s.ready);
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Wait for detectQuality() to resolve rather than spinning up Lenis
      // against the placeholder default and tearing it down a tick later.
      if (!ready) return;

      // Reduced motion: no Lenis at all. Native scrolling is the correct
      // behaviour here, and ScrollTrigger works against it unchanged.
      if (quality === 'off') {
        ScrollTrigger.refresh();
        return;
      }

      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // iOS momentum-sync consistently feels worse than the native curve.
        syncTouch: false,
        touchMultiplier: 1.6,
        // We drive rAF from gsap.ticker so that everything shares one frame.
        autoRaf: false,
      });

      setLenis(lenis);

      /**
       * This MUST be the Lenis event, not a separate ticker callback. It fires
       * synchronously inside lenis.raf(), so ScrollTrigger reads the scroll
       * position that was just written. Updating from anywhere else leaves
       * pinned elements one frame behind, which is visible as pin jitter — the
       * single most common Lenis + ScrollTrigger bug.
       */
      lenis.on('scroll', ScrollTrigger.update);

      const raf = (time: number) => lenis.raf(time * 1000);
      // Third argument is `prioritize` — it unshifts onto the ticker's listener
      // list instead of pushing. See the FRAME ORDER note above for why this,
      // and not mount order, is what keeps lenis.raf ahead of ScrollPublisher.
      gsap.ticker.add(raf, false, true);

      // Fonts change metrics, which moves every ScrollTrigger start/end. One
      // refresh once they have settled, rather than guessing with a timeout.
      let cancelled = false;
      document.fonts?.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });

      return () => {
        cancelled = true;
        gsap.ticker.remove(raf);
        lenis.destroy();
        setLenis(null);
      };
    },
    { dependencies: [ready, quality], scope: container },
  );

  return <div ref={container}>{children}</div>;
}
