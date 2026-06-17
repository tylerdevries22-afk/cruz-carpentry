-- Cruz Carpentry — editable site CONTENT (copy + home-card order/thumbnails).
-- Mirrors pricing_config (0009): `overrides` is a PARTIAL of the in-code
-- SEED_CONTENT shape ({ copy: {...}, services: { "<slug>": {...} } }) deep-merged
-- over the seed at request time (see src/lib/content/source.ts). Empty table →
-- the site renders the in-code defaults. Append-only: each save inserts a new
-- version and flips the active row, so history is preserved and revert is trivial.

create table if not exists public.content_config (
  id          uuid primary key default gen_random_uuid(),
  version     integer not null,
  label       text,
  overrides   jsonb not null default '{}',
  is_active   boolean not null default false,
  created_at  timestamptz not null default now(),
  created_by  uuid references auth.users (id)
);

create unique index if not exists content_config_version_uq on public.content_config (version);
-- at most one active config
create unique index if not exists content_config_active_uq on public.content_config (is_active) where is_active;

alter table public.content_config enable row level security;

-- Server (service role) reads/writes; admin-only via the env-cookie gate in the
-- Server Actions. RLS denies anon/authenticated entirely (defense in depth).
drop policy if exists content_config_admin_all on public.content_config;
create policy content_config_admin_all on public.content_config
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
