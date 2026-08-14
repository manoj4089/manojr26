import Link from 'next/link';

import { Arrow } from './Arrow';

interface ActionLinkProps {
  href: string;
  children: React.ReactNode;
  /** solid = acid fill (primary), outline = hairline box, bare = text + arrow only. */
  variant?: 'solid' | 'outline' | 'bare';
  dir?: 'ne' | 'e' | 'n';
  className?: string;
  external?: boolean;
  /** Opts the element into the Phase 3 magnetic pull. */
  magnetic?: boolean;
}

const BASE =
  'group inline-flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] transition-colors duration-300';

const VARIANT = {
  solid: 'bg-acid text-ink px-6 py-4 hover:bg-acid-hi',
  outline: 'border hairline px-6 py-4 text-bone hover:border-acid hover:text-acid',
  bare: 'text-bone-dim hover:text-acid',
} as const;

/**
 * Every CTA on the site. `data-cursor` is read by the delegated pointer listener
 * added in Phase 3 — declaring it here means the cursor works everywhere for free.
 */
export function ActionLink({
  href,
  children,
  variant = 'outline',
  dir = 'ne',
  className = '',
  external,
  magnetic,
}: ActionLinkProps) {
  const content = (
    <>
      <span>{children}</span>
      <Arrow
        dir={dir}
        className="size-3 shrink-0 transition-transform duration-300 ease-[var(--ease-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </>
  );

  const classes = `${BASE} ${VARIANT[variant]} ${className}`;
  const hooks = { 'data-cursor': 'link', ...(magnetic ? { 'data-magnetic': '' } : {}) };

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...hooks}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...hooks}>
      {content}
    </Link>
  );
}
