"use client";

import { ScrollRow } from "@/components/ui/scroll-row";
import { editProjects, type EditProject } from "@/components/home/editing-data";
import { trackEvent } from "@/lib/analytics";

/**
 * Real (non-AI) editing work, first section after the hero. Cards sit in a
 * horizontal ScrollRow; landscape and portrait cuts share one row height on
 * desktop (widths derive from their aspect ratio). Unlike the AI Films cards
 * (muted autoplay loops), these are real players with sound and controls —
 * the point is for a client to actually watch the cut, pacing and audio
 * included.
 */
export function VideoEditing() {
  return (
    <section
      id="editing"
      aria-labelledby="editing-title"
      className="relative isolate overflow-hidden bg-charcoal pb-20 pt-20 text-cream sm:pb-28 sm:pt-28 lg:pb-36 lg:pt-36"
    >
      <div aria-hidden="true" className="hero-grain pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative">
        <div className="shell">
          <p className="eyebrow hero-eyebrow mb-6 flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-11 bg-bronze" />
            Video Editing
          </p>
          <h2
            id="editing-title"
            className="font-display max-w-3xl text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.03em]"
          >
            Cut for rhythm. <span className="text-bronze">Built to hold attention.</span>
          </h2>
          <p className="mt-6 max-w-lg text-[0.98rem] leading-7 text-cream/65 lg:text-lg lg:leading-8">
            Real footage, edited end to end — pacing, captions, graphics and sound. Press play with sound on.
          </p>
        </div>

        <div className="mt-10 sm:mt-14">
          <ScrollRow label="Video editing projects" tone="dark">
            {editProjects.map((project) => (
              <EditCard key={project.title} project={project} />
            ))}
          </ScrollRow>
        </div>
      </div>
    </section>
  );
}

function EditCard({ project }: { project: EditProject }) {
  const isPortrait = project.format === "portrait";

  return (
    <li className={`shrink-0 snap-start ${isPortrait ? "w-[min(62vw,15.1875rem)]" : "w-[min(85vw,48rem)]"}`}>
      <div
        className={`relative overflow-hidden rounded-[6px] bg-[#15120f] shadow-[0_20px_50px_rgba(0,0,0,0.35)] ring-1 ring-cream/10 ${
          isPortrait ? "aspect-[9/16]" : "aspect-video"
        }`}
      >
        <video
          controls
          playsInline
          preload="none"
          poster={project.posterSrc}
          aria-label={`${project.title} — ${project.category.toLowerCase()} edit`}
          className="absolute inset-0 h-full w-full object-cover"
          onPlay={() =>
            trackEvent("editing_video_play", {
              project_title: project.title,
              project_category: project.category,
            })
          }
        >
          <source src={project.videoSrc} type="video/mp4" />
        </video>
      </div>

      <div className="mt-5">
        <p className="eyebrow hero-eyebrow mb-3 flex items-center gap-4">
          <span aria-hidden="true" className="h-px w-8 bg-bronze" />
          {project.category} · {project.year}
        </p>
        <h3 className="font-display text-[clamp(1.35rem,2vw,1.85rem)] leading-[1.1] tracking-[-0.02em]">
          {project.title}
        </h3>
        <p className="mt-3 text-[0.9rem] leading-7 text-cream/60">{project.description}</p>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-cream/45">
          {project.roles.map((role) => (
            <li key={role}>{role}</li>
          ))}
        </ul>
      </div>
    </li>
  );
}
