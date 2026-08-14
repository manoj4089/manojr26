import Image from 'next/image';

import type { Project } from '@/data/projects';
import { Arrow } from '@/components/ui/Arrow';

import { WorkVideo } from './WorkVideo';

/** Shared by the still and the clip so the two resolve to the same width. */
const MEDIA_SIZES = '(max-width: 1023px) 92vw, 44vw';

interface WorkCardProps {
  project: Project;
  total: number;
  /** Eager-load the first card — it is the LCP candidate on desktop. */
  priority?: boolean;
}

/**
 * One project panel.
 *
 * The image holder carries `data-gl-image`, which Phase 7 uses to register the
 * element into the WebGL plane registry. The fixed aspect-ratio wrapper matters
 * for more than layout: without it the image would resize on load and drift every
 * ScrollTrigger start/end on the page.
 */
export function WorkCard({ project, total, priority }: WorkCardProps) {
  const isPlaceholder = project.placeholder === true;

  return (
    <article
      data-work-card={project.id}
      className="flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:gap-14"
    >
      <div className="order-2 flex flex-col justify-center lg:order-1 lg:w-[38%] lg:shrink-0">
        <div className="flex items-baseline gap-4">
          <span className="display text-[clamp(2.5rem,5vw,4rem)] leading-none text-acid">
            {project.index}
          </span>
          <span className="mono-label">
            {project.index} / {String(total).padStart(2, '0')}
          </span>
        </div>

        <h3 className="display mt-5 text-[clamp(2rem,4.4vw,3.5rem)]">{project.title}</h3>
        <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-bone-dim">
          {project.subtitle} &middot; {project.year}
        </p>

        <p className="mt-6 max-w-md text-sm leading-relaxed text-bone-dim">{project.blurb}</p>

        {project.stack.length > 0 && (
          <ul className="mt-7 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="border hairline px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-bone-dim"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          {isPlaceholder ? (
            <span className="inline-flex items-center gap-2.5 border hairline px-5 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-bone-dim">
              <span className="size-1.5 rounded-full bg-acid" aria-hidden />
              In progress
            </span>
          ) : (
            <button
              type="button"
              data-case-study={project.id}
              data-cursor="view"
              className="group inline-flex items-center gap-3 border hairline px-5 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:border-acid hover:text-acid"
            >
              View case study
              <Arrow
                dir="ne"
                className="size-3 transition-transform duration-300 ease-[var(--ease-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-bone-dim underline-offset-4 hover:text-acid hover:underline"
            >
              Live site
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-bone-dim underline-offset-4 hover:text-acid hover:underline"
            >
              Source
            </a>
          )}
        </div>
      </div>

      <div className="order-1 lg:order-2 lg:min-w-0 lg:flex-1">
        {project.image ? (
          <div
            data-gl-image={project.id}
            data-cursor="view"
            className="relative aspect-[16/10] w-full overflow-hidden border hairline bg-ink-2 lg:aspect-[16/11]"
          >
            {project.video ? (
              /*
                Clips are screen recordings, so they arrive at whatever aspect
                the recorded window was — wider than this box, in Spill's case.
                `object-contain` letterboxes rather than cropping: the card box
                stays identical to every other card (the fixed ratio is what
                keeps ScrollTrigger's starts from drifting on load), and the
                bars fall on `bg-ink-2` so they read as a plate rather than a
                mistake. The poster carries the same `object-contain`, so the
                still and the clip land on exactly the same pixels.
              */
              <WorkVideo
                src={project.video}
                poster={project.image}
                alt={`${project.title} — ${project.subtitle}`}
                sizes={MEDIA_SIZES}
                priority={priority}
              />
            ) : (
              <Image
                src={project.image}
                alt={`${project.title} — ${project.subtitle}`}
                fill
                priority={priority}
                sizes={MEDIA_SIZES}
                placeholder="blur"
                className="object-cover"
              />
            )}
          </div>
        ) : (
          /* No image yet — a composed CSS panel rather than an empty box. */
          <div
            aria-hidden
            className="relative aspect-[16/10] w-full overflow-hidden border hairline bg-ink-2 lg:aspect-[16/11]"
          >
            <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent,transparent_11px,rgba(244,241,232,0.04)_11px,rgba(244,241,232,0.04)_22px)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(200,243,29,0.12),transparent_60%)]" />
            <span className="display absolute bottom-6 left-6 text-[clamp(2rem,5vw,3.5rem)] text-bone/10">
              {project.index}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
