-- Cruz Carpentry — defense-in-depth constraints on public.leads
-- Mirrors the zod validation in src/lib/estimate-schema.ts so the database
-- rejects malformed rows even if a future writer skips the Server Action.
-- Idempotent: drop-then-add each named constraint.

alter table public.leads drop constraint if exists leads_name_len;
alter table public.leads
  add constraint leads_name_len check (char_length(name) between 2 and 100);

alter table public.leads drop constraint if exists leads_phone_len;
alter table public.leads
  add constraint leads_phone_len check (char_length(phone) between 7 and 25);

alter table public.leads drop constraint if exists leads_email_len;
alter table public.leads
  add constraint leads_email_len check (email is null or char_length(email) <= 200);

alter table public.leads drop constraint if exists leads_project_type_len;
alter table public.leads
  add constraint leads_project_type_len check (project_type is null or char_length(project_type) <= 60);

alter table public.leads drop constraint if exists leads_message_len;
alter table public.leads
  add constraint leads_message_len check (message is null or char_length(message) <= 2000);

alter table public.leads drop constraint if exists leads_source_allowed;
alter table public.leads
  add constraint leads_source_allowed
  check (source in ('website_estimate_form', 'verification_script'));
