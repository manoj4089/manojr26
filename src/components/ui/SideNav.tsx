'use client';

import { useRef } from 'react';

import { SECTIONS } from '@/lib/constants';
import { gsap, useGSAP } from '@/lib/gsap';
import { scrollToSection } from '@/lib/lenis';
import { scrollData } from '@/lib/scrollData';
import { useAppStore } from '@/store/useAppStore';

/**
 * The fixed left rail — 01..06 with a progress line and a travelling dot.
 *
 * Real <a href="#id"> elements, so the nav works with JS disabled and is
 * keyboard-navigable; the click handler only intercepts to hand the scroll to
 * Lenis. The active state is read from the store, which SectionObserver owns —
 * this component creates no ScrollTriggers of its own.
 */
export function SideNav() {
  const container = useRef<HTMLElement>(null);
  const activeSection = useAppStore((s) => s.activeSection);
  const activeIndex = useAppStore((s) => s.activeIndex);

  // Progress line: driven off the ticker, not React, so it never renders.
  useGSAP(
    () => {
      const fill = container.current?.querySelector<HTMLElement>('[data-nav-progress]');
      if (!fill) return;

      const setScale = gsap.quickSetter(fill, 'scaleY') as (v: number) => void;
      const tick = () => setScale(scrollData.progress);
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: container },
  );

  // Dot travel + item highlight. Depends on activeIndex, which changes ~6× per
  // traversal — cheap enough for a React-driven tween.
  useGSAP(
    () => {
      const root = container.current;
      if (!root) return;

      const items = gsap.utils.toArray<HTMLElement>('[data-nav-item]', root);
      const dot = root.querySelector<HTMLElement>('[data-nav-dot]');
      const target = items[activeIndex];
      if (!dot || !target) return;

      items.forEach((item, i) => {
        item.dataset.active = String(i === activeIndex);
      });

      // offsetTop is measured against the nearest POSITIONED ancestor. The <ul>
      // is deliberately left unpositioned so that ancestor is the <nav> — the
      // same box the dot is absolutely positioned against. Giving the <ul>
      // `relative` would silently measure against the list instead and strand
      // the dot at the top of the rail.
      gsap.to(dot, {
        y: target.offsetTop + target.offsetHeight / 2 - 3.5,
        opacity: 1,
        duration: 0.55,
        ease: 'power3.out',
      });

      gsap.to(items, {
        opacity: (i: number) => (i === activeIndex ? 1 : 0.45),
        duration: 0.4,
        ease: 'power2.out',
      });
    },
    { dependencies: [activeIndex], scope: container },
  );

  return (
    <nav
      ref={container}
      aria-label="Section navigation"
      className="fixed left-0 top-0 z-[var(--z-nav)] hidden h-svh w-[7.5rem] shrink-0 flex-col justify-center border-r hairline lg:flex"
    >
      <div
        className="absolute left-8 top-1/2 h-[62%] w-px -translate-y-1/2 bg-hairline"
        aria-hidden
      >
        <div data-nav-progress className="h-full w-full origin-top scale-y-0 bg-acid" />
      </div>

      <ul className="flex flex-col gap-7 pl-[3.25rem]">
        {SECTIONS.map((section) => {
          const isActive = section.id === activeSection;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                data-nav-item={section.id}
                data-cursor="link"
                aria-current={isActive ? 'true' : undefined}
                onClick={(e) => {
                  // Let modified clicks (new tab, etc.) behave natively.
                  if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                  e.preventDefault();
                  scrollToSection(section.id);
                  history.replaceState(null, '', `#${section.id}`);
                }}
                className="group flex items-baseline gap-3 text-bone-dim transition-colors duration-300 hover:text-bone"
              >
                <span
                  className={`font-mono text-xs tracking-tight transition-colors duration-300 ${
                    isActive ? 'text-acid' : ''
                  }`}
                >
                  {section.num}
                </span>
                <span className="font-mono text-[0.5625rem] uppercase tracking-[0.18em] opacity-60 transition-opacity duration-300 group-hover:opacity-100">
                  {section.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <span
        data-nav-dot
        aria-hidden
        className="absolute left-[1.6875rem] top-0 size-[7px] rounded-full bg-acid opacity-0"
      />
    </nav>
  );
}
