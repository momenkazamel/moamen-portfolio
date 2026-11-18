"use client";

import { useState } from "react";
import { ScrollRow } from "@/components/ui/scroll-row";
import { CinemaPlayer } from "@/components/home/cinema-player";
import { editProjects, type EditProject } from "@/components/home/editing-data";

/**
 * Real (non-AI) editing work, first section after the hero. Cards are quiet
 * poster frames (no browser controls); pressing one opens the CinemaPlayer,
 * a full-screen screening room with its own timecode and scrub bar, where the
 * cut plays with sound.
 */
export function VideoEditing() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const total = editProjects.length;

  return (
    <section
      id="editing"
      aria-labelledby="editing-title"
      className="relative isolate overflow-hidden bg-charcoal pb-20 pt-20 text-cream sm:pb-28 sm:pt-28 lg:pb-36 lg:pt-36"
    >
      <div aria-hidden="true" className="hero-grain pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative">
        <div className="shell flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow hero-eyebrow mb-6 flex items-center gap-4">
              <span aria-hidden="true" className="h-px w-11 bg-signal" />
              Reel 01 · Editing
            </p>
            <h2
              id="editing-title"
              className="font-display max-w-3xl text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.005em]"
            >
              Recent edits.
            </h2>
            <p className="mt-6 max-w-lg text-[0.98rem] leading-7 text-cream/65 lg:text-lg lg:leading-8">
              Real footage, edited start to finish: pacing, captions, graphics and sound. Turn the sound on.
            </p>
          </div>
          <p className="timecode text-[0.7rem] uppercase text-cream/40">
            {String(total).padStart(2, "0")} cuts · 2026
          </p>
        </div>

        <div className="mt-10 sm:mt-14">
          <ScrollRow label="Video editing projects" tone="dark">
            {editProjects.map((project, index) => (
              <EditCard
                key={project.title}
                project={project}
                index={index}
                total={total}
                onOpen={() => setOpenIndex(index)}
              />
            ))}
          </ScrollRow>
        </div>
      </div>

      {openIndex !== null ? (
        <CinemaPlayer
          projects={editProjects}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      ) : null}
    </section>
  );
}

function EditCard({
  project,
  index,
  total,
  onOpen,
}: {
  project: EditProject;
  index: number;
  total: number;
  onOpen: () => void;
}) {
  const isPortrait = project.format === "portrait";
  const number = String(index + 1).padStart(2, "0");

  return (
    <li className={`group shrink-0 snap-start ${isPortrait ? "w-[min(62vw,15.1875rem)]" : "w-[min(85vw,48rem)]"}`}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Play ${project.title}, ${project.category.toLowerCase()} edit`}
        className={`edit-frame relative block w-full overflow-hidden bg-[#111110] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal ${
          isPortrait ? "aspect-[9/16]" : "aspect-video"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static poster frame */}
        <img
          src={project.posterSrc}
          alt=""
          loading="lazy"
          decoding="async"
          className="edit-poster absolute inset-0 h-full w-full object-cover"
        />
        <span aria-hidden="true" className="edit-shade absolute inset-0" />

        {/* Slate corner marks */}
        <span aria-hidden="true" className="edit-corner left-3 top-3 border-l border-t" />
        <span aria-hidden="true" className="edit-corner right-3 top-3 border-r border-t" />
        <span aria-hidden="true" className="edit-corner bottom-3 left-3 border-b border-l" />
        <span aria-hidden="true" className="edit-corner bottom-3 right-3 border-b border-r" />

        <span
          aria-hidden="true"
          className="timecode absolute left-6 top-5 flex items-center gap-2 text-[0.68rem] text-cream/80"
        >
          <span className="text-cream">{number}</span>
          <span className="text-cream/35">/ {String(total).padStart(2, "0")}</span>
        </span>
        <span aria-hidden="true" className="timecode absolute right-6 top-5 text-[0.68rem] text-cream/60">
          {isPortrait ? "9:16" : "16:9"} · {project.runtime}
        </span>

        <span aria-hidden="true" className="absolute bottom-6 left-6 flex items-center gap-4">
          <span className="edit-play flex h-12 w-12 items-center justify-center rounded-full border border-cream/60 sm:h-14 sm:w-14">
            <svg viewBox="0 0 12 14" className="ml-0.5 h-3.5 w-3.5 fill-current">
              <path d="M0 0 L12 7 L0 14 Z" />
            </svg>
          </span>
          <span className="timecode hidden text-[0.66rem] uppercase text-cream/75 sm:inline">Play with sound</span>
        </span>

        {/* Playhead line that runs across on hover */}
        <span aria-hidden="true" className="edit-playhead absolute inset-x-0 bottom-0 h-[2px]" />
      </button>

      <div className="mt-5">
        <p className="eyebrow hero-eyebrow mb-3 flex items-center gap-4">
          <span aria-hidden="true" className="h-px w-8 bg-signal" />
          {project.category} · {project.year}
        </p>
        <h3 className="font-display text-[clamp(1.35rem,2vw,1.85rem)] leading-[1.1] tracking-[-0.005em] transition-colors duration-300 group-hover:text-signal">
          {project.title}
        </h3>
        <p className="mt-3 max-w-xl text-[0.9rem] leading-7 text-cream/60">{project.description}</p>
        <ul className="timecode mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.64rem] uppercase text-cream/40">
          {project.roles.map((role) => (
            <li key={role}>{role}</li>
          ))}
        </ul>
      </div>
    </li>
  );
}
