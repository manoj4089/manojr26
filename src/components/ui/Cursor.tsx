'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { gsap, useGSAP } from '@/lib/gsap';
import { scrollData } from '@/lib/scrollData';
import { useAppStore, type CursorMode } from '@/store/useAppStore';

/** Ring size and label per mode. */
const MODE = {
  default: { size: 12, label: '', opacity: 1 },
  link: { size: 42, label: '', opacity: 1 },
  view: { size: 82, label: 'VIEW', opacity: 1 },
  drag: { size: 82, label: 'DRAG', opacity: 1 },
  hidden: { size: 0, label: '', opacity: 0 },
} as const satisfies Record<CursorMode, { size: number; label: string; opacity: number }>;

/**
 * Custom cursor. Portalled to the end of <body> so it escapes the grain layer's
 * mix-blend-mode stacking context — inside the main tree it would be composited
 * underneath the grain and effectively invisible.
 *
 * Position is driven by gsap.quickTo off the shared ticker (never React state),
 * so moving the mouse causes zero renders. The only renders come from mode
 * changes, which a human can count.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  // The portal target only exists on the client. Rendering null on the server
  // and on the first client pass keeps the two trees identical, which a bare
  // `typeof document` check would not.
  const [mounted, setMounted] = useState(false);
  const cursorMode = useAppStore((s) => s.cursorMode);
  const setCursorMode = useAppStore((s) => s.setCursorMode);
  const quality = useAppStore((s) => s.quality);

  // Coarse pointers have no cursor to replace.
  const enabled = quality !== 'low' && quality !== 'off';

  useEffect(() => setMounted(true), []);

  useGSAP(
    () => {
      if (!enabled || !ring.current) return;

      document.body.dataset.customCursor = 'true';

      const xTo = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3.out' });
      const yTo = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3.out' });

      // Read the pointer that ScrollPublisher already tracks rather than adding
      // a second pointermove listener.
      const tick = () => {
        xTo(scrollData.pointer.x);
        yTo(scrollData.pointer.y);
      };
      gsap.ticker.add(tick);

      /**
       * ONE delegated listener for the whole document. Every interactive element
       * declares `data-cursor="view|link|drag"`; closest() walks up from the
       * event target, so elements added later (the case-study overlay) work with
       * no extra wiring.
       */
      const onOver = (e: PointerEvent) => {
        const el = (e.target as Element | null)?.closest?.('[data-cursor]');
        const mode = (el?.getAttribute('data-cursor') as CursorMode | undefined) ?? 'default';
        setCursorMode(mode);
      };
      const onLeave = () => setCursorMode('hidden');
      const onEnter = () => setCursorMode('default');

      document.addEventListener('pointerover', onOver, { passive: true });
      document.addEventListener('pointerleave', onLeave);
      document.addEventListener('pointerenter', onEnter);

      return () => {
        gsap.ticker.remove(tick);
        document.removeEventListener('pointerover', onOver);
        document.removeEventListener('pointerleave', onLeave);
        document.removeEventListener('pointerenter', onEnter);
        delete document.body.dataset.customCursor;
      };
    },
    { dependencies: [enabled] },
  );

  // Animate the ring to the new mode. revertOnUpdate is deliberately off — each
  // mode change should tween from wherever the previous one got to.
  useGSAP(
    () => {
      if (!enabled || !ring.current) return;
      const spec = MODE[cursorMode];

      gsap.to(ring.current, {
        width: spec.size,
        height: spec.size,
        opacity: spec.opacity,
        duration: 0.4,
        ease: 'power3.out',
      });

      if (label.current) {
        gsap.to(label.current, {
          opacity: spec.label ? 1 : 0,
          duration: 0.25,
          ease: 'power2.out',
        });
      }
    },
    { dependencies: [cursorMode, enabled] },
  );

  if (!mounted || !enabled) return null;

  return createPortal(
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[var(--z-cursor)]"
      style={{ mixBlendMode: 'difference' }}
    >
      <div
        ref={ring}
        className="flex size-3 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-bone bg-transparent will-change-transform"
      >
        <span
          ref={label}
          className="select-none font-mono text-[0.5rem] uppercase tracking-[0.18em] text-bone opacity-0"
        >
          {MODE[cursorMode].label}
        </span>
      </div>
    </div>,
    document.body,
  );
}
