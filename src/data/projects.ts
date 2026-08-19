import type { StaticImageData } from 'next/image';

import biaslyHome from '@/assets/work/biasly-home.webp';
import spillLanding from '@/assets/work/spill-landing.webp';
import kgGoatFarm from '@/assets/work/kg-goat-farm.webp';
import spillDemoPoster from '@/assets/work/spill-demo-poster.webp';

export interface Project {
  id: string;
  /** Rendered as the oversized card index — "01".."04". */
  index: string;
  title: string;
  /** Second display line; kept separate so the two can animate independently. */
  subtitle: string;
  year: string;
  /** One-line hook shown on the card. */
  blurb: string;
  /** Long-form copy for the case-study overlay. */
  caseStudy: {
    role: string;
    body: string[];
    highlights: string[];
  };
  stack: string[];
  /** Absent → the card renders the CSS/GL fallback treatment instead of an image. */
  image?: StaticImageData;
  /**
   * Looping demo clip, as a path under /public. When set, the card plays it in
   * place of the still — but `image` is still required and still does the work:
   * it is the poster, the no-JS render, and the reduced-motion render. The clip
   * is an enhancement layered on top, never the only copy of the visual.
   */
  video?: string;
  /** Extra imagery shown inside the case-study overlay. */
  gallery?: StaticImageData[];
  liveUrl?: string;
  repoUrl?: string;
  /** Renders the "In progress" treatment and disables the case-study CTA. */
  placeholder?: boolean;
}

export const projects: Project[] = [
  {
    id: 'biasly',
    index: '01',
    title: 'BIASLY',
    subtitle: 'AI News Analysis',
    year: '2025',
    blurb:
      'A full-stack platform that detects political bias, framing, and sentiment across major news sources — architected and shipped solo with AI coding tools.',
    caseStudy: {
      role: 'Solo — architecture, backend, pipeline engineering, deployment',
      body: [
        'Biasly runs a fully automated pipeline: Oxylabs scrapes configured news sources hourly, candidate links are filtered against a reject list (category pages, podcasts, product pages and more), and surviving articles are validated against strict content gates — 900+ characters or 3+ paragraphs, an image, a published date — before being stored append-only with URL-based deduplication. Pending articles are then picked up by Vercel AI SDK calling OpenAI/Groq models, which return a structured analysis: a sentiment score and label, left/center/right percentages that sum to 100, a derived bias score, a framing label, and a confidence score. Framing is deliberately surfaced as "AI-estimated," never asserted as fact — the model reasons from article text alone, not source reputation.',
        'The parts that made this a real production system rather than a demo: pending-article detection uses a LEFT JOIN against the analysis table instead of checking a null timestamp, so it survives deleted rows and doubles as the mechanism for backfilling pgvector embeddings later without re-running analysis. Oxylabs job and schedule IDs are 64-bit integers that exceed JavaScript’s safe-integer range, so they get pulled out of the raw HTTP response via regex before anything touches JSON.parse. And because deleted-and-recreated source rows would otherwise leave orphaned Oxylabs schedules running — and billing — indefinitely, a sync routine diffs live schedules against the database and deactivates anything no longer present.',
      ],
      highlights: [
        'Five-stage automated pipeline: Oxylabs scraping → validation/dedup → AI analysis → pgvector embeddings → hourly Vercel Cron scheduling',
        'Structured bias output — sentiment score, left/center/right split, framing label, confidence — always presented as AI-estimated, never as fact',
        'Production-grade edge cases handled: 64-bit ID precision loss, orphaned schedule cleanup, append-only storage with URL dedup',
      ],
    },
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Vercel AI SDK', 'Oxylabs', 'pgvector', 'Claude Code'],
    image: biaslyHome,
    liveUrl: 'https://biasly.app',
    repoUrl: 'https://github.com/manoj4089/biasly',
  },
  {
    id: 'spill',
    index: '02',
    title: 'SPILL',
    subtitle: 'Anonymous Social App',
    year: '2025',
    blurb:
      'A social platform built around anonymity — anonymous posting, mood-matching, real-time chat and WebRTC voice calls, shipped to web, iOS and Android.',
    caseStudy: {
      role: 'Full-stack — real-time systems, mobile delivery',
      body: [
        'Spill is a social app with the identity layer deliberately removed. People post anonymously, get matched by mood rather than follower graph, and can drop into real-time text or voice with whoever they match with.',
        'The hard part was the real-time layer: Socket.io for chat and presence, WebRTC for peer-to-peer voice, and enough signalling glue to keep both stable across networks. Shipping the same codebase to web, iOS and Android through Capacitor meant every real-time assumption had to survive a mobile webview and a backgrounded app.',
      ],
      highlights: [
        'Anonymous posting with mood-based matching instead of a follower graph',
        'Real-time chat over Socket.io and peer-to-peer voice over WebRTC',
        'One codebase shipped to web, iOS and Android via Capacitor',
      ],
    },
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'WebRTC', 'Capacitor'],
    // Poster is frame 0 of the clip, so there is no jump when playback starts.
    image: spillDemoPoster,
    video: '/work/spill-demo.mp4',
    gallery: [spillLanding],
    placeholder: true,
  },
  {
    id: 'kg-goat-farm',
    index: '03',
    title: 'KG GOAT FARM',
    subtitle: 'Wholesale Farm Site',
    year: '2026',
    blurb:
      'A zero-build marketing site for a family-run wholesale goat farm in Tamil Nadu — plain HTML, CSS and JS carrying a scroll-pinned cinematic hero and an attribute-driven motion layer.',
    caseStudy: {
      role: 'Solo — design direction, build, motion, asset pipeline',
      body: [
        'KG Goat Farm supplies goats wholesale out of Neyveli, Tamil Nadu, and its buyers are traders, butchers and other farms across South India. The site exists to make the farm legible to that audience — the livestock, the shed process, the delivery reach — and then hand them to a phone call or an enquiry form. Those buyers are almost entirely phone-first, so mobile was the primary target throughout and phone frame rate, not desktop, was the acceptance bar.',
        'It ships with no framework and no build step: plain HTML, CSS and JS served as files, with GSAP/ScrollTrigger and Lenis doing the motion. The interesting constraint was keeping that honest as the motion grew. Every effect is opted into from the markup through a data attribute — parallax, curtain wipes, zoom, pointer tilt, scroll-linked text — so the script reads the page rather than carrying a list of selectors, and a new section animates without anyone touching the JS. The hero is a scroll-pinned video of a goat, chroma-keyed out of its background and composited over the page.',
      ],
      highlights: [
        'Scroll-pinned cinematic hero with a chroma-keyed goat loop composited over the page',
        'Attribute-driven motion layer — a section opts into parallax, curtains or tilt from markup alone',
        'Reproducible media pipeline: ffmpeg and Pillow scripts regenerate every served image and clip',
      ],
    },
    stack: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'Lenis', 'FFmpeg', 'Playwright'],
    image: kgGoatFarm,
    liveUrl: 'https://manoj4089.github.io/kg-project/',
    repoUrl: 'https://github.com/manoj4089/kg-project',
  },
];

export const PROJECT_COUNT = projects.length;
