'use client';

import { useEffect, useRef } from 'react';

import { detectQuality } from '@/lib/quality';
import { useAppStore } from '@/store/useAppStore';
import { useMagnetic } from '@/hooks/useMagnetic';
import { Cursor } from '@/components/ui/Cursor';
import { SectionIndicator } from '@/components/ui/SectionIndicator';
import { SideNav } from '@/components/ui/SideNav';

import { SmoothScrollProvider } from './SmoothScrollProvider';
import { ScrollPublisher } from './ScrollPublisher';
import { SectionObserver } from './SectionObserver';
import { SectionMorph } from './SectionMorph';

/**
 * The single 'use client' boundary for the site.
 *
 * FRAME ORDER: lenis.raf → ScrollTrigger.update must run before ScrollPublisher
 * reads the scroll position. Mount order does NOT achieve that — React commits
 * child layout effects before parent ones, so ScrollPublisher registers its
 * ticker callback first no matter where it sits here. SmoothScrollProvider
 * pins itself to the head of the ticker instead; see the FRAME ORDER note in
 * that file. Nothing about the ordering depends on this component's JSX.
 *
 * `children` are the server-rendered sections, passed through untouched so they
 * stay server components and the site still reads with JS disabled.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const setQuality = useAppStore((s) => s.setQuality);
  const setReady = useAppStore((s) => s.setReady);
  const quality = useAppStore((s) => s.quality);

  // Resolve the device tier once, before anything reads it.
  useEffect(() => {
    setQuality(detectQuality());
    setReady(true);
  }, [setQuality, setReady]);

  useMagnetic(root, { enabled: quality === 'high' || quality === 'medium' });

  return (
    <div ref={root}>
      <SmoothScrollProvider>
        <ScrollPublisher />
        <SectionObserver />
        <SectionMorph />

        <SideNav />
        <SectionIndicator />
        <Cursor />

        {children}
      </SmoothScrollProvider>
    </div>
  );
}
