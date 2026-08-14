'use client';

import { useRef } from 'react';

import { gsap, useGSAP } from '@/lib/gsap';
import { MQ } from '@/lib/constants';

/**
 * System 1 — the hero compression.
 *
 * On load the four display lines rise out of their masks. On scroll, a single
 * pinned scrub timeline drives the whole composition away from the viewer:
 *
 *   - the heading scales down and lifts, so it reads as receding rather than
 *     just sliding off,
 *   - each line moves at its own rate, so the block comes apart slightly
 *     instead of translating as one slab,
 *   - the supporting copy and the decorative glow travel faster than the type,
 *     which is what produces the "compressing into the next section" feel.
 *
 * TWO ORDERING HAZARDS, both handled below:
 *
 * 1. The intro and the compression write the SAME properties. If both exist at
 *    once, the scrub renders its start state every frame and stamps on the
 *    intro. So the compression is only built once the intro has finished.
 *
 * 2. A scrubbed `to` captures its start value lazily, when that target first
 *    renders. With a stagger, targets initialise at different times — the first
 *    one at t=0, while the intro still holds it at opacity 0 — and record that
 *    as their resting state. Scrolling back up then restores the mid-intro
 *    value, leaving the first line permanently invisible. Every tween here is
 *    an explicit `fromTo` so no start value is ever inferred.
 *
 * The pin is desktop-only. On mobile and under reduced motion the hero is a
 * normal static block — a pinned 100svh hero on a phone is a scroll trap.
 */
export function HeroMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile, reduced: MQ.reduced }, (ctx) => {
        const { desktop, reduced } = ctx.conditions!;

        // Reduced motion: the hero is simply already there.
        if (reduced) return;

        const heading = el.querySelector<HTMLElement>('[data-hero-heading]');
        const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]', el);
        const meta = gsap.utils.toArray<HTMLElement>('[data-hero-fade]', el);
        const glow = el.querySelector<HTMLElement>('[data-hero-glow]');

        const buildCompression = () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: 'top top',
              end: '+=110%',
              scrub: 0.6,
              pin: true,
              // Applies the pin a frame early, removing the jump that is
              // otherwise visible with smooth scrolling.
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          if (heading) {
            tl.fromTo(
              heading,
              { scale: 1, yPercent: 0, opacity: 1 },
              { scale: 0.72, yPercent: -14, opacity: 0.25, ease: 'none' },
              0,
            );
          }

          // Per-line drift. Later lines travel further, so the block fans apart.
          lines.forEach((line, i) => {
            tl.fromTo(line, { yPercent: 0 }, { yPercent: -8 - i * 7, ease: 'none' }, 0);
          });

          tl.fromTo(
            meta,
            { y: 0, opacity: 1 },
            { y: -70, opacity: 0, stagger: 0.04, ease: 'none' },
            0,
          );

          if (glow) {
            // Counter-direction and slower — the background should read as a
            // separate plane, not part of the type block.
            tl.fromTo(
              glow,
              { yPercent: 0, scale: 1, opacity: 1 },
              { yPercent: 22, scale: 1.18, opacity: 0.45, ease: 'none' },
              0,
            );
          }
        };

        const intro = gsap.timeline({
          defaults: { ease: 'expo.out' },
          // Desktop hands off to the scroll compression; mobile has no pin, so
          // nothing else needs to run afterwards.
          onComplete: desktop ? buildCompression : undefined,
        });

        intro
          .from(lines, { yPercent: 112, duration: 1.35, stagger: 0.09 })
          .from(meta, { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, '-=0.85');
      });
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
