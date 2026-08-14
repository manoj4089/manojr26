'use client';

import { ScrollTrigger, useGSAP } from '@/lib/gsap';
import { SECTIONS, type SectionId } from '@/lib/constants';
import { scrollData } from '@/lib/scrollData';
import { useAppStore } from '@/store/useAppStore';

const TRACKED = [...SECTIONS.map((s) => s.id), 'statement'] as const;

/**
 * The single source of "which section am I in".
 *
 * One ScrollTrigger per section writes its progress into scrollData (per frame,
 * no renders) and pushes the active id into the store on enter (a handful of
 * renders per traversal). SideNav, SectionIndicator and the GL layer all read
 * from those two places rather than each creating their own trigger — six
 * triggers instead of twenty, and they can never disagree about the active
 * section.
 *
 * Renders nothing.
 */
export function SectionObserver() {
  const setActiveSection = useAppStore((s) => s.setActiveSection);

  useGSAP(() => {
    TRACKED.forEach((id) => {
      const el = document.querySelector<HTMLElement>(`[data-section="${id}"]`);
      if (!el) return;

      const navIndex = SECTIONS.findIndex((s) => s.id === id);

      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        // Keep the recorded progress in sync when a refresh changes the bounds.
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          scrollData.sections[id] = self.progress;
        },
      });

      // Separate trigger for "active": a section counts as active once it owns
      // the middle of the viewport, which is not the same window as the
      // progress trigger above.
      ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          // `statement` is an unnumbered transition band — it gets progress
          // tracking but must not steal the nav highlight from WORK.
          if (self.isActive && navIndex >= 0) {
            setActiveSection(id as SectionId, navIndex);
          }
        },
      });
    });
  }, []);

  return null;
}
