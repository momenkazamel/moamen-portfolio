import { motion, type MotionValue } from "framer-motion";
import { fadeUp, easeEditorial } from "@/components/home/hero.motion";
import { YoutubeCardVideo } from "@/components/ui/youtube-card-video";

type ShowreelPreviewProps = {
  x: MotionValue<number>;
  y: MotionValue<number>;
};

const SHOWREEL_VIDEO_ID = "x-m2T1ubmj4";
const SHOWREEL_URL = `https://www.youtube.com/shorts/${SHOWREEL_VIDEO_ID}`;

/** The muted, autoplaying "showreel" video-frame beside the headline. */
export function ShowreelPreview({ x, y }: ShowreelPreviewProps) {
  return (
    <motion.figure
      id="showreel"
      className="group relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none lg:self-center xl:col-span-4"
      variants={fadeUp}
      transition={{ duration: 1, ease: easeEditorial }}
      style={{ x, y }}
    >
      <div className="showreel-object md:-translate-y-5 md:scale-90 lg:-translate-y-7 lg:scale-[0.88]">
        <a
          href={SHOWREEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Watch the full showreel on YouTube"
          className="showreel-frame block aspect-[4/5] overflow-hidden bg-[#15120f] shadow-[0_26px_65px_rgba(0,0,0,0.38)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bronze"
        >
          <div aria-hidden="true" className="showreel-canvas absolute inset-0" />
          <YoutubeCardVideo
            videoId={SHOWREEL_VIDEO_ID}
            className="brightness-[0.92] transition-[transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:brightness-100"
          />
          <div aria-hidden="true" className="showreel-reflection absolute inset-0" />
          <div aria-hidden="true" className="showreel-vignette absolute inset-0" />
          <div aria-hidden="true" className="showreel-grain absolute inset-0" />
          <div aria-hidden="true" className="absolute inset-[0.3rem] border border-cream/15" />
          <div aria-hidden="true" className="showreel-glass absolute inset-[0.7rem] border border-cream/15" />
          <div className="absolute inset-x-7 top-7 flex items-center justify-between text-[0.54rem] font-medium uppercase tracking-[0.24em] text-cream/60">
            <span>Showreel 2026</span>
            <span>Muted</span>
          </div>
          <span className="absolute inset-0 grid place-items-center">
            <span className="showreel-play grid h-[3.65rem] w-[3.65rem] place-items-center rounded-full border-[0.5px] border-bronze/80 bg-charcoal/30 pl-0.5 text-[0.7rem] text-bronze backdrop-blur-md">
              ▶
            </span>
          </span>
          <div aria-hidden="true" className="absolute inset-x-7 bottom-[3.7rem] h-px bg-cream/15">
            <span className="block h-px w-[28%] bg-bronze/75" />
          </div>
          <figcaption className="absolute inset-x-7 bottom-7 flex items-end justify-between text-[0.54rem] font-medium uppercase tracking-[0.24em] text-cream/60">
            <span>Autoplay · Loop</span>
            <span>01:12</span>
          </figcaption>
        </a>
        <p className="mt-3 text-right text-[0.56rem] font-medium uppercase tracking-[0.18em] text-cream/40">
          Watch the full showreel on YouTube
        </p>
      </div>
    </motion.figure>
  );
}
