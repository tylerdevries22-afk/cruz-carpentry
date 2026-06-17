# Site Content Editor (`/admin/content`)

Lets the admin edit site copy and the home-page cards without a deploy. Mirrors
the Rate-editor pattern: an in-code **seed** is the default + fallback; the admin
saves a **partial override** to Supabase; pages deep-merge the override over the
seed at request time. Saving calls `revalidateTag("site-content")` so static/ISR
pages pick up the change within a request — no redeploy.

## Three tabs
- **Home-page cards** — drag/arrow reorder (persists as a `num` permutation) and
  swap each card's thumbnail from the image library.
- **Service pages** — edit the text on every `/services/[slug]` page (title,
  tagline, intro, materials, details, FAQ, SEO) and home-card descriptions.
- **Page copy** — edit the non-service page copy (home, about, contact, faq,
  service areas, services hub, estimate, careers) + per-page SEO.

The Cards + Service-pages tabs share **one** services state and **one** save (they
both own the `services` namespace, so this prevents clobbering). Page copy owns
the separate `copy` namespace.

## How it fits together
- `src/lib/content/copy.ts` + `copy/*.ts` — `SEED_COPY` (page copy defaults).
- `src/lib/services.ts` — `SERVICES` is the seed for service/card data.
- `src/lib/content/source.ts` — `loadContent()` reads the active override
  (cached, tagged `site-content`), deep-merges over the seeds, **fails open** to
  the seed on any error. `getResolvedServiceBySlug`, `getResolvedServicesOrdered`,
  `getResolvedCopy` are the DB-aware read helpers consumers use.
- `src/app/actions/content.ts` — `saveContentOverrides` (validate → namespace-
  preserving merge → versioned append-only insert → revalidate), `revertContentToSeed`,
  `listLibraryImages`.
- `src/lib/content/validate.ts` — strict validation (string limits, image-URL
  allowlist, `num` permutation, prototype-pollution guard).
- DB: `supabase/migrations/0015_content_config.sql` (clone of `pricing_config`).

## Adding a new editable copy field
Add the key to the relevant `src/lib/content/copy/*.ts` module with its current
default string, then read it in the component via `getResolvedCopy()` (server) or
a prop threaded from the page (client). The generic editor picks it up
automatically — no per-field form code. Use `\n` for line breaks and `*italic*`
for emphasis, rendered via `renderCopy()`.

## Not editable here (by design)
Service `slug`/`Icon`/`galleryIndices`/`projectType`; the hero brand name;
estimate-form & wizard microcopy and validation messages; the shared CTA band;
auto-generated gallery alt text.
