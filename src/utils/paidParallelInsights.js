// Insights, lectura y próximos pasos de la VISTA GENERAL de una campaña en
// paralelo (Google Ads + Meta Ads). Reglas fijas sobre las métricas reales
// de `summarizeParallel` (sin IA). Nunca se calcula un costo por conversión
// combinado si una plataforma no registra conversiones.
import { paidFmt } from '@/utils/paidFormat';
import { shareOf } from '@/utils/paidParallelSummary';

const NAME = { google: 'Google Ads', meta: 'Meta Ads' };

// «1 conversión» / «2 conversiones» · «1 conversion» / «2 conversions».
const convWord = (n, en) => (en ? (n === 1 ? 'conversion' : 'conversions') : n === 1 ? 'conversión' : 'conversiones');

function ctx(sum, lang) {
  const { numEs, pct, cash } = paidFmt(lang);
  const en = lang === 'en';
  const g = sum.google;
  const m = sum.meta;
  const p0 = (v) => `${Math.round(v)}${en ? '%' : ' %'}`;
  // Plataforma con mejor CTR / CPC más bajo (null si empatan o falta el dato).
  const bestCtr = g.ctr === m.ctr ? null : g.ctr > m.ctr ? 'google' : 'meta';
  const cheaperCpc =
    !sum.sameCurrency || g.cpc == null || m.cpc == null || g.cpc === m.cpc ? null : g.cpc < m.cpc ? 'google' : 'meta';
  return { numEs, pct, cash, en, g, m, p0, bestCtr, cheaperCpc, other: (id) => (id === 'google' ? 'meta' : 'google') };
}

// Conversiones de Meta: resultado propio de la campaña o «no registra».
function metaConvText(x, en) {
  return x.m.conv == null
    ? en
      ? 'Meta Ads does not record its own conversions (traffic campaigns)'
      : 'Meta Ads no registra conversiones propias (campañas de tráfico)'
    : en
      ? `Meta Ads recorded ${x.numEs(x.m.conv)} ${x.m.conv === 1 ? 'result' : 'results'}`
      : `Meta Ads registró ${x.numEs(x.m.conv)} ${x.m.conv === 1 ? 'resultado' : 'resultados'}`;
}

// Plan de Acción (solo uso interno: InsightsPanel no se muestra en externo).
export function genParallelInsights(sum, lang = 'es') {
  if (!sum) return [];
  const x = ctx(sum, lang);
  const { en, g, m, pct, cash, p0 } = x;
  const out = [];
  const sp = shareOf(sum, 'spend');
  const si = shareOf(sum, 'imp');
  if (sp && si) {
    const big = sp.google >= sp.meta ? 'google' : 'meta';
    out.push({
      label: en ? 'Budget split' : 'Reparto del presupuesto',
      m: en
        ? `${NAME[big]} took ${p0(sp[big])} of the spend and delivered ${p0(si[big])} of the impressions.`
        : `${NAME[big]} se llevó el ${p0(sp[big])} de la inversión y entregó el ${p0(si[big])} de las impresiones.`,
      a: en
        ? `<strong>Define the split before the next event</strong> by role: one platform for reach, the other for active demand, and compare against this ${p0(sp.google)} / ${p0(sp.meta)} split.`
        : `<strong>Definir el reparto antes del próximo evento</strong> según el rol de cada plataforma (alcance o demanda activa) y compararlo contra este ${p0(sp.google)} / ${p0(sp.meta)}.`,
    });
  }
  if (x.bestCtr) {
    const b = x.bestCtr;
    const o = x.other(b);
    out.push({
      label: 'CTR',
      m: en
        ? `${NAME[b]} had a CTR of ${pct(sum[b].ctr)} vs ${pct(sum[o].ctr)} on ${NAME[o]}.`
        : `${NAME[b]} tuvo un CTR de ${pct(sum[b].ctr)} contra ${pct(sum[o].ctr)} de ${NAME[o]}.`,
      a: en
        ? `<strong>Review ${NAME[o]} creatives and audience</strong>: fewer clicks per impression means the message reaches people who are less interested.`
        : `<strong>Revisar creativos y audiencia de ${NAME[o]}</strong>: menos clics por impresión indica que el mensaje llega a gente menos interesada.`,
    });
  }
  if (x.cheaperCpc) {
    const b = x.cheaperCpc;
    const o = x.other(b);
    out.push({
      label: en ? 'Cost per click' : 'Costo por clic',
      m: en
        ? `The click was cheaper on ${NAME[b]} (${cash(sum[b].cpc, sum.currency)} vs ${cash(sum[o].cpc, sum.currency)}).`
        : `El clic salió más barato en ${NAME[b]} (${cash(sum[b].cpc, sum.currency)} contra ${cash(sum[o].cpc, sum.currency)}).`,
      a: en
        ? `<strong>If the goal is traffic, give ${NAME[b]} more weight</strong> and check bids and segmentation on ${NAME[o]}.`
        : `<strong>Si el objetivo es tráfico, darle más peso a ${NAME[b]}</strong> y revisar pujas y segmentación de ${NAME[o]}.`,
    });
  }
  out.push({
    label: en ? 'Conversions' : 'Conversiones',
    m: en
      ? `Google Ads recorded ${x.numEs(g.conv)} ${convWord(g.conv, en)}. ${metaConvText(x, en)}.`
      : `Google Ads registró ${x.numEs(g.conv)} ${convWord(g.conv, en)}. ${metaConvText(x, en)}.`,
    a:
      m.conv == null
        ? en
          ? '<strong>Set up a conversion event on Meta</strong> (pixel / Conversions API) for the next campaigns, so the cost per conversion can be compared across platforms.'
          : '<strong>Configurar un evento de conversión en Meta</strong> (píxel / API de conversiones) en las próximas campañas, para poder comparar el costo por conversión entre plataformas.'
        : en
          ? '<strong>Compare cost per conversion across platforms</strong> before setting the next budget.'
          : '<strong>Comparar el costo por conversión entre plataformas</strong> antes de definir el próximo presupuesto.',
  });
  return out;
}

