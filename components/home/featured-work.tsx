import { WorkItem } from "@/components/home/work-item";
import { PillButton } from "@/components/ui/pill-button";
import { projects } from "@/components/home/work-data";

/**
 * Editorial project list — large cinematic thumbnails alternating sides,
 * on a light section to contrast the dark hero above it. Rows span full
 * width (for the row hover tint) while their content stays inside `.shell`.
 */
export function FeaturedWork() {
  return (
    <section id="work" className="relative bg-cream pb-20 pt-14 text-ink sm:pb-32 sm:pt-20 lg:pb-72 lg:pt-32">
      <div className="shell pt-10 sm:pt-16 lg:pt-20">
        <div className="max-w-2xl">
          <span aria-hidden="true" className="mb-8 block h-px w-11 bg-bronze" />
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.03em]">
            Work worth a <span className="text-bronze">second look.</span>
          </h2>
        </div>
      </div>

      <ol className="mt-14 list-none divide-y divide-ink/10 border-y border-ink/10 sm:mt-20 lg:mt-24">
        {projects.map((project, i) => (
          <WorkItem key={project.title} project={project} index={i + 1} />
        ))}
      </ol>

      <div className="shell mt-20 flex justify-center sm:mt-32 lg:mt-72">
        <PillButton href="mailto:momenkazamel@gmail.com?subject=Let's%20Work%20Together">
          Let&apos;s Work Together
        </PillButton>
      </div>
    </section>
  );
}
