import type { MetadataRoute } from "next";

const SITE_URL = "https://moamenkazamel.com";

// Single-page portfolio — everything lives at the root as in-page sections,
// so the sitemap has just the one entry.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/mk-studio`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
