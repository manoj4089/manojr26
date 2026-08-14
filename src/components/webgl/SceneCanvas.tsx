'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';

import { dprForTier, type QualityTier } from '@/lib/quality';

import { FrameDriver } from './FrameDriver';
import { HeroRock } from './HeroRock';

/**
 * Exposure for the ACES curve.
 *
 * Measured directly off the baked texture (2000-sample average over
 * MainRock_BaseColor.png): mean linear reflectance ~13.8%, not the ~3.5%
 * the light rig below was calibrated for — a ~4x mismatch that read as a
 * pale, washed-out rock instead of dark charcoal. It also desaturated the
 * acid-green crack glow to near-white: KHR_materials_emissive_strength on
 * Crack_Emission_Bright is 11, and ACES compresses/desaturates very hot
 * single-channel-dominant colors toward white well before that. Exposure is
 * the one global dial that fixes both at once, since it scales everything
 * entering the ACES curve.
 */
const EXPOSURE = 0.27;

/**
 * The site's single persistent WebGL canvas.
 *
 * Fixed at --z-canvas (0), so it sits under --z-content (10) and the DOM draws
 * over it, and left transparent rather than clearing to a colour — that way the
 * background stays whatever SectionMorph has tweened --bg to, with no second
 * source of truth to keep in sync.
 *
 * Mounted only for tiers that want WebGL, and the gate lives in AppShell rather
 * than here: `next/dynamic` fetches the chunk the moment this renders, so
 * returning null from inside would still have shipped Three to phones.
 */
export function SceneCanvas({ quality }: { quality: QualityTier }) {
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[var(--z-canvas)]">
        <Canvas
          // Nothing renders until FrameDriver advances it off the gsap ticker.
          frameloop="never"
          dpr={dprForTier(quality)}
          // HeroRock owns the projection; see HeroCamera.
          camera={{ manual: true }}
          gl={{
            alpha: true,
            antialias: quality === 'high',
            powerPreference: 'high-performance',
          }}
          onCreated={({ gl }) => {
            gl.toneMapping = ACESFilmicToneMapping;
            gl.toneMappingExposure = EXPOSURE;
          }}
        >
          <Suspense fallback={null}>
            <HeroRock tier={quality} />
          </Suspense>
        </Canvas>
      </div>

      {/*
        Outside the canvas, and last: gsap.ticker fires callbacks in registration
        order, so this must register after ScrollPublisher's. Mount order in
        AppShell is what guarantees that.
      */}
      <FrameDriver />
    </>
  );
}
