type YoutubeCardVideoProps = {
  videoId: string;
  className?: string;
  /**
   * Oversize multiplier (CSS height %) for the "cover" trick. Defaults to
   * 180 — tuned for a vertical/portrait source filling a wider container
   * (e.g. a Short in a 9:16 or 16:9 card). Pass something closer to 105-120
   * when the source's aspect ratio is already close to its container's
   * (e.g. a standard landscape video in a 16:9 card), so it doesn't zoom in
   * more than necessary.
   */
  heightPercent?: number;
};

/**
 * Muted, autoplaying, looping YouTube video sized to cover an arbitrarily
 * sized card (not the viewport) — e.g. the hero's showreel frame, where a
 * vertical Shorts source needs to fill a 4:5 portrait card. Sized with
 * percentage units (which resolve against the actual container, unlike the
 * vw/vh trick used for viewport-filling backgrounds) and an oversize floor
 * so it covers regardless of the exact source aspect ratio.
 */
export function YoutubeCardVideo({ videoId, className = "", heightPercent = 180 }: YoutubeCardVideoProps) {
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

  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`}
      title=""
      tabIndex={-1}
      aria-hidden="true"
      allow="autoplay; encrypted-media"
      style={{ height: `${heightPercent}%` }}
      className={`pointer-events-none absolute left-1/2 top-1/2 w-full min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 ${className}`}
    />
  );
}
