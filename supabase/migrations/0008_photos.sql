-- Cruz Carpentry — guided photo uploads for the estimate wizard.
-- Idempotent / additive. Photos go to a PRIVATE Storage bucket; only the
-- service-role server context (uploads) and admins (via signed URLs) ever
-- touch them. Photo metadata (storage path + label + dimensions) is recorded
-- on the inquiry as jsonb so the owner sees the project's actual space.

-- Private bucket (no public read; not indexable).
insert into storage.buckets (id, name, public)
values ('inquiry-photos', 'inquiry-photos', false)
on conflict (id) do nothing;

-- No public/anon policies on this bucket: the upload route uses the service
-- role (bypasses RLS) and admin reads are via short-TTL signed URLs.

-- Photo metadata on the inquiry: [{ path, label, bytes, width, height }].
alter table public.inquiries add column if not exists photos jsonb not null default '[]';
