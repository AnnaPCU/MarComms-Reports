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
