// ════════════════════════════════════════════════════════════════
//  GENERADOR DE INSIGHTS MENSUALES — portado del dashboard original.
//  Produce las tarjetas "tendencia + acción recomendada" a partir de los
//  datos reales del mes (y del mes anterior, si existe).
// ════════════════════════════════════════════════════════════════

import { classifyESG, ESG_NAME } from '@/utils/esg';

export function genMonthlyInsights(mo, prev) {
  const ins = [];
  if (!mo) return ins;

  if (prev && prev.er != null && prev.imp != null) {
    const de = ((mo.er - prev.er) / prev.er) * 100;
    ins.push({
      m:
        de > 0
          ? `Engagement Rate +${de.toFixed(0)}% vs mes anterior`
          : `Engagement Rate ${de.toFixed(0)}% vs mes anterior — alerta`,
      a:
        de > 0
          ? 'La audiencia responde mejor al contenido actual ➜ <strong>Identificar posts con mayor ER y replicar su formato</strong>, incrementando frecuencia en ese pilar ESG.'
          : 'El mix de contenido necesita ajuste ➜ <strong>Reducir posts informativos genéricos</strong> e incrementar contenido técnico o de eventos con datos concretos.',
    });
    const di = ((mo.imp - prev.imp) / prev.imp) * 100;
    ins.push({
      m: `Impresiones ${di > 0 ? '+' : ''}${di.toFixed(0)}% vs mes anterior`,
      a:
        di > 0
          ? 'Alcance orgánico en crecimiento ➜ <strong>Capitalizar con al menos 1 post patrocinado</strong> para amplificar el contenido top del mes a segmentos aún no alcanzados.'
          : 'Alcance orgánico bajó ➜ <strong>Revisar horario y frecuencia de publicación</strong> y considerar boost pagado en los posts de mejor rendimiento.',
    });
  }

  if (mo.posts && mo.posts.length) {
    const tp = mo.posts.reduce((a, b) => (a.er > b.er ? a : b), mo.posts[0]);
    const p = tp.p || classifyESG(tp.t);
    ins.push({
      m: `Post con mayor ER del mes: pilar ${ESG_NAME[p] || p} — ${Number(tp.er).toFixed(1)}%`,
      a: `Este formato supera el promedio ➜ <strong>Producir 2 posts adicionales de pilar ${ESG_NAME[p] || p}</strong> el próximo mes añadiendo un CTA a recurso descargable o landing page.`,
    });
  }

  ins.push({
    m: `+${mo.fol} seguidores nuevos · ${mo.vis} visitas únicas al perfil`,
    a:
      mo.fol < 30
        ? 'Crecimiento lento ➜ <strong>Activar campaña de seguidores patrocinados</strong> con targeting por cargo (ESG Manager, Director de Calidad) y sector.'
        : 'Crecimiento saludable ➜ <strong>Publicar contenido de bienvenida</strong> con servicios clave y próximos webinars para nutrir a nuevos seguidores.',
  });

  return ins;
}

const numEs = (v) => Number(v || 0).toLocaleString('es-AR');
const pct1 = (v) => Number(v || 0).toFixed(1) + '%';

function topPost(mo) {
  if (!mo?.posts?.length) return null;
  return mo.posts.reduce((a, b) => ((b.er || 0) > (a.er || 0) ? b : a), mo.posts[0]);
}

// ── Diagnóstico (Lectura de Performance) para Social ──
export function genSocialConclusions(mo, prev) {
  if (!mo) return [];
  const out = [];
  out.push({
    label: 'Alcance',
    text: `<strong>${numEs(mo.imp)} impresiones</strong> y <strong>${numEs(mo.clk)} clics</strong> en el mes${
      prev?.imp ? ` (${mo.imp >= prev.imp ? '+' : ''}${(((mo.imp - prev.imp) / prev.imp) * 100).toFixed(0)}% vs mes anterior)` : ''
    }.`,
  });
  out.push({
    label: 'Engagement',
    text: `Engagement Rate de <strong>${pct1(mo.er)}</strong>${
      prev?.er ? `, ${mo.er >= prev.er ? 'por encima' : 'por debajo'} del mes anterior (${pct1(prev.er)})` : ''
    }. Mide qué tan relevante resulta el contenido para la audiencia.`,
  });
  const tp = topPost(mo);
  out.push({
    label: 'Contenido destacable',
    text: tp
      ? `El posteo de mayor engagement (<strong>${pct1(tp.er)}</strong>) fue del pilar ${ESG_NAME[tp.p || classifyESG(tp.t)] || 'General'}: marca el formato a replicar.`
      : 'Sin publicaciones registradas en el período.',
  });
  out.push({
    label: 'Audiencia',
    text: `<strong>+${numEs(mo.fol)} seguidores</strong> y ${numEs(mo.vis)} visitas únicas al perfil (proxy de interés — LinkedIn no exporta conversiones).`,
  });
  return out;
}

// ── Próximos pasos para Social ──
export function genSocialNextSteps(mo, prev) {
  if (!mo) return [];
  const tp = topPost(mo);
  const pilar = tp ? ESG_NAME[tp.p || classifyESG(tp.t)] || 'General' : null;
  const steps = [];
  if (pilar) {
    steps.push(
      `<strong>Replicar el formato ganador</strong>: el pilar ${pilar} lideró el engagement (${pct1(tp.er)}). Producir 2 piezas más de ese eje con CTA a recurso descargable.`,
    );
  }
  steps.push(
    prev && mo.er < prev.er
      ? `<strong>Ajustar el mix de contenido</strong>: el ER bajó vs el mes anterior. Reducir posteos informativos genéricos y sumar contenido técnico o de eventos con datos concretos.`
      : `<strong>Capitalizar el alcance</strong>: amplificar con 1 posteo patrocinado el contenido top del mes hacia segmentos aún no alcanzados.`,
  );
  steps.push(
    mo.fol < 30
      ? `<strong>Acelerar el crecimiento de audiencia</strong>: activar campaña de seguidores patrocinados con targeting por cargo (ESG/Calidad) y sector.`
      : `<strong>Nutrir a los nuevos seguidores</strong>: publicar contenido de bienvenida con servicios clave y próximos webinars.`,
  );
  steps.push(`<strong>Comparar mes a mes</strong>: seguir Impresiones, ER y clics para confirmar la tendencia y ajustar la frecuencia de publicación.`);
  return steps;
}
