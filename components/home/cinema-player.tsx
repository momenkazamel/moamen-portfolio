"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { EditProject } from "@/components/home/editing-data";
import { easeEditorial } from "@/components/home/hero.motion";
import { trackEvent } from "@/lib/analytics";

const FPS = 25;

/** Seconds → editor timecode mm:ss:ff (25 fps). */
function toTimecode(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const totalFrames = Math.floor(seconds * FPS);
  const ff = totalFrames % FPS;
  const ss = Math.floor(totalFrames / FPS) % 60;
  const mm = Math.floor(totalFrames / FPS / 60);
  return [mm, ss, ff].map((n) => String(n).padStart(2, "0")).join(":");
}

type CinemaPlayerProps = {
  projects: EditProject[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

/**
 * Full-screen "screening room" for the editing reel. Dark room, the cut
 * centred and playing with sound, and our own controls instead of the
 * browser's: play/pause, a thin scrub bar with a red playhead, a running
 * timecode, mute and fullscreen. Keyboard: Space/K play, ←/→ previous/next
 * cut, M mute, F fullscreen, Esc close.
 */
export function CinemaPlayer({ projects, index, onIndexChange, onClose }: CinemaPlayerProps) {
  const project = projects[index];
  const total = projects.length;
  const isPortrait = project.format === "portrait";
  const prefersReducedMotion = useReducedMotion();

  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrubbingRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [idle, setIdle] = useState(false);

  const go = useCallback(
    (step: 1 | -1) => onIndexChange((index + step + total) % total),
    [index, total, onIndexChange],
  );

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void stage.requestFullscreen?.();
  }, []);

  // Lock page scroll and hand focus to the dialog; restore both on close.
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, []);

  // New cut → reset the readouts (the <video> remounts via key).
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- reset readouts when the cut changes */
    setTime(0);
    setDuration(0);
    setBuffered(0);
    /* eslint-enable react-hooks/set-state-in-effect */
    trackEvent("editing_video_play", { project_title: project.title, project_category: project.category });
  }, [project.title, project.category]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      else if (event.key === " " || event.key.toLowerCase() === "k") {
        event.preventDefault();
        togglePlay();
      } else if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
      else if (event.key.toLowerCase() === "m") toggleMute();
      else if (event.key.toLowerCase() === "f") toggleFullscreen();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, togglePlay, go, toggleMute, toggleFullscreen]);

  // Controls fade out after 2.5s without the pointer moving, while playing.
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setIdle(true), 2500);
    return () => window.clearTimeout(timer);
  }, [playing, idle, time]);

  function wake() {
    if (idle) setIdle(false);
  }

  function seekFromPointer(event: ReactPointerEvent<HTMLDivElement>) {
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    video.currentTime = ratio * duration;
    setTime(video.currentTime);
  }

  const progress = duration ? (time / duration) * 100 : 0;
  const bufferedPct = duration ? (buffered / duration) * 100 : 0;
  const number = String(index + 1).padStart(2, "0");

  const frameSize = isPortrait
    ? "h-[min(72svh,calc(92vw*16/9))] aspect-[9/16]"
    : "w-[min(92vw,calc(72svh*16/9),76rem)] aspect-video";

  const fadeControls = idle ? "opacity-0" : "opacity-100";

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title}, video player`}
      className={`fixed inset-0 z-[80] flex flex-col bg-[#060606] text-cream ${idle ? "cursor-none" : ""}`}
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: easeEditorial }}
      onPointerMove={wake}
    >
      <div aria-hidden="true" className="hero-grain pointer-events-none absolute inset-0 opacity-30" />

      {/* Top bar */}
      <div
        className={`shell relative flex items-start justify-between gap-6 pt-[calc(1.25rem+env(safe-area-inset-top))] transition-opacity duration-500 ${fadeControls}`}
      >
        <div className="min-w-0">
          <p className="timecode flex items-center gap-3 text-[0.68rem] uppercase text-cream/50">
            <span className="rec-lamp" aria-hidden="true" />
            <span className="text-cream">{number}</span> / {String(total).padStart(2, "0")} · {project.category}
          </p>
          <h2 className="font-display mt-2 truncate text-[clamp(1.4rem,2.6vw,2.2rem)] leading-tight">{project.title}</h2>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="timecode flex shrink-0 items-center gap-3 border border-cream/25 px-4 py-2.5 text-[0.68rem] uppercase text-cream/80 transition-colors duration-300 hover:border-signal hover:text-signal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
        >
          Close <span aria-hidden="true">✕</span>
        </button>
      </div>

      {/* Stage */}
      <div className="relative flex flex-1 items-center justify-center px-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous cut"
          className={`cinema-nav left-4 hidden lg:flex xl:left-10 ${fadeControls}`}
        >
          <span aria-hidden="true">←</span>
        </button>

        <motion.div
          key={project.videoSrc}
          ref={stageRef}
          className={`relative max-w-full bg-black ${frameSize}`}
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: easeEditorial }}
        >
          <video
            ref={videoRef}
            key={project.videoSrc}
            src={project.videoSrc}
            poster={project.posterSrc}
            autoPlay
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-contain"
            onClick={togglePlay}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onLoadedMetadata={(event) => {
              setDuration(event.currentTarget.duration);
              event.currentTarget.muted = muted;
            }}
            onTimeUpdate={(event) => {
              if (!scrubbingRef.current) setTime(event.currentTarget.currentTime);
            }}
            onProgress={(event) => {
              const ranges = event.currentTarget.buffered;
              if (ranges.length) setBuffered(ranges.end(ranges.length - 1));
            }}
          />
          {!playing ? (
            <button
              type="button"
              onClick={togglePlay}
              aria-label="Play"
              className="absolute inset-0 flex items-center justify-center bg-black/25"
            >
              <span className="edit-play flex h-16 w-16 items-center justify-center rounded-full border border-cream/70 sm:h-20 sm:w-20">
                <svg viewBox="0 0 12 14" className="ml-1 h-4 w-4 fill-current">
                  <path d="M0 0 L12 7 L0 14 Z" />
                </svg>
              </span>
            </button>
          ) : null}
        </motion.div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next cut"
          className={`cinema-nav right-4 hidden lg:flex xl:right-10 ${fadeControls}`}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Transport */}
      <div
        className={`shell relative pb-[calc(1.5rem+env(safe-area-inset-bottom))] transition-opacity duration-500 ${fadeControls}`}
      >
        <div
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(time)}
          aria-valuetext={toTimecode(time)}
          className="group/scrub relative flex h-6 cursor-pointer touch-none items-center"
          onPointerDown={(event) => {
            scrubbingRef.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            seekFromPointer(event);
          }}
          onPointerMove={(event) => {
            if (scrubbingRef.current) seekFromPointer(event);
          }}
          onPointerUp={() => {
            scrubbingRef.current = false;
          }}
        >
          <div className="relative h-px w-full bg-cream/15 transition-[height] duration-200 group-hover/scrub:h-[3px]">
            <div className="absolute inset-y-0 left-0 bg-cream/25" style={{ width: `${bufferedPct}%` }} />
            <div className="absolute inset-y-0 left-0 bg-signal" style={{ width: `${progress}%` }} />
          </div>
          <span
            aria-hidden="true"
            className="absolute top-1/2 h-4 w-[2px] -translate-y-1/2 bg-signal shadow-[0_0_10px_rgba(var(--signal-rgb),0.7)]"
            style={{ left: `calc(${progress}% - 1px)` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
              className="cinema-ctl"
            >
              {playing ? (
                <svg viewBox="0 0 12 14" className="h-3.5 w-3.5 fill-current">
                  <rect x="1" y="0" width="3" height="14" />
                  <rect x="8" y="0" width="3" height="14" />
                </svg>
              ) : (
                <svg viewBox="0 0 12 14" className="ml-0.5 h-3.5 w-3.5 fill-current">
                  <path d="M0 0 L12 7 L0 14 Z" />
                </svg>
              )}
            </button>
            <p className="timecode text-[0.75rem] text-cream/50">
              <span className="text-cream">{toTimecode(time)}</span>
              <span className="mx-2 text-cream/25">/</span>
              {toTimecode(duration)}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button type="button" onClick={() => go(-1)} aria-label="Previous cut" className="cinema-ctl lg:hidden">
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next cut" className="cinema-ctl lg:hidden">
              <span aria-hidden="true">→</span>
            </button>
            <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} className="cinema-ctl timecode whitespace-nowrap text-[0.66rem] uppercase">
              {muted ? "Sound off" : "Sound on"}
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="Fullscreen"
              className="cinema-ctl hidden sm:flex"
            >
              <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>,
    document.body,
  );
}
