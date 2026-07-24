import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { CU, PAL, CHART_TOOLTIP } from '@/constants/brand';
import { ChartCard } from '@/components/shared/ChartCard';

const short = (s, n = 16) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

// Gráficos del pilar Email: comparativa de tasas por envío + volumen de
// aperturas/clics únicos por envío de la secuencia.
export function EmailCharts({ comparison = [], emails = [] }) {
  if (!comparison.length) return null;

  const rateData = comparison.map((c) => ({
    name: short(c.name),
    Apertura: c.aperturas,
    Clics: c.clics,
    CTOR: c.ctor,
  }));

  const volData = emails
    .filter((e) => e.metrics)
    .map((e) => ({
      name: short(e.name),
      Aperturas: e.metrics.uniqueOpens ?? e.metrics.totalOpens ?? 0,
      Clics: e.metrics.uniqueClicks ?? e.metrics.totalClicks ?? 0,
    }));

  return (
    <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
      <ChartCard title="Tasas por Envío" subtitle="Apertura · Clics · CTOR (%) email por email">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rateData} margin={{ left: 0, right: 8, top: 6, bottom: 4 }}>
            <CartesianGrid vertical={false} stroke={CU.border2} />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: CU.grey }} interval={0} angle={-18} textAnchor="end" height={48} />
            <YAxis tick={{ fontSize: 10, fill: CU.grey }} unit="%" />
            <Tooltip {...CHART_TOOLTIP} formatter={(v) => `${v}%`} cursor={{ fill: 'rgba(62,178,237,.06)' }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Bar dataKey="Apertura" fill={CU.cyan} radius={[4, 4, 0, 0]} maxBarSize={26} />
            <Bar dataKey="Clics" fill={CU.dblue} radius={[4, 4, 0, 0]} maxBarSize={26} />
            <Bar dataKey="CTOR" fill={CU.grey} radius={[4, 4, 0, 0]} maxBarSize={26} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Volumen por Envío" subtitle="Aperturas y clics únicos por email de la secuencia">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={volData} margin={{ left: 0, right: 8, top: 6, bottom: 4 }}>
            <CartesianGrid vertical={false} stroke={CU.border2} />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: CU.grey }} interval={0} angle={-18} textAnchor="end" height={48} />
            <YAxis tick={{ fontSize: 10, fill: CU.grey }} />
            <Tooltip {...CHART_TOOLTIP} cursor={{ fill: 'rgba(62,178,237,.06)' }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Bar dataKey="Aperturas" radius={[4, 4, 0, 0]} maxBarSize={30}>
              {volData.map((_, i) => (
                <Cell key={i} fill={PAL[i % PAL.length]} />
              ))}
            </Bar>
            <Bar dataKey="Clics" fill={CU.dblue} radius={[4, 4, 0, 0]} maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
