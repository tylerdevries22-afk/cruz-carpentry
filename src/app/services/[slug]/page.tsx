import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ServiceDetailSections } from "@/components/service/ServiceDetailSections";
import { JsonLd } from "@/components/JsonLd";
import { SERVICES } from "@/lib/services";
import { getResolvedServiceBySlug } from "@/lib/content/source";
import { buildBusinessNode, BUSINESS_ID } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/constants";

// Prerender all 16 service pages at build time; 404 anything else.
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getResolvedServiceBySlug(slug);
  if (!service) return {};

  const path = `/services/${service.slug}`;
  return {
    title: service.seo.title,
    description: service.seo.description,
    alternates: { canonical: path },
    openGraph: {
      title: `${service.seo.title} · Cruz Carpentry`,
      description: service.seo.description,
      url: path,
      type: "website",
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getResolvedServiceBySlug(slug);
  if (!service) notFound();

  const url = `${SITE_URL}/services/${service.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // Inline the business node so the Service `provider` @id resolves on this
      // page (Google parses each document's graph in isolation).
      buildBusinessNode(),
      {
        "@type": "Service",
        name: service.title,
        serviceType: service.shortTitle,
        description: service.seo.description,
        url,
        provider: { "@id": BUSINESS_ID },
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Colorado Front Range",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "What We Build",
            item: `${SITE_URL}/services`,
          },
          { "@type": "ListItem", position: 3, name: service.shortTitle, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Nav />
      <main id="main" tabIndex={-1}>
        <ServiceDetailSections service={service} />
      </main>
      <Footer />
    </>
  );
}
