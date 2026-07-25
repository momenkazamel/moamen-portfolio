/**
 * Color "grade" for a project's cinematic thumbnail — maps to a
 * .work-canvas-{grade} gradient defined in globals.css. Kept separate from
 * imagery since there are no project stills yet; swapping in real photography
 * later just means dropping a <img>/<video> into WorkThumbnail.
 */
export type WorkGrade = "amber" | "umber" | "moss" | "slate";

export type Project = {
  title: string;
  category: string;
  description: string;
  year: string;
  tags: string[];
  grade: WorkGrade;
  /** Case-study URL, once one exists. Omitted entries render without a link. */
  href?: string;
  /** Generic/placeholder Instagram link — shown as "Watch Reel" when reelUrl isn't set yet. */
  reelHref?: string;
  /** Confirmed real Instagram Reel URL. Takes priority over reelHref/href: the video card links here and the action becomes "Original Instagram Reel". */
  reelUrl?: string;
  /** Overrides the default "Original Instagram Reel" action label when reelUrl is set. */
  reelLinkLabel?: string;
  /** Real footage for the vertical reel card, once it exists. Falls back to the color-graded gradient placeholder when omitted. */
  videoSrc?: string;
  posterSrc?: string;
  /** YouTube Short ID to embed in the reel card. Takes priority over videoSrc when both are set. */
  youtubeVideoId?: string;
  /** Verified social performance stat, shown in the metadata column. Purely a display stat — the click-through uses reelUrl above. */
  socialProof?: {
    value: number;
    suffix: string;
    label: string;
  };
};

// No case-study pages exist yet for any project. This constant exists
// purely so the (currently unused) `href` field has somewhere honest to
// point to in the meantime — a non-existent in-page anchor (no-op, doesn't
// jump the page). All six projects now have a confirmed `reelUrl`, but the
// `reelHref` fallback field stays available on the Project type for any
// future project added without one yet.
const PLACEHOLDER_CASE_STUDY_URL = "#coming-soon";

// Confirmed production years for each project.
export const projects: Project[] = [
  {
    title: "Before the First Sip.",
    category: "COMMERCIAL CAMPAIGN",
    description:
      "A cinematic commercial imagining the extraordinary effort hidden behind an ordinary cup of coffee.",
    year: "2026",
    tags: ["Direction", "AI Pipeline", "Cinematography"],
    grade: "amber",
    href: PLACEHOLDER_CASE_STUDY_URL,
    reelUrl: "https://www.instagram.com/p/DSaIGfgDZ7C/",
    youtubeVideoId: "F3jtg2yI7LU",
    socialProof: {
      value: 7,
      suffix: "M+",
      label: "Instagram Views",
    },
  },
  {
    title: "Forgotten, Not Gone.",
    category: "EMOTIONAL STORYTELLING",
    description:
      "A nostalgic AI short exploring memory, childhood, and the emotional connection we leave behind.",
    year: "2025",
    tags: ["Direction", "AI Pipeline", "Sound Design"],
    grade: "umber",
    href: PLACEHOLDER_CASE_STUDY_URL,
    reelUrl: "https://www.instagram.com/p/DTA5G05DUGH/",
    youtubeVideoId: "qO2DxkXMh84",
  },
  {
    title: "Ordinary Legends.",
    category: "CHARACTER REIMAGINING",
    description:
      "Iconic fictional characters reimagined through unexpected everyday moments with cinematic realism and subtle humor.",
    year: "2025",
    tags: ["Direction", "AI Pipeline", "Concept"],
    grade: "slate",
    href: PLACEHOLDER_CASE_STUDY_URL,
    reelUrl: "https://www.instagram.com/p/DTFz3M8jT-J/",
    reelLinkLabel: "View on Instagram",
    youtubeVideoId: "73k95ys7Oyo",
  },
  {
    title: "Crossing Worlds.",
    category: "WORLD BUILDING",
    description:
      "A surreal cinematic journey where impossible transitions transform familiar places into extraordinary destinations.",
    year: "2026",
    tags: ["Direction", "AI Pipeline", "World Building"],
    grade: "moss",
    href: PLACEHOLDER_CASE_STUDY_URL,
    reelUrl: "https://www.instagram.com/p/DR7dUo2DVWz/",
    reelLinkLabel: "View on Instagram",
    youtubeVideoId: "4VaBjHC7Z_0",
  },
  {
    title: "Built to Last.",
    category: "ARCHITECTURAL VISUALIZATION",
    description:
      "Transforming construction and architectural concepts into cinematic visual stories through AI-powered filmmaking.",
    year: "2025",
    tags: ["AI Pipeline", "Visualization", "Direction"],
    grade: "slate",
    href: PLACEHOLDER_CASE_STUDY_URL,
    reelUrl: "https://www.instagram.com/p/DTN4L4pjcsn/",
    reelLinkLabel: "View on Instagram",
    youtubeVideoId: "NIehSJYOVZc",
  },
  {
    title: "The Frozen Siege.",
    category: "EPIC CINEMATIC",
    description:
      "An AI-generated medieval battle sequence focused on atmosphere, scale, and cinematic storytelling.",
    year: "2025",
    tags: ["Direction", "AI Pipeline", "VFX"],
    grade: "umber",
    href: PLACEHOLDER_CASE_STUDY_URL,
    reelUrl: "https://www.instagram.com/p/DTialgjDU_r/",
    reelLinkLabel: "View on Instagram",
    youtubeVideoId: "kPcTC8xnlcQ",
  },
];
