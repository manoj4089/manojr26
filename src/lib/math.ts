export const clamp = (v: number, min: number, max: number) => (v < min ? min : v > max ? max : v);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Frame-rate independent damping. Unlike a raw lerp, the result is the same at
 * 60Hz and 144Hz — which matters because every per-frame smoothing call in this
 * codebase runs off the GSAP ticker.
 *
 * @param lambda higher = snappier. ~0.12 is the site default.
 */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * 60 * dt));

export const mapRange = (
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => {
  if (inMax === inMin) return outMin;
  return outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);
};

/** mapRange, clamped to the output bounds. */
export const mapClamped = (
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => {
  const out = mapRange(v, inMin, inMax, outMin, outMax);
  return outMin < outMax ? clamp(out, outMin, outMax) : clamp(out, outMax, outMin);
};

/** GLSL smoothstep. */
export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

/** Rounds to a fixed precision — avoids writing noisy float strings to the DOM. */
export const round = (v: number, precision = 3) => {
  const f = 10 ** precision;
  return Math.round(v * f) / f;
};

/** "1" → "01". Used for section and project numerals. */
export const pad2 = (n: number) => String(n).padStart(2, '0');
