-- Cruz Carpentry — capture existing-site conditions + project goals/motivations
-- from the expanded wizard. Idempotent / additive.
alter table public.inquiries add column if not exists conditions jsonb not null default '[]';
alter table public.inquiries add column if not exists goals jsonb not null default '[]';
