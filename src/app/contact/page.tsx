import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { EstimateForm } from "@/components/EstimateForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { PhoneIcon } from "@/components/ui/PhoneIcon";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { buildBusinessNode, BUSINESS_ID } from "@/lib/jsonld";
import { PHONE, PHONE_HREF, SITE_URL } from "@/lib/constants";
import { SERVICE_CITIES } from "@/lib/locations";
import { getResolvedCopy } from "@/lib/content/source";
import { renderCopy } from "@/lib/content/render";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = (await getResolvedCopy()).contact;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/contact" },
    openGraph: {
      title: `${seo.title} · Cruz Carpentry`,
      description: seo.description,
      url: "/contact",
      type: "website",
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      ...buildBusinessNode(),
      contactPoint: {
        "@type": "ContactPoint",
        telephone: PHONE_HREF.replace("tel:", ""),
        contactType: "sales",
        areaServed: "US-CO",
        availableLanguage: "English",
      },
    },
    {
      "@type": "ContactPage",
      name: "Contact Cruz Carpentry",
      url: `${SITE_URL}/contact`,
      about: { "@id": BUSINESS_ID },
    },
  ],
};

export default async function ContactPage() {
  const copy = (await getResolvedCopy()).contact;
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

        {/* Contact info band */}
        <section className="bg-[#FAF7F2] px-6 py-20 sm:py-24">
          <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-3">
            <Reveal>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">
                  {copy.info.call.label}
                </p>
                <a
                  href={PHONE_HREF}
                  className="inline-flex items-center gap-2 font-serif text-2xl text-[#1C1917] transition-colors hover:text-[#B45309] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F2] rounded-sm"
                >
                  <PhoneIcon className="h-5 w-5 text-[#B45309]" />
                  {PHONE}
                </a>
                <p className="mt-2 text-sm font-light text-[#57534E]">
                  {copy.info.call.note}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">
                  {copy.info.estimates.label}
                </p>
                <p className="font-serif text-2xl text-[#1C1917]">
                  {copy.info.estimates.value}
                </p>
                <p className="mt-2 text-sm font-light text-[#57534E]">
                  {copy.info.estimates.note}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">
                  {copy.info.serviceArea.label}
                </p>
                <p className="font-serif text-2xl text-[#1C1917]">
                  {copy.info.serviceArea.value}
                </p>
                <p className="mt-2 text-sm font-light text-[#57534E]">
                  {SERVICE_CITIES.slice(0, 6).join(", ")}
                  {copy.info.serviceArea.noteSuffix}
                </p>
              </div>
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
