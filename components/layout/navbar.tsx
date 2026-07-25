"use client";

import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
import { MonogramMark } from "@/components/ui/monogram-mark";

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
 */
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

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

  function handleNavClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    smoothScrollToId(href.slice(1));
  }

  const logoTextClass = isScrolled ? "text-ink" : "text-cream";
  const menuButtonClass = isScrolled ? "border-ink/15 text-ink" : "border-cream/40 text-cream";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out ${
        isScrolled
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
                isScrolled ? "text-ink/45" : "text-cream/55"
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

        <details className="group relative lg:hidden">
          <summary
            className={`flex h-10 w-10 cursor-pointer list-none items-center justify-center border text-[0.58rem] uppercase tracking-[0.14em] transition-colors duration-500 marker:content-none [&::-webkit-details-marker]:hidden lg:hidden ${menuButtonClass}`}
          >
            <span className="group-open:hidden">Menu</span>
            <span className="hidden group-open:block">Close</span>
          </summary>
          <nav
            aria-label="Mobile navigation"
            className="absolute right-0 top-12 flex w-56 flex-col border border-ink/15 bg-cream p-5 shadow-[0_18px_45px_rgba(25,23,20,0.12)]"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(event) => handleNavClick(event, item.href)}
                className={`nav-link py-3 ${activeSection === item.href.slice(1) ? "text-bronze" : ""}`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link flex items-center gap-2 border-t border-ink/10 pt-5"
            >
              Download Resume
              <span aria-hidden="true" className="text-[0.6rem]">
                ↗
              </span>
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
