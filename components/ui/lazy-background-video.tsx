"use client";

import { useEffect, useRef, useState } from "react";

type LazyBackgroundVideoProps = {
  src: string;
  posterSrc: string;
};

/**
 * Full-bleed, muted, looping local background video that only starts
 * downloading once its section scrolls near the viewport, so it never
 * competes with the hero on first load. The poster shows until then.
 */
export function LazyBackgroundVideo({ src, posterSrc }: LazyBackgroundVideoProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time fallback for browsers without IntersectionObserver support
      setIsNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {isNear ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={posterSrc}
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover object-center"
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- decorative poster, sized by CSS
        <img src={posterSrc} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-center" />
      )}
    </div>
  );
}
