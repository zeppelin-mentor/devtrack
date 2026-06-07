create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  parent_id uuid references public.pages(id) on delete set null,
  title text not null,
  slug text,
  content text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  icon text,
  cover_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_pages_user_id on public.pages(user_id);
create index if not exists idx_pages_project_id on public.pages(project_id);
create index if not exists idx_pages_parent_id on public.pages(parent_id);
create index if not exists idx_pages_status on public.pages(status);
create index if not exists idx_pages_updated_at on public.pages(updated_at desc);
create index if not exists idx_pages_search on public.pages using gin (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')));
create unique index if not exists idx_pages_user_slug_unique on public.pages(user_id, slug) where slug is not null;

create or replace function public.set_pages_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_pages_updated_at on public.pages;
create trigger set_pages_updated_at
  before update on public.pages
  for each row
  execute function public.set_pages_updated_at();

alter table public.pages enable row level security;

create policy "Users can view own pages"
  on public.pages
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create own pages"
  on public.pages
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own pages"
  on public.pages
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own pages"
  on public.pages
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
