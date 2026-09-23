"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { getLeadEvent, trackEvent } from "@/lib/analytics";

type CtaButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  className?: string;
  /** Opens in a new tab (adds target/rel) and swaps the arrow to ↗. */
  external?: boolean;
};

/**
 * Premium bordered CTA button — bronze border, fills solid on hover/focus.
 * Plain `<a>` rather than next/link since it's meant for real external
 * destinations (prefetching an internal route isn't relevant here).
 */
export function CtaButton({ children, className = "", external = false, onClick, href, ...props }: CtaButtonProps) {
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (href) {
      const leadEvent = getLeadEvent(href);
      if (leadEvent) trackEvent(leadEvent.name, leadEvent.params);
    }
  }

  return (
    <a className={`cta-button ${className}`} href={href} onClick={handleClick} {...externalProps} {...props}>
      <span>{children}</span>
      <span aria-hidden="true" className="cta-arrow">
        {external ? "↗" : "→"}
      </span>
    </a>
  );
}
