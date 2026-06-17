import type { CopyTree } from "./copy";

/** Recursively-optional version of a type — the override stores only changed leaves. */
export type DeepPartial<T> = T extends (infer U)[]
  ? U[] // arrays are replaced wholesale, never element-merged
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

/**
 * The editable subset of a Service. Excludes identity/structural fields that the
 * Content editor must never change: `slug` (URL + redirects), `Icon` (a live React
 * component, not serializable), `galleryIndices` (1-based refs into the photo
 * manifest), and `projectType` (must stay in PROJECT_TYPES for the estimate form).
 */
export interface EditableService {
  num: string;
  title: string;
  shortTitle: string;
  cardDescription: string;
  cardImage: string;
  heroImage: string;
  tagline: string;
  intro: string;
  materials: string[];
  details: { title: string; body: string }[];
  faq: { q: string; a: string }[];
  showcase?: { image: string; caption: string }[];
  seo: { title: string; description: string };
}

export const EDITABLE_SERVICE_FIELDS: (keyof EditableService)[] = [
  "num",
  "title",
  "shortTitle",
  "cardDescription",
  "cardImage",
  "heroImage",
  "tagline",
  "intro",
  "materials",
  "details",
  "faq",
  "showcase",
  "seo",
];

/** A partial override blob, persisted as `content_config.overrides` (jsonb). */
export interface ContentOverride {
  copy?: DeepPartial<CopyTree>;
  services?: Record<string, Partial<EditableService>>;
}
