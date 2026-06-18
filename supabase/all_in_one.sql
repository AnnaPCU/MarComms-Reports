-- ════════════════════════════════════════════════════════════════
--  MarComms Reports — SQL consolidado (pegar todo en el SQL Editor)
--  Orden: migrations 0001→0006 + seeds (incluye métricas Social May 2026).
--  Correr UNA sola vez en un proyecto nuevo.
-- ════════════════════════════════════════════════════════════════

-- ═══ migrations/0001_common.sql ═══
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

-- ═══ migrations/0002_social.sql ═══
-- ════════════════════════════════════════════════════════════════
--  0002_social.sql — Pilar Social Media (LinkedIn)
--  Clientes propios del pilar (no compartidos con otros pilares todavía).
-- ════════════════════════════════════════════════════════════════

-- ── social_clients: las cuentas/regiones LinkedIn ──
create table if not exists public.social_clients (
  id         text primary key,             -- slug: 'cul', 'cue', ...
  name       text not null,
  org_group  text,                         -- 'CU' | 'Peterson' | 'Lab'
  sort_order integer default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── social_metrics: métricas mensuales por cuenta+período ──
create table if not exists public.social_metrics (
  id              uuid primary key default gen_random_uuid(),
  client_id       text not null references public.social_clients(id) on delete cascade,
  period_id       text not null references public.periods(id),
  impressions     integer,
  clicks          integer,
  engagement_rate numeric,                 -- %
  profile_visits  integer,                 -- proxy de conversiones
  new_followers   integer,
  import_id       uuid references public.imports(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (client_id, period_id)
);

-- ── social_posts: publicaciones del período ──
create table if not exists public.social_posts (
  id              uuid primary key default gen_random_uuid(),
  client_id       text not null references public.social_clients(id) on delete cascade,
  period_id       text not null references public.periods(id),
  title           text not null,
  esg_pillar      text,                    -- 'E' | 'S' | 'G' | 'X'
  impressions     integer,
  engagement_rate numeric,
  clicks          integer,
  reactions       integer,
  comments        integer,
  post_type       text,                    -- 'Orgánico' | 'Artículo' | ...
  url             text,
  import_id       uuid references public.imports(id),
  created_at      timestamptz not null default now()
);

-- ── social_audience: distribuciones de audiencia (seniority / función) ──
create table if not exists public.social_audience (
  id         uuid primary key default gen_random_uuid(),
  client_id  text not null references public.social_clients(id) on delete cascade,
  period_id  text references public.periods(id),
  dimension  text not null,                -- 'seniority' | 'function'
  label      text not null,
  value      integer not null,
  import_id  uuid references public.imports(id),
  created_at timestamptz not null default now()
);

create index if not exists social_metrics_client_period_idx on public.social_metrics (client_id, period_id);
create index if not exists social_posts_client_period_idx   on public.social_posts (client_id, period_id);
create index if not exists social_audience_client_idx       on public.social_audience (client_id, dimension);

-- ── updated_at trigger en social_metrics ──
drop trigger if exists social_metrics_set_updated_at on public.social_metrics;
create trigger social_metrics_set_updated_at
  before update on public.social_metrics
  for each row execute function public.set_updated_at();

-- ── RLS + realtime ──
alter table public.social_clients  enable row level security;
alter table public.social_metrics  enable row level security;
alter table public.social_posts    enable row level security;
alter table public.social_audience enable row level security;

create policy "auth full access social_clients" on public.social_clients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access social_metrics" on public.social_metrics
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access social_posts" on public.social_posts
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access social_audience" on public.social_audience
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

alter publication supabase_realtime add table public.social_clients;
alter publication supabase_realtime add table public.social_metrics;
alter publication supabase_realtime add table public.social_posts;
alter publication supabase_realtime add table public.social_audience;

-- ═══ migrations/0003_paid.sql ═══
-- ════════════════════════════════════════════════════════════════
--  0003_paid.sql — Pilar Paid Media (Google Ads, Meta Ads). Mensual.
--  Clientes propios del pilar (markets como 'España'). No compartidos.
-- ════════════════════════════════════════════════════════════════

create table if not exists public.paid_clients (
  id         text primary key,            -- slug: 'es', ...
  name       text not null,
  sort_order integer default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- Totales por cliente + período + plataforma.
create table if not exists public.paid_metrics (
  id               uuid primary key default gen_random_uuid(),
  client_id        text not null references public.paid_clients(id) on delete cascade,
  period_id        text not null references public.periods(id),
  platform         text not null default 'google_ads', -- 'google_ads' | 'meta_ads'
  channel          text,                  -- 'Google Ads Search'
  objetivo         text,                  -- 'Generación de leads'
  impressions      integer,
  clicks           integer,
  ctr              numeric,
  cpc              numeric,
  cost             numeric,
  currency         text default 'EUR',
  conversions      numeric,
  conversion_rate  numeric,
  cost_per_conv    numeric,
  analysis         text,
  import_id        uuid references public.imports(id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (client_id, period_id, platform)
);

-- Desglose por campaña.
create table if not exists public.paid_campaigns (
  id              uuid primary key default gen_random_uuid(),
  client_id       text not null references public.paid_clients(id) on delete cascade,
  period_id       text not null references public.periods(id),
  platform        text not null default 'google_ads',
  name            text not null,
  impressions     integer,
  clicks          integer,
  ctr             numeric,
  cpc             numeric,
  cost            numeric,
  conversions     numeric,
  conversion_rate numeric,
  cost_per_conv   numeric,
  opt_level       numeric,                -- nivel de optimización %
  import_id       uuid references public.imports(id),
  created_at      timestamptz not null default now()
);

create index if not exists paid_metrics_client_period_idx on public.paid_metrics (client_id, period_id);
create index if not exists paid_campaigns_client_period_idx on public.paid_campaigns (client_id, period_id);

drop trigger if exists paid_metrics_set_updated_at on public.paid_metrics;
create trigger paid_metrics_set_updated_at
  before update on public.paid_metrics
  for each row execute function public.set_updated_at();

alter table public.paid_clients   enable row level security;
alter table public.paid_metrics   enable row level security;
alter table public.paid_campaigns enable row level security;

create policy "auth full access paid_clients" on public.paid_clients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access paid_metrics" on public.paid_metrics
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access paid_campaigns" on public.paid_campaigns
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

alter publication supabase_realtime add table public.paid_clients;
alter publication supabase_realtime add table public.paid_metrics;
alter publication supabase_realtime add table public.paid_campaigns;

-- ═══ migrations/0004_website.sql ═══
-- ════════════════════════════════════════════════════════════════
--  0004_website.sql — Pilar Website (GA4 + Search Console). TRIMESTRAL.
--  Usa períodos con granularity='quarter'. Clientes propios del pilar.
-- ════════════════════════════════════════════════════════════════

create table if not exists public.web_clients (
  id         text primary key,            -- slug: 'cua'
  name       text not null,
  handle     text,                        -- '@controlunionargentina'
  sort_order integer default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- Website / tráfico (Google Analytics).
create table if not exists public.web_site_metrics (
  id             uuid primary key default gen_random_uuid(),
  client_id      text not null references public.web_clients(id) on delete cascade,
  period_id      text not null references public.periods(id),
  single_traffic integer,                 -- visitantes únicos
  total_traffic  integer,                 -- sesiones / visitas
  impressions    integer,                 -- page views
  conversions    integer,
  analysis       text,
  import_id      uuid references public.imports(id),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (client_id, period_id)
);

-- SEO (Search Console).
create table if not exists public.web_seo_metrics (
  id               uuid primary key default gen_random_uuid(),
  client_id        text not null references public.web_clients(id) on delete cascade,
  period_id        text not null references public.periods(id),
  average_position numeric,
  impressions      integer,
  total_clicks     integer,
  analysis         text,
  import_id        uuid references public.imports(id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (client_id, period_id)
);

create table if not exists public.web_top_pages (
  id         uuid primary key default gen_random_uuid(),
  client_id  text not null references public.web_clients(id) on delete cascade,
  period_id  text not null references public.periods(id),
  url        text not null,
  views      integer,
  import_id  uuid references public.imports(id),
  created_at timestamptz not null default now()
);

create table if not exists public.web_top_queries (
  id         uuid primary key default gen_random_uuid(),
  client_id  text not null references public.web_clients(id) on delete cascade,
  period_id  text not null references public.periods(id),
  query      text not null,
  clicks     integer,
  import_id  uuid references public.imports(id),
  created_at timestamptz not null default now()
);

drop trigger if exists web_site_metrics_set_updated_at on public.web_site_metrics;
create trigger web_site_metrics_set_updated_at
  before update on public.web_site_metrics
  for each row execute function public.set_updated_at();
drop trigger if exists web_seo_metrics_set_updated_at on public.web_seo_metrics;
create trigger web_seo_metrics_set_updated_at
  before update on public.web_seo_metrics
  for each row execute function public.set_updated_at();

alter table public.web_clients      enable row level security;
alter table public.web_site_metrics enable row level security;
alter table public.web_seo_metrics  enable row level security;
alter table public.web_top_pages    enable row level security;
alter table public.web_top_queries  enable row level security;

create policy "auth full access web_clients" on public.web_clients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access web_site_metrics" on public.web_site_metrics
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access web_seo_metrics" on public.web_seo_metrics
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access web_top_pages" on public.web_top_pages
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access web_top_queries" on public.web_top_queries
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

alter publication supabase_realtime add table public.web_clients;
alter publication supabase_realtime add table public.web_site_metrics;
alter publication supabase_realtime add table public.web_seo_metrics;
alter publication supabase_realtime add table public.web_top_pages;
alter publication supabase_realtime add table public.web_top_queries;

-- ═══ migrations/0005_email_webinars.sql ═══
-- ════════════════════════════════════════════════════════════════
--  0005_email_webinars.sql — Pilares Email Marketing y Webinars.
--  KPIs definidos; tablas listas para el primer import. Mensual.
-- ════════════════════════════════════════════════════════════════

-- ── EMAIL MARKETING (Mailchimp / Apollo) ──
create table if not exists public.email_clients (
  id text primary key, name text not null, sort_order integer default 0,
  is_active boolean not null default true, created_at timestamptz not null default now()
);

create table if not exists public.email_metrics (
  id              uuid primary key default gen_random_uuid(),
  client_id       text not null references public.email_clients(id) on delete cascade,
  period_id       text not null references public.periods(id),
  platform        text not null default 'mailchimp', -- 'mailchimp' | 'apollo'
  sends           integer,
  open_rate       numeric,
  click_rate      numeric,
  bounce_rate     numeric,
  unsubscribe_rate numeric,
  new_contacts    integer,
  import_id       uuid references public.imports(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (client_id, period_id, platform)
);

create table if not exists public.email_campaigns (
  id         uuid primary key default gen_random_uuid(),
  client_id  text not null references public.email_clients(id) on delete cascade,
  period_id  text not null references public.periods(id),
  platform   text not null default 'mailchimp',
  name       text not null,
  sends      integer,
  open_rate  numeric,
  click_rate numeric,
  import_id  uuid references public.imports(id),
  created_at timestamptz not null default now()
);

-- ── WEBINARS (Livestorm) ──
create table if not exists public.webinar_clients (
  id text primary key, name text not null, sort_order integer default 0,
  is_active boolean not null default true, created_at timestamptz not null default now()
);

create table if not exists public.webinar_events (
  id               uuid primary key default gen_random_uuid(),
  client_id        text not null references public.webinar_clients(id) on delete cascade,
  period_id        text not null references public.periods(id),
  title            text not null,
  event_date       date,
  registrants      integer,
  attendees        integer,
  attendance_rate  numeric,
  avg_duration_min numeric,
  replay_views     integer,
  leads            integer,
  import_id        uuid references public.imports(id),
  created_at       timestamptz not null default now()
);

drop trigger if exists email_metrics_set_updated_at on public.email_metrics;
create trigger email_metrics_set_updated_at
  before update on public.email_metrics
  for each row execute function public.set_updated_at();

alter table public.email_clients   enable row level security;
alter table public.email_metrics   enable row level security;
alter table public.email_campaigns enable row level security;
alter table public.webinar_clients enable row level security;
alter table public.webinar_events  enable row level security;

create policy "auth full access email_clients" on public.email_clients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access email_metrics" on public.email_metrics
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access email_campaigns" on public.email_campaigns
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access webinar_clients" on public.webinar_clients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access webinar_events" on public.webinar_events
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

alter publication supabase_realtime add table public.email_clients;
alter publication supabase_realtime add table public.email_metrics;
alter publication supabase_realtime add table public.email_campaigns;
alter publication supabase_realtime add table public.webinar_clients;
alter publication supabase_realtime add table public.webinar_events;

-- ═══ migrations/0006_anon_access.sql ═══
-- ════════════════════════════════════════════════════════════════
--  0006_anon_access.sql — acceso para el rol `anon`
--
--  La app usa login compartido (no Supabase Auth todavía), por lo que
--  consulta con la anon key → rol `anon`. Las políticas previas solo
--  permitían `authenticated`, así que RLS devolvía filas vacías.
--  Esta política temporal habilita lectura/escritura para `anon`.
--
--  ⚠️ TEMPORAL: quitar cuando se integre Supabase Auth real (igual que el
--  Marcomms Hub). El repo y la anon key son públicos, así que esto no es
--  seguridad real — es un gate de uso interno.
-- ════════════════════════════════════════════════════════════════

do $$
declare t text;
begin
  foreach t in array array[
    'periods', 'imports',
    'social_clients', 'social_metrics', 'social_posts', 'social_audience',
    'paid_clients', 'paid_metrics', 'paid_campaigns',
    'web_clients', 'web_site_metrics', 'web_seo_metrics', 'web_top_pages', 'web_top_queries',
    'email_clients', 'email_metrics', 'email_campaigns',
    'webinar_clients', 'webinar_events'
  ]
  loop
    execute format('drop policy if exists "anon temp full access" on public.%I;', t);
    execute format(
      'create policy "anon temp full access" on public.%I for all to anon using (true) with check (true);',
      t
    );
  end loop;
end $$;

-- ═══ seed/0001_social.sql ═══
-- ════════════════════════════════════════════════════════════════
--  SEED — períodos 2026 + clientes del pilar Social (LinkedIn)
--  Las métricas/posts/audiencia de Mayo 2026 viven hoy en el seed JS
--  (src/data/socialSeed.js). El import manual los persistirá acá.
-- ════════════════════════════════════════════════════════════════

insert into public.periods (id, label, period_start, period_end, granularity) values
  ('m01', 'Enero 2026',      '2026-01-01', '2026-01-31', 'month'),
  ('m02', 'Febrero 2026',    '2026-02-01', '2026-02-28', 'month'),
  ('m03', 'Marzo 2026',      '2026-03-01', '2026-03-31', 'month'),
  ('m04', 'Abril 2026',      '2026-04-01', '2026-04-30', 'month'),
  ('m05', 'Mayo 2026',       '2026-05-01', '2026-05-31', 'month'),
  ('m06', 'Junio 2026',      '2026-06-01', '2026-06-30', 'month'),
  ('m07', 'Julio 2026',      '2026-07-01', '2026-07-31', 'month'),
  ('m08', 'Agosto 2026',     '2026-08-01', '2026-08-31', 'month'),
  ('m09', 'Septiembre 2026', '2026-09-01', '2026-09-30', 'month'),
  ('m10', 'Octubre 2026',    '2026-10-01', '2026-10-31', 'month'),
  ('m11', 'Noviembre 2026',  '2026-11-01', '2026-11-30', 'month'),
  ('m12', 'Diciembre 2026',  '2026-12-01', '2026-12-31', 'month'),
  -- Trimestres (Website + libertad de import por Q en otros pilares)
  ('q1-2026', 'Q1 2026', '2026-01-01', '2026-03-31', 'quarter'),
  ('q2-2026', 'Q2 2026', '2026-04-01', '2026-06-30', 'quarter'),
  ('q3-2026', 'Q3 2026', '2026-07-01', '2026-09-30', 'quarter'),
  ('q4-2026', 'Q4 2026', '2026-10-01', '2026-12-31', 'quarter')
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

-- ═══ seed/0002_clients.sql ═══
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

-- ═══ seed/0003_social_may2026.sql ═══
-- ─────────────────────────────────────────────────────────────
-- seed/0003_social_may2026.sql — métricas reales Social Mayo 2026
-- (generado de src/data/socialSeed.js)
-- ─────────────────────────────────────────────────────────────
insert into public.social_metrics (client_id, period_id, impressions, clicks, engagement_rate, profile_visits, new_followers) values
  ('cul','m05',58168,6020,12.89,1007,400),
  ('cue','m05',8070,1846,20.13,117,61),
  ('cup','m05',1017,83,11.08,29,8),
  ('cun','m05',15377,9476,48.33,87,74),
  ('cuna','m05',2524,394,20.55,52,38),
  ('ps','m05',8723,1253,13.27,281,76),
  ('pia','m05',8376,1469,16.37,324,130),
  ('tlr','m05',652,291,52.12,10,4),
  ('bel','m05',1975,261,20.33,7,8)
on conflict (client_id, period_id) do nothing;

insert into public.social_posts (client_id, period_id, title, esg_pillar, impressions, engagement_rate, clicks, post_type, url) values
  ('cul','m05','#ControlUnionServices Perú — Buscamos Asistente de Certificaciones','S',10410,4.55,426,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7457503523971395584'),
  ('cul','m05','#ControlUnionServices Perú — Buscamos Certificador de Insumos Orgánicos','S',7898,3.15,218,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7457501428358463488'),
  ('cul','m05','#ControlUnionArgentina — Webinar ISO 14064 mañana: GHG en la práctica','E',5547,5.77,271,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7457799364720254976'),
  ('cul','m05','#ControlUnionArgentina — Cannabis medicinal: producir ya no alcanza','G',3257,10.68,278,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7457767323140100096'),
  ('cul','m05','#ControlUnionArgentina — Novedades clave sobre el EUDR (Reglamento de Deforestación)','E',3155,34.26,1054,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7457504452221243392'),
  ('cue','m05','Patrocinadores en el Andalusian Commodity Exchange — Control Union España','S',5497,30.78,1611,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7458177585940955136'),
  ('cue','m05','¿Por qué la certificación RSPO es clave hoy? Contexto y sostenibilidad','E',654,4.28,10,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7458055589781233664'),
  ('cue','m05','Nuevos factores de emisión del MITECO — ya disponibles','E',401,6.23,16,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7460636722146525184'),
  ('cue','m05','Control Union presente en Net Zero Tech 2026','E',296,3.04,4,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7459867471420973056'),
  ('cue','m05','¿Cuál era el reto crítico de la industria del aceite de palma? — ISO 9001','G',256,6.25,2,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7463483816486264832'),
  ('cup','m05','Control Union en la Feira ITF Intertex Porto — Sustentabilidade têxtil','E',427,8.43,17,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7460380951395708928'),
  ('cup','m05','Patrocinadores no Andalusian Commodity Exchange — Inspeções de commodities','S',289,23.18,56,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7460307341155028992'),
  ('cup','m05','Control Union speaker no World Tube Congress 2026 — CBAM e Packaging Waste','E',197,4.06,4,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7460584933116358657'),
  ('cup','m05','Quase 35 anos de experiência — Control Union Portugal em Bioenergia Avançada','E',104,8.65,6,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7461073927377809408'),
  ('cun','m05','Día del Trabajador — asado junto al equipo de Control Union Norte','S',11010,69.51,7549,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7457099894105911296'),
  ('cun','m05','76° Annual Sugar Club Banquet — industria azucarera NOA','S',5572,58.06,3078,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7462177442045030400'),
  ('cun','m05','Encuentro de Líderes Control Union Norte — Villa P','S',4629,81.53,3660,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7458537186678865920'),
  ('cun','m05','¿Tu empresa preparada para las nuevas exigencias de exportación?','G',670,4.78,25,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7462491004672274432'),
  ('cun','m05','Mercados internacionales: nuevos requisitos para exportadores','G',629,6.04,20,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7460060709008265216'),
  ('cuna','m05','Textiles Recycling Expo USA — Control Union (USDA Organic)','E',614,45.77,251,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7458548841810751488'),
  ('cuna','m05','Looking to access the U.S. organic market with confidence?','E',598,10.54,22,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7463344123324985345'),
  ('cuna','m05','#WeAreHiring — Senior Surveyor Sept-Iles Canada (Draft Survey)','S',393,6.36,20,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7463271328914075648'),
  ('cuna','m05','Luis Sánchez representing Control Union at international event','S',334,1.5,1,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7457104734781362176'),
  ('cuna','m05','Selling organic products in the U.S. market? USDA Organic certification','E',313,7.35,5,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7465749311335727105'),
  ('ps','m05','EUDR compliance: companies must prepare now — webinar series','E',2318,22.48,485,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7458074840361574400'),
  ('ps','m05','Data breaches & ISO 27001: organizations that demonstrate compliance win','G',1638,14.53,192,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7457380968778203136'),
  ('ps','m05','Peterson Solutions supporting Textiles in the System Transformation','E',1298,9.63,66,'Artículo','https://www.linkedin.com/feed/update/urn:li:activity:7459976291778330624'),
  ('ps','m05','The future of textile sustainability is verified data — not storytelling','E',854,50.23,408,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7459989760179355649'),
  ('ps','m05','Peterson Solutions Academy — Conference Los Angeles, Rodene Dye e Inés Coll','S',821,2.8,11,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7458511315742035970'),
  ('pia','m05','Peterson Solutions Iberia — Pasaporte Digital Baterías EUBR (Congreso Autoconsumo)','G',2860,39.27,1046,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7458490675764850688'),
  ('pia','m05','347 asistentes. 16 países. ¿Está tu empresa lista para el EUDR?','E',1368,14.33,185,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7458071318651944960'),
  ('pia','m05','Peterson Solutions en Fastmarkets Biofuels Americas 2026 — GHG CI scores','E',617,43.6,253,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7465404663954165763'),
  ('pia','m05','Peterson Solutions España — participación en evento de sostenibilidad','E',441,20.63,53,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7465754288280174592'),
  ('pia','m05','Peterson Solutions en Sustainable Apparel & Textiles Conference USA 2026','E',432,21.53,74,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7465388833912774656'),
  ('tlr','m05','¡Inicia la temporada de Jengibre! — Fosetil-Aluminio análisis LC-MS/MS A2LA','E',322,72.36,229,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7457818554281844737'),
  ('tlr','m05','TLR presente en la III Convención Internacional del Jengibre — Pichanaki 2026','E',227,8.37,14,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7462145614085214208'),
  ('tlr','m05','Sanidad vegetal: el éxito reside en la precisión — Día Internacional','E',88,6.82,3,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7460045840330575872'),
  ('bel','m05','US delegates to ISO TC 238 — Berlin Germany, pyrogenic biocarbon standards','G',1515,7.26,67,'Orgánico','https://www.linkedin.com/feed/update/urn:li:activity:7457051485890093056');

insert into public.social_audience (client_id, dimension, label, value) values
  ('cul','seniority','Sin experiencia',8219),
  ('cul','seniority','Con experiencia',7700),
  ('cul','seniority','Gerente',2492),
  ('cul','seniority','Director',1334),
  ('cul','seniority','Vicepresidente',630),
  ('cul','seniority','Directivo',477),
  ('cul','seniority','Propietario',430),
  ('cul','seniority','Socio',291),
  ('cul','function','Operaciones',3383),
  ('cul','function','Desarrollo empresarial',2465),
  ('cul','function','Ventas',1633),
  ('cul','function','Contabilidad',1216),
  ('cul','function','TI',1080),
  ('cul','function','Administración',1045),
  ('cul','function','Finanzas',982),
  ('cul','function','Control calidad',972),
  ('cue','seniority','Sin experiencia',546),
  ('cue','seniority','Con experiencia',498),
  ('cue','seniority','Gerente',157),
  ('cue','seniority','Director',142),
  ('cue','seniority','Vicepresidente',38),
  ('cue','seniority','Directivo',30),
  ('cue','seniority','Propietario',24),
  ('cue','seniority','Socio',17),
  ('cue','function','Operaciones',183),
  ('cue','function','Control calidad',154),
  ('cue','function','Desarrollo empresarial',152),
  ('cue','function','Contabilidad',107),
  ('cue','function','Ventas',83),
  ('cue','function','TI',76),
  ('cue','function','Ingeniería',75),
  ('cue','function','Gestión proyectos',52),
  ('cup','seniority','Con experiencia',307),
  ('cup','seniority','Sin experiencia',261),
  ('cup','seniority','Gerente',94),
  ('cup','seniority','Director',85),
  ('cup','seniority','Directivo',31),
  ('cup','seniority','Vicepresidente',29),
  ('cup','seniority','Propietario',20),
  ('cup','seniority','Socio',13),
  ('cup','function','Desarrollo empresarial',118),
  ('cup','function','Operaciones',114),
  ('cup','function','Contabilidad',53),
  ('cup','function','Ventas',52),
  ('cup','function','Control de calidad',51),
  ('cup','function','Ingeniería',48),
  ('cup','function','Tecnología de la información',44),
  ('cup','function','Administración',37),
  ('cun','seniority','Con experiencia',702),
  ('cun','seniority','Sin experiencia',669),
  ('cun','seniority','Gerente',249),
  ('cun','seniority','Director',112),
  ('cun','seniority','Socio',50),
  ('cun','seniority','Propietario',50),
  ('cun','seniority','Vicepresidente',47),
  ('cun','seniority','Directivo',38),
  ('cun','function','Operaciones',308),
  ('cun','function','Desarrollo empresarial',254),
  ('cun','function','Ventas',189),
  ('cun','function','Contabilidad',131),
  ('cun','function','Finanzas',94),
  ('cun','function','Administración',89),
  ('cun','function','Tecnología de la información',85),
  ('cun','function','Ingeniería',61),
  ('cuna','seniority','Con experiencia',379),
  ('cuna','seniority','Sin experiencia',266),
  ('cuna','seniority','Gerente',99),
  ('cuna','seniority','Director',72),
  ('cuna','seniority','Vicepresidente',56),
  ('cuna','seniority','Directivo',44),
  ('cuna','seniority','Propietario',22),
  ('cuna','seniority','Socio',11),
  ('cuna','function','Operaciones',162),
  ('cuna','function','Desarrollo empresarial',132),
  ('cuna','function','Contabilidad',76),
  ('cuna','function','Ventas',52),
  ('cuna','function','Servicios comunitarios',51),
  ('cuna','function','TI',43),
  ('cuna','function','Control calidad',38),
  ('cuna','function','Gestión proyectos',35),
  ('ps','seniority','Con experiencia',1595),
  ('ps','seniority','Sin experiencia',1418),
  ('ps','seniority','Gerente',321),
  ('ps','seniority','Director',304),
  ('ps','seniority','Vicepresidente',147),
  ('ps','seniority','Directivo',108),
  ('ps','seniority','Propietario',82),
  ('ps','seniority','Formación',51),
  ('ps','function','Desarrollo empresarial',558),
  ('ps','function','Operaciones',424),
  ('ps','function','TI',317),
  ('ps','function','Ingeniería',285),
  ('ps','function','Ventas',273),
  ('ps','function','Contabilidad',187),
  ('ps','function','Servicios sociales',166),
  ('ps','function','Arte y diseño',160),
  ('pia','seniority','Con experiencia',2541),
  ('pia','seniority','Sin experiencia',2381),
  ('pia','seniority','Gerente',516),
  ('pia','seniority','Director',379),
  ('pia','seniority','Vicepresidente',126),
  ('pia','seniority','Propietario',118),
  ('pia','seniority','Formación',113),
  ('pia','seniority','Directivo',106),
  ('pia','function','Desarrollo empresarial',788),
  ('pia','function','Operaciones',775),
  ('pia','function','Servicios sociales',555),
  ('pia','function','Investigación',352),
  ('pia','function','Gestión proyectos',346),
  ('pia','function','Ventas',307),
  ('pia','function','TI',303),
  ('pia','function','Educación',292),
  ('tlr','seniority','Con experiencia',122),
  ('tlr','seniority','Sin experiencia',121),
  ('tlr','seniority','Gerente',40),
  ('tlr','seniority','Vicepresidente',20),
  ('tlr','seniority','Director',17),
  ('tlr','seniority','Directivo',8),
  ('tlr','seniority','Propietario',5),
  ('tlr','seniority','Formación',1),
  ('tlr','function','Ventas',52),
  ('tlr','function','Desarrollo empresarial',48),
  ('tlr','function','Operaciones',48),
  ('tlr','function','Investigación',35),
  ('tlr','function','Tecnología de la información',19),
  ('tlr','function','Control de calidad',16),
  ('tlr','function','Contabilidad',15),
  ('tlr','function','Ingeniería',15),
  ('bel','seniority','Con experiencia',160),
  ('bel','seniority','Sin experiencia',142),
  ('bel','seniority','Director',77),
  ('bel','seniority','Directivo',50),
  ('bel','seniority','Vicepresidente',47),
  ('bel','seniority','Gerente',43),
  ('bel','seniority','Propietario',30),
  ('bel','seniority','Socio',7),
  ('bel','function','Desarrollo empresarial',125),
  ('bel','function','Operaciones',90),
  ('bel','function','Ventas',59),
  ('bel','function','Investigación',44),
  ('bel','function','Gestión de proyectos',24),
  ('bel','function','Educación',19),
  ('bel','function','Ingeniería',16),
  ('bel','function','Medios de comunicación',16);
