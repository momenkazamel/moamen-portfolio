"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
  suffixClassName?: string;
};

/**
 * Animates a number counting up from 0 once it scrolls into view. Only the
 * numeric part animates — any suffix (e.g. "M+") is rendered statically so
 * it isn't misread as part of the count. Jumps straight to the final value
 * when the user prefers reduced motion.
 */
export function CountUp({ value, suffix = "", duration = 1.8, className = "", suffixClassName = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(prefersReducedMotion ? value : 0);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) return;

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return () => controls.stop();
  }, [isInView, value, duration, prefersReducedMotion]);

  return (
    <span ref={ref} className={className}>
      <span className="tabular-nums">{display}</span>
      {suffix ? <span className={suffixClassName}>{suffix}</span> : null}
    </span>
  );
}
