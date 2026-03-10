-- Add page-level summary field for AI markdown review output.
alter table public.report_pages
  add column if not exists page_summary text;
