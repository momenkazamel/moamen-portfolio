import { CtaButton } from "@/components/ui/cta-button";
import { YoutubeBackgroundVideo } from "@/components/ui/youtube-background-video";

const YOUTUBE_URL = "https://www.youtube.com/@AiBrushForKids";

// Alphabet Song video, looped as the section's background.
// Segment (15s–35s) is a placeholder guess at a colorful, energetic part —
// adjust BACKGROUND_VIDEO_START/END below once you've confirmed the right
// moment in the actual footage.
const BACKGROUND_VIDEO_ID = "jRpkIwZVtec";
const BACKGROUND_VIDEO_START = 15;
const BACKGROUND_VIDEO_END = 35;

/**
 * Compact, single-feature section for the "Kids Universe" side project —
 * a brand introduction rather than a video showcase. The looping background
 * video is the section's entire visual (no separate card), with the text
 * block set off to the right against generous negative space on the left,
 * on the same dark charcoal ground as the hero for visual continuity.
 */
export function KidsUniverse() {
  return (
    <section
      id="kids-universe"
      aria-labelledby="kids-universe-title"
      className="relative isolate overflow-hidden bg-charcoal text-cream"
    >
      <YoutubeBackgroundVideo videoId={BACKGROUND_VIDEO_ID} start={BACKGROUND_VIDEO_START} end={BACKGROUND_VIDEO_END} />
      {/* Stronger scrim on phones for readability over the busier video
          frame; unchanged 50% from `lg:` up. */}
      <div aria-hidden="true" className="absolute inset-0 bg-charcoal/65 lg:bg-charcoal/50" />
      <div aria-hidden="true" className="hero-vignette pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="hero-grain pointer-events-none absolute inset-0 opacity-50" />

      <div className="shell relative grid min-h-[52vh] content-center py-14 sm:min-h-[70vh] sm:py-20 lg:min-h-[64vh] lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5 lg:col-start-8">
          <p className="eyebrow hero-eyebrow mb-6 flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-11 bg-bronze" />
            Original Series
          </p>

          <h2
            id="kids-universe-title"
            className="font-display max-w-xl text-[clamp(2.5rem,5vw,4.2rem)] leading-[1.05] tracking-[-0.03em]"
          >
            Kids Universe.
          </h2>

          <p className="mt-4 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-bronze">
            AI-POWERED EDUCATIONAL STORYTELLING
          </p>

          <p className="mt-6 max-w-md text-[0.98rem] leading-7 text-cream/65 lg:text-lg lg:leading-8">
            A collection of AI-generated educational animations combining storytelling, music, colorful characters, and cinematic visuals to create engaging learning experiences for children.
          </p>

          <CtaButton href={YOUTUBE_URL} external className="mt-9">
            EXPLORE THE CHANNEL
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
