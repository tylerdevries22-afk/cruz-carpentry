-- Cruz Carpentry — initial schema
-- Safe to run multiple times (idempotent).
--
-- Apply this in your project's SQL editor (Supabase Dashboard -> SQL Editor),
-- or via `supabase db push` if you use the CLI.

-- ---------------------------------------------------------------------------
-- leads: estimate requests submitted through the website form.
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  phone       text not null,
  email       text,
  project_type text,
  message     text,
  source      text not null default 'website_estimate_form'
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- RLS on, with NO policies for anon/authenticated: the public can never read or
-- write leads directly. Inserts are performed by the Server Action using the
-- service-role key, which bypasses RLS. Read leads via the dashboard or a
-- privileged server context.
alter table public.leads enable row level security;

-- ---------------------------------------------------------------------------
-- gallery_projects: portfolio items rendered in the "Our Work" gallery.
-- ---------------------------------------------------------------------------
create table if not exists public.gallery_projects (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  title       text not null,
  location    text not null default '',
  alt         text not null default '',
  image_url   text not null,
  sort_order  int not null default 0,
  published   boolean not null default false
);

create index if not exists gallery_projects_published_sort_idx
  on public.gallery_projects (published, sort_order);

alter table public.gallery_projects enable row level security;

-- Anyone may read only the published rows.
drop policy if exists "Public can read published gallery" on public.gallery_projects;
create policy "Public can read published gallery"
  on public.gallery_projects
  for select
  to anon, authenticated
  using (published = true);

-- Seed the gallery from the site's existing images, but only if it's empty.
insert into public.gallery_projects (title, location, alt, image_url, sort_order, published)
select * from (values
  ('Built-In Bookshelves', 'Residential — Denver, CO',
   'Custom floor-to-ceiling bookcase with cabinet base', '/images/project-1.jpg', 1, true),
  ('Walk-In Closet System', 'Residential — Aurora, CO',
   'Custom walk-in closet shelving system spanning full room', '/images/project-2.jpg', 2, true),
  ('Home Office Built-In', 'Residential — Lakewood, CO',
   'Built-in home office desk with surrounding shelving', '/images/project-3.jpg', 3, true)
) as v(title, location, alt, image_url, sort_order, published)
where not exists (select 1 from public.gallery_projects);

-- ---------------------------------------------------------------------------
-- Storage: public bucket for gallery images.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- Public read access to objects in the gallery bucket.
drop policy if exists "Public read for gallery bucket" on storage.objects;
create policy "Public read for gallery bucket"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'gallery');
