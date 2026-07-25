type MonogramMarkProps = {
  className?: string;
};

/**
 * Bespoke interlocking "MK" monogram. The M's right stem doubles as the
 * K's spine — a classic shared-stroke technique — with the K's arms
 * reaching back into the M's counter for a woven, intertwined feel. Thick
 * stems against hairline diagonals and serif terminal ticks nod at a
 * high-contrast serif without depending on any loaded typeface. Colored
 * via `currentColor` so it inherits color (and hover states) from its
 * parent, e.g. `text-ink group-hover:text-bronze`.
 */
export function MonogramMark({ className = "" }: MonogramMarkProps) {
  return (
    <svg
      viewBox="0 0 100 120"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="butt"
      aria-hidden="true"
    >
      {/* M left stem */}
      <path d="M15 105 L15 15" strokeWidth={6} />
      {/* Shared M-right leg / K spine */}
      <path d="M55 105 L55 15" strokeWidth={6} />
      {/* M diagonals */}
      <path d="M15 15 L35 78" strokeWidth={2.4} />
      <path d="M35 78 L55 15" strokeWidth={2.4} />
      {/* K arms, reaching left into the M's counter for the interlock */}
      <path d="M46 46 L86 13" strokeWidth={2.4} />
      <path d="M44 66 L88 105" strokeWidth={2.4} />
      {/* Serif terminals */}
      <path d="M10 15 L20 15" strokeWidth={3} />
      <path d="M10 105 L20 105" strokeWidth={3} />
      <path d="M50 15 L60 15" strokeWidth={3} />
      <path d="M50 105 L60 105" strokeWidth={3} />
      <path d="M32 81 L38 81" strokeWidth={2.4} />
      <path d="M81 14 L91 12" strokeWidth={3} />
      <path d="M83 105 L93 105" strokeWidth={3} />
    </svg>
  );
}
