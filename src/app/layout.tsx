import type { Metadata, Viewport } from 'next';
import { Archivo, Geist, Geist_Mono } from 'next/font/google';

import { profile } from '@/data/profile';
import './globals.css';

/**
 * Archivo is requested as a variable font with the width axis exposed.
 * Passing `weight` alongside `axes` would force a static instance and kill the
 * axis, which is what the scroll-velocity type morph depends on.
 */
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

const SITE_URL = profile.siteUrl;
const description = `${profile.role} · ${profile.roleSecondary}. ${profile.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description,
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  keywords: [
    'Manoj R',
    'Manoj R software engineer',
    'Software Engineer',
    'Java Full-Stack Developer',
    'Next.js Developer',
    'Spring Boot Developer',
    'AI Application Builder',
    'Claude Code developer',
    'Chennai software engineer',
    'India remote developer',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: `${profile.name} — Portfolio`,
    title: `${profile.name} — ${profile.role}`,
    description,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} — ${profile.role}`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

/**
 * Consumed by search engines; kept in sync with src/data/profile.ts.
 *
 * Deliberately carries no `telephone`. The number is still published — it is a
 * `tel:` link in the Contact section — but putting it here too hands scrapers a
 * parsed, labelled field rather than one anchor they have to find, which is a
 * meaningful difference in spam exposure for no SEO gain.
 */
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.role,
  description: profile.bio,
  email: `mailto:${profile.contact.email}`,
  url: SITE_URL,
  address: {
    '@type': 'PostalAddress',
    addressLocality: profile.location.city,
    addressCountry: profile.location.country,
  },
  sameAs: profile.socials.filter((s) => !('needsInput' in s && s.needsInput)).map((s) => s.href),
  knowsAbout: [
    'Java',
    'Spring Boot',
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'MongoDB',
    'WebRTC',
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        {children}
        <script
          type="application/ld+json"
          // Static object built at module scope — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
