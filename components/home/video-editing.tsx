"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { CinemaPlayer } from "@/components/home/cinema-player";
import { editProjects, type EditProject } from "@/components/home/editing-data";
import { easeEditorial } from "@/components/home/hero.motion";

const FPS = 25;

function toSeconds(runtime: string) {
  const [m, s] = runtime.split(":").map(Number);
  return m * 60 + s;
}

function toTimecode(seconds: number) {
  const frames = Math.max(0, Math.floor(seconds * FPS));
  const ff = frames % FPS;
  const ss = Math.floor(frames / FPS) % 60;
  const mm = Math.floor(frames / FPS / 60);
  return [mm, ss, ff].map((n) => String(n).padStart(2, "0")).join(":");
}

/** Piecewise-linear map of v through matching (from[i] → to[i]) points. */
function interpolate(v: number, from: number[], to: number[]) {
  if (from.length === 0) return 0;
  if (v <= from[0]) return to[0];
  for (let i = 1; i < from.length; i++) {
    if (v <= from[i]) {
      const t = (v - from[i - 1]) / (from[i] - from[i - 1] || 1);
      return to[i - 1] + t * (to[i] - to[i - 1]);
    }
  }
  return to[to.length - 1];
}

/** Centre of each segment when segments of these lengths are laid end to end, as 0..1 (or raw if raw). */
function segmentCentres(lengths: number[], normalise: boolean) {
  const sum = lengths.reduce((a, b) => a + b, 0) || 1;
  const centres: number[] = [];
  let acc = 0;
  for (const len of lengths) {
    centres.push(acc + len / 2);
    acc += len;
  }
  return normalise ? centres.map((c) => c / sum) : centres;
}

/**
 * Magnetic stepping: between two card stops the track holds each card centred
 * for the outer 30% of the scroll on either side and glides across the middle
 * 40%, so a cut always settles under the playhead instead of resting half-way.
 */
function settle(p: number, stops: number[]) {
  for (let i = 1; i < stops.length; i++) {
    if (p <= stops[i]) {
      const a = stops[i - 1];
      const b = stops[i];
      const t = Math.min(1, Math.max(0, ((p - a) / (b - a || 1) - 0.3) / 0.4));
      return a + t * t * (3 - 2 * t) * (b - a);
    }
  }
  return p;
}

// Deterministic "audio waveform" for the A1 lane, so it never changes between renders.
const WAVE = Array.from({ length: 140 }, (_, i) => {
  const v = Math.abs(Math.sin(i * 1.7) * 0.6 + Math.sin(i * 0.37) * 0.4);
  // Rounded so server and client render identical SVG attributes.
  return Math.round((0.2 + v * 0.8) * 100) / 100;
});

/**
 * The editing reel as an edit timeline. The section pins while you scroll,
 * and the page scroll scrubs the cuts sideways under a fixed playhead, like
 * dragging the playhead in Premiere. The clip under the playhead lights up
 * and its details sit beneath it; a V1/A1 mini timeline at the bottom shows
 * where you are and jumps to any cut. Only poster images load here; the
 * actual video loads when someone presses play (CinemaPlayer).
 */
