import { useMemo, useState, useEffect } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CU, PAL, CHART_TOOLTIP } from '@/constants/brand';
import { ChartCard } from '@/components/shared/ChartCard';
import { PAID_STR } from '@/utils/paidI18n';

const money = (v, c) =>
  Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + (c || 'EUR');

// "2026-07-06" → "6/7"
const wkLabel = (w) => {
  const [, m, d] = w.split('-');
  return `${Number(d)}/${Number(m)}`;
};

const MAX_SERIES = 6;

// Consumo semanal del presupuesto (SOLO uso interno): barras apiladas por
// serie (campañas o grupos de anuncio) + línea de acumulado del mes.
//
// Leyenda interactiva: clic en una serie → se muestra SOLO esa; con una vista
// filtrada se pueden activar/desactivar otras series; volver a clickear la
// única activa → se muestran todas de nuevo.
// series: [{ name, weeks: [{ w, cost }] }]
export function BudgetWeekly({ series = [], currency = 'EUR', lang = 'es' }) {
  const L = PAID_STR[lang];
  // null = todas visibles; Set = subconjunto activo.
  const [visible, setVisible] = useState(null);
  useEffect(() => setVisible(null), [series.length, lang]);

  const { keys, colorOf, data } = useMemo(() => {
    const withCost = series
      .map((s) => ({ ...s, total: s.weeks.reduce((a, w) => a + (w.cost || 0), 0) }))
      .filter((s) => s.total > 0)
      .sort((a, b) => b.total - a.total);
    if (!withCost.length) return { keys: [], colorOf: {}, data: [] };

    const main = withCost.slice(0, MAX_SERIES);
    const rest = withCost.slice(MAX_SERIES);
    const seriesOut = [...main];
    if (rest.length) {
      // "Otros" agrupa las series menores para que el gráfico siga legible.
      const weeks = {};
      rest.forEach((s) => s.weeks.forEach((w) => (weeks[w.w] = (weeks[w.w] || 0) + (w.cost || 0))));
      seriesOut.push({ name: L.othersLabel, weeks: Object.entries(weeks).map(([w, cost]) => ({ w, cost })) });
    }

    const keys = seriesOut.map((s) => s.name);
    const colorOf = Object.fromEntries(keys.map((k, i) => [k, PAL[i % PAL.length]]));
    const allWeeks = [...new Set(seriesOut.flatMap((s) => s.weeks.map((w) => w.w)))].sort();
    const data = { seriesOut, allWeeks };
    return { keys, colorOf, data };
  }, [series, L.othersLabel]);

  if (!keys.length) return null;

  const activeKeys = visible ? keys.filter((k) => visible.has(k)) : keys;

  // Filas del chart: solo las series activas; el acumulado refleja lo visible.
  let cum = 0;
  const rows = data.allWeeks.map((wk) => {
    const row = { name: wkLabel(wk) };
    let wkTotal = 0;
    data.seriesOut.forEach((s) => {
      if (!activeKeys.includes(s.name)) return;
      const v = s.weeks.find((x) => x.w === wk)?.cost || 0;
      row[s.name] = Number(v.toFixed(2));
      wkTotal += v;
    });
    cum += wkTotal;
    row.__cum = Number(cum.toFixed(2));
    return row;
  });

  function clickSerie(k) {
    if (!visible) {
      setVisible(new Set([k])); // todas → solo esta
      return;
    }
    if (visible.has(k)) {
      if (visible.size === 1) {
        setVisible(null); // re-clic en la única activa → todas
        return;
      }
      const next = new Set(visible);
      next.delete(k);
      setVisible(next);
    } else {
      const next = new Set(visible);
      next.add(k);
      setVisible(next.size === keys.length ? null : next);
    }
  }

  return (
    <ChartCard title={L.chBudgetTitle} subtitle={L.chBudgetSub(currency)} className="mb-5">
      <div className="flex h-full flex-col">
        {/* Leyenda interactiva */}
        <div className="mb-2 flex flex-wrap gap-1.5">
          {keys.map((k) => {
            const on = activeKeys.includes(k);
            return (
              <button
                key={k}
                onClick={() => clickSerie(k)}
                aria-pressed={on}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[10px] font-medium transition-all ${
                  on
                    ? 'border-cu-border bg-white text-cu-dblue shadow-cu'
                    : 'border-cu-border2 bg-cu-bg text-cu-grey/70 opacity-60'
                }`}
              >
                <span className="h-2 w-2 shrink-0 rounded-[2px]" style={{ background: colorOf[k], opacity: on ? 1 : 0.35 }} />
                {k}
              </button>
            );
          })}
        </div>
        <div className="min-h-0 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={rows} margin={{ left: 0, right: 8, top: 6, bottom: 4 }}>
              <CartesianGrid vertical={false} stroke={CU.border2} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: CU.grey }} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: CU.grey }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: CU.grey }} />
              <Tooltip {...CHART_TOOLTIP} formatter={(v) => money(v, currency)} cursor={{ fill: 'rgba(62,178,237,.06)' }} />
              {activeKeys.map((k) => (
                <Bar key={k} yAxisId="left" dataKey={k} stackId="cost" fill={colorOf[k]} maxBarSize={44} />
              ))}
              <Line yAxisId="right" dataKey="__cum" name={L.cumLabel} stroke={CU.dblue} strokeWidth={2.5} dot={{ r: 3, fill: CU.dblue }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ChartCard>
  );
}
