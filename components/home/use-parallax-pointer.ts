import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { PointerEvent } from "react";

type SpringConfig = { stiffness: number; damping: number; mass: number };

type ParallaxOptions = {
  /** Max horizontal travel, as a multiplier of pointer offset (-0.5..0.5). */
  strengthX?: number;
  /** Max vertical travel, as a multiplier of pointer offset (-0.5..0.5). */
  strengthY?: number;
  /** Spring tuning for the slower, background-layer track (e.g. an ambient glow). */
  backSpring?: SpringConfig;
  /** Spring tuning for the tighter, foreground-layer track (e.g. a framed element). */
  frontSpring?: SpringConfig;
};

const defaultBackSpring: SpringConfig = { stiffness: 35, damping: 22, mass: 0.8 };
const defaultFrontSpring: SpringConfig = { stiffness: 50, damping: 24, mass: 0.7 };

/**
 * Tracks pointer position within an element and exposes two spring-smoothed
 * x/y motion value pairs for a layered parallax effect (a slow-moving
 * background layer and a tighter-following foreground layer).
 *
 * Disabled for touch input and when the user prefers reduced motion.
 */
export function useParallaxPointer({
  strengthX = 12,
  strengthY = 10,
  backSpring = defaultBackSpring,
  frontSpring = defaultFrontSpring,
}: ParallaxOptions = {}) {
  const prefersReducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const back = {
    x: useSpring(pointerX, backSpring),
    y: useSpring(pointerY, backSpring),
  };
  const front = {
    x: useSpring(pointerX, frontSpring),
    y: useSpring(pointerY, frontSpring),
  };

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (prefersReducedMotion || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    pointerX.set(x * strengthX);
    pointerY.set(y * strengthY);
  }

  function reset() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return { back, front, handlePointerMove, reset, prefersReducedMotion };
}
