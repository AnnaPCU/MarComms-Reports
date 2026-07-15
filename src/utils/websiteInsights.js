// ════════════════════════════════════════════════════════════════
//  MOTOR DE ANÁLISIS — Pilar Website (GA4 + Search Console)
//  Genera insights, diagnóstico y próximos pasos a partir de las métricas
//  reales del trimestre (nunca inventa números).
// ════════════════════════════════════════════════════════════════

const numEs = (v) => Number(v || 0).toLocaleString('es-AR');
const pct = (v) => Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';

// ─────────────────────────── WEBSITE (GA) ───────────────────────────
export function genSiteInsights(d) {
  if (!d) return [];
  const convRate = d.totalTraffic ? (d.conversions / d.totalTraffic) * 100 : 0;
  const top = d.topLandingPages?.[0];
  const ins = [];
  ins.push({
    m: `${numEs(d.totalTraffic)} sesiones y ${numEs(d.singleTraffic)} usuarios únicos en el trimestre.`,
    a: `Base de tráfico establecida ➜ <strong>identificar los canales que traen las sesiones de mayor calidad</strong> y reforzarlos con contenido y CTA claros.`,
  });
  ins.push({
    m: `${numEs(d.conversions)} conversiones (${pct(convRate)} sobre sesiones).`,
    a: `El sitio convierte ➜ <strong>replicar los elementos de las páginas que más convierten</strong> (formularios, CTA, prueba social) en el resto del sitio.`,
  });
  if (top) {
    ins.push({
      m: `La página más vista fue ${top.url} (${numEs(top.views)} vistas).`,
      a: `Concentra la atención ➜ <strong>optimizar esa landing</strong> con un CTA principal medible y enlaces internos a servicios.`,
    });
  }
  ins.push({
    m: `${numEs(d.impressions)} vistas de página en total.`,
    a: `<strong>Sumar contenido de servicios y casos</strong> enlazado desde las páginas más vistas para aumentar la profundidad de navegación.`,
  });
  return ins;
}

export function genSiteConclusions(d) {
  if (!d) return [];
  const convRate = d.totalTraffic ? (d.conversions / d.totalTraffic) * 100 : 0;
  return [
    { label: 'Tráfico', text: `<strong>${numEs(d.totalTraffic)} sesiones</strong> y <strong>${numEs(d.singleTraffic)} usuarios</strong>, con ${numEs(d.impressions)} vistas de página.` },
    { label: 'Conversión', text: `<strong>${numEs(d.conversions)} conversiones</strong> — una tasa de <strong>${pct(convRate)}</strong> sobre las sesiones del período.` },
    {
      label: 'Contenido',
      text: d.topLandingPages?.length
        ? `Las páginas más vistas (${d.topLandingPages.map((p) => p.url.replace(/^https?:\/\/[^/]+/, '') || '/').slice(0, 2).join(', ')}) concentran la navegación: son las candidatas a optimizar.`
        : 'Sin detalle de páginas en el período.',
    },
    { label: 'Oportunidad', text: `<strong>Mejorar la conversión de las landing top</strong> y reforzar los enlaces internos hacia páginas de servicio.` },
  ];
}

export function genSiteNextSteps(d) {
  if (!d) return [];
  const top = d.topLandingPages?.[0];
  return [
    top
      ? `<strong>Optimizar ${top.url.replace(/^https?:\/\/[^/]+/, '') || '/'}</strong>: es la página más vista. Definir un CTA principal medible y enlaces a servicios.`
      : `<strong>Definir CTAs medibles</strong> en las páginas principales del sitio.`,
    `<strong>Escalar lo que convierte</strong>: replicar formularios y prueba social de las páginas con mejor conversión en el resto del sitio.`,
    `<strong>Sumar contenido de servicios</strong> enlazado desde las páginas más vistas para aumentar la profundidad de navegación.`,
    `<strong>Comparar trimestre a trimestre</strong>: seguir sesiones, usuarios y conversiones para confirmar la tendencia.`,
  ];
}

// ─────────────────────────── SEO (GSC) ───────────────────────────
export function genSeoInsights(d) {
  if (!d) return [];
  const ctr = d.impressions ? (d.totalClicks / d.impressions) * 100 : 0;
  const topK = d.topKeywords?.[0];
  const ins = [];
  ins.push({
    m: `${numEs(d.totalClicks)} clics orgánicos sobre ${numEs(d.impressions)} impresiones (CTR ${pct(ctr)}).`,
    a: `Visibilidad orgánica establecida ➜ <strong>trabajar los títulos y meta descripciones</strong> de las páginas con muchas impresiones y pocos clics para subir el CTR.`,
  });
  ins.push({
    m: `Posición promedio de ${Number(d.averagePosition).toFixed(2)} en los resultados de búsqueda.`,
    a: `Hay margen para escalar ➜ <strong>reforzar contenido y enlaces internos</strong> de las keywords en posiciones 5–15 para acercarlas al top 3.`,
  });
  if (topK) {
    ins.push({
      m: `La keyword con más clics fue "${topK.query}" (${numEs(topK.clicks)} clics).`,
      a: `Fuerte demanda de marca ➜ <strong>capturar esa intención</strong> con una landing optimizada y CTA a servicios.`,
    });
  }
  ins.push({
    m: `La búsqueda de marca concentra buena parte del tráfico orgánico.`,
    a: `<strong>Ampliar hacia keywords no-marca</strong> (servicios, certificaciones) para captar demanda nueva además de la que ya conoce la marca.`,
  });
  return ins;
}

export function genSeoConclusions(d) {
  if (!d) return [];
  const ctr = d.impressions ? (d.totalClicks / d.impressions) * 100 : 0;
  return [
    { label: 'Visibilidad', text: `<strong>${numEs(d.impressions)} impresiones</strong> en búsqueda, con una posición promedio de <strong>${Number(d.averagePosition).toFixed(2)}</strong>.` },
    { label: 'Tráfico orgánico', text: `<strong>${numEs(d.totalClicks)} clics</strong> — un CTR de <strong>${pct(ctr)}</strong> sobre las impresiones.` },
    {
      label: 'Demanda',
      text: d.topKeywords?.length
        ? `Las keywords principales (${d.topKeywords.slice(0, 2).map((k) => `"${k.query}"`).join(', ')}) son mayormente de marca: hay quien ya busca la empresa.`
        : 'Sin detalle de keywords en el período.',
    },
    { label: 'Oportunidad', text: `<strong>Crecer en keywords no-marca</strong> (servicios y certificaciones) y subir el CTR de las páginas con muchas impresiones.` },
  ];
}

export function genSeoNextSteps(d) {
  if (!d) return [];
  return [
    `<strong>Subir el CTR</strong>: reescribir títulos y meta descripciones de las páginas con muchas impresiones y pocos clics.`,
    `<strong>Escalar posiciones 5–15</strong>: reforzar contenido y enlaces internos de esas keywords para acercarlas al top 3.`,
    `<strong>Ampliar a keywords no-marca</strong>: crear contenido de servicios y certificaciones para captar demanda nueva.`,
    `<strong>Comparar trimestre a trimestre</strong>: seguir impresiones, clics, CTR y posición promedio.`,
  ];
}
