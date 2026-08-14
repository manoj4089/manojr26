interface MarqueeProps {
  items: string[];
  /** Seconds for one full pass. Lower = faster. */
  duration?: number;
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
}

/**
 * Seamless infinite marquee.
 *
 * Phase 2 drives this with a pure CSS animation so it runs with JS disabled.
 * Phase 8 replaces the animation with a GSAP tween whose timeScale is coupled to
 * scroll velocity: the client wrapper sets `data-js-driven` on the track, which
 * cancels the CSS animation (see globals.css) so the two never fight.
 *
 * The content is rendered twice and translated -50%, which is what makes the loop
 * seamless — the second copy is aria-hidden so it is not read out twice.
 */
export function Marquee({
  items,
  duration = 30,
  reverse = false,
  className = '',
  itemClassName = '',
}: MarqueeProps) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className={`flex shrink-0 items-center ${itemClassName}`}>
          <span>{item}</span>
          <span className="mx-6 text-acid sm:mx-9" aria-hidden>
            /
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={`marquee ${className}`}>
      <div
        className="marquee__track"
        data-marquee-track
        style={
          {
            '--marquee-duration': `${duration}s`,
            '--marquee-direction': reverse ? 'reverse' : 'normal',
          } as React.CSSProperties
        }
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
