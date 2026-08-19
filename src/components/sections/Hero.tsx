import Image from 'next/image';

import { profile } from '@/data/profile';
import { skills } from '@/data/skills';
import heroPortrait from '@/assets/hero-portrait.webp';
import { ActionLink } from '@/components/ui/ActionLink';
import { HeroMotion } from '@/components/motion/HeroMotion';

const LINES = [...profile.heroLines, ...profile.heroLinesAlt];

/** Drop the certification row here — it's already surfaced via profile.credential in About. */
const heroStats = profile.stats.filter((stat) => stat.label !== 'Oracle certified');

/** Core stack for the hero teaser, pulled from the same list Skills renders below. */
const FOCUS_SKILL_IDS = ['java', 'react', 'nextjs', 'typescript', 'gsap'];
const focusSkills = skills.filter((skill) => FOCUS_SKILL_IDS.includes(skill.id));

/** The role line, stat rows and skill leaders — shared between the desktop overlay and the mobile stack. */
function HeroStats() {
  return (
    <>
      <p className="mono-label">
        {profile.roleSecondary} &amp; {profile.role}
      </p>
      <span className="mt-3 block h-px w-12 bg-acid" aria-hidden />

      <dl className="mt-6 space-y-3.5 border-t hairline pt-5">
        {heroStats.map((stat) => (
          <div key={stat.label} className="flex items-baseline justify-between gap-4">
            <dt className="mono-label">{stat.label}</dt>
            <dd className="display text-lg text-acid">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 border-t hairline pt-5">
        <p className="mono-label mb-3">Focused on</p>
        <ul className="space-y-2.5">
          {focusSkills.map((skill) => (
            <li
              key={skill.id}
              className="flex items-center gap-3 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-bone-dim"
            >
              <span className="shrink-0">{skill.label}</span>
              <span aria-hidden className="h-px flex-1 border-t border-dashed hairline" />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/**
 * 01 HOME.
 *
 * Each line sits in its own mask so the intro can slide it out from behind a
 * clean edge, and carries `data-hero-line` so the compression timeline can move
 * lines at different rates. Everything that should fall away ahead of the type
 * is tagged `data-hero-fade`.
 *
 * The portrait and stats panel are `absolute` on desktop rather than stacked in
 * flow — HeroMotion pins this section the instant it reaches the top of the
 * viewport (`start: 'top top'`), so anything taller than one screen inside it
 * would sit below the fold for the entire pin and never become reachable by
 * scrolling. Mobile has no pin (see HeroMotion's `mm.add` branch), so there the
 * same content is free to sit in normal flow instead.
 */
export function Hero() {
  return (
    <HeroMotion>
      <section
        id="home"
        data-section="home"
        className="relative flex min-h-svh flex-col justify-end overflow-hidden pb-10 pt-28 lg:pb-14 lg:pt-32"
      >
        {/*
          Desktop only, and full-bleed rather than a right-hand column — the plate
          is a landscape frame composed for exactly this, subject on the right and
          empty near-black on the left for type. Absolute, so it adds no height to
          the section HeroMotion pins.

          The inner box carries the PLATE'S OWN aspect rather than stretching to
          the section, which is what makes the subject safe at every window size.
          Stretched edge to edge, `object-cover` has to discard whatever the
          section's aspect does not match — two thirds of the width in the portrait
          column this started as, and still enough to slice his face off at 1024×760
          — and no single `object-position` survives the whole desktop range. Height
          is pinned and width derives from the ratio, so nothing is ever cropped;
          the surplus simply overhangs to the left, where the plate is already black
          and the section's own `overflow-hidden` clips it.
        */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 hidden lg:block">
          <div className="absolute inset-y-0 right-0 aspect-[2530/1536]">
            {/*
              The `(max-width: 1023px) 1px` arm is not cosmetic. Below lg this box
              is `display: none`, and a hidden element gives the browser no layout
              to resolve `sizes` against, so it falls back to the LARGEST candidate
              — with `priority` on top, a phone was eagerly downloading the 3840px
              variant of an image it never shows. Declaring a 1px intent there
              drops it to the smallest.
            */}
            <Image
              src={heroPortrait}
              alt=""
              fill
              priority
              sizes="(max-width: 1023px) 1px, 100vw"
              placeholder="blur"
            />
          </div>
          {/*
            The plate's own left third is already near-black; this only deepens it
            enough to guarantee contrast for the display type, and stops well
            before the subject so his rim light is untouched.
          */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-ink)_0%,rgba(5,5,5,0.88)_26%,rgba(5,5,5,0.45)_46%,transparent_66%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
          {/*
            Scrim for the stats column. The 90deg gradient above is fully
            transparent past 66%, so the top-right — measured at x 1126–1382,
            y 186–544 on a 1440×900 window — is bare plate, and that is exactly
            where the rim-light streaks blow out. Bare text-shadow was never
            going to win against them.

            A radial falloff rather than a box, so it reads as vignette on the
            photograph rather than a panel bolted over it. That keeps the intent
            of the note below — the plate stays visible between the glyphs —
            while actually delivering contrast.

            The radii are explicit (22rem × 17rem) and the element is full
            bleed, which matters: sizing the ELEMENT to the scrim instead leaves
            the gradient still ~14% opaque where the box ends, and that step
            renders as a hard vertical seam straight down the rim-light streaks.
            Letting the gradient reach transparent on its own terms, well inside
            a box that never clips it, is what removes the edge.
          */}
          <div className="absolute inset-0 bg-[radial-gradient(22rem_17rem_at_87%_40%,rgba(5,5,5,0.95)_0%,rgba(5,5,5,0.86)_35%,rgba(5,5,5,0.5)_62%,transparent_100%)]" />
        </div>

        <div className="edge-x relative z-10 lg:pl-[7.5rem]">
          <p data-hero-fade className="mono-label mb-6 lg:mb-8">
            Hey, I&rsquo;m {profile.name}
          </p>

          <h1
            data-hero-heading
            className="display display-tight max-w-[14ch] origin-left text-[clamp(2.75rem,9vw,8rem)] will-change-transform"
          >
            {LINES.map((line, i) => (
              <span key={line} className="reveal-mask">
                <span data-hero-line={i} className={`block ${i === 3 ? 'text-acid' : ''}`}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <div className="mt-9 flex flex-col gap-9 lg:mt-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-md">
              <p data-hero-fade className="text-[0.9375rem] leading-relaxed text-bone">
                <span className="text-acid">{profile.role}</span> &middot; {profile.roleSecondary}
              </p>
              <p data-hero-fade className="mt-3 text-sm leading-relaxed text-bone-dim">
                {profile.tagline}
              </p>

              <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-3">
                <ActionLink href="#work" variant="solid" dir="e" magnetic>
                  {profile.cta.primary}
                </ActionLink>
                <ActionLink href="#about" variant="bare" dir="e">
                  Scroll to discover
                </ActionLink>
              </div>
            </div>

            <p data-hero-fade className="mono-label shrink-0 lg:text-right">
              Based in {profile.location.city}, {profile.location.country}
            </p>
          </div>

          {/*
            Desktop — overlaid on the photo, top-right. Absolute: adds no height to
            the pinned section.

            Bare type, no panel: a scrim behind it would hide the very photograph
            it sits on. Legibility comes from a text-shadow instead, which darkens
            only the pixels immediately under each glyph and leaves the plate
            visible everywhere between them. Inset from the edge by the same clamp
            `edge-x` uses, so it lines up with the page gutter now that there is no
            card bleeding to the edge.
          */}
          <div
            data-hero-fade
            className="pointer-events-none absolute right-[clamp(1.25rem,4vw,4rem)] top-0 hidden w-64 [text-shadow:0_1px_2px_#050505,0_2px_18px_#050505d9] lg:block"
          >
            <HeroStats />
          </div>

          {/* Mobile/tablet — no pin below lg, so this is free to sit in normal flow. */}
          <div data-hero-fade className="mt-12 lg:hidden">
            <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden border hairline bg-ink-2">
              {/*
                4:3, not the portrait box this started as. A 4:5 window over this
                plate keeps under half its width — not enough to hold a subject
                spanning ~45–94% of the frame, so some part of him was cut wherever
                it was anchored. 4:3 keeps ~81%, which fits him whole, and anchoring
                right opens that window at 19–100%: the plate's empty left is what
                falls away rather than any part of him.
              */}
              <Image
                src={heroPortrait}
                alt={`${profile.name} — portrait`}
                fill
                sizes="(min-width: 1024px) 1px, 92vw"
                placeholder="blur"
                className="object-cover object-right"
              />
              <span className="absolute left-4 top-4 size-4 border-l border-t hairline" aria-hidden />
              <span className="absolute right-4 top-4 size-4 border-r border-t hairline" aria-hidden />
              <span className="absolute bottom-4 left-4 size-4 border-b border-l hairline" aria-hidden />
              <span
                className="absolute bottom-4 right-4 size-4 border-b border-r hairline"
                aria-hidden
              />
            </div>
            <div className="mt-8">
              <HeroStats />
            </div>
          </div>
        </div>
      </section>
    </HeroMotion>
  );
}
