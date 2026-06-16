import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { LandingPage } from "@/components/landing/LandingPage";
import { Services } from "@/components/Services";
import { ProofBand } from "@/components/ProofBand";
import { FeaturedWork } from "@/components/FeaturedWork";
import { EstimateForm } from "@/components/EstimateForm";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { SERVICES } from "@/lib/services";
import { buildBusinessNode } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";

const SERVICE_NAMES = SERVICES.map((service) => service.title);

// LocalBusiness structured data for local SEO / rich results, extended with the
// full service catalog. (Address geo + aggregateRating intentionally omitted in
// buildBusinessNode until the owner supplies real data.)
const jsonLd = {
  "@context": "https://schema.org",
  ...buildBusinessNode(),
  knowsAbout: SERVICE_NAMES,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Custom Carpentry Services",
    itemListElement: SERVICE_NAMES.map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name },
    })),
  },
};

export default function Home() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <ProofBand />
        <LandingPage />
        <Services />
        <FeaturedWork />
        <EstimateForm />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
