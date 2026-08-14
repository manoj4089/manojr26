import { profile } from '@/data/profile';
import { SECTIONS } from '@/lib/constants';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ActionLink } from '@/components/ui/ActionLink';
import { SplitReveal } from '@/components/ui/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { Parallax } from '@/components/motion/Parallax';

const section = SECTIONS[1];

/** 02 ABOUT — the hero compresses into this heading in Phase 4. */
export function About() {
  return (
    <section id="about" data-section="about" className="relative overflow-hidden py-24 lg:py-36">
      <Parallax
        speed={0.18}
        className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[70rem] -translate-x-1/2"
      >
        <div
          aria-hidden
          className="size-full bg-[radial-gradient(ellipse_at_center,rgba(107,76,255,0.13),transparent_66%)] blur-2xl"
        />
      </Parallax>

      <div className="edge-x relative lg:pl-[7.5rem]">
        <SectionLabel num={section.num}>About me</SectionLabel>

        <div className="mt-10 grid gap-14 lg:mt-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SplitReveal
              as="h2"
              kind="lines"
              className="display max-w-[16ch] text-[clamp(2rem,5.6vw,4.25rem)]"
            >
              I architect, build and ship <span className="text-volt">systems</span> that reason.
            </SplitReveal>

            <SplitReveal
              as="p"
              kind="words"
              blur={false}
              className="mt-9 max-w-xl text-[0.9375rem] leading-relaxed text-bone-dim"
            >
              {profile.bio}
            </SplitReveal>

            <Reveal className="mt-9 flex flex-wrap items-center gap-3" stagger={0.1}>
              <ActionLink href="#experience" dir="e">
                See the timeline
              </ActionLink>
              <span className="mono-label border-l hairline pl-4">{profile.credential}</span>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal selector="[data-stat]" stagger={0.09} y={34}>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-9">
                {profile.stats.map((stat) => (
                  <div key={stat.label} data-stat className="border-t hairline pt-4">
                    <dt className="mono-label order-2 mt-2">{stat.label}</dt>
                    <dd className="display text-[clamp(1.75rem,3.4vw,2.75rem)] text-bone">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal selector="li" stagger={0.08} className="mt-12 border-t hairline pt-8">
              <ol className="space-y-5">
                {profile.method.map((step) => (
                  <li key={step.num} className="flex gap-5">
                    <span className="mono-label !text-acid shrink-0 pt-0.5">{step.num}</span>
                    <div>
                      <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-bone">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-bone-dim">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
