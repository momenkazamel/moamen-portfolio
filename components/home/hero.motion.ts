import type { Variants } from "framer-motion";

/** Simple fade + rise entrance, used for eyebrow, paragraph, and CTA rows. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

/** Slide-up reveal for a single masked headline line (pairs with .reveal-line). */
export const revealLine: Variants = {
  hidden: { opacity: 0, y: "108%" },
  visible: { opacity: 1, y: "0%" },
};

/** Stagger helper for a group of children animating in sequence. */
export function staggerChildren(stagger = 0.11, delay = 0.08): Variants {
  return {
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
}

export const easeEditorial = [0.16, 1, 0.3, 1] as const;
