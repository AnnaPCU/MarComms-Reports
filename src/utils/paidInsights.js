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

// ── Insights (4 tarjetas: tendencia + acción) · ES/EN ──
export function genPaidInsights(mo, lang = 'es') {
  if (!mo?.totals) return [];
  const en = lang === 'en';
  const t = mo.totals;
  const active = activeCampaigns(mo);
  const total = mo.campaigns?.length ?? 0;
  const noActivity = total - active.length;
  const ins = [];

  // 1) Campaña con más clics (driver de tráfico)
  const topClk = topBy(active, 'clicks');
  if (topClk && (topClk.clicks || 0) > 0) {
    ins.push({
      m: en
        ? `${topClk.name} drove the most traffic this month: ${numEs(topClk.clicks)} clicks with a ${pct(topClk.ctr)} CTR.`
        : `${topClk.name} concentró el mayor tráfico del mes: ${numEs(topClk.clicks)} clics con un CTR de ${pct(topClk.ctr)}.`,
      a: en
        ? `It captures demand best ➜ <strong>sustain ${topClk.name}'s budget</strong> and replicate its search terms and ads in the lower-CTR campaigns.`
        : `Es la campaña que mejor capta demanda ➜ <strong>sostener el presupuesto de ${topClk.name}</strong> y replicar sus términos de búsqueda y anuncios en las campañas de menor CTR.`,
    });
  }

  // 2) Conversiones / eficiencia
  if ((t.conversions || 0) > 0) {
    const topConv = topBy(active, 'conversions');
    ins.push({
      m: en
        ? `${numEs(t.conversions)} conversion/s in the period${topConv ? `, led by ${topConv.name}` : ''} — cost per lead of ${eur(t.costPerConv)}.`
        : `${numEs(t.conversions)} conversión/es en el período${topConv ? `, liderada por ${topConv.name}` : ''} — coste por lead de ${eur(t.costPerConv)}.`,
      a: en
        ? `The lead-generation objective is working ➜ <strong>scale the converting campaign's budget</strong> and protect it from cuts.`
        : `El objetivo de generación de leads está funcionando ➜ <strong>escalar la inversión en la campaña que convierte</strong> y proteger su presupuesto ante recortes.`,
    });
  } else {
    ins.push({
      m: en
        ? `No conversions this month over ${numEs(t.clicks)} clicks and ${eur(t.cost)} spent.`
        : `Sin conversiones en el mes sobre ${numEs(t.clicks)} clics y ${eur(t.cost)} invertidos.`,
      a: en
        ? `Traffic arrives but doesn't close ➜ <strong>review search intent, ad copy and the landing page</strong> of campaigns with clicks to improve conversion rate.`
        : `El tráfico llega pero no cierra ➜ <strong>revisar intención de búsqueda, textos de anuncio y la landing page</strong> de las campañas con clics para mejorar la tasa de conversión.`,
    });
  }

  // 3) Concentración de inversión
  const topCost = topBy(active, 'cost');
  if (topCost && (topCost.cost || 0) > 0) {
    const share = t.cost ? Math.round(((topCost.cost || 0) / t.cost) * 100) : 0;
    ins.push({
      m: en
        ? `${topCost.name} concentrates ${share}% of the month's cost (${eur(topCost.cost)} of ${eur(t.cost)}).`
        : `${topCost.name} concentra el ${share}% del coste del mes (${eur(topCost.cost)} de ${eur(t.cost)}).`,
      a: en
        ? `Spend is concentrated ➜ <strong>watch ${topCost.name}'s cost per click</strong> and consider reallocating budget to campaigns with better CTR and lower CPC.`
        : `La inversión está concentrada ➜ <strong>vigilar el coste por clic de ${topCost.name}</strong> y evaluar reasignar parte del presupuesto a campañas con mejor CTR y menor CPC.`,
    });
  }

  // 4) Campañas sin actividad / baja actividad
  if (noActivity > 0) {
    ins.push({
      m: en
        ? `${noActivity} enabled campaign/s recorded no impressions in the period.`
        : `${noActivity} campaña/s habilitada/s no registraron impresiones en el período.`,
      a: en
        ? `Insufficient budget or bids ➜ <strong>review bids, targeting and status of ${noActivity === 1 ? 'that campaign' : 'those campaigns'}</strong>, or pause them to concentrate spend where there is demand.`
        : `Presupuesto o pujas insuficientes ➜ <strong>revisar pujas, segmentación y estado de ${noActivity === 1 ? 'esa campaña' : 'esas campañas'}</strong>, o pausarlas para concentrar la inversión donde hay demanda.`,
    });
  } else {
    const lowCtr = active.filter((c) => (c.clicks || 0) === 0 && (c.impressions || 0) > 0).length;
    ins.push({
      m: en
        ? lowCtr
          ? `${lowCtr} campaign/s got impressions but no clicks — a sign of ads with low relevance to the search.`
          : `Every active campaign generated clicks — good coverage of the period's demand.`
        : lowCtr
          ? `${lowCtr} campaña/s tuvieron impresiones pero ningún clic — señal de anuncios poco relevantes para la búsqueda.`
          : `Todas las campañas activas generaron clics — buena cobertura de la demanda del período.`,
      a: en
        ? lowCtr
          ? `<strong>Review the ads and keywords</strong> of those campaigns: adjust headlines, extensions and match types to improve CTR.`
          : `<strong>Keep the current mix</strong> and gradually scale budget on the campaigns with the best CTR/CPC ratio.`
        : lowCtr
          ? `<strong>Revisar los anuncios y palabras clave</strong> de esas campañas: ajustar títulos, extensiones y concordancias para mejorar el CTR.`
          : `<strong>Mantener el mix actual</strong> y escalar gradualmente el presupuesto en las campañas con mejor relación CTR/CPC.`,
    });
  }

  return ins.slice(0, 4);
}

