"use client";

import { useState } from "react";
import { ArrowLink } from "@/components/ui/arrow-link";
import { BackgroundVideo } from "@/components/ui/background-video";
import { useParallaxPointer } from "@/components/home/use-parallax-pointer";
import { fadeUp, revealLine, staggerChildren, easeEditorial } from "@/components/home/hero.motion";
import { motion } from "framer-motion";

/**
 * Fluid headline size. The `lg:` value is the reference (desktop) scale and
 * must stay in sync with the editorial design — do not change it casually.
 * The tiers below `lg:` exist so the headline scales down smoothly on
 * narrow viewports instead of holding a flat, oversized value that can
 * wrap ("Stories worth" onto two lines) and clip inside the reveal mask.
 */
const headlineSize = "text-[clamp(2.75rem,12.5vw,3.75rem)] sm:text-[clamp(3.5rem,9vw,5.5rem)] lg:text-[clamp(4.25rem,9.45vw,10.125rem)]";

export function Hero() {
  const { back: glow, handlePointerMove, reset, prefersReducedMotion } = useParallaxPointer();
  // The reveal mask's overflow-hidden only needs to exist while the slide-up
  // entrance animation is actually running. Once each line settles, the
  // clip is released (inline style, so it reliably wins over the .reveal-line
  // class) so nothing can ever crop a descender like the "g" in "watching"
  // at rest. Reduced-motion visitors never animate, so they start settled.
  const [line1Settled, setLine1Settled] = useState(() => prefersReducedMotion);
  const [line2Settled, setLine2Settled] = useState(() => prefersReducedMotion);

  return (
    <section
      className="relative isolate overflow-hidden bg-charcoal text-cream"
      aria-labelledby="hero-title"
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
    >
      <BackgroundVideo mp4Src="/videos/hero-background.mp4" webmSrc="/videos/hero-background.webm" />
      {/* Stronger scrim on phones (video detail matters less than text
          legibility on a small screen); unchanged 60% from `lg:` up. */}
      <div aria-hidden="true" className="absolute inset-0 bg-charcoal/75 lg:bg-charcoal/60" />
      <motion.div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute -right-[20%] top-[4%] h-[43rem] w-[43rem] rounded-full"
        style={{ x: glow.x, y: glow.y }}
      />
      <div aria-hidden="true" className="hero-vignette pointer-events-none absolute inset-0" />
      <div className="hero-grain pointer-events-none absolute inset-0 opacity-50" />

      <motion.div
        className="shell relative grid min-h-[90svh] content-center py-12 sm:min-h-[calc(100svh-4.75rem-150px)] sm:py-20 lg:min-h-[calc(100svh-5.75rem-150px)] lg:-translate-y-5 lg:py-24"
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={staggerChildren()}
      >
        <motion.p
          className="eyebrow hero-eyebrow mb-5 flex items-center gap-4 sm:mb-10 lg:mb-12"
          variants={fadeUp}
          transition={{ duration: 0.7, ease: easeEditorial }}
        >
          <span aria-hidden="true" className="h-px w-11 bg-bronze" />
          AI creative producer · Est. 2021
        </motion.p>

        <motion.h1
          id="hero-title"
          aria-label="Stories worth watching twice."
          className={`hero-heading font-display max-w-[68rem] leading-[0.89] tracking-[-0.072em] ${headlineSize}`}
          variants={staggerChildren()}
        >
          <span aria-hidden="true" className="reveal-line" style={line1Settled ? { overflow: "visible" } : undefined}>
            <motion.span
              className="block"
              variants={revealLine}
              transition={{ duration: 1.05, ease: easeEditorial }}
              onAnimationComplete={() => setLine1Settled(true)}
            >
              Stories worth
            </motion.span>
          </span>
          <span aria-hidden="true" className="reveal-line" style={line2Settled ? { overflow: "visible" } : undefined}>
            <motion.span
              className="block text-[0.91em] tracking-[0.01em] text-bronze"
              variants={revealLine}
              transition={{ duration: 1.05, ease: easeEditorial }}
              onAnimationComplete={() => setLine2Settled(true)}
            >
              watching twice.
            </motion.span>
          </span>
        </motion.h1>

        <motion.p
          className="mt-8 max-w-lg text-[0.98rem] leading-7 text-cream/65 sm:mt-10 lg:mt-12 lg:text-lg lg:leading-8"
          variants={fadeUp}
          transition={{ duration: 0.75, ease: easeEditorial }}
        >
          I direct and produce cinematic campaigns, visual identities, and social worlds—with AI as a quiet collaborator.
        </motion.p>

        <motion.div
          className="mt-6 sm:mt-10 lg:mt-12"
          variants={fadeUp}
          transition={{ duration: 0.75, ease: easeEditorial }}
        >
          <ArrowLink href="#work" className="border-cream text-cream hover:border-bronze hover:text-bronze">
            View selected work
          </ArrowLink>
        </motion.div>
      </motion.div>
    </section>
  );
}
