import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Services } from "@/components/Services";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { getResolvedCopy, getResolvedServicesOrdered } from "@/lib/content/source";
import { toCardService } from "@/lib/services";
import { renderCopy } from "@/lib/content/render";
import { SITE_URL } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = (await getResolvedCopy()).servicesHub;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/services" },
    openGraph: {
      title: `${seo.title} · Cruz Carpentry`,
      description: seo.description,
      url: "/services",
      type: "website",
    },
  };
}

export default async function ServicesIndexPage() {
  const copy = (await getResolvedCopy()).servicesHub;
  const services = await getResolvedServicesOrdered();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
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
        ],
      },
      {
        "@type": "ItemList",
        name: "Custom Carpentry Services",
        itemListElement: services.map((service, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: service.title,
          url: `${SITE_URL}/services/${service.slug}`,
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Nav />
      <main id="main" tabIndex={-1}>
        {/* Dark header — gives the transparent nav a legible backdrop */}
        <header className="relative overflow-hidden bg-[#1C1917] px-6 pb-24 pt-36 text-center sm:pb-28 sm:pt-44">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_40%,rgba(202,138,4,0.10)_0%,transparent_70%)]" />
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#CA8A04]">
              {copy.header.eyebrow}
            </p>
            <h1
              className="font-serif leading-[0.95] tracking-[-0.02em] text-white"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              {renderCopy(copy.header.heading)}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg font-light leading-relaxed text-[#A8A29E]">
              {copy.header.bodyPrefix}
              {services.length}
              {copy.header.bodySuffix}
            </p>
          </div>
        </header>

        <Services services={services.map(toCardService)} showHeader={false} />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
