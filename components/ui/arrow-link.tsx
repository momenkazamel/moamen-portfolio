"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { ComponentProps, PointerEvent } from "react";

type ArrowLinkProps = ComponentProps<typeof Link> & {
  className?: string;
  /** Opens in a new tab (adds target/rel) and swaps the arrow to ↗. */
  external?: boolean;
};

export function ArrowLink({ children, className = "", external = false, ...props }: ArrowLinkProps) {
  const prefersReducedMotion = useReducedMotion();
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const x = useSpring(offsetX, { stiffness: 280, damping: 18, mass: 0.18 });
  const y = useSpring(offsetY, { stiffness: 280, damping: 18, mass: 0.18 });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    offsetX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 7);
    offsetY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 7);
  }

  function resetPosition() {
    offsetX.set(0);
    offsetY.set(0);
  }

  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <motion.div
      className="inline-flex"
      style={{ x, y }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPosition}
    >
      <Link
        className={`group inline-flex items-center gap-4 border-b border-current pb-2 text-[0.62rem] font-medium uppercase tracking-[0.25em] transition-[border-color,color] duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bronze ${className}`}
        {...externalProps}
        {...props}
      >
        <span>{children}</span>
        <span
          aria-hidden="true"
          className={`text-base leading-none transition-transform duration-300 ease-out ${
            external ? "group-hover:-translate-y-0.5 group-hover:translate-x-1" : "group-hover:translate-x-1.5"
          }`}
        >
          {external ? "↗" : "→"}
        </span>
      </Link>
    </motion.div>
  );
}
