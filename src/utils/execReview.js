// ════════════════════════════════════════════════════════════════
//  VISTA EJECUTIVA — Resumen del Año (Social/LinkedIn).
//  Convierte la serie mensual en una narrativa de negocio: resumen
//  ejecutivo, KPIs con contexto, crecimiento de audiencia, performance
//  de contenido, qué funcionó / qué no y recomendaciones.
//
//  REGLA DE HONESTIDAD: todo se calcula de los datos reales cargados.
//  Lo que LinkedIn no exporta (tráfico web derivado, leads, advocacy)
//  NO se inventa: aparece como limitación y como recomendación de
//  medición (UTM). El total de seguidores del set de competidores es una
//  foto al momento del export y no se usa como serie histórica.
// ════════════════════════════════════════════════════════════════

import { classifyESG, ESG_NAME } from '@/utils/esg';
import { PILLAR_EN } from '@/utils/annualI18n';

const sum = (arr, f) => arr.reduce((a, x) => a + (f(x) || 0), 0);
const numEs = (v) => Number(v || 0).toLocaleString('es-AR');
const pct1 = (v) => Number(v || 0).toFixed(1) + '%';
const pName = (p, en) => (en ? PILLAR_EN[ESG_NAME[p] || 'General'] || 'General' : ESG_NAME[p] || 'General');

