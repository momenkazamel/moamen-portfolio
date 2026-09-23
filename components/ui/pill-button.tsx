"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { getLeadEvent, trackEvent } from "@/lib/analytics";

type PillButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  className?: string;
};

/**
 * Quiet outline pill CTA for light sections — transparent by default, a
 * faint bronze tint plus a brighter border on hover. Distinct from
 * `ArrowLink` (an underlined text link) and `CtaButton` (a solid-fill
 * button built for dark sections): this is a lighter-touch "editorial
 * pill" treatment, not a marketing button.
 */
export function PillButton({ children, className = "", onClick, href, ...props }: PillButtonProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (href) {
      const leadEvent = getLeadEvent(href);
      if (leadEvent) trackEvent(leadEvent.name, leadEvent.params);
    }
  }

  return (
    <a
      className={`pill-button focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bronze ${className}`}
      href={href}
      onClick={handleClick}
      {...props}
    >
      <span>{children}</span>
      <span aria-hidden="true" className="pill-button-arrow">
        ⟶
      </span>
    </a>
  );
}
