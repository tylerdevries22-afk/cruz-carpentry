import { CTA } from "@/components/CTA";
import { EstimateForm } from "@/components/EstimateForm";
import { Gallery } from "@/components/gallery/Gallery";
import { ServiceHero } from "@/components/service/ServiceHero";
import { ServiceIntro } from "@/components/service/ServiceIntro";
import { ServiceProcess } from "@/components/service/ServiceProcess";
import { ServiceMaterials } from "@/components/service/ServiceMaterials";
import { ServiceDetails } from "@/components/service/ServiceDetails";
import { ServiceFAQ } from "@/components/service/ServiceFAQ";
import { RelatedServices } from "@/components/service/RelatedServices";
import { GALLERY_PHOTOS } from "@/components/gallery/photos";
import type { Service } from "@/lib/services";

/**
 * The full body of a service detail page (everything between <Nav> and <Footer>).
 * Shared by the real route (`/services/[slug]`) and the embeddable route
 * (`/services/[slug]/embed`) that the /tour overlay loads in an iframe.
 *
 * `embed` drops RelatedServices — its links would navigate the overlay's iframe
 * away from the focused build — but keeps everything else identical so the
 * overlay shows the same page the visitor would otherwise land on.
 */
export function ServiceDetailSections({
  service,
  embed = false,
}: {
  service: Service;
  embed?: boolean;
}) {
  // Real Cruz project photos for this category (1-based cruz-NN → manifest).
  const photos = service.galleryIndices
    .map((n) => GALLERY_PHOTOS[n - 1])
    .filter(Boolean);

  return (
    <>
      <ServiceHero service={service} />
      <ServiceIntro service={service} />
      <ServiceProcess />
      <ServiceMaterials service={service} />
      <ServiceDetails service={service} />
      {photos.length > 0 && (
        <Gallery
          photos={photos}
          eyebrow="Selected Work"
          heading={
            <>
              {service.shortTitle},
              <br />
              <em className="italic">up close</em>
            </>
          }
          subheading="Real projects across the Front Range · select to enlarge"
          id="work"
        />
      )}
      <ServiceFAQ service={service} />
      {!embed && <RelatedServices current={service} />}
      <EstimateForm defaultProjectType={service.projectType} />
      <CTA />
    </>
  );
}
