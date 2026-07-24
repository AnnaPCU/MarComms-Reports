// ════════════════════════════════════════════════════════════════
//  GENERADOR DE INSIGHTS — Email Marketing (Mailchimp).
//  SIN IA: reglas fijas contra benchmarks estándar de email B2B.
//  Produce las tarjetas "tendencia + acción", el diagnóstico
//  (Lectura de Performance) y los próximos pasos, a partir de las
//  métricas reales consolidadas de la secuencia.
// ════════════════════════════════════════════════════════════════

// Benchmarks de referencia para email marketing B2B (promedios de industria).
export const EMAIL_BENCHMARKS = {
  openRate: 21, // % apertura promedio B2B
  clickRate: 2.5, // % clics sobre enviados
  ctor: 11, // % click-to-open
  bounceRate: 2, // % rebote — por encima es señal de base sucia
  unsubRate: 0.5, // % bajas saludable
};

const pct1 = (v) => Number(v || 0).toFixed(1) + '%';
const numEs = (v) => Number(v || 0).toLocaleString('es-AR');

// ── Insights (tarjetas "tendencia + acción recomendada") ──
export function genEmailInsights(campaign) {
  const ins = [];
  if (!campaign?.totals) return ins;
  const t = campaign.totals;
  const B = EMAIL_BENCHMARKS;

  // 1) Apertura vs benchmark.
  {
    const diff = t.openRate - B.openRate;
    const above = diff >= 0;
    ins.push({
      m: `Tasa de apertura ${pct1(t.openRate)} — ${above ? 'por encima' : 'por debajo'} del promedio B2B (${B.openRate}%)`,
      a: above
        ? 'El asunto y el remitente están funcionando ➜ <strong>Documentar los asuntos ganadores</strong> y reutilizar ese tono/estructura en los próximos envíos.'
        : 'El asunto no está generando aperturas suficientes ➜ <strong>Probar A/B de asunto y nombre de remitente</strong>, acortar el asunto y personalizar con el nombre del contacto.',
    });
  }

  // 2) Clics vs benchmark.
  {
    const diff = t.clickRate - B.clickRate;
    const above = diff >= 0;
    ins.push({
      m: `Tasa de clics ${pct1(t.clickRate)} — ${above ? 'supera' : 'no alcanza'} el benchmark B2B (${B.clickRate}%)`,
      a: above
        ? 'El contenido y los CTA convierten la apertura en interés ➜ <strong>Escalar la oferta que generó clics</strong> con un envío de seguimiento a quienes clickearon.'
        : 'La apertura no se traduce en clics ➜ <strong>Reforzar un único CTA claro</strong> arriba del pliegue y recortar el texto para llevar a la acción.',
    });
  }

  // 3) CTOR (calidad del contenido para quien abre).
  {
    const above = t.ctor >= B.ctor;
    ins.push({
      m: `Click-to-open (CTOR) ${pct1(t.ctor)} — ${above ? 'contenido relevante' : 'oportunidad de mejora'}`,
      a: above
        ? 'Quienes abren encuentran valor y clickean ➜ <strong>Segmentar por interés</strong> y enviar contenido más específico al segmento más activo.'
        : `El contenido no engancha a quien abre (ref. ${B.ctor}%) ➜ <strong>Revisar la propuesta de valor del cuerpo</strong>: más beneficios concretos y prueba social, menos texto genérico.`,
    });
  }

  // 4) Hot leads: foco comercial.
  {
    const n = campaign.hotLeadsCount ?? (campaign.hotLeads?.length || 0);
    ins.push({
      m: `${numEs(n)} hot leads detectados (contactos que hicieron clic)`,
      a: n > 0
        ? '<strong>Pasar los hot leads al equipo comercial esta semana</strong>: contactar primero a los de prioridad Crítica/Alta (más de un clic) mientras el interés está caliente.'
        : 'Todavía no hay contactos con clics ➜ <strong>Reforzar el CTA y el segmento</strong> antes del próximo envío para empezar a generar señales de interés.',
    });
  }

  return ins;
}

