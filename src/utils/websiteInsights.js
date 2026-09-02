// ════════════════════════════════════════════════════════════════
//  MOTOR DE ANÁLISIS — Pilar Website (GA4 + Search Console)
//  Genera insights, diagnóstico y próximos pasos a partir de las métricas
//  reales del trimestre (nunca inventa números).
//  Bilingüe: cada generador recibe lang ('es' | 'en').
// ════════════════════════════════════════════════════════════════

const num = (v, lang) => Number(v || 0).toLocaleString(lang === 'en' ? 'en-US' : 'es-AR');
const pct = (v, lang) =>
  Number(v || 0).toLocaleString(lang === 'en' ? 'en-US' : 'es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';
const shortUrl = (u) => u.replace(/^https?:\/\/[^/]+/, '') || '/';

// ─────────────────────────── WEBSITE (GA) ───────────────────────────
export function genSiteInsights(d, lang = 'es') {
  if (!d) return [];
  const en = lang === 'en';
  const n = (v) => num(v, lang);
  const p = (v) => pct(v, lang);
  const convRate = d.totalTraffic ? (d.conversions / d.totalTraffic) * 100 : 0;
  const top = d.topLandingPages?.[0];
  const ins = [];
  ins.push(
    en
      ? {
          m: `${n(d.totalTraffic)} sessions and ${n(d.singleTraffic)} unique users in the quarter.`,
          a: `Traffic base established ➜ <strong>identify the channels bringing the highest-quality sessions</strong> and reinforce them with clear content and CTAs.`,
        }
      : {
          m: `${n(d.totalTraffic)} sesiones y ${n(d.singleTraffic)} usuarios únicos en el trimestre.`,
          a: `Base de tráfico establecida ➜ <strong>identificar los canales que traen las sesiones de mayor calidad</strong> y reforzarlos con contenido y CTA claros.`,
        },
  );
  ins.push(
    en
      ? {
          m: `${n(d.conversions)} conversions (${p(convRate)} of sessions).`,
          a: `The site converts ➜ <strong>replicate the elements of the best-converting pages</strong> (forms, CTAs, social proof) across the rest of the site.`,
        }
      : {
          m: `${n(d.conversions)} conversiones (${p(convRate)} sobre sesiones).`,
          a: `El sitio convierte ➜ <strong>replicar los elementos de las páginas que más convierten</strong> (formularios, CTA, prueba social) en el resto del sitio.`,
        },
  );
  if (top) {
    ins.push(
      en
        ? {
            m: `The most viewed page was ${top.url} (${n(top.views)} views).`,
            a: `It concentrates attention ➜ <strong>optimize that landing page</strong> with a measurable main CTA and internal links to services.`,
          }
        : {
            m: `La página más vista fue ${top.url} (${n(top.views)} vistas).`,
            a: `Concentra la atención ➜ <strong>optimizar esa landing</strong> con un CTA principal medible y enlaces internos a servicios.`,
          },
    );
  }
  ins.push(
    en
      ? {
          m: `${n(d.impressions)} page views in total.`,
          a: `<strong>Add services and case-study content</strong> linked from the most viewed pages to increase browsing depth.`,
        }
      : {
          m: `${n(d.impressions)} vistas de página en total.`,
          a: `<strong>Sumar contenido de servicios y casos</strong> enlazado desde las páginas más vistas para aumentar la profundidad de navegación.`,
        },
  );
  return ins;
}

export function genSiteConclusions(d, lang = 'es') {
  if (!d) return [];
  const en = lang === 'en';
  const n = (v) => num(v, lang);
  const p = (v) => pct(v, lang);
  const convRate = d.totalTraffic ? (d.conversions / d.totalTraffic) * 100 : 0;
  return en
    ? [
        { label: 'Traffic', text: `<strong>${n(d.totalTraffic)} sessions</strong> and <strong>${n(d.singleTraffic)} users</strong>, with ${n(d.impressions)} page views.` },
        { label: 'Conversion', text: `<strong>${n(d.conversions)} conversions</strong> — a rate of <strong>${p(convRate)}</strong> over the period's sessions.` },
        {
          label: 'Content',
          text: d.topLandingPages?.length
            ? `The most viewed pages (${d.topLandingPages.map((x) => shortUrl(x.url)).slice(0, 2).join(', ')}) concentrate the navigation: they are the candidates to optimize.`
            : 'No page detail for the period.',
        },
        { label: 'Opportunity', text: `<strong>Improve the conversion of the top landing pages</strong> and reinforce internal links toward service pages.` },
      ]
    : [
        { label: 'Tráfico', text: `<strong>${n(d.totalTraffic)} sesiones</strong> y <strong>${n(d.singleTraffic)} usuarios</strong>, con ${n(d.impressions)} vistas de página.` },
        { label: 'Conversión', text: `<strong>${n(d.conversions)} conversiones</strong> — una tasa de <strong>${p(convRate)}</strong> sobre las sesiones del período.` },
        {
          label: 'Contenido',
          text: d.topLandingPages?.length
            ? `Las páginas más vistas (${d.topLandingPages.map((x) => shortUrl(x.url)).slice(0, 2).join(', ')}) concentran la navegación: son las candidatas a optimizar.`
            : 'Sin detalle de páginas en el período.',
        },
        { label: 'Oportunidad', text: `<strong>Mejorar la conversión de las landing top</strong> y reforzar los enlaces internos hacia páginas de servicio.` },
      ];
}

export function genSiteNextSteps(d, lang = 'es') {
  if (!d) return [];
  const en = lang === 'en';
  const top = d.topLandingPages?.[0];
  return en
    ? [
        top
          ? `<strong>Optimize ${shortUrl(top.url)}</strong>: it is the most viewed page. Define a measurable main CTA and links to services.`
          : `<strong>Define measurable CTAs</strong> on the site's main pages.`,
        `<strong>Scale what converts</strong>: replicate forms and social proof from the best-converting pages across the rest of the site.`,
        `<strong>Add services content</strong> linked from the most viewed pages to increase browsing depth.`,
        `<strong>Compare quarter over quarter</strong>: track sessions, users and conversions to confirm the trend.`,
      ]
    : [
        top
          ? `<strong>Optimizar ${shortUrl(top.url)}</strong>: es la página más vista. Definir un CTA principal medible y enlaces a servicios.`
          : `<strong>Definir CTAs medibles</strong> en las páginas principales del sitio.`,
        `<strong>Escalar lo que convierte</strong>: replicar formularios y prueba social de las páginas con mejor conversión en el resto del sitio.`,
        `<strong>Sumar contenido de servicios</strong> enlazado desde las páginas más vistas para aumentar la profundidad de navegación.`,
        `<strong>Comparar trimestre a trimestre</strong>: seguir sesiones, usuarios y conversiones para confirmar la tendencia.`,
      ];
}

// ─────────────────────────── SEO (GSC) ───────────────────────────
export function genSeoInsights(d, lang = 'es') {
  if (!d) return [];
  const en = lang === 'en';
  const n = (v) => num(v, lang);
  const p = (v) => pct(v, lang);
  const ctr = d.impressions ? (d.totalClicks / d.impressions) * 100 : 0;
  const topK = d.topKeywords?.[0];
  const ins = [];
  ins.push(
    en
      ? {
          m: `${n(d.totalClicks)} organic clicks over ${n(d.impressions)} impressions (CTR ${p(ctr)}).`,
          a: `Organic visibility established ➜ <strong>work on titles and meta descriptions</strong> of pages with many impressions and few clicks to raise the CTR.`,
        }
      : {
          m: `${n(d.totalClicks)} clics orgánicos sobre ${n(d.impressions)} impresiones (CTR ${p(ctr)}).`,
          a: `Visibilidad orgánica establecida ➜ <strong>trabajar los títulos y meta descripciones</strong> de las páginas con muchas impresiones y pocos clics para subir el CTR.`,
        },
  );
  ins.push(
    en
      ? {
          m: `Average position of ${Number(d.averagePosition).toFixed(2)} in search results.`,
          a: `There is room to climb ➜ <strong>reinforce content and internal links</strong> for keywords in positions 5–15 to bring them closer to the top 3.`,
        }
      : {
          m: `Posición promedio de ${Number(d.averagePosition).toFixed(2)} en los resultados de búsqueda.`,
          a: `Hay margen para escalar ➜ <strong>reforzar contenido y enlaces internos</strong> de las keywords en posiciones 5–15 para acercarlas al top 3.`,
        },
  );
  if (topK) {
    ins.push(
      en
        ? {
            m: `The keyword with the most clicks was "${topK.query}" (${n(topK.clicks)} clicks).`,
            a: `Strong brand demand ➜ <strong>capture that intent</strong> with an optimized landing page and a CTA to services.`,
          }
        : {
            m: `La keyword con más clics fue "${topK.query}" (${n(topK.clicks)} clics).`,
            a: `Fuerte demanda de marca ➜ <strong>capturar esa intención</strong> con una landing optimizada y CTA a servicios.`,
          },
    );
  }
  ins.push(
    en
      ? {
          m: `Brand search concentrates a good share of the organic traffic.`,
          a: `<strong>Expand into non-brand keywords</strong> (services, certifications) to capture new demand beyond those who already know the brand.`,
        }
      : {
          m: `La búsqueda de marca concentra buena parte del tráfico orgánico.`,
          a: `<strong>Ampliar hacia keywords no-marca</strong> (servicios, certificaciones) para captar demanda nueva además de la que ya conoce la marca.`,
        },
  );
  return ins;
}

export function genSeoConclusions(d, lang = 'es') {
  if (!d) return [];
  const en = lang === 'en';
  const n = (v) => num(v, lang);
  const p = (v) => pct(v, lang);
  const ctr = d.impressions ? (d.totalClicks / d.impressions) * 100 : 0;
  return en
    ? [
        { label: 'Visibility', text: `<strong>${n(d.impressions)} impressions</strong> in search, with an average position of <strong>${Number(d.averagePosition).toFixed(2)}</strong>.` },
        { label: 'Organic traffic', text: `<strong>${n(d.totalClicks)} clicks</strong> — a CTR of <strong>${p(ctr)}</strong> over impressions.` },
        {
          label: 'Demand',
          text: d.topKeywords?.length
            ? `The main keywords (${d.topKeywords.slice(0, 2).map((k) => `"${k.query}"`).join(', ')}) are mostly brand searches: people are already looking for the company.`
            : 'No keyword detail for the period.',
        },
        { label: 'Opportunity', text: `<strong>Grow in non-brand keywords</strong> (services and certifications) and raise the CTR of pages with many impressions.` },
      ]
    : [
        { label: 'Visibilidad', text: `<strong>${n(d.impressions)} impresiones</strong> en búsqueda, con una posición promedio de <strong>${Number(d.averagePosition).toFixed(2)}</strong>.` },
        { label: 'Tráfico orgánico', text: `<strong>${n(d.totalClicks)} clics</strong> — un CTR de <strong>${p(ctr)}</strong> sobre las impresiones.` },
        {
          label: 'Demanda',
          text: d.topKeywords?.length
            ? `Las keywords principales (${d.topKeywords.slice(0, 2).map((k) => `"${k.query}"`).join(', ')}) son mayormente de marca: hay quien ya busca la empresa.`
            : 'Sin detalle de keywords en el período.',
        },
        { label: 'Oportunidad', text: `<strong>Crecer en keywords no-marca</strong> (servicios y certificaciones) y subir el CTR de las páginas con muchas impresiones.` },
      ];
}

export function genSeoNextSteps(d, lang = 'es') {
  if (!d) return [];
  return lang === 'en'
    ? [
        `<strong>Raise the CTR</strong>: rewrite titles and meta descriptions of pages with many impressions and few clicks.`,
        `<strong>Climb positions 5–15</strong>: reinforce content and internal links for those keywords to bring them closer to the top 3.`,
        `<strong>Expand to non-brand keywords</strong>: create services and certifications content to capture new demand.`,
        `<strong>Compare quarter over quarter</strong>: track impressions, clicks, CTR and average position.`,
      ]
    : [
        `<strong>Subir el CTR</strong>: reescribir títulos y meta descripciones de las páginas con muchas impresiones y pocos clics.`,
        `<strong>Escalar posiciones 5–15</strong>: reforzar contenido y enlaces internos de esas keywords para acercarlas al top 3.`,
        `<strong>Ampliar a keywords no-marca</strong>: crear contenido de servicios y certificaciones para captar demanda nueva.`,
        `<strong>Comparar trimestre a trimestre</strong>: seguir impresiones, clics, CTR y posición promedio.`,
      ];
}
