import { useMemo } from 'react';
import { getPillarCrm, getMeta, entityName } from '@/services/crmService';
import { CRM_STR, fmtMoney, fmtInt, fmtAsOf } from '@/utils/crmI18n';

// Card destacada «Deals generados» de Indicadores clave: deals de HubSpot
// cuyo origen es el pilar, para las entidades de la cuenta y los meses del
// período. Si la cuenta no tiene entidad mapeada (o el período no es un
// mes/trimestre/año) no se muestra: no se infiere nada.
export function CrmDealsCard({ pilar, account, period, country = null, lang = 'es' }) {
  const d = useMemo(() => getPillarCrm(pilar, account, period, country), [pilar, account, period, country]);
  if (!d) return null;
  const t = CRM_STR[lang];
  const asOf = fmtAsOf(getMeta().asOf, lang);
  const ents = d.entities.map((c) => entityName(c, lang)).join(', ');
  const won = fmtMoney(d.won.byCurrency, lang);

  return (
    <div className="mb-5 flex flex-wrap items-stretch gap-x-8 gap-y-3 rounded-cu border-l-4 border-l-cu-cyan bg-cu-dblue px-5 py-4 text-white shadow-cu">
      <div className="min-w-[150px]">
        <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.6px] text-cu-cyan">{t.cardLabel}</div>
        <div className="text-[34px] font-bold leading-none tracking-tight">{fmtInt(d.generated, lang)}</div>
      </div>
      <div className="flex flex-col justify-end gap-1.5">
        <span className="inline-block self-start rounded-full bg-cu-cyan/20 px-2 py-0.5 text-[10.5px] font-bold text-cu-cyan">
          {t.cardPill(d.mql.deals, d.won.deals)}
        </span>
        {d.won.deals > 0 && (
          <span className="text-[11px] text-white/80">
            {t.kWon}: <strong className="text-white">{won}</strong>
          </span>
        )}
      </div>
      <div className="ml-auto flex max-w-[420px] flex-col justify-end text-[9.5px] italic leading-snug text-white/60">
        <span>{t.cardFoot(d.hs, ents)}</span>
        <span>{t.cardPartial(asOf)}</span>
      </div>
    </div>
  );
}
