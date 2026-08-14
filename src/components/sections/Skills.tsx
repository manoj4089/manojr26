import { skills, marqueeRows } from '@/data/skills';
import { SECTIONS } from '@/lib/constants';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Marquee } from '@/components/ui/Marquee';

const section = SECTIONS[3];

/**
 * 04 SKILLS — three marquee rows over a grid of skill cards.
 *
 * Phase 8 couples each marquee's speed to scroll velocity and turns the cards
 * into Flip-expanding panels. In Phase 2 the blurb is always in the DOM (inside
 * a <details>-free static block) so the content is reachable without JS.
 */
export function Skills() {
  return (
    <section id="skills" data-section="skills" className="relative py-24 lg:py-36">
      <div className="edge-x lg:pl-[7.5rem]">
        <SectionLabel num={section.num}>Toolbox</SectionLabel>
        <h2 className="display mt-8 max-w-[18ch] text-[clamp(1.75rem,4.6vw,3.5rem)]">
          The stack behind
          <br />
          the <span className="text-acid">work</span>.
        </h2>
      </div>

      <div className="mt-14 flex flex-col gap-3 border-y hairline py-8 lg:mt-20 lg:gap-4 lg:py-10">
        {marqueeRows.map((row, i) => (
          <Marquee
            key={i}
            items={row}
            duration={34 + i * 8}
            reverse={i % 2 === 1}
            className={i === 1 ? 'text-acid' : 'text-bone-dim'}
            itemClassName="display text-[clamp(1.5rem,4.2vw,3.25rem)] leading-none"
          />
        ))}
      </div>

      <div className="edge-x mt-14 lg:mt-20 lg:pl-[7.5rem]">
        <ul className="grid grid-cols-2 gap-px border hairline bg-hairline-soft sm:grid-cols-3 lg:grid-cols-4">
          {skills.map((skill) => (
            <li key={skill.id}>
              <div
                data-skill={skill.id}
                data-cursor="link"
                className="group flex h-full flex-col justify-between gap-6 bg-ink p-5 transition-colors duration-300 hover:bg-ink-2 lg:p-6"
              >
                <h3 className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-bone transition-colors duration-300 group-hover:text-acid">
                  {skill.label}
                </h3>
                <p className="text-xs leading-relaxed text-bone-dim">{skill.blurb}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
