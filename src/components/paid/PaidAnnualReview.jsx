import { useEffect, useState } from 'react';
import { initialLang } from '@/utils/reportLang';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { listAccounts, getYear } from '@/services/paidService';
import { MONTHS_EN, YEAR_STR, PAID_STR } from '@/utils/paidI18n';
import { CU, CHART_TOOLTIP, brandOf } from '@/constants/brand';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { ChartCard } from '@/components/shared/ChartCard';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { Glossary } from '@/components/shared/Glossary';

const EMBED = typeof window !== 'undefined' ? window.__REPORT_EMBED__ : null;

const num = (v, lang) => Number(v || 0).toLocaleString(lang === 'en' ? 'en-US' : 'es-AR');
const pct = (v, lang) =>
  Number(v || 0).toLocaleString(lang === 'en' ? 'en-US' : 'es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';
const money = (v, c, lang) =>
  Number(v || 0).toLocaleString(lang === 'en' ? 'en-US' : 'es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
  ' ' + (c || 'EUR');

function useYear(account) {
  const compute = () =>
    EMBED?.snapshot?.kind === 'paid-year' ? EMBED.snapshot.year : getYear(account);
  const [year, setYear] = useState(compute);
  useEffect(() => {
    if (EMBED) return;
    setYear(getYear(account));
  }, [account]);
  return year;
}

// Resumen anual de Paid Media (Google Ads): acumulado de los meses con datos
// de la cuenta + evolución mensual. Las campañas GEO de Meta quedan fuera
// (tienen reporte propio) y se transparentan en una nota.
export function PaidAnnualReview({ account }) {
  const year = useYear(account);
  const accName = listAccounts().find((a) => a.id === account)?.name ?? '';
  const [lang, setLang] = useState(() => initialLang(brandOf(account, accName) === 'peterson' ? 'en' : 'es'));
  const t = YEAR_STR[lang];
  const tp = PAID_STR[lang];

  if (!year) {
    return (
      <div className="animate-fade-in">
        <NoDataScreen
          detail={
            <>
              No hay meses de Google Ads importados de <strong>{accName}</strong> para armar el
              resumen anual.
            </>
          }
        />
        <Glossary keys="paid" />
      </div>
    );
  }

  const c = year.currency;
  const tt = year.totals;
  const monthLabel = (m) => (lang === 'en' ? (MONTHS_EN[m.id] ?? m.label) : m.label);
  const activeLabels = year.months.map((m) => monthLabel(m) + (m.partial ? t.partialMark : '')).join(' · ');
  const series = year.months.map((m) => ({
    name: monthLabel(m).slice(0, 3),
    cost: Number((m.cost || 0).toFixed(2)),
    clicks: m.clicks || 0,
    conversions: m.conversions || 0,
    ctr: Number((m.ctr || 0).toFixed(2)),
  }));

  const thCls = 'px-3 py-2 text-left text-[10px] font-bold uppercase tracking-[0.5px] text-cu-grey';
  const tdCls = 'px-3 py-2 text-[12px] text-cu-dgrey';

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div />
        <SegmentedControl value={lang} onChange={setLang} size="sm" options={[{ id: 'es', label: 'ES' }, { id: 'en', label: 'EN' }]} />
      </div>

      <SectionHeader title={t.title} note={t.subtitle(accName, year.channel)} />
      <div className="mb-4 rounded-cu border border-cu-border border-l-4 border-l-cu-cyan bg-white px-4 py-3 text-[12px] text-cu-dgrey shadow-cu">
        <strong className="text-cu-dblue">{t.activeMonths(activeLabels)}</strong>
      </div>

      <SectionHeader title={t.kpiSection} note={accName} />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label={tp.kImp} value={num(tt.impressions, lang)} delta={{ dir: 'flat', label: `CTR ${pct(tt.ctr, lang)}` }} />
        <KpiCard label={tp.kClk} value={num(tt.clicks, lang)} delta={{ dir: 'flat', label: `CPC ${money(tt.cpc, c, lang)}` }} />
        <KpiCard
          label={tp.kConv}
          value={num(tt.conversions, lang)}
          accent="green"
          delta={(tt.conversions || 0) > 0 ? { dir: 'up', label: `▲ ${num(tt.conversions, lang)} ${tp.leads}` } : { dir: 'down', label: `0 ${tp.leads}` }}
          footnote={tp.convRateFoot(pct(tt.convRate, lang))}
        />
        <KpiCard
          label={tp.kCost}
          value={money(tt.cost, c, lang)}
          accent="amber"
          delta={(tt.conversions || 0) > 0 ? { dir: 'flat', label: `${money(tt.costPerConv, c, lang)}${tp.perLead}` } : { dir: 'flat', label: tp.noConv }}
        />
      </div>

      <SectionHeader title={t.evolSection} note={t.evolNote} />
      <div className="mb-5 grid gap-3 lg:grid-cols-2">
        <ChartCard title={t.chCost} subtitle={c}>
          <ResponsiveContainer>
            <BarChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="0" stroke={CU.border2} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: CU.grey }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: CU.grey }} axisLine={false} tickLine={false} width={52} />
              <Tooltip {...CHART_TOOLTIP} formatter={(v) => [money(v, c, lang), t.costLbl]} />
              <Bar dataKey="cost" fill={CU.cyan} radius={[4, 4, 0, 0]} maxBarSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t.chClicks}>
          <ResponsiveContainer>
            <ComposedChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="0" stroke={CU.border2} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: CU.grey }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: CU.grey }} axisLine={false} tickLine={false} width={44} />
              <Tooltip {...CHART_TOOLTIP} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="clicks" name={t.clicksLbl} fill={CU.cyan} radius={[4, 4, 0, 0]} maxBarSize={22} />
              <Line dataKey="conversions" name={t.convLbl} stroke={CU.dblue} strokeWidth={2} dot={{ r: 3.5, fill: CU.dblue, strokeWidth: 2, stroke: '#fff' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <div className="mb-5">
        <ChartCard title={t.chCtr}>
          <ResponsiveContainer>
            <LineChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="0" stroke={CU.border2} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: CU.grey }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: CU.grey }} axisLine={false} tickLine={false} width={44} />
              <Tooltip {...CHART_TOOLTIP} formatter={(v) => [pct(v, lang), 'CTR']} />
              <Line dataKey="ctr" stroke={CU.dblue} strokeWidth={2} dot={{ r: 3.5, fill: CU.dblue, strokeWidth: 2, stroke: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <SectionHeader title={t.monthTable} />
      <div className="mb-5 overflow-x-auto rounded-cu border border-cu-border bg-white shadow-cu">
        <table className="w-full min-w-[680px] border-collapse">
          <thead>
            <tr className="border-b-2 border-cu-cyan">
              <th className={thCls}>{t.thMonth}</th>
              <th className={thCls}>{t.thImp}</th>
              <th className={thCls}>{t.thClk}</th>
              <th className={thCls}>{t.thCtr}</th>
              <th className={thCls}>{t.thCpc}</th>
              <th className={thCls}>{t.thCost}</th>
              <th className={thCls}>{t.thConv}</th>
              <th className={thCls}>{t.thCpl}</th>
            </tr>
          </thead>
          <tbody>
            {year.months.map((m) => (
              <tr key={m.id} className="border-b border-cu-border2">
                <td className={`${tdCls} font-medium text-cu-dblue`}>{monthLabel(m)}{m.partial ? t.partialMark : ''}</td>
                <td className={tdCls}>{num(m.impressions, lang)}</td>
                <td className={tdCls}>{num(m.clicks, lang)}</td>
                <td className={tdCls}>{pct(m.ctr, lang)}</td>
                <td className={tdCls}>{money(m.cpc, c, lang)}</td>
                <td className={tdCls}>{money(m.cost, c, lang)}</td>
                <td className={`${tdCls} font-medium text-cu-dblue`}>{num(m.conversions, lang)}</td>
                <td className={tdCls}>{(m.conversions || 0) > 0 ? money(m.costPerConv, c, lang) : '—'}</td>
              </tr>
            ))}
            <tr className="bg-cu-bg/60">
              <td className={`${tdCls} font-bold text-cu-dblue`}>Total</td>
              <td className={`${tdCls} font-bold`}>{num(tt.impressions, lang)}</td>
              <td className={`${tdCls} font-bold`}>{num(tt.clicks, lang)}</td>
              <td className={`${tdCls} font-bold`}>{pct(tt.ctr, lang)}</td>
              <td className={`${tdCls} font-bold`}>{money(tt.cpc, c, lang)}</td>
              <td className={`${tdCls} font-bold`}>{money(tt.cost, c, lang)}</td>
              <td className={`${tdCls} font-bold text-cu-dblue`}>{num(tt.conversions, lang)}</td>
              <td className={`${tdCls} font-bold`}>{(tt.conversions || 0) > 0 ? money(tt.costPerConv, c, lang) : '—'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <SectionHeader title={t.campSection} note={t.campNote(year.campaigns.length)} />
      <div className="mb-5 overflow-x-auto rounded-cu border border-cu-border bg-white shadow-cu">
        <table className="w-full min-w-[680px] border-collapse">
          <thead>
            <tr className="border-b-2 border-cu-cyan">
              <th className={thCls}>{t.thCamp}</th>
              <th className={thCls}>{t.thMonths}</th>
              <th className={thCls}>{t.thImp}</th>
              <th className={thCls}>{t.thClk}</th>
              <th className={thCls}>{t.thCtr}</th>
              <th className={thCls}>{t.thCost}</th>
              <th className={thCls}>{t.thConv}</th>
            </tr>
          </thead>
          <tbody>
            {year.campaigns.map((cp) => (
              <tr key={cp.name} className="border-b border-cu-border2">
                <td className={`${tdCls} font-medium text-cu-dblue`}>{cp.name}</td>
                <td className={tdCls}>{cp.months}</td>
                <td className={tdCls}>{num(cp.impressions, lang)}</td>
                <td className={tdCls}>{num(cp.clicks, lang)}</td>
                <td className={tdCls}>{pct(cp.ctr, lang)}</td>
                <td className={tdCls}>{money(cp.cost, c, lang)}</td>
                <td className={`${tdCls} font-medium text-cu-dblue`}>{num(cp.conversions, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {year.geo.length > 0 && (
        <div className="mb-5 rounded-cu border border-cu-border2 bg-cu-bg px-4 py-3 text-[12px] leading-relaxed text-cu-dgrey">
          ℹ️ {t.geoNote(year.geo.map((g) => g.label).join(', '))}
        </div>
      )}

      <Glossary keys="paid" />
    </div>
  );
}
