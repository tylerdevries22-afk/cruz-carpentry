/**
 * SEED_COPY — the in-code default for all editable site copy (page headlines,
 * eyebrows, body prose, CTA labels, FAQs, and per-page SEO). Source of shape AND
 * graceful fallback: the admin Content editor saves only the leaves that differ,
 * deep-merged over this tree at request time (see src/lib/content/source.ts).
 *
 * Conventions:
 *  - Every leaf is a plain string. Multi-line headings use "\n" for a line break
 *    (render via the `lines()` helper / a <br/> between segments).
 *  - The hero <h1> brand name and decorative glyphs are NOT here (brand/structural).
 *  - Field/wizard microcopy and validation messages are excluded (out of scope).
 *
 * Service-page copy lives in the SERVICES seed (edited via the Service tab), not
 * here. Composed from per-area modules so they can be edited independently.
 */

import { HOME } from "./copy/home";
import { ABOUT, CONTACT, FAQ_PAGE, SERVICE_AREAS, SERVICES_HUB, ESTIMATE } from "./copy/pages";
import { CAREERS } from "./copy/careers";

export const SEED_COPY = {
  home: HOME,
  about: ABOUT,
  contact: CONTACT,
  faq: FAQ_PAGE,
  serviceAreas: SERVICE_AREAS,
  servicesHub: SERVICES_HUB,
  estimate: ESTIMATE,
  careers: CAREERS,
};

/** The shape every consumer reads. Leaves are plain `string` (editable). */
export type CopyTree = typeof SEED_COPY;

/** Split a "\n"-delimited heading into its lines for <br/> rendering. */
export function lines(value: string): string[] {
  return value.split("\n");
}
