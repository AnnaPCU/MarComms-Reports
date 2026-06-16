import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
} from 'recharts';
import { CMP_DATA, TOP_ENG_POSTS } from '@/services/socialService';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ChartCard } from '@/components/shared/ChartCard';
import { PAL, CU } from '@/constants/brand';
import { num } from '@/utils/format';

const tooltipStyle = {
  backgroundColor: CU.dblue,
  border: 'none',
  borderRadius: 6,
  color: '#fff',
  fontSize: 11,
};

function effectiveness(d) {
  return {
    ...d,
    ctr: d.imp > 0 ? (d.clk / d.imp) * 100 : 0,
    cpf: d.fol > 0 ? d.clk / d.fol : 0,
    visTasa: d.imp > 0 ? (d.vis / d.imp) * 1000 : 0,
  };
}

function normalise(vals) {
  const max = Math.max(...vals.filter((v) => isFinite(v) && v > 0));
  return max > 0 ? vals.map((v) => Math.round((v / max) * 100)) : vals.map(() => 0);
}

export function ComparativeView() {
  const ranked = useMemo(() => {
    const data = CMP_DATA.map(effectiveness);
    const erN = normalise(data.map((d) => d.er));
    const ctrN = normalise(data.map((d) => d.ctr));
    const cpfN = normalise(data.map((d) => d.cpf));
    const visN = normalise(data.map((d) => d.visTasa));
    data.forEach((d, i) => {
      d.erN = erN[i];
      d.ctrN = ctrN[i];
      d.cpfN = cpfN[i];
      d.visN = visN[i];
      d.score = Math.round(erN[i] * 0.4 + ctrN[i] * 0.3 + cpfN[i] * 0.2 + visN[i] * 0.1);
    });
    return [...data].sort((a, b) => b.score - a.score);
  }, []);

  const radarData = useMemo(() => {
    const dims = [
      { key: 'erN', label: 'Engagement Rate' },
      { key: 'ctrN', label: 'CTR' },
      { key: 'cpfN', label: 'Clics/Seguidor' },
      { key: 'visN', label: 'Visitas/Imp.' },
      { key: 'score', label: 'Score Global' },
    ];
    const top = ranked.slice(0, 6);
    return dims.map((dim) => {
      const row = { dim: dim.label };
      top.forEach((d) => {
        row[d.name] = d[dim.key];
      });
      return row;
    });
  }, [ranked]);

  const top6 = ranked.slice(0, 6);

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Comparativa Multi-Cuenta — Efectividad · Mayo 2026"
        note="Efectividad relativa · no alcance absoluto · datos reales"
      />

      <div className="mb-4 rounded-cu border border-cu-border border-l-4 border-l-cu-cyan bg-white px-4 py-3.5 text-[12.5px] leading-relaxed text-cu-dgrey shadow-cu">
        Esta vista compara las 9 cuentas por <strong className="text-cu-dblue">efectividad</strong>,
        no por volumen. Las métricas de alcance absoluto siempre favorecen a las cuentas más
        grandes. Aquí se mide qué tan bien trabaja cada cuenta con la audiencia que tiene.
      </div>

      {/* Ranking */}
      <div className="mb-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {ranked.map((d, i) => {
          const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
          const top = i === 0;
          return (
            <div
              key={d.id}
              className={`relative overflow-hidden rounded-cu border bg-white p-4 shadow-cu ${
                i < 3 ? 'border-t-[3px] border-t-cu-cyan' : 'border-cu-border'
              }`}
            >
              <span
                className={`absolute right-3 top-2.5 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                  top ? 'bg-cu-cyan/10 text-cu-cyan' : 'bg-cu-bg text-cu-grey'
                }`}
              >
                {medal}
              </span>
              <div className="mb-2.5 mr-10 text-[11px] font-bold leading-tight text-cu-dblue">
                {d.name}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <Metric label="Eng. Rate" value={`${d.er.toFixed(1)}%`} />
                <Metric label="CTR" value={`${d.ctr.toFixed(2)}%`} />
                <Metric label="Clics/Seguidor" value={d.fol > 0 ? d.cpf.toFixed(1) : 'N/D'} />
                <Metric label="Visitas/1K imp." value={d.visTasa.toFixed(1)} />
              </div>
              <div className="mt-2.5 flex items-center gap-2 border-t border-cu-border2 pt-2.5">
                <span className="text-[9px] uppercase tracking-[0.4px] text-cu-grey">Score</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cu-bg">
                  <div className="h-full rounded-full bg-cu-cyan" style={{ width: `${d.score}%` }} />
                </div>
                <span className="whitespace-nowrap text-[10px] font-bold text-cu-cyan">
                  {d.score}/100
                </span>
              </div>
              {d.id === 'cup' && (
                <div className="mt-1.5 text-[9px] italic text-[#a02020]">
                  ⚠ Datos de mayo muy bajos — posible problema en export
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <ChartCard title="Engagement Rate por Cuenta" subtitle="% promedio mayo 2026 — mayor es mejor">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ranked} layout="vertical" margin={{ left: 10, right: 16 }}>
              <CartesianGrid horizontal={false} stroke={CU.border2} />
              <XAxis type="number" tick={{ fontSize: 10, fill: CU.grey }} unit="%" />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 9, fill: CU.dgrey }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v.toFixed(1)}%`, 'ER']} cursor={{ fill: 'rgba(62,178,237,.06)' }} />
              <Bar dataKey="er" fill={CU.cyan} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="CTR — Clics / Impresiones" subtitle="Efectividad de llamada a la acción por cuenta">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ranked} layout="vertical" margin={{ left: 10, right: 16 }}>
              <CartesianGrid horizontal={false} stroke={CU.border2} />
              <XAxis type="number" tick={{ fontSize: 10, fill: CU.grey }} unit="%" />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 9, fill: CU.dgrey }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v.toFixed(2)}%`, 'CTR']} cursor={{ fill: 'rgba(27,30,66,.06)' }} />
              <Bar dataKey="ctr" fill={CU.dblue} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Radar */}
      <ChartCard
        title="Radar de Efectividad — Top 6 Cuentas"
        subtitle="ER · CTR · Clics/Seguidor · Visitas/Impresión · Score Global"
        className="mb-5 [&>div:last-child]:h-[340px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} outerRadius="70%">
            <PolarGrid stroke={CU.border2} />
            <PolarAngleAxis dataKey="dim" tick={{ fontSize: 10, fill: CU.dgrey }} />
            {top6.map((d, i) => (
              <Radar
                key={d.id}
                name={d.name}
                dataKey={d.name}
                stroke={PAL[i % PAL.length]}
                fill={PAL[i % PAL.length]}
                fillOpacity={0.08}
                strokeWidth={1.5}
              />
            ))}
            <Legend wrapperStyle={{ fontSize: 10, color: CU.dgrey }} />
            <Tooltip contentStyle={tooltipStyle} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Top posts */}
      <SectionHeader
        title="Top 10 Posts por Engagement Rate — Todas las Cuentas"
        note="Datos reales mayo 2026 · 9 cuentas"
      />
      <div className="overflow-x-auto rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
        <table className="w-full min-w-[680px] border-collapse">
          <thead>
            <tr>
              {['#', 'Publicación', 'Cuenta', 'Impresiones', 'Eng. Rate', 'Clics', 'Reac.', 'Com.'].map(
                (h) => (
                  <th key={h} className="border-b-2 border-cu-cyan px-3 py-2 text-left text-[9px] font-bold uppercase tracking-[0.5px] text-cu-grey">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {TOP_ENG_POSTS.map((p) => (
              <tr key={p.rank} className="border-b border-cu-border2 transition-colors hover:bg-cu-cyan/[0.03]">
                <td className="px-3 py-2.5 text-[10px] font-bold text-cu-grey">{p.rank}</td>
                <td className="px-3 py-2.5">
                  <a href={p.url} target="_blank" rel="noopener noreferrer" title={p.t} className="block max-w-[340px] truncate font-medium text-cu-dblue hover:text-cu-cyan">
                    {p.t}
                  </a>
                </td>
                <td className="px-3 py-2.5 text-[10px] text-cu-grey">{p.acc}</td>
                <td className="px-3 py-2.5 text-[12px] font-medium text-cu-dblue">{num(p.imp)}</td>
                <td className="px-3 py-2.5 text-[12px] font-medium text-cu-dblue">{p.er.toFixed(1)}%</td>
                <td className="px-3 py-2.5 text-[12px] font-medium text-cu-dblue">{num(p.clk)}</td>
                <td className="px-3 py-2.5 text-[12px] font-medium text-cu-dblue">{p.reac}</td>
                <td className="px-3 py-2.5 text-[12px] font-medium text-cu-dblue">{p.com}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-sm bg-cu-bg px-2.5 py-1.5">
      <div className="mb-0.5 text-[9px] font-medium uppercase tracking-[0.4px] text-cu-grey">
        {label}
      </div>
      <div className="text-[16px] font-bold tracking-tight text-cu-dblue">{value}</div>
    </div>
  );
}
