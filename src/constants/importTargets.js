// ════════════════════════════════════════════════════════════════
//  DESTINOS DE IMPORT — define, por pilar, qué datasets se pueden
//  importar y a qué campos se mapean las columnas del archivo.
//  Por ahora: Social Media (pilar de referencia). El resto se agrega
//  siguiendo el mismo molde.
// ════════════════════════════════════════════════════════════════

export const IMPORT_TARGETS = {
  social: {
    label: 'Social Media (LinkedIn)',
    source: 'linkedin',
    datasets: [
      {
        id: 'metrics',
        label: 'Métricas mensuales',
        mode: 'single', // toma la primera fila → un registro por (cuenta, período)
        table: 'social_metrics',
        fields: [
          { key: 'impressions', label: 'Impresiones', type: 'int', required: true },
          { key: 'clicks', label: 'Clics', type: 'int', required: true },
          { key: 'engagement_rate', label: 'Engagement Rate (%)', type: 'num', required: true },
          { key: 'profile_visits', label: 'Visitas al perfil', type: 'int' },
          { key: 'new_followers', label: 'Seguidores nuevos', type: 'int' },
        ],
      },
      {
        id: 'posts',
        label: 'Publicaciones',
        mode: 'rows', // cada fila → una publicación
        table: 'social_posts',
        fields: [
          { key: 'title', label: 'Título', type: 'text', required: true },
          { key: 'esg_pillar', label: 'Pilar ESG (E/S/G/X) — opcional', type: 'text' },
          { key: 'impressions', label: 'Impresiones', type: 'int', required: true },
          { key: 'engagement_rate', label: 'Engagement Rate (%)', type: 'num' },
          { key: 'clicks', label: 'Clics', type: 'int' },
          { key: 'post_type', label: 'Tipo', type: 'text' },
          { key: 'url', label: 'URL', type: 'text' },
        ],
      },
      {
        id: 'audience',
        label: 'Audiencia',
        mode: 'rows',
        table: 'social_audience',
        dimension: true, // requiere elegir seniority/function para todo el archivo
        fields: [
          { key: 'label', label: 'Etiqueta', type: 'text', required: true },
          { key: 'value', label: 'Valor', type: 'int', required: true },
        ],
      },
    ],
  },

  paid: {
    label: 'Paid Media (Google Ads / Meta)',
    source: 'google_ads',
    datasets: [
      {
        id: 'campaigns',
        label: 'Campañas (export de Google Ads)',
        mode: 'rows', // cada fila = una campaña; los totales se calculan solos
        table: 'paid_campaigns',
        // Los export de Google Ads traen 2 filas de preámbulo antes del header.
        headerOffset: 2,
        cleanName: true, // "CU Portugal - GMP+ - Search" → "GMP+"
        fields: [
          { key: 'name', label: 'Campaña', type: 'text', required: true },
          { key: 'impressions', label: 'Impresiones (Impr.)', type: 'int', required: true },
          { key: 'clicks', label: 'Clics', type: 'int', required: true },
          { key: 'ctr', label: 'CTR', type: 'num' },
          { key: 'cpc', label: 'CPC (Prom. CPC)', type: 'num' },
          { key: 'cost', label: 'Costo', type: 'num' },
          { key: 'conversions', label: 'Conversiones', type: 'num' },
          { key: 'cost_per_conv', label: 'Costo/conv.', type: 'num' },
          { key: 'conversion_rate', label: 'Porcentaje de conv.', type: 'num' },
        ],
      },
    ],
  },
};

export const DIMENSION_OPTIONS = [
  { id: 'seniority', label: 'Nivel de responsabilidad' },
  { id: 'function', label: 'Función laboral' },
];