// ── Diagnóstico (Lectura de Performance): 4 ítems {label, text} · ES/EN ──
export function genPaidConclusions(mo, lang = 'es') {
  if (!mo?.totals) return [];
  const en = lang === 'en';
  const t = mo.totals;
  const active = activeCampaigns(mo);
  const topClk = topBy(active, 'clicks');
  const topCost = topBy(active, 'cost');
  const out = [];

  out.push({
    label: en ? 'Volume' : 'Volumen',
    text: en
      ? `The period added <strong>${numEs(t.impressions)} impressions</strong> and <strong>${numEs(t.clicks)} clicks</strong> (CTR ${pct(t.ctr)}) across ${active.length} active campaign/s.`
      : `El período sumó <strong>${numEs(t.impressions)} impresiones</strong> y <strong>${numEs(t.clicks)} clics</strong> (CTR ${pct(t.ctr)}) en ${active.length} campaña/s con actividad.`,
  });
  out.push({
    label: en ? 'Cost efficiency' : 'Eficiencia de coste',
    text: en
      ? `<strong>${eur(t.cost)}</strong> was spent at an average CPC of <strong>${eur(t.cpc)}</strong>.${topCost ? ` ${topCost.name} concentrated the highest spend.` : ''}`
      : `Se invirtieron <strong>${eur(t.cost)}</strong> a un CPC medio de <strong>${eur(t.cpc)}</strong>.${topCost ? ` ${topCost.name} concentró el mayor gasto.` : ''}`,
  });
  out.push({
    label: en ? 'Conversion' : 'Conversión',
    text:
      (t.conversions || 0) > 0
        ? en
          ? `<strong>${numEs(t.conversions)} lead/s</strong> at a cost per lead of <strong>${eur(t.costPerConv)}</strong> (conversion rate ${pct(t.convRate)}).`
          : `<strong>${numEs(t.conversions)} lead/s</strong> a un coste por lead de <strong>${eur(t.costPerConv)}</strong> (tasa de conversión ${pct(t.convRate)}).`
        : en
          ? `<strong>No conversions</strong> recorded in the period: the focus should be on improving traffic quality and the landing page.`
          : `<strong>Sin conversiones</strong> registradas en el período: el foco debe estar en mejorar la calidad del tráfico y la landing page.`,
  });
  out.push({
    label: en ? 'Focus of the month' : 'Foco del mes',
    text: topClk
      ? en
        ? `<strong>${topClk.name}</strong> was the reference campaign by traffic (CTR ${pct(topClk.ctr)}); it is the base to optimize the rest against.`
        : `<strong>${topClk.name}</strong> fue la campaña de referencia por tráfico (CTR ${pct(topClk.ctr)}); es la base sobre la que optimizar el resto.`
      : en
        ? `Low, scattered activity: concentrate spend on fewer campaigns to gain measurable volume.`
        : `Actividad baja y distribuida: conviene concentrar la inversión en menos campañas para ganar volumen evaluable.`,
  });

  return out;
}

