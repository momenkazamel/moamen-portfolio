type BackgroundVideoProps = {
  webmSrc?: string;
  mp4Src: string;
};

/**
 * Full-bleed, muted, autoplaying, looping local video background. Native
 * `object-fit: cover` (no iframe cover-trick needed, unlike the YouTube
 * embed version) so it fills its container edge to edge with no letterboxing.
 * Purely decorative — no controls, not focusable, not interactive.
 */
export function BackgroundVideo({ webmSrc, mp4Src }: BackgroundVideoProps) {
  return (
    <video
      aria-hidden="true"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      tabIndex={-1}
      className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
    >
      {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
      <source src={mp4Src} type="video/mp4" />
    </video>
  );
}
