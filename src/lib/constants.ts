export const PHONE = "(720) 280-0812";
export const PHONE_HREF = "tel:+17202800812";
/**
 * Canonical production origin (no trailing slash). Set `NEXT_PUBLIC_SITE_URL` in
 * the environment when a custom domain ships so canonicals/sitemap/JSON-LD/OG all
 * switch in one place; falls back to the Vercel URL.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://cruz-carpentry.vercel.app";
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