// ── Diagnóstico (Lectura de Performance) ──
export function genEmailConclusions(campaign) {
  if (!campaign?.totals) return [];
  const t = campaign.totals;
  const B = EMAIL_BENCHMARKS;
  const out = [];

  out.push({
    label: 'Alcance',
    text: `Se enviaron <strong>${numEs(t.totalSent)} correos</strong> en ${numEs(t.emailCount)} ${
      t.emailCount === 1 ? 'envío' : 'envíos'
    }${t.totalDelivered ? `, con <strong>${numEs(t.totalDelivered)} entregas efectivas</strong>` : ''}.`,
  });

  out.push({
    label: 'Apertura',
    text: `Tasa de apertura de <strong>${pct1(t.openRate)}</strong> (${
      t.openRate >= B.openRate ? 'por encima' : 'por debajo'
    } del promedio B2B de ${B.openRate}%). Mide qué tan efectivos son el asunto y el remitente.`,
  });

  out.push({
    label: 'Interés',
    text: `Tasa de clics de <strong>${pct1(t.clickRate)}</strong> y CTOR de <strong>${pct1(t.ctor)}</strong>. ${
      t.clickRate >= B.clickRate
        ? 'El contenido logra convertir la apertura en interés real.'
        : 'Hay margen para mejorar el contenido y los CTA que llevan al clic.'
    }`,
  });

  if (t.bounceRate != null || t.unsubRate != null) {
    const parts = [];
    if (t.bounceRate != null)
      parts.push(`rebote <strong>${pct1(t.bounceRate)}</strong> (${t.bounceRate <= B.bounceRate ? 'base sana' : 'revisar limpieza de base'})`);
    if (t.unsubRate != null)
      parts.push(`bajas <strong>${pct1(t.unsubRate)}</strong> (${t.unsubRate <= B.unsubRate ? 'saludable' : 'atención'})`);
    out.push({ label: 'Salud de la base', text: `${parts.join(' · ')}.` });
  } else {
    const n = campaign.hotLeadsCount ?? (campaign.hotLeads?.length || 0);
    out.push({
      label: 'Oportunidad comercial',
      text: `<strong>${numEs(n)} hot leads</strong> con clics registrados: es la lista priorizada para que ventas contacte.`,
    });
  }

  return out;
}

// ── Próximos pasos ──
export function genEmailNextSteps(campaign) {
  if (!campaign?.totals) return [];
  const t = campaign.totals;
  const B = EMAIL_BENCHMARKS;
  const n = campaign.hotLeadsCount ?? (campaign.hotLeads?.length || 0);
  const steps = [];

  if (n > 0) {
    steps.push(
      `<strong>Activar los hot leads</strong>: entregar a ventas los ${numEs(n)} contactos que clickearon, priorizando los de mayor cantidad de clics (prioridad Crítica y Alta).`,
    );
  }

  steps.push(
    t.openRate >= B.openRate
      ? `<strong>Capitalizar la apertura</strong>: replicar los asuntos de mejor rendimiento y sumar un envío de re-engagement a quienes no abrieron.`
      : `<strong>Subir la apertura</strong>: correr un A/B de asunto y remitente, y reenviar a no-aperturas con un asunto alternativo a las 48–72 hs.`,
  );

  steps.push(
    t.clickRate >= B.clickRate
      ? `<strong>Profundizar el interés</strong>: enviar contenido de seguimiento (caso de éxito o demo) al segmento que clickeó.`
      : `<strong>Mejorar el clic</strong>: dejar un CTA único y visible arriba del pliegue y acortar el cuerpo para reducir la fricción hacia la acción.`,
  );

  steps.push(`<strong>Comparar la secuencia</strong>: seguir apertura, clics y CTOR envío por envío para identificar el mejor formato y ajustar la cadencia.`);
  return steps;
}
