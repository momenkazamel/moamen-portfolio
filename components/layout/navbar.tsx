"use client";

import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
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
    window.scrollTo(0, targetY);
    return;
  }

  const startTime = performance.now();

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + (targetY - startY) * easeInOutCubic(progress));
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

  // Lock body scroll while the fullscreen menu is open.
  useEffect(() => {
    if (!isMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  function handleNavClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    setIsMenuOpen(false);
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
            id="mobile-menu"
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-charcoal text-cream lg:hidden"
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

            <nav aria-label="Mobile navigation" className="shell relative flex flex-1 flex-col justify-center gap-2 py-10">
              {navigation.map((item, index) => (
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
                    className={`block border-b border-cream/10 py-5 text-[clamp(1.4rem,6.5vw,2.1rem)] font-medium uppercase leading-none tracking-[0.06em] transition-colors duration-300 ${
                      activeSection === item.href.slice(1) ? "text-bronze" : "text-cream"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

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
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-6 flex items-center gap-3 text-[0.75rem] font-medium uppercase tracking-[0.22em] text-bronze"
                >
                  Download Resume
                  <span aria-hidden="true">↗</span>
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
