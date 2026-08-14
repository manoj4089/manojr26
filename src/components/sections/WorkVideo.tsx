'use client';

import { useEffect, useRef, useState } from 'react';
import Image, { type StaticImageData } from 'next/image';

interface WorkVideoProps {
  /** Path under /public. */
  src: string;
  /** Frame 0 of the clip — see the note in WorkCard about why they must match. */
  poster: StaticImageData;
  alt: string;
  sizes: string;
  priority?: boolean;
}

/**
 * A work card's looping demo clip.
 *
 * The poster <Image> is the real render, not a placeholder: it is what the
 * server sends, what a visitor without JS keeps, and what a reduced-motion
 * visitor keeps. The <video> is mounted only on the client, only once motion is
 * allowed, and fades in over the top once it can actually play — so the card is
 * never empty and never shows a black box waiting on a download. Rendering the
 * image unconditionally is also what keeps hydration honest: the server and the
 * first client pass emit identical markup.
 *
 * Playback is driven by an IntersectionObserver rather than left to `autoplay`.
 * The clip sits mid-page, and holding a decoder and a compositor layer for the
 * ~90% of the scroll where it is off screen is exactly the kind of cost the
 * per-frame budget in scrollData.ts exists to protect.
 */
export function WorkVideo({ src, poster, alt, sizes, priority }: WorkVideoProps) {
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  // A live query, not a boot-time read — the visitor can flip the OS setting
  // mid-session, and the clip should stop when they do.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setAllowed(!mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const el = video.current;
    if (!allowed || !el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        // play() rejects if the browser declines (autoplay policy, low power
        // mode). Swallowing it leaves the poster up, which is the correct
        // degradation rather than an error in the console.
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.15 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [allowed]);

  return (
    <>
      <Image
        src={poster}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        placeholder="blur"
        className="object-contain"
      />

      {allowed && (
        <video
          ref={video}
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          // The poster underneath already carries the alt text; announcing the
          // same visual twice is noise.
          aria-hidden
          onCanPlay={() => setReady(true)}
          className={`absolute inset-0 size-full object-contain transition-opacity duration-700 ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </>
  );
}
