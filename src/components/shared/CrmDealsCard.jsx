import { getMeta, entityName } from '@/services/crmService';
import { CRM_STR, fmtMoney, fmtInt, fmtAsOf, monthsRangeLabel, periodClosed } from '@/utils/crmI18n';
import { HeroCard } from '@/components/shared/HeroCard';

// Card destacada «Deals generados» dentro de la tira de Indicadores clave
// (a la derecha de los KPIs del pilar, misma fila). Recibe lo que devuelve
// usePillarCrm: el padre solo la dibuja si hubo deals.
export function CrmDealsCard({ d, lang = 'es' }) {
  const t = CRM_STR[lang];
  const { asOf } = getMeta();
  // Período cerrado (ej. Q3 al 6/10): se nombra el período; abierto: «datos al …».
  const when = periodClosed(d.months, asOf) ? monthsRangeLabel(d.months, lang) : t.asOfLabel(fmtAsOf(asOf, lang));
  const won = d.won.deals > 0 ? `${t.kWon}: ${fmtMoney(d.won.byCurrency, lang)} · ` : '';
  return (
    <HeroCard
      label={t.cardLabel}
      value={fmtInt(d.generated, lang)}
      pill={t.cardPill(d.mql.deals, d.won.deals)}
      footnote={`${won}${t.cardFootShort(d.hs, when)}`}
      title={d.entities.map((c) => entityName(c, lang)).join(', ')}
    />
  );
}
