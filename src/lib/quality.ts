export type QualityTier = 'high' | 'medium' | 'low' | 'off';

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number;
}

/**
 * Resolves the device tier exactly once at boot.
 *
 *   high   — full WebGL: blob, liquid, particles, image distortion
 *   medium — WebGL without the particle field, lower DPR cap
 *   low    — no WebGL at all; Three.js is never imported
 *   off    — reduced motion; no WebGL, no scrubs, no pins
 *
 * The `low` tier is what keeps the mobile bundle free of Three entirely, so this
 * must be checked before the dynamic import, not inside the scene.
 */
export function detectQuality(): QualityTier {
  if (typeof window === 'undefined') return 'low';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off';

  // No WebGL2 → no point loading a renderer that will fail.
  if (!hasWebGL2()) return 'low';

  const nav = navigator as NavigatorWithHints;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.innerWidth < 1024;

  // Touch phones and small viewports get the DOM-only experience. This is a
  // deliberate product call as much as a performance one — the pinned horizontal
  // track and cursor effects have no meaning without a pointer.
  if (coarse || narrow) return 'low';

  if (cores <= 4 || memory <= 4) return 'medium';

  return 'high';
}

function hasWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2'));
  } catch {
    return false;
  }
}

/** Caps the renderer DPR — the single biggest GPU cost lever. */
export function dprForTier(tier: QualityTier): [number, number] {
  switch (tier) {
    case 'high':
      return [1, 2];
    case 'medium':
      return [1, 1.5];
    default:
      return [1, 1];
  }
}

export const wantsWebGL = (tier: QualityTier) => tier === 'high' || tier === 'medium';
export const wantsParticles = (tier: QualityTier) => tier === 'high';
/** Glass refraction costs an extra render of the scene every frame. */
export const wantsTransmission = (tier: QualityTier) => tier === 'high';
/** Pins, scrubs and the horizontal track. */
export const wantsFullMotion = (tier: QualityTier) => tier !== 'off';
