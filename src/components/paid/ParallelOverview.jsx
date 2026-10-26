// ════════════════════════════════════════════════════════════════
//  Vista general de una campaña en paralelo (Google Ads + Meta Ads):
//  la vista por defecto del período `par-…`. Suma lo comparable de las dos
//  plataformas (utils/paidParallelSummary.js, §22 de DECISIONES) y deja el
//  detalle de cada una en su propia vista (Google Ads / Meta Ads).
// ════════════════════════════════════════════════════════════════
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CU, CHART_TOOLTIP } from '@/constants/brand';
import { KpiCard } from '@/components/shared/KpiCard';
import { ChartCard } from '@/components/shared/ChartCard';
import { Funnel } from '@/components/shared/Funnel';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { InsightsPanel } from '@/components/shared/InsightsPanel';
import { ConclusionsPanel, NextStepsPanel } from '@/components/shared/PerformancePanels';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { Glossary } from '@/components/shared/Glossary';
import { FxNote } from '@/components/paid/FxNote';
import { PAR_STR } from '@/utils/paidI18n';
import { paidFmt } from '@/utils/paidFormat';
import { weekRangeLabel } from '@/utils/weekRange';
import { summarizeParallel, shareOf } from '@/utils/paidParallelSummary';
import { genParallelInsights, genParallelConclusions, genParallelNextSteps } from '@/utils/paidParallelInsights';
import { isExternalReport, getReportCurrency } from '@/utils/reportAudience';
import { fxFactor, fxPair, getFx } from '@/services/fxService';

// Un color fijo por plataforma en toda la vista (nunca por ranking).
const COLOR = { google: CU.cyan, meta: CU.dblue };
const NAME = { google: 'Google Ads', meta: 'Meta Ads' };

