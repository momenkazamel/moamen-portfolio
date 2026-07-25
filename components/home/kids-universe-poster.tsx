"use client";

import { useEffect, useRef, useState } from "react";
import { YoutubeCardVideo } from "@/components/ui/youtube-card-video";

type KidsUniversePosterProps = {
  href: string;
  videoId: string;
};

/**
 * Preview card for the single featured Kids Universe title — a real,
 * autoplaying 16:9 video (same YoutubeCardVideo embed technique used for
 * the Selected Work project reels), not a static thumbnail. The iframe is
 * only mounted once the card scrolls into view: muted autoplay via the
 * embed's own URL params is reliable across browsers on its own, but this
 * also means the video doesn't start loading/playing until it's actually
 * visible, which is the same "starts once visible" behavior an
 * IntersectionObserver-gated <video> would give.
 */
export function KidsUniversePoster({ href, videoId }: KidsUniversePosterProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  // If IntersectionObserver isn't available, just show the video immediately
  // rather than gating it on an API that doesn't exist.
  const [isVisible, setIsVisible] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const node = frameRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Watch Kids Universe on YouTube"
      className="group relative mx-auto block w-full max-w-[23rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bronze lg:mx-0 lg:w-[82%] lg:max-w-none"
    >
      <div
        ref={frameRef}
        className="relative aspect-video w-full overflow-hidden rounded-[6px] border border-cream/15 bg-charcoal shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-shadow duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:shadow-[0_30px_70px_rgba(0,0,0,0.5)]"
      >
        {isVisible ? (
          <YoutubeCardVideo
            videoId={videoId}
            heightPercent={110}
            className="brightness-[0.92] transition-[transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:brightness-100"
          />
        ) : null}
      </div>
    </a>
  );
}
