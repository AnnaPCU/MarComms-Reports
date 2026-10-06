import { useMemo, useState } from 'react';
import { getClientCrm, getMeta, entityName, sourceHasDeals } from '@/services/crmService';
import { CRM_STR, CRM_SOURCE_NAMES, fmtMoney, fmtInt, fmtAsOf } from '@/utils/crmI18n';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { HeroCard } from '@/components/shared/HeroCard';

const MONTH_SHORT = {
  es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

function CrmTable({ rows, total, t, names, lang }) {
  const th = 'px-3 py-2 text-[9px] font-bold uppercase tracking-[0.5px] text-cu-grey';
  const td = 'px-3 py-2 text-[12px] text-cu-dgrey';
  const num = 'text-right tabular-nums';
  const cells = (s) => (
    <>
      <td className={`${td} ${num}`}>{fmtInt(s.generated, lang)}</td>
      <td className={`${td} ${num}`}>{fmtInt(s.mql.deals, lang)}</td>
      <td className={`${td} ${num}`}>{fmtMoney(s.mql.byCurrency, lang)}</td>
      <td className={`${td} ${num}`}>{fmtInt(s.won.deals, lang)}</td>
      <td className={`${td} ${num}`}>{fmtMoney(s.won.byCurrency, lang)}</td>
    </>
  );
  return (
    <div className="mb-5 overflow-x-auto rounded-cu border border-cu-border bg-white shadow-cu">
      <table className="w-full min-w-[620px] border-collapse">
        <thead className="border-b border-cu-border bg-cu-bg">
          <tr>
            <th className={`${th} text-left`}>{t.hSource}</th>
            <th className={`${th} text-right`}>{t.hGenerated}</th>
            <th className={`${th} text-right`}>{t.hMql}</th>
            <th className={`${th} text-right`}>{t.hMqlAmount}</th>
            <th className={`${th} text-right`}>{t.hWon}</th>
            <th className={`${th} text-right`}>{t.hWonAmount}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-cu-border2">
              <td className={`${td} font-medium text-cu-dblue`}>{names[r.id]}</td>
              {cells(r)}
            </tr>
          ))}
          <tr className="bg-cu-bg">
            <td className={`${td} font-bold text-cu-dblue`}>{t.total}</td>
            {cells(total)}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Bloque «Resultados comerciales — HubSpot» de la vista por cliente.
// Número principal = los 5 pilares; STEAL, Database, Commercial Tool y
// eventos presenciales y BDR van aparte (pedido del equipo, 6/10/2026).
export function ClientCrm({ clientId, lang = 'es' }) {
  const t = CRM_STR[lang];
  const names = CRM_SOURCE_NAMES[lang];
  const [period, setPeriod] = useState('year-2026');
  const d = useMemo(() => getClientCrm(clientId, period), [clientId, period]);
  const asOf = fmtAsOf(getMeta().asOf, lang);

  if (!d) {
    return (
      <>
        <SectionHeader title={t.section} note={t.sectionNote(asOf)} />
        <div className="mb-5 rounded-cu border border-cu-border border-l-4 border-l-cu-grey bg-white px-4 py-3 text-[12px] leading-relaxed text-cu-dgrey shadow-cu">
          {t.noCrm} {clientId === 'cu-global' && t.noCrmGlobal}
        </div>
      </>
    );
  }

  const { main, other } = d;
  const noAmount = main.total.mql.noAmount + main.total.won.noAmount;
  const options = [
    { id: 'year-2026', label: t.yearLabel },
    ...d.months.map((m) => ({ id: m, label: `${MONTH_SHORT[lang][Number(m.slice(1)) - 1]} 2026` })),
  ];
  const moneyPill = (s) => {
    const parts = [];
    if (Object.keys(s.byCurrency).length) parts.push(fmtMoney(s.byCurrency, lang));
    if (s.noAmount) parts.push(`${fmtInt(s.noAmount, lang)} ${t.noAmountPill}`);
    return parts.join(' · ') || null;
  };

  return (
    <div className="mb-1">
      <SectionHeader title={t.section} note={t.sectionNote(asOf)} />
      <div className="mb-3 print:hidden">
        <SegmentedControl label={t.periodLabel} value={period} onChange={setPeriod} size="sm" options={options} />
      </div>

      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <HeroCard label={`${t.kGenerated} — ${t.mainScope}`} value={fmtInt(main.total.generated, lang)} footnote={options.find((o) => o.id === period)?.label} />
        <HeroCard label={t.kMql} value={fmtInt(main.total.mql.deals, lang)} pill={moneyPill(main.total.mql)} />
        <HeroCard label={t.kWon} value={fmtInt(main.total.won.deals, lang)} pill={moneyPill(main.total.won)} pillTone="green" />
      </div>

      <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">{t.byPillar}</div>
      <CrmTable rows={main.rows} total={main.total} t={t} names={names} lang={lang} />

      <div className="mb-1.5 flex flex-wrap items-baseline gap-x-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
        {t.otherTitle}
        <span className="text-[10px] font-normal normal-case tracking-normal text-cu-grey">{t.otherNote}</span>
      </div>
      <CrmTable
        rows={other.rows}
        total={other.total}
        t={t}
        names={names}
        lang={lang}
      />

      <div className="mb-5 flex flex-col gap-1 text-[10px] italic leading-snug text-cu-grey">
        <span>
          {t.entitiesLabel} {d.entities.map((c) => entityName(c, lang)).join(', ')}.
        </span>
        <span>{t.defs}</span>
        {!sourceHasDeals('bdr') && <span>{t.bdrEmpty}</span>}
        {noAmount > 0 && <span>{t.noAmountNote(noAmount)}.</span>}
        {d.undatedWon?.deals > 0 && <span>{t.undated(d.undatedWon.deals, fmtMoney(d.undatedWon.byCurrency, lang))}</span>}
      </div>
    </div>
  );
}
