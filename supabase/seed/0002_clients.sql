-- ════════════════════════════════════════════════════════════════
--  SEED — clientes de los pilares Paid y Website
--  (las métricas reales viven hoy en los seeds JS; el import las persiste)
-- ════════════════════════════════════════════════════════════════

insert into public.paid_clients (id, name, sort_order) values
  ('pt', 'CU Portugal', 1),
  ('es', 'CU España', 2)
on conflict (id) do nothing;

insert into public.web_clients (id, name, handle, sort_order) values
  ('cua', 'Control Union Argentina', '@controlunionargentina', 1)
on conflict (id) do nothing;
