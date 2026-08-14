import { AppShell } from '@/components/shell/AppShell';
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { TopBar } from '@/components/ui/TopBar';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Work } from '@/components/sections/Work';
import { Statement } from '@/components/sections/Statement';
import { Skills } from '@/components/sections/Skills';
import { Experience } from '@/components/sections/Experience';
import { Contact } from '@/components/sections/Contact';

/**
 * The whole site. Single page by design — the case study opens as an in-page
 * overlay (Phase 5) rather than a route, so the scroll narrative is never broken.
 *
 * This stays a server component, and so does every section inside it. AppShell
 * is the only client boundary; passing the sections through it as `children`
 * means they are still server-rendered, which is what keeps the site readable
 * with JS disabled.
 */
export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--z-preloader)] focus:bg-acid focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-ink"
      >
        Skip to content
      </a>

      <GrainOverlay />
      <TopBar />

      <AppShell>
        <main id="main" className="isolate-layer relative z-[var(--z-content)]">
          <Hero />
          <About />
          <Work />
          <Statement />
          <Skills />
          <Experience />
          <Contact />
        </main>
      </AppShell>
    </>
  );
}
