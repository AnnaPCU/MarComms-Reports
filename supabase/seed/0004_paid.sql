-- ════════════════════════════════════════════════════════════════
--  seed/0004_paid.sql — Pilar Paid Media (Google Ads Search)
--  GENERADO automáticamente desde src/data/paidSeed.js
--  (no editar a mano: correr scripts/generate-paid-sql.mjs).
--  Idempotente: se puede volver a correr.
-- ════════════════════════════════════════════════════════════════

-- Clientes del pilar Paid
insert into public.paid_clients (id, name, sort_order) values
  ('pt', 'CU Portugal', 1),
  ('es', 'CU España', 2),
  ('cuc', 'CU Canadá', 3),
  ('psar', 'PS Argentina', 4)
on conflict (id) do nothing;

-- Limpiar lo existente de estos clientes (platform google_ads) para recargar sin duplicar
delete from public.paid_campaigns
  where platform = 'google_ads'
    and client_id in ('pt', 'es', 'cuc', 'psar');

-- Totales por período (upsert)
insert into public.paid_metrics
  (client_id, period_id, platform, channel, objetivo, impressions, clicks, ctr, cpc, cost, currency, conversions, conversion_rate, cost_per_conv, analysis) values
  ('pt', 'm02', 'google_ads', 'Google Ads Search', 'Generación de leads', 9260, 72, 0.78, 0.54, 39.12, 'EUR', 0, 0, 0, 'En febrero solo GMP+ tuvo actividad (9.260 impresiones, 72 clics, 39,12 EUR), sin conversiones. Las otras 6 campañas estaban habilitadas pero sin impresiones en el período.'),
  ('pt', 'm03', 'google_ads', 'Google Ads Search', 'Generación de leads', 9238, 145, 1.57, 1.06, 153.03, 'EUR', 2, 1.38, 76.51, 'Marzo fue el mejor mes de GMP+: 2 conversiones a 76,51 EUR cada una, con CTR de 1,57% sobre 9.238 impresiones. El resto de las campañas siguió sin actividad.'),
  ('pt', 'm04', 'google_ads', 'Google Ads Search', 'Generación de leads', 1522, 56, 3.68, 2.42, 135.41, 'EUR', 1, 1.79, 135.41, 'En abril GMP+ mejoró el CTR a 3,68%, pero con menos volumen (1.522 impresiones) y 1 conversión a 135,41 EUR — coste por conversión más alto que en marzo. Resto sin actividad.'),
  ('pt', 'm05', 'google_ads', 'Google Ads Search', 'Generación de leads', 1680, 42, 2.5, 2.33, 98.05, 'EUR', 0, 0, 0, 'En mayo se activaron casi todas las campañas, pero con volúmenes muy bajos (Plásticos, Forestal, Biomasa y Bioenergía con pocas impresiones y sin clics). GMP+ sigue concentrando el grueso de impresiones y costo. Sin conversiones en el mes.'),
  ('pt', 'm06', 'google_ads', 'Google Ads Search', 'Generación de leads', 838, 62, 7.4, 1.35, 83.97, 'EUR', 0, 0, 0, 'Junio completo. Textile lideró la actividad (29 clics, CTR 8,66%) y Plásticos destacó por CTR (13,33%) con bajo volumen. GMP+, Smeta y Bioenergía sumaron actividad menor. Forestal y Biomasa tuvieron impresiones pero ningún clic. Sin conversiones en el mes. Total: 838 impresiones, 62 clics y 83,97 EUR invertidos.'),
  ('es', 'm04', 'google_ads', 'Google Ads Search', 'Generación de leads', 1144, 181, 15.82, 1.37, 247.28, 'EUR', 4, 2.21, 61.82, 'En abril el análisis se concentra en IFS y GMP+. IFS muestra la mejor señal: 130 clics, 4 conversiones, tasa de conversión de 3,08% y coste por conversión de 26,91 EUR — la campaña con mejor resultado del mes. GMP+ generó más impresiones pero no registró conversiones, lo que sugiere revisar intención de búsqueda, anuncios y landing page.'),
  ('es', 'm06', 'google_ads', 'Google Ads Search', 'Generación de leads', 2692, 196, 7.28, 1.54, 301.65, 'EUR', 1, 0.51, 301.65, 'En junio, IFS volvió a ser la única campaña con conversión (1 conversión a 63,10 EUR) sobre 55 clics y un CTR del 15,03% — la mejor señal del mes. GMP+ concentró el mayor coste (90,72 EUR) con 31 clics pero sin conversiones. Forestal, Textile, Plásticos, Bioenergía, Smeta y Biomasa tuvieron actividad moderada sin conversiones, y "Car" quedó sin impresiones. Total: 2.692 impresiones, 196 clics y 301,65 EUR invertidos.'),
  ('cuc', 'm06', 'google_ads', 'Google Ads Search', 'Generación de leads', 276, 14, 5.07, 1.62, 22.68, 'EUR', 0, 0, 0, 'Primer período cargado de CU Canadá. Canada Gap concentró la actividad (12 clics, 168 impresiones, CTR 7,14%) y Smeta aportó 2 clics. Forestry, GLOBALG.A.P. y Aqua / Fisheries tuvieron impresiones sin clics, y Cannabis quedó sin actividad. Sin conversiones en el mes. Total: 276 impresiones, 14 clics y 22,68 EUR invertidos.'),
  ('psar', 'm06', 'google_ads', 'Google Ads Search', 'Generación de leads', 3912, 119, 3.04, 0.95, 112.57, 'EUR', 0, 0, 0, 'Primer período cargado de PS Argentina. Las líneas SuSe (ESG / Reportes, Huella de agua y de carbono) y SuSo (Agricultura regenerativa) concentraron los clics; "ESG / Reportes" lideró con 47 clics sobre 1.227 impresiones. "Bioenergía / Biocombustibles" tuvo alto volumen de impresiones (1.069) pero bajo CTR (0,65%). Dos campañas SuSo tuvieron impresiones sin clics. Sin conversiones en el mes. Total: 3.912 impresiones, 119 clics y 112,57 EUR invertidos.')
