type BackgroundVideoProps = {
  webmSrc?: string;
  mp4Src: string;
  /** Lighter 720p versions for phones (picked by the <source media> query). */
  mobileWebmSrc?: string;
  mobileMp4Src?: string;
  posterSrc?: string;
};

/**
 * Full-bleed, muted, autoplaying, looping local video background. Native
 * `object-fit: cover` (no iframe cover-trick needed, unlike the YouTube
 * embed version) so it fills its container edge to edge with no letterboxing.
 * Purely decorative — no controls, not focusable, not interactive.
 */
export function BackgroundVideo({ webmSrc, mp4Src, mobileWebmSrc, mobileMp4Src, posterSrc }: BackgroundVideoProps) {
  return (
    <video
      aria-hidden="true"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      tabIndex={-1}
      poster={posterSrc}
      className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
    >
      {mobileWebmSrc ? <source src={mobileWebmSrc} type="video/webm" media="(max-width: 900px)" /> : null}
      {mobileMp4Src ? <source src={mobileMp4Src} type="video/mp4" media="(max-width: 900px)" /> : null}
      {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
      <source src={mp4Src} type="video/mp4" />
    </video>
  );
}
