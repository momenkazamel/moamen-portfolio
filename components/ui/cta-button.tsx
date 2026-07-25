import type { AnchorHTMLAttributes, ReactNode } from "react";

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
export function CtaButton({ children, className = "", external = false, ...props }: CtaButtonProps) {
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <a className={`cta-button ${className}`} {...externalProps} {...props}>
      <span>{children}</span>
      <span aria-hidden="true" className="cta-arrow">
        {external ? "↗" : "→"}
      </span>
    </a>
  );
}
