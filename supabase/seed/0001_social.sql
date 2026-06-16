-- ════════════════════════════════════════════════════════════════
--  SEED — períodos 2026 + clientes del pilar Social (LinkedIn)
--  Las métricas/posts/audiencia de Mayo 2026 viven hoy en el seed JS
--  (src/data/socialSeed.js). El import manual los persistirá acá.
-- ════════════════════════════════════════════════════════════════

insert into public.periods (id, label, period_start, period_end, granularity) values
  ('m01', 'Enero 2026',   '2026-01-01', '2026-01-31', 'month'),
  ('m02', 'Febrero 2026', '2026-02-01', '2026-02-28', 'month'),
  ('m03', 'Marzo 2026',   '2026-03-01', '2026-03-31', 'month'),
  ('m04', 'Abril 2026',   '2026-04-01', '2026-04-30', 'month'),
  ('m05', 'Mayo 2026',    '2026-05-01', '2026-05-31', 'month'),
  ('m06', 'Junio 2026',   '2026-06-01', '2026-06-30', 'month'),
  -- Website se maneja por trimestre
  ('q1-2026', 'Q1 2026',  '2026-01-01', '2026-03-31', 'quarter')
on conflict (id) do nothing;

insert into public.social_clients (id, name, org_group, sort_order) values
  ('cul',  'Control Union Latinoamérica',          'CU',       1),
  ('cue',  'Control Union España',                 'CU',       2),
  ('cup',  'Control Union Portugal',               'CU',       3),
  ('cun',  'Control Union Norte',                  'CU',       4),
  ('cuna', 'Control Union North America',          'CU',       5),
  ('ps',   'Peterson Solutions (Global)',          'Peterson', 6),
  ('pia',  'Peterson Solutions (Iberia & Americas)','Peterson', 7),
  ('tlr',  'TLR International Laboratories Perú',   'Lab',      8),
  ('bel',  'Biomass Energy Lab',                    'Lab',      9)
on conflict (id) do nothing;
