import {
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, CalendarClock } from 'lucide-react';
import { CU, CHART_TOOLTIP } from '@/constants/brand';
import { ChartCard } from '@/components/shared/ChartCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { InsightsPanel } from '@/components/shared/InsightsPanel';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { ConclusionsPanel, NextStepsPanel } from '@/components/shared/PerformancePanels';
import { PostsTable } from '@/components/social/PostsTable';
import { Glossary } from '@/components/shared/Glossary';
import { isExternalReport } from '@/utils/reportAudience';
import { useSocialYear } from '@/hooks/useSocialYear';
import {
  yearAggregates,
  yearChartData,
  genYearInsights,
  genYearConclusions,
  genYearNextSteps,
} from '@/utils/socialYearInsights';

const numEs = (v) => Number(v || 0).toLocaleString('es-AR');
const pct1 = (v) => Number(v || 0).toFixed(1) + '%';

// Banner de progreso: variación de ER entre el primer y el último mes con datos.
function ProgressHero({ agg }) {
  if (agg.monthsCount < 2) return null;
  const up = agg.erDelta >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <div className="mb-5 flex flex-wrap items-center gap-5 rounded-cu border border-cu-border bg-gradient-to-r from-cu-dblue to-[#2d3a8a] px-6 py-5 shadow-cu">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${up ? 'bg-[#3fb86a]/20' : 'bg-[#e0703c]/20'}`}>
        <Icon className={`h-6 w-6 ${up ? 'text-[#7ef0a6]' : 'text-[#ffb38a]'}`} />
      </div>
      <div className="min-w-[180px]">
        <div className="text-[10px] font-bold uppercase tracking-[0.6px] text-white/55">Progreso del engagement</div>
        <div className="text-[22px] font-bold leading-tight text-white">
          {pct1(agg.first.mo.er)} <span className="text-white/50">→</span> {pct1(agg.last.mo.er)}
        </div>
        <div className="text-[11px] text-white/70">
          {agg.first.short} a {agg.last.short} · {up ? '+' : ''}{agg.erDelta.toFixed(1)} pts
        </div>
      </div>
      <div className="ml-auto grid grid-cols-2 gap-x-8 gap-y-1 text-white sm:grid-cols-3">
        <div>
          <div className="text-[9px] font-bold uppercase tracking-[0.5px] text-white/55">Alcance total</div>
          <div className="text-[16px] font-bold">{numEs(agg.totalImp)}</div>
        </div>
        <div>
          <div className="text-[9px] font-bold uppercase tracking-[0.5px] text-white/55">Seguidores +</div>
          <div className="text-[16px] font-bold">{numEs(agg.totalFol)}</div>
        </div>
        <div>
          <div className="text-[9px] font-bold uppercase tracking-[0.5px] text-white/55">Meses con datos</div>
          <div className="text-[16px] font-bold">{agg.monthsCount}</div>
        </div>
      </div>
    </div>
  );
}

// Vista "Resumen del Año" — progreso mes a mes de una cuenta de LinkedIn.
export function AnnualReview({ account }) {
  const { accName, series } = useSocialYear(account);
  const agg = yearAggregates(series);

  if (!agg) {
    return (
      <>
        <NoDataScreen
          detail={
            <>
              No hay meses con datos cargados para <strong>{accName || 'esta cuenta'}</strong> en 2026.
              El resumen anual se arma con las métricas mensuales de LinkedIn.
            </>
          }
          hint={<>Cargá al menos un mes para ver el progreso del año</>}
        />
        <Glossary keys="social" />
      </>
    );
  }

  const chart = yearChartData(series);
  const subtitle = `${accName} · Resumen del Año 2026`;

  return (
    <div className="animate-fade-in">
      <SectionHeader title="Resumen del Año — Progreso 2026" note={accName} />

      <ProgressHero agg={agg} />

      {agg.monthsCount < 2 && (
        <div className="mb-5 flex items-start gap-2 rounded-cu border border-amber-300 bg-amber-50 px-4 py-3 text-[12px] text-amber-800">
          <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong>Un solo mes con datos.</strong> El resumen ya está armado, pero la lectura de
            progreso (tendencia) se completa a medida que se cargan más meses del año.
          </span>
        </div>
      )}

      <InsightsPanel
        title="⚡ Progreso del Año — Insights"
        label="Lectura anual"
        subtitle={subtitle}
        items={genYearInsights(agg)}
      />

      <SectionHeader title="Indicadores del Año" note={`${agg.monthsCount} ${agg.monthsCount === 1 ? 'mes' : 'meses'} con datos`} />
      <div className={`mb-5 grid grid-cols-2 gap-3 ${agg.totalPosts != null ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
        <KpiCard label="Impresiones acumuladas" value={numEs(agg.totalImp)} />
        <KpiCard label="Engagement Rate promedio" value={Number(agg.avgER).toFixed(1)} unit="%" footnote="Ponderado por impresiones" />
        <KpiCard label="Clics acumulados" value={numEs(agg.totalClk)} accent="green" />
        {agg.totalPosts != null && (
          <KpiCard
            label="Publicaciones"
            value={numEs(agg.totalPosts)}
            footnote={`~${(agg.totalPosts / agg.monthsCount).toFixed(1)} por mes`}
          />
        )}
        <KpiCard label="Seguidores nuevos" value={numEs(agg.totalFol)} accent="amber" footnote={`${numEs(agg.totalVis)} visitas al perfil`} />
      </div>

      <SectionHeader title="Evolución mes a mes" note="LinkedIn Orgánico" />
      <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <ChartCard title="Alcance vs. Engagement" subtitle="Impresiones (barras) y ER % (línea) por mes">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chart} margin={{ left: 0, right: 8, top: 6, bottom: 4 }}>
              <CartesianGrid vertical={false} stroke={CU.border2} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: CU.grey }} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: CU.grey }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: CU.grey }} unit="%" />
              <Tooltip {...CHART_TOOLTIP} cursor={{ fill: 'rgba(62,178,237,.06)' }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar yAxisId="left" dataKey="Impresiones" fill={CU.dblue} radius={[4, 4, 0, 0]} maxBarSize={38} />
              <Line yAxisId="right" dataKey="ER" name="ER %" stroke={CU.cyan} strokeWidth={2.5} dot={{ r: 3, fill: CU.cyan }} connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Clics y Seguidores" subtitle="Clics (barras) y seguidores nuevos (área) por mes">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chart} margin={{ left: 0, right: 8, top: 6, bottom: 4 }}>
              <CartesianGrid vertical={false} stroke={CU.border2} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: CU.grey }} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: CU.grey }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: CU.grey }} />
              <Tooltip {...CHART_TOOLTIP} cursor={{ fill: 'rgba(62,178,237,.06)' }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar yAxisId="left" dataKey="Clics" fill={CU.cyan} radius={[4, 4, 0, 0]} maxBarSize={38} />
              <Area yAxisId="right" dataKey="Seguidores" stroke={CU.dblue} fill="rgba(27,30,66,.12)" strokeWidth={2} connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <SectionHeader title="Top Publicaciones del Año — por Pilar ESG" note="Las 5 de mayor engagement" />
      <PostsTable posts={agg.topPosts} />

      <SectionHeader title="Lectura de Performance — Balance Anual" />
      <ConclusionsPanel items={genYearConclusions(agg)} title="Balance del año" />

      {!isExternalReport() && (
        <>
          <SectionHeader title="Conclusión — Próximos Pasos" />
          <NextStepsPanel steps={genYearNextSteps(agg)} subtitle={subtitle} />
        </>
      )}

      <Glossary keys="social" />
    </div>
  );
}
