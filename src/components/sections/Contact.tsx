import { profile } from '@/data/profile';
import { SECTIONS } from '@/lib/constants';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ActionLink } from '@/components/ui/ActionLink';
import { LiveClock } from '@/components/ui/LiveClock';
import { Arrow } from '@/components/ui/Arrow';

const section = SECTIONS[5];

/** 06 CONTACT — full-viewport CTA plus the site footer. */
export function Contact() {
  return (
    <section
      id="contact"
      data-section="contact"
      className="relative flex min-h-svh flex-col justify-between overflow-hidden pt-24 lg:pt-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-30%] left-1/2 h-[46rem] w-[86rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(200,243,29,0.13),transparent_62%),radial-gradient(ellipse_at_35%_60%,rgba(107,76,255,0.14),transparent_60%)] blur-3xl"
      />

      <div className="edge-x relative lg:pl-[7.5rem]">
        <SectionLabel num={section.num}>Contact</SectionLabel>

        <h2
          data-contact-heading
          className="display display-tight mt-10 text-[clamp(2.75rem,10vw,9rem)]"
        >
          {profile.cta.heading.map((line, i) => (
            <span key={line} className="reveal-mask">
              <span className={`block ${i === 1 ? 'text-acid' : ''}`}>{line}</span>
            </span>
          ))}
        </h2>

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <ActionLink
              href={`mailto:${profile.contact.email}`}
              variant="solid"
              dir="ne"
              magnetic
              className="!px-8 !py-5 !text-xs"
            >
              {profile.cta.contact}
            </ActionLink>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-bone-dim">
              Open to engineering roles and product builds. The fastest way to reach me is email.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-8 lg:col-span-7 lg:grid-cols-3">
            <div>
              <dt className="mono-label">Email</dt>
              <dd className="mt-2.5">
                <a
                  href={`mailto:${profile.contact.email}`}
                  data-cursor="link"
                  className="break-all text-sm text-bone underline-offset-4 transition-colors hover:text-acid hover:underline"
                >
                  {profile.contact.email}
                </a>
              </dd>
            </div>

            <div>
              <dt className="mono-label">Phone</dt>
              <dd className="mt-2.5">
                <a
                  href={profile.contact.phoneHref}
                  data-cursor="link"
                  className="text-sm text-bone underline-offset-4 transition-colors hover:text-acid hover:underline"
                >
                  {profile.contact.phone}
                </a>
              </dd>
            </div>

            <div>
              <dt className="mono-label">Location</dt>
              <dd className="mt-2.5 text-sm text-bone">
                {profile.location.city}, {profile.location.country}
                <br />
                <LiveClock className="text-xs text-bone-dim" />
              </dd>
            </div>

            <div className="col-span-2 lg:col-span-3">
              <dt className="mono-label">Elsewhere</dt>
              <dd className="mt-3 flex flex-wrap gap-3">
                {profile.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="link"
                    data-social
                    className="group inline-flex items-center gap-2.5 border hairline px-4 py-2.5 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-bone-dim transition-colors duration-300 hover:border-acid hover:text-acid"
                  >
                    {social.label}
                    <Arrow
                      dir="ne"
                      className="size-2.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <footer className="edge-x relative mt-20 border-t hairline py-7 lg:pl-[7.5rem]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="mono-label">
            &copy; {new Date().getFullYear()} {profile.name} — All rights reserved
          </p>
          <a
            href="#home"
            data-back-to-top
            data-cursor="link"
            className="group inline-flex items-center gap-2.5 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-bone-dim transition-colors hover:text-acid"
          >
            Back to top
            <Arrow
              dir="n"
              className="size-3 transition-transform duration-300 ease-[var(--ease-expo)] group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </footer>
    </section>
  );
}
