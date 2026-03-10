-- Seed INA plant entities into `report_entities`
-- Idempotent: updates descriptions if name already exists; inserts missing rows.
--
-- Target scope:
--   granularity_id = 410f1599-6b1a-4835-a476-a7f649f4d4a4
--   client_id      = 96e8bb03-0ad0-421b-8f42-f296aa999c85
--
-- Run after migrations:
--   psql "$DATABASE_URL" -f supabase/seed_report_entities_ina_plants.sql

begin;

with seed(name, description) as (
  values
    ('INA-PL-GRP', 'Green Plant'),
    ('INA-PL-CBP', 'Baking Plant'),
    ('INA-PL-RCP', 'Rodding Plant'),
    ('INA-PL-CSP', 'Casting Plant'),
    ('INA-PL-ACP', 'Alloy Ingot Casting Plant'),
    ('INA-PL-BCP', 'Billet Casting Plant'),
    ('INA-PL-GCP', 'Gas Cleaning Plant'),
    ('INA-PL-MHP', 'Material Handling Plant'),
    ('INA-PL-REP', 'Reduction Plant'),
    ('INA-PL-UWP', 'Utility & WWTP Plant')
)
update public.report_entities e
set
  description = s.description,
  updated_at = now()
from seed s
where e.client_id = '96e8bb03-0ad0-421b-8f42-f296aa999c85'::uuid
  and e.granularity_id = '410f1599-6b1a-4835-a476-a7f649f4d4a4'::uuid
  and e.name = s.name
  and e.description is distinct from s.description;

with seed(name, description) as (
  values
    ('INA-PL-GRP', 'Green Plant'),
    ('INA-PL-CBP', 'Baking Plant'),
    ('INA-PL-RCP', 'Rodding Plant'),
    ('INA-PL-CSP', 'Casting Plant'),
    ('INA-PL-ACP', 'Alloy Ingot Casting Plant'),
    ('INA-PL-BCP', 'Billet Casting Plant'),
    ('INA-PL-GCP', 'Gas Cleaning Plant'),
    ('INA-PL-MHP', 'Material Handling Plant'),
    ('INA-PL-REP', 'Reduction Plant'),
    ('INA-PL-UWP', 'Utility & WWTP Plant')
)
insert into public.report_entities (client_id, granularity_id, name, description)
select
  '96e8bb03-0ad0-421b-8f42-f296aa999c85'::uuid,
  '410f1599-6b1a-4835-a476-a7f649f4d4a4'::uuid,
  s.name,
  s.description
from seed s
where not exists (
  select 1
  from public.report_entities e
  where e.client_id = '96e8bb03-0ad0-421b-8f42-f296aa999c85'::uuid
    and e.granularity_id = '410f1599-6b1a-4835-a476-a7f649f4d4a4'::uuid
    and e.name = s.name
);

commit;

