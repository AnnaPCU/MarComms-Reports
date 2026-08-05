import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import { CU, PAL, CHART_TOOLTIP } from '@/constants/brand';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ChartCard } from '@/components/shared/ChartCard';
import { KpiCard } from '@/components/shared/KpiCard';
import { NextStepsPanel } from '@/components/shared/PerformancePanels';
import { BrandIcon } from '@/components/shared/BrandIcon';
import { Glossary } from '@/components/shared/Glossary';
import { isExternalReport } from '@/utils/reportAudience';
import { EXEC_STR } from '@/utils/annualI18n';
import { buildExecReview } from '@/utils/execReview';

const numEs = (v) => Number(v || 0).toLocaleString('es-AR');
const pct1 = (v) => Number(v || 0).toFixed(1) + '%';

const TREND_CLS = {
  up: 'bg-cu-cyan/10 text-[#1372a5]',
  down: 'bg-[#b42828]/10 text-[#a02020]',
  flat: 'bg-cu-grey/10 text-cu-grey',
};

// Vista EJECUTIVA del Resumen del Año: narrativa de negocio (resumen,
// KPIs con contexto, audiencia, contenido, qué funcionó y recomendaciones).
// Convive con la vista estándar; la elige quien lee el reporte.
export function ExecutiveReview({ series, accName, lang }) {
  const t = EXEC_STR[lang];
  const en = lang === 'en';
  const d = useMemo(() => buildExecReview(series, lang), [series, lang]);
  if (!d) return null;

  const subtitle = `${accName} · ${t.summaryNote(d.first.short, d.last.short)} 2026`;

  return (
    <div className="animate-fade-in">
      {/* ── Resumen Ejecutivo ── */}
      <SectionHeader title={t.summarySection} note={subtitle} />
      <div className="mb-5 overflow-hidden rounded-cu border border-cu-border bg-white shadow-cu">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="border-b border-cu-border2 p-5 lg:border-b-0 lg:border-r">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
              <BrandIcon icon={CheckCircle2} tone="accent" size="sm" />
              {t.winsTitle}
            </div>
            <ul className="flex flex-col gap-2">
              {d.wins.map((w, i) => (
                <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-cu-dgrey">
                  <span className="mt-[2px] font-bold text-cu-cyan">✓</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-5">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-[#b8860b]" />
              {t.challengesTitle}
            </div>
            <ul className="flex flex-col gap-2">
              {d.challenges.map((c, i) => (
                <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-cu-dgrey">
                  <span className="mt-[2px] text-cu-grey">•</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex items-start gap-2.5 border-t border-cu-border2 bg-cu-cyan/[0.06] px-5 py-3.5">
          <BrandIcon icon={Lightbulb} tone="accent" size="md" className="mt-0.5" />
          <div className="text-[12.5px] leading-relaxed text-cu-dgrey">
            <strong className="text-cu-dblue">{t.recTitle}: </strong>
            {d.recommendation}
          </div>
        </div>
      </div>

      {/* ── KPIs de negocio ── */}
      <SectionHeader title={t.kpiSection} note={t.kpiNote(d.first.short, d.last.short)} />
      <div className="mb-5 overflow-x-auto rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr>
              {[t.thKpi, d.first.short, d.last.short, t.thTrend, t.thCtx].map((h) => (
                <th key={h} className="whitespace-nowrap border-b-2 border-cu-cyan px-3 py-2 text-left text-[9px] font-bold uppercase tracking-[0.5px] text-cu-grey">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.kpiRows.map((r) => (
              <tr key={r.kpi} className="border-b border-cu-border2 last:border-b-0 hover:bg-cu-cyan/[0.03]">
                <td className="px-3 py-2.5 text-[12px] font-semibold text-cu-dblue">{r.kpi}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-[12px] tabular-nums text-cu-dgrey">{r.a}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-[12px] font-bold tabular-nums text-cu-dblue">{r.b}</td>
                <td className="px-3 py-2.5">
                  <span className={`whitespace-nowrap rounded-full px-2.5 py-[3px] text-[11px] font-medium ${TREND_CLS[r.t.dir]}`}>{r.t.label}</span>
                </td>
                <td className="px-3 py-2.5 text-[11px] leading-snug text-cu-grey">{r.ctx}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Crecimiento de audiencia ── */}
      <SectionHeader title={t.folSection} note={t.folNote} />
      <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-[2fr_1fr]">
        <ChartCard title={t.folChartTitle} subtitle={t.folChartSub}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={d.followerBars} margin={{ left: 0, right: 8, top: 6, bottom: 4 }}>
              <CartesianGrid vertical={false} stroke={CU.border2} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: CU.grey }} />
              <YAxis tick={{ fontSize: 10, fill: CU.grey }} />
              <Tooltip {...CHART_TOOLTIP} cursor={{ fill: 'rgba(62,178,237,.06)' }} />
              <Bar dataKey="fol" name={t.folChartTitle} radius={[4, 4, 0, 0]} maxBarSize={40}>
                {d.followerBars.map((_, i) => (
                  <Cell key={i} fill={PAL[i % 2 === 0 ? 0 : 3]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <div className="flex flex-col gap-3">
          {d.followersNow != null && (
            <KpiCard label={t.folNowLabel} value={`~${numEs(d.followersNow)}`} footnote={t.folNowFoot} />
          )}
          <KpiCard label={t.folTotalLabel} value={`+${numEs(d.totalFol)}`} accent="green" footnote={`${d.monthsCount} ${en ? 'months' : 'meses'}`} />
        </div>
      </div>

      {/* ── Alcance y visibilidad ── */}
      <SectionHeader title={t.visSection} />
      <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <KpiCard label={t.visImp} value={numEs(d.totalImp)} />
        <KpiCard label={t.visAvg} value={numEs(Math.round(d.avgImpPerPost))} footnote={`${numEs(d.totalPosts)} posts`} />
        <KpiCard label={t.visVisitors} value={numEs(d.totalVis)} accent="amber" />
      </div>
      {d.visibilityRead && (
        <div className="mb-5 rounded-cu border border-cu-border border-l-4 border-l-cu-cyan bg-white px-4 py-3 text-[12.5px] leading-relaxed text-cu-dgrey shadow-cu">
          {d.visibilityRead}
        </div>
      )}

      {/* ── Performance de contenido ── */}
      <SectionHeader title={t.contentSection} note={t.contentNote(numEs(d.topPosts.length ? d.pillarPerf.reduce((a, p) => a + p.count, 0) : 0))} />
      <div className="mb-5 overflow-x-auto rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
        <table className="w-full min-w-[520px] border-collapse">
          <thead>
            <tr>
              {[t.thPillar, t.thAvgEr, t.thCount, t.thClicks].map((h) => (
                <th key={h} className="whitespace-nowrap border-b-2 border-cu-cyan px-3 py-2 text-left text-[9px] font-bold uppercase tracking-[0.5px] text-cu-grey">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.pillarPerf.map((p, i) => (
              <tr key={p.pillar} className="border-b border-cu-border2 last:border-b-0 hover:bg-cu-cyan/[0.03]">
                <td className="px-3 py-2.5 text-[12px] font-semibold text-cu-dblue">{p.pillar}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-24 overflow-hidden rounded-full bg-cu-bg">
                      <span className="block h-full rounded-full bg-cu-cyan" style={{ width: `${d.pillarPerf[0].avgEr ? (p.avgEr / d.pillarPerf[0].avgEr) * 100 : 0}%` }} />
                    </span>
                    <span className={`text-[12px] tabular-nums ${i === 0 ? 'font-bold text-cu-cyan' : 'text-cu-dgrey'}`}>{pct1(p.avgEr)}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-[12px] tabular-nums text-cu-dgrey">{numEs(p.count)}</td>
                <td className="px-3 py-2.5 text-[12px] tabular-nums text-cu-dgrey">{numEs(p.clicks)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Top posts con lectura ── */}
      <SectionHeader title={t.topSection} note={t.topNote} />
      <div className="mb-5 overflow-x-auto rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr>
              {['#', t.thPost, 'ER', t.thClicks, t.thWhy].map((h) => (
                <th key={h} className="whitespace-nowrap border-b-2 border-cu-cyan px-3 py-2 text-left text-[9px] font-bold uppercase tracking-[0.5px] text-cu-grey">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.topPosts.map((p, i) => (
              <tr key={i} className="border-b border-cu-border2 last:border-b-0 hover:bg-cu-cyan/[0.03]">
                <td className="px-3 py-2.5 text-[11px] text-cu-grey">{i + 1}</td>
                <td className="px-3 py-2.5">
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" title={p.t} className="block max-w-[300px] truncate text-[12px] font-medium text-cu-dblue hover:text-cu-cyan">
                      {p.t}
                    </a>
                  ) : (
                    <span className="block max-w-[300px] truncate text-[12px] font-medium text-cu-dblue" title={p.t}>{p.t}</span>
                  )}
                  <span className="text-[10px] text-cu-grey">{p.month} · {numEs(p.imp)} {en ? 'impressions' : 'impresiones'}</span>
                </td>
                <td className="px-3 py-2.5 text-[12px] font-bold tabular-nums text-cu-cyan">{pct1(p.er)}</td>
                <td className="px-3 py-2.5 text-[12px] tabular-nums text-cu-dgrey">{numEs(p.clk)}</td>
                <td className="px-3 py-2.5 text-[11px] leading-snug text-cu-dgrey">{p.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Qué funcionó / qué no ── */}
      <SectionHeader title={t.workedSection} />
      <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-cu border border-cu-border bg-white p-5 shadow-cu">
          <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-cyan">{t.workedTitle}</div>
          <ul className="flex flex-col gap-2">
            {d.worked.map((w, i) => (
              <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-cu-dgrey">
                <span className="mt-[2px] font-bold text-cu-cyan">✓</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-cu border border-cu-border bg-white p-5 shadow-cu">
          <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-grey">{t.didntTitle}</div>
          <ul className="flex flex-col gap-2">
            {d.didnt.map((w, i) => (
              <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-cu-dgrey">
                <span className="mt-[2px] text-cu-grey">•</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Recomendaciones + impacto (ocultas en el reporte externo) ── */}
      {!isExternalReport() && (
        <>
          <SectionHeader title={t.recsSection} />
          <NextStepsPanel steps={d.recs} subtitle={subtitle} title={t.recsSection} />

          <SectionHeader title={t.impactSection} />
          <div
            className="mb-5 rounded-cu border border-cu-border border-l-4 border-l-cu-cyan bg-white px-5 py-4 text-[13px] leading-relaxed text-cu-dgrey shadow-cu [&_strong]:font-bold [&_strong]:text-cu-dblue"
            dangerouslySetInnerHTML={{ __html: d.impact }}
          />
        </>
      )}

      <p className="mb-4 text-[10px] italic leading-relaxed text-cu-grey">{t.dataNote}</p>

      <Glossary keys={en ? 'socialEn' : 'social'} />
    </div>
  );
}