export function ParallelOverview({ par, period, accName, periodLabel, lang = 'es' }) {
  const t = PAR_STR[lang];
  const { numEs, pct, money } = paidFmt(lang);
  const en = lang === 'en';

  // Descargable en otra moneda: tipo de cambio del cierre de la campaña.
  const fxTo = getReportCurrency();
  const natives = [par?.google?.mo?.totals?.currency, par?.meta?.currency].filter(Boolean);
  const convertible = fxTo && natives.some((c) => c !== fxTo) && natives.every((c) => fxFactor(c, fxTo, period) != null);
  const sum = summarizeParallel(par, convertible ? { factor: (c) => fxFactor(c, fxTo, period), to: fxTo } : {});
  const from = natives.find((c) => c !== fxTo);
  const fx = convertible
    ? { from, to: fxTo, date: getFx(period).date, campaign: true, ...fxPair(from, fxTo, period) }
    : null;

  if (!sum) {
    return (
      <div className="animate-fade-in">
        <NoDataScreen lang={lang} detail={t.noData} />
        <Glossary keys={en ? 'paidEn' : 'paid'} />
      </div>
    );
  }

  const { google: g, meta: m, total: tot } = sum;
  const cur = sum.currency;
  const mn = (v, c) => (v == null ? '—' : money(v, c));
  const subtitle = [accName, periodLabel].filter(Boolean).join(' · ');

  // Aporte de cada plataforma (100 %): inversión, impresiones y clics.
  const shareData = ['spend', 'imp', 'clicks']
    .map((k) => ({ k, s: shareOf(sum, k) }))
    .filter((x) => x.s)
    .map(({ k, s }) => ({ name: t.shareRows[k], k, google: s.google, meta: s.meta }));
  const absOf = (k, id) => (k === 'spend' ? money(sum[id].spend, sum[id].currency) : numEs(sum[id][k]));

  const weekData = (sum.weeks ?? []).map((w) => ({ name: weekRangeLabel(w.w, lang), google: w.google, meta: w.meta }));

  const rows = [
    ['spend', (p) => mn(p.spend, p.currency)],
    ['imp', (p) => numEs(p.imp)],
    ['clicks', (p) => numEs(p.clicks)],
    ['ctr', (p) => pct(p.ctr)],
    ['cpc', (p) => mn(p.cpc, p.currency)],
    ['cpm', (p) => mn(p.cpm, p.currency)],
    ['conv', (p) => (p.id === 'meta' && p.conv == null ? t.metaNoConv : numEs(p.conv))],
    ['costPerConv', (p) => mn(p.costPerConv, p.currency)],
  ];

  return (
    <div className="animate-fade-in">
      <FxNote fx={fx} lang={lang} />

      <InsightsPanel
        title={t.insightsTitle}
        label={t.insightsLabel}
        subtitle={subtitle}
        items={genParallelInsights(sum, lang)}
        actionLabel={t.actionLabel}
        emptyText={t.emptyInsights}
      />

      {/* ── Indicadores clave unificados ── */}
      <SectionHeader title={t.kpiSection} note={subtitle} />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <KpiCard
          label={t.kSpend}
          value={tot.spend != null ? money(tot.spend, cur) : t.notSummed}
          footnote={t.split(money(g.spend, g.currency), money(m.spend, m.currency))}
          accent="amber"
        />
        <KpiCard label={t.kImp} value={numEs(tot.imp)} footnote={t.split(numEs(g.imp), numEs(m.imp))} />
        <KpiCard label={t.kClicks} value={numEs(tot.clicks)} footnote={t.clicksFoot(numEs(g.clicks), numEs(m.clicks))} />
        <KpiCard label={t.kCtr} value={pct(tot.ctr)} footnote={t.split(pct(g.ctr), pct(m.ctr))} />
        <KpiCard
          label={t.kCpc}
          value={mn(tot.cpc, cur)}
          footnote={t.cpcFoot(mn(g.cpc, g.currency), mn(m.cpc, m.currency))}
        />
        <KpiCard
          label={t.kConv}
          value={numEs(tot.conv)}
          footnote={t.convFoot(numEs(g.conv), m.conv == null ? null : numEs(m.conv))}
          accent="green"
        />
      </div>

      {/* ── Embudo combinado ── */}
      <SectionHeader title={t.funnelSection} note={t.funnelNote} />
      <div className="mb-5 rounded-cu border border-cu-border bg-white px-7 py-6 shadow-cu">
        <div className="mx-auto max-w-[640px]">
          <Funnel
            stages={[
              { name: t.fImp, value: numEs(tot.imp), desc: t.split(numEs(g.imp), numEs(m.imp)), retention: en ? '100%' : '100 %' },
              {
                name: t.fClicks,
                value: numEs(tot.clicks),
                desc: t.split(numEs(g.clicks), numEs(m.clicks)),
                drop: t.fDrop(pct(tot.ctr)),
                retention: pct(tot.ctr),
              },
              {
                name: t.fConv,
                value: numEs(tot.conv),
                desc: t.split(numEs(g.conv), m.conv == null ? '—' : numEs(m.conv)),
                drop: t.fDropConv(pct(tot.clicks ? (tot.conv / tot.clicks) * 100 : 0)),
                retention: pct(tot.clicks ? (tot.conv / tot.clicks) * 100 : 0),
              },
            ]}
          />
        </div>
      </div>

      {/* ── Gráficos: aporte de cada plataforma + inversión semanal ── */}
      {(shareData.length > 0 || weekData.length > 0) && (
        <>
          <SectionHeader title={t.chartsSection} />
          <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
            {shareData.length > 0 && (
              <ChartCard title={t.chShareTitle} subtitle={t.chShareSub}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={shareData} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 0 }} barCategoryGap="28%">
                    <CartesianGrid horizontal={false} stroke={CU.border2} />
                    <XAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: CU.grey }} />
                    <YAxis type="category" dataKey="name" width={84} tick={{ fontSize: 10.5, fill: CU.dgrey }} />
                    <Tooltip
                      {...CHART_TOOLTIP}
                      cursor={{ fill: 'rgba(62,178,237,.06)' }}
                      formatter={(v, n, item) => [`${pct(v)} · ${absOf(item.payload.k, n === NAME.google ? 'google' : 'meta')}`, n]}
                    />
                    <Legend wrapperStyle={{ fontSize: 10, color: CU.dgrey }} />
                    <Bar dataKey="google" name={NAME.google} stackId="s" fill={COLOR.google} />
                    <Bar dataKey="meta" name={NAME.meta} stackId="s" fill={COLOR.meta} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            )}
            {weekData.length > 0 && (
              <ChartCard title={t.chWeeksTitle} subtitle={t.chWeeksSub(cur)}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekData} margin={{ left: 0, right: 8, top: 6, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke={CU.border2} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: CU.grey }} />
                    <YAxis tick={{ fontSize: 10, fill: CU.grey }} width={60} tickFormatter={(v) => numEs(Math.round(v))} />
                    <Tooltip
                      {...CHART_TOOLTIP}
                      cursor={{ fill: 'rgba(62,178,237,.06)' }}
                      labelFormatter={(l) => `${t.weekOf} ${l}`}
                      formatter={(v, n) => [money(v, cur), n]}
                    />
                    <Legend wrapperStyle={{ fontSize: 10, color: CU.dgrey }} />
                    <Bar dataKey="google" name={NAME.google} stackId="w" fill={COLOR.google} maxBarSize={56} />
                    <Bar dataKey="meta" name={NAME.meta} stackId="w" fill={COLOR.meta} maxBarSize={56} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            )}
          </div>
        </>
      )}

      {/* ── Comparativa por plataforma ── */}
      <SectionHeader title={t.tableSection} />
      <div className="mb-5 overflow-x-auto rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
        <table className="w-full min-w-[560px] border-collapse">
          <thead>
            <tr>
              {[t.thMetric, NAME.google, NAME.meta, t.thTotal].map((h, i) => (
                <th
                  key={h}
                  className={`border-b-2 border-cu-cyan px-3 py-2 text-[9px] font-bold uppercase tracking-[0.5px] text-cu-grey ${i ? 'text-right' : 'text-left'}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([k, f]) => (
              <tr key={k} className="border-b border-cu-border2 transition-colors hover:bg-cu-cyan/[0.03]">
                <td className="px-3 py-2 text-[11px] font-medium text-cu-dblue">{t.rows[k]}</td>
                <td className="px-3 py-2 text-right text-[11.5px] text-cu-dgrey">{f(g)}</td>
                <td className="px-3 py-2 text-right text-[11.5px] text-cu-dgrey">{f(m)}</td>
                <td className="px-3 py-2 text-right text-[11.5px] font-bold text-cu-dblue">{f(tot)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 text-[10px] italic leading-relaxed text-cu-grey">{t.tableFoot}</div>
      </div>

      <SectionHeader title={t.perfSection} />
      <ConclusionsPanel items={genParallelConclusions(sum, lang)} title={t.conclusionsTitle} />

      {!isExternalReport() && (
        <>
          <SectionHeader title={t.nextSection} />
          <NextStepsPanel steps={genParallelNextSteps(sum, lang)} subtitle={subtitle} title={t.nextTitle} />
        </>
      )}

      <Glossary keys={en ? 'paidEn' : 'paid'} />
    </div>
  );
}
