import "server-only";
import { headers } from "next/headers";

/**
 * Best-effort client IP for rate limiting. Prefers platform-set headers over
 * the client-spoofable leftmost `x-forwarded-for` hop. Used by the estimate
 * API route and the inquiry Server Action.
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const platformIp =
    h.get("x-real-ip") || h.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  if (platformIp) return platformIp;
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
