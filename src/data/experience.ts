/** Sourced from Manoj's resume (Resume_Manoj_R.pdf). */

export interface ExperienceEntry {
  id: string;
  period: string;
  role: string;
  org: string;
  /** True for the current position — renders the live acid dot. */
  current?: boolean;
  body: string;
  tags: string[];
}

export const experience: ExperienceEntry[] = [
  {
    id: 'software-engineer',
    period: 'Nov 2024 — Present',
    role: 'Software Engineer',
    org: 'LTM Company',
    current: true,
    body: 'Promoted from Trainee to Software Engineer within five months. Working on full-stack development using Java, Spring Boot, Angular, TypeScript and SQL — applying OOP principles and RESTful API design to build scalable backend services, with Git/GitHub for collaborative version control.',
    tags: ['Java', 'Spring Boot', 'Angular', 'TypeScript', 'SQL'],
  },
  {
    id: 'trainee',
    period: 'Jun 2024 — Nov 2024',
    role: 'Software Developer Trainee',
    org: 'LTM Company',
    body: 'Completed comprehensive training in Java Full-Stack Development. Worked as a Frontend Developer — validated and tested web page structures across UAT and Production environments to ensure consistency and accuracy, and trained in Adobe Analytics, Data Collection and Marketo.',
    tags: ['Java', 'Spring Boot', 'Angular', 'SQL', 'UAT Testing'],
  },
];

/** The pull-out card beside the timeline. */
export const experienceHighlight = {
  value: 'Java SE 11',
  label: 'Oracle Certified Developer',
} as const;
