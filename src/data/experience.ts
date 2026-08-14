/**
 * NOTE ON SOURCING: the v1 portfolio had no structured experience section — these
 * entries are reconstructed from the prose facts it did state (trained since 2024,
 * promoted trainee → engineer in five months, hands-on with a national bank's
 * frontend validation and QA, Oracle Java SE 11, solo AI product builds in 2025).
 *
 * TODO(user): `org` is intentionally left generic — v1 never named an employer, only
 * "a national bank" as the client. Fill in the real company name(s) and exact month
 * ranges here; nothing else in the codebase needs to change.
 */

export interface ExperienceEntry {
  id: string;
  period: string;
  role: string;
  org: string;
  /** True for the current position — renders the live acid dot. */
  current?: boolean;
  body: string;
  tags: string[];
  /** Set where a fact still needs the user's confirmation. */
  needsInput?: boolean;
}

export const experience: ExperienceEntry[] = [
  {
    id: 'ai-product',
    period: '2025 — Present',
    role: 'Software Engineer · AI Application Builder',
    org: 'TODO — confirm employer',
    current: true,
    needsInput: true,
    body: 'Directing AI coding tools to architect, build and ship complete products solo — from data model and API design through frontend, deployment and iteration. Biasly and Spill both came out of this workflow.',
    tags: ['Next.js', 'Node.js', 'MongoDB', 'Claude Code'],
  },
  {
    id: 'engineer',
    period: '2024',
    role: 'Software Engineer',
    org: 'TODO — confirm employer',
    needsInput: true,
    body: 'Promoted from trainee to engineer within five months. Hands-on with a national bank’s frontend validation and QA — structural UI comparison and UAT/production consistency checks at bank-grade rigor.',
    tags: ['Angular', 'TypeScript', 'QA', 'UAT'],
  },
  {
    id: 'trainee',
    period: '2024',
    role: 'Trainee — Full-Stack Track',
    org: 'TODO — confirm employer',
    needsInput: true,
    body: 'Comprehensive training across Java, Spring Boot, Angular, TypeScript and SQL — the foundation for the engineering role that followed. Certified Oracle Java SE 11 Developer during this period.',
    tags: ['Java', 'Spring Boot', 'Angular', 'SQL'],
  },
];

/** The pull-out card beside the timeline. */
export const experienceHighlight = {
  value: 'Java SE 11',
  label: 'Oracle Certified Developer',
} as const;
