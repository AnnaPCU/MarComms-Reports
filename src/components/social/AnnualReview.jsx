import { useMemo, useState, useEffect } from 'react';
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
import { CU, CHART_TOOLTIP, brandOf } from '@/constants/brand';
import { ChartCard } from '@/components/shared/ChartCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { Select } from '@/components/shared/Select';
import { InsightsPanel } from '@/components/shared/InsightsPanel';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { ConclusionsPanel, NextStepsPanel } from '@/components/shared/PerformancePanels';
import { PostsTable } from '@/components/social/PostsTable';
import { Glossary } from '@/components/shared/Glossary';
import { isExternalReport } from '@/utils/reportAudience';
import { useSocialYear } from '@/hooks/useSocialYear';
import { computeDelta } from '@/utils/format';
import { ANNUAL_STR, ML_EN } from '@/utils/annualI18n';
import {
  yearAggregates,
  yearChartData,
  genYearInsights,
  genYearConclusions,
  genYearNextSteps,
} from '@/utils/socialYearInsights';

const numEs = (v) => Number(v || 0).toLocaleString('es-AR');
const pct1 = (v) => Number(v || 0).toFixed(1) + '%';
const YEAR = 'year';

// Banner de progreso: variación de ER entre el primer y el último mes con datos.
function ProgressHero({ agg, t }) {
  if (agg.monthsCount < 2) return null;
  const up = agg.erDelta >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <div className="mb-5 flex flex-wrap items-center gap-5 rounded-cu border border-cu-border bg-gradient-to-r from-cu-dblue to-[#2d3a8a] px-6 py-5 shadow-cu">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${up ? 'bg-[#3fb86a]/20' : 'bg-[#e0703c]/20'}`}>
        <Icon className={`h-6 w-6 ${up ? 'text-[#7ef0a6]' : 'text-[#ffb38a]'}`} />
      </div>
      <div className="min-w-[180px]">
        <div className="text-[10px] font-bold uppercase tracking-[0.6px] text-white/55">{t.heroLabel}</div>
        <div className="text-[22px] font-bold leading-tight text-white">
          {pct1(agg.first.mo.er)} <span className="text-white/50">→</span> {pct1(agg.last.mo.er)}
        </div>
        <div className="text-[11px] text-white/70">
          {agg.first.short} → {agg.last.short} · {up ? '+' : ''}{agg.erDelta.toFixed(1)} {t.pts}
        </div>
      </div>
      <div className="ml-auto grid grid-cols-2 gap-x-8 gap-y-1 text-white sm:grid-cols-3">
        <div>
          <div className="text-[9px] font-bold uppercase tracking-[0.5px] text-white/55">{t.heroReach}</div>
          <div className="text-[16px] font-bold">{numEs(agg.totalImp)}</div>
        </div>
        <div>
          <div className="text-[9px] font-bold uppercase tracking-[0.5px] text-white/55">{t.heroFol}</div>
          <div className="text-[16px] font-bold">{numEs(agg.totalFol)}</div>
        </div>
        <div>
          <div className="text-[9px] font-bold uppercase tracking-[0.5px] text-white/55">{t.heroMonths}</div>
          <div className="text-[16px] font-bold">{agg.monthsCount}</div>
        </div>
      </div>
    </div>
  );
}

// Toggle ES/EN del reporte (persiste en el HTML descargado — es interactivo).
function LangToggle({ lang, onChange }) {
  return (
    <div className="flex overflow-hidden rounded-sm border border-cu-border">
      {['es', 'en'].map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`px-3 py-[6px] text-[10px] font-bold uppercase tracking-[0.5px] transition-colors ${
            lang === l ? 'bg-cu-dblue text-white' : 'bg-white text-cu-grey hover:text-cu-dblue'
          }`}
        >
          {l === 'es' ? 'ES' : 'EN'}
        </button>
      ))}
    </div>
  );
}

// Vista "Resumen del Año" — progreso mes a mes de una cuenta de LinkedIn.
// Segmentable por mes y bilingüe (cuentas Peterson abren en inglés).
export function AnnualReview({ account }) {
  const { accName, series } = useSocialYear(account);
  const [lang, setLang] = useState(() => (brandOf(account, accName) === 'peterson' ? 'en' : 'es'));
  const [seg, setSeg] = useState(YEAR);
  useEffect(() => {
    setSeg(YEAR);
    setLang(brandOf(account, accName) === 'peterson' ? 'en' : 'es');
  }, [account, accName]);

  const t = ANNUAL_STR[lang];
  const en = lang === 'en';
  // En EN los nombres cortos de mes (usados por hero/insights/balance) se traducen.
  const seriesT = useMemo(
    () =>
      en
        ? series.map((s) => ({ ...s, short: (ML_EN[s.id] || s.label).replace(/\s*20\d\d$/, '') }))
        : series,
    [series, en],
  );
  const agg = useMemo(() => yearAggregates(seriesT), [seriesT]);

  // computeDelta arma el texto en español — se traduce acá para EN.
  const delta = (curr, prev) => {
    const d = computeDelta(curr, prev);
    return en ? { ...d, label: d.label.replace('vs mes ant.', t.vsPrev).replace('— Sin dato previo', '— No previous data') } : d;
  };

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

  const withData = series.filter((s) => s.mo);
  const monthLabel = (s) => (en ? ML_EN[s.id] || s.label : s.label);
  const segOptions = [
    { id: YEAR, label: t.fullYear },
    ...withData.map((s) => ({ id: s.id, label: monthLabel(s) })),
  ];
  const selected = seg === YEAR ? null : withData.find((s) => s.id === seg) ?? null;
  const selPrevIdx = selected ? withData.findIndex((s) => s.id === selected.id) - 1 : -1;
  const selPrev = selPrevIdx >= 0 ? withData[selPrevIdx] : null;

  const chart = yearChartData(seriesT).map((c, i) => ({ ...c, name: seriesT[i].short || c.name }));
  const subtitle = `${accName} · ${t.subtitle}`;

  return (
    <div className="animate-fade-in">
      <div className="mb-1 flex flex-wrap items-end justify-between gap-3">
        <Select label={t.segmentLabel} value={seg} onChange={setSeg} options={segOptions} />
        <LangToggle lang={lang} onChange={setLang} />
      </div>

      <SectionHeader title={t.title} note={accName} />

      <ProgressHero agg={agg} t={t} />

      {agg.monthsCount < 2 && (
        <div className="mb-5 flex items-start gap-2 rounded-cu border border-amber-300 bg-amber-50 px-4 py-3 text-[12px] text-amber-800">
          <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong>{t.singleMonthWarn}</strong> {t.singleMonthWarn2}
          </span>
        </div>
      )}

      <InsightsPanel
        title={t.insightsTitle}
        label={t.insightsLabel}
        subtitle={subtitle}
        items={genYearInsights(agg, lang)}
        actionLabel={en ? 'Recommended action' : 'Acción recomendada'}
        emptyText={en ? 'Not enough information for this period' : 'Sin información suficiente para este período'}
      />

      {selected ? (
        <>
          <SectionHeader title={t.kpiSectionMonth} note={`${accName} · ${monthLabel(selected)}`} />
          <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
            <KpiCard label={t.kImpM} value={numEs(selected.mo.imp)} delta={delta(selected.mo.imp, selPrev?.mo.imp)} />
            <KpiCard label={t.kErM} value={Number(selected.mo.er).toFixed(1)} unit="%" delta={delta(selected.mo.er, selPrev?.mo.er)} />
            <KpiCard label={t.kClkM} value={numEs(selected.mo.clk)} accent="green" delta={delta(selected.mo.clk, selPrev?.mo.clk)} />
            {selected.mo.np != null && (
              <KpiCard label={t.kPosts} value={selected.mo.np} delta={delta(selected.mo.np, selPrev?.mo.np)} footnote={t.kPostsFootMonth} />
            )}
            <KpiCard
              label={t.kVis}
              value={numEs(selected.mo.vis)}
              accent="amber"
              delta={delta(selected.mo.vis, selPrev?.mo.vis)}
              footnote={`+${numEs(selected.mo.fol)} ${en ? 'new followers' : 'seguidores nuevos'}`}
            />
          </div>
        </>
      ) : (
        <>
          <SectionHeader title={t.kpiSection} note={t.monthsWithData(agg.monthsCount)} />
          <div className={`mb-5 grid grid-cols-2 gap-3 ${agg.totalPosts != null ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
            <KpiCard label={t.kImp} value={numEs(agg.totalImp)} />
            <KpiCard label={t.kEr} value={Number(agg.avgER).toFixed(1)} unit="%" footnote={t.kErFoot} />
            <KpiCard label={t.kClk} value={numEs(agg.totalClk)} accent="green" />
            {agg.totalPosts != null && (
              <KpiCard label={t.kPosts} value={numEs(agg.totalPosts)} footnote={t.kPostsFootYear((agg.totalPosts / agg.monthsCount).toFixed(1))} />
            )}
            <KpiCard label={t.kFol} value={numEs(agg.totalFol)} accent="amber" footnote={t.kFolFoot(numEs(agg.totalVis))} />
          </div>
        </>
      )}

      <SectionHeader title={t.evoSection} note={t.evoNote} />
      <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <ChartCard title={t.chReachTitle} subtitle={t.chReachSub}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chart} margin={{ left: 0, right: 8, top: 6, bottom: 4 }}>
              <CartesianGrid vertical={false} stroke={CU.border2} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: CU.grey }} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: CU.grey }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: CU.grey }} unit="%" />
              <Tooltip {...CHART_TOOLTIP} cursor={{ fill: 'rgba(62,178,237,.06)' }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar yAxisId="left" dataKey="Impresiones" name={t.sImp} fill={CU.dblue} radius={[4, 4, 0, 0]} maxBarSize={38} />
              <Line yAxisId="right" dataKey="ER" name={t.sEr} stroke={CU.cyan} strokeWidth={2.5} dot={{ r: 3, fill: CU.cyan }} connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t.chClkTitle} subtitle={t.chClkSub}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chart} margin={{ left: 0, right: 8, top: 6, bottom: 4 }}>
              <CartesianGrid vertical={false} stroke={CU.border2} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: CU.grey }} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: CU.grey }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: CU.grey }} />
              <Tooltip {...CHART_TOOLTIP} cursor={{ fill: 'rgba(62,178,237,.06)' }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar yAxisId="left" dataKey="Clics" name={t.sClk} fill={CU.cyan} radius={[4, 4, 0, 0]} maxBarSize={38} />
              <Area yAxisId="right" dataKey="Seguidores" name={t.sFol} stroke={CU.dblue} fill="rgba(27,30,66,.12)" strokeWidth={2} connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {selected ? (
        <>
          <SectionHeader title={t.topPostsMonth(monthLabel(selected))} note={t.topPostsMonthNote} />
          <PostsTable posts={selected.mo.posts} lang={lang} />
        </>
      ) : (
        <>
          <SectionHeader title={t.topPostsYear} note={t.topPostsYearNote} />
          <PostsTable posts={agg.topPosts} lang={lang} />
        </>
      )}

      <SectionHeader title={t.perfSection} />
      <ConclusionsPanel items={genYearConclusions(agg, lang)} title={t.balanceTitle} />

      {!isExternalReport() && (
        <>
          <SectionHeader title={t.nextSection} />
          <NextStepsPanel steps={genYearNextSteps(agg, lang)} subtitle={subtitle} title={en ? 'Next steps' : 'Próximos pasos'} />
        </>
      )}

      <Glossary keys={en ? 'socialEn' : 'social'} />
    </div>
  );
}
