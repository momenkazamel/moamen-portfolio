import { ArrowLink } from "@/components/ui/arrow-link";

const TOOL_CATEGORIES = [
  { label: "Edit", tools: "Premiere Pro" },
  { label: "Motion", tools: "After Effects · Photoshop" },
  { label: "Delivery", tools: "YouTube · Reels · TikTok · Ads" },
];

const EMAIL = "momenkazamel@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/moamen-kazamel-352144346/";
const WHATSAPP_URL = "https://wa.me/201010431278";
const RESUME_URL = "/documents/Moamen_Kazamel_CV.pdf";

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

            <div className="mt-8">
              <p className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-cream/40">Contact</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2">
                <ArrowLink
                  href={`mailto:${EMAIL}`}
                  external
                  className="border-cream/70 pt-2 text-cream hover:border-signal hover:text-signal lg:pt-0"
                >
                  Email
                </ArrowLink>
                <ArrowLink
                  href={LINKEDIN_URL}
                  external
                  className="border-cream/70 pt-2 text-cream hover:border-signal hover:text-signal lg:pt-0"
                >
                  LinkedIn
                </ArrowLink>
                <ArrowLink
                  href={RESUME_URL}
                  external
                  className="border-cream/70 pt-2 text-cream hover:border-signal hover:text-signal lg:pt-0"
                >
                  Resume
                </ArrowLink>
                <ArrowLink
                  href={WHATSAPP_URL}
                  external
                  className="border-cream/70 pt-2 text-cream hover:border-signal hover:text-signal lg:pt-0"
                >
                  WhatsApp
                </ArrowLink>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 h-px w-full bg-cream/10 lg:mt-20" />

        <p className="mt-10 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-cream/35">
          © 2026 Moamen Kazamel
        </p>
      </div>
    </footer>
  );
}
