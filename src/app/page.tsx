import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { LandingPage } from "@/components/landing/LandingPage";
import { Services } from "@/components/Services";
import { ProofBand } from "@/components/ProofBand";
import { FeaturedWork } from "@/components/FeaturedWork";
import { EstimateForm } from "@/components/EstimateForm";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { loadContent } from "@/lib/content/source";
import { toCardService } from "@/lib/services";
import { buildBusinessNode } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";

export default async function Home() {
  const { services: resolved, copy } = await loadContent();
  const services = [...resolved].sort((a, b) => a.num.localeCompare(b.num));
  const serviceNames = services.map((service) => service.title);

  // LocalBusiness structured data for local SEO / rich results, extended with the
  // full service catalog. (Address geo + aggregateRating intentionally omitted in
  // buildBusinessNode until the owner supplies real data.)
  const jsonLd = {
    "@context": "https://schema.org",
    ...buildBusinessNode(),
    knowsAbout: serviceNames,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Custom Carpentry Services",
      itemListElement: serviceNames.map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name },
      })),
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero content={copy.home.hero} />
        <LandingPage />
        <ProofBand />
        <Services services={services.map(toCardService)} header={copy.home.services} />
        <FeaturedWork content={copy.home.featured} />
        <EstimateForm />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
