import { useState } from 'react';
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
import { CU, PAL } from '@/constants/brand';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { ChartCard } from '@/components/shared/ChartCard';
import { AnalysisCard } from '@/components/shared/AnalysisCard';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { Glossary } from '@/components/shared/Glossary';

const tooltipStyle = {
  backgroundColor: CU.dblue,
  border: 'none',
  borderRadius: 6,
  color: '#fff',
  fontSize: 11,
};

// Pilar Website — trimestral, con dos sub-reportes: Website (GA) y SEO (GSC).
export function WebsiteApp({ account, period }) {
  const [tab, setTab] = useState('site');
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
              tab === t.id
                ? 'bg-cu-cyan text-white'
                : 'border border-cu-border bg-white text-cu-grey hover:text-cu-dgrey'
            }`}
          >
            {t.label}
          </button>
        ))}
        {handle && (
          <span className="ml-auto self-center text-[11px] font-medium text-cu-cyan">
            {handle}
          </span>
        )}
      </div>

      {tab === 'site' ? (
        <SiteView data={data?.site} accName={accName} periodLabel={periodLabel} />
      ) : (
        <SeoView data={data?.seo} accName={accName} periodLabel={periodLabel} />
      )}

      <Glossary keys={tab === 'site' ? 'website' : 'websiteSeo'} />
    </div>
  );
}

// ── Sub-vista Website (Google Analytics) ──
function SiteView({ data, accName, periodLabel }) {
  if (!hasData([data].filter(Boolean))) {
    return (
      <NoDataScreen
        detail={
          <>
            No hay datos de tráfico importados de <strong>{accName}</strong> para{' '}
            <strong>{periodLabel}</strong>.
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
  return (
    <>
      <SectionHeader title={`Website — ${periodLabel}`} note={accName} />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Single Traffic" value={num(data.singleTraffic)} />
        <KpiCard label="Total Traffic" value={num(data.totalTraffic)} />
        <KpiCard label="Impressions" value={num(data.impressions)} />
        <KpiCard label="Conversions" value={num(data.conversions)} />
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
          <div className="mb-3.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
            <span className="h-3 w-[3px] rounded-sm bg-cu-cyan" />
            Top 3 landing pages — vistas
          </div>
          <ul className="space-y-3">
            {data.topLandingPages.map((p) => (
              <li key={p.url} className="flex items-center justify-between gap-3">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-[12px] font-medium text-cu-cyan hover:underline"
                >
                  {p.url}
                </a>
                <span className="shrink-0 text-[15px] font-bold text-cu-dblue">{num(p.views)}</span>
              </li>
            ))}
          </ul>
        </div>

        <ChartCard title="Generals KPIs" subtitle="Comparativa de indicadores del trimestre">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={kpiChart} margin={{ left: 0, right: 8, top: 4 }}>
              <CartesianGrid vertical={false} stroke={CU.border2} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: CU.grey }} />
              <YAxis tick={{ fontSize: 10, fill: CU.grey }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => num(v)} cursor={{ fill: 'rgba(62,178,237,.06)' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {kpiChart.map((e, i) => (
                  <Cell key={i} fill={e.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <AnalysisCard>{data.analysis}</AnalysisCard>
    </>
  );
}

// ── Sub-vista SEO (Search Console) ──
function SeoView({ data, accName, periodLabel }) {
  if (!hasData([data].filter(Boolean))) {
    return (
      <NoDataScreen
        detail={
          <>
            No hay datos de SEO importados de <strong>{accName}</strong> para{' '}
            <strong>{periodLabel}</strong>.
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
  return (
    <>
      <SectionHeader title={`SEO — ${periodLabel}`} note={accName} />
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Average Position" value={data.averagePosition.toFixed(2)} />
        <KpiCard label="Impressions" value={num(data.impressions)} />
        <KpiCard label="Total Clicks" value={num(data.totalClicks)} />
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
          <div className="mb-3.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
            <span className="h-3 w-[3px] rounded-sm bg-cu-cyan" />
            Top 3 keywords — clics
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

        <ChartCard title="Generals KPIs" subtitle="Indicadores SEO del trimestre">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={kpiChart} margin={{ left: 0, right: 8, top: 4 }}>
              <CartesianGrid vertical={false} stroke={CU.border2} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: CU.grey }} />
              <YAxis tick={{ fontSize: 10, fill: CU.grey }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => num(v)} cursor={{ fill: 'rgba(62,178,237,.06)' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {kpiChart.map((e, i) => (
                  <Cell key={i} fill={e.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <AnalysisCard>{data.analysis}</AnalysisCard>
    </>
  );
}