// Serie → todo lo que necesita la vista ejecutiva. `months` = solo con datos.
export function buildExecReview(series = [], lang = 'es') {
  const en = lang === 'en';
  const months = series.filter((s) => s.mo);
  if (!months.length) return null;
  const first = months[0];
  const last = months[months.length - 1];

  const totalImp = sum(months, (m) => m.mo.imp);
  const totalClk = sum(months, (m) => m.mo.clk);
  const totalFol = sum(months, (m) => m.mo.fol);
  const totalVis = sum(months, (m) => m.mo.vis);
  const totalPosts = sum(months, (m) => m.mo.np ?? 0);
  const avgER = totalImp ? sum(months, (m) => (m.mo.er || 0) * (m.mo.imp || 0)) / totalImp : 0;
  const bestByEr = months.reduce((a, b) => ((b.mo.er || 0) > (a.mo.er || 0) ? b : a), months[0]);
  const bestByImp = months.reduce((a, b) => ((b.mo.imp || 0) > (a.mo.imp || 0) ? b : a), months[0]);
  const bestByFol = months.reduce((a, b) => ((b.mo.fol || 0) > (a.mo.fol || 0) ? b : a), months[0]);
  const avgPostsMonth = totalPosts / months.length;
  const avgImpPerPost = totalPosts ? totalImp / totalPosts : 0;

  // Total de seguidores actual (foto del export más reciente con dato propio).
  const ownRows = months.map((m) => m.mo.comp?.find((c) => c.own)).filter(Boolean);
  const followersNow = ownRows.length ? ownRows[ownRows.length - 1].fol ?? null : null;

  // ── Posts destacados del año (los top almacenados por mes) ──
  const allPosts = months.flatMap((m) => (m.mo.posts || []).map((p) => ({ ...p, month: m.short })));
  const byPillar = {};
  allPosts.forEach((p) => {
    const k = p.p || classifyESG(p.t);
    (byPillar[k] ??= []).push(p);
  });
  const pillarPerf = Object.entries(byPillar)
    .map(([k, posts]) => ({
      pillar: pName(k, en),
      count: posts.length,
      avgEr: sum(posts, (p) => p.er) / posts.length,
      clicks: sum(posts, (p) => p.clk),
    }))
    .sort((a, b) => b.avgEr - a.avgEr);
  const topPillar = pillarPerf[0];
  const lowPillar = pillarPerf[pillarPerf.length - 1];
  const avgTopEr = allPosts.length ? sum(allPosts, (p) => p.er) / allPosts.length : 0;

  const topPosts = [...allPosts]
    .sort((a, b) => (b.er || 0) - (a.er || 0))
    .slice(0, 5)
    .map((p) => {
      const times = avgTopEr ? (p.er / avgTopEr).toFixed(1) : null;
      const pil = pName(p.p || classifyESG(p.t), en);
      const why = en
        ? `${pil} content · ER ${times}× the yearly featured average${p.clk ? ` · ${numEs(p.clk)} clicks` : ''}${p.tp && p.tp !== 'Orgánico' ? ` · ${p.tp} format` : ''}`
        : `Contenido de ${pil} · ER ${times}× el promedio de destacados${p.clk ? ` · ${numEs(p.clk)} clics` : ''}${p.tp && p.tp !== 'Orgánico' ? ` · formato ${p.tp}` : ''}`;
      return { ...p, why };
    });

  // ── Resumen ejecutivo: logros / desafíos / recomendación ──
  const wins = [];
  const challenges = [];
  const push = (arr, es_, en_) => arr.push(en ? en_ : es_);

  push(
    wins,
    `La audiencia sumó ${numEs(totalFol)} seguidores nuevos en ${months.length} meses${followersNow ? ` (base actual: ~${numEs(followersNow)})` : ''}.`,
    `The audience added ${numEs(totalFol)} new followers in ${months.length} months${followersNow ? ` (current base: ~${numEs(followersNow)})` : ''}.`,
  );
  push(
    wins,
    `${numEs(totalImp)} impresiones y ${numEs(totalClk)} clics acumulados — visibilidad de marca sostenida todo el período.`,
    `${numEs(totalImp)} impressions and ${numEs(totalClk)} clicks accumulated — sustained brand visibility across the period.`,
  );
  if (topPillar)
    push(
      wins,
      `El contenido de ${topPillar.pillar} lidera el engagement (ER promedio ${pct1(topPillar.avgEr)} entre los posts destacados).`,
      `${topPillar.pillar} content leads engagement (avg ER ${pct1(topPillar.avgEr)} among featured posts).`,
    );
  if (bestByEr.mo.er > avgER)
    push(
      wins,
      `${bestByEr.short} marcó el techo de engagement del año (${pct1(bestByEr.mo.er)}).`,
      `${bestByEr.short} set the year's engagement ceiling (${pct1(bestByEr.mo.er)}).`,
    );

  const erDelta = last.mo.er - first.mo.er;
  if (erDelta < 0)
    push(
      challenges,
      `El engagement cerró en ${pct1(last.mo.er)}, por debajo del arranque del año (${pct1(first.mo.er)}).`,
      `Engagement closed at ${pct1(last.mo.er)}, below the start of the year (${pct1(first.mo.er)}).`,
    );
  if (last.mo.imp < bestByImp.mo.imp * 0.7)
    push(
      challenges,
      `El alcance de ${last.short} (${numEs(last.mo.imp)}) opera muy por debajo del pico de ${bestByImp.short} (${numEs(bestByImp.mo.imp)}).`,
      `${last.short} reach (${numEs(last.mo.imp)}) runs well below the ${bestByImp.short} peak (${numEs(bestByImp.mo.imp)}).`,
    );
  if (last.mo.fol < bestByFol.mo.fol * 0.5)
    push(
      challenges,
      `El ritmo de seguidores nuevos bajó desde el pico de ${bestByFol.short} (+${numEs(bestByFol.mo.fol)}) a +${numEs(last.mo.fol)} en ${last.short}.`,
      `New-follower pace slowed from the ${bestByFol.short} peak (+${numEs(bestByFol.mo.fol)}) to +${numEs(last.mo.fol)} in ${last.short}.`,
    );
  if (lowPillar && pillarPerf.length > 1)
    push(
      challenges,
      `El contenido de ${lowPillar.pillar} rinde por debajo del resto (ER promedio ${pct1(lowPillar.avgEr)}).`,
      `${lowPillar.pillar} content underperforms the rest (avg ER ${pct1(lowPillar.avgEr)}).`,
    );

  const targetPosts = Math.max(Math.round(avgPostsMonth) + 4, 12);
  const recommendation = en
    ? `Increase publishing cadence from ~${numEs(Math.round(avgPostsMonth))} to ${targetPosts} posts/month, prioritizing ${topPillar?.pillar ?? 'top'} content, and boost the best performers to recover reach.`
    : `Aumentar la cadencia de ~${numEs(Math.round(avgPostsMonth))} a ${targetPosts} publicaciones/mes, priorizando contenido de ${topPillar?.pillar ?? 'mayor rendimiento'}, y amplificar con pauta los mejores posts para recuperar alcance.`;

  // ── Tabla de KPIs de negocio (primer mes vs último + contexto) ──
  const pctChange = (a, b) => (a ? ((b - a) / a) * 100 : null);
  const trend = (a, b) => {
    const p = pctChange(a, b);
    if (p == null) return { dir: 'flat', label: '—' };
    return { dir: p > 0 ? 'up' : p < 0 ? 'down' : 'flat', label: `${p > 0 ? '↑' : p < 0 ? '↓' : '→'} ${Math.abs(p).toFixed(0)}%` };
  };
  const kpiRows = [
    {
      kpi: en ? 'Audience growth (new followers)' : 'Crecimiento de audiencia (seguidores nuevos)',
      a: `+${numEs(first.mo.fol)}`,
      b: `+${numEs(last.mo.fol)}`,
      t: trend(first.mo.fol, last.mo.fol),
      ctx: en
        ? `${bestByFol.short} was the best month (+${numEs(bestByFol.mo.fol)}); total +${numEs(totalFol)} for the year.`
        : `${bestByFol.short} fue el mejor mes (+${numEs(bestByFol.mo.fol)}); total +${numEs(totalFol)} en el año.`,
    },
    {
      kpi: en ? 'Brand visibility (impressions)' : 'Visibilidad de marca (impresiones)',
      a: numEs(first.mo.imp),
      b: numEs(last.mo.imp),
      t: trend(first.mo.imp, last.mo.imp),
      ctx: en
        ? `Peak in ${bestByImp.short} (${numEs(bestByImp.mo.imp)}); yearly total ${numEs(totalImp)}.`
        : `Pico en ${bestByImp.short} (${numEs(bestByImp.mo.imp)}); total anual ${numEs(totalImp)}.`,
    },
    {
      kpi: en ? 'Audience engagement (ER)' : 'Engagement de la audiencia (ER)',
      a: pct1(first.mo.er),
      b: pct1(last.mo.er),
      t: trend(first.mo.er, last.mo.er),
      ctx: en
        ? `Weighted yearly average ${pct1(avgER)}; ceiling in ${bestByEr.short} (${pct1(bestByEr.mo.er)}).`
        : `Promedio anual ponderado ${pct1(avgER)}; techo en ${bestByEr.short} (${pct1(bestByEr.mo.er)}).`,
    },
    {
      kpi: en ? 'Traffic generated (clicks)' : 'Tráfico generado (clics)',
      a: numEs(first.mo.clk),
      b: numEs(last.mo.clk),
      t: trend(first.mo.clk, last.mo.clk),
      ctx: en
        ? `Follows content volume and reach; yearly total ${numEs(totalClk)}.`
        : `Acompaña el volumen de contenido y el alcance; total anual ${numEs(totalClk)}.`,
    },
    {
      kpi: en ? 'Content published (posts)' : 'Contenido publicado (posteos)',
      a: numEs(first.mo.np ?? 0),
      b: numEs(last.mo.np ?? 0),
      t: trend(first.mo.np ?? 0, last.mo.np ?? 0),
      ctx: en
        ? `~${avgPostsMonth.toFixed(1)} posts/month on average.`
        : `~${avgPostsMonth.toFixed(1)} publicaciones/mes en promedio.`,
    },
    {
      kpi: en ? 'Page visitors' : 'Visitantes del perfil',
      a: numEs(first.mo.vis),
      b: numEs(last.mo.vis),
      t: trend(first.mo.vis, last.mo.vis),
      ctx: en
        ? 'Interest proxy — LinkedIn does not export website referrals or leads.'
        : 'Proxy de interés — LinkedIn no exporta derivación al sitio ni leads.',
    },
  ];

  // ── Visibilidad: lectura calculada con dirección honesta ──
  const impPct = pctChange(first.mo.imp, last.mo.imp);
  const perPostFirst = first.mo.np ? first.mo.imp / first.mo.np : null;
  const perPostLast = last.mo.np ? last.mo.imp / last.mo.np : null;
  let visibilityRead;
  if (impPct != null && perPostFirst && perPostLast) {
    const perPostPct = pctChange(perPostFirst, perPostLast);
    visibilityRead = en
      ? `Visibility ${impPct >= 0 ? 'grew' : 'contracted'} ${Math.abs(impPct).toFixed(0)}% between ${first.short} and ${last.short}; average reach per post ${perPostPct >= 0 ? 'improved' : 'fell'} ${Math.abs(perPostPct).toFixed(0)}% (${numEs(Math.round(perPostFirst))} → ${numEs(Math.round(perPostLast))} impressions/post).`
      : `La visibilidad ${impPct >= 0 ? 'creció' : 'se contrajo'} ${Math.abs(impPct).toFixed(0)}% entre ${first.short} y ${last.short}; el alcance promedio por post ${perPostPct >= 0 ? 'mejoró' : 'cayó'} ${Math.abs(perPostPct).toFixed(0)}% (${numEs(Math.round(perPostFirst))} → ${numEs(Math.round(perPostLast))} impresiones/post).`;
  }

  // ── Qué funcionó / qué no ──
  const worked = [];
  if (topPillar) push(worked, `Contenido de ${topPillar.pillar} (ER promedio ${pct1(topPillar.avgEr)})`, `${topPillar.pillar} content (avg ER ${pct1(topPillar.avgEr)})`);
  if (bestByEr.short === bestByFol.short) {
    push(
      worked,
      `El mes de ${bestByEr.short}: techo de engagement y de crecimiento de audiencia a la vez`,
      `${bestByEr.short}: engagement and audience-growth ceiling in the same month`,
    );
  } else {
    push(
      worked,
      `Los meses de ${bestByEr.short} y ${bestByFol.short}: techo de engagement y de crecimiento de audiencia`,
      `${bestByEr.short} and ${bestByFol.short}: engagement and audience-growth ceilings`,
    );
  }
  const fmts = [...new Set(allPosts.filter((p) => p.tp && p.tp !== 'Orgánico' && p.er > avgTopEr).map((p) => p.tp))];
  if (fmts.length) push(worked, `Los formatos ${fmts.join(' y ')} superan el promedio de los destacados`, `${fmts.join(' & ')} formats beat the featured average`);

  const didnt = [];
  if (lowPillar && pillarPerf.length > 1) push(didnt, `Contenido de ${lowPillar.pillar}: el de menor engagement (${pct1(lowPillar.avgEr)})`, `${lowPillar.pillar} content: lowest engagement (${pct1(lowPillar.avgEr)})`);
  const minPosts = months.reduce((a, b) => ((b.mo.np ?? 99) < (a.mo.np ?? 99) ? b : a), months[0]);
  push(didnt, `La cadencia baja de ${minPosts.short} (${numEs(minPosts.mo.np ?? 0)} posts) limitó alcance y crecimiento`, `${minPosts.short}'s low cadence (${numEs(minPosts.mo.np ?? 0)} posts) limited reach and growth`);
  push(didnt, `Sin medición del tráfico derivado al sitio ni leads: LinkedIn no lo exporta y los links no llevan UTM`, `No measurement of referred website traffic or leads: LinkedIn does not export it and links carry no UTM tags`);

  // ── Recomendaciones ──
  const recs = [];
  push(recs, `<strong>Subir la cadencia</strong> de ~${numEs(Math.round(avgPostsMonth))} a ${targetPosts} publicaciones/mes, con calendario fijo semanal.`, `<strong>Raise cadence</strong> from ~${numEs(Math.round(avgPostsMonth))} to ${targetPosts} posts/month on a fixed weekly calendar.`);
  if (topPillar) push(recs, `<strong>Duplicar el contenido de ${topPillar.pillar}</strong>, el eje de mayor engagement del año.`, `<strong>Double down on ${topPillar.pillar} content</strong>, the year's highest-engagement axis.`);
  push(recs, `<strong>Amplificar con pauta los posts top</strong> (los 5 destacados promedian ER ${pct1(topPosts.length ? sum(topPosts, (p) => p.er) / topPosts.length : 0)}).`, `<strong>Boost top posts with paid</strong> (the 5 featured average ER ${pct1(topPosts.length ? sum(topPosts, (p) => p.er) / topPosts.length : 0)}).`);
  push(recs, `<strong>Repetir la mecánica de captación de ${bestByFol.short}</strong> (+${numEs(bestByFol.mo.fol)} seguidores) al menos una vez por trimestre.`, `<strong>Repeat ${bestByFol.short}'s acquisition play</strong> (+${numEs(bestByFol.mo.fol)} followers) at least once per quarter.`);
  push(recs, `<strong>Etiquetar los links con UTM</strong> para conectar LinkedIn con tráfico web y leads en GA4 — hoy ese impacto no se puede medir.`, `<strong>Tag links with UTM</strong> to connect LinkedIn with website traffic and leads in GA4 — that impact cannot be measured today.`);

  const impact = en
    ? `LinkedIn is delivering on <strong>brand awareness</strong> (${numEs(totalImp)} impressions, +${numEs(totalFol)} followers) and <strong>thought leadership</strong> (${topPillar ? `${topPillar.pillar} content at ${pct1(topPillar.avgEr)} ER` : 'high-engagement technical content'}). The pending frontier is <strong>demand generation</strong>: with UTM tagging and GA4, the next report can tie this channel to website visits and leads, closing the loop between marketing activity and commercial goals.`
    : `LinkedIn está cumpliendo en <strong>brand awareness</strong> (${numEs(totalImp)} impresiones, +${numEs(totalFol)} seguidores) y <strong>thought leadership</strong> (${topPillar ? `contenido de ${topPillar.pillar} con ER ${pct1(topPillar.avgEr)}` : 'contenido técnico de alto engagement'}). La frontera pendiente es la <strong>generación de demanda</strong>: con links etiquetados (UTM) y GA4, el próximo reporte puede conectar este canal con visitas al sitio y leads, cerrando el circuito entre la actividad de marketing y los objetivos comerciales.`;

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
    avgImpPerPost,
    followersNow,
    followerBars: months.map((m) => ({ name: m.short, fol: m.mo.fol })),
    wins,
    challenges,
    recommendation,
    kpiRows,
    visibilityRead,
    pillarPerf,
    avgTopEr,
    topPosts,
    worked,
    didnt,
    recs,
    impact,
  };
}
