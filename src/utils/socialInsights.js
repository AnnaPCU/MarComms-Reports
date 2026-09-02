// ════════════════════════════════════════════════════════════════
//  GENERADOR DE INSIGHTS MENSUALES — portado del dashboard original.
//  Produce las tarjetas "tendencia + acción recomendada" a partir de los
//  datos reales del mes (y del mes anterior, si existe).
//  Bilingüe: cada generador recibe lang ('es' | 'en').
// ════════════════════════════════════════════════════════════════

import { classifyESG, ESG_NAME, ESG_NAME_EN } from '@/utils/esg';

const esgName = (p, lang) => (lang === 'en' ? ESG_NAME_EN[p] : ESG_NAME[p]) || p;

export function genMonthlyInsights(mo, prev, lang = 'es') {
  const ins = [];
  if (!mo) return ins;
  const en = lang === 'en';

  if (prev && prev.er != null && prev.imp != null) {
    const de = ((mo.er - prev.er) / prev.er) * 100;
    ins.push(
      en
        ? {
            m:
              de > 0
                ? `Engagement Rate +${de.toFixed(0)}% vs previous month`
                : `Engagement Rate ${de.toFixed(0)}% vs previous month — alert`,
            a:
              de > 0
                ? 'The audience responds better to the current content ➜ <strong>Identify the posts with the highest ER and replicate their format</strong>, increasing frequency in that ESG pillar.'
                : 'The content mix needs adjustment ➜ <strong>Reduce generic informational posts</strong> and increase technical or event content with concrete data.',
          }
        : {
            m:
              de > 0
                ? `Engagement Rate +${de.toFixed(0)}% vs mes anterior`
                : `Engagement Rate ${de.toFixed(0)}% vs mes anterior — alerta`,
            a:
              de > 0
                ? 'La audiencia responde mejor al contenido actual ➜ <strong>Identificar posts con mayor ER y replicar su formato</strong>, incrementando frecuencia en ese pilar ESG.'
                : 'El mix de contenido necesita ajuste ➜ <strong>Reducir posts informativos genéricos</strong> e incrementar contenido técnico o de eventos con datos concretos.',
          },
    );
    const di = ((mo.imp - prev.imp) / prev.imp) * 100;
    ins.push(
      en
        ? {
            m: `Impressions ${di > 0 ? '+' : ''}${di.toFixed(0)}% vs previous month`,
            a:
              di > 0
                ? 'Organic reach is growing ➜ <strong>Capitalize with at least 1 sponsored post</strong> to amplify the month\'s top content to segments not yet reached.'
                : 'Organic reach dropped ➜ <strong>Review posting time and frequency</strong> and consider a paid boost on the best-performing posts.',
          }
        : {
            m: `Impresiones ${di > 0 ? '+' : ''}${di.toFixed(0)}% vs mes anterior`,
            a:
              di > 0
                ? 'Alcance orgánico en crecimiento ➜ <strong>Capitalizar con al menos 1 post patrocinado</strong> para amplificar el contenido top del mes a segmentos aún no alcanzados.'
                : 'Alcance orgánico bajó ➜ <strong>Revisar horario y frecuencia de publicación</strong> y considerar boost pagado en los posts de mejor rendimiento.',
          },
    );
  }

  if (mo.posts && mo.posts.length) {
    const tp = mo.posts.reduce((a, b) => (a.er > b.er ? a : b), mo.posts[0]);
    const p = tp.p || classifyESG(tp.t);
    ins.push(
      en
        ? {
            m: `Post with the highest ER of the month: ${esgName(p, lang)} pillar — ${Number(tp.er).toFixed(1)}%`,
            a: `This format beats the average ➜ <strong>Produce 2 additional ${esgName(p, lang)}-pillar posts</strong> next month, adding a CTA to a downloadable resource or landing page.`,
          }
        : {
            m: `Post con mayor ER del mes: pilar ${esgName(p, lang)} — ${Number(tp.er).toFixed(1)}%`,
            a: `Este formato supera el promedio ➜ <strong>Producir 2 posts adicionales de pilar ${esgName(p, lang)}</strong> el próximo mes añadiendo un CTA a recurso descargable o landing page.`,
          },
    );
  }

  ins.push(
    en
      ? {
          m: `+${mo.fol} new followers · ${mo.vis} unique profile visits`,
          a:
            mo.fol < 30
              ? 'Slow growth ➜ <strong>Activate a sponsored followers campaign</strong> targeting by job title (ESG Manager, Quality Director) and sector.'
              : 'Healthy growth ➜ <strong>Publish welcome content</strong> with key services and upcoming webinars to nurture new followers.',
        }
      : {
          m: `+${mo.fol} seguidores nuevos · ${mo.vis} visitas únicas al perfil`,
          a:
            mo.fol < 30
              ? 'Crecimiento lento ➜ <strong>Activar campaña de seguidores patrocinados</strong> con targeting por cargo (ESG Manager, Director de Calidad) y sector.'
              : 'Crecimiento saludable ➜ <strong>Publicar contenido de bienvenida</strong> con servicios clave y próximos webinars para nutrir a nuevos seguidores.',
        },
  );

  return ins;
}

