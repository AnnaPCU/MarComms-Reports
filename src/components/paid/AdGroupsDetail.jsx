import { PAID_STR } from '@/utils/paidI18n';

const numEs = (v) => Number(v || 0).toLocaleString('es-AR');
const money = (v, c) =>
  Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + (c || 'EUR');
const pct0 = (v) => `${Math.round(v)}%`;

function MiniTable({ title, headers, rows, moreCount, L, emptyText }) {
  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
        <span className="h-2.5 w-[3px] shrink-0 rounded-sm bg-cu-cyan" />
        {title}
      </div>
      {rows.length === 0 && <div className="py-2 text-[10.5px] italic text-cu-grey">{emptyText}</div>}
      {rows.length > 0 && (
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={h}
                className={`whitespace-nowrap border-b border-cu-cyan/60 px-2 py-1.5 text-[8.5px] font-bold uppercase tracking-[0.4px] text-cu-grey ${i === 0 ? 'text-left' : 'text-right'}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-cu-border2 last:border-b-0 hover:bg-cu-cyan/[0.03]">
              {r.map((cell, j) => (
                <td
                  key={j}
                  className={`px-2 py-1.5 text-[11px] ${j === 0 ? 'text-left text-cu-dgrey' : 'whitespace-nowrap text-right text-cu-dgrey'} ${j === 0 ? '' : 'tabular-nums'}`}
                  title={typeof cell === 'string' ? cell : undefined}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      )}
      {moreCount > 0 && <div className="mt-1 text-[9.5px] italic text-cu-grey">{L.moreN(moreCount)}</div>}
    </div>
  );
}

// "Detalle por Grupo de Anuncio": para cada grupo de la campaña muestra sus
// totales del mes, la cuota de búsqueda y las tablas de palabras clave y
// términos de búsqueda (top por clics) con impresiones y clics.
export function AdGroupsDetail({ groups = [], currency = 'EUR', lang = 'es' }) {
  const L = PAID_STR[lang];
  if (!groups.length) return null;

  return (
    <div className="mb-5 flex flex-col gap-3">
      {groups.map((g) => {
        const tot = g.weeks.reduce(
          (a, w) => ({ imp: a.imp + w.imp, clk: a.clk + w.clk, cost: a.cost + w.cost, conv: a.conv + w.conv }),
          { imp: 0, clk: 0, cost: 0, conv: 0 },
        );
        // Cuota de búsqueda ponderada por impresiones (solo semanas con dato).
        const wIs = g.weeks.filter((w) => w.is != null && w.imp > 0);
        const isAvg = wIs.length ? wIs.reduce((a, w) => a + w.is * w.imp, 0) / wIs.reduce((a, w) => a + w.imp, 0) : null;
        const wLr = g.weeks.filter((w) => w.is != null && w.lr != null && w.imp > 0);
        const lrAvg = wLr.length ? wLr.reduce((a, w) => a + w.lr * w.imp, 0) / wLr.reduce((a, w) => a + w.imp, 0) : null;
        const lbAvg = isAvg != null && lrAvg != null ? Math.max(0, 100 - isAvg - lrAvg) : null;

        return (
          <div key={g.name} className="overflow-hidden rounded-cu border border-cu-border bg-white shadow-cu">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-cu-border2 bg-cu-bg px-4 py-2.5">
              <span className="text-[12px] font-bold text-cu-dblue">{g.name}</span>
              <span className="text-[10.5px] text-cu-grey">
                {L.groupTotals(numEs(tot.imp), numEs(tot.clk), money(tot.cost, currency))}
                {tot.conv > 0 && ` · ${numEs(tot.conv)} ${L.thConv.toLowerCase()}`}
              </span>
              {isAvg != null && (
                <span className="ml-auto rounded-[3px] border border-cu-cyan/30 bg-cu-cyan/10 px-2 py-0.5 text-[9px] font-bold text-[#1372a5]">
                  {L.isLabel} {pct0(isAvg)}
                  {lrAvg != null && ` · ${pct0(lrAvg)} ${L.lostRankLabel}`}
                  {lbAvg != null && ` · ${pct0(lbAvg)} ${L.lostBudgetLabel}`}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
              <MiniTable
                title={L.kwsTitle}
                headers={[L.thKw, L.thImp, L.thClk, L.thCost]}
                rows={g.kws.map((k) => [k.k, numEs(k.imp), numEs(k.clk), money(k.cost, currency)])}
                moreCount={Math.max(0, (g.nKws || 0) - g.kws.length)}
                L={L}
                emptyText={L.noVisibleTerms}
              />
              <MiniTable
                title={L.termsTitle}
                headers={[L.thTerm, L.thMatch, L.thImp, L.thClk]}
                rows={g.terms.map((t) => [t.t, t.match.replace(/Concordancia /i, ''), numEs(t.imp), numEs(t.clk)])}
                moreCount={Math.max(0, (g.nTerms || 0) - g.terms.length)}
                L={L}
                emptyText={L.noVisibleTerms}
              />
            </div>
          </div>
        );
      })}
      <p className="text-[10px] italic leading-relaxed text-cu-grey">{L.hiddenTermsNote}</p>
    </div>
  );
}
