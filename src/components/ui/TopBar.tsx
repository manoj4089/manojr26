import { SECTIONS } from '@/lib/constants';
import { profile } from '@/data/profile';

import { ActionLink } from './ActionLink';

/** Sections shown in the horizontal top nav — HOME lives in the wordmark instead. */
const TOP_LINKS = SECTIONS.filter((s) => s.id !== 'home');

export function TopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-[var(--z-nav)] border-b hairline bg-[var(--bg)]/70 backdrop-blur-md">
      <div className="edge-x flex h-16 items-center justify-between gap-6 lg:h-[4.5rem] lg:pl-[7.5rem]">
        <a
          href="#home"
          data-cursor="link"
          className="display text-xl leading-none tracking-tight text-bone transition-colors duration-300 hover:text-acid"
          aria-label={`${profile.name} — back to top`}
        >
          MANOJ<span className="text-acid">R</span>
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7 lg:gap-9">
            {TOP_LINKS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  data-cursor="link"
                  className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-bone-dim transition-colors duration-300 hover:text-bone"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ActionLink
          href="#contact"
          variant="outline"
          dir="ne"
          className="!px-5 !py-2.5 rounded-full"
        >
          {profile.cta.contact}
        </ActionLink>
      </div>
    </header>
  );
}
