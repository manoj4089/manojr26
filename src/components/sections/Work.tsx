import { projects, PROJECT_COUNT } from '@/data/projects';
import { SECTIONS } from '@/lib/constants';
import { SectionLabel } from '@/components/ui/SectionLabel';

import { WorkCard } from './WorkCard';

const section = SECTIONS[2];

/**
 * 03 WORK.
 *
 * The vertical stack is the baseline — every project is reachable with JS
 * disabled, on mobile, and under prefers-reduced-motion. Phase 5 stamps
 * `data-horizontal="true"` on the viewport once the desktop pin is live, which
 * is the only thing that switches it to the clipped horizontal track (see the
 * WORK block in globals.css). Getting this the other way round would make two
 * of the four projects unreachable without JS.
 */
export function Work() {
  return (
    <section id="work" data-section="work" className="relative py-24 lg:py-32">
      <div className="edge-x lg:pl-[7.5rem]">
        <div className="flex items-end justify-between gap-6">
          <SectionLabel num={section.num}>Selected work</SectionLabel>
          <p className="mono-label shrink-0" data-work-counter>
            <span data-work-counter-current>01</span>
            <span className="mx-1 opacity-40">/</span>
            <span>{String(PROJECT_COUNT).padStart(2, '0')}</span>
          </p>
        </div>
      </div>

      <div data-work-viewport className="relative mt-12 lg:mt-16">
        <div data-work-track className="edge-x flex flex-col gap-20 lg:gap-28 lg:pl-[7.5rem]">
          {projects.map((project, i) => (
            <WorkCard key={project.id} project={project} total={PROJECT_COUNT} priority={i === 0} />
          ))}
        </div>
      </div>

      {/* Only meaningful once the horizontal track is live. */}
      <p data-work-hint className="edge-x mono-label mt-12 hidden lg:pl-[7.5rem]">
        Scroll or drag to advance
      </p>
    </section>
  );
}
