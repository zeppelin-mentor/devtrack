create table if not exists public.mcp_api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text,
  key_prefix text not null,
  key_hash text not null unique,
  is_active boolean not null default true,
  requests_today integer not null default 0,
  requests_date date not null default current_date,
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_mcp_api_keys_user_id on public.mcp_api_keys(user_id);
create index if not exists idx_mcp_api_keys_active on public.mcp_api_keys(is_active);
create index if not exists idx_mcp_api_keys_requests_date on public.mcp_api_keys(requests_date);

alter table public.mcp_api_keys enable row level security;

create policy "Users can view own mcp keys"
  on public.mcp_api_keys
  for select
  using (auth.uid() = user_id);

create policy "Users can create own mcp keys"
  on public.mcp_api_keys
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own mcp keys"
  on public.mcp_api_keys
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own mcp keys"
  on public.mcp_api_keys
  for delete
  using (auth.uid() = user_id);
