import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
} from 'recharts';
import { CU, PAL, CHART_TOOLTIP } from '@/constants/brand';
import { ChartCard } from '@/components/shared/ChartCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { NextStepsPanel } from '@/components/shared/PerformancePanels';
import { scoreCampaigns } from '@/utils/paidInsights';
import { isExternalReport } from '@/utils/reportAudience';

const numEs = (v) => Number(v || 0).toLocaleString('es-AR');
const pct = (v) =>
  Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';
const money = (v, c) =>
  Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + (c || 'EUR');
const short = (s, n = 14) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

const RANK_BORDER = ['border-t-cu-cyan', 'border-t-[#6dc8f2]', 'border-t-[#9ab5b6]'];

function RankCard({ c, rank, currency, maxScore }) {
  return (
    <div className={`relative overflow-hidden rounded-cu border border-cu-border ${rank < 3 ? 'border-t-[3px] ' + RANK_BORDER[rank] : ''} bg-white px-4 py-3.5 shadow-cu transition-shadow hover:shadow-cu-h`}>
      <span className={`absolute right-3 top-2.5 rounded-[3px] px-1.5 py-0.5 text-[10px] font-bold ${rank === 0 ? 'bg-cu-cyan/10 text-cu-cyan' : 'bg-cu-bg text-cu-grey'}`}>
        #{rank + 1}
      </span>
      <div className="mb-2.5 mr-10 text-[11px] font-bold leading-tight text-cu-dblue">{c.name}</div>
      <div className="grid grid-cols-2 gap-1.5">
        <Metric label="CTR" value={pct(c.ctr)} />
        <Metric label="CPC" value={(c.cpc || 0) > 0 ? money(c.cpc, currency) : '—'} />
        <Metric label="Conv." value={numEs(c.conversions)} />
        <Metric label="Coste" value={money(c.cost, currency)} />
      </div>
      <div className="mt-2.5 flex items-center gap-2 border-t border-cu-border2 pt-2.5">
        <span className="text-[9px] font-medium uppercase tracking-[0.4px] text-cu-grey">Score</span>
        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-cu-bg">
          <span className="block h-full rounded-full bg-cu-cyan" style={{ width: `${maxScore ? (c.score / maxScore) * 100 : 0}%` }} />
        </span>
        <span className="whitespace-nowrap text-[10px] font-bold text-cu-cyan">{c.score}</span>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-sm bg-cu-bg px-2 py-1.5">
      <div className="mb-0.5 text-[9px] font-medium uppercase tracking-[0.4px] text-cu-grey">{label}</div>
      <div className="text-[14px] font-bold tracking-tight text-cu-dblue">{value}</div>
    </div>
  );
}

