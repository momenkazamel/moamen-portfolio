import { ArrowLink } from "@/components/ui/arrow-link";

const TOOL_CATEGORIES = [
  { label: "Video", tools: "Veo 3 · Kling · Runway · Seedance" },
  { label: "Image", tools: "GPT Image · Nano Banana · FLUX" },
  { label: "Audio", tools: "ElevenLabs · Suno" },
  { label: "Editing", tools: "Premiere Pro · CapCut" },
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

      <div className="shell relative py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:items-start lg:gap-x-10">
          <div>
            <h2 className="font-display text-[clamp(1.65rem,4.07vw,3.7rem)] leading-[1.1] tracking-[-0.03em]">
              <span className="block">Let&apos;s create</span>
              <span className="block">something unforgettable.</span>
            </h2>
            <p className="mt-6 max-w-lg text-[0.98rem] leading-7 text-cream/60 lg:text-lg lg:leading-8">
              Available for freelance, commercial, and creative collaborations, worldwide.
            </p>
          </div>

          <div>
            <p className="font-display text-[1.15rem] text-cream/55">Tools of the craft.</p>
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
            <div className="mt-4">
              <p className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-cream/35">Powered by</p>
              <a
                href="https://aibrush.co"
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-1 inline-flex items-baseline gap-2 border-b border-transparent pb-0.5 font-display text-[1.05rem] tracking-[-0.01em] text-bronze transition-[border-color] duration-300 ease-out hover:border-bronze/70"
              >
                AiBrush Studio
                <span
                  aria-hidden="true"
                  className="text-[0.75rem] leading-none transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                >
                  ↗
                </span>
              </a>
            </div>

            <div className="mt-8">
              <p className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-cream/40">Contact</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
                <ArrowLink
                  href={`mailto:${EMAIL}`}
                  external
                  className="border-cream/70 text-cream hover:border-bronze hover:text-bronze"
                >
                  Email
                </ArrowLink>
                <ArrowLink
                  href={LINKEDIN_URL}
                  external
                  className="border-cream/70 text-cream hover:border-bronze hover:text-bronze"
                >
                  LinkedIn
                </ArrowLink>
                <ArrowLink
                  href={RESUME_URL}
                  external
                  className="border-cream/70 text-cream hover:border-bronze hover:text-bronze"
                >
                  Resume
                </ArrowLink>
                <ArrowLink
                  href={WHATSAPP_URL}
                  external
                  className="border-cream/70 text-cream hover:border-bronze hover:text-bronze"
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
