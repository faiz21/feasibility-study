-- Seed additional appendix pages for report_page_templates
-- Target report_type_template_id:
--   35148a37-e22e-4779-908f-973ca849fe20
--
-- Idempotent behavior:
-- - Inserts missing appendix pages.
-- - If page_key already exists, updates title/html_template/sample_data only.
-- - Keeps existing page_order for existing rows.

with target as (
  select '35148a37-e22e-4779-908f-973ca849fe20'::uuid as report_type_template_id
),
existing_max as (
  select
    t.report_type_template_id,
    coalesce(max(rpt.page_order), 0) as max_page_order
  from target t
  left join report_page_templates rpt
    on rpt.report_type_template_id = t.report_type_template_id
  group by t.report_type_template_id
),
appendix_seed(seq, page_key, title) as (
  values
    (2,  'APP A', 'Appendix A: Material & Manufacturing Architecture'),
    (3,  'APP B', 'Appendix B: Process Architecture - Process Groups Inventory'),
    (4,  'APP C', 'Appendix C: Asset Scope - Equipment Inventory'),
    (5,  'APP D', 'Appendix D: Control Layer Scope - PLC Inventory'),
    (6,  'APP E', 'Appendix E: Supervisory Control Scope - SCADA / DCS Inventory'),
    (7,  'APP F', 'Appendix F: Mobile Assets - Vehicle & Mobile Asset Inventory'),
    (8,  'APP G', 'Appendix G: Organizational Scope - Departments & Sections Involved'),
    (9,  'APP H', 'Appendix H: Functional Scope - Function Groups / Value Streams'),
    (10, 'APP I', 'Appendix I: Procedural Scope - Procedures Covered'),
    (11, 'APP J', 'Appendix J: Performance Scope - KPIs & Performance Measures'),
    (12, 'APP K', 'Appendix K: Evidence Registers - Findings, Notes, and Issues'),
    (13, 'APP L', 'Appendix L: Audit Evaluation Framework - Parameter Dictionary & Scoring Logic'),
    (14, 'APP M', 'Appendix M: Scoring Results - Plant Maturity Assessment Matrix'),
    (15, 'APP N', 'Appendix N: Vertical Integration - OT <-> IT Systems Evaluation'),
    (16, 'APP O', 'Appendix O: Automation Audit Report - Blank Template (separate deliverable canvas)')
),
ordered_seed as (
  select
    t.report_type_template_id,
    s.page_key,
    s.title,
    em.max_page_order + s.seq as page_order
  from appendix_seed s
  cross join target t
  join existing_max em
    on em.report_type_template_id = t.report_type_template_id
)
insert into report_page_templates (
  report_type_template_id,
  page_key,
  page_order,
  title,
  html_template,
  sample_data
)
select
  os.report_type_template_id,
  os.page_key,
  os.page_order,
  os.title,
  format(
    '<section><h1>%s</h1><p>Template placeholder for %s.</p></section>',
    os.title,
    os.page_key
  ) as html_template,
  jsonb_build_object(
    'title', os.title,
    'page_key', os.page_key,
    'sections', jsonb_build_array()
  ) as sample_data
from ordered_seed os
on conflict (report_type_template_id, page_key)
do update set
  title = excluded.title,
  html_template = excluded.html_template,
  sample_data = excluded.sample_data,
  updated_at = now();
