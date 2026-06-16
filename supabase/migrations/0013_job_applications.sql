-- Cruz Carpentry — "Join the Craft" carpenter job applications.
-- Idempotent / additive. Resume / cover letter / work photos live in a PRIVATE
-- Storage bucket; only the service-role upload route writes and admins read via
-- short-TTL signed URLs. Application data is one row; file metadata is jsonb.

create table if not exists public.job_applications (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  -- contact
  full_name          text not null,
  email              text not null,
  phone              text not null,
  location           text not null,
  work_authorized    boolean not null default false,
  -- role & experience
  role               text not null,
  experience_years   int not null default 0,
  experience_level   text,
  current_employer   text,
  -- skills
  specialties        jsonb not null default '[]',
  tools              jsonb not null default '[]',
  certifications     jsonb not null default '[]',
  -- availability & logistics
  availability       jsonb not null default '[]',
  start_date         text,
  portfolio_url      text,
  -- uploads: { path, name, bytes }
  resume             jsonb,
  cover_letter       jsonb,
  work_photos        jsonb not null default '[]',
  -- a few words
  why_cruz           text not null,
  proud_of           text,
  salary_expectation text,
  referral_source    text,
  referral_name      text,
  upload_token       uuid,
  -- lifecycle
  status             text not null default 'new'
                       check (status in ('new','reviewing','interviewing','hired','rejected','archived')),
  source             text not null default 'website_careers'
);

create index if not exists job_applications_created_at_idx on public.job_applications (created_at desc);
create index if not exists job_applications_status_idx on public.job_applications (status);

-- Defense-in-depth length checks mirroring the zod schema.
alter table public.job_applications drop constraint if exists job_applications_name_len;
alter table public.job_applications add constraint job_applications_name_len check (char_length(full_name) between 1 and 100);
alter table public.job_applications drop constraint if exists job_applications_email_len;
alter table public.job_applications add constraint job_applications_email_len check (char_length(email) <= 200);
alter table public.job_applications drop constraint if exists job_applications_phone_len;
alter table public.job_applications add constraint job_applications_phone_len check (char_length(phone) between 7 and 25);
alter table public.job_applications drop constraint if exists job_applications_why_len;
alter table public.job_applications add constraint job_applications_why_len check (char_length(why_cruz) <= 1500);

-- RLS on, NO anon/authenticated policies: only the service-role Server Action writes.
alter table public.job_applications enable row level security;

-- Private bucket for resumes / cover letters / work photos (no public read).
insert into storage.buckets (id, name, public)
values ('careers-uploads', 'careers-uploads', false)
on conflict (id) do nothing;
