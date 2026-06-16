-- Cruz Carpentry — editable rate config for the pricing engine.
-- Idempotent / additive. `overrides` is a PARTIAL rate snapshot (any subset of
-- the in-code SEED_SNAPSHOT shape: { materials, hardware, labor }) deep-merged
-- over the seed at estimate time (see src/lib/pricing/rate-source.ts). Empty
-- table → engine uses the in-code seed. Edit/insert an active row to change
-- material or labor rates WITHOUT a code deploy.
--
-- Example (raise Premium shop labor to $108/hr, walnut buy-cost to $17/bf):
--   insert into public.pricing_config (version, label, overrides, is_active)
--   values (1, 'Q3 supplier bump',
--     '{"labor":{"shop":{"premium":108}},
--       "materials":{"signature":{"solid":{"unitCost":17}}}}', true);

create table if not exists public.pricing_config (
  id          uuid primary key default gen_random_uuid(),
  version     integer not null,
  label       text,
  overrides   jsonb not null default '{}',
  is_active   boolean not null default false,
  created_at  timestamptz not null default now(),
  created_by  uuid references auth.users (id)
);

create unique index if not exists pricing_config_version_uq on public.pricing_config (version);
-- at most one active config
create unique index if not exists pricing_config_active_uq on public.pricing_config (is_active) where is_active;

alter table public.pricing_config enable row level security;

-- Server (service role) reads for pricing; admin-only writes.
drop policy if exists pricing_config_admin_all on public.pricing_config;
create policy pricing_config_admin_all on public.pricing_config
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
