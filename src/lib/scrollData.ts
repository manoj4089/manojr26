import type { SectionId } from './constants';

/**
 * Per-frame scroll state — a plain mutable singleton, deliberately NOT React state.
 *
 * A Zustand set() at 60Hz with ~10 subscribers is ~600 React reconciliations a
 * second, which is how sites like this end up at 25fps. Everything that changes
 * every frame lives here; R3F's useFrame and GSAP quickSetters read the object
 * directly, so there are no subscriptions, no renders, and no allocation.
 *
 * The counterpart is src/store/useAppStore.ts, which holds only discrete state.
 *
 *   Rule: if it changes every frame it belongs here.
 *         If a human could count the changes it belongs in the store.
 *
 * Written by exactly one place — ScrollPublisher — plus each section's own
 * ScrollTrigger.onUpdate for its progress value.
 */
export interface ScrollData {
  /** Current scroll position in px. */
  scroll: number;
  /** Whole-page progress, 0..1. */
  progress: number;
  /** Raw px/frame from Lenis. */
  velocity: number;
  /** Damped and clamped to -1..1. Everything decorative should read this. */
  velocityNorm: number;
  direction: 1 | -1;

  vw: number;
  vh: number;
  dpr: number;

  /** Per-section progress, 0..1, written by each section's ScrollTrigger. */
  sections: Record<SectionId | 'statement', number>;

  /**
   * The exact px x-offset GSAP wrote to the horizontal work track.
   * Phase 7's WebGL planes derive their position from this rather than
   * re-measuring the DOM — reading the number GSAP already wrote is what keeps
   * the planes welded to their images instead of a frame behind them.
   */
  workX: number;

  pointer: {
    /** Viewport px. */
    x: number;
    y: number;
    /** Normalised to -1..1, origin at viewport centre. */
    nx: number;
    ny: number;
  };
}

export const scrollData: ScrollData = {
  scroll: 0,
  progress: 0,
  velocity: 0,
  velocityNorm: 0,
  direction: 1,

  vw: 0,
  vh: 0,
  dpr: 1,

  sections: {
    home: 0,
    about: 0,
    work: 0,
    statement: 0,
    skills: 0,
    experience: 0,
    contact: 0,
  },

  workX: 0,

  pointer: { x: 0, y: 0, nx: 0, ny: 0 },
};
