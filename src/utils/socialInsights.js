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
    const de = (((mo.er - prev.er) / prev.er) * 100).toFixed(0);
    ins.push({
      m:
        de > 0
          ? `Engagement Rate +${de}% vs mes anterior`
          : `Engagement Rate ${de}% vs mes anterior — alerta`,
      a:
        de > 0
          ? 'La audiencia responde mejor al contenido actual ➜ <strong>Identificar posts con mayor ER y replicar su formato</strong>, incrementando frecuencia en ese pilar ESG.'
          : 'El mix de contenido necesita ajuste ➜ <strong>Reducir posts informativos genéricos</strong> e incrementar contenido técnico o de eventos con datos concretos.',
    });
    const di = (((mo.imp - prev.imp) / prev.imp) * 100).toFixed(0);
    ins.push({
      m: `Impresiones ${di > 0 ? '+' : ''}${di}% vs mes anterior`,
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
