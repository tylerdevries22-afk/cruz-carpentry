import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { EstimateForm } from "@/components/EstimateForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { getResolvedCopy } from "@/lib/content/source";
import { renderCopy } from "@/lib/content/render";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = (await getResolvedCopy()).faq;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/faq" },
    openGraph: {
      title: `${seo.title} · Cruz Carpentry`,
      description: seo.description,
      url: "/faq",
      type: "website",
    },
  };
}

export default async function FaqPage() {
  const copy = (await getResolvedCopy()).faq;
  const faqs = copy.faqs;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
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

        <section className="bg-white px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <div className="border-y border-[#E8DDD4]">
                {faqs.map((item) => (
                  <details
                    key={item.q}
                    className="group border-b border-[#E8DDD4] last:border-b-0"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-serif text-lg text-[#1C1917] rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2 focus-visible:ring-offset-white [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <span
                        aria-hidden="true"
                        className="relative h-5 w-5 shrink-0 text-[#B45309] transition-transform duration-300 group-open:rotate-45"
                      >
                        <span className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-current" />
                        <span className="absolute left-1/2 top-1/2 h-3.5 w-px -translate-x-1/2 -translate-y-1/2 bg-current" />
                      </span>
                    </summary>
                    <p className="pb-5 text-[0.9375rem] font-light leading-relaxed text-[#57534E]">
                      {item.a}
                    </p>
                  </details>
                ))}
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