function BarByCampaign({ title, subtitle, data, unit, currency, color = CU.cyan }) {
  return (
    <ChartCard title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 0, right: 8, top: 6, bottom: 4 }}>
          <CartesianGrid vertical={false} stroke={CU.border2} />
          <XAxis dataKey="name" tick={{ fontSize: 9, fill: CU.grey }} interval={0} angle={-18} textAnchor="end" height={46} />
          <YAxis tick={{ fontSize: 10, fill: CU.grey }} />
          <Tooltip
            {...CHART_TOOLTIP}
            cursor={{ fill: 'rgba(62,178,237,.06)' }}
            formatter={(v) => (unit === 'money' ? money(v, currency) : unit === 'pct' ? pct(v) : numEs(v))}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={34}>
            {data.map((e, i) => (
              <Cell key={i} fill={color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function ComparativeCampaigns({ mo, currency = 'EUR' }) {
  const ranked = scoreCampaigns(mo);
  if (!ranked.length) {
    return (
      <div className="rounded-cu border border-cu-border bg-white px-5 py-8 text-center text-[13px] text-cu-grey shadow-cu">
        No hay campañas con actividad suficiente para comparar en este período.
      </div>
    );
  }
  const maxScore = Math.max(...ranked.map((c) => c.score), 1);

  // Datos para barras (solo con impresiones).
  const withImp = ranked.filter((c) => (c.impressions || 0) > 0);
  const ctrData = withImp.map((c) => ({ name: short(c.name), value: c.ctr || 0 }));
  const cpcData = withImp.filter((c) => (c.cpc || 0) > 0).map((c) => ({ name: short(c.name), value: c.cpc || 0 }));
  const cvrData = withImp.map((c) => ({ name: short(c.name), value: c.convRate || 0 }));
  const cplData = ranked.filter((c) => (c.conversions || 0) > 0).map((c) => ({ name: short(c.name), value: c.costPerConv || 0 }));

  // Radar: top campañas por score, dimensiones normalizadas 0-100.
  const top = ranked.slice(0, Math.min(4, ranked.length));
  const radarAxes = [
    { dim: 'CTR', key: 'ctrN' },
    { dim: 'Tasa conv.', key: 'cvrN' },
    { dim: 'Efic. CPC', key: 'cpcEff' },
    { dim: 'Efic. lead', key: 'cplEff' },
    { dim: 'Score', key: 'score' },
  ];
  const radarData = radarAxes.map((ax) => {
    const row = { dim: ax.dim };
    top.forEach((c, i) => {
      row[`c${i}`] = Math.round(c[ax.key] || 0);
    });
    return row;
  });

  return (
    <div className="animate-fade-in">
      <SectionHeader title="Comparativa de Campañas — Efectividad" note="Campañas con actividad" />
      <div className="mb-4 rounded-cu border border-cu-border border-l-4 border-l-cu-cyan bg-white px-4 py-3.5 text-[12.5px] leading-relaxed text-cu-dgrey shadow-cu">
        Compara las campañas <strong className="text-cu-dblue">con actividad</strong> por efectividad, no por volumen. El{' '}
        <strong className="text-cu-dblue">score</strong> pondera tasa de conversión (45%), CTR (30%) y eficiencia de coste por
        lead (25%). Si en el mes no hubo conversiones, el peso recae en CTR y eficiencia de CPC.
      </div>

      <div className="mb-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {ranked.map((c, i) => (
          <RankCard key={c.name} c={c} rank={i} currency={currency} maxScore={maxScore} />
        ))}
      </div>

      <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <BarByCampaign title="CTR por Campaña" subtitle="% de clics sobre impresiones — mayor es mejor" data={ctrData} unit="pct" />
        <BarByCampaign title="Coste por Clic (CPC medio)" subtitle="EUR por clic — menor es mejor" data={cpcData} unit="money" currency={currency} color={CU.dblue} />
      </div>
      <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <BarByCampaign title="Tasa de Conversión" subtitle="Conversiones sobre clics" data={cvrData} unit="pct" color="#2d8a4e" />
        {cplData.length ? (
          <BarByCampaign title="Coste por Lead" subtitle="EUR por conversión — menor es mejor" data={cplData} unit="money" currency={currency} color="#d4a72c" />
        ) : (
          <ChartCard title="Coste por Lead" subtitle="EUR por conversión — menor es mejor">
            <div className="flex h-full items-center justify-center text-center text-[12px] text-cu-grey">
              Sin conversiones en el período — no hay coste por lead que comparar.
            </div>
          </ChartCard>
        )}
      </div>

      <div className="mb-5 rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
        <div className="mb-0.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
          <span className="h-3 w-[3px] shrink-0 rounded-sm bg-cu-cyan" />
          Radar de Efectividad — Top {top.length} campañas
        </div>
        <div className="mb-3 text-[10px] text-cu-grey">Vista multidimensional (0-100): CTR · Tasa de conversión · Eficiencia de coste · Score</div>
        <div className="relative h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius="72%">
              <PolarGrid stroke={CU.border2} />
              <PolarAngleAxis dataKey="dim" tick={{ fontSize: 10, fill: CU.grey }} />
              {top.map((c, i) => (
                <Radar key={c.name} name={short(c.name, 20)} dataKey={`c${i}`} stroke={PAL[i % PAL.length]} fill={PAL[i % PAL.length]} fillOpacity={0.14} strokeWidth={2} />
              ))}
              <Tooltip {...CHART_TOOLTIP} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {!isExternalReport() && (
        <>
          <SectionHeader title="Conclusión — Próximos Pasos" />
          <NextStepsPanel
            steps={[
              `<strong>Priorizar ${ranked[0].name}</strong>: es la campaña más efectiva del período (score ${ranked[0].score}). Sostener y escalar su presupuesto.`,
              ranked.length > 1
                ? `<strong>Optimizar las de menor score</strong>: revisar anuncios, palabras clave y landing pages de ${ranked[ranked.length - 1].name} y similares.`
                : `<strong>Ampliar la base</strong>: activar más campañas para tener con qué comparar el próximo mes.`,
              `<strong>Comparar mes a mes</strong>: seguir la evolución del score para confirmar si las optimizaciones mejoran la efectividad relativa.`,
            ]}
          />
        </>
      )}
    </div>
  );
}
