'use client';

import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useAppStore } from '@/store/useAppStore';

/**
 * System 3 — section-to-section morphing.
 *
 * Rather than each section painting its own background, the page has one
 * `--bg` variable on :root that GSAP tweens as section boundaries cross the
 * middle of the viewport. Because it is a real custom property registered with
 * `@property <color>`, the browser interpolates it — so the ground under the
 * whole page shifts continuously instead of cutting.
 *
 * The WebGL layer added in Phase 6 reads the same variable for its clear colour,
 * which is what keeps the DOM and GL grounds identical through a transition.
 * Reading it once per boundary (not per frame) is deliberate: getComputedStyle
 * is a layout read, and doing it every frame would undo the no-thrash work in
 * ScrollPublisher.
 *
 * Renders nothing.
 */

/** Per-section ground colours. Kept subtle — this should register as depth. */
const GROUND: Record<string, string> = {
  home: '#050505',
  about: '#07070c',
  work: '#050505',
  statement: '#06070b',
  skills: '#050505',
  experience: '#070709',
  contact: '#040603',
};

export function SectionMorph() {
  const quality = useAppStore((s) => s.quality);
  const ready = useAppStore((s) => s.ready);

  useGSAP(
    () => {
      // `quality` holds a placeholder default until detectQuality() resolves in
      // AppShell's effect. Building triggers before then would create the whole
      // morph system on a device that turns out to want none of it, and relies
      // on context revert to undo something that should never have run.
      if (!ready || quality === 'off') return;

      Object.entries(GROUND).forEach(([id, color]) => {
        const el = document.querySelector<HTMLElement>(`[data-section="${id}"]`);
        if (!el) return;

        ScrollTrigger.create({
          trigger: el,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => tweenGround(color),
          onEnterBack: () => tweenGround(color),
        });
      });

      function tweenGround(color: string) {
        gsap.to(document.documentElement, {
          '--bg': color,
          duration: 0.9,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    },
    { dependencies: [ready, quality] },
  );

  return null;
}