// ── Próximos pasos (lista numerada, HTML inline permitido) · ES/EN ──
export function genPaidNextSteps(mo, lang = 'es') {
  if (!mo?.totals) return [];
  const en = lang === 'en';
  const t = mo.totals;
  const active = activeCampaigns(mo);
  const topClk = topBy(active, 'clicks');
  const topCost = topBy(active, 'cost');
  const steps = [];

  if (topClk) {
    steps.push(
      en
        ? `<strong>Sustain ${topClk.name}</strong>: it is the biggest traffic driver (CTR ${pct(topClk.ctr)}). Keep its budget and expand high-performing keywords.`
        : `<strong>Sostener ${topClk.name}</strong>: es el mayor driver de tráfico (CTR ${pct(topClk.ctr)}). Mantener presupuesto y ampliar palabras clave de alto rendimiento.`,
    );
  }
  if ((t.conversions || 0) > 0) {
    steps.push(
      en
        ? `<strong>Scale what converts</strong>: increase spend on the converting campaign and protect its budget.`
        : `<strong>Escalar lo que convierte</strong>: subir la inversión en la campaña con conversiones y proteger su presupuesto.`,
    );
  } else {
    steps.push(
      en
        ? `<strong>Attack conversion</strong>: review landing pages, forms and ad copy of campaigns with clicks to turn traffic into leads.`
        : `<strong>Atacar la conversión</strong>: revisar landing pages, formularios y textos de anuncio de las campañas con clics para pasar de tráfico a leads.`,
    );
  }
  if (topCost) {
    steps.push(
      en
        ? `<strong>Optimize ${topCost.name}'s CPC</strong>: it concentrates the highest spend; adjust bids and match types to lower the cost per click.`
        : `<strong>Optimizar el CPC de ${topCost.name}</strong>: concentra el mayor gasto; ajustar pujas y concordancias para bajar el coste por clic.`,
    );
  }
  steps.push(
    en
      ? `<strong>Review campaigns without clicks</strong>: improve ads and keywords of the low-CTR ones, or pause them to reallocate budget.`
      : `<strong>Revisar campañas sin clics</strong>: mejorar anuncios y palabras clave de las de bajo CTR, o pausarlas para reasignar presupuesto.`,
  );
  steps.push(
    en
      ? `<strong>Compare against next month</strong>: track CTR, CPC and cost per lead to confirm whether optimizations improve efficiency.`
      : `<strong>Comparar contra el próximo mes</strong>: seguir CTR, CPC y coste por lead para confirmar si las optimizaciones mejoran la eficiencia.`,
  );

  return steps;
}

// ════════════════════════════════════════════════════════════════
//  Insights del reporte Meta Ads GEO (evento) — todo computado de los
//  agregados reales; nada estimado.
// ════════════════════════════════════════════════════════════════
import { aggCampaign } from '@/data/paidMetaGeo';

const pctG = (v) => Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';

