export type EditFormat = "landscape" | "portrait";

export type EditProject = {
  title: string;
  category: string;
  year: string;
  /** One line on what the edit actually involved. */
  description: string;
  /** What Moamen did on it — shown as small uppercase tags. */
  roles: string[];
  /** 16:9 (YouTube, courses, ads) or 9:16 (Reels, TikTok, Shorts). Drives the card's aspect ratio and grid width. */
  format: EditFormat;
  /** Self-hosted, web-compressed cut under /public/videos/editing (H.264, faststart). */
  videoSrc: string;
  posterSrc: string;
};

// Real (non-AI) editing work. Videos are self-hosted rather than embedded
// because none of these live on a public YouTube/Vimeo channel. They use
// preload="none" in the player, so nothing is downloaded until a visitor
// actually presses play.
export const editProjects: EditProject[] = [
  {
    title: "Documentary Series — EP 097",
    category: "YOUTUBE DOCUMENTARY",
    year: "2026",
    description:
      "A geopolitics explainer cut like a documentary — chapter title cards, map animations, cinematic B-roll and data graphics woven around the host.",
    roles: ["Editing", "Motion Graphics", "B-roll", "Sound"],
    format: "landscape",
    videoSrc: "/videos/editing/documentary-ep097.mp4",
    posterSrc: "/images/editing/documentary-ep097.jpg",
  },
  {
    title: "Football Story Reel",
    category: "SPORTS REEL",
    year: "2026",
    description:
      "A 90-second football story built for retention — word-synced Arabic captions and player cut-outs that appear the moment each name is spoken.",
    roles: ["Editing", "Captions", "Cut-outs"],
    format: "portrait",
    videoSrc: "/videos/editing/football-reel.mp4",
    posterSrc: "/images/editing/football-reel.jpg",
  },
  {
    title: "Deutsch Kurs — Episode 01",
    category: "EDUCATIONAL SERIES",
    year: "2026",
    description:
      "A 22-minute German course episode cut into a tight, fast lesson — section title cards, colour-coded bilingual on-screen text, and icons that land on every key word.",
    roles: ["Editing", "Motion Graphics", "Bilingual Captions"],
    format: "landscape",
    videoSrc: "/videos/editing/deutsch-kurs-ep01.mp4",
    posterSrc: "/images/editing/deutsch-kurs-ep01.jpg",
  },
  {
    title: "German Board — Promo",
    category: "COMMERCIAL",
    year: "2026",
    description:
      "A short promo for a medical-licensing consultancy — punchy animated headlines, synced captions and a branded end card, built for Reels.",
    roles: ["Editing", "Animated Titles", "Captions"],
    format: "portrait",
    videoSrc: "/videos/editing/german-board.mp4",
    posterSrc: "/images/editing/german-board.jpg",
  },
  {
    title: "English Vocabulary — Unit One",
    category: "EDUCATIONAL",
    year: "2026",
    description:
      "A vocabulary lesson told as a story — illustrated scenes in a parchment frame, with bilingual word cards that pop in exactly as each word is taught.",
    roles: ["Editing", "Vocabulary Cards", "Visual Storytelling"],
    format: "landscape",
    videoSrc: "/videos/editing/vocab-unit-one.mp4",
    posterSrc: "/images/editing/vocab-unit-one.jpg",
  },
];
