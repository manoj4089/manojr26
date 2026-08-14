export interface Skill {
  id: string;
  label: string;
  category: 'backend' | 'frontend' | 'data' | 'realtime' | 'tooling';
  /** Shown when the card expands via GSAP Flip. */
  blurb: string;
}

export const skills: Skill[] = [
  {
    id: 'java',
    label: 'Java',
    category: 'backend',
    blurb: 'Core language for the backend work — Oracle Certified Java SE 11 Developer.',
  },
  {
    id: 'spring-boot',
    label: 'Spring Boot',
    category: 'backend',
    blurb: 'MVC services, REST API design, and dependency-injected application structure.',
  },
  {
    id: 'hibernate',
    label: 'Hibernate',
    category: 'backend',
    blurb: 'ORM mapping and persistence layers over relational schemas.',
  },
  {
    id: 'node',
    label: 'Node.js',
    category: 'backend',
    blurb: 'Runtime behind Spill’s real-time services and the Biasly analysis pipeline.',
  },
  {
    id: 'express',
    label: 'Express',
    category: 'backend',
    blurb: 'HTTP layer, middleware and routing for the Node services.',
  },

  {
    id: 'react',
    label: 'React',
    category: 'frontend',
    blurb: 'Component architecture and state design across every frontend project here.',
  },
  {
    id: 'nextjs',
    label: 'Next.js',
    category: 'frontend',
    blurb: 'App Router, server components, and the framework behind Biasly and this site.',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    category: 'frontend',
    blurb: 'Default for anything non-trivial — types as the design document.',
  },
  {
    id: 'angular',
    label: 'Angular',
    category: 'frontend',
    blurb: 'Enterprise frontend work, including validation and QA on a national bank’s UI.',
  },

  {
    id: 'mongodb',
    label: 'MongoDB',
    category: 'data',
    blurb: 'Document modelling and queries for Spill’s social and messaging data.',
  },
  {
    id: 'sql',
    label: 'SQL',
    category: 'data',
    blurb: 'Relational schema design, joins and query tuning.',
  },

  {
    id: 'socketio',
    label: 'Socket.io',
    category: 'realtime',
    blurb: 'Real-time chat, presence and events at the core of Spill.',
  },
  {
    id: 'webrtc',
    label: 'WebRTC',
    category: 'realtime',
    blurb: 'Peer-to-peer voice calling, including signalling and connection recovery.',
  },

  {
    id: 'claude-code',
    label: 'Claude Code',
    category: 'tooling',
    blurb: 'Directing AI coding tools through architecture, implementation and review.',
  },
  {
    id: 'gsap',
    label: 'GSAP',
    category: 'tooling',
    blurb: 'ScrollTrigger, SplitText and Flip — the motion system driving this site.',
  },
  {
    id: 'threejs',
    label: 'Three.js',
    category: 'tooling',
    blurb: 'Custom GLSL shaders and DOM-synced WebGL layers.',
  },
];

/** Three marquee rows, split so each can run at its own speed and direction. */
export const marqueeRows: string[][] = [
  ['JAVA', 'SPRING BOOT', 'HIBERNATE', 'SQL', 'REST APIs'],
  ['REACT', 'NEXT.JS', 'TYPESCRIPT', 'ANGULAR', 'GSAP', 'THREE.JS'],
  ['NODE.JS', 'EXPRESS', 'MONGODB', 'SOCKET.IO', 'WEBRTC', 'CLAUDE CODE'],
];
