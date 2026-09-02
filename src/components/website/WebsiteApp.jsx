import { useState } from 'react';
import { initialLang } from '@/utils/reportLang';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { getQuarter, getHandle, listAccounts } from '@/services/websiteService';
import { QUARTERS_2026 } from '@/constants/periods';
import { hasData } from '@/utils/hasData';
import { num } from '@/utils/format';
import { CU, PAL, CHART_TOOLTIP } from '@/constants/brand';
import {
  genSiteInsights,
  genSiteConclusions,
  genSiteNextSteps,
  genSeoInsights,
  genSeoConclusions,
  genSeoNextSteps,
} from '@/utils/websiteInsights';
import { WEB_STR } from '@/utils/websiteI18n';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { KpiCard } from '@/components/shared/KpiCard';
import { ChartCard } from '@/components/shared/ChartCard';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { Glossary } from '@/components/shared/Glossary';
import { Funnel } from '@/components/shared/Funnel';
import { InsightsPanel } from '@/components/shared/InsightsPanel';
import { ConclusionsPanel, NextStepsPanel } from '@/components/shared/PerformancePanels';
import { isExternalReport } from '@/utils/reportAudience';
import { WebsiteAnnualReview } from '@/components/website/WebsiteAnnualReview';
import { WebsiteComparative } from '@/components/website/WebsiteComparative';

