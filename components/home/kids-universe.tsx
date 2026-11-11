import { CtaButton } from "@/components/ui/cta-button";
import { LazyBackgroundVideo } from "@/components/ui/lazy-background-video";

const YOUTUBE_URL = "https://www.youtube.com/@AiBrushForKids";

// Alphabet Song video (jRpkIwZVtec, 15s–35s), self-hosted as a 20s muted
// loop so the section doesn't wait on a YouTube iframe.

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
      <LazyBackgroundVideo src="/videos/kids/kids-universe-bg.mp4" posterSrc="/images/kids/kids-universe-bg.jpg" />
      {/* Stronger scrim on phones for readability over the busier video
          frame; unchanged 50% from `lg:` up. */}
      <div aria-hidden="true" className="absolute inset-0 bg-charcoal/65 lg:bg-charcoal/50" />
      <div aria-hidden="true" className="hero-vignette pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="hero-grain pointer-events-none absolute inset-0 opacity-50" />

      <div className="shell relative grid min-h-[52vh] content-center py-16 sm:min-h-[70vh] sm:py-20 lg:min-h-[64vh] lg:grid-cols-12 lg:items-center">
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
            EDUCATIONAL STORYTELLING
          </p>

          <p className="mt-6 max-w-md text-[0.98rem] leading-7 text-cream/65 lg:text-lg lg:leading-8">
            A collection of educational animations combining storytelling, music, colorful characters, and cinematic visuals to create engaging learning experiences for children.
          </p>

          <CtaButton href={YOUTUBE_URL} external className="mt-9">
            EXPLORE THE CHANNEL
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
