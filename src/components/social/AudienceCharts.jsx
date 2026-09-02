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
import { SOCIAL_STR } from '@/utils/socialI18n';

export function AudienceCharts({ audience, lang = 'es' }) {
  const { seniority, jobFunction } = audience;
  const t = SOCIAL_STR[lang];
  const locale = lang === 'en' ? 'en-US' : 'es-AR';
  return (
    <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
      <ChartCard title={t.chSenTitle} subtitle={t.chSenSub}>
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
              formatter={(v, n) => [v.toLocaleString(locale), n]}
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

      <ChartCard title={t.chJobTitle} subtitle={t.chJobSub}>
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
              formatter={(v) => [v.toLocaleString(locale), t.followersWord]}
            />
            <Bar dataKey="v" fill="rgba(62,178,237,.72)" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
