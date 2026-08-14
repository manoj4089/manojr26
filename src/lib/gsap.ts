'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { Observer } from 'gsap/Observer';
import { useGSAP } from '@gsap/react';

/**
 * The single plugin-registration site for the whole app.
 *
 * Every module imports gsap from here rather than from 'gsap' directly, which
 * guarantees the plugins are registered before first use and that registration
 * happens exactly once. As of GSAP 3.13 all of these ship in the free package —
 * no Club membership, no bonus-files zip.
 *
 * Guarded on `window` because this module is reachable from the server graph
 * even though every consumer is a client component.
 */
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip, Observer);

  gsap.defaults({ ease: 'power3.out', duration: 0.8 });

  /**
   * Without this GSAP fudges delta time after any frame longer than 500ms, which
   * makes Lenis jump on tab-refocus or after a long paint. Lenis needs the real
   * delta.
   */
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.config({
    // Resize is the only event worth a refresh; the mobile URL-bar show/hide
    // fires resize constantly and would otherwise thrash every pin.
    ignoreMobileResize: true,
  });
}

export { gsap, ScrollTrigger, SplitText, Flip, Observer, useGSAP };
