-- Cruz Carpentry — pricing data layer for the project-inquiry estimate engine.
-- Idempotent. Canonical schema per docs/custom-project-inquiry-spec.md Part 12 /
-- Part A: admin-editable, append-only, version-stamped rate tables that the
-- server-side pricing engine reads (lib/pricing). Wood rows are market-linked
-- (the live CME lumber-futures index is applied at estimate time).
--
-- RLS posture: rate data is readable by the service-role server context (which
-- bypasses RLS) for pricing; writes are admin-only (authenticated JWT with
-- app_metadata.role = 'admin'). No anon access. Append-only: edits insert a new
-- row and flip is_current rather than mutating history, so any past estimate
-- reproduces against the exact rates it used.

-- ---------------------------------------------------------------------------
-- materials: catalog of selectable materials (species, sheet goods, hardware…).
-- ---------------------------------------------------------------------------
create table if not exists public.materials (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  category      text not null check (category in
                  ('wood_species','sheet_good','hardware','finish','trim','panel','glass')),
  unit          text not null check (unit in
                  ('board_ft','sheet','linear_ft','each','pair','gallon','sf')),
  -- Live lumber index applies to this material's rate (solid wood / plywood / wood trim).
  market_linked boolean not null default false,
  is_active     boolean not null default true,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists materials_category_active_idx
  on public.materials (category, is_active, display_order);

-- ---------------------------------------------------------------------------
-- material_rates: append-only, versioned buy-cost per material × tier.
-- markup_pct and waste_factor are fractions (0.25 = 25%, 1.12 = +12%).
-- ---------------------------------------------------------------------------
create table if not exists public.material_rates (
  id            uuid primary key default gen_random_uuid(),
  material_id   uuid not null references public.materials (id) on delete restrict,
  tier          text not null check (tier in ('essential','premium','signature')),
  unit_cost     numeric(12,4) not null check (unit_cost >= 0),
  markup_pct    numeric(5,4) not null default 0.30,
  waste_factor  numeric(5,4) not null default 1.12,
  supplier      text,
  last_verified date not null default current_date,
  is_current    boolean not null default true,
  valid_from    timestamptz not null default now(),
  valid_to      timestamptz,
  notes         text,
  created_by    uuid references auth.users (id),
  created_at    timestamptz not null default now()
);
create index if not exists material_rates_material_idx
  on public.material_rates (material_id);
-- exactly one current rate per material+tier
create unique index if not exists material_rates_current_uq
  on public.material_rates (material_id, tier) where is_current;

-- ---------------------------------------------------------------------------
-- labor_rates: append-only billable hours/rate by task × activity × tier.
-- ---------------------------------------------------------------------------
create table if not exists public.labor_rates (
  id            uuid primary key default gen_random_uuid(),
  task_code     text not null,
  project_type  text,
  activity      text not null check (activity in ('shop','install','finish','design')),
  tier          text not null check (tier in ('essential','premium','signature')),
  unit_hours    numeric(8,3) not null check (unit_hours >= 0),
  hourly_rate   numeric(10,2) not null check (hourly_rate >= 0),
  is_current    boolean not null default true,
  valid_from    timestamptz not null default now(),
  valid_to      timestamptz,
  created_by    uuid references auth.users (id),
  created_at    timestamptz not null default now()
);
create unique index if not exists labor_rates_current_uq
  on public.labor_rates (task_code, activity, tier) where is_current;

-- ---------------------------------------------------------------------------
-- pricing_rules: versioned, append-only multiplier / margin rule set. Exactly
-- one row is active. estimates stamp the version + a full snapshot used.
-- ---------------------------------------------------------------------------
create table if not exists public.pricing_rules (
  id                     uuid primary key default gen_random_uuid(),
  version                integer not null unique,
  semver                 text not null,
  engine_version         text not null,
  tier_margins           jsonb not null,   -- {essential:0.13, premium:0.20, signature:0.25}
  tier_multipliers       jsonb not null,
  project_type_multipliers jsonb not null,
  complexity_multipliers jsonb not null,
  finish_multipliers     jsonb not null,
  access_multipliers     jsonb not null,
  rush_multiplier        numeric(5,4) not null default 1.30,
  risk_buffers           jsonb not null,
  confidence_range       jsonb not null,   -- {high:{low,high}, medium:{...}, low:{...}}
  project_minimums       jsonb not null,
  repair_trip_min        numeric(10,2) not null default 275,
  contingency_pct        numeric(5,4) not null default 0.10,
  is_active              boolean not null default false,
  effective_from         timestamptz not null default now(),
  effective_to           timestamptz,
  created_by             uuid references auth.users (id),
  created_at             timestamptz not null default now()
);
-- guarantee a single active ruleset
create unique index if not exists pricing_rules_active_uq
  on public.pricing_rules (is_active) where is_active;

-- ---------------------------------------------------------------------------
-- market_index_snapshots: audit trail of the live wood-market index pulls
-- (CME lumber futures) and the derived factor applied to estimates.
-- ---------------------------------------------------------------------------
create table if not exists public.market_index_snapshots (
  id           uuid primary key default gen_random_uuid(),
  source       text not null,        -- e.g. 'CME Lumber Futures (LBR=F)'
  index_value  numeric(12,4),        -- USD / 1,000 board feet
  factor       numeric(6,4) not null,-- damped, clamped multiplier applied to wood
  stale        boolean not null default false,
  fetched_at   timestamptz not null default now()
);
create index if not exists market_index_snapshots_fetched_idx
  on public.market_index_snapshots (fetched_at desc);

-- ---------------------------------------------------------------------------
-- RLS: enable on every table. Service-role (server) bypasses RLS for pricing
-- reads. Admin writes/reads via a JWT role claim. No anon access.
-- ---------------------------------------------------------------------------
alter table public.materials              enable row level security;
alter table public.material_rates         enable row level security;
alter table public.labor_rates            enable row level security;
alter table public.pricing_rules          enable row level security;
alter table public.market_index_snapshots enable row level security;

-- Admin-only access policies (role claim set in app_metadata, never client-writable).
do $$
declare t text;
begin
  foreach t in array array[
    'materials','material_rates','labor_rates','pricing_rules','market_index_snapshots'
  ] loop
    execute format(
      'drop policy if exists %1$s_admin_all on public.%1$s;', t);
    execute format($p$
      create policy %1$s_admin_all on public.%1$s
        for all to authenticated
        using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
        with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
    $p$, t);
  end loop;
end $$;

-- NOTE: `materials` may also need public SELECT so the wizard can render the
-- material picker. Add that policy when the wizard ships, e.g.:
--   create policy materials_public_read on public.materials
--     for select to anon, authenticated using (is_active);