// Lectura de Performance (va también en el externo).
export function genParallelConclusions(sum, lang = 'es') {
  if (!sum) return [];
  const x = ctx(sum, lang);
  const { en, g, m, numEs, pct, cash, p0 } = x;
  const t = sum.total;
  const out = [
    {
      label: en ? 'Volume' : 'Volumen',
      text: en
        ? `Across both platforms the campaign added <strong>${numEs(t.imp)} impressions</strong> and <strong>${numEs(t.clicks)} clicks</strong> (combined CTR ${pct(t.ctr)}).`
        : `Entre las dos plataformas, la campaña sumó <strong>${numEs(t.imp)} impresiones</strong> y <strong>${numEs(t.clicks)} clics</strong> (CTR combinado ${pct(t.ctr)}).`,
    },
  ];
  const sp = shareOf(sum, 'spend');
  out.push({
    label: en ? 'Spend' : 'Inversión',
    text:
      sp && t.spend != null
        ? en
          ? `<strong>${cash(t.spend, sum.currency)}</strong> were invested: ${p0(sp.google)} on Google Ads and ${p0(sp.meta)} on Meta Ads, at a combined CPC of <strong>${cash(t.cpc, sum.currency)}</strong>.`
          : `Se invirtieron <strong>${cash(t.spend, sum.currency)}</strong>: ${p0(sp.google)} en Google Ads y ${p0(sp.meta)} en Meta Ads, a un CPC combinado de <strong>${cash(t.cpc, sum.currency)}</strong>.`
        : en
          ? `Google Ads: <strong>${cash(g.spend, g.currency)}</strong> · Meta Ads: <strong>${cash(m.spend, m.currency)}</strong> (different currencies: not added up).`
          : `Google Ads: <strong>${cash(g.spend, g.currency)}</strong> · Meta Ads: <strong>${cash(m.spend, m.currency)}</strong> (monedas distintas: no se suman).`,
  });
  out.push({
    label: en ? 'Efficiency by platform' : 'Eficiencia por plataforma',
    text: en
      ? `Google Ads: CTR ${pct(g.ctr)}${g.cpc != null ? `, CPC ${cash(g.cpc, g.currency)}` : ''}. Meta Ads: CTR ${pct(m.ctr)}${m.cpc != null ? `, CPC ${cash(m.cpc, m.currency)}` : ''}.`
      : `Google Ads: CTR ${pct(g.ctr)}${g.cpc != null ? `, CPC ${cash(g.cpc, g.currency)}` : ''}. Meta Ads: CTR ${pct(m.ctr)}${m.cpc != null ? `, CPC ${cash(m.cpc, m.currency)}` : ''}.`,
  });
  out.push({
    label: en ? 'Conversion' : 'Conversión',
    text: en
      ? `<strong>${numEs(t.conv)} ${convWord(t.conv, en)} recorded</strong>. Google Ads: ${numEs(g.conv)}${g.costPerConv != null ? ` (cost per conversion ${cash(g.costPerConv, g.currency)})` : ''}. ${metaConvText(x, en)}.`
      : `<strong>${numEs(t.conv)} ${convWord(t.conv, en)} ${t.conv === 1 ? 'registrada' : 'registradas'}</strong>. Google Ads: ${numEs(g.conv)}${g.costPerConv != null ? ` (costo por conversión ${cash(g.costPerConv, g.currency)})` : ''}. ${metaConvText(x, en)}.`,
  });
  return out;
}

// Próximos pasos (solo uso interno).
export function genParallelNextSteps(sum, lang = 'es') {
  if (!sum) return [];
  const en = lang === 'en';
  const steps = [
    en
      ? '<strong>Read each platform in its own view</strong> (Google Ads / Meta Ads) before deciding: the overview adds up what is comparable, not the full detail.'
      : '<strong>Leer cada plataforma en su vista</strong> (Google Ads / Meta Ads) antes de decidir: la vista general suma lo comparable, no todo el detalle.',
  ];
  if (sum.meta.conv == null)
    steps.push(
      en
        ? '<strong>Measure conversions on both platforms</strong> in the next parallel campaign (Meta conversion event + Google conversions) to compare cost per conversion.'
        : '<strong>Medir conversiones en las dos plataformas</strong> en la próxima campaña en paralelo (evento de conversión en Meta + conversiones de Google) para comparar el costo por conversión.',
    );
  // Vuelos desfasados: alguna semana tuvo inversión en una sola plataforma.
  if (sum.weeks?.some((w) => !w.google || !w.meta))
    steps.push(
      en
        ? '<strong>Align flight dates</strong> on both platforms so the weekly spend can be compared week by week.'
        : '<strong>Alinear las fechas de vuelo</strong> de las dos plataformas para poder comparar la inversión semana a semana.',
    );
  return steps;
}
