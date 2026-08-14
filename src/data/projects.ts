import type { StaticImageData } from 'next/image';

import biaslyHome from '@/assets/work/biasly-home.webp';
import spillLanding from '@/assets/work/spill-landing.webp';
import portfolioV2 from '@/assets/work/portfolio-v2.webp';
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
      role: 'Solo — architecture, backend, frontend, deployment',
      body: [
        'Biasly reads a news article and returns a structured read on how it is telling the story: where it sits politically, how it frames its subjects, and what sentiment it carries. The goal was never to label an outlet good or bad — it was to make the mechanics of framing visible enough that a reader can judge for themselves.',
        'The whole system was designed and built solo, directing AI coding tools through architecture, data modelling, implementation, and release. That workflow is the point of the project as much as the product is: scoping the spec tightly enough that an AI pair can execute against it, then reviewing and hardening every layer that comes back.',
      ],
      highlights: [
        'Bias, framing and sentiment analysis across multiple major news sources',
        'End-to-end solo build — architecture through production deployment',
        'AI-directed engineering workflow: scope → direct → validate → ship',
      ],
    },
    stack: ['Next.js', 'TypeScript', 'Node.js', 'NLP', 'Claude Code'],
    image: biaslyHome,
    // TODO(user): add liveUrl / repoUrl once available — v1 had no links for this project.
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
    // TODO(user): add liveUrl / repoUrl once available.
  },
  {
    id: 'portfolio-v2',
    index: '03',
    title: 'PORTFOLIO',
    subtitle: 'V2 — This Site',
    year: '2026',
    blurb:
      'A scroll-driven portfolio where the animation is the product: one WebGL canvas, one frame loop, and GSAP driving every transition.',
    caseStudy: {
      role: 'Solo — design direction, engineering, motion',
      body: [
        'This site is built as a single scroll experience rather than a stack of sections. Lenis drives inertia scrolling, GSAP ScrollTrigger drives every reveal and pin, and a single persistent Three.js canvas sits behind the DOM rendering off the same frame loop — so the WebGL never lags a frame behind the layout it is tracking.',
        'The architectural constraint that shaped everything: per-frame values never touch React state. Scroll position, velocity and section progress live in a mutable singleton that shaders and GSAP setters read directly, while React only handles state a human could count. That split is the difference between 60fps and 25.',
      ],
      highlights: [
        'One persistent WebGL canvas driven off the GSAP ticker — zero frame lag',
        'Custom GLSL: noise-displaced blob, liquid metal, image distortion',
        'Zero React re-renders during scroll',
      ],
    },
    stack: ['Next.js', 'TypeScript', 'GSAP', 'Three.js', 'Lenis', 'Tailwind'],
    image: portfolioV2,
    // TODO(user): swap portfolio-v2.webp for a real screenshot of the finished site (Phase 8).
  },
  {
    id: 'kg-goat-farm',
    index: '04',
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
    repoUrl: 'https://github.com/manoj4089/kg-project',
    // TODO(user): add liveUrl once the site is deployed.
  },
];

export const PROJECT_COUNT = projects.length;
