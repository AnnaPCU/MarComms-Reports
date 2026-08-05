// ════════════════════════════════════════════════════════════════
//  RESUMEN DEL AÑO — Social (LinkedIn).
//  Consolida la serie mensual de una cuenta y genera los agregados y
//  las lecturas (insights / diagnóstico / próximos pasos) del progreso
//  del año. SIN inventar datos: sólo usa los meses que tienen métricas.
// ════════════════════════════════════════════════════════════════

import { classifyESG, ESG_NAME } from '@/utils/esg';

const numEs = (v) => Number(v || 0).toLocaleString('es-AR');
const pct1 = (v) => Number(v || 0).toFixed(1) + '%';
const sum = (arr, f) => arr.reduce((s, x) => s + (f(x) || 0), 0);

// Agregados del año a partir de la serie [{ id, label, short, mo }].
export function yearAggregates(series = []) {
  const months = series.filter((s) => s.mo);
  if (!months.length) return null;
  const first = months[0];
  const last = months[months.length - 1];
  const totalImp = sum(months, (m) => m.mo.imp);
  const totalClk = sum(months, (m) => m.mo.clk);
  const totalFol = sum(months, (m) => m.mo.fol);
  const totalVis = sum(months, (m) => m.mo.vis);
  // Total de publicaciones del período (solo si todos los meses traen el dato).
  const hasPosts = months.every((m) => m.mo.np != null);
  const totalPosts = hasPosts ? sum(months, (m) => m.mo.np) : null;
  // ER promedio ponderado por impresiones (representa mejor el año que un promedio simple).
  const avgER = totalImp ? sum(months, (m) => (m.mo.er || 0) * (m.mo.imp || 0)) / totalImp : 0;
  const bestByEr = months.reduce((a, b) => ((b.mo.er || 0) > (a.mo.er || 0) ? b : a), months[0]);
  const bestByImp = months.reduce((a, b) => ((b.mo.imp || 0) > (a.mo.imp || 0) ? b : a), months[0]);
  const allPosts = months.flatMap((m) => (m.mo.posts || []).map((p) => ({ ...p, month: m.short })));
  const topPosts = allPosts.sort((a, b) => (b.er || 0) - (a.er || 0)).slice(0, 5);
  const erDelta = last.mo.er - first.mo.er; // puntos porcentuales
  const erPct = first.mo.er ? (erDelta / first.mo.er) * 100 : 0;
  const impPct = first.mo.imp ? ((last.mo.imp - first.mo.imp) / first.mo.imp) * 100 : 0;
  return {
    monthsCount: months.length,
    first,
    last,
    totalImp,
    totalClk,
    totalFol,
    totalVis,
    totalPosts,
    avgER,
    bestByEr,
    bestByImp,
    topPosts,
    erDelta,
    erPct,
    impPct,
  };
}

// Datos para los charts de tendencia (incluye meses vacíos como null → hueco).
export function yearChartData(series = []) {
  return series.map((s) => ({
    name: s.short || s.label,
    Impresiones: s.mo ? s.mo.imp : null,
    Clics: s.mo ? s.mo.clk : null,
    ER: s.mo ? Number((s.mo.er || 0).toFixed(2)) : null,
    Seguidores: s.mo ? s.mo.fol : null,
  }));
}

