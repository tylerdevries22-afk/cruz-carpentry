import type { EditableService } from "./types";

/** A full editable service row used by the admin Service editors (order +
 *  thumbnail + page text). `slug` identifies it; everything else is editable. */
export type ServiceRow = EditableService & { slug: string };

export type ServiceSeed = Record<string, EditableService>;

/** Project a full Service (or seed entry) down to the editable row shape.
 *  Accepts any object with the editable fields (e.g. a full Service). */
export function toServiceRow(s: ServiceRow): ServiceRow {
  return {
    slug: s.slug,
    num: s.num,
    title: s.title,
    shortTitle: s.shortTitle,
    cardDescription: s.cardDescription,
    cardImage: s.cardImage,
    heroImage: s.heroImage,
    tagline: s.tagline,
    intro: s.intro,
    materials: s.materials,
    details: s.details,
    faq: s.faq,
    showcase: s.showcase,
    seo: s.seo,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

function changed(a: unknown, b: unknown): boolean {
  if (typeof a === "string" && typeof b === "string") return a !== b;
  return JSON.stringify(a) !== JSON.stringify(b);
}

/**
 * Build the complete `services` override from the edited rows vs the in-code
 * seed. `num` is derived from the row's position (so reordering persists), and
 * only fields that differ from the seed are included. The workspace owns the
 * entire services namespace, so this full diff is safe to replace it wholesale.
 */
export function buildServicesOverride(
  rows: ServiceRow[],
  seed: ServiceSeed,
): Record<string, Partial<EditableService>> {
  const out: Record<string, Partial<EditableService>> = {};
  rows.forEach((row, i) => {
    const s = seed[row.slug];
    if (!s) return;
    const entry: Partial<EditableService> = {};
    const newNum = pad(i + 1);
    if (newNum !== s.num) entry.num = newNum;

    (["title", "shortTitle", "cardDescription", "cardImage", "heroImage", "tagline", "intro"] as const).forEach(
      (k) => {
        if (changed(row[k], s[k])) entry[k] = row[k];
      },
    );
    if (changed(row.materials, s.materials)) entry.materials = row.materials;
    if (changed(row.details, s.details)) entry.details = row.details;
    if (changed(row.faq, s.faq)) entry.faq = row.faq;
    if (changed(row.showcase, s.showcase)) entry.showcase = row.showcase;
    if (changed(row.seo, s.seo)) entry.seo = row.seo;

    if (Object.keys(entry).length > 0) out[row.slug] = entry;
  });
  return out;
}
