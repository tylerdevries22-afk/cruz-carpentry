import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { LandingPage } from "@/components/landing/LandingPage";
import { Services } from "@/components/Services";
import { Gallery } from "@/components/gallery/Gallery";
import { EstimateForm } from "@/components/EstimateForm";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { PHONE_HREF, SITE_URL } from "@/lib/constants";

const SERVICE_NAMES = [
  "Custom Cabinetry — Kitchen & Bath",
  "Built-In Shelving & Entertainment Centers",
  "Staircases & Railings",
  "Trim, Molding & Wainscoting",
  "Custom Closets & Wardrobes",
  "Mudrooms, Lockers & Benches",
  "Exposed Beams & Wood Ceilings",
  "Fireplace Mantels & Surrounds",
  "Interior & Barn Doors",
  "Custom Woodwork & Specialty Builds",
  "Custom Cedar Saunas",
];

// LocalBusiness structured data for local SEO / rich results. Address, geo, and
// aggregateRating are intentionally omitted until the owner supplies real data
// (fabricating a review count or address risks Google penalties).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "@id": `${SITE_URL}/#business`,
  name: "Cruz Carpentry",
  description:
    "Custom carpentry and fine millwork serving the Colorado Front Range.",
  url: SITE_URL,
  telephone: PHONE_HREF.replace("tel:", ""),
  image: `${SITE_URL}/opengraph-image`,
  logo: `${SITE_URL}/icon.png`,
  slogan: "Built by Hand. Built to Last.",
  priceRange: "$$",
  areaServed: { "@type": "AdministrativeArea", name: "Colorado Front Range" },
  address: { "@type": "PostalAddress", addressRegion: "CO", addressCountry: "US" },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Nav />
      <main>
        <Hero />
        <LandingPage />
        <Services />
        <Gallery />
        <EstimateForm />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
