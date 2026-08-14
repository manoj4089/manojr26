'use client';

import { advance } from '@react-three/fiber';

import { gsap, useGSAP } from '@/lib/gsap';

/**
 * Step [3] of the frame order documented in SmoothScrollProvider.
 *
 * The canvas runs `frameloop="never"`, so nothing renders until this calls
 * advance(). Driving it from gsap.ticker instead of its own rAF is the whole
 * point: by the time this runs, Lenis has written the scroll position,
 * ScrollTrigger has applied every scrubbed transform and ScrollPublisher has
 * damped the velocity — so the GL layer renders the same frame's numbers the DOM
 * is showing rather than the previous frame's.
 *
 * Renders nothing.
 */
export function FrameDriver() {
  useGSAP(() => {
    /**
     * UNITS: in `frameloop="never"` mode R3F derives its delta as
     * `timestamp - clock.elapsedTime`, and elapsedTime is in SECONDS. gsap's
     * ticker time is already seconds, so it is passed through untouched —
     * handing this performance.now() would run every animation clip 1000x fast.
     *
     * The offset matters too: the ticker has usually been running for a second
     * or two by the time the canvas mounts, and R3F's clock starts at 0. Without
     * rebasing, the very first delta is that entire elapsed span and every clip
     * jumps forward on its first frame.
     */
    let origin = -1;

    const tick = (time: number) => {
      if (origin < 0) origin = time;
      advance(time - origin);
    };

    gsap.ticker.add(tick);

    return () => gsap.ticker.remove(tick);
  }, []);

  return null;
}
