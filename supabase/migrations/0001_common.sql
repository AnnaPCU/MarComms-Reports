-- ════════════════════════════════════════════════════════════════
--  0001_common.sql — Tablas comunes a todos los pilares
--  Convenciones (estilo Marcomms Hub): schema public, RLS habilitado con
--  política permisiva para authenticated, tablas en supabase_realtime.
-- ════════════════════════════════════════════════════════════════

-- ── Trigger reutilizable para updated_at ──
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ── periods: universo de períodos seleccionables (común a los 5 pilares) ──
create table if not exists public.periods (
  id          text primary key,            -- 'm05', '2026-05', etc.
  label       text not null,               -- 'Mayo 2026'
  period_start date not null,
  period_end   date not null,
  granularity text not null default 'month',
  created_at  timestamptz not null default now()
);

-- ── imports: ledger de cada importación (auditoría + regla de honestidad) ──
-- Permite distinguir "nunca importado" de "importado vacío" y mostrar
-- la fecha del último import por pilar/cliente/período.
create table if not exists public.imports (
  id          uuid primary key default gen_random_uuid(),
  pilar       text not null,               -- 'social' | 'paid' | 'email' | 'webinars' | 'website'
  source      text not null,               -- 'linkedin' | 'google_ads' | ...
  client_id   text,                        -- slug del cliente del pilar (FK lógica, no física)
  period_id   text references public.periods(id),
  file_name   text,
  row_count   integer default 0,
  status      text not null default 'ok',  -- 'ok' | 'partial' | 'error'
  notes       text,
  imported_by text,
  imported_at timestamptz not null default now()
);

create index if not exists imports_pilar_period_idx
  on public.imports (pilar, client_id, period_id);

-- ── RLS + realtime ──
alter table public.periods enable row level security;
alter table public.imports enable row level security;

create policy "auth full access periods" on public.periods
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access imports" on public.imports
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

alter publication supabase_realtime add table public.periods;
alter publication supabase_realtime add table public.imports;
