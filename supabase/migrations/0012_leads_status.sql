-- Cruz Carpentry — give the quick "Request a Quote" leads a lifecycle so they
-- can be triaged in the admin dashboard alongside the wizard inquiries.
-- Idempotent / additive. `leads` holds the simple contact-form submissions
-- (name/phone/email/project_type/message); `inquiries` holds the full wizard
-- payload + estimate. Both now surface in /admin.

alter table public.leads
  add column if not exists status text not null default 'submitted'
    check (status in ('draft','submitted','reviewing','contacted','quoted','scheduled','won','lost'));

alter table public.leads
  add column if not exists updated_at timestamptz not null default now();

create index if not exists leads_status_idx on public.leads (status);
