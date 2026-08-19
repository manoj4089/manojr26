/**
 * Every fact about Manoj lives here. Nothing identity-related is hardcoded in JSX.
 * Sourced from the v1 portfolio (Desktop/Manoj_portfolio/index.html).
 */

export const profile = {
  /** Canonical domain — the single source of truth for metadata, sitemap, robots, JSON-LD and OG images. */
  siteUrl: 'https://manojr.online',

  name: 'Manoj R.',
  /** Split for the hero — each part animates on its own track. */
  nameParts: ['MANOJ', 'R.'],

  role: 'Software Engineer',
  roleSecondary: 'AI Application Builder',

  /** The oversized hero statement. Two lines, deliberately. */
  heroLines: ['BUILT TO', 'REASON.'],
  heroLinesAlt: ['SHIPPED', 'TO SCALE.'],

  tagline:
    'Java full-stack engineer directing AI coding tools to design, build, and ship products end to end — from architecture to production.',

  bio: 'Java full-stack engineer trained since 2024, promoted from trainee to engineer within five months. Hands-on with a national bank’s frontend validation and QA. Now directing AI coding tools to architect, build, and ship an entire intelligent product solo.',

  /** The giant unnumbered statement band between WORK and SKILLS. */
  statement: {
    lead: 'I DON’T JUST',
    left: 'BUILD WEBSITES.',
    right: 'I BUILD EXPERIENCES.',
    support:
      'Blending architecture with execution to create products that reason, scale, and ship.',
  },

  credential: 'Oracle Certified — Java SE 11 Developer',

  location: {
    city: 'Chennai',
    country: 'India',
    timeZone: 'Asia/Kolkata',
    tzLabel: 'IST',
  },

  contact: {
    email: 'manoj27sky@gmail.com',
    phone: '+91 89251 85714',
    phoneHref: 'tel:+918925185714',
  },

  socials: [
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/manoj-r-6391091b7',
      handle: 'manoj-r',
    },
    {
      label: 'GitHub',
      href: 'https://github.com/manoj4089',
      handle: 'manoj4089',
    },
  ],

  /** The About stat row. Deliberately factual, no invented numbers. */
  stats: [
    { value: '2024', label: 'Engineering since' },
    { value: '5 mo', label: 'Trainee → Engineer' },
    { value: 'Java SE 11', label: 'Oracle certified' },
    { value: '1', label: 'AI product shipped solo' },
  ],

  /** How I work — the four-step method from v1. */
  method: [
    {
      num: '01',
      title: 'Scope',
      body: 'Break the spec into architecture, data model, and a build sequence.',
    },
    {
      num: '02',
      title: 'Direct',
      body: 'Pair with AI coding tools to write, review, and refine implementation.',
    },
    {
      num: '03',
      title: 'Validate',
      body: 'Test against real UAT/production-style conditions before it ships.',
    },
    { num: '04', title: 'Ship', body: 'Deploy, monitor, and iterate based on real usage.' },
  ],

  cta: {
    primary: 'EXPLORE MY WORK',
    contact: 'LET’S TALK',
    heading: ['HAVE A PROJECT', 'IN MIND?'],
  },
} as const;

export type Profile = typeof profile;
