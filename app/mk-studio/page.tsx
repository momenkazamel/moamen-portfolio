import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { StudioPage } from "@/components/studio/studio-page";

const TITLE = "MK Studio · Moamen Shawky Kazamel";
const DESCRIPTION =
  "MK Studio: follow @mk.studio.creative on Instagram, TikTok, Facebook and YouTube, or hire the studio for a portfolio website or a video edit.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/mk-studio" },
  openGraph: { url: "/mk-studio", title: TITLE, description: DESCRIPTION },
  twitter: { title: TITLE, description: DESCRIPTION },
};

export default function MkStudio() {
  return (
    <>
      <Navbar />
      <main>
        <StudioPage />
      </main>
    </>
  );
}
