/**
 * Fixed film-grain layer. Uses mix-blend-mode, which creates a stacking context —
 * anything that must sit above it (nav, cursor, overlay) needs a z-index from the
 * ladder documented in globals.css.
 */
export function GrainOverlay() {
  return <div className="grain" aria-hidden />;
}
