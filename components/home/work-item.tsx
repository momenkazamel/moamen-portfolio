"use client";

import { motion } from "framer-motion";
import { ArrowLink } from "@/components/ui/arrow-link";
import { WorkReel } from "@/components/home/work-reel";
import { fadeUp, easeEditorial } from "@/components/home/hero.motion";
import type { Project } from "@/components/home/work-data";

type WorkItemProps = {
  project: Project;
  index: number;
};

/** One row of the Featured Work list: vertical reel card + case-study meta, alternating sides. */
export function WorkItem({ project, index }: WorkItemProps) {
  const reversed = index % 2 === 0;
  // Once a project has a confirmed real Reel, the video card itself opens
  // that Reel directly. Projects without one keep linking the card to the
  // case-study placeholder.
  const cardHref = project.reelUrl ?? project.href;
  const cardAriaLabel = project.reelUrl
    ? `Watch the Instagram Reel for ${project.title}`
    : `Open the case study for ${project.title}`;

  return (
    <motion.li
      className="group py-12 transition-colors duration-500 hover:bg-ink/[0.02] lg:py-16"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, ease: easeEditorial }}
    >
      <div className="shell grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-x-10 xl:gap-x-14">
        <div className={`lg:col-span-4 ${reversed ? "lg:order-2" : "lg:order-1"}`}>
          <WorkReel
            grade={project.grade}
            title={project.title}
            href={cardHref}
            ariaLabel={cardAriaLabel}
            videoSrc={project.videoSrc}
            posterSrc={project.posterSrc}
            youtubeVideoId={project.youtubeVideoId}
          />
        </div>

        <div className={`relative lg:col-span-8 ${reversed ? "lg:order-1" : "lg:order-2"}`}>
          <span
            aria-hidden="true"
            className="work-index pointer-events-none absolute -top-9 left-0 -z-10 hidden select-none lg:block"
          >
            {String(index).padStart(2, "0")}
          </span>

          <p className="eyebrow mb-4 flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-8 bg-bronze" />
            {project.category} · {project.year}
          </p>

          <h3 className="font-display text-[clamp(1.85rem,2.6vw,2.6rem)] leading-[1.05] tracking-[-0.02em] transition-colors duration-300 group-hover:text-bronze">
            {project.title}
          </h3>

          <p className="mt-5 max-w-sm text-[0.95rem] leading-7 text-ink/65">{project.description}</p>

          {project.socialProof ? (
            <div className="mb-3 mt-10">
              <p className="font-display text-[1.85rem] leading-none tracking-[-0.02em] text-bronze">
                {project.socialProof.value}
                {project.socialProof.suffix}
              </p>
              <p className="mt-2 text-[0.62rem] font-medium uppercase tracking-[0.26em] text-ink/45">
                {project.socialProof.label}
              </p>
            </div>
          ) : null}

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-ink/45">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>

          {project.reelUrl ? (
            <ArrowLink
              href={project.reelUrl}
              external
              className="mt-8 border-ink/70 text-ink hover:border-bronze hover:text-bronze"
            >
              {project.reelLinkLabel ?? "Original Instagram Reel"}
            </ArrowLink>
          ) : project.reelHref ? (
            <ArrowLink
              href={project.reelHref}
              external
              className="mt-8 border-ink/70 text-ink hover:border-bronze hover:text-bronze"
            >
              Watch Reel
            </ArrowLink>
          ) : null}
        </div>
      </div>
    </motion.li>
  );
}
