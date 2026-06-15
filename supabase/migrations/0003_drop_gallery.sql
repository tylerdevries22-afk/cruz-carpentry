-- Cruz Carpentry — remove the now-unused gallery table.
-- The gallery is served from local WebP assets (public/gallery), so the
-- Supabase gallery table and its policy are no longer used by the app.
-- Supabase now backs only the estimate form (public.leads). Idempotent.
--
-- Note: the empty `gallery` storage bucket is left in place — Supabase blocks
-- deleting storage objects/buckets via SQL. Remove it from the dashboard or the
-- Storage API if you want it gone; it holds no objects and isn't referenced.

drop policy if exists "Public read for gallery bucket" on storage.objects;

-- Drops the table and its "Public can read published gallery" policy.
drop table if exists public.gallery_projects;
