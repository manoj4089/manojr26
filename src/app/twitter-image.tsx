import { ImageResponse } from 'next/og';

import { profile } from '@/data/profile';

/**
 * Same card as opengraph-image.tsx. Next's file-convention route for OG
 * doesn't get picked up for the twitter:image tag on its own — this file is
 * what actually wires the share-card into Twitter/X specifically.
 */
export const runtime = 'edge';
export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const INK = '#050505';
const BONE = '#f4f1e8';
const BONE_DIM = '#a8a49a';
const ACID = '#c8f31d';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: INK,
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: ACID, display: 'flex' }} />
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: BONE_DIM,
            }}
          >
            {profile.role} &middot; {profile.roleSecondary}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 128,
              fontWeight: 700,
              color: BONE,
              lineHeight: 1,
              letterSpacing: -2,
            }}
          >
            MANOJ R.
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              maxWidth: 920,
              fontSize: 28,
              lineHeight: 1.4,
              color: BONE_DIM,
            }}
          >
            {profile.tagline}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `1px solid rgba(244,241,232,0.16)`,
            paddingTop: 28,
          }}
        >
          <div style={{ display: 'flex', fontSize: 22, letterSpacing: 4, color: BONE }}>
            {profile.siteUrl.replace('https://', '').toUpperCase()}
          </div>
          <div style={{ display: 'flex', fontSize: 22, letterSpacing: 4, color: ACID }}>
            {profile.credential.toUpperCase()}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
