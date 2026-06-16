import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { PageHeader } from "@/components/ui/PageHeader";
import { GalleryExplorer } from "@/components/gallery/GalleryExplorer";
import { JsonLd } from "@/components/JsonLd";
import { GALLERY_PHOTOS } from "@/components/gallery/photos";
import { SITE_URL } from "@/lib/constants";

const DESCRIPTION =
  "A gallery of real custom carpentry by Cruz Carpentry across the Colorado Front Range — kitchens, staircases, built-ins, closets, beams, trim, fireplaces, and specialty builds.";

export const metadata: Metadata = {
  title: "Gallery",
  description: DESCRIPTION,
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery · Cruz Carpentry",
    description: DESCRIPTION,
    url: "/gallery",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  name: "Cruz Carpentry Project Gallery",
  description: DESCRIPTION,
  url: `${SITE_URL}/gallery`,
  image: GALLERY_PHOTOS.map((p) => ({
    "@type": "ImageObject",
    contentUrl: `${SITE_URL}${p.full}`,
    thumbnailUrl: `${SITE_URL}${p.thumb}`,
    caption: p.alt,
  })),
};

export default function GalleryPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Nav />
      <main id="main" tabIndex={-1}>
        <PageHeader
          eyebrow="Portfolio"
          title={
            <>
              Our <em className="italic">work</em>
            </>
          }
          sub="Real projects from across the Colorado Front Range. Filter by what we build, and open any photo to view it full size."
        />
        <GalleryExplorer />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
