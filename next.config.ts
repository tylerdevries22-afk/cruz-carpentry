import type { NextConfig } from "next";

// Gallery/video assets are content-stable, so serve them immutable for a year.
const longCache = [
  { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
];

// Card/wood/image assets are content-stable but their filenames are reused when
// art is re-graded, so cache aggressively but allow background revalidation
// rather than locking a stale frame for a year.
const mediumCache = [
  {
    key: "Cache-Control",
    value: "public, max-age=86400, stale-while-revalidate=2592000",
  },
];

const nextConfig: NextConfig = {
  images: {
    // Prefer AVIF (smaller than WebP) with WebP fallback.
    formats: ["image/avif", "image/webp"],
  },
  // Tree-shake unused framer-motion exports out of the client bundle.
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  async headers() {
    return [
      { source: "/videos/:path*", headers: longCache },
      { source: "/gallery/:path*", headers: longCache },
      { source: "/cards/:path*", headers: mediumCache },
      { source: "/wood/:path*", headers: mediumCache },
      { source: "/images/:path*", headers: mediumCache },
    ];
  },
};

export default nextConfig;
