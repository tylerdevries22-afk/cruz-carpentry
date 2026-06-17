/** The public Storage bucket all site media is served from. Kept in one place so
 *  the image picker, URL builder, and validator agree (host is also pinned in
 *  next.config.ts `images.remotePatterns`). */
export const WHAT_WE_BUILD_BUCKET = "what-we-build";
export const STORAGE_HOST = "https://nkarcozbgtgtcqfhytrx.supabase.co";
export const WHAT_WE_BUILD_PREFIX = `${STORAGE_HOST}/storage/v1/object/public/${WHAT_WE_BUILD_BUCKET}/`;

/** Build a public URL for an object path within the what-we-build bucket. */
export function publicUrl(objectPath: string): string {
  return `${WHAT_WE_BUILD_PREFIX}${objectPath.replace(/^\/+/, "")}`;
}

/** A valid card/hero/showcase image: a what-we-build public URL ending in an
 *  optimizable image extension (matches the services.test invariant + the
 *  next.config remotePattern). */
export function isValidImageUrl(url: unknown): url is string {
  return (
    typeof url === "string" &&
    url.startsWith(WHAT_WE_BUILD_PREFIX) &&
    /\.(webp|jpg|jpeg|png)$/i.test(url)
  );
}
