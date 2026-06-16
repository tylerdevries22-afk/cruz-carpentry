import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { EstimateWizard } from "@/components/estimate-wizard/EstimateWizard";

const DESCRIPTION =
  "Request a custom carpentry estimate from Cruz Carpentry. Answer a few questions about your project and get a preliminary price range in minutes, priced with live material costs.";

export const metadata: Metadata = {
  title: "Request a Custom Carpentry Estimate",
  description: DESCRIPTION,
  alternates: { canonical: "/estimate" },
  openGraph: {
    title: "Request a Custom Carpentry Estimate · Cruz Carpentry",
    description: DESCRIPTION,
    url: "/estimate",
    type: "website",
  },
};

export default function EstimatePage() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="bg-[#FAF7F2]">
        <section className="px-6 pb-24 pt-32 sm:pt-36">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">
              Request a Custom Carpentry Estimate
            </p>
            <h1 className="font-serif text-4xl leading-tight text-[#1C1917] sm:text-5xl">
              Let&apos;s price <em className="italic">your project</em>
            </h1>
            <p className="mt-4 max-w-xl text-[0.9375rem] font-light leading-relaxed text-[#57534E]">
              A few quick questions get you a preliminary range — priced with live
              material costs. No obligation; final pricing follows a free on-site
              review.
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
