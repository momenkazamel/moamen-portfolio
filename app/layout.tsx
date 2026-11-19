import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import "./globals.css";

const SITE_URL = "https://moamenkazamel.com";
const SITE_TITLE = "Moamen Shawky Kazamel · Video Editor";
const SITE_DESCRIPTION =
  "Moamen Shawky Kazamel (MK), a video editor from Egypt. YouTube documentaries, real-estate series, courses and reels in Arabic and English.";

// Archivo carries both body and display (display uses its condensed width
// axis, see .font-display). Plex Mono is for labels and timecode; Plex Sans
// Arabic for Arabic lines.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-body", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600"],
  variable: "--font-plex-arabic",
  display: "swap",
});

// viewportFit: "cover" is what makes the various env(safe-area-inset-*)
// values used across the site (navbar, footer, fullscreen mobile menu)
// actually resolve to real values instead of always being 0.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0d0c",
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
        url: "/og-image.png?v=3",
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png?v=3"],
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
      className={`h-full antialiased ${archivo.variable} ${plexMono.variable} ${plexArabic.variable}`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/* GA4 — afterInteractive so it doesn't block first paint/LCP */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
            window.gtag = gtag;
          `}
        </Script>
      </body>
    </html>
  );
}
