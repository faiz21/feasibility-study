-- Extend report_page_templates with additional authoring fields.

alter table public.report_page_templates
  add column if not exists "gpt json schema" jsonb,
  add column if not exists "Report_format" text,
  add column if not exists analysis_level text,
  add column if not exists "system prompt" text,
  add column if not exists execution_order numeric;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'report_page_templates_analysis_level_check'
  ) then
    alter table public.report_page_templates
      add constraint report_page_templates_analysis_level_check
      check (
        analysis_level is null
        or analysis_level in ('TOP GRADE', 'COST-EFFECTIVE', 'OPTIMAL')
      );
  end if;
end
$$;
