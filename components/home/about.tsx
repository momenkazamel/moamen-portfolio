/**
 * Calm, cinematic transition between the playful "Kids Universe" showcase
 * and the more technical "Creative Stack" breakdown. Full-bleed environment
 * photo anchored toward the right (overshooting past the right edge so the
 * left stays clean negative space), with a lighter dark-to-transparent
 * gradient over it (left to right) than a typical hero scrim — the image
 * should read as recognizable atmosphere, not disappear entirely.
 *
 * BACKGROUND: /public/images/about-background.png is the real photo
 * (the workspace/editing-suite shot). The CSS gradient beneath it is a
 * fallback in case the file is ever removed — with the real photo in
 * place, it's fully covered and invisible.
 */
export function About() {
  return (
    <section id="about" className="relative isolate overflow-hidden bg-charcoal text-cream">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_65%_60%_at_78%_55%,rgba(198,140,86,0.22),transparent_60%),linear-gradient(120deg,#171310_0%,#0d0b09_55%,#080706_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -inset-2 bg-cover bg-no-repeat blur-[3px]"
        style={{ backgroundImage: 'url("/images/about-background.png")', backgroundPosition: "120% center" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(15,15,15,.64) 0%, rgba(15,15,15,.57) 35%, rgba(15,15,15,.32) 65%, rgba(15,15,15,.1) 100%)",
        }}
      />

      <div className="shell relative grid min-h-[85vh] content-center py-24 lg:grid-cols-2 lg:pb-0 lg:pt-16">
        <div className="lg:max-w-md">
          <p
            className="eyebrow hero-eyebrow mb-6 flex items-center gap-4"
            style={{ letterSpacing: "0.28em", fontWeight: 400 }}
          >
            <span aria-hidden="true" className="h-px w-11 bg-bronze" />
            About
          </p>

          <h2 className="font-display max-w-lg text-[clamp(1.9rem,3.75vw,3.2rem)] leading-[1.05] tracking-[-0.03em]">
            Stories before technology.
          </h2>

          <p className="mt-6 max-w-[30rem] text-[0.98rem] leading-7 text-cream/65 lg:text-lg lg:leading-8">
            I&apos;m Moamen Kazamel, an AI Creative Director creating cinematic campaigns, AI films, and digital
            worlds where technology serves the story—not the other way around.
          </p>

          <div className="mt-10 flex flex-col gap-2">
            <p className="text-[0.68rem] font-normal uppercase tracking-[0.22em] text-cream/50">AI Creative Director</p>
            <p className="text-[0.68rem] font-normal uppercase tracking-[0.22em] text-cream/50">AiBrush Studio</p>
          </div>
        </div>
      </div>
    </section>
  );
}
