import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { EstimateForm } from "@/components/EstimateForm";
import { Gallery } from "@/components/gallery/Gallery";
import { ServiceHero } from "@/components/service/ServiceHero";
import { ServiceIntro } from "@/components/service/ServiceIntro";
import { ServiceProcess } from "@/components/service/ServiceProcess";
import { ServiceMaterials } from "@/components/service/ServiceMaterials";
import { ServiceDetails } from "@/components/service/ServiceDetails";
import { ServiceFAQ } from "@/components/service/ServiceFAQ";
import { GALLERY_PHOTOS } from "@/components/gallery/photos";
import { JsonLd } from "@/components/JsonLd";
import { SERVICES, getServiceBySlug } from "@/lib/services";
import { buildBusinessNode, BUSINESS_ID } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/constants";

// Prerender all 12 service pages at build time; 404 anything else.
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
  const service = getServiceBySlug(slug);
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
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  // Real Cruz project photos for this category (1-based cruz-NN → manifest).
  const photos = service.galleryIndices
    .map((n) => GALLERY_PHOTOS[n - 1])
    .filter(Boolean);

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
        <ServiceHero service={service} />
        <ServiceIntro service={service} />
        <ServiceProcess />
        <ServiceMaterials service={service} />
        <ServiceDetails service={service} />
        {photos.length > 0 && (
          <Gallery
            photos={photos}
            eyebrow="Selected Work"
            heading={
              <>
                {service.shortTitle},
                <br />
                <em className="italic">up close</em>
              </>
            }
            subheading="Real projects across the Front Range · select to enlarge"
            id="work"
          />
        )}
        <ServiceFAQ service={service} />
        <EstimateForm defaultProjectType={service.projectType} />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
