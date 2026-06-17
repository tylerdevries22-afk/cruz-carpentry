import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Prefer AVIF (smaller than WebP) with WebP fallback.
    formats: ["image/avif", "image/webp"],
    // Allow-list the quality levels used at call sites (Next 16 requires opting
    // into any non-default quality). Full-bleed decorative backgrounds can drop
    // to 55–60 with no visible loss; 75 stays the default for content imagery.
    qualities: [55, 60, 75],
    // What-We-Build media is served from the public Supabase Storage bucket.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nkarcozbgtgtcqfhytrx.supabase.co",
        pathname: "/storage/v1/object/public/what-we-build/**",
      },
    ],
  },
  // Tree-shake unused framer-motion exports out of the client bundle.
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  // Note: all gallery/wood/card media is now served from Supabase Storage (which
  // sets its own long-lived cache headers), so no custom headers() for local
  // /public asset paths are needed.
  // Service pages that were merged into others — redirect so old links/SEO don't 404.
  async redirects() {
    return [
      { source: "/services/kitchen-islands", destination: "/services/custom-cabinetry", permanent: true },
      { source: "/services/home-offices", destination: "/services/desks-libraries", permanent: true },
      { source: "/services/window-seats", destination: "/services/custom-woodwork", permanent: true },
      { source: "/services/bunk-loft-beds", destination: "/services/custom-woodwork", permanent: true },
      { source: "/services/interior-barn-doors", destination: "/services/interior-exterior-doors", permanent: true },
    ];
  },
};

export default nextConfig;
