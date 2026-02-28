-- Multi-tenant report portal schema
-- Run in Supabase SQL editor or migration pipeline.

create extension if not exists pgcrypto;

create type app_role as enum ('admin', 'client');
create type app_locale as enum ('en', 'id', 'ja');
create type report_status as enum ('draft', 'published');

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  default_locale app_locale not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role app_role not null default 'client',
  client_id uuid references clients(id) on delete set null,
  locale app_locale not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists granularities (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null unique,
  created_at timestamptz not null default now()
);

insert into granularities (code, name)
values
  ('plant', 'Plant'),
  ('company', 'Company'),
  ('equipment', 'Equipment'),
  ('solution', 'Solution'),
  ('custom', 'Custom'),
  ('module', 'Module'),
  ('process', 'Process'),
  ('analysts', 'Analysts'),
  ('function_group', 'Function Group')
on conflict (code) do update set name = excluded.name;

create table if not exists report_type_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  granularity_id uuid not null references granularities(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists report_page_templates (
  id uuid primary key default gen_random_uuid(),
  report_type_template_id uuid not null references report_type_templates(id) on delete cascade,
  page_key text not null,
  page_order int not null,
  title text not null,
  html_template text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (report_type_template_id, page_key),
  unique (report_type_template_id, page_order)
);

create table if not exists report_entities (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  granularity_id uuid not null references granularities(id),
  name text not null,
  description text,
  photo_url text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references report_entities(id) on delete cascade,
  report_type_template_id uuid not null references report_type_templates(id),
  thumbnail_url text,
  status report_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists report_translations (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports(id) on delete cascade,
  locale app_locale not null,
  title text not null,
  summary text,
  unique (report_id, locale)
);

create table if not exists report_pages (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports(id) on delete cascade,
  report_page_template_id uuid not null references report_page_templates(id),
  page_order int not null,
  en_content jsonb not null default '{}'::jsonb,
  id_content jsonb,
  ja_content jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (report_id, report_page_template_id),
  unique (report_id, page_order)
);

create table if not exists report_page_translations (
  id uuid primary key default gen_random_uuid(),
  report_page_id uuid not null references report_pages(id) on delete cascade,
  locale app_locale not null,
  title text not null,
  unique (report_page_id, locale)
);

create table if not exists client_reports (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  report_id uuid not null references reports(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  unique (client_id, report_id)
);

create table if not exists report_page_activity (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports(id) on delete cascade,
  report_page_id uuid not null references report_pages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  first_opened_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  completed_at timestamptz,
  time_spent_sec int not null default 0,
  max_scroll_pct numeric(5,2) not null default 0,
  open_count int not null default 1,
  last_locale app_locale not null default 'en',
  unique (report_page_id, user_id)
);

create table if not exists report_resume (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  last_page_id uuid references report_pages(id) on delete set null,
  last_scroll_y int not null default 0,
  last_anchor text,
  last_locale app_locale not null default 'en',
  updated_at timestamptz not null default now(),
  unique (report_id, user_id)
);

create table if not exists report_ratings (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (report_id, user_id)
);

create table if not exists internal_notes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  report_id uuid references reports(id) on delete set null,
  body text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists page_notes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  report_id uuid not null references reports(id) on delete cascade,
  report_page_id uuid not null references report_pages(id) on delete cascade,
  body text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_client_role on profiles(client_id, role);
create index if not exists idx_reports_status on reports(status, published_at desc);
create index if not exists idx_report_pages_report_order on report_pages(report_id, page_order);
create index if not exists idx_client_reports_client_report on client_reports(client_id, report_id);
create index if not exists idx_activity_report_user on report_page_activity(report_id, user_id);
create index if not exists idx_activity_page_user on report_page_activity(report_page_id, user_id);
create index if not exists idx_ratings_report on report_ratings(report_id);
create index if not exists idx_resume_report_user on report_resume(report_id, user_id);

create or replace function auth_user_id() returns uuid
language sql stable as $$
  select auth.uid();
$$;

create or replace function is_admin() returns boolean
language sql stable as $$
  select exists (
    select 1 from profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function user_client_id() returns uuid
language sql stable as $$
  select p.client_id from profiles p where p.user_id = auth.uid();
$$;

create or replace function can_access_report(rid uuid) returns boolean
language sql stable as $$
  select exists (
    select 1
    from reports r
    join report_entities e on e.id = r.entity_id
    join client_reports cr on cr.report_id = r.id
    where r.id = rid
      and (
        is_admin()
        or (
          r.status = 'published'
          and cr.client_id = user_client_id()
        )
      )
  );
$$;

alter table clients enable row level security;
alter table profiles enable row level security;
alter table granularities enable row level security;
alter table report_type_templates enable row level security;
alter table report_page_templates enable row level security;
alter table report_entities enable row level security;
alter table reports enable row level security;
alter table report_translations enable row level security;
alter table report_pages enable row level security;
alter table report_page_translations enable row level security;
alter table client_reports enable row level security;
alter table report_page_activity enable row level security;
alter table report_resume enable row level security;
alter table report_ratings enable row level security;
alter table internal_notes enable row level security;
alter table page_notes enable row level security;

create policy "admin_all_clients" on clients for all using (is_admin()) with check (is_admin());
create policy "admin_all_granularities" on granularities for all using (is_admin()) with check (is_admin());
create policy "admin_all_templates" on report_type_templates for all using (is_admin()) with check (is_admin());
create policy "admin_all_page_templates" on report_page_templates for all using (is_admin()) with check (is_admin());

create policy "profiles_read_self_or_admin" on profiles for select
using (user_id = auth.uid() or is_admin());

create policy "profiles_update_self_locale" on profiles for update
using (user_id = auth.uid() or is_admin())
with check (
  is_admin()
  or (user_id = auth.uid() and role = (select role from profiles where user_id = auth.uid()))
);

create policy "admin_all_entities" on report_entities for all using (is_admin()) with check (is_admin());
create policy "admin_all_reports" on reports for all using (is_admin()) with check (is_admin());
create policy "admin_all_report_translations" on report_translations for all using (is_admin()) with check (is_admin());
create policy "admin_all_report_pages" on report_pages for all using (is_admin()) with check (is_admin());
create policy "admin_all_page_translations" on report_page_translations for all using (is_admin()) with check (is_admin());
create policy "admin_all_client_reports" on client_reports for all using (is_admin()) with check (is_admin());
create policy "admin_all_notes" on internal_notes for all using (is_admin()) with check (is_admin());
create policy "admin_all_page_notes" on page_notes for all using (is_admin()) with check (is_admin());

create policy "client_select_reports" on reports for select
using (can_access_report(id));

create policy "client_select_report_translations" on report_translations for select
using (can_access_report(report_id));

create policy "client_select_report_pages" on report_pages for select
using (can_access_report(report_id));

create policy "client_select_page_translations" on report_page_translations for select
using (
  exists (
    select 1 from report_pages rp
    where rp.id = report_page_translations.report_page_id
      and can_access_report(rp.report_id)
  )
);

create policy "client_select_report_type_templates" on report_type_templates for select using (true);
create policy "client_select_report_page_templates" on report_page_templates for select using (true);
create policy "client_select_granularity" on granularities for select using (true);

create policy "client_select_activity_own" on report_page_activity for select
using (user_id = auth.uid() and can_access_report(report_id));

create policy "client_upsert_activity_own" on report_page_activity for insert
with check (user_id = auth.uid() and can_access_report(report_id));

create policy "client_update_activity_own" on report_page_activity for update
using (user_id = auth.uid())
with check (user_id = auth.uid() and can_access_report(report_id));

create policy "client_select_resume_own" on report_resume for select
using (user_id = auth.uid() and can_access_report(report_id));

create policy "client_upsert_resume_own" on report_resume for insert
with check (user_id = auth.uid() and can_access_report(report_id));

create policy "client_update_resume_own" on report_resume for update
using (user_id = auth.uid())
with check (user_id = auth.uid() and can_access_report(report_id));

create policy "client_select_rating_own" on report_ratings for select
using (user_id = auth.uid() and can_access_report(report_id));

create policy "client_upsert_rating_own" on report_ratings for insert
with check (user_id = auth.uid() and can_access_report(report_id));

create policy "client_update_rating_own" on report_ratings for update
using (user_id = auth.uid())
with check (user_id = auth.uid() and can_access_report(report_id));
