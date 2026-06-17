import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { EstimateWizard } from "@/components/estimate-wizard/EstimateWizard";
import { getResolvedCopy } from "@/lib/content/source";
import { renderCopy } from "@/lib/content/render";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = (await getResolvedCopy()).estimate;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/estimate" },
    openGraph: {
      title: `${seo.title} · Cruz Carpentry`,
      description: seo.description,
      url: "/estimate",
      type: "website",
    },
  };
}

export default async function EstimatePage() {
  const copy = (await getResolvedCopy()).estimate;
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="bg-[#FAF7F2]">
        <section className="px-6 pb-24 pt-32 sm:pt-36">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">
              {copy.header.eyebrow}
            </p>
            <h1 className="font-serif text-4xl leading-tight text-[#1C1917] sm:text-5xl">
              {renderCopy(copy.header.heading)}
            </h1>
            <p className="mt-4 max-w-xl text-[0.9375rem] font-light leading-relaxed text-[#57534E]">
              {copy.header.body}
            </p>
            <div className="mt-10">
              <EstimateWizard />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
