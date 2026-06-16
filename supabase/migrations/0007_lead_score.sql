-- Cruz Carpentry — persist the computed lead score + category on each inquiry.
-- Idempotent / additive. Score (0–100) and category are computed in the submit
-- Server Action (src/lib/lead-score.ts) so the owner can triage at a glance.

alter table public.inquiries add column if not exists lead_score integer;
alter table public.inquiries add column if not exists lead_category text;
alter table public.inquiries add column if not exists lead_factors jsonb;

alter table public.inquiries drop constraint if exists inquiries_lead_score_range;
alter table public.inquiries
  add constraint inquiries_lead_score_range
  check (lead_score is null or (lead_score between 0 and 100));

alter table public.inquiries drop constraint if exists inquiries_lead_category_allowed;
alter table public.inquiries
  add constraint inquiries_lead_category_allowed
  check (lead_category is null or lead_category in ('hot','warm','luxury','budget','low_fit'));

create index if not exists inquiries_lead_category_idx on public.inquiries (lead_category, created_at desc);
