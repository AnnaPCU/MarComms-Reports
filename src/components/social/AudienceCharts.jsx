import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ChartCard } from '@/components/shared/ChartCard';
import { PAL, CU, CHART_TOOLTIP } from '@/constants/brand';

export function AudienceCharts({ audience }) {
  const { seniority, jobFunction } = audience;
  return (
    <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
      <ChartCard
        title="Nivel de Responsabilidad"
        subtitle="Total seguidores de la cuenta — datos reales"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={seniority}
              dataKey="v"
              nameKey="l"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={1}
              stroke="#fff"
              strokeWidth={2}
            >
              {seniority.map((_, i) => (
                <Cell key={i} fill={PAL[i % PAL.length]} />
              ))}
            </Pie>
            <Tooltip
              {...CHART_TOOLTIP}
              formatter={(v, n) => [v.toLocaleString('es-AR'), n]}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{ fontSize: 10, color: CU.dgrey }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Función Laboral"
        subtitle="Top 8 funciones de la audiencia — datos reales"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={jobFunction}
            layout="vertical"
            margin={{ left: 10, right: 16, top: 4, bottom: 4 }}
          >
            <CartesianGrid horizontal={false} stroke={CU.border2} />
            <XAxis type="number" tick={{ fontSize: 10, fill: CU.grey }} />
            <YAxis
              type="category"
              dataKey="l"
              width={120}
              tick={{ fontSize: 10, fill: CU.dgrey }}
            />
            <Tooltip
              {...CHART_TOOLTIP}
              cursor={{ fill: 'rgba(62,178,237,.06)' }}
              formatter={(v) => [v.toLocaleString('es-AR'), 'Seguidores']}
            />
            <Bar dataKey="v" fill="rgba(62,178,237,.72)" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
