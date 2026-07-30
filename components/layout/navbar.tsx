"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MonogramMark } from "@/components/ui/monogram-mark";
import { easeEditorial } from "@/components/home/hero.motion";

const navigation = [
  { href: "#work", label: "Work" },
  { href: "#kids-universe", label: "Kids Universe" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

const RESUME_URL = "/documents/Moamen_Kazamel_CV.pdf";

// Matches the site's editorial motion language (a gentler, closed-form
// cousin of the easeEditorial bezier used elsewhere) so the scroll itself
// feels considered rather than like a default browser jump.
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function smoothScrollToId(id: string, duration = 900) {
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

/**
 * Fixed header — transparent over the hero, gaining a soft cream ground,
 * blur, and hairline border once the page scrolls past ~60px. Nav-link and
 * nav-cta colors flip between cream (on the dark hero) and ink (on the
 * solid ground) via the .navbar-transparent CSS hook in globals.css. Active
 * section is tracked with an IntersectionObserver and surfaced as a quiet
 * bronze tint on the matching link — no bold weight, no underline.
 *
 * Below `lg:`, the inline nav/CTA are replaced by a fullscreen takeover menu
 * (charcoal ground, the same uppercase-tracked nav typography scaled up)
 * triggered by the hamburger button, which morphs into an X while it's open.
 */
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 60);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = navigation
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll while the fullscreen menu is open. Plain
  // `overflow: hidden` on <body> is well known not to actually stop touch
  // scrolling on iOS Safari — pinning the body with `position: fixed` (and
  // restoring the exact scroll offset afterwards) is the reliable
  // cross-browser fix.
  useEffect(() => {
    if (!isMenuOpen) return;

    const scrollY = window.scrollY;
    const { body } = document;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      // Object form + "instant": same reasoning as smoothScrollToId — the
      // legacy two-arg call would respect the global `scroll-behavior: smooth`
      // and visibly animate back to the stored offset instead of restoring
      // it instantly, producing a jarring "scroll jump" every time the menu closes.
      window.scrollTo({ top: scrollY, behavior: "instant" });
    };
  }, [isMenuOpen]);

  // Hide the rest of the page from screen readers / keyboard tab order
  // while the fullscreen menu covers it, so Tab can't "escape" into content
  // that's visually hidden behind an opaque overlay.
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    if (isMenuOpen) {
      main.setAttribute("inert", "");
    } else {
      main.removeAttribute("inert");
    }
    return () => main.removeAttribute("inert");
  }, [isMenuOpen]);

  // Escape closes the menu; resizing past the `lg:` breakpoint (e.g. a
  // developer resizing the window, or a tablet rotating) auto-closes it so
  // it can never get stuck open with scroll still locked once the
  // fullscreen menu's trigger is no longer even visible.
  useEffect(() => {
    if (!isMenuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeMenu();
    }
    function handleResize() {
      if (window.innerWidth >= 1024) closeMenu();
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

  // Move focus into the panel when it opens so keyboard/screen-reader users
  // land somewhere sensible instead of on now-inert background content.
  useEffect(() => {
    if (isMenuOpen) panelRef.current?.focus();
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
    toggleButtonRef.current?.focus();
  }

  function handleNavClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    closeMenu();
    smoothScrollToId(href.slice(1));
  }

  const isDarkGround = !isScrolled && !isMenuOpen;
  const logoTextClass = isDarkGround ? "text-cream" : "text-ink";
  const menuButtonClass = isMenuOpen
    ? "border-cream/40 text-cream"
    : isScrolled
      ? "border-ink/15 text-ink"
      : "border-cream/40 text-cream";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-all duration-500 ease-out ${
        isScrolled || isMenuOpen
          ? "navbar-solid border-b border-ink/15 bg-cream/85 backdrop-blur-md"
          : "navbar-transparent border-b border-transparent bg-transparent"
      }`}
    >
      <div className="shell flex h-[4.75rem] items-center justify-between lg:h-[5.75rem]">
        <Link
          href="/"
          aria-label="Moamen Kazamel — home"
          aria-hidden={isMenuOpen}
          tabIndex={isMenuOpen ? -1 : undefined}
          className={`group flex items-center gap-4 transition-colors duration-500 ${logoTextClass} hover:opacity-70`}
        >
          <MonogramMark
            className={`h-9 w-[1.875rem] transition-colors duration-300 ${logoTextClass} group-hover:text-bronze`}
          />
          <span aria-hidden="true" className="hidden h-8 w-px bg-bronze/40 sm:block" />
          <span className="hidden flex-col gap-[6px] sm:flex">
            <span className="text-[0.64rem] font-medium uppercase leading-none tracking-[0.38em]">
              Moamen Kazamel
            </span>
            <span
              className={`text-[0.56rem] font-medium uppercase leading-none tracking-[0.24em] ${
                isDarkGround ? "text-cream/55" : "text-ink/45"
              }`}
            >
              AI Creative Director
            </span>
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(event) => handleNavClick(event, item.href)}
              className={`nav-link ${activeSection === item.href.slice(1) ? "text-bronze" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-cta hidden items-center gap-2 lg:inline-flex"
        >
          Download Resume
          <span aria-hidden="true" className="text-[0.6rem]">
            ↗
          </span>
        </Link>

        {/* Hamburger / close toggle — visible below `lg:` only. */}
        <button
          ref={toggleButtonRef}
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
          className={`relative z-[70] flex h-11 w-11 items-center justify-center border transition-colors duration-500 lg:hidden ${menuButtonClass}`}
        >
          <span className="relative block h-3 w-5">
            <span
              aria-hidden="true"
              className={`absolute left-0 top-0 h-px w-5 bg-current transition-all duration-300 ease-out ${
                isMenuOpen ? "top-1/2 rotate-45" : ""
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute left-0 bottom-0 h-px w-5 bg-current transition-all duration-300 ease-out ${
                isMenuOpen ? "bottom-1/2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            key="mobile-menu"
            id="mobile-menu"
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            className="navbar-transparent fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-charcoal text-cream outline-none lg:hidden"
            style={{
              paddingTop: "calc(env(safe-area-inset-top) + 4.75rem)",
              paddingBottom: "env(safe-area-inset-bottom)",
              paddingLeft: "env(safe-area-inset-left)",
              paddingRight: "env(safe-area-inset-right)",
            }}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.4, ease: easeEditorial }}
          >
            <div aria-hidden="true" className="hero-grain pointer-events-none absolute inset-0 opacity-40" />

            {/* Structured top-to-bottom composition (label → links → CTA)
                rather than one vertically-centered blob — reads as a
                deliberate, editorial "table of contents" instead of a
                generic enlarged dropdown. The small tracked index numbers
                beside each link echo the ghost numerals used in Featured
                Work, tying the fullscreen menu back into the site's own
                visual language. */}
            <nav aria-label="Mobile navigation" className="shell relative flex flex-1 flex-col py-8">
              <p className="eyebrow hero-eyebrow mb-2 flex items-center gap-4">
                <span aria-hidden="true" className="h-px w-8 bg-bronze" />
                Menu
              </p>

              <div className="flex flex-1 flex-col justify-center gap-1">
                {navigation.map((item, index) => {
                  const isActive = activeSection === item.href.slice(1);
                  return (
                    <motion.div
                      key={item.href}
                      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: prefersReducedMotion ? 0.01 : 0.45,
                        delay: prefersReducedMotion ? 0 : 0.08 + index * 0.05,
                        ease: easeEditorial,
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={(event) => handleNavClick(event, item.href)}
                        className={`group flex items-baseline gap-4 border-b border-cream/10 py-4 transition-colors duration-300 hover:text-bronze focus-visible:text-bronze focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bronze ${
                          isActive ? "text-bronze" : "text-cream"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`text-[0.68rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300 group-hover:text-bronze group-focus-visible:text-bronze ${
                            isActive ? "text-bronze" : "text-cream/30"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="font-display text-[clamp(2.1rem,9vw,2.75rem)] leading-[1.05] tracking-[-0.02em]">
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0.01 : 0.45,
                  delay: prefersReducedMotion ? 0 : 0.08 + navigation.length * 0.05,
                  ease: easeEditorial,
                }}
              >
                <Link
                  href={RESUME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="nav-cta mt-8"
                >
                  Download Resume
                  <span aria-hidden="true" className="text-[0.6rem]">
                    ↗
                  </span>
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
