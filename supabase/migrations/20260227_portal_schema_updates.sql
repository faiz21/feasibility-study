-- Requested schema updates:
-- 1) Add client domain
-- 2) Add task-type category
-- 3) Store user access logs with role text
-- 4) Add client-to-template configuration mapping

alter table clients
  add column if not exists domain text;

create unique index if not exists idx_clients_domain_unique
  on clients (lower(domain))
  where domain is not null;

alter table report_type_templates
  add column if not exists category text not null default 'General';

create table if not exists client_report_type_access (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  report_type_template_id uuid not null references report_type_templates(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (client_id, report_type_template_id)
);

create table if not exists user_access_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text,
  role_text text not null,
  client_id uuid references clients(id) on delete set null,
  report_id uuid references reports(id) on delete set null,
  report_page_id uuid references report_pages(id) on delete set null,
  action text not null, -- login | report_open | page_view | logout
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_user_access_logs_user_created
  on user_access_logs(user_id, created_at desc);

create index if not exists idx_user_access_logs_report_created
  on user_access_logs(report_id, created_at desc);

alter table client_report_type_access enable row level security;
alter table user_access_logs enable row level security;

create policy "admin_all_client_report_type_access"
  on client_report_type_access
  for all
  using (is_admin())
  with check (is_admin());

create policy "client_read_own_client_template_access"
  on client_report_type_access
  for select
  using (client_id = user_client_id());

create policy "admin_all_user_access_logs"
  on user_access_logs
  for all
  using (is_admin())
  with check (is_admin());

create policy "client_insert_own_access_logs"
  on user_access_logs
  for insert
  with check (user_id = auth.uid());

create policy "client_read_own_access_logs"
  on user_access_logs
  for select
  using (user_id = auth.uid());
