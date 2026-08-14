'use client';

import { gsap, useGSAP } from '@/lib/gsap';

interface MagneticOptions {
  /** How far the element travels toward the pointer, as a fraction of offset. */
  strength?: number;
  /** Pointer distance (px) beyond the element's bounds that still attracts. */
  padding?: number;
  enabled?: boolean;
}

/**
 * Magnetic pull for `[data-magnetic]` elements inside the given root.
 *
 * One delegated pointermove on the document rather than a listener per button,
 * and quickTo setters cached per element so the hot path allocates nothing.
 * The rect is read on pointerenter, not per move — reading it in the move
 * handler would force layout on every mouse event.
 */
export function useMagnetic(
  root: React.RefObject<HTMLElement | null>,
  { strength = 0.35, padding = 24, enabled = true }: MagneticOptions = {},
) {
  useGSAP(
    () => {
      if (!enabled) return;

      const elements = gsap.utils.toArray<HTMLElement>('[data-magnetic]');
      if (!elements.length) return;

      const setters = new Map<
        HTMLElement,
        { x: (v: number) => void; y: (v: number) => void; rect: DOMRect | null }
      >();

      elements.forEach((el) => {
        setters.set(el, {
          x: gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' }),
          y: gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' }),
          rect: null,
        });
      });

      const onEnter = (e: PointerEvent) => {
        const el = (e.target as Element | null)?.closest?.<HTMLElement>('[data-magnetic]');
        const entry = el && setters.get(el);
        if (entry) entry.rect = el.getBoundingClientRect();
      };

      const onMove = (e: PointerEvent) => {
        const el = (e.target as Element | null)?.closest?.<HTMLElement>('[data-magnetic]');
        if (!el) return;
        const entry = setters.get(el);
        if (!entry?.rect) return;

        const { rect } = entry;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        entry.x((e.clientX - cx) * strength);
        entry.y((e.clientY - cy) * strength);
      };

      const onLeave = (e: PointerEvent) => {
        const el = (e.target as Element | null)?.closest?.<HTMLElement>('[data-magnetic]');
        if (!el) return;
        const entry = setters.get(el);
        if (!entry) return;
        entry.rect = null;
        // Elastic release — the snap back is what sells the magnet.
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
      };

      document.addEventListener('pointerover', onEnter, { passive: true });
      document.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerout', onLeave, { passive: true });

      return () => {
        document.removeEventListener('pointerover', onEnter);
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerout', onLeave);
      };
    },
    { dependencies: [enabled, strength, padding], scope: root },
  );
}
