/**
 * GA4 setup. GA_MEASUREMENT_ID is public by design (it ships in client JS
 * on every page load regardless — GA4 measurement IDs are not secrets), so
 * it's hardcoded here rather than pulled from an env var. That also means
 * shipping it just requires a normal git push — no separate Vercel
 * dashboard env var to keep in sync.
 *
 * Property: "Moamen Kazamel" (GA4), Web data stream: moamenkazamel.com.
 */
export const GA_MEASUREMENT_ID = "G-E8T6YWC0C9";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fires a GA4 event via the global gtag() installed in app/layout.tsx.
 * Safe to call from anywhere (SSR, before the tag has loaded, ad blockers,
 * etc.) — it's a no-op rather than a throw when gtag isn't available.
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

type LeadEvent = { name: string; params: Record<string, unknown> };

/**
 * Infers a lead-relevant GA4 event from a link's destination, for the
 * shared CTA components (ArrowLink / CtaButton / PillButton) that get
 * reused for many different destinations across the site. Returns null for
 * hrefs that aren't a tracked lead action (internal anchors like "#work",
 * the case-study placeholder "#coming-soon", etc.) — those intentionally
 * don't fire anything.
 *
 * Order matters: mailto/whatsapp/linkedin/resume are checked before the
 * generic instagram/youtube checks since they're all more specific.
 */
export function getLeadEvent(href: string): LeadEvent | null {
  if (!href) return null;

  if (href.startsWith("mailto:")) {
    return { name: "email_click", params: { link_url: href } };
  }
  if (href.startsWith("https://wa.me/") || href.includes("api.whatsapp.com")) {
    return { name: "whatsapp_click", params: { link_url: href } };
  }
  if (href.includes("linkedin.com")) {
    return { name: "linkedin_click", params: { link_url: href } };
  }
  if (href.endsWith(".pdf") || href.includes("/documents/")) {
    return { name: "cv_download", params: { link_url: href, file_name: href.split("/").pop() ?? href } };
  }
  if (href.includes("instagram.com")) {
    return { name: "instagram_click", params: { link_url: href } };
  }
  if (href.includes("youtube.com") || href.includes("youtu.be")) {
    return { name: "youtube_click", params: { link_url: href } };
  }
  return null;
}
