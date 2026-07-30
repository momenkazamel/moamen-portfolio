import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://moamenkazamel.com";
const SITE_TITLE = "Moamen Kazamel — Creative Director";
const SITE_DESCRIPTION = "The portfolio of Moamen Kazamel, independent creative director.";

// viewportFit: "cover" is what makes the various env(safe-area-inset-*)
// values used across the site (navbar, footer, fullscreen mobile menu)
// actually resolve to real values instead of always being 0.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#100e0c",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        // Cache-busting query param — WhatsApp/LinkedIn/etc. cache OG images
        // by URL and won't re-fetch on their own after an in-place update.
        url: "/og-image.png?v=2",
        width: 1200,
        height: 630,
        alt: "Moamen Kazamel — AI Creative Director",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png?v=2"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
