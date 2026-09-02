// ════════════════════════════════════════════════════════════════
//  GENERADOR DE INSIGHTS — Email Marketing (Mailchimp).
//  SIN IA: reglas fijas contra benchmarks estándar de email B2B.
//  Produce las tarjetas "tendencia + acción", el diagnóstico
//  (Lectura de Performance) y los próximos pasos, a partir de las
//  métricas reales consolidadas de la secuencia.
//  Bilingüe: cada generador recibe lang ('es' | 'en').
// ════════════════════════════════════════════════════════════════

// Benchmarks de referencia para email marketing B2B (promedios de industria).
export const EMAIL_BENCHMARKS = {
  openRate: 21, // % apertura promedio B2B
  clickRate: 2.5, // % clics sobre enviados
  ctor: 11, // % click-to-open
  bounceRate: 2, // % rebote — por encima es señal de base sucia
  unsubRate: 0.5, // % bajas saludable
};

const pct1 = (v, lang) =>
  (lang === 'en' ? Number(v || 0).toFixed(1) : Number(v || 0).toFixed(1).replace('.', ',')) + '%';
const num = (v, lang) => Number(v || 0).toLocaleString(lang === 'en' ? 'en-US' : 'es-AR');

// ── Insights (tarjetas "tendencia + acción recomendada") ──
export function genEmailInsights(campaign, lang = 'es') {
  const ins = [];
  if (!campaign?.totals) return ins;
  const t = campaign.totals;
  const B = EMAIL_BENCHMARKS;
  const en = lang === 'en';
  const p = (v) => pct1(v, lang);

  // 1) Apertura vs benchmark.
  {
    const above = t.openRate - B.openRate >= 0;
    ins.push(
      en
        ? {
            m: `Open rate ${p(t.openRate)} — ${above ? 'above' : 'below'} the B2B average (${B.openRate}%)`,
            a: above
              ? 'Subject line and sender are working ➜ <strong>Document the winning subject lines</strong> and reuse that tone/structure in upcoming sends.'
              : 'The subject line is not generating enough opens ➜ <strong>A/B test subject and sender name</strong>, shorten the subject and personalize with the contact\'s name.',
          }
        : {
            m: `Tasa de apertura ${p(t.openRate)} — ${above ? 'por encima' : 'por debajo'} del promedio B2B (${B.openRate}%)`,
            a: above
              ? 'El asunto y el remitente están funcionando ➜ <strong>Documentar los asuntos ganadores</strong> y reutilizar ese tono/estructura en los próximos envíos.'
              : 'El asunto no está generando aperturas suficientes ➜ <strong>Probar A/B de asunto y nombre de remitente</strong>, acortar el asunto y personalizar con el nombre del contacto.',
          },
    );
  }

  // 2) Clics vs benchmark.
  {
    const above = t.clickRate - B.clickRate >= 0;
    ins.push(
      en
        ? {
            m: `Click rate ${p(t.clickRate)} — ${above ? 'beats' : 'falls short of'} the B2B benchmark (${B.clickRate}%)`,
            a: above
              ? 'Content and CTAs turn opens into interest ➜ <strong>Scale the offer that generated clicks</strong> with a follow-up send to those who clicked.'
              : 'Opens are not translating into clicks ➜ <strong>Reinforce a single clear CTA</strong> above the fold and trim the copy to drive action.',
          }
        : {
            m: `Tasa de clics ${p(t.clickRate)} — ${above ? 'supera' : 'no alcanza'} el benchmark B2B (${B.clickRate}%)`,
            a: above
              ? 'El contenido y los CTA convierten la apertura en interés ➜ <strong>Escalar la oferta que generó clics</strong> con un envío de seguimiento a quienes clickearon.'
              : 'La apertura no se traduce en clics ➜ <strong>Reforzar un único CTA claro</strong> arriba del pliegue y recortar el texto para llevar a la acción.',
          },
    );
  }

  // 3) CTOR (calidad del contenido para quien abre).
  {
    const above = t.ctor >= B.ctor;
    ins.push(
      en
        ? {
            m: `Click-to-open (CTOR) ${p(t.ctor)} — ${above ? 'relevant content' : 'room for improvement'}`,
            a: above
              ? 'Openers find value and click ➜ <strong>Segment by interest</strong> and send more specific content to the most active segment.'
              : `Content is not hooking openers (ref. ${B.ctor}%) ➜ <strong>Review the body's value proposition</strong>: more concrete benefits and social proof, less generic copy.`,
          }
        : {
            m: `Click-to-open (CTOR) ${p(t.ctor)} — ${above ? 'contenido relevante' : 'oportunidad de mejora'}`,
            a: above
              ? 'Quienes abren encuentran valor y clickean ➜ <strong>Segmentar por interés</strong> y enviar contenido más específico al segmento más activo.'
              : `El contenido no engancha a quien abre (ref. ${B.ctor}%) ➜ <strong>Revisar la propuesta de valor del cuerpo</strong>: más beneficios concretos y prueba social, menos texto genérico.`,
          },
    );
  }

  // 4) Hot leads: foco comercial.
  {
    const n = campaign.hotLeadsCount ?? (campaign.hotLeads?.length || 0);
    ins.push(
      en
        ? {
            m: `${num(n, lang)} hot leads detected (contacts who clicked)`,
            a: n > 0
              ? '<strong>Hand the hot leads to the sales team this week</strong>: contact Critical/High priority (more than one click) first while the interest is hot.'
              : 'No contacts with clicks yet ➜ <strong>Reinforce the CTA and the segment</strong> before the next send to start generating interest signals.',
          }
        : {
            m: `${num(n, lang)} hot leads detectados (contactos que hicieron clic)`,
            a: n > 0
              ? '<strong>Pasar los hot leads al equipo comercial esta semana</strong>: contactar primero a los de prioridad Crítica/Alta (más de un clic) mientras el interés está caliente.'
              : 'Todavía no hay contactos con clics ➜ <strong>Reforzar el CTA y el segmento</strong> antes del próximo envío para empezar a generar señales de interés.',
          },
    );
  }

  return ins;
}

