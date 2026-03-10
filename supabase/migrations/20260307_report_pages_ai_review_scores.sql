-- Add AI review score fields on report_pages for markdown refinement workflow.
alter table public.report_pages
  add column if not exists overall int,
  add column if not exists outline_alignment int,
  add column if not exists writing_alignment int,
  add column if not exists analysis_score int,
  add column if not exists notes text[] not null default '{}'::text[];

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'report_pages_overall_range_chk'
  ) then
    alter table public.report_pages
      add constraint report_pages_overall_range_chk
      check (overall is null or (overall >= 0 and overall <= 100));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'report_pages_outline_alignment_range_chk'
  ) then
    alter table public.report_pages
      add constraint report_pages_outline_alignment_range_chk
      check (outline_alignment is null or (outline_alignment >= 0 and outline_alignment <= 100));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'report_pages_writing_alignment_range_chk'
  ) then
    alter table public.report_pages
      add constraint report_pages_writing_alignment_range_chk
      check (writing_alignment is null or (writing_alignment >= 0 and writing_alignment <= 100));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'report_pages_analysis_score_range_chk'
  ) then
    alter table public.report_pages
      add constraint report_pages_analysis_score_range_chk
      check (analysis_score is null or (analysis_score >= 0 and analysis_score <= 100));
  end if;
end $$;
