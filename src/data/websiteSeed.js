// ════════════════════════════════════════════════════════════════
//  SEED — Pilar Website · Q1 2026
//  Datos reales tomados a rajatabla de las capturas de Control Union
//  Argentina (GA = tráfico/sitio, GSC = SEO). Website se maneja por
//  TRIMESTRE. Seed temporal hasta que el import a Supabase persista.
// ════════════════════════════════════════════════════════════════

export const WEBSITE_CLIENTS = [{ id: 'cua', name: 'Control Union Argentina' }];

export const WEBSITE_DB = {
  cua: {
    name: 'Control Union Argentina',
    handle: '@controlunionargentina',
    periods: {
      'q1-2026': {
        // ── Website (Google Analytics) ──
        site: {
          singleTraffic: 514, // visitantes únicos
          totalTraffic: 856, // sesiones / visitas
          impressions: 1978, // page views
          conversions: 207,
          topLandingPages: [
            { url: 'https://argentina.controlunion.com/', views: 449 },
            { url: 'https://argentina.controlunion.com/vacantes/', views: 223 },
            { url: 'https://argentina.controlunion.com/nosotros/', views: 166 },
          ],
          analysis:
            'Durante el Q1 2026, el sitio de Control Union Argentina generó 856 sesiones, 514 usuarios activos y 1.978 vistas de página. Las páginas más vistas fueron el home, vacantes (“Sumate al equipo”) y “Quiénes somos”, lo que sugiere que los usuarios interactúan principalmente con información corporativa central y contenido de reclutamiento. Las conversiones totales fueron 207, impulsadas por clics en email y envíos de formularios.',
        },
        // ── SEO (Google Search Console) ──
        seo: {
          averagePosition: 7.63,
          impressions: 19530,
          totalClicks: 583,
          topKeywords: [
            { query: 'control union', clicks: 154 },
            { query: 'control union argentina', clicks: 90 },
            { query: 'control union tucuman', clicks: 13 },
          ],
          analysis:
            'Durante el Q1 2026, la búsqueda orgánica generó 583 clics a partir de 19.530 impresiones, con una posición promedio de 7,63. La performance está fuertemente influenciada por la demanda de marca: las queries que contienen “control union” concentran ~50% de los clics, y las tres principales representan ~44%, lo que indica que la visibilidad y el tráfico provienen mayormente de usuarios que ya conocen la marca.',
        },
      },
    },
  },
};
