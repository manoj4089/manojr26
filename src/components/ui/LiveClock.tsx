'use client';

import { useEffect, useState } from 'react';

import { profile } from '@/data/profile';

/**
 * Hydration-safe local clock. The server has no idea what time it is in Chennai
 * relative to the visitor, and rendering a real time on both sides would mismatch —
 * so the server (and the first client render) emit a placeholder, and the real
 * value only appears after mount.
 */
export function LiveClock({ className = '' }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: profile.location.timeZone,
      }).format(new Date());

    setTime(format());
    const id = setInterval(() => setTime(format()), 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      <time suppressHydrationWarning>{time ?? '--:--'}</time> {profile.location.tzLabel}
    </span>
  );
}
