import type Lenis from 'lenis';

/**
 * Module-level accessor for the single Lenis instance.
 *
 * Anything that needs to scroll the page (nav clicks, back-to-top) or lock it
 * (the case-study overlay) goes through here rather than through React context,
 * so non-component code — GSAP callbacks, event handlers, the overlay's history
 * listener — can reach it without prop drilling.
 */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = () => instance;

interface ScrollToOptions {
  offset?: number;
  duration?: number;
  immediate?: boolean;
}

/**
 * Scrolls to a section by id. Falls back to native scrolling when Lenis is not
 * running — which is the case before hydration and under reduced motion.
 */
export function scrollToSection(id: string, opts: ScrollToOptions = {}) {
  const target = document.getElementById(id);
  if (!target) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, {
      offset: opts.offset ?? 0,
      duration: opts.duration ?? 1.4,
      immediate: opts.immediate,
    });
    return;
  }

  target.scrollIntoView({ behavior: opts.immediate ? 'auto' : 'smooth' });
}

export function scrollToTop(duration = 1.8) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0, { duration });
    return;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Locks/unlocks page scroll for the case-study overlay.
 *
 * Uses lenis.stop() rather than `body { overflow: hidden }` or `position: fixed`.
 * Both of those change layout, which teleports the page to a different scroll
 * position on open and again on close.
 */
export function lockScroll(locked: boolean) {
  const lenis = getLenis();
  if (!lenis) {
    // No Lenis (reduced motion / pre-hydration) — overflow is the only lever,
    // and without smooth scroll the layout shift it causes is not visible.
    document.documentElement.style.overflow = locked ? 'hidden' : '';
    return;
  }
  if (locked) lenis.stop();
  else lenis.start();
}
