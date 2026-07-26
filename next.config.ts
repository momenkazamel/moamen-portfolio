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
  // Enforce the apex domain (moamenkazamel.com, no www) as canonical at the
  // application layer — a permanent redirect regardless of how the two
  // hostnames are wired up in Vercel's own domain settings.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.moamenkazamel.com" }],
        destination: "https://moamenkazamel.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
