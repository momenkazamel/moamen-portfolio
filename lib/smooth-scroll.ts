// Matches the site's editorial motion language (a gentler, closed-form
// cousin of the easeEditorial bezier used elsewhere) so the scroll itself
// feels considered rather than like a default browser jump.
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export function smoothScrollToId(id: string, duration = 900) {
  const target = document.getElementById(id);
  if (!target) return;

  const startY = window.scrollY;
  const targetY = target.getBoundingClientRect().top + startY;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    window.scrollTo({ top: targetY, behavior: "instant" });
    return;
  }

  const startTime = performance.now();

  // `behavior: "instant"` on every frame is deliberate: the page has global
  // `scroll-behavior: smooth` CSS, and the legacy two-argument `scrollTo(x, y)`
  // form defaults to `behavior: "auto"`, which respects that CSS and tries to
  // smoothly animate to each intermediate target itself — fighting this
  // function's own per-frame easing and producing a stuttery scroll instead
  // of the intended one.
  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo({ top: startY + (targetY - startY) * easeInOutCubic(progress), behavior: "instant" });
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}
