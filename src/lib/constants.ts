/**
 * Single source of truth for section identity, easing and breakpoints.
 * Anything that needs to know "what are the sections" imports SECTIONS from here —
 * the side nav, the section indicator, the scroll observer and scrollData all agree
 * because they all read this array.
 */

export const SECTIONS = [
  { id: 'home', label: 'HOME', num: '01' },
  { id: 'about', label: 'ABOUT', num: '02' },
  { id: 'work', label: 'WORK', num: '03' },
  { id: 'skills', label: 'SKILLS', num: '04' },
  { id: 'experience', label: 'EXPERIENCE', num: '05' },
  { id: 'contact', label: 'CONTACT', num: '06' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];

export const SECTION_IDS = SECTIONS.map((s) => s.id) as readonly SectionId[];
export const SECTION_COUNT = SECTIONS.length;

/**
 * The statement band lives between WORK and SKILLS but is deliberately not a
 * numbered nav destination — it is a transition, not a place.
 */
export const UNNUMBERED_SECTIONS = ['statement'] as const;

/** Cubic-beziers as GSAP ease strings. Kept here so motion stays consistent. */
export const EASE = {
  /** Primary — long tail, fast attack. The site's signature. */
  expo: 'expo.out',
  /** Text reveals. */
  reveal: 'power3.out',
  /** UI state changes: cursor, nav, counters. */
  ui: 'power2.out',
  /** Magnetic release. */
  elastic: 'elastic.out(1, 0.4)',
} as const;

export const DURATION = {
  reveal: 1.1,
  ui: 0.4,
  overlay: 0.8,
} as const;

/** Matches the gsap.matchMedia queries used in every section. */
export const MQ = {
  desktop: '(min-width: 1024px)',
  mobile: '(max-width: 1023px)',
  reduced: '(prefers-reduced-motion: reduce)',
} as const;

export const BREAKPOINT_DESKTOP = 1024;
