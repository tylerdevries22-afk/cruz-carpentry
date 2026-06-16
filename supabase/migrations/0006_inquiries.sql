-- Cruz Carpentry — project-inquiry wizard submissions + computed estimate.
-- Idempotent / additive. Separate from public.leads (the simple contact form):
-- this row holds the full wizard payload and the engine's preliminary estimate.
-- Writes happen via the Server Action using the service-role key (bypasses RLS);
-- the public can never read or write directly.

create table if not exists public.inquiries (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  -- contact
  first_name      text not null,
  last_name       text not null,
  email           text,
  phone           text not null,
  zip             text,
  contact_role    text,
  preferred_contact text,
  permission_to_text boolean not null default false,
  -- project selection
  project_type    text not null,
  tier            text not null check (tier in ('essential','premium','signature')),
  finish          text,
  design_style    text,
  timeline        text,
  budget_band     text,
  priority        text,
  -- full inputs (the exact engine input + per-area measurements)
  calculator_input jsonb not null default '{}',
  areas            jsonb not null default '[]',
  -- computed preliminary estimate (engine output snapshot)
  est_low         numeric(12,2),
  est_point       numeric(12,2),
  est_high        numeric(12,2),
  est_confidence  text check (est_confidence in ('high','medium','low')),
  est_breakdown   jsonb,
  est_market      jsonb,
  engine_version  text,
  rules_version   text,
  -- lifecycle (canonical 8-state machine, Part A §A2)
  status          text not null default 'submitted'
                    check (status in ('draft','submitted','reviewing','contacted','quoted','scheduled','won','lost')),
  source          text not null default 'website_estimate_wizard'
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx on public.inquiries (status);

-- Defense-in-depth length checks mirroring the zod schema.
alter table public.inquiries drop constraint if exists inquiries_first_name_len;
alter table public.inquiries add constraint inquiries_first_name_len check (char_length(first_name) between 1 and 100);
alter table public.inquiries drop constraint if exists inquiries_last_name_len;
alter table public.inquiries add constraint inquiries_last_name_len check (char_length(last_name) between 1 and 100);
alter table public.inquiries drop constraint if exists inquiries_phone_len;
alter table public.inquiries add constraint inquiries_phone_len check (char_length(phone) between 7 and 25);
alter table public.inquiries drop constraint if exists inquiries_email_len;
alter table public.inquiries add constraint inquiries_email_len check (email is null or char_length(email) <= 200);
alter table public.inquiries drop constraint if exists inquiries_project_type_len;
alter table public.inquiries add constraint inquiries_project_type_len check (char_length(project_type) <= 60);

-- RLS on, NO anon/authenticated policies: only the service-role Server Action writes.
alter table public.inquiries enable row level security;
