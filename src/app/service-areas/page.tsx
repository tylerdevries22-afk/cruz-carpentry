import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { EstimateForm } from "@/components/EstimateForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { buildBusinessNode } from "@/lib/jsonld";
import { SERVICE_CITIES } from "@/lib/locations";
import { getResolvedCopy } from "@/lib/content/source";
import { renderCopy } from "@/lib/content/render";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = (await getResolvedCopy()).serviceAreas;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/service-areas" },
    openGraph: {
      title: `${seo.title} · Cruz Carpentry`,
      description: seo.description,
      url: "/service-areas",
      type: "website",
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  ...buildBusinessNode(),
  areaServed: SERVICE_CITIES.map((city) => ({
    "@type": "City",
    name: `${city}, CO`,
  })),
};

export default async function ServiceAreasPage() {
  const copy = (await getResolvedCopy()).serviceAreas;
  return (
    <>
      <JsonLd data={jsonLd} />
      <Nav />
      <main id="main" tabIndex={-1}>
        <PageHeader
          eyebrow={copy.header.eyebrow}
          title={renderCopy(copy.header.title)}
          sub={copy.header.sub}
        />

        <section className="bg-[#FAF7F2] px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p className="mx-auto mb-12 max-w-2xl text-center text-lg font-light leading-relaxed text-[#57534E]">
                {copy.body.intro}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {SERVICE_CITIES.map((city) => (
                  <li
                    key={city}
                    className="flex items-center gap-2.5 rounded-xl border border-[#E8DDD4] bg-white px-4 py-3 text-[#1C1917]"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#B45309]"
                    />
                    <span className="text-[0.9375rem] font-light">{city}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-12 text-center text-sm font-light text-[#57534E]">
                {copy.body.footnotePrefix}
                <Link
                  href="/contact"
                  className="font-medium text-[#B45309] underline-offset-2 hover:underline"
                >
                  {copy.body.footnoteLinkLabel}
                </Link>
                {copy.body.footnoteSuffix}
              </p>
            </Reveal>
          </div>
        </section>

        <EstimateForm />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
