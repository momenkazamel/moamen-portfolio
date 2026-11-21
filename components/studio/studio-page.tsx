"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MonogramMark } from "@/components/ui/monogram-mark";
import { easeEditorial } from "@/components/home/hero.motion";
import { trackEvent } from "@/lib/analytics";

const HANDLE = "@mk.studio.creative";

/** The four MK Studio social accounts. */
const SOCIALS = [
  { label: "Instagram", value: HANDLE, href: "https://www.instagram.com/mk.studio.creative/reels/" },
  { label: "TikTok", value: HANDLE, href: "https://www.tiktok.com/@mk.studio.creative" },
  { label: "Facebook", value: "MK Studio", href: "https://www.facebook.com/profile.php?id=61596304396125" },
  { label: "YouTube", value: "MK Studio", href: "https://www.youtube.com/channel/UCEk7Y9s6b9DxNE6snqK7usQ" },
  { label: "moamenkazamel.com", value: "Portfolio", href: "https://moamenkazamel.com" },
];

const WHATSAPP = "https://wa.me/201010431278?text=";

/** The two ways to hire the studio. Both open WhatsApp with the brief started. */
const SERVICES = [
  {
    kicker: "Build my",
    label: "Website",
    href: `${WHATSAPP}${encodeURIComponent("Hi Moamen, I'd like a portfolio website.")}`,
    event: "studio_website_click",
  },
  {
    kicker: "Edit my",
    label: "Video",
    href: `${WHATSAPP}${encodeURIComponent("Hi Moamen, I'd like you to edit a video for me.")}`,
    event: "studio_edit_click",
  },
];

/**
 * Link-in-bio page: everything fits one screen (100svh), no scroll on a
 * normal phone or desktop. Header → socials → two WhatsApp CTAs → credit
 * line, spaced with flex so the gaps shrink on short screens.
 */
export function StudioPage() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 1 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, delay: reduce ? 0 : delay, ease: easeEditorial },
  });

  return (
    <div className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-charcoal text-cream">
      <div aria-hidden="true" className="hero-vignette pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="hero-grain pointer-events-none absolute inset-0 opacity-40" />
      <MonogramMark className="studio-ghost pointer-events-none absolute -right-[14vw] top-1/2 h-[80svh] w-auto -translate-y-1/2 text-cream lg:-right-[2vw]" />

      <div className="shell relative flex flex-1 flex-col pt-[calc(env(safe-area-inset-top)+5rem)] pb-[calc(1.25rem+env(safe-area-inset-bottom))] lg:pt-[6.5rem] lg:pb-6">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-[clamp(1rem,3svh,2.5rem)]">
          {/* Header */}
          <motion.div {...rise(0.05)}>
            <p className="eyebrow hero-eyebrow flex items-center gap-3">
              <span aria-hidden="true" className="rec-lamp studio-lamp" />
              MK Studio · Cairo
            </p>
            <h1 className="font-display mt-3 text-[clamp(2.9rem,min(12vw,8.5svh),6.5rem)] leading-[0.95] tracking-[-0.02em]">
              MK <span className="text-burgundy-metal studio-metal">Studio.</span>
            </h1>
            <p className="mt-3 max-w-md text-[0.92rem] leading-6 text-cream/55 lg:text-base lg:leading-7">
              Stories from Egypt&apos;s past and ideas worth watching. New episodes every week.
            </p>
          </motion.div>

          {/* Socials */}
          <motion.ul {...rise(0.15)} className="border-t border-cream/10" aria-label="MK Studio social accounts">
            {SOCIALS.map((item, i) => (
              <li key={item.label} className="border-b border-cream/10">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("studio_social_click", { network: item.label, link_url: item.href })}
                  className="contact-row group relative grid grid-cols-[2rem_1fr_auto] items-center gap-3 overflow-hidden py-[clamp(0.5rem,1.35svh,0.9rem)] sm:grid-cols-[2.5rem_15rem_1fr_auto] sm:gap-5"
                >
                  <span aria-hidden="true" className="contact-sweep absolute inset-0" />
                  <span className="timecode relative text-[0.64rem] text-cream/35">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display relative text-[1.4rem] leading-none sm:text-[1.65rem]">{item.label}</span>
                  <span className="timecode relative hidden truncate text-[0.7rem] text-cream/50 sm:block">{item.value}</span>
                  <span
                    aria-hidden="true"
                    className="contact-arrow relative flex h-8 w-8 items-center justify-center rounded-full border border-cream/20 text-[0.8rem]"
                  >
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </motion.ul>

          {/* Hire the studio */}
          <motion.div {...rise(0.25)}>
            <p className="eyebrow hero-eyebrow">Work with the studio</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {SERVICES.map((service) => (
                <a
                  key={service.label}
                  href={service.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent(service.event, { link_url: "https://wa.me/201010431278" })}
                  className="studio-cta group flex items-end justify-between gap-2 border border-[var(--signal-lift)] px-4 py-[clamp(0.75rem,1.8svh,1.1rem)] transition-colors duration-300 hover:bg-[var(--signal-lift)] focus-visible:bg-[var(--signal-lift)] sm:px-6"
                >
                  <span className="flex flex-col gap-1">
                    <span className="text-[0.58rem] font-medium uppercase tracking-[0.22em] text-cream/55 group-hover:text-cream/80">
                      {service.kicker}
                    </span>
                    <span className="font-display text-[1.45rem] leading-none sm:text-[1.8rem]">{service.label}</span>
                  </span>
                  <span aria-hidden="true" className="cta-arrow pb-0.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <a
          href="/mk-studio"
          aria-label="Powered by MK Studio"
          className="group relative mx-auto mt-2 flex items-center gap-3 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-cream/45 transition-colors duration-300 hover:text-cream/70"
        >
          Powered by
          <MonogramMark className="h-6 w-[1.25rem] text-cream/70 transition-colors duration-300 group-hover:text-[var(--signal-lift)]" />
        </a>
      </div>
    </div>
  );
}