const num = (v, lang) => Number(v || 0).toLocaleString(lang === 'en' ? 'en-US' : 'es-AR');
const pct1 = (v) => Number(v || 0).toFixed(1) + '%';

// ── Insights del reporte POR PAÍS (CU Latinoamérica, CU North America) ──
// Todo computado de datos reales: participación del país en el mes,
// tendencia vs mes anterior y mejor post del país.
export function genCountryInsights(d, prev, tot, countryName, lang = 'es') {
  if (!d || !d.np) return [];
  const ins = [];
  const en = lang === 'en';

  if (tot?.imp) {
    const share = (d.imp / tot.imp) * 100;
    ins.push(
      en
        ? {
            m: `${countryName} accounted for ${share.toFixed(0)}% of the month's content impressions (${d.np} of ${tot.np} posts)`,
            a:
              share >= 30
                ? `The country is a reach driver for the account ➜ <strong>Sustain the posting frequency for ${countryName}</strong> and add a CTA to the local landing page in the top posts.`
                : `There is room to grow in share ➜ <strong>Increase the cadence of posts tagged for ${countryName}</strong>, prioritizing formats already working for the account.`,
          }
        : {
            m: `${countryName} concentró el ${share.toFixed(0)}% de las impresiones del contenido del mes (${d.np} de ${tot.np} publicaciones)`,
            a:
              share >= 30
                ? `El país es un motor de alcance de la cuenta ➜ <strong>Sostener la frecuencia de publicación para ${countryName}</strong> y sumar CTA a la landing local en los posts top.`
                : `Hay espacio para crecer en participación ➜ <strong>Aumentar la cadencia de posts etiquetados para ${countryName}</strong>, priorizando los formatos que ya funcionan en la cuenta.`,
          },
    );
  }

  if (prev?.imp) {
    const di = ((d.imp - prev.imp) / prev.imp) * 100;
    ins.push(
      en
        ? {
            m: `Impressions of ${countryName}'s content: ${di > 0 ? '+' : ''}${di.toFixed(0)}% vs previous month`,
            a:
              di > 0
                ? 'Local interest is growing ➜ <strong>Capitalize with content on country-specific services</strong> while the trend holds.'
                : "Local reach dropped ➜ <strong>Review the country's post mix and timing</strong> and replicate the format of the month's best post.",
          }
        : {
            m: `Impresiones del contenido de ${countryName}: ${di > 0 ? '+' : ''}${di.toFixed(0)}% vs mes anterior`,
            a:
              di > 0
                ? 'El interés local está en crecimiento ➜ <strong>Capitalizar con contenido de servicios específicos del país</strong> mientras la tendencia acompaña.'
                : 'El alcance local bajó ➜ <strong>Revisar mix y horarios de los posts del país</strong> y replicar el formato del mejor post del mes.',
          },
    );
  }

  const tp = topPost(d);
  if (tp) {
    const p = classifyESG(tp.t);
    ins.push(
      en
        ? {
            m: `Best post from ${countryName}: ${esgName(p, lang)} pillar — ER ${pct1(tp.er)}`,
            a: `That format sets the local standard ➜ <strong>Produce 2 more pieces on the same axis for ${countryName}</strong> next month.`,
          }
        : {
            m: `Mejor post de ${countryName}: pilar ${esgName(p, lang)} — ER ${pct1(tp.er)}`,
            a: `Ese formato marca el estándar local ➜ <strong>Producir 2 piezas más del mismo eje para ${countryName}</strong> el próximo mes.`,
          },
    );
  }

  return ins;
}

function topPost(mo) {
  if (!mo?.posts?.length) return null;
  return mo.posts.reduce((a, b) => ((b.er || 0) > (a.er || 0) ? b : a), mo.posts[0]);
}

