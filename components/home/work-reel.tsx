"use client";

import { useEffect, useRef, useState } from "react";
import type { WorkGrade } from "@/components/home/work-data";
import { YoutubeCardVideo } from "@/components/ui/youtube-card-video";

type WorkReelProps = {
  grade: WorkGrade;
  title: string;
  href?: string;
  /** Overrides the default "Open the case study for X" aria-label — use when href points somewhere else (e.g. a Reel). */
  ariaLabel?: string;
  /** Once real footage exists for a project, drop its mp4 URL in here. */
  videoSrc?: string;
  posterSrc?: string;
  /** YouTube Short to embed instead — takes priority over videoSrc. */
  youtubeVideoId?: string;
};

/**
 * Vertical 9:16 video card — the Selected Work centerpiece. Contains
 * nothing but the video and the frame's atmospheric texture (gradient/
 * reflection/vignette/grain/glass) — no play button, no text overlays.
 * Category, year, title, and everything else lives in the text column
 * beside it instead, so the card reads as a single clean piece of artwork.
 * Hover already communicates interactivity via the frame's own lift/scale/
 * brighten treatment, so no separate icon is needed.
 *
 * The actual video/iframe is only mounted once the card scrolls near the
 * viewport (IntersectionObserver, ~200px lookahead) — with six of these on
 * the page, loading all six YouTube embeds/videos up front on page load
 * would be wasteful, especially on mobile data. The gradient canvas shows
 * immediately either way so the card never looks empty while it waits.
 *
 * No project has real footage yet except "Before the First Sip" (via
 * `youtubeVideoId`) — everything else falls back to the color-graded
 * gradient placeholder used before. Drop an mp4 URL into a project's
 * `videoSrc` in work-data.ts and it starts playing automatically.
 */
export function WorkReel({ grade, title, href, ariaLabel, videoSrc, posterSrc, youtubeVideoId }: WorkReelProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    if (isNearViewport) return;
    const node = frameRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsNearViewport(true);
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isNearViewport]);

  const shouldLoadVideo = isNearViewport && (youtubeVideoId || videoSrc);

  const frame = (
    <div
      ref={frameRef}
      className="showreel-frame work-frame relative aspect-[9/16] w-full max-w-none overflow-hidden rounded-[6px] bg-[#15120f] shadow-[0_20px_50px_rgba(16,14,12,0.18)] sm:max-w-md lg:max-w-[22rem]"
    >
      <div aria-hidden="true" className={`showreel-canvas work-canvas-${grade} absolute inset-0`} />

      {shouldLoadVideo && youtubeVideoId ? (
        <YoutubeCardVideo
          videoId={youtubeVideoId}
          className="brightness-[0.9] transition-[transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:brightness-100"
        />
      ) : shouldLoadVideo && videoSrc ? (
        <video
          aria-hidden="true"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={posterSrc}
          className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.9] transition-[transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:brightness-100"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : null}

      <div aria-hidden="true" className="showreel-reflection absolute inset-0" />
      <div aria-hidden="true" className="showreel-vignette absolute inset-0" />
      <div aria-hidden="true" className="showreel-grain absolute inset-0" />
      <div aria-hidden="true" className="absolute inset-[0.3rem] border border-cream/15" />
      <div aria-hidden="true" className="showreel-glass absolute inset-[0.7rem] border border-cream/15" />
    </div>
  );

  if (!href) return frame;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel ?? `Open the case study for ${title}`}
      className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bronze"
    >
      {frame}
    </a>
  );
}
