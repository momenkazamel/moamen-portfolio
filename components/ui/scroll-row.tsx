"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type ScrollRowProps = {
  children: ReactNode;
  /** Accessible name for the scrollable list, e.g. "Video editing projects". */
  label: string;
  /** "dark" for charcoal sections, "light" for cream ones — only affects the arrow buttons. */
  tone?: "dark" | "light";
};

/**
 * Horizontal, snap-scrolling row of cards with prev/next arrows. Swipe on
 * touch, trackpad/shift-wheel or the arrows on desktop. The row bleeds to
 * the right edge of the viewport (cards keep the .shell's left alignment)
 * so it's obvious there is more to scroll to. Children should be <li>s.
 */
export function ScrollRow({ children, label, tone = "dark" }: ScrollRowProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateEdges = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    setCanPrev(list.scrollLeft > 4);
    setCanNext(list.scrollLeft + list.clientWidth < list.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    updateEdges();
    list.addEventListener("scroll", updateEdges, { passive: true });
    const resizeObserver = new ResizeObserver(updateEdges);
    resizeObserver.observe(list);
    return () => {
      list.removeEventListener("scroll", updateEdges);
      resizeObserver.disconnect();
    };
  }, [updateEdges]);

  function scrollByPage(direction: 1 | -1) {
    const list = listRef.current;
    if (!list) return;
    list.scrollBy({ left: direction * list.clientWidth * 0.8, behavior: "smooth" });
  }

  const buttonClass =
    tone === "dark"
      ? "border-cream/25 text-cream hover:border-bronze hover:text-bronze"
      : "border-ink/20 text-ink hover:border-bronze hover:text-bronze";

  return (
    <div>
      <div className="shell flex justify-end gap-3">
        <button
          type="button"
          aria-label="Scroll left"
          disabled={!canPrev}
          onClick={() => scrollByPage(-1)}
          className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 disabled:pointer-events-none disabled:opacity-25 ${buttonClass}`}
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          disabled={!canNext}
          onClick={() => scrollByPage(1)}
          className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 disabled:pointer-events-none disabled:opacity-25 ${buttonClass}`}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <ul
        ref={listRef}
        aria-label={label}
        className="scroll-row mt-6 flex snap-x snap-mandatory list-none gap-6 overflow-x-auto pb-4 sm:gap-8"
      >
        {children}
      </ul>
    </div>
  );
}
