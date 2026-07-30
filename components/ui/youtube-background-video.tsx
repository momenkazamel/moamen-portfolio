type YoutubeBackgroundVideoProps = {
  /** YouTube video ID (the part after `v=`, or after `/shorts/`, in the URL). */
  videoId: string;
  /** Segment to loop, in seconds. Omit either to play/loop the whole video. */
  start?: number;
  end?: number;
};

/**
 * Full-bleed, muted, autoplaying, looping YouTube background video. Shared
 * by the hero and Kids Universe sections. YouTube embeds don't support
 * `object-fit`, so this uses the standard oversized-iframe "cover" trick
 * (size from viewport units, floored by `min-w-full`/`min-h-full` so it can
 * never be smaller than its container) to fill the section regardless of
 * aspect ratio. Purely decorative — pointer-events and interactivity are
 * disabled, and the section's own vignette/grain/scrim layers render on top
 * of it for text readability.
 */
export function YoutubeBackgroundVideo({ videoId, start, end }: YoutubeBackgroundVideoProps) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: videoId,
    controls: "0",
    disablekb: "1",
    modestbranding: "1",
    playsinline: "1",
    rel: "0",
    iv_load_policy: "3",
  });
  if (start !== undefined) params.set("start", String(start));
  if (end !== undefined) params.set("end", String(end));

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`}
        title=""
        tabIndex={-1}
        loading="lazy"
        allow="autoplay; encrypted-media"
        className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}
