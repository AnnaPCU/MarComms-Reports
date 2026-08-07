import { useMemo } from 'react';
import { Users, Eye } from 'lucide-react';
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
import {
  getSegConfig,
  getSegCountryYearSeries,
  getSegFolBase,
} from '@/services/socialService';
import { genCountryYearInsights } from '@/utils/socialInsights';
import { fmt, num } from '@/utils/format';
import { CU, CHART_TOOLTIP } from '@/constants/brand';
import { InsightsPanel } from '@/components/shared/InsightsPanel';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { ChartCard } from '@/components/shared/ChartCard';
import { BrandIcon } from '@/components/shared/BrandIcon';
import { PostsTable } from '@/components/social/PostsTable';
import { Glossary } from '@/components/shared/Glossary';

// ════════════════════════════════════════════════════════════════
//  Resumen del Año POR PAÍS de una cuenta LinkedIn segmentada
//  (CU Latinoamérica, CU North America) — misma metodología que la vista
//  mensual por país (posts por hashtag + Ubicación del export): acumula
//  los meses cargados y muestra la evolución mes a mes.
// ════════════════════════════════════════════════════════════════
export function CountryYearView({ account, country }) {
  const cfg = getSegConfig(account);
  const cInfo = cfg?.countries.find((c) => c.id === country);
  const name = cInfo?.name ?? country;
  const series = useMemo(() => getSegCountryYearSeries(account, country), [account, country]);
  const folBase = useMemo(() => getSegFolBase(account, country), [account, country]);

  const agg = useMemo(() => {
    const withData = series.filter((s) => s.d && s.d.np > 0);
    const imp = withData.reduce((a, s) => a + s.d.imp, 0);
    const clk = withData.reduce((a, s) => a + s.d.clk, 0);
    const np = withData.reduce((a, s) => a + s.d.np, 0);
    const vis = series.reduce((a, s) => a + (s.d?.vis || 0), 0);
    // ER anual ponderado por impresiones (a partir del ER mensual del país).
    const er = imp ? withData.reduce((a, s) => a + s.d.er * s.d.imp, 0) / imp : 0;
    // Top del año: los mejores posts de cada mes, dedupe por URL, por impresiones.
    const seen = new Set();
    const posts = withData
      .flatMap((s) => s.d.posts)
      .filter((p) => (p.url && seen.has(p.url) ? false : (seen.add(p.url), true)))
      .sort((a, b) => b.imp - a.imp)
      .slice(0, 5);
    const empty = series.filter((s) => s.tot && (!s.d || s.d.np === 0)).map((s) => s.short);
    return { withData, imp, clk, np, vis, er, posts, empty };
  }, [series]);

  if (!agg.withData.length) {
    return (
      <>
        <NoDataScreen
          detail={
            <>
              No hay publicaciones etiquetadas para <strong>{name}</strong> en ningún mes
              cargado de 2026 en la cuenta de {cfg?.label}.
            </>
          }
          hint={<>La atribución por país se hace por hashtag ({cInfo?.tag})</>}
        />
        <Glossary keys="social" />
      </>
    );
  }

  const chartData = series
    .filter((s) => s.tot)
    .map((s) => ({ mes: s.short, Impresiones: s.d?.imp || 0, 'ER %': s.d?.er || 0 }));

  return (
    <div className="animate-fade-in">
      <InsightsPanel
        subtitle={`${cfg.label} · ${name} · Año 2026`}
        title="Progreso del Año — Insights"
        label="Lectura anual"
        items={genCountryYearInsights(agg, series, name)}
      />

      <SectionHeader
        title={`Indicadores del Año — Contenido de ${name}`}
        note={`${agg.withData.length} ${agg.withData.length === 1 ? 'mes' : 'meses'} con publicaciones del país`}
      />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Impresiones acumuladas" value={fmt(agg.imp)} footnote="De las publicaciones del país" />
        <KpiCard label="Engagement Rate promedio" value={agg.er.toFixed(1)} unit="%" footnote="Ponderado por impresiones" />
        <KpiCard label="Clics acumulados" value={fmt(agg.clk)} />
        <KpiCard
          label="Publicaciones"
          value={agg.np}
          footnote={`~${Math.round(agg.np / agg.withData.length)} por mes con actividad`}
        />
      </div>

      <SectionHeader title={`Evolución mes a mes — ${name}`} note="LinkedIn Orgánico" />
      <ChartCard
        title="Alcance vs. Engagement"
        subtitle={`Impresiones (barras) y ER % (línea) de las publicaciones de ${name} por mes`}
        className="mb-5"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={CU.border2} />
            <XAxis dataKey="mes" tick={{ fontSize: 10, fill: CU.grey }} />
            <YAxis yAxisId="imp" tick={{ fontSize: 10, fill: CU.grey }} width={44} />
            <YAxis yAxisId="er" orientation="right" tick={{ fontSize: 10, fill: CU.grey }} width={36} unit="%" />
            <Tooltip
              {...CHART_TOOLTIP}
              cursor={{ fill: 'rgba(62,178,237,.06)' }}
              formatter={(v, n) => (n === 'ER %' ? [`${Number(v).toFixed(1)}%`, n] : [num(v), n])}
            />
            <Bar yAxisId="imp" dataKey="Impresiones" fill="rgba(62,178,237,.72)" radius={[3, 3, 0, 0]} />
            <Line yAxisId="er" dataKey="ER %" stroke={CU.dblue} strokeWidth={2} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <SectionHeader title={`Top Publicaciones del Año — ${name}`} note="Por impresiones" />
      <PostsTable posts={agg.posts} />

      <SectionHeader title={`Audiencia — ${name}`} note="Por ubicación (LinkedIn)" />
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="relative overflow-hidden rounded-cu border border-cu-border bg-white px-5 pb-3.5 pt-4 shadow-cu">
          <span className="absolute inset-y-0 left-0 w-[3px] bg-cu-cyan" />
          <div className="mb-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.6px] text-cu-grey">
            <BrandIcon icon={Eye} tone="accent" size="sm" />
            Visualizaciones de página desde {name} en el año
          </div>
          <div className="mb-2 text-[30px] font-bold leading-none tracking-tight text-cu-dblue">
            {num(agg.vis)}
          </div>
          <div className="mt-1.5 text-[9px] italic leading-tight text-cu-grey">
            Suma de los meses cargados — visualizaciones por ubicación, no visitantes únicos
          </div>
        </div>
        <div className="relative overflow-hidden rounded-cu border border-cu-border bg-white px-5 pb-3.5 pt-4 shadow-cu">
          <span className="absolute inset-y-0 left-0 w-[3px] bg-cu-cyan" />
          <div className="mb-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.6px] text-cu-grey">
            <BrandIcon icon={Users} tone="accent" size="sm" />
            Seguidores de la cuenta en {name}
          </div>
          <div className="mb-2 text-[30px] font-bold leading-none tracking-tight text-cu-dblue">
            {num(folBase)}
          </div>
          <div className="mt-1.5 text-[9px] italic leading-tight text-cu-grey">
            Foto acumulada del último export de LinkedIn — no es un dato del mes
          </div>
        </div>
      </div>

      <div className="mb-5 rounded-cu border border-cu-border border-l-4 border-l-cu-cyan bg-cu-cyan/[0.05] px-5 py-3.5 text-[11.5px] leading-relaxed text-cu-dgrey">
        <strong className="text-cu-dblue">Cómo se arma este resumen por país:</strong>{' '}
        acumula mes a mes las publicaciones atribuidas a {name} por hashtag ({cInfo?.tag})
        o mención de país (métricas al momento del export de cada mes)
        {agg.empty.length ? (
          <>
            . Meses sin publicaciones etiquetadas para {name}: {agg.empty.join(', ')}
          </>
        ) : null}
        . LinkedIn no segmenta por país los seguidores nuevos ni los visitantes únicos,
        por eso esos indicadores solo existen a nivel {cfg.label}.
      </div>

      <Glossary keys="social" />
    </div>
  );
}
