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

/**
 * One shared motion language for the whole site.
 *
 * SCRUB_SPRING smooths every scroll-linked MotionValue (hero parallax, the wood
 * story scrub, section background/header parallax). It is mildly OVERDAMPED
 * (damping ratio ζ = 18 / (2·√55) ≈ 1.21, natural freq ≈ 7.4 rad/s): a floaty
 * trailing glide that lags the scroll just enough to feel slow-luxury, with
 * zero overshoot so a scrubber never visibly bounces/wobbles on scroll-stop.
 * Replaces the five ad-hoc configs that previously made each section feel
 * different. Keep ζ within ~1.1–1.3 for a scrub; never drop under 1.0.
 */
export const SCRUB_SPRING = { stiffness: 55, damping: 18, restDelta: 0.0005 } as const;

/**
 * Canonical one-shot reveal (whileInView / load). Slow-luxury arrival: a long
 * EASE-out tail over ~0.9s with a generous rise. Use REVEAL_STAGGER * index for
 * a real cascade across grids (cap the index so late items don't wait forever).
 */
export const REVEAL_DURATION = 0.9;
export const REVEAL_Y = 36;
export const REVEAL_STAGGER = 0.09;
