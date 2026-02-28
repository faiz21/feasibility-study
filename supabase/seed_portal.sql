-- Seed master template + client configuration data
-- Run after migrations.

-- Ensure granularities exist (idempotent)
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

-- Seed report type templates with category
with template_seed(name, granularity_code, category) as (
  values
    ('Automation Audit Report', 'plant', 'Automation'),
    ('Plant Report', 'plant', 'Automation'),
    ('Initiative', 'custom', 'Automation'),
    ('Digital Solution', 'solution', 'Digital Solution'),
    ('Function Group Report', 'function_group', 'Digital Solution'),
    ('Main Report', 'company', 'General'),
    ('Playbook', 'custom', 'General'),
    ('Roadmap', 'company', 'General'),
    ('Cybersecurity Assessment', 'company', 'Cybersecurity')
)
insert into report_type_templates (name, granularity_id, category, description)
select
  ts.name,
  g.id,
  ts.category,
  ts.name || ' template'
from template_seed ts
join granularities g on g.code = ts.granularity_code
on conflict do nothing;

-- Optional minimal default page template per task type
insert into report_page_templates (
  report_type_template_id,
  page_key,
  page_order,
  title,
  html_template
)
select
  rtt.id,
  'overview',
  1,
  'Overview',
  '<section><h1>{{title}}</h1><p>{{summary}}</p></section>'
from report_type_templates rtt
where not exists (
  select 1
  from report_page_templates rpt
  where rpt.report_type_template_id = rtt.id
    and rpt.page_key = 'overview'
);

-- Seed clients (domain can be adjusted)
with client_seed(code, name, domain) as (
  values
    ('NSI', 'PT NSI', 'nsi.co.id'),
    ('SMA', 'PT SMA (Sumber Mas Autorindo)', 'sma.co.id'),
    ('ADR', 'Adaro', 'adaro.com'),
    ('INA', 'PT Indonesia Asahan Alumunium', 'inalum.id')
)
insert into clients (code, name, domain, default_locale)
select code, name, domain, 'en'::app_locale
from client_seed
on conflict (code)
do update set
  name = excluded.name,
  domain = excluded.domain;

-- Configure client ↔ report_type_template access
-- NSI: Function Group Report, Digital Solution, Initiative, Main Report, Playbook, Roadmap, Cybersecurity Assessment
-- INA: Automation Audit Report, Plant Report, Initiative, Digital Solution, Main Report, Playbook, Roadmap, Cybersecurity Assessment
-- SMA + ADR: intentionally no template mapping provided in input

with mapping(client_code, task_type) as (
  values
    ('NSI', 'Function Group Report'),
    ('NSI', 'Digital Solution'),
    ('NSI', 'Initiative'),
    ('NSI', 'Main Report'),
    ('NSI', 'Playbook'),
    ('NSI', 'Roadmap'),
    ('NSI', 'Cybersecurity Assessment'),

    ('INA', 'Automation Audit Report'),
    ('INA', 'Plant Report'),
    ('INA', 'Initiative'),
    ('INA', 'Digital Solution'),
    ('INA', 'Main Report'),
    ('INA', 'Playbook'),
    ('INA', 'Roadmap'),
    ('INA', 'Cybersecurity Assessment')
)
insert into client_report_type_access (client_id, report_type_template_id)
select c.id, rtt.id
from mapping m
join clients c on c.code = m.client_code
join report_type_templates rtt on rtt.name = m.task_type
on conflict (client_id, report_type_template_id) do nothing;