// ── Diagnóstico (Lectura de Performance) ──
export function genEmailConclusions(campaign, lang = 'es') {
  if (!campaign?.totals) return [];
  const t = campaign.totals;
  const B = EMAIL_BENCHMARKS;
  const en = lang === 'en';
  const p = (v) => pct1(v, lang);
  const n = (v) => num(v, lang);
  const out = [];

  out.push(
    en
      ? {
          label: 'Reach',
          text: `<strong>${n(t.totalSent)} emails</strong> were sent across ${n(t.emailCount)} ${
            t.emailCount === 1 ? 'send' : 'sends'
          }${t.totalDelivered ? `, with <strong>${n(t.totalDelivered)} effective deliveries</strong>` : ''}.`,
        }
      : {
          label: 'Alcance',
          text: `Se enviaron <strong>${n(t.totalSent)} correos</strong> en ${n(t.emailCount)} ${
            t.emailCount === 1 ? 'envío' : 'envíos'
          }${t.totalDelivered ? `, con <strong>${n(t.totalDelivered)} entregas efectivas</strong>` : ''}.`,
        },
  );

  out.push(
    en
      ? {
          label: 'Opens',
          text: `Open rate of <strong>${p(t.openRate)}</strong> (${
            t.openRate >= B.openRate ? 'above' : 'below'
          } the ${B.openRate}% B2B average). It measures how effective the subject line and sender are.`,
        }
      : {
          label: 'Apertura',
          text: `Tasa de apertura de <strong>${p(t.openRate)}</strong> (${
            t.openRate >= B.openRate ? 'por encima' : 'por debajo'
          } del promedio B2B de ${B.openRate}%). Mide qué tan efectivos son el asunto y el remitente.`,
        },
  );

  out.push(
    en
      ? {
          label: 'Interest',
          text: `Click rate of <strong>${p(t.clickRate)}</strong> and CTOR of <strong>${p(t.ctor)}</strong>. ${
            t.clickRate >= B.clickRate
              ? 'The content manages to turn opens into real interest.'
              : 'There is room to improve the content and the CTAs that drive the click.'
          }`,
        }
      : {
          label: 'Interés',
          text: `Tasa de clics de <strong>${p(t.clickRate)}</strong> y CTOR de <strong>${p(t.ctor)}</strong>. ${
            t.clickRate >= B.clickRate
              ? 'El contenido logra convertir la apertura en interés real.'
              : 'Hay margen para mejorar el contenido y los CTA que llevan al clic.'
          }`,
        },
  );

  if (t.bounceRate != null || t.unsubRate != null) {
    const parts = [];
    if (t.bounceRate != null)
      parts.push(
        en
          ? `bounce <strong>${p(t.bounceRate)}</strong> (${t.bounceRate <= B.bounceRate ? 'healthy base' : 'review list hygiene'})`
          : `rebote <strong>${p(t.bounceRate)}</strong> (${t.bounceRate <= B.bounceRate ? 'base sana' : 'revisar limpieza de base'})`,
      );
    if (t.unsubRate != null)
      parts.push(
        en
          ? `unsubscribes <strong>${p(t.unsubRate)}</strong> (${t.unsubRate <= B.unsubRate ? 'healthy' : 'attention'})`
          : `bajas <strong>${p(t.unsubRate)}</strong> (${t.unsubRate <= B.unsubRate ? 'saludable' : 'atención'})`,
      );
    out.push({ label: en ? 'List health' : 'Salud de la base', text: `${parts.join(' · ')}.` });
  } else {
    const hl = campaign.hotLeadsCount ?? (campaign.hotLeads?.length || 0);
    out.push(
      en
        ? {
            label: 'Business opportunity',
            text: `<strong>${n(hl)} hot leads</strong> with recorded clicks: the prioritized list for sales to contact.`,
          }
        : {
            label: 'Oportunidad comercial',
            text: `<strong>${n(hl)} hot leads</strong> con clics registrados: es la lista priorizada para que ventas contacte.`,
          },
    );
  }

  return out;
}