// ── Insights del año (tarjetas tendencia + acción) · ES/EN ──
export function genYearInsights(agg, lang = 'es') {
  if (!agg) return [];
  const en = lang === 'en';
  const ins = [];

  if (agg.monthsCount >= 2) {
    const up = agg.erDelta >= 0;
    ins.push({
      m: en
        ? `Engagement Rate ${up ? '+' : ''}${agg.erDelta.toFixed(1)} pts from ${agg.first.short} to ${agg.last.short} (${pct1(agg.first.mo.er)} → ${pct1(agg.last.mo.er)})`
        : `Engagement Rate ${up ? '+' : ''}${agg.erDelta.toFixed(1)} pts de ${agg.first.short} a ${agg.last.short} (${pct1(agg.first.mo.er)} → ${pct1(agg.last.mo.er)})`,
      a: en
        ? up
          ? 'Content relevance is growing through the year ➜ <strong>Consolidate the editorial line that drove the improvement</strong> and document it as a playbook to sustain the trend.'
          : 'Relevance dropped versus the start of the year ➜ <strong>Review the content mix</strong> and return to the formats that performed in the best months.'
        : up
          ? 'La relevancia del contenido crece en el año ➜ <strong>Consolidar la línea editorial que impulsó la mejora</strong> y documentarla como playbook para sostener la tendencia.'
          : 'La relevancia cayó respecto del arranque del año ➜ <strong>Revisar el mix de contenido</strong> y volver a los formatos que rindieron en los mejores meses.',
    });
    ins.push({
      m: en
        ? `Reach ${agg.impPct >= 0 ? '+' : ''}${agg.impPct.toFixed(0)}% comparing ${agg.first.short} vs ${agg.last.short}`
        : `Alcance ${agg.impPct >= 0 ? '+' : ''}${agg.impPct.toFixed(0)}% comparando ${agg.first.short} vs ${agg.last.short}`,
      a: en
        ? agg.impPct >= 0
          ? 'Organic reach is expanding ➜ <strong>Amplify the strongest months with paid boosts</strong> to accelerate audience growth.'
          : 'Reach contracted ➜ <strong>Recover the posting frequency and time slots</strong> of the best-performing months.'
        : agg.impPct >= 0
          ? 'El alcance orgánico se expande ➜ <strong>Amplificar con pauta los meses de mayor tracción</strong> para acelerar el crecimiento de base.'
          : 'El alcance se contrajo ➜ <strong>Recuperar frecuencia y horarios de publicación</strong> de los meses de mejor desempeño.',
    });
  }

  ins.push({
    m: en
      ? `Best month by engagement: ${agg.bestByEr.short} (${pct1(agg.bestByEr.mo.er)})`
      : `Mejor mes por engagement: ${agg.bestByEr.short} (${pct1(agg.bestByEr.mo.er)})`,
    a: en
      ? `That month sets the year's ceiling ➜ <strong>Audit what was published in ${agg.bestByEr.short}</strong> (topics, formats, cadence) and replicate it next quarter.`
      : `Ese mes marca el techo del año ➜ <strong>Auditar qué se publicó en ${agg.bestByEr.short}</strong> (temas, formatos, cadencia) y replicarlo en el próximo trimestre.`,
  });

  ins.push({
    m: en
      ? `+${numEs(agg.totalFol)} followers and ${numEs(agg.totalImp)} impressions accumulated this year`
      : `+${numEs(agg.totalFol)} seguidores y ${numEs(agg.totalImp)} impresiones acumuladas en el año`,
    a: en
      ? 'Audience and reach are growing ➜ <strong>Run follower campaigns per vertical</strong> to turn reach into a segmented owned audience.'
      : 'Base y alcance en crecimiento ➜ <strong>Activar campañas de seguidores por vertical</strong> para convertir el alcance en audiencia propia segmentada.',
  });

  return ins;
}

