-- Add optional metadata/content assets for report page templates.
-- These support admin uploads for:
-- - template HTML (.html)
-- - readme (.md)
-- - sample data (.json)

alter table public.report_page_templates
  add column if not exists readme_markdown text,
  add column if not exists sample_data jsonb;
