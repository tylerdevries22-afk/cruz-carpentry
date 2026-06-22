import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { TourFilm } from "@/components/tour/TourFilm";
import { TOUR_ROOMS } from "@/lib/tour";
import { JsonLd } from "@/components/JsonLd";
import { buildBusinessNode } from "@/lib/jsonld";

// The cinematic tour is the homepage EVERYONE lands on, including search traffic:
// `/` is self-canonical (the root-layout default) and sits at priority 1 in the
// sitemap, so it's the indexed homepage. The content-rich classic view lives at
// /classic and is reached via the nav toggle. LocalBusiness structured data is
// kept here so the homepage still carries its core schema.
const jsonLd = {
  "@context": "https://schema.org",
  ...buildBusinessNode(),
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Nav />
      <main id="main" tabIndex={-1} className="bg-[#16130f]">
        <TourFilm rooms={TOUR_ROOMS} />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
