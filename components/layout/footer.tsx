"use client";

import Link from "next/link";
import { getLeadEvent, trackEvent } from "@/lib/analytics";
import { MonogramMark } from "@/components/ui/monogram-mark";

const TOOL_CATEGORIES = [
  { label: "Edit", tools: "Premiere Pro" },
  { label: "Motion", tools: "After Effects · Photoshop" },
  { label: "AI B-roll", tools: "Kling · Google Flow · Seedance" },
  { label: "Delivery", tools: "YouTube · Reels · TikTok · Ads" },
];

const EMAIL = "momenkazamel@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/moamen-kazamel-352144346/";
const WHATSAPP_URL = "https://wa.me/201010431278";
const RESUME_URL = "/documents/Moamen_Kazamel_CV.pdf";

/** Contact rows, most direct first. */
const CONTACTS = [
  { label: "WhatsApp", value: "+20 101 043 1278", note: "Fastest reply", href: WHATSAPP_URL },
  { label: "Email", value: EMAIL, note: "Briefs & files", href: `mailto:${EMAIL}` },
  { label: "LinkedIn", value: "in/moamen-kazamel", note: "Profile", href: LINKEDIN_URL },
  { label: "Resume", value: "Download PDF", note: "2026", href: RESUME_URL },
];

/**
 * The site's final section — quiet closing chapter rather than a
 * traditional multi-column footer. CTA on the left; the right column
 * stacks "Tools of the craft." (what used to be the standalone "Creative
 * Stack" section, now a single editorial line) above Contact, so Contact —
 * the last interactive thing on the page — sits at the very bottom of the
 * column, after the creative toolkit has been shown. Only a single
 * full-width divider before the closing copyright line. Same dark ground
 * as the hero, hairline dividers instead of any card/border treatment.
 */
export function Footer() {
  return (
    <footer id="contact" className="relative isolate overflow-hidden bg-charcoal text-cream">
      <div aria-hidden="true" className="hero-vignette pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="hero-grain pointer-events-none absolute inset-0 opacity-40" />

      {/* pb adds the home-indicator/gesture-nav safe-area inset on top of
          the existing 5rem/6rem bottom padding — resolves to exactly the
          original value on devices with no inset (env() = 0 there). */}
      <div className="shell relative pt-20 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pt-24 lg:pb-[calc(6rem+env(safe-area-inset-bottom))]">
        <div className="grid gap-16 lg:grid-cols-[3fr_2fr] lg:items-start lg:gap-x-10">
          <div>
            <h2 className="font-display text-[clamp(1.65rem,4.07vw,3.7rem)] leading-[1.1] tracking-[-0.005em]">
              <span className="block">Got footage?</span>
              <span className="block text-burgundy-metal">Send it over.</span>
            </h2>
            <p className="mt-6 max-w-lg text-[0.98rem] leading-7 text-cream/60 lg:text-lg lg:leading-8">
              One-off edits and monthly packages, in Arabic and English. Send a raw clip and you get a
              quote within 24 hours.
            </p>

            <ul className="mt-10 border-t border-cream/10 lg:mt-14" aria-label="Contact">
              {CONTACTS.map((item, i) => (
                <li key={item.label} className="border-b border-cream/10">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      const lead = getLeadEvent(item.href);
                      if (lead) trackEvent(lead.name, lead.params);
                    }}
                    className="contact-row group relative grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 overflow-hidden py-5 sm:grid-cols-[3rem_9rem_1fr_auto] sm:gap-6 sm:py-6"
                  >
                    <span aria-hidden="true" className="contact-sweep absolute inset-0" />
                    <span className="timecode relative text-[0.66rem] text-cream/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display relative text-[1.35rem] leading-none sm:text-[1.6rem]">{item.label}</span>
                    <span className="timecode relative col-start-2 truncate text-[0.72rem] text-cream/55 sm:col-start-auto">
                      {item.value}
                      <span className="ml-3 hidden text-cream/30 xl:inline">· {item.note}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="contact-arrow relative row-span-2 flex h-10 w-10 items-center justify-center self-center rounded-full border border-cream/20 sm:row-span-1"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-[1.15rem] text-cream/55">The suite.</p>
            <div className="mt-5 flex flex-col gap-4">
              {TOOL_CATEGORIES.map((category) => (
                <div key={category.label}>
                  <p className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-cream/35">
                    {category.label}
                  </p>
                  <p className="mt-1.5 text-[0.85rem] text-cream/50">{category.tools}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

        <div className="mt-16 h-px w-full bg-cream/10 lg:mt-20" />

        {/* Copyright on the left, "Powered by MK" centred on the page; on
            phones they stack, both centred. */}
        <div className="mt-10 flex flex-col items-center gap-5 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-cream/35 sm:justify-self-start">
            © 2026 Moamen Shawky Kazamel
          </p>
          <Link
            href="/mk-studio"
            aria-label="Powered by MK Studio"
            className="group flex items-center justify-self-center gap-2.5 text-[0.62rem] font-medium uppercase tracking-[0.22em] text-cream/35 transition-colors duration-300 hover:text-cream/70"
          >
            Powered by
            <MonogramMark className="h-5 w-[1.05rem] text-cream/60 transition-colors duration-300 group-hover:text-[var(--signal-lift)]" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
