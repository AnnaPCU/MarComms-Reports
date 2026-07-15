// ════════════════════════════════════════════════════════════════
//  MOTOR DE ANÁLISIS — Pilar Paid Media
//  Genera insights, diagnóstico y próximos pasos A PARTIR de las métricas
//  reales del período (nunca inventa números). Mismo criterio que el
//  dashboard de referencia de Control Union.
// ════════════════════════════════════════════════════════════════

const eur = (v) =>
  Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
const numEs = (v) => Number(v || 0).toLocaleString('es-AR');
const pct = (v) =>
  Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';

// ── Nivel de actividad de una campaña ──
// win = convierte · opt = clics sin conversión · low = impresiones sin clics · none = sin impresiones
export function campaignStatus(c) {
  const imp = c.impressions || 0;
  const clk = c.clicks || 0;
  const conv = c.conversions || 0;
  if (imp === 0) return { key: 'none', label: 'Sin actividad' };
  if (conv > 0) return { key: 'win', label: 'Convierte' };
  if (clk > 0) return { key: 'opt', label: 'Optimizar' };
  return { key: 'low', label: 'Baja actividad' };
}

// Campañas con alguna actividad (impresiones o clics), ordenadas por impresiones.
export function activeCampaigns(mo) {
  return (mo?.campaigns ?? [])
    .filter((c) => (c.impressions || 0) > 0 || (c.clicks || 0) > 0)
    .slice()
    .sort((a, b) => (b.impressions || 0) - (a.impressions || 0));
}

function topBy(campaigns, key) {
  if (!campaigns.length) return null;
  return campaigns.reduce((a, b) => ((b[key] || 0) > (a[key] || 0) ? b : a), campaigns[0]);
}

// ── Score de efectividad por campaña (0-100) ──
// Pondera tasa de conversión (45%), CTR (30%) y eficiencia de coste/lead (25%).
// Si en el período no hubo conversiones, el peso recae en CTR (55%) y eficiencia
// de CPC (45%). Todo normalizado dentro del set de campañas con actividad.
export function scoreCampaigns(mo) {
  const active = activeCampaigns(mo);
  if (!active.length) return [];
  const maxCtr = Math.max(...active.map((c) => c.ctr || 0), 0);
  const maxCvr = Math.max(...active.map((c) => c.convRate || 0), 0);
  const cpcs = active.map((c) => c.cpc || 0).filter((v) => v > 0);
  const minCpc = cpcs.length ? Math.min(...cpcs) : 0;
  const cpls = active.filter((c) => (c.conversions || 0) > 0).map((c) => c.costPerConv || 0).filter((v) => v > 0);
  const minCpl = cpls.length ? Math.min(...cpls) : 0;
  const anyConv = maxCvr > 0;

  return active
    .map((c) => {
      const ctrN = maxCtr ? ((c.ctr || 0) / maxCtr) * 100 : 0;
      const cvrN = maxCvr ? ((c.convRate || 0) / maxCvr) * 100 : 0;
      const cpcEff = (c.cpc || 0) > 0 && minCpc ? (minCpc / c.cpc) * 100 : 0;
      const cplEff = (c.conversions || 0) > 0 && minCpl ? (minCpl / c.costPerConv) * 100 : 0;
      const score = anyConv ? 0.45 * cvrN + 0.3 * ctrN + 0.25 * cplEff : 0.55 * ctrN + 0.45 * cpcEff;
      return { ...c, score: Math.round(score), ctrN, cvrN, cpcEff, cplEff };
    })
    .sort((a, b) => b.score - a.score);
}

