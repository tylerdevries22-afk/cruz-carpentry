import type { NextConfig } from "next";

// Gallery/video assets are content-stable (filenames change when content does),
// so serve them immutable for a year. Images also flow through next/image.
const longCache = [
  { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
];

const nextConfig: NextConfig = {
  images: {
    // Prefer AVIF (smaller than WebP) with WebP fallback.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      { source: "/videos/:path*", headers: longCache },
      { source: "/gallery/:path*", headers: longCache },
    ];
  },
};

export default nextConfig;