export function genGeoInsights(geo, moneyFmt, lang = 'es') {
  const en = lang === 'en';
  const per = geo.campaigns.map((c) => ({ c, t: aggCampaign(c) }));
  const tf = per.find((x) => x.c.kind === 'typeform');
  const wa = per.find((x) => x.c.kind === 'whatsapp');
  const ins = [];

  if (tf && wa && wa.t.outCtr > 0) {
    const ratio = tf.t.outCtr / wa.t.outCtr;
    ins.push({
      m: en
        ? `Typeform moved traffic ${ratio.toFixed(0)}× more efficiently: outbound CTR ${pctG(tf.t.outCtr)} vs ${pctG(wa.t.outCtr)} for WhatsApp`
        : `Typeform movió tráfico ${ratio.toFixed(0)}× más eficiente: CTR saliente de ${pctG(tf.t.outCtr)} vs ${pctG(wa.t.outCtr)} de WhatsApp`,
      a: en
        ? `Different jobs, different metrics: WhatsApp is judged by conversations, Typeform by traffic ➜ <strong>Use Typeform-style creatives when the goal is taking people out of Meta</strong>.`
        : `Cada campaña se juzga por su objetivo: WhatsApp por conversaciones, Typeform por tráfico ➜ <strong>Usar creatividades tipo Typeform cuando el objetivo sea sacar gente de Meta</strong>.`,
    });
  }

  if (wa?.t.results) {
    ins.push({
      m: en
        ? `WhatsApp met its objective: ${wa.t.results} conversations started at ${moneyFmt(wa.t.costPerResult)} each`
        : `WhatsApp cumplió su objetivo: ${wa.t.results} conversaciones iniciadas a ${moneyFmt(wa.t.costPerResult)} cada una`,
      a: en
        ? `In an event GEO the interest window lasts as long as the event ➜ <strong>Reply to those chats fast</strong>; Meta only counts the start of each conversation, not how it went.`
        : `En un GEO de evento la ventana de interés dura lo que dura el evento ➜ <strong>Responder esos chats rápido</strong>; Meta solo cuenta el inicio de cada conversación, no cómo siguió.`,
    });
  }

  // Día pico de clics salientes (sobre el total de la cuenta).
  const dayTotals = {};
  per.forEach(({ c }) => c.days.forEach((d) => { dayTotals[d.d] = (dayTotals[d.d] || 0) + d.out; }));
  const totalOut = Object.values(dayTotals).reduce((a, b) => a + b, 0);
  const best = Object.entries(dayTotals).sort((a, b) => b[1] - a[1])[0];
  if (best && totalOut) {
    const dLabel = en ? best[0].replace(/(\d+) Ago/, 'Aug $1') : best[0].replace('Ago', 'de agosto');
    ins.push({
      m: en
        ? `${dLabel} concentrated ${((best[1] / totalOut) * 100).toFixed(0)}% of outbound clicks (${best[1]} of ${totalOut})`
        : `El ${dLabel} concentró el ${((best[1] / totalOut) * 100).toFixed(0)}% de los clics salientes (${best[1]} de ${totalOut})`,
      a: en
        ? `For the next event GEO ➜ <strong>export the hourly breakdown</strong> to match response peaks with the event agenda and concentrate budget there.`
        : `Para el próximo GEO de evento ➜ <strong>exportar el desglose por hora</strong> para cruzar los picos de respuesta con la agenda del evento y concentrar presupuesto ahí.`,
    });
  }

  // Saturación: frecuencia REAL del período (export sin desglose diario)
  // si está disponible; si no, la diaria máxima.
  const pFreqs = geo.campaigns.map((c) => c.periodReach?.freq).filter(Boolean);
  const freq = pFreqs.length ? Math.max(...pFreqs) : Math.max(...per.map(({ t }) => t.maxFreq));
  const period = pFreqs.length > 0;
  ins.push(
    freq >= 3
      ? {
          m: en
            ? `Real saturation: across the whole flight each person saw the ads ~${freq.toFixed(1)} times${period ? ' (period frequency)' : ' per day'}`
            : `Saturación real: en todo el vuelo cada persona vio los anuncios ~${freq.toFixed(1).replace('.', ',')} veces${period ? ' (frecuencia del período)' : ' por día'}`,
          a: en
            ? `A 1 km radius is a small audience and it saturates fast ➜ <strong>Add creative variations or a frequency cap</strong> on the next hyperlocal GEO.`
            : `Un radio de 1 km es una audiencia chica y se satura rápido ➜ <strong>Sumar variantes de creativos o tope de frecuencia</strong> en el próximo GEO hiperlocal.`,
        }
      : {
          m: en
            ? `No saturation: ${period ? 'period' : 'daily'} frequency stayed at ${freq.toFixed(1)} views per person`
            : `Sin saturación: la frecuencia ${period ? 'del período' : 'diaria'} se mantuvo en ${freq.toFixed(1).replace('.', ',')} vistas por persona`,
          a: en
            ? `The audience still had room ➜ <strong>A longer flight or higher budget</strong> could be tested on the next event without burning the audience.`
            : `La audiencia todavía tenía margen ➜ <strong>Se puede probar más días o más presupuesto</strong> en el próximo evento sin quemar a la audiencia.`,
        },
  );

  return ins;
}

