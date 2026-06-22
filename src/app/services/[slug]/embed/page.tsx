import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailSections } from "@/components/service/ServiceDetailSections";
import { SERVICES } from "@/lib/services";
import { getResolvedServiceBySlug } from "@/lib/content/source";

// Chrome-less variant of the service detail page, loaded inside the /tour
// overlay's iframe. Prerendered for all 16 slugs; noindex so it never competes
// with the canonical /services/[slug] page in search.
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ServiceEmbedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getResolvedServiceBySlug(slug);
  if (!service) notFound();

  return (
    <main id="main" tabIndex={-1} className="bg-[#FAF7F2]">
      <ServiceDetailSections service={service} embed />
    </main>
  );
}
