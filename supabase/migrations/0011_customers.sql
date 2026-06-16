-- Cruz Carpentry — customer accounts (auto-created on form submit) + consultation
-- bookings. Idempotent / additive. Auth is custom (scrypt password_hash + signed
-- session cookie, see src/lib/customer-auth.ts); these tables are touched only by
-- the service-role server after verifying the session, so RLS has no public
-- policies. Email is stored lowercased with a unique constraint.

create table if not exists public.customers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  full_name     text,
  phone         text,
  password_hash text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.inquiries
  add column if not exists customer_id uuid references public.customers (id) on delete set null;
create index if not exists inquiries_customer_id_idx on public.inquiries (customer_id);

create table if not exists public.consultation_bookings (
  id               uuid primary key default gen_random_uuid(),
  inquiry_id       uuid references public.inquiries (id) on delete cascade,
  customer_id      uuid references public.customers (id) on delete cascade,
  preferred_date   date,
  preferred_window text,
  mode             text not null default 'on_site' check (mode in ('on_site', 'video', 'phone')),
  notes            text,
  status           text not null default 'requested'
                     check (status in ('requested', 'confirmed', 'rescheduled', 'canceled', 'completed', 'no_show')),
  created_at       timestamptz not null default now()
);
create index if not exists consultation_bookings_inquiry_idx on public.consultation_bookings (inquiry_id);
create index if not exists consultation_bookings_customer_idx on public.consultation_bookings (customer_id);

alter table public.customers enable row level security;
alter table public.consultation_bookings enable row level security;
-- No anon/authenticated policies: only the service-role server context (which
-- verifies the signed customer-session cookie) reads/writes these.
