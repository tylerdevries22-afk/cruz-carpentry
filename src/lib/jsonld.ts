import { PHONE_HREF, SITE_URL } from "@/lib/constants";

export const BUSINESS_ID = `${SITE_URL}/#business`;

/**
 * The GeneralContractor business node. Included on every page that references it
 * (Google parses each document's @graph in isolation, so a `provider` @id only
 * resolves if the node is present on that same page). Address `geo`/streetAddress
 * and `aggregateRating` are intentionally omitted until the owner supplies real
 * data — fabricating a review count or address risks Google penalties.
 */
export function buildBusinessNode() {
  return {
    "@type": "GeneralContractor",
    "@id": BUSINESS_ID,
    name: "Cruz Carpentry",
    description:
      "Custom carpentry and fine millwork serving the Colorado Front Range.",
    url: SITE_URL,
    telephone: PHONE_HREF.replace("tel:", ""),
    image: `${SITE_URL}/icon-512.png`,
    logo: `${SITE_URL}/icon.png`,
    slogan: "Built by Hand. Built to Last.",
    priceRange: "$$",
    areaServed: { "@type": "AdministrativeArea", name: "Colorado Front Range" },
    address: {
      "@type": "PostalAddress",
      addressRegion: "CO",
      addressCountry: "US",
    },
  };
}
