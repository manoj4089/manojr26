'use client';

import { useRef } from 'react';

import { gsap, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap';
import { MQ } from '@/lib/constants';

type RevealKind = 'lines' | 'words' | 'chars';

/**
 * Deliberately an explicit list rather than React's open `ElementType`.
 * @react-three/fiber merges ~150 three.js elements into React's
 * JSX.IntrinsicElements the moment its types enter the program, and an open
 * `ElementType` then resolves `<Tag>`'s props to the intersection of every one
 * of them, which is `never`. Naming the tags this component actually supports is
 * immune to that, and is tighter typing than it had.
 */
type RevealTag = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span' | 'blockquote' | 'li';

interface SplitRevealProps {
  children: React.ReactNode;
  as?: RevealTag;
  className?: string;
  /** Granularity of the stagger. `chars` is expensive — display type only. */
  kind?: RevealKind;
  /** Seconds between units. */
  stagger?: number;
  delay?: number;
  /** Where the reveal fires, as a ScrollTrigger start string. */
  start?: string;
  /** Adds a blur-in. Costs a filter animation, so it is opt-out on long copy. */
  blur?: boolean;
}

const PRESET: Record<RevealKind, { type: string; stagger: number; y: string; duration: number }> = {
  lines: { type: 'lines', stagger: 0.09, y: '110%', duration: 1.1 },
  words: { type: 'lines,words', stagger: 0.022, y: '110%', duration: 0.9 },
  chars: { type: 'lines,words,chars', stagger: 0.014, y: '110%', duration: 0.8 },
};

/**
 * The text-reveal primitive used by every heading and paragraph on the site.
 *
 * Three details make this robust rather than a demo:
 *
 * - `autoSplit: true` + returning the tween from `onSplit` (GSAP 3.13+) means the
 *   text re-splits and the animation rebuilds when the font finishes loading or
 *   the element reflows. Without it, a variable font swapping in mid-reveal
 *   leaves lines measured against the fallback face.
 * - `mask: 'lines'` gives SplitText its own overflow-hidden wrapper per line, so
 *   the y-translate slides out from behind a clean edge without us hand-rolling
 *   masks in the markup.
 * - Under reduced motion the text is simply present. No split, no ScrollTrigger,
 *   no transform — nothing to get stuck half-revealed.
 */
export function SplitReveal({
  children,
  as = 'p',
  className = '',
  kind = 'lines',
  stagger,
  delay = 0,
  start = 'top 82%',
  blur = true,
}: SplitRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  /**
   * Narrowed for JSX's benefit only. A union of intrinsic tags makes TS
   * intersect their `ref` types into something no single element can satisfy;
   * `as` still reaches the DOM verbatim, and nothing here treats the node as
   * anything more specific than an HTMLElement.
   */
  const Tag = as as 'div';

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      const preset = PRESET[kind];

      mm.add({ motion: `(prefers-reduced-motion: no-preference)`, reduced: MQ.reduced }, (ctx) => {
        if (ctx.conditions?.reduced) return;

        const split = SplitText.create(el, {
          type: preset.type,
          mask: 'lines',
          linesClass: 'split-line',
          autoSplit: true,
          onSplit(self) {
            const targets =
              kind === 'chars' ? self.chars : kind === 'words' ? self.words : self.lines;

            // Returning the tween registers it with the split, so autoSplit
            // reverts and replays it correctly on re-measure.
            return gsap.from(targets, {
              yPercent: 108,
              opacity: 0,
              ...(blur ? { filter: 'blur(8px)' } : {}),
              duration: preset.duration,
              delay,
              stagger: stagger ?? preset.stagger,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start,
                once: true,
              },
            });
          },
        });

        return () => {
          split.revert();
          ScrollTrigger.refresh();
        };
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
