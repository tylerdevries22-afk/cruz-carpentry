import type { NextConfig } from "next";

// Gallery images are local WebP assets in /public/gallery, so no remote image
// hosts need allow-listing. Next's image optimizer still serves them as
// responsive, modern formats.
const nextConfig: NextConfig = {};

export default nextConfig;
