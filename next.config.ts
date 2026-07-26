import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  // www → apex redirect is handled entirely by Vercel's domain settings
  // (moamenkazamel.com set as primary, www redirecting to it) — a
  // duplicate host-based redirect here caused ERR_TOO_MANY_REDIRECTS by
  // fighting with Vercel's own redirect. Do not re-add it in code.
};

export default nextConfig;
