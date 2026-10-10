"use client";

import { ArrowLink } from "@/components/ui/arrow-link";
import { PillButton } from "@/components/ui/pill-button";
import { ScrollRow } from "@/components/ui/scroll-row";
import { WorkReel } from "@/components/home/work-reel";
import { projects, type Project } from "@/components/home/work-data";
import { trackEvent } from "@/lib/analytics";

/**
 * AI Films — the AI-generated projects, on the light section after Video
 * Editing, as a horizontal ScrollRow of vertical reel cards (muted autoplay
 * loops; the full Reel opens on Instagram). Each reel only loads once it
 * actually scrolls into view, so cards parked off to the right cost nothing.
 */
export function FeaturedWork() {
  return (
    <section id="work" className="relative bg-cream pb-20 pt-20 text-ink sm:pb-28 sm:pt-28 lg:pb-36 lg:pt-36">
      <div className="shell">
        <p className="eyebrow mb-6 flex items-center gap-4">
          <span aria-hidden="true" className="h-px w-11 bg-bronze" />
          AI Films
        </p>
        <h2 className="font-display max-w-3xl text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.03em]">
          Made with AI. <span className="text-bronze">Directed by taste.</span>
        </h2>
        <p className="mt-6 max-w-lg text-[0.98rem] leading-7 text-ink/65 lg:text-lg lg:leading-8">
          Commercials, short films and impossible worlds — generated with AI video tools, then shaped in the edit.
        </p>
      </div>

      <div className="mt-10 sm:mt-14">
        <ScrollRow label="AI film projects" tone="light">
          {projects.map((project) => (
            <AiFilmCard key={project.title} project={project} />
          ))}
        </ScrollRow>
      </div>

      <div className="shell mt-16 flex justify-center sm:mt-24">
        <PillButton href="mailto:momenkazamel@gmail.com?subject=Let's%20Work%20Together">
          Let&apos;s Work Together
        </PillButton>
      </div>
    </section>
  );
}

function AiFilmCard({ project }: { project: Project }) {
  const cardHref = project.reelUrl ?? project.href;

  function trackProjectClick() {
    trackEvent("project_click", {
      project_title: project.title,
      project_category: project.category,
    });
  }

  return (
    <li className="group shrink-0 snap-start w-[min(62vw,15.1875rem)]">
      <WorkReel
        grade={project.grade}
        title={project.title}
        href={cardHref}
        ariaLabel={project.reelUrl ? `Watch the Instagram Reel for ${project.title}` : undefined}
        videoSrc={project.videoSrc}
        posterSrc={project.posterSrc}
        youtubeVideoId={project.youtubeVideoId}
        onNavigate={trackProjectClick}
      />

      <div className="mt-5">
        <p className="eyebrow mb-3 flex items-center gap-4">
          <span aria-hidden="true" className="h-px w-8 bg-bronze" />
          {project.category} · {project.year}
        </p>
        <h3 className="font-display text-[clamp(1.35rem,2vw,1.85rem)] leading-[1.1] tracking-[-0.02em] transition-colors duration-300 group-hover:text-bronze">
          {project.title}
        </h3>
        {project.socialProof ? (
          <p className="mt-2 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-bronze">
            {project.socialProof.value}
            {project.socialProof.suffix} {project.socialProof.label}
          </p>
        ) : null}
        <p className="mt-3 text-[0.9rem] leading-7 text-ink/60">{project.description}</p>
        {project.reelUrl ? (
          <ArrowLink
            href={project.reelUrl}
            external
            onClick={trackProjectClick}
            className="mt-5 border-ink/70 text-ink hover:border-bronze hover:text-bronze"
          >
            {project.reelLinkLabel ?? "Original Instagram Reel"}
          </ArrowLink>
        ) : null}
      </div>
    </li>
  );
}
