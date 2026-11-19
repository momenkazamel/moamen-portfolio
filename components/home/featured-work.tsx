"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { projects, type Project } from "@/components/home/work-data";
import { CinemaPlayer } from "@/components/home/cinema-player";
import type { EditProject } from "@/components/home/editing-data";
import { easeEditorial } from "@/components/home/hero.motion";
import { trackEvent } from "@/lib/analytics";

const STEPS = 30;
/** Share of each film's scroll segment spent "denoising"; the rest it plays clean. */
const DENOISE = 0.5;

/**
 * AI Films as a generation queue. The section pins and the scroll runs the
 * pipeline the way the work is actually made: a brief, then the frame
 * resolving out of noise step by step (blur and grain falling away with a
 * step counter), then the clean cut playing. Each film is one job in the
 * queue strip (done / rendering / queued), and any job can be jumped to.
 * Only the active film's short loop loads; the rest show posters.
 */
export function FeaturedWork() {
  const total = projects.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLSpanElement>(null);
  const briefRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  const [active, setActive] = useState(0);
  // True once the active film has fully "generated"; the play button shows then.
  const [ready, setReady] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // The AI loops in the screening-room player's shape (vertical, silent).
  const playable = useMemo<EditProject[]>(
    () =>
      projects
        .filter((p) => p.videoSrc)
        .map((p) => ({
          title: p.title,
          category: p.category,
          year: p.year,
          description: p.description,
          roles: p.tags,
          format: "portrait",
          runtime: "00:20",
          videoSrc: p.videoSrc as string,
          posterSrc: p.posterSrc ?? "",
        })),
    [],
  );
  const noise = useMotionValue(1);
  const blur = useTransform(noise, (n) => `blur(${(n * 22).toFixed(1)}px) saturate(${(1 - n * 0.7).toFixed(2)})`);
  const grainOpacity = useTransform(noise, (n) => n * 0.95);
  const scanY = useTransform(noise, (n) => `${(1 - n) * 100}%`);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.35 });

  const apply = useCallback(
    (p: number) => {
      const position = Math.min(total - 1e-6, Math.max(0, p * total));
      const index = Math.floor(position);
      const local = position - index;
      const denoise = Math.min(1, local / DENOISE);
      setActive((prev) => (prev === index ? prev : index));
      setReady((prev) => (prev === denoise >= 0.999 ? prev : denoise >= 0.999));
      noise.set(1 - denoise);

      const step = Math.round(denoise * STEPS);
      if (stepRef.current) stepRef.current.textContent = String(step).padStart(2, "0");
      if (pctRef.current) pctRef.current.textContent = `${Math.round(denoise * 100)}%`;
      if (briefRef.current) {
        const brief = projects[index].description;
        const chars = Math.round(Math.min(1, local / (DENOISE * 0.8)) * brief.length);
        briefRef.current.textContent = brief.slice(0, chars);
      }
    },
    [total, noise],
  );

  useMotionValueEvent(progress, "change", apply);

  function jumpTo(i: number) {
    const container = containerRef.current;
    if (!container) return;
    const top = container.getBoundingClientRect().top + window.scrollY;
    const runway = container.offsetHeight - window.innerHeight;
    // Land just after the film's denoise so it shows clean.
    window.scrollTo({ top: top + ((i + DENOISE + 0.05) / total) * runway, behavior: "smooth" });
  }

  const project = projects[active];

  return (
    <section id="work" className="relative bg-cream text-ink [overflow-x:clip]">
      <div className="shell flex flex-col gap-6 pt-20 sm:pt-28 lg:flex-row lg:items-end lg:justify-between lg:pt-36">
        <div>
          <p className="eyebrow mb-6 flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-11 bg-signal" />
            Reel 03 · Side work
          </p>
          <h2 className="font-display max-w-3xl text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.005em]">
            AI films.
          </h2>
          <p className="mt-6 max-w-lg text-[0.98rem] leading-7 text-ink/65 lg:text-lg lg:leading-8">
            Personal shorts where the footage is generated and the story, pacing and sound are edited by hand.
            Scroll to run the queue.
          </p>
        </div>
        <p className="timecode text-[0.7rem] uppercase text-ink/45">Kling · Google Flow · Seedance</p>
      </div>

      <div ref={containerRef} className="relative mt-10 sm:mt-14" style={{ height: `${total * 75 + 100}svh` }}>
        <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pb-6 pt-[5.5rem] lg:pt-[6.5rem]">
          <div className="shell grid items-center gap-5 sm:gap-8 lg:grid-cols-[auto_1fr] lg:gap-16">
            {/* Render frame */}
            <div className="gen-frame relative mx-auto aspect-[9/16] h-[min(36svh,26rem)] overflow-hidden bg-[#141312] lg:mx-0 lg:h-[min(64svh,36rem)]">
              <motion.div className="absolute inset-0" style={{ filter: blur }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- poster under the loop */}
                <img
                  key={`p-${project.posterSrc}`}
                  src={project.posterSrc}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {project.videoSrc ? (
                  <video
                    key={project.videoSrc}
                    src={project.videoSrc}
                    poster={project.posterSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null}
              </motion.div>
              <motion.div aria-hidden="true" className="gen-noise absolute inset-0" style={{ opacity: grainOpacity }} />
              <motion.div aria-hidden="true" className="gen-scan absolute inset-x-0 h-px" style={{ top: scanY, opacity: grainOpacity }} />

              <AnimatePresence>
                {ready ? (
                  <motion.button
                    key="play"
                    type="button"
                    onClick={() => {
                      const i = playable.findIndex((p) => p.title === project.title);
                      if (i >= 0) setOpenIndex(i);
                    }}
                    aria-label={`Play ${project.title}`}
                    className="group absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.45, ease: easeEditorial }}
                  >
                    <span className="edit-play flex h-16 w-16 items-center justify-center rounded-full border border-cream/70">
                      <svg viewBox="0 0 12 14" aria-hidden="true" className="ml-1 h-4 w-4 fill-current">
                        <path d="M0 0 L12 7 L0 14 Z" />
                      </svg>
                    </span>
                  </motion.button>
                ) : null}
              </AnimatePresence>

              <div className="timecode pointer-events-none absolute inset-x-3 top-3 flex justify-between text-[0.62rem] uppercase text-cream/85">
                <span>
                  Step <span ref={stepRef}>00</span>/{STEPS}
                </span>
                <span>9:16</span>
              </div>
              <div className="timecode pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between text-[0.62rem] uppercase text-cream/85">
                <span className="flex items-center gap-2">
                  <span className="rec-lamp" aria-hidden="true" /> Job {String(active + 1).padStart(2, "0")}
                </span>
                <span ref={pctRef}>0%</span>
              </div>
            </div>

            {/* Job sheet */}
            <div className="min-w-0">
              <div className="gen-brief timecode min-h-[4.75rem] p-4 text-[0.74rem] leading-6 text-ink/75 sm:min-h-[6rem] sm:p-5 sm:text-[0.8rem]">
                <span className="mr-2 text-signal">brief &gt;</span>
                <span ref={briefRef} />
                <span aria-hidden="true" className="gen-caret" />
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.32, ease: easeEditorial }}
                  className="mt-5 sm:mt-7"
                >
                  <p className="eyebrow mb-2">
                    {project.category} · {project.year}
                  </p>
                  <h3 className="font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.02]">{project.title}</h3>
                  <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                    {project.socialProof ? (
                      <p className="timecode text-[0.7rem] uppercase text-signal">
                        {project.socialProof.value}
                        {project.socialProof.suffix} {project.socialProof.label}
                      </p>
                    ) : null}
                    <p className="timecode text-[0.66rem] uppercase text-ink/45">{project.tags.join(" · ")}</p>
                  </div>
                  {project.reelUrl ? <WatchLink project={project} /> : null}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Queue */}
          <div className="shell mt-6 sm:mt-10">
            <ol className="grid grid-cols-7 gap-1.5 sm:gap-3" aria-label="AI film queue">
              {projects.map((item, i) => {
                const state = i < active ? "done" : i === active ? "rendering" : "queued";
                return (
                  <li key={item.title}>
                    <button
                      type="button"
                      onClick={() => jumpTo(i)}
                      aria-label={`Go to ${item.title}`}
                      className={`gen-job group w-full text-left gen-job-${state}`}
                    >
                      <span className="relative block h-12 overflow-hidden bg-ink/10 sm:h-16 lg:h-[4.5rem]">
                        {/* eslint-disable-next-line @next/next/no-img-element -- small queue thumbnail */}
                        <img src={item.posterSrc} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                      </span>
                      <span className="timecode mt-1.5 hidden justify-between text-[0.58rem] uppercase sm:flex">
                        <span>{String(i + 1).padStart(2, "0")}</span>
                        <span className="gen-job-state">{state === "done" ? "Done" : state === "rendering" ? "Live" : "Queued"}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>

      {openIndex !== null ? (
        <CinemaPlayer
          projects={playable}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
          silent
        />
      ) : null}
    </section>
  );
}

function WatchLink({ project }: { project: Project }) {
  return (
    <a
      href={project.reelUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("project_click", { project_title: project.title, project_category: project.category })}
      className="gen-watch timecode mt-6 inline-flex items-center gap-3 px-4 py-2.5 text-[0.68rem] uppercase sm:mt-8"
    >
      Watch on Instagram <span aria-hidden="true">↗</span>
    </a>
  );
}