// ── Insights del Resumen del Año POR PAÍS ──
// agg viene de CountryYearView (acumulados del año del país);
// series es la serie mensual completa. Todo computado, nada inventado.
export function genCountryYearInsights(agg, series, countryName, lang = 'es') {
  if (!agg?.withData?.length) return [];
  const ins = [];
  const en = lang === 'en';

  const totImp = series.reduce((a, s) => a + (s.tot?.imp || 0), 0);
  if (totImp) {
    const share = (agg.imp / totImp) * 100;
    ins.push(
      en
        ? {
            m: `${countryName} accounted for ${share.toFixed(0)}% of the year's content impressions (${agg.np} posts across ${agg.withData.length} ${agg.withData.length === 1 ? 'month' : 'months'})`,
            a:
              share >= 30
                ? `The country is a reach driver for the account ➜ <strong>Sustain the content cadence for ${countryName}</strong> and add a CTA to the local landing page in the top posts.`
                : `There is room to grow in share ➜ <strong>Increase the cadence of posts tagged for ${countryName}</strong>, prioritizing formats that already work.`,
          }
        : {
            m: `${countryName} concentró el ${share.toFixed(0)}% de las impresiones del contenido del año (${agg.np} publicaciones en ${agg.withData.length} ${agg.withData.length === 1 ? 'mes' : 'meses'})`,
            a:
              share >= 30
                ? `El país es un motor de alcance de la cuenta ➜ <strong>Sostener la cadencia de contenido para ${countryName}</strong> y sumar CTA a la landing local en los posts top.`
                : `Hay espacio para crecer en participación ➜ <strong>Aumentar la cadencia de posts etiquetados para ${countryName}</strong>, priorizando los formatos que ya funcionan.`,
          },
    );
  }

  const best = agg.withData.reduce((a, s) => (s.d.imp > a.d.imp ? s : a), agg.withData[0]);
  ins.push(
    en
      ? {
          m: `${countryName}'s best month: ${best.short} — ${num(best.d.imp, lang)} impressions with ${best.d.np} ${best.d.np === 1 ? 'post' : 'posts'}`,
          a: `Review what was published that month ➜ <strong>Replicate the formats and topics of ${best.short}</strong> when planning the coming months.`,
        }
      : {
          m: `Mejor mes de ${countryName}: ${best.short} — ${num(best.d.imp, lang)} impresiones con ${best.d.np} ${best.d.np === 1 ? 'publicación' : 'publicaciones'}`,
          a: `Revisar qué se publicó ese mes ➜ <strong>Replicar los formatos y temas de ${best.short}</strong> en la planificación de los próximos meses.`,
        },
  );

  const tp = topPost({ posts: agg.posts });
  if (tp) {
    const p = classifyESG(tp.t);
    ins.push(
      en
        ? {
            m: `${countryName}'s best post of the year: ${esgName(p, lang)} pillar — ER ${pct1(tp.er)}`,
            a: `That format sets the local standard ➜ <strong>Turn it into a recurring series for ${countryName}</strong> with a CTA to a downloadable resource.`,
          }
        : {
            m: `Mejor post del año de ${countryName}: pilar ${esgName(p, lang)} — ER ${pct1(tp.er)}`,
            a: `Ese formato marca el estándar local ➜ <strong>Convertirlo en una serie recurrente para ${countryName}</strong> con CTA a recurso descargable.`,
          },
    );
  }

  return ins;
}

