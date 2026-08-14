'use client';

import { gsap, useGSAP } from '@/lib/gsap';
import { getLenis } from '@/lib/lenis';
import { scrollData } from '@/lib/scrollData';
import { clamp, damp, round } from '@/lib/math';

/** px/frame at which velocity is considered "full speed". */
const VELOCITY_SCALE = 45;

/**
 * The only per-frame writer of scrollData, and the only place that writes a
 * scroll-derived CSS variable.
 *
 * Two properties of this design matter:
 *
 * 1. Velocity is damped every frame regardless of scroll events. Lenis stops
 *    emitting 'scroll' once it settles, so an event-driven update would freeze
 *    velocity at its last value and leave the typography permanently skewed.
 *    Damping in the ticker makes "settle on stop" fall out for free.
 *
 * 2. Exactly one style write per frame and zero reads, so there is no layout
 *    thrash. Any purely decorative velocity effect can then be pure CSS:
 *    `transform: skewY(calc(var(--sv) * 4deg))`.
 *
 * Renders nothing.
 */
export function ScrollPublisher() {
  useGSAP(() => {
    const root = document.documentElement;
    const setSv = gsap.quickSetter(root, '--sv') as (v: string) => void;

    const readViewport = () => {
      scrollData.vw = window.innerWidth;
      scrollData.vh = window.innerHeight;
      scrollData.dpr = window.devicePixelRatio || 1;
    };
    readViewport();

    const onPointerMove = (e: PointerEvent) => {
      const p = scrollData.pointer;
      p.x = e.clientX;
      p.y = e.clientY;
      p.nx = (e.clientX / scrollData.vw) * 2 - 1;
      p.ny = -((e.clientY / scrollData.vh) * 2 - 1);
    };

    let lastSv = 0;

    const tick = (_time: number, deltaMs: number) => {
      const dt = Math.min(deltaMs, 50) / 1000;
      const lenis = getLenis();

      if (lenis) {
        scrollData.scroll = lenis.scroll;
        scrollData.progress = lenis.progress || 0;
        scrollData.velocity = lenis.velocity;
      } else {
        // Reduced motion / pre-Lenis: derive velocity from raw scroll delta so
        // downstream consumers still get sane numbers instead of a frozen 0.
        const y = window.scrollY;
        scrollData.velocity = (y - scrollData.scroll) / Math.max(dt * 60, 0.001);
        scrollData.scroll = y;
        const max = document.documentElement.scrollHeight - scrollData.vh;
        scrollData.progress = max > 0 ? y / max : 0;
      }

      if (scrollData.velocity !== 0) {
        scrollData.direction = scrollData.velocity > 0 ? 1 : -1;
      }

      const target = clamp(scrollData.velocity / VELOCITY_SCALE, -1, 1);
      scrollData.velocityNorm = damp(scrollData.velocityNorm, target, 0.12, dt);

      // Skip the write when the value has not meaningfully moved — most frames
      // once the page has settled.
      const sv = round(scrollData.velocityNorm, 3);
      if (sv !== lastSv) {
        setSv(String(sv));
        lastSv = sv;
      }
    };

    gsap.ticker.add(tick);
    window.addEventListener('resize', readViewport);
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', readViewport);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return null;
}
