import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { SERVICES } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/gallery", priority: 0.8 },
    { path: "/about", priority: 0.7 },
    { path: "/careers", priority: 0.6 },
    { path: "/contact", priority: 0.8 },
    { path: "/service-areas", priority: 0.7 },
    { path: "/faq", priority: 0.6 },
  ];

  return [
    ...pages.map((p) => ({
      url: `${SITE_URL}${p.path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: p.priority,
    })),
    ...SERVICES.map((service) => ({
      url: `${SITE_URL}/services/${service.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
