import type { NextConfig } from "next";

// Pin the image optimizer to this project's Supabase Storage host so a stray or
// tampered gallery `image_url` can't make the optimizer fetch an arbitrary
// Supabase project. Falls back to a wildcard if the URL isn't set at build time.
function supabaseImageHost(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return "**.supabase.co";
  try {
    return new URL(url).hostname;
  } catch {
    return "**.supabase.co";
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Supabase Storage public objects, e.g.
        // https://<ref>.supabase.co/storage/v1/object/public/gallery/<file>
        protocol: "https",
        hostname: supabaseImageHost(),
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
