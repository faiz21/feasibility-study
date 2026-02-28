-- Client to granularity access mapping for admin master-data flow.

create table if not exists public.client_granularity_access (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  granularity_id uuid not null references public.granularities(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (client_id, granularity_id)
);

create index if not exists idx_client_granularity_access_client
  on public.client_granularity_access (client_id);

create index if not exists idx_client_granularity_access_granularity
  on public.client_granularity_access (granularity_id);

alter table public.client_granularity_access enable row level security;

drop policy if exists "admin_all_client_granularity_access"
  on public.client_granularity_access;

create policy "admin_all_client_granularity_access"
  on public.client_granularity_access
  for all
  using (public.is_admin())
  with check (public.is_admin());
