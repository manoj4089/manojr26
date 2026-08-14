import { experience, experienceHighlight } from '@/data/experience';
import { SECTIONS } from '@/lib/constants';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Reveal } from '@/components/motion/Reveal';

const section = SECTIONS[4];

/** 05 EXPERIENCE — timeline reveal in Phase 4; static and readable here. */
export function Experience() {
  return (
    <section id="experience" data-section="experience" className="relative py-24 lg:py-36">
      <div className="edge-x relative lg:pl-[7.5rem]">
        <SectionLabel num={section.num}>Experience</SectionLabel>

        <div className="mt-12 grid gap-14 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          <Reveal selector="[data-timeline-entry]" stagger={0.14} y={40} className="lg:col-span-9">
            <ol>
              {experience.map((entry) => (
                <li
                  key={entry.id}
                  data-timeline-entry
                  className="relative border-t hairline pb-10 pt-7 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className={`size-1.5 rounded-full ${entry.current ? 'bg-acid' : 'bg-bone-dim/40'}`}
                    />
                    <span className="mono-label">{entry.period}</span>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-12 md:gap-8">
                    <div className="md:col-span-5">
                      <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-bone">
                        {entry.role}
                      </h3>
                      <p className="mt-1.5 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-bone-dim">
                        {entry.org}
                      </p>
                    </div>

                    <div className="md:col-span-7">
                      <p className="max-w-lg text-sm leading-relaxed text-bone-dim">{entry.body}</p>
                      {entry.tags.length > 0 && (
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {entry.tags.map((tag) => (
                            <li
                              key={tag}
                              className="border hairline px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-bone-dim"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <aside className="lg:col-span-3">
            <div className="flex h-full flex-col justify-center gap-3 border hairline bg-ink-2 p-8 text-center">
              <span aria-hidden className="mx-auto block size-6 text-acid">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              </span>
              <p className="display text-[clamp(1.5rem,3vw,2.25rem)] text-bone">
                {experienceHighlight.value}
              </p>
              <p className="mono-label">{experienceHighlight.label}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
