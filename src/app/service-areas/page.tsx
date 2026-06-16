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

const DESCRIPTION =
  "Cruz Carpentry builds custom carpentry across the Colorado Front Range — Denver, Boulder, Fort Collins, Loveland, Longmont, Castle Rock, and surrounding communities.";

export const metadata: Metadata = {
  title: "Service Areas",
  description: DESCRIPTION,
  alternates: { canonical: "/service-areas" },
  openGraph: {
    title: "Service Areas · Cruz Carpentry",
    description: DESCRIPTION,
    url: "/service-areas",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  ...buildBusinessNode(),
  areaServed: SERVICE_CITIES.map((city) => ({
    "@type": "City",
    name: `${city}, CO`,
  })),
};

export default function ServiceAreasPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Nav />
      <main id="main" tabIndex={-1}>
        <PageHeader
          eyebrow="Service Areas"
          title={
            <>
              Across the <em className="italic">Front Range</em>
            </>
          }
          sub="Cruz Carpentry builds for homes throughout the Colorado Front Range. If you're in one of these communities — or close by — we'd love to help."
        />

        <section className="bg-[#FAF7F2] px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p className="mx-auto mb-12 max-w-2xl text-center text-lg font-light leading-relaxed text-[#57534E]">
                From Denver and the southern suburbs up through Boulder County and
                the northern Front Range, we bring the same hand-built craftsmanship
                to every project — wherever the job is.
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
                Don&apos;t see your town?{" "}
                <Link
                  href="/contact"
                  className="font-medium text-[#B45309] underline-offset-2 hover:underline"
                >
                  Get in touch
                </Link>{" "}
                — we serve many surrounding communities too.
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