// ── Próximos pasos ──
export function genEmailNextSteps(campaign, lang = 'es') {
  if (!campaign?.totals) return [];
  const t = campaign.totals;
  const B = EMAIL_BENCHMARKS;
  const en = lang === 'en';
  const hl = campaign.hotLeadsCount ?? (campaign.hotLeads?.length || 0);
  const steps = [];

  if (hl > 0) {
    steps.push(
      en
        ? `<strong>Activate the hot leads</strong>: hand sales the ${num(hl, lang)} contacts who clicked, prioritizing those with the most clicks (Critical and High priority).`
        : `<strong>Activar los hot leads</strong>: entregar a ventas los ${num(hl, lang)} contactos que clickearon, priorizando los de mayor cantidad de clics (prioridad Crítica y Alta).`,
    );
  }

  steps.push(
    t.openRate >= B.openRate
      ? en
        ? `<strong>Capitalize on opens</strong>: replicate the best-performing subject lines and add a re-engagement send to non-openers.`
        : `<strong>Capitalizar la apertura</strong>: replicar los asuntos de mejor rendimiento y sumar un envío de re-engagement a quienes no abrieron.`
      : en
        ? `<strong>Raise the open rate</strong>: run an A/B test on subject and sender, and resend to non-openers with an alternative subject after 48–72 hs.`
        : `<strong>Subir la apertura</strong>: correr un A/B de asunto y remitente, y reenviar a no-aperturas con un asunto alternativo a las 48–72 hs.`,
  );

  steps.push(
    t.clickRate >= B.clickRate
      ? en
        ? `<strong>Deepen the interest</strong>: send follow-up content (success story or demo) to the segment that clicked.`
        : `<strong>Profundizar el interés</strong>: enviar contenido de seguimiento (caso de éxito o demo) al segmento que clickeó.`
      : en
        ? `<strong>Improve the click</strong>: keep a single visible CTA above the fold and shorten the body to reduce friction toward the action.`
        : `<strong>Mejorar el clic</strong>: dejar un CTA único y visible arriba del pliegue y acortar el cuerpo para reducir la fricción hacia la acción.`,
  );

  steps.push(
    en
      ? `<strong>Compare the sequence</strong>: track opens, clicks and CTOR send by send to identify the best format and adjust the cadence.`
      : `<strong>Comparar la secuencia</strong>: seguir apertura, clics y CTOR envío por envío para identificar el mejor formato y ajustar la cadencia.`,
  );
  return steps;
}
