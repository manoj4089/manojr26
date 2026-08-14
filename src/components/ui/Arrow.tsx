interface ArrowProps {
  className?: string;
  /** 'ne' = up-right (external / open), 'e' = right (advance), 'n' = up (back to top). */
  dir?: 'ne' | 'e' | 'n';
}

const ROTATION = { ne: 0, e: 45, n: -45 } as const;

export function Arrow({ className, dir = 'ne' }: ArrowProps) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
      style={{ transform: `rotate(${ROTATION[dir]}deg)` }}
    >
      <path
        d="M3 9L9 3M9 3H4M9 3V8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}