const pctL = (v, lang) =>
  Number(v || 0).toLocaleString(lang === 'en' ? 'en-US' : 'es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';

const FunnelCard = ({ children }) => (
  <div className="mb-5 rounded-cu border border-cu-border bg-white px-7 pb-6 pt-6 shadow-cu">
    <div className="mx-auto max-w-[640px]">{children}</div>
  </div>
);

// Pilar Website — trimestral, con dos sub-reportes: Website (GA) y SEO (GSC).
// Idioma base español; toggle EN disponible (también en el descargable).
export function WebsiteApp({ account, period }) {
  const [tab, setTab] = useState('site');
  const [lang, setLang] = useState(() => initialLang('es'));
  const t9 = WEB_STR[lang];

  const langToggle = (
    <SegmentedControl
      value={lang}
      onChange={setLang}
      size="sm"
      options={[
        { id: 'es', label: 'ES' },
        { id: 'en', label: 'EN' },
      ]}
    />
  );

  // Resumen anual (acumulado de trimestres) y comparativa multi-cuenta.
  if (period === 'year-2026')
    return (
      <>
        <div className="mb-4 flex justify-end">{langToggle}</div>
        <WebsiteAnnualReview account={account} lang={lang} />
      </>
    );
  if (period === 'cmp')
    return (
      <>
        <div className="mb-4 flex justify-end">{langToggle}</div>
        <WebsiteComparative lang={lang} />
      </>
    );
  const data = getQuarter(account, period);
  const accName = listAccounts().find((a) => a.id === account)?.name ?? '';
  const periodLabel = QUARTERS_2026.find((p) => p.id === period)?.label ?? period;
  const handle = getHandle(account);

  return (
    <div className="animate-fade-in">
      {/* Sub-tabs Website / SEO */}
      <div className="mb-4 flex gap-1.5">
        {[
          { id: 'site', label: 'Website' },
          { id: 'seo', label: 'SEO' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-sm px-4 py-1.5 text-[12px] font-bold transition-colors ${
              tab === t.id ? 'bg-cu-cyan text-white' : 'border border-cu-border bg-white text-cu-grey hover:text-cu-dgrey'
            }`}
          >
            {t.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3">
          {handle && <span className="text-[11px] font-medium text-cu-cyan">{handle}</span>}
          {langToggle}
        </div>
      </div>

      {tab === 'site' ? (
        <SiteView data={data?.site} accName={accName} periodLabel={periodLabel} lang={lang} />
      ) : (
        <SeoView data={data?.seo} accName={accName} periodLabel={periodLabel} lang={lang} />
      )}

      <Glossary keys={tab === 'site' ? t9.glossarySite : t9.glossarySeo} />
    </div>
  );
}

// ── Sub-vista Website (Google Analytics) ──
function SiteView({ data, accName, periodLabel, lang = 'es' }) {
  const t = WEB_STR[lang];
  const pctv = (v) => pctL(v, lang);
  if (!hasData([data].filter(Boolean))) {
    return (
      <NoDataScreen
        detail={
          <>
            No hay datos de tráfico importados de <strong>{accName}</strong> para <strong>{periodLabel}</strong>.
          </>
        }
      />
    );
  }
  const kpiChart = [
    { name: 'Single Traffic', value: data.singleTraffic, fill: PAL[3] },
    { name: 'Total Traffic', value: data.totalTraffic, fill: PAL[0] },
    { name: 'Impressions', value: data.impressions, fill: PAL[1] },
    { name: 'Conversions', value: data.conversions, fill: PAL[5] },
  ];
  const retSes = data.impressions ? (data.totalTraffic / data.impressions) * 100 : 0;
  const retConv = data.totalTraffic ? (data.conversions / data.totalTraffic) * 100 : 0;

  return (
    <>
      <InsightsPanel title={t.siteInsightsTitle} label={t.insightLabel} actionLabel={t.actionLabel} emptyText={t.emptyInsights} subtitle={`${accName} · ${periodLabel}`} items={genSiteInsights(data, lang)} />

      <SectionHeader title={`Website — ${periodLabel}`} note={accName} />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Single Traffic" value={num(data.singleTraffic)} />
        <KpiCard label="Total Traffic" value={num(data.totalTraffic)} />
        <KpiCard label="Impressions" value={num(data.impressions)} />
        <KpiCard label="Conversions" value={num(data.conversions)} accent="green" />
      </div>

      <SectionHeader title={t.siteFunnelSection} note="Google Analytics" />
      <FunnelCard>
        <Funnel
          stages={[
            { name: t.fViews, value: num(data.impressions), desc: t.fViewsDesc(num(data.impressions)), retention: '100 %' },
            {
              name: t.fSessions,
              value: num(data.totalTraffic),
              desc: t.fSessionsDesc(num(data.singleTraffic)),
              retention: pctv(retSes),
              drop: (
                <>
                  <b className="font-bold text-cu-cyan">{pctv(retSes)}</b>&nbsp;· {t.fSesDropNote}
                </>
              ),
            },
            {
              name: t.fConv,
              value: num(data.conversions),
              desc: t.fConvDesc(pctv(retConv)),
              retention: pctv(retConv),
              gradient: 'linear-gradient(135deg,#247a44,#3fb86a)',
              drop: (
                <>
                  <b className="font-bold text-cu-cyan">{pctv(retConv)}</b>&nbsp;· {t.fConvDropNote}
                </>
              ),
            },
          ]}
        />
      </FunnelCard>

      <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
          <div className="mb-3.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
            <span className="h-3 w-[3px] rounded-sm bg-cu-cyan" />
            {t.topPagesTitle}
          </div>
          <ul className="space-y-3">
            {data.topLandingPages.map((p) => (
              <li key={p.url} className="flex items-center justify-between gap-3">
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="truncate text-[12px] font-medium text-cu-cyan hover:underline">
                  {p.url}
                </a>
                <span className="shrink-0 text-[15px] font-bold text-cu-dblue">{num(p.views)}</span>
              </li>
            ))}
          </ul>
        </div>

        <ChartCard title={t.kpisChartTitle} subtitle={t.siteKpisChartSub}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={kpiChart} margin={{ left: 0, right: 8, top: 4 }}>
              <CartesianGrid vertical={false} stroke={CU.border2} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: CU.grey }} />
              <YAxis tick={{ fontSize: 10, fill: CU.grey }} />
              <Tooltip {...CHART_TOOLTIP} formatter={(v) => num(v)} cursor={{ fill: 'rgba(62,178,237,.06)' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {kpiChart.map((e, i) => (
                  <Cell key={i} fill={e.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <SectionHeader title={t.perfSection} />
      <ConclusionsPanel items={genSiteConclusions(data, lang)} title={t.conclusionsTitle} />

      {!isExternalReport() && (
        <>
          <SectionHeader title={t.nextSection} />
          <NextStepsPanel steps={genSiteNextSteps(data, lang)} subtitle={`${accName} · ${periodLabel}`} title={t.nextTitle} />
        </>
      )}
    </>
  );
}

// ── Sub-vista SEO (Search Console) ──
function SeoView({ data, accName, periodLabel, lang = 'es' }) {
  const t = WEB_STR[lang];
  const pctv = (v) => pctL(v, lang);
  if (!hasData([data].filter(Boolean))) {
    return (
      <NoDataScreen
        detail={
          <>
            No hay datos de SEO importados de <strong>{accName}</strong> para <strong>{periodLabel}</strong>.
          </>
        }
      />
    );
  }
  const kpiChart = [
    { name: 'Avg. Position', value: data.averagePosition, fill: PAL[3] },
    { name: 'Impressions', value: data.impressions, fill: PAL[0] },
    { name: 'Total Clicks', value: data.totalClicks, fill: PAL[1] },
  ];
  const ctr = data.impressions ? (data.totalClicks / data.impressions) * 100 : 0;

  return (
    <>
      <InsightsPanel title={t.seoInsightsTitle} label={t.insightLabel} actionLabel={t.actionLabel} emptyText={t.emptyInsights} subtitle={`${accName} · ${periodLabel}`} items={genSeoInsights(data, lang)} />

      <SectionHeader title={`SEO — ${periodLabel}`} note={accName} />
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Average Position" value={data.averagePosition.toFixed(2)} />
        <KpiCard label="Impressions" value={num(data.impressions)} />
        <KpiCard label="Total Clicks" value={num(data.totalClicks)} />
      </div>

      <SectionHeader title={t.seoFunnelSection} note="Search Console" />
      <FunnelCard>
        <Funnel
          stages={[
            { name: t.fImp, value: num(data.impressions), desc: t.fImpDesc(data.averagePosition.toFixed(2)), retention: '100 %' },
            {
              name: t.fClk,
              value: num(data.totalClicks),
              desc: `CTR ${pctv(ctr)}`,
              retention: pctv(ctr),
              drop: (
                <>
                  CTR&nbsp;<b className="font-bold text-cu-cyan">{pctv(ctr)}</b>&nbsp;· {t.fClkDropNote}
                </>
              ),
            },
          ]}
        />
      </FunnelCard>

      <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
          <div className="mb-3.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
            <span className="h-3 w-[3px] rounded-sm bg-cu-cyan" />
            {t.topKeywordsTitle}
          </div>
          <ul className="space-y-3">
            {data.topKeywords.map((k) => (
              <li key={k.query} className="flex items-center justify-between gap-3">
                <span className="truncate text-[12px] font-medium text-cu-dgrey">{k.query}</span>
                <span className="shrink-0 text-[15px] font-bold text-cu-dblue">{num(k.clicks)}</span>
              </li>
            ))}
          </ul>
        </div>

        <ChartCard title={t.kpisChartTitle} subtitle={t.seoKpisChartSub}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={kpiChart} margin={{ left: 0, right: 8, top: 4 }}>
              <CartesianGrid vertical={false} stroke={CU.border2} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: CU.grey }} />
              <YAxis tick={{ fontSize: 10, fill: CU.grey }} />
              <Tooltip {...CHART_TOOLTIP} formatter={(v) => num(v)} cursor={{ fill: 'rgba(62,178,237,.06)' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {kpiChart.map((e, i) => (
                  <Cell key={i} fill={e.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <SectionHeader title={t.perfSection} />
      <ConclusionsPanel items={genSeoConclusions(data, lang)} title={t.conclusionsTitle} />

      {!isExternalReport() && (
        <>
          <SectionHeader title={t.nextSection} />
          <NextStepsPanel steps={genSeoNextSteps(data, lang)} subtitle={`${accName} · ${periodLabel}`} title={t.nextTitle} />
        </>
      )}
    </>
  );
}