// ── Insights (4 tarjetas: tendencia + acción) ──
export function genPaidInsights(mo) {
  if (!mo?.totals) return [];
  const t = mo.totals;
  const active = activeCampaigns(mo);
  const total = mo.campaigns?.length ?? 0;
  const noActivity = total - active.length;
  const ins = [];

  // 1) Campaña con más clics (driver de tráfico)
  const topClk = topBy(active, 'clicks');
  if (topClk && (topClk.clicks || 0) > 0) {
    ins.push({
      m: `${topClk.name} concentró el mayor tráfico del mes: ${numEs(topClk.clicks)} clics con un CTR de ${pct(topClk.ctr)}.`,
      a: `Es la campaña que mejor capta demanda ➜ <strong>sostener el presupuesto de ${topClk.name}</strong> y replicar sus términos de búsqueda y anuncios en las campañas de menor CTR.`,
    });
  }

  // 2) Conversiones / eficiencia
  if ((t.conversions || 0) > 0) {
    const topConv = topBy(active, 'conversions');
    ins.push({
      m: `${numEs(t.conversions)} conversión/es en el período${topConv ? `, liderada por ${topConv.name}` : ''} — coste por lead de ${eur(t.costPerConv)}.`,
      a: `El objetivo de generación de leads está funcionando ➜ <strong>escalar la inversión en la campaña que convierte</strong> y proteger su presupuesto ante recortes.`,
    });
  } else {
    ins.push({
      m: `Sin conversiones en el mes sobre ${numEs(t.clicks)} clics y ${eur(t.cost)} invertidos.`,
      a: `El tráfico llega pero no cierra ➜ <strong>revisar intención de búsqueda, textos de anuncio y la landing page</strong> de las campañas con clics para mejorar la tasa de conversión.`,
    });
  }

  // 3) Concentración de inversión
  const topCost = topBy(active, 'cost');
  if (topCost && (topCost.cost || 0) > 0) {
    const share = t.cost ? Math.round(((topCost.cost || 0) / t.cost) * 100) : 0;
    ins.push({
      m: `${topCost.name} concentra el ${share}% del coste del mes (${eur(topCost.cost)} de ${eur(t.cost)}).`,
      a: `La inversión está concentrada ➜ <strong>vigilar el coste por clic de ${topCost.name}</strong> y evaluar reasignar parte del presupuesto a campañas con mejor CTR y menor CPC.`,
    });
  }

  // 4) Campañas sin actividad / baja actividad
  if (noActivity > 0) {
    ins.push({
      m: `${noActivity} campaña/s habilitada/s no registraron impresiones en el período.`,
      a: `Presupuesto o pujas insuficientes ➜ <strong>revisar pujas, segmentación y estado de ${noActivity === 1 ? 'esa campaña' : 'esas campañas'}</strong>, o pausarlas para concentrar la inversión donde hay demanda.`,
    });
  } else {
    const lowCtr = active.filter((c) => (c.clicks || 0) === 0 && (c.impressions || 0) > 0).length;
    ins.push({
      m: lowCtr
        ? `${lowCtr} campaña/s tuvieron impresiones pero ningún clic — señal de anuncios poco relevantes para la búsqueda.`
        : `Todas las campañas activas generaron clics — buena cobertura de la demanda del período.`,
      a: lowCtr
        ? `<strong>Revisar los anuncios y palabras clave</strong> de esas campañas: ajustar títulos, extensiones y concordancias para mejorar el CTR.`
        : `<strong>Mantener el mix actual</strong> y escalar gradualmente el presupuesto en las campañas con mejor relación CTR/CPC.`,
    });
  }

  return ins.slice(0, 4);
}

// ── Diagnóstico (Lectura de Performance): 4 ítems {label, text} ──
export function genPaidConclusions(mo) {
  if (!mo?.totals) return [];
  const t = mo.totals;
  const active = activeCampaigns(mo);
  const topClk = topBy(active, 'clicks');
  const topCost = topBy(active, 'cost');
  const out = [];

  out.push({
    label: 'Volumen',
    text: `El período sumó <strong>${numEs(t.impressions)} impresiones</strong> y <strong>${numEs(t.clicks)} clics</strong> (CTR ${pct(t.ctr)}) en ${active.length} campaña/s con actividad.`,
  });
  out.push({
    label: 'Eficiencia de coste',
    text: `Se invirtieron <strong>${eur(t.cost)}</strong> a un CPC medio de <strong>${eur(t.cpc)}</strong>.${topCost ? ` ${topCost.name} concentró el mayor gasto.` : ''}`,
  });
  out.push({
    label: 'Conversión',
    text:
      (t.conversions || 0) > 0
        ? `<strong>${numEs(t.conversions)} lead/s</strong> a un coste por lead de <strong>${eur(t.costPerConv)}</strong> (tasa de conversión ${pct(t.convRate)}).`
        : `<strong>Sin conversiones</strong> registradas en el período: el foco debe estar en mejorar la calidad del tráfico y la landing page.`,
  });
  out.push({
    label: 'Foco del mes',
    text: topClk
      ? `<strong>${topClk.name}</strong> fue la campaña de referencia por tráfico (CTR ${pct(topClk.ctr)}); es la base sobre la que optimizar el resto.`
      : `Actividad baja y distribuida: conviene concentrar la inversión en menos campañas para ganar volumen evaluable.`,
  });

  return out;
}

// ── Próximos pasos (lista numerada, HTML inline permitido) ──
export function genPaidNextSteps(mo) {
  if (!mo?.totals) return [];
  const t = mo.totals;
  const active = activeCampaigns(mo);
  const topClk = topBy(active, 'clicks');
  const topCost = topBy(active, 'cost');
  const steps = [];

  if (topClk) {
    steps.push(
      `<strong>Sostener ${topClk.name}</strong>: es el mayor driver de tráfico (CTR ${pct(topClk.ctr)}). Mantener presupuesto y ampliar palabras clave de alto rendimiento.`,
    );
  }
  if ((t.conversions || 0) > 0) {
    steps.push(
      `<strong>Escalar lo que convierte</strong>: subir la inversión en la campaña con conversiones y proteger su presupuesto.`,
    );
  } else {
    steps.push(
      `<strong>Atacar la conversión</strong>: revisar landing pages, formularios y textos de anuncio de las campañas con clics para pasar de tráfico a leads.`,
    );
  }
  if (topCost) {
    steps.push(
      `<strong>Optimizar el CPC de ${topCost.name}</strong>: concentra el mayor gasto; ajustar pujas y concordancias para bajar el coste por clic.`,
    );
  }
  steps.push(
    `<strong>Revisar campañas sin clics</strong>: mejorar anuncios y palabras clave de las de bajo CTR, o pausarlas para reasignar presupuesto.`,
  );
  steps.push(
    `<strong>Comparar contra el próximo mes</strong>: seguir CTR, CPC y coste por lead para confirmar si las optimizaciones mejoran la eficiencia.`,
  );

  return steps;
}