// ── Diagnóstico (Lectura de Performance) para Social ──
export function genSocialConclusions(mo, prev, lang = 'es') {
  if (!mo) return [];
  const en = lang === 'en';
  const n = (v) => num(v, lang);
  const out = [];
  out.push(
    en
      ? {
          label: 'Reach',
          text: `<strong>${n(mo.imp)} impressions</strong> and <strong>${n(mo.clk)} clicks</strong> in the month${
            prev?.imp ? ` (${mo.imp >= prev.imp ? '+' : ''}${(((mo.imp - prev.imp) / prev.imp) * 100).toFixed(0)}% vs previous month)` : ''
          }.`,
        }
      : {
          label: 'Alcance',
          text: `<strong>${n(mo.imp)} impresiones</strong> y <strong>${n(mo.clk)} clics</strong> en el mes${
            prev?.imp ? ` (${mo.imp >= prev.imp ? '+' : ''}${(((mo.imp - prev.imp) / prev.imp) * 100).toFixed(0)}% vs mes anterior)` : ''
          }.`,
        },
  );
  out.push(
    en
      ? {
          label: 'Engagement',
          text: `Engagement Rate of <strong>${pct1(mo.er)}</strong>${
            prev?.er ? `, ${mo.er >= prev.er ? 'above' : 'below'} the previous month (${pct1(prev.er)})` : ''
          }. It measures how relevant the content is to the audience.`,
        }
      : {
          label: 'Engagement',
          text: `Engagement Rate de <strong>${pct1(mo.er)}</strong>${
            prev?.er ? `, ${mo.er >= prev.er ? 'por encima' : 'por debajo'} del mes anterior (${pct1(prev.er)})` : ''
          }. Mide qué tan relevante resulta el contenido para la audiencia.`,
        },
  );
  const tp = topPost(mo);
  const tpP = tp ? tp.p || classifyESG(tp.t) : null;
  out.push(
    en
      ? {
          label: 'Standout content',
          text: tp
            ? `The post with the highest engagement (<strong>${pct1(tp.er)}</strong>) belonged to the ${esgName(tpP, lang)} pillar: it sets the format to replicate.`
            : 'No posts recorded in the period.',
        }
      : {
          label: 'Contenido destacable',
          text: tp
            ? `El posteo de mayor engagement (<strong>${pct1(tp.er)}</strong>) fue del pilar ${esgName(tpP, lang)}: marca el formato a replicar.`
            : 'Sin publicaciones registradas en el período.',
        },
  );
  out.push(
    en
      ? {
          label: 'Audience',
          text: `<strong>+${n(mo.fol)} followers</strong> and ${n(mo.vis)} unique profile visits (interest proxy — LinkedIn does not export conversions).`,
        }
      : {
          label: 'Audiencia',
          text: `<strong>+${n(mo.fol)} seguidores</strong> y ${n(mo.vis)} visitas únicas al perfil (proxy de interés — LinkedIn no exporta conversiones).`,
        },
  );
  return out;
}

// ── Próximos pasos para Social ──
export function genSocialNextSteps(mo, prev, lang = 'es') {
  if (!mo) return [];
  const en = lang === 'en';
  const tp = topPost(mo);
  const pilar = tp ? esgName(tp.p || classifyESG(tp.t), lang) : null;
  const steps = [];
  if (pilar) {
    steps.push(
      en
        ? `<strong>Replicate the winning format</strong>: the ${pilar} pillar led engagement (${pct1(tp.er)}). Produce 2 more pieces on that axis with a CTA to a downloadable resource.`
        : `<strong>Replicar el formato ganador</strong>: el pilar ${pilar} lideró el engagement (${pct1(tp.er)}). Producir 2 piezas más de ese eje con CTA a recurso descargable.`,
    );
  }
  steps.push(
    prev && mo.er < prev.er
      ? en
        ? `<strong>Adjust the content mix</strong>: ER dropped vs the previous month. Reduce generic informational posts and add technical or event content with concrete data.`
        : `<strong>Ajustar el mix de contenido</strong>: el ER bajó vs el mes anterior. Reducir posteos informativos genéricos y sumar contenido técnico o de eventos con datos concretos.`
      : en
        ? `<strong>Capitalize on the reach</strong>: amplify the month's top content with 1 sponsored post toward segments not yet reached.`
        : `<strong>Capitalizar el alcance</strong>: amplificar con 1 posteo patrocinado el contenido top del mes hacia segmentos aún no alcanzados.`,
  );
  steps.push(
    mo.fol < 30
      ? en
        ? `<strong>Accelerate audience growth</strong>: activate a sponsored followers campaign targeting by job title (ESG/Quality) and sector.`
        : `<strong>Acelerar el crecimiento de audiencia</strong>: activar campaña de seguidores patrocinados con targeting por cargo (ESG/Calidad) y sector.`
      : en
        ? `<strong>Nurture the new followers</strong>: publish welcome content with key services and upcoming webinars.`
        : `<strong>Nutrir a los nuevos seguidores</strong>: publicar contenido de bienvenida con servicios clave y próximos webinars.`,
  );
  steps.push(
    en
      ? `<strong>Compare month over month</strong>: track Impressions, ER and clicks to confirm the trend and adjust posting frequency.`
      : `<strong>Comparar mes a mes</strong>: seguir Impresiones, ER y clics para confirmar la tendencia y ajustar la frecuencia de publicación.`,
  );
  return steps;
}