export function VideoEditing() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const total = editProjects.length;

  return (
    <section
      id="editing"
      aria-labelledby="editing-title"
      className="relative isolate bg-charcoal text-cream [overflow-x:clip]"
    >
      <div aria-hidden="true" className="hero-grain pointer-events-none absolute inset-0 opacity-40" />

      <div className="shell relative flex flex-col gap-6 pt-20 sm:pt-28 lg:flex-row lg:items-end lg:justify-between lg:pt-36">
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
            Real footage, edited start to finish: pacing, captions, graphics and sound. Scroll to scrub the
            timeline, press a cut to watch it with sound.
          </p>
        </div>
        <p className="timecode text-[0.7rem] uppercase text-cream/40">
          {String(total).padStart(2, "0")} cuts · 2026
        </p>
      </div>

      <TimelineReel projects={editProjects} onOpen={setOpenIndex} />

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

function TimelineReel({ projects, onOpen }: { projects: EditProject[]; onOpen: (index: number) => void }) {
  const total = projects.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const timecodeRef = useRef<HTMLSpanElement>(null);

  const [active, setActive] = useState(0);
  const [pad, setPad] = useState({ left: 0, right: 0 });
  // Scroll progress at which each card sits centred under the playhead.
  const cardStopsRef = useRef<number[]>([]);
  const maxShiftRef = useRef(0);

  const x = useMotionValue(0);
  const miniPlayhead = useMotionValue("0%");

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.35 });

  const seconds = useMemo(() => projects.map((p) => toSeconds(p.runtime)), [projects]);

  // Mini timeline block widths (by card shape), the centre of each block,
  // and the running edit time at the middle of each cut.
  const blockGrow = useMemo(() => projects.map((p) => (p.format === "portrait" ? 0.75 : 1.6)), [projects]);
  const blockCentres = useMemo(() => segmentCentres(blockGrow, true), [blockGrow]);
  const timeStops = useMemo(() => segmentCentres(seconds, false), [seconds]);

  const apply = useCallback(
    (p: number) => {
      const stops = cardStopsRef.current;
      const settled = stops.length ? settle(p, stops) : p;
      x.set(-settled * maxShiftRef.current);
      if (stops.length) {
        let nearest = 0;
        for (let i = 1; i < stops.length; i++) {
          if (Math.abs(stops[i] - settled) < Math.abs(stops[nearest] - settled)) nearest = i;
        }
        setActive((prev) => (prev === nearest ? prev : nearest));
        miniPlayhead.set(`${interpolate(p, stops, blockCentres) * 100}%`);
        if (timecodeRef.current) {
          timecodeRef.current.textContent = toTimecode(interpolate(p, stops, timeStops));
        }
      }
    },
    [x, miniPlayhead, blockCentres, timeStops],
  );

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    if (cards.length === 0) return;
    const vw = window.innerWidth;
    const first = cards[0].offsetWidth;
    const last = cards[cards.length - 1].offsetWidth;
    const left = vw / 2 - first / 2;
    const right = vw / 2 - last / 2;
    setPad((prev) => (prev.left === left && prev.right === right ? prev : { left, right }));

    const firstCentre = cards[0].offsetLeft + first / 2;
    const lastCentre = cards[cards.length - 1].offsetLeft + last / 2;
    const span = lastCentre - firstCentre || 1;
    maxShiftRef.current = span;
    cardStopsRef.current = cards.map((c) => (c.offsetLeft + c.offsetWidth / 2 - firstCentre) / span);
    apply(progress.get());
  }, [apply, progress]);

  useEffect(() => {
    measure();
    const track = trackRef.current;
    const observer = new ResizeObserver(measure);
    if (track) observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  useMotionValueEvent(progress, "change", apply);

  /** Scroll the page so cut i lands under the playhead. */
  function jumpTo(i: number) {
    const container = containerRef.current;
    const stop = cardStopsRef.current[i];
    if (!container || stop === undefined) return;
    const top = container.getBoundingClientRect().top + window.scrollY;
    const runway = container.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + stop * runway, behavior: "smooth" });
  }

  const current = projects[active];

  return (
    <div ref={containerRef} className="relative mt-10 sm:mt-14" style={{ height: `${total * 48 + 100}svh` }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pb-6 pt-[5.5rem] lg:pt-[6.5rem]">
        {/* Stage: scrubbing track + fixed playhead */}
        <div className="relative">
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-[-1.75rem] left-1/2 z-0 w-px -translate-x-1/2">
            <div className="reel-playhead-line h-full w-full" />
            <span className="timecode reel-playhead-badge absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap px-2 py-1 text-[0.66rem]">
              <span ref={timecodeRef}>00:00:00</span>
            </span>
          </div>

          <motion.ul
            ref={trackRef}
            aria-label="Video editing projects"
            className="reel-track relative z-[1] flex list-none items-center gap-5 sm:gap-8"
            style={{ x, paddingLeft: pad.left, paddingRight: pad.right }}
          >
            {projects.map((project, i) => (
              <ReelCard
                key={project.title}
                project={project}
                index={i}
                total={total}
                isActive={i === active}
                onPress={() => (i === active ? onOpen(i) : jumpTo(i))}
              />
            ))}
          </motion.ul>
        </div>

        {/* Details of the cut under the playhead */}
        <div className="shell relative mt-6 min-h-[8.5rem] sm:mt-8 sm:min-h-[9.5rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.32, ease: easeEditorial }}
              className="grid gap-4 lg:grid-cols-[auto_1fr_auto] lg:items-start lg:gap-10"
            >
              <p className="font-display text-burgundy-metal text-[clamp(2.6rem,5vw,4.2rem)] leading-[0.85]">
                {String(active + 1).padStart(2, "0")}
              </p>
              <div className="min-w-0">
                <p className="eyebrow hero-eyebrow mb-2">
                  {current.category} · {current.year}
                </p>
                <h3 className="font-display text-[clamp(1.35rem,2.2vw,2rem)] leading-[1.1]">{current.title}</h3>
                <p className="mt-2 line-clamp-2 max-w-2xl text-[0.88rem] leading-6 text-cream/60 sm:line-clamp-none">
                  {current.description}
                </p>
                <ul className="timecode mt-3 hidden flex-wrap gap-x-5 gap-y-1 text-[0.64rem] uppercase text-cream/40 sm:flex">
                  {current.roles.map((role) => (
                    <li key={role}>{role}</li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onOpen(active)}
                className="reel-cta timecode inline-flex items-center gap-3 justify-self-start whitespace-nowrap px-4 py-2.5 text-[0.66rem] uppercase lg:self-center lg:px-5 lg:py-3 lg:text-[0.7rem]"
              >
                <svg viewBox="0 0 12 14" aria-hidden="true" className="h-3 w-3 fill-current">
                  <path d="M0 0 L12 7 L0 14 Z" />
                </svg>
                Watch with sound
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mini timeline: V1 clips + A1 waveform, clickable */}
        <div className="shell relative mt-4 sm:mt-6">
          <div className="timecode flex items-stretch gap-3 text-[0.6rem] text-cream/35">
            <div className="flex flex-col justify-between py-[3px]">
              <span>V1</span>
              <span>A1</span>
            </div>
            <div className="relative flex-1">
              <div className="flex h-5 gap-[3px]">
                {projects.map((project, i) => (
                  <button
                    key={project.title}
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-label={`Jump to ${project.title}`}
                    className={`reel-clip ${i === active ? "is-active" : ""}`}
                    style={{ flexGrow: blockGrow[i] }}
                  >
                    <span className="overflow-hidden whitespace-nowrap px-1.5">{String(i + 1).padStart(2, "0")}</span>
                  </button>
                ))}
              </div>
              <svg
                aria-hidden="true"
                viewBox={`0 0 ${WAVE.length * 4} 20`}
                preserveAspectRatio="none"
                className="mt-[3px] h-4 w-full text-cream/20"
              >
                {WAVE.map((h, i) => (
                  <rect key={i} x={i * 4} y={10 - h * 9} width="2" height={h * 18} fill="currentColor" />
                ))}
              </svg>
              <motion.span
                aria-hidden="true"
                className="reel-mini-playhead absolute -bottom-1 -top-1 w-[2px] -translate-x-1/2"
                style={{ left: miniPlayhead }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReelCard({
  project,
  index,
  total,
  isActive,
  onPress,
}: {
  project: EditProject;
  index: number;
  total: number;
  isActive: boolean;
  onPress: () => void;
}) {
  const isPortrait = project.format === "portrait";

  return (
    <li className={`reel-card shrink-0 ${isPortrait ? "reel-card-portrait" : "reel-card-landscape"} ${isActive ? "is-active" : ""}`}>
      <button
        type="button"
        onClick={onPress}
        aria-label={isActive ? `Play ${project.title} with sound` : `Go to ${project.title}`}
        className="edit-frame group relative block h-full w-full overflow-hidden bg-[#111110] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static poster frame */}
        <img
          src={project.posterSrc}
          alt=""
          loading={index < 3 ? "eager" : "lazy"}
          decoding="async"
          className="edit-poster absolute inset-0 h-full w-full object-cover"
        />
        <span aria-hidden="true" className="edit-shade absolute inset-0" />
        <span aria-hidden="true" className="edit-corner left-3 top-3 border-l border-t" />
        <span aria-hidden="true" className="edit-corner right-3 top-3 border-r border-t" />
        <span aria-hidden="true" className="edit-corner bottom-3 left-3 border-b border-l" />
        <span aria-hidden="true" className="edit-corner bottom-3 right-3 border-b border-r" />

        <span aria-hidden="true" className="timecode absolute left-5 top-4 text-[0.66rem] text-cream/80">
          <span className="text-cream">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-cream/35"> / {String(total).padStart(2, "0")}</span>
        </span>
        <span aria-hidden="true" className="timecode absolute right-5 top-4 text-[0.66rem] text-cream/60">
          {isPortrait ? "9:16" : "16:9"} · {project.runtime}
        </span>

        <span aria-hidden="true" className="reel-play absolute bottom-5 left-5 flex items-center gap-3">
          <span className="edit-play flex h-11 w-11 items-center justify-center rounded-full border border-cream/60 sm:h-12 sm:w-12">
            <svg viewBox="0 0 12 14" className="ml-0.5 h-3 w-3 fill-current">
              <path d="M0 0 L12 7 L0 14 Z" />
            </svg>
          </span>
          <span className="timecode hidden text-[0.64rem] uppercase text-cream/75 sm:inline">Play with sound</span>
        </span>
      </button>
    </li>
  );
}
