"use client";

import { useState } from "react";
import { ArrowLink } from "@/components/ui/arrow-link";
import { smoothScrollToId } from "@/lib/smooth-scroll";
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
const headlineSize = "text-[clamp(2.4rem,10.5vw,3.1rem)] sm:text-[clamp(3rem,7vw,4.5rem)] lg:text-[clamp(3.75rem,6.6vw,7rem)]";

const HERO_FACTS = [
  { value: "200+", label: "videos cut" },
  { value: "10M+", label: "views" },
  { value: "AR / EN", label: "languages" },
];

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
          className="eyebrow hero-eyebrow mb-5 flex items-center gap-3 sm:mb-10 lg:mb-12"
          variants={fadeUp}
          transition={{ duration: 0.7, ease: easeEditorial }}
        >
          <span aria-hidden="true" className="rec-lamp" />
          MK · Video editor · Egypt · Since 2021
        </motion.p>

        <motion.h1
          id="hero-title"
          aria-label="Cut by hand. Frame by frame."
          className={`hero-heading font-display max-w-[68rem] uppercase leading-[0.86] tracking-[-0.015em] ${headlineSize}`}
          variants={staggerChildren()}
        >
          <span aria-hidden="true" className="reveal-line" style={line1Settled ? { overflow: "visible" } : undefined}>
            <motion.span
              className="block"
              variants={revealLine}
              transition={{ duration: 1.05, ease: easeEditorial }}
              onAnimationComplete={() => setLine1Settled(true)}
            >
              Cut by hand.
            </motion.span>
          </span>
          <span aria-hidden="true" className="reveal-line" style={line2Settled ? { overflow: "visible" } : undefined}>
            <motion.span
              className="block text-burgundy-metal"
              variants={revealLine}
              transition={{ duration: 1.05, ease: easeEditorial }}
              onAnimationComplete={() => setLine2Settled(true)}
            >
              Frame by frame.
            </motion.span>
          </span>
        </motion.h1>

        <motion.p
          className="mt-8 max-w-xl text-[0.98rem] leading-7 text-cream/70 sm:mt-10 lg:mt-12 lg:text-lg lg:leading-8"
          variants={fadeUp}
          transition={{ duration: 0.75, ease: easeEditorial }}
        >
          I&apos;m Moamen Shawky Kazamel. I edit YouTube documentaries, real-estate series, courses and reels in Arabic and
          English, with the motion graphics, captions and sound done in the same room.
        </motion.p>

        <motion.dl
          className="timecode mt-7 flex flex-wrap gap-x-8 gap-y-2 text-[0.72rem] uppercase text-cream/55"
          variants={fadeUp}
          transition={{ duration: 0.75, ease: easeEditorial }}
        >
          {HERO_FACTS.map((fact) => (
            <div key={fact.label} className="flex items-baseline gap-2">
              <dt className="sr-only">{fact.label}</dt>
              <dd className="text-cream">{fact.value}</dd>
              <span aria-hidden="true">{fact.label}</span>
            </div>
          ))}
        </motion.dl>

        <motion.div
          className="mt-6 sm:mt-10 lg:mt-12"
          variants={fadeUp}
          transition={{ duration: 0.75, ease: easeEditorial }}
        >
          <div className="flex flex-wrap items-center gap-x-10 gap-y-5">
            <ArrowLink
              href="#editing"
              onClick={(event) => {
                event.preventDefault();
                smoothScrollToId("editing");
              }}
              className="border-cream text-cream hover:border-signal hover:text-signal">
              See the edits
            </ArrowLink>
            <ArrowLink
              href="#work"
              onClick={(event) => {
                event.preventDefault();
                smoothScrollToId("work");
              }}
              className="border-cream/60 text-cream/75 hover:border-signal hover:text-signal">
              AI films
            </ArrowLink>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
