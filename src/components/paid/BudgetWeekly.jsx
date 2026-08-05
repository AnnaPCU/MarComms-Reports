import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
// series: [{ name, weeks: [{ w, cost }] }]
export function BudgetWeekly({ series = [], currency = 'EUR', lang = 'es' }) {
  const L = PAID_STR[lang];
  const withCost = series
    .map((s) => ({ ...s, total: s.weeks.reduce((a, w) => a + (w.cost || 0), 0) }))
    .filter((s) => s.total > 0)
    .sort((a, b) => b.total - a.total);
  if (!withCost.length) return null;

  const main = withCost.slice(0, MAX_SERIES);
  const rest = withCost.slice(MAX_SERIES);

  const weeks = [...new Set(withCost.flatMap((s) => s.weeks.map((w) => w.w)))].sort();
  let cum = 0;
  const data = weeks.map((wk) => {
    const row = { name: wkLabel(wk) };
    let wkTotal = 0;
    main.forEach((s) => {
      const v = s.weeks.find((x) => x.w === wk)?.cost || 0;
      row[s.name] = Number(v.toFixed(2));
      wkTotal += v;
    });
    if (rest.length) {
      const o = rest.reduce((a, s) => a + (s.weeks.find((x) => x.w === wk)?.cost || 0), 0);
      row[L.othersLabel] = Number(o.toFixed(2));
      wkTotal += o;
    }
    cum += wkTotal;
    row.__cum = Number(cum.toFixed(2));
    return row;
  });

  const keys = [...main.map((s) => s.name), ...(rest.length ? [L.othersLabel] : [])];

  return (
    <ChartCard title={L.chBudgetTitle} subtitle={L.chBudgetSub(currency)} className="mb-5">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ left: 0, right: 8, top: 6, bottom: 4 }}>
          <CartesianGrid vertical={false} stroke={CU.border2} />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: CU.grey }} />
          <YAxis yAxisId="left" tick={{ fontSize: 10, fill: CU.grey }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: CU.grey }} />
          <Tooltip {...CHART_TOOLTIP} formatter={(v) => money(v, currency)} cursor={{ fill: 'rgba(62,178,237,.06)' }} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          {keys.map((k, i) => (
            <Bar key={k} yAxisId="left" dataKey={k} stackId="cost" fill={PAL[i % PAL.length]} maxBarSize={44} />
          ))}
          <Line yAxisId="right" dataKey="__cum" name={L.cumLabel} stroke={CU.dblue} strokeWidth={2.5} dot={{ r: 3, fill: CU.dblue }} />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
