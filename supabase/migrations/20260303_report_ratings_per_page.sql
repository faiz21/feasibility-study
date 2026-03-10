-- Enable per-page ratings while keeping legacy report-level rows compatible.

alter table public.report_ratings
  add column if not exists report_page_id uuid references public.report_pages(id) on delete cascade;

alter table public.report_ratings
  drop constraint if exists report_ratings_report_id_user_id_key;

create unique index if not exists report_ratings_report_user_page_uq
  on public.report_ratings(report_id, report_page_id, user_id);

create unique index if not exists report_ratings_report_user_legacy_uq
  on public.report_ratings(report_id, user_id)
  where report_page_id is null;

create index if not exists idx_ratings_report_user_page
  on public.report_ratings(report_id, user_id, report_page_id);