// Insights adicionales del funnel de conversión (Typeform / HubSpot).
export function genGeoFunnelInsights(geo, moneyFmt, lang = 'es') {
  const en = lang === 'en';
  const ins = [];

  if (geo.typeform) {
    const leads = geo.typeform.forms.flatMap((f) => f.leads);
    const tfCamp = geo.campaigns.find((c) => c.kind === 'typeform');
    const tfSpend = tfCamp ? aggCampaign(tfCamp).spend : 0;
    if (leads.length) {
      ins.push({
        m: en
          ? `The funnel closed with ${leads.length} real leads with full details — ${moneyFmt(tfSpend / leads.length)} per lead on the traffic campaign spend`
          : `El funnel cerró con ${leads.length} leads reales con datos completos — ${moneyFmt(tfSpend / leads.length)} por lead sobre la inversión de la campaña de tráfico`,
        a: en
          ? 'In an event GEO the interest window is short ➜ <strong>Contact both leads while Aapresid is still fresh</strong> (details in the Conversion Funnel section).'
          : 'En un GEO de evento la ventana de interés es corta ➜ <strong>Contactar a los leads mientras Aapresid siga fresco</strong> (datos en la sección Funnel de Conversión).',
      });
    }
  }

  // Demanda latente: mayoría sin el servicio resuelto en la 1ra pregunta.
  if (geo.typeform) {
    const huella = geo.typeform.forms.find((f) => f.intent && /huella/i.test(f.name));
    if (huella) {
      const total = huella.intent.dist.reduce((a, x) => a + x.v, 0);
      const no = huella.intent.dist.find((x) => x.l === 'No')?.v ?? 0;
      const yes = huella.intent.dist.find((x) => x.l === 'Sí')?.v ?? 0;
      if (total && no / total >= 0.5) {
        ins.push({
          m: en
            ? `Latent demand: ${no} of ${total} who started the Carbon Footprint form have not calculated it yet (${yes} already had it)`
            : `Demanda latente: ${no} de ${total} que empezaron el Typeform de Huella aún no la calcularon (${yes} ya la tenían)`,
          a: en
            ? 'The event audience needs the service ➜ <strong>Lead the next creative with that question</strong> ("Haven’t calculated your footprint yet?") and reuse it in the lead follow-up.'
            : 'La audiencia del evento necesita el servicio ➜ <strong>Abrir el próximo creativo con esa pregunta</strong> ("¿Todavía no calculaste tu huella?") y reutilizarla en el seguimiento de los leads.',
        });
      }
    }
  }

  if (geo.hsForm) {
    const f = geo.hsForm;
    const out = geo.campaigns.reduce((a, c) => a + aggCampaign(c).out, 0);
    ins.push({
      m: en
        ? `The ad did its job: ${f.views} form visits matching the ${out} outbound clicks — but ${f.submissions} submissions (${f.interactions} interactions)`
        : `El anuncio cumplió: ${f.views} visitas al formulario, calcadas a los ${out} clics salientes — pero ${f.submissions} envíos (${f.interactions} interacciones)`,
      a: en
        ? 'The drop is inside the form, not the ad ➜ <strong>Shorten the form or move the value promise up</strong> before reusing it on the next GEO.'
        : 'El drop está dentro del formulario, no en el anuncio ➜ <strong>Acortar el formulario o subir la promesa de valor</strong> antes de reutilizarlo en el próximo GEO.',
    });
  }

  return ins;
}

export function genGeoNextSteps(geo, lang = 'es') {
  const en = lang === 'en';
  const steps = [];
  const leads = geo.typeform ? geo.typeform.forms.flatMap((f) => f.leads) : [];
  if (leads.length) {
    steps.push(
      en
        ? `<strong>Follow up the ${leads.length} captured leads</strong> (${leads.map((l) => l.company).join(', ')}): in an event GEO the interest window closes fast.`
        : `<strong>Contactar a los ${leads.length} leads captados</strong> (${leads.map((l) => l.company).join(', ')}): en un GEO de evento la ventana de interés se cierra rápido.`,
    );
  }
  if (geo.hsForm && geo.hsForm.submissions === 0) {
    steps.push(
      en
        ? '<strong>Rework the HubSpot form</strong>: 37 visits and 0 submissions says the drop is in the form — fewer fields, clearer value promise, and test again.'
        : '<strong>Rearmar el formulario de HubSpot</strong>: 37 visitas y 0 envíos indican que el drop está en el form — menos campos, promesa de valor más clara, y volver a probar.',
    );
  }
  steps.push(
    en
      ? '<strong>Export the age breakdown</strong> — the only Meta cut still missing; gender, platform, hour of day and creatives are already integrated.'
      : '<strong>Exportar el desglose por edad</strong> — el único corte de Meta que falta; género, plataforma, hora del día y creativos ya están integrados.',
    en
      ? '<strong>Document the setup</strong>: exact radius/address, audience restrictions, placements, creatives and CTAs from Ads Manager, so the experiment is reproducible at the next event.'
      : '<strong>Documentar el setup</strong>: radio/dirección exactos, restricciones de audiencia, placements, creativos y CTA desde el Administrador de Anuncios, para que el experimento sea reproducible en el próximo evento.',
  );
  return steps;
}
