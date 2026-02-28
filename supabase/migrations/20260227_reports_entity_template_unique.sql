-- Ensure one report per (entity, report_type_template) pair so sync can upsert safely.

with ranked as (
  select
    id,
    row_number() over (
      partition by entity_id, report_type_template_id
      order by created_at desc, id desc
    ) as row_num
  from public.reports
)
delete from public.reports r
using ranked d
where r.id = d.id
  and d.row_num > 1;

create unique index if not exists ux_reports_entity_template
  on public.reports (entity_id, report_type_template_id);
