-- Cruz Carpentry — Jobs (project management) for the admin dashboard.
-- Idempotent / additive. One row per active/closed job; the rich, list-shaped
-- data (materials shopping list, before/progress/after photos, payments,
-- documents, activity notes) lives in jsonb so the demo seeds easily and the
-- interactive widgets toggle one field. Service-role / admin only.

create table if not exists public.jobs (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  title           text not null,
  -- client & site
  client_name     text not null,
  client_email    text,
  client_phone    text,
  address         text,
  project_type    text not null default 'Custom Woodwork',
  inquiry_id      uuid,
  -- pipeline
  stage           text not null default 'consult'
                    check (stage in ('consult','design','materials','build','install','done')),
  status          text not null default 'active'
                    check (status in ('active','complete','on_hold')),
  start_date      date,
  target_date     date,
  -- budget
  budget_quoted   numeric(12,2),
  budget_actual   numeric(12,2),
  deposit         numeric(12,2),
  -- media + modules
  cover_image     text,
  materials       jsonb not null default '[]',
  photos          jsonb not null default '[]',
  payments        jsonb not null default '[]',
  documents       jsonb not null default '[]',
  notes           jsonb not null default '[]',
  source          text not null default 'admin'
);

create index if not exists jobs_status_idx on public.jobs (status);
create index if not exists jobs_created_at_idx on public.jobs (created_at desc);

-- RLS on, NO anon/authenticated policies: only the service-role server context
-- (admin pages + actions) reads/writes.
alter table public.jobs enable row level security;