// ── Diagnóstico del año (Lectura de Performance) · ES/EN ──
export function genYearConclusions(agg, lang = 'es') {
  if (!agg) return [];
  const en = lang === 'en';
  const out = [];
  out.push({
    label: en ? 'Accumulated reach' : 'Alcance acumulado',
    text: en
      ? `Over the year the page accumulated <strong>${numEs(agg.totalImp)} impressions</strong> and <strong>${numEs(agg.totalClk)} clicks</strong> across ${agg.monthsCount} ${agg.monthsCount === 1 ? 'month with data' : 'months with data'}.`
      : `En el año la cuenta acumuló <strong>${numEs(agg.totalImp)} impresiones</strong> y <strong>${numEs(agg.totalClk)} clics</strong> a lo largo de ${agg.monthsCount} ${agg.monthsCount === 1 ? 'mes con datos' : 'meses con datos'}.`,
  });
  out.push({
    label: en ? 'Engagement evolution' : 'Evolución del engagement',
    text: agg.monthsCount >= 2
      ? en
        ? `ER went from <strong>${pct1(agg.first.mo.er)}</strong> (${agg.first.short}) to <strong>${pct1(agg.last.mo.er)}</strong> (${agg.last.short}), with a weighted average of <strong>${pct1(agg.avgER)}</strong>.`
        : `El ER pasó de <strong>${pct1(agg.first.mo.er)}</strong> (${agg.first.short}) a <strong>${pct1(agg.last.mo.er)}</strong> (${agg.last.short}), con un promedio ponderado de <strong>${pct1(agg.avgER)}</strong>.`
      : en
        ? `Weighted average ER of <strong>${pct1(agg.avgER)}</strong> (only one month loaded; add more months to read the trend).`
        : `ER promedio ponderado de <strong>${pct1(agg.avgER)}</strong> (aún con un solo mes cargado; sumar más meses para leer la tendencia).`,
  });
  out.push({
    label: en ? 'Standout month' : 'Mes destacado',
    text: en
      ? `Engagement peaked in <strong>${agg.bestByEr.short}</strong> (${pct1(agg.bestByEr.mo.er)}); the highest reach came in <strong>${agg.bestByImp.short}</strong> (${numEs(agg.bestByImp.mo.imp)} impressions).`
      : `El pico de engagement fue en <strong>${agg.bestByEr.short}</strong> (${pct1(agg.bestByEr.mo.er)}); el de mayor alcance, <strong>${agg.bestByImp.short}</strong> (${numEs(agg.bestByImp.mo.imp)} impresiones).`,
  });
  out.push({
    label: en ? 'Audience' : 'Audiencia',
    text: en
      ? `<strong>+${numEs(agg.totalFol)} net followers</strong> and ${numEs(agg.totalVis)} page visits added over the period.`
      : `<strong>+${numEs(agg.totalFol)} seguidores</strong> netos y ${numEs(agg.totalVis)} visitas al perfil sumadas en el período.`,
  });
  return out;
}

// ── Próximos pasos del año · ES/EN ──
export function genYearNextSteps(agg, lang = 'es') {
  if (!agg) return [];
  const en = lang === 'en';
  const steps = [];
  const pEs = agg.topPosts[0] ? ESG_NAME[agg.topPosts[0].p || classifyESG(agg.topPosts[0].t)] || 'General' : null;
  const PILLAR_EN = { Ambiental: 'Environmental', Social: 'Social', Gobernanza: 'Governance', General: 'General' };
  if (pEs) {
    steps.push(
      en
        ? `<strong>Scale the year's winning format</strong>: ${PILLAR_EN[pEs] || pEs} pillar content led engagement. Set a calendar guaranteeing at least 2 monthly pieces on that axis.`
        : `<strong>Escalar el formato ganador del año</strong>: el contenido de pilar ${pEs} lideró el engagement. Definir un calendario que garantice al menos 2 piezas mensuales de ese eje.`,
    );
  }
  steps.push(
    agg.monthsCount >= 2 && agg.erDelta >= 0
      ? en
        ? `<strong>Sustain the upward curve</strong>: keep the cadence and topics of the best-ER months, and add paid boosts on the peaks to accelerate.`
        : `<strong>Sostener la curva ascendente</strong>: mantener la cadencia y los temas de los meses de mejor ER, y sumar pauta en los picos para acelerar.`
      : en
        ? `<strong>Stabilize engagement</strong>: return to the formats of the best months and reduce generic informational content.`
        : `<strong>Estabilizar el engagement</strong>: retomar los formatos de los mejores meses y reducir el contenido informativo genérico.`,
  );
  steps.push(
    en
      ? `<strong>Turn reach into audience</strong>: run follower campaigns segmented per vertical to capitalize on the year's impressions.`
      : `<strong>Convertir alcance en audiencia</strong>: activar campañas de seguidores segmentadas por vertical para capitalizar las impresiones del año.`,
  );
  steps.push(
    en
      ? `<strong>Close the year with a comparative balance</strong>: consolidate month-by-month KPIs in this review and set ER and follower targets for the next period.`
      : `<strong>Cerrar el año con un balance comparativo</strong>: consolidar los KPIs mes a mes en este resumen y fijar metas de ER y seguidores para el próximo período.`,
  );
  return steps;
}
