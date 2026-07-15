import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { CU, PAL, CHART_TOOLTIP } from '@/constants/brand';
import { ChartCard } from '@/components/shared/ChartCard';

const numEs = (v) => Number(v || 0).toLocaleString('es-AR');
const short = (s, n = 16) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

// Gráficos de la vista global de Paid: inversión vs clics + reparto de impresiones.
export function PaidCharts({ campaigns = [], currency = 'EUR' }) {
  const active = campaigns.filter((c) => (c.impressions || 0) > 0);
  if (!active.length) return null;

  const invData = campaigns
    .filter((c) => (c.cost || 0) > 0 || (c.clicks || 0) > 0)
    .map((c) => ({ name: short(c.name), cost: Number(c.cost || 0), clicks: Number(c.clicks || 0) }));

  const impData = active.map((c) => ({ name: c.name, value: Number(c.impressions || 0) }));

  return (
    <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
      <ChartCard title="Inversión vs. Clics por Campaña" subtitle={`Coste (${currency}) y volumen de clics — campañas con actividad`}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={invData} margin={{ left: 0, right: 8, top: 6, bottom: 4 }}>
            <CartesianGrid vertical={false} stroke={CU.border2} />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: CU.grey }} interval={0} angle={-18} textAnchor="end" height={48} />
            <YAxis yAxisId="left" tick={{ fontSize: 10, fill: CU.grey }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: CU.grey }} />
            <Tooltip
              {...CHART_TOOLTIP}
              formatter={(v, n) => (n === 'Coste' ? `${numEs(v)} ${currency}` : numEs(v))}
              cursor={{ fill: 'rgba(62,178,237,.06)' }}
            />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Bar yAxisId="left" dataKey="cost" name="Coste" fill={CU.dblue} radius={[4, 4, 0, 0]} maxBarSize={34} />
            <Line yAxisId="right" dataKey="clicks" name="Clics" stroke={CU.cyan} strokeWidth={2.5} dot={{ r: 3, fill: CU.cyan }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Reparto de Impresiones" subtitle="Share of voice por campaña con actividad">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={impData} dataKey="value" nameKey="name" cx="42%" cy="50%" innerRadius={44} outerRadius={78} paddingAngle={2}>
              {impData.map((e, i) => (
                <Cell key={i} fill={PAL[i % PAL.length]} />
              ))}
            </Pie>
            <Tooltip {...CHART_TOOLTIP} formatter={(v) => `${numEs(v)} impresiones`} />
            <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 10, lineHeight: '15px' }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
