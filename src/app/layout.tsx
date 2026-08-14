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

const SITE_URL = 'https://manojr.vercel.app';
const description = `${profile.role} · ${profile.roleSecondary}. ${profile.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description,
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name }],
  creator: profile.name,
  keywords: [
    'Manoj R',
    'Software Engineer',
    'Java Full-Stack Developer',
    'Next.js',
    'Spring Boot',
    'AI Application Builder',
    'Chennai',
  ],
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
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

/** Consumed by search engines; kept in sync with src/data/profile.ts. */
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.role,
  description: profile.bio,
  email: `mailto:${profile.contact.email}`,
  telephone: profile.contact.phone,
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
