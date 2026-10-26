-- Oreone Insights CMS schema for Supabase.
-- Run in Supabase Dashboard > SQL Editor. Safe to re-run during initial setup.
-- Do not put a Supabase secret/service_role key in browser files.

create table if not exists public.oreone_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  added_at timestamptz not null default now()
);

create table if not exists public.insights (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  excerpt text not null default '' check (char_length(excerpt) <= 350),
  body text not null default '',
  category text not null default 'Development',
  author text not null default 'Oreone International Limited',
  featured_image_url text,
  seo_title text,
  meta_description text,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  published_at timestamptz
);

-- If this script is run against a table created by the earlier starter, add any newer columns.
alter table public.insights add column if not exists featured_image_url text;
alter table public.insights add column if not exists seo_title text;
alter table public.insights add column if not exists meta_description text;
alter table public.insights add column if not exists published_at timestamptz;
alter table public.insights add column if not exists created_at timestamptz not null default now();

create index if not exists insights_published_at_idx on public.insights (published_at desc);
create index if not exists insights_status_slug_idx on public.insights (status, slug);

alter table public.oreone_admins enable row level security;
alter table public.insights enable row level security;

-- Explicitly remove any broad default grants before granting only required capabilities.
revoke all on table public.oreone_admins from anon, authenticated;
revoke all on table public.insights from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on table public.oreone_admins to authenticated;
grant select on table public.insights to anon, authenticated;
grant insert, update, delete on table public.insights to authenticated;

drop policy if exists "Admins can read their own admin membership" on public.oreone_admins;
drop policy if exists "Anyone can read published insights" on public.insights;
drop policy if exists "Admins can read all insights" on public.insights;
drop policy if exists "Admins can create insights" on public.insights;
drop policy if exists "Admins can update insights" on public.insights;
drop policy if exists "Admins can delete insights" on public.insights;

create policy "Admins can read their own admin membership"
on public.oreone_admins for select to authenticated
using ((select auth.uid()) is not null and user_id = (select auth.uid()));

create policy "Anyone can read published insights"
on public.insights for select to anon, authenticated
using (status = 'published');

create policy "Admins can read all insights"
on public.insights for select to authenticated
using (exists (select 1 from public.oreone_admins a where a.user_id = (select auth.uid())));

create policy "Admins can create insights"
on public.insights for insert to authenticated
with check (exists (select 1 from public.oreone_admins a where a.user_id = (select auth.uid())));

create policy "Admins can update insights"
on public.insights for update to authenticated
using (exists (select 1 from public.oreone_admins a where a.user_id = (select auth.uid())))
with check (exists (select 1 from public.oreone_admins a where a.user_id = (select auth.uid())));

create policy "Admins can delete insights"
on public.insights for delete to authenticated
using (exists (select 1 from public.oreone_admins a where a.user_id = (select auth.uid())));

-- Maintain the publish timestamp consistently, including updates made outside the admin UI.
create or replace function public.set_oreone_insight_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status <> 'published' then
    new.published_at := null;
  elsif tg_op = 'INSERT' then
    new.published_at := coalesce(new.published_at, now());
  elsif old.status is distinct from 'published' or old.published_at is null then
    new.published_at := coalesce(new.published_at, now());
  else
    new.published_at := old.published_at;
  end if;
  return new;
end;
$$;

drop trigger if exists set_oreone_insight_published_at on public.insights;
create trigger set_oreone_insight_published_at
before insert or update of status, published_at on public.insights
for each row execute function public.set_oreone_insight_published_at();
revoke all on function public.set_oreone_insight_published_at() from public, anon, authenticated;

-- Admin bootstrap steps (perform manually after creating the editor in Auth):
-- 1. Supabase Dashboard > Authentication > Users > Add user.
-- 2. Copy the new user's UUID.
-- 3. Run this statement with the actual UUID in the SQL Editor:
-- insert into public.oreone_admins (user_id) values ('PASTE-AUTH-USER-UUID-HERE');
-- Do not grant INSERT/UPDATE/DELETE on oreone_admins to public clients.