on conflict (client_id, period_id, platform) do update set
  channel = excluded.channel, objetivo = excluded.objetivo,
  impressions = excluded.impressions, clicks = excluded.clicks, ctr = excluded.ctr,
  cpc = excluded.cpc, cost = excluded.cost, currency = excluded.currency,
  conversions = excluded.conversions, conversion_rate = excluded.conversion_rate,
  cost_per_conv = excluded.cost_per_conv, analysis = excluded.analysis;

-- Campañas
insert into public.paid_campaigns
  (client_id, period_id, platform, name, impressions, clicks, ctr, cpc, cost, conversions, conversion_rate, cost_per_conv, opt_level) values
  ('pt', 'm02', 'google_ads', 'Textile', 0, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm02', 'google_ads', 'Smeta', 0, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm02', 'google_ads', 'Plásticos', 0, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm02', 'google_ads', 'GMP+', 9260, 72, 0.78, 0.54, 39.12, 0, 0, 0, null),
  ('pt', 'm02', 'google_ads', 'Forestal', 0, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm02', 'google_ads', 'Biomasa', 0, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm02', 'google_ads', 'Bioenergía', 0, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm03', 'google_ads', 'Textile', 0, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm03', 'google_ads', 'Smeta', 0, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm03', 'google_ads', 'Plásticos', 0, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm03', 'google_ads', 'GMP+', 9238, 145, 1.57, 1.06, 153.03, 2, 1.38, 76.51, null),
  ('pt', 'm03', 'google_ads', 'Forestal', 0, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm03', 'google_ads', 'Biomasa', 0, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm03', 'google_ads', 'Bioenergía', 0, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm04', 'google_ads', 'Textile', 0, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm04', 'google_ads', 'Smeta', 0, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm04', 'google_ads', 'Plásticos', 0, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm04', 'google_ads', 'GMP+', 1522, 56, 3.68, 2.42, 135.41, 1, 1.79, 135.41, null),
  ('pt', 'm04', 'google_ads', 'Forestal', 0, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm04', 'google_ads', 'Biomasa', 0, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm04', 'google_ads', 'Bioenergía', 0, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm05', 'google_ads', 'Textile', 104, 8, 7.69, 0.68, 5.47, 0, 0, 0, null),
  ('pt', 'm05', 'google_ads', 'Smeta', 53, 1, 1.89, 1.49, 1.49, 0, 0, 0, null),
  ('pt', 'm05', 'google_ads', 'Plásticos', 14, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm05', 'google_ads', 'GMP+', 1495, 33, 2.21, 2.76, 91.09, 0, 0, 0, null),
  ('pt', 'm05', 'google_ads', 'Forestal', 4, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm05', 'google_ads', 'Biomasa', 3, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm05', 'google_ads', 'Bioenergía', 7, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm06', 'google_ads', 'Textile', 335, 29, 8.66, 1.36, 39.57, 0, 0, 0, null),
  ('pt', 'm06', 'google_ads', 'Plásticos', 90, 12, 13.33, 0.98, 11.72, 0, 0, 0, null),
  ('pt', 'm06', 'google_ads', 'GMP+', 159, 8, 5.03, 2.23, 17.84, 0, 0, 0, null),
  ('pt', 'm06', 'google_ads', 'Smeta', 170, 7, 4.12, 1.25, 8.76, 0, 0, 0, null),
  ('pt', 'm06', 'google_ads', 'Bioenergía', 68, 6, 8.82, 1.01, 6.08, 0, 0, 0, null),
  ('pt', 'm06', 'google_ads', 'Forestal', 12, 0, 0, 0, 0, 0, 0, 0, null),
  ('pt', 'm06', 'google_ads', 'Biomasa', 4, 0, 0, 0, 0, 0, 0, 0, null),
  ('es', 'm04', 'google_ads', 'IFS', 368, 130, 35.33, 0.83, 107.66, 4, 3.08, 26.91, 83.1),
  ('es', 'm04', 'google_ads', 'GMP+', 776, 51, 6.57, 2.74, 139.62, 0, 0, 0, 80.9),
  ('es', 'm06', 'google_ads', 'IFS', 366, 55, 15.03, 1.15, 63.1, 1, 1.82, 63.1, null),
  ('es', 'm06', 'google_ads', 'GMP+', 636, 31, 4.87, 2.93, 90.72, 0, 0, 0, null),
  ('es', 'm06', 'google_ads', 'Forestal', 485, 28, 5.77, 1.19, 33.24, 0, 0, 0, null),
  ('es', 'm06', 'google_ads', 'Textile', 378, 26, 6.88, 1.19, 30.83, 0, 0, 0, null),
  ('es', 'm06', 'google_ads', 'Plásticos', 244, 20, 8.2, 1.7, 34, 0, 0, 0, null),
  ('es', 'm06', 'google_ads', 'Bioenergía', 183, 15, 8.2, 1.47, 22.11, 0, 0, 0, null),
  ('es', 'm06', 'google_ads', 'Smeta', 331, 13, 3.93, 1.38, 17.92, 0, 0, 0, null),
  ('es', 'm06', 'google_ads', 'Biomasa', 69, 8, 11.59, 1.22, 9.73, 0, 0, 0, null),
  ('es', 'm06', 'google_ads', 'Car', 0, 0, 0, 0, 0, 0, 0, 0, null),
  ('cuc', 'm06', 'google_ads', 'Canada Gap', 168, 12, 7.14, 1.77, 21.28, 0, 0, 0, null),
  ('cuc', 'm06', 'google_ads', 'Smeta', 69, 2, 2.9, 0.7, 1.4, 0, 0, 0, null),
  ('cuc', 'm06', 'google_ads', 'Forestry', 27, 0, 0, 0, 0, 0, 0, 0, null),
  ('cuc', 'm06', 'google_ads', 'GLOBALG.A.P.', 10, 0, 0, 0, 0, 0, 0, 0, null),
  ('cuc', 'm06', 'google_ads', 'Aqua / Fisheries', 2, 0, 0, 0, 0, 0, 0, 0, null),
  ('cuc', 'm06', 'google_ads', 'Cannabis', 0, 0, 0, 0, 0, 0, 0, 0, null),
  ('psar', 'm06', 'google_ads', 'SuSe - ESG / Reportes', 1227, 47, 3.83, 0.8, 37.38, 0, 0, 0, null),
  ('psar', 'm06', 'google_ads', 'SuSo - Agricultura regenerativa', 831, 34, 4.09, 0.87, 29.69, 0, 0, 0, null),
  ('psar', 'm06', 'google_ads', 'SuSe - Huella de agua', 119, 15, 12.61, 1.61, 24.19, 0, 0, 0, null),
  ('psar', 'm06', 'google_ads', 'SuSe - Huella de carbono / GEI', 486, 9, 1.85, 1.12, 10.1, 0, 0, 0, null),
  ('psar', 'm06', 'google_ads', 'CeSu - Preparación para certificaciones', 162, 7, 4.32, 1.36, 9.51, 0, 0, 0, null),
  ('psar', 'm06', 'google_ads', 'Bioenergía / Biocombustibles', 1069, 7, 0.65, 0.24, 1.7, 0, 0, 0, null),
  ('psar', 'm06', 'google_ads', 'SuSo - Abastecimiento sostenible', 6, 0, 0, 0, 0, 0, 0, 0, null),
  ('psar', 'm06', 'google_ads', 'SuSo - Trazabilidad / EUDR', 12, 0, 0, 0, 0, 0, 0, 0, null);
