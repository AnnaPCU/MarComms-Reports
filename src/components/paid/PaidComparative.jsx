import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getComparative, listGeoAccounts } from '@/services/paidService';
import { MONTHS_EN, CMP_STR } from '@/utils/paidI18n';
import { CU, PAL, CHART_TOOLTIP } from '@/constants/brand';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ChartCard } from '@/components/shared/ChartCard';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { Glossary } from '@/components/shared/Glossary';

const num = (v, lang) => Number(v || 0).toLocaleString(lang === 'en' ? 'en-US' : 'es-AR');
const pct = (v, lang) =>
  Number(v || 0).toLocaleString(lang === 'en' ? 'en-US' : 'es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';
const money = (v, c, lang) =>
  Number(v || 0).toLocaleString(lang === 'en' ? 'en-US' : 'es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
  ' ' + (c || 'EUR');

// Comparativa multi-cuenta de Paid Media (Google Ads): acumulado anual de
// cada cuenta con sus meses activos a la vista. Los datos salen del seed en
// el bundle, por eso el snapshot embebido solo lleva el marcador de vista.
export function PaidComparative() {
  const [lang, setLang] = useState('es');
  const t = CMP_STR[lang];
  const rows = getComparative();
  const geoAccounts = listGeoAccounts();
  const c = rows[0]?.currency || 'EUR';

  const monthLabels = (r) =>
    r.months.map((m) => (lang === 'en' ? (MONTHS_EN[m.id] ?? m.label) : m.label).slice(0, 3)).join(' · ');
  const chart = rows.map((r) => ({
    name: r.name.replace('Control Union', 'CU'),
    cost: Number(r.totals.cost.toFixed(2)),
    clicks: r.totals.clicks,
    conversions: r.totals.conversions,
    cpc: Number(r.totals.cpc.toFixed(2)),
  }));

  const barChart = (key, fmt) => (
    <ResponsiveContainer>
      <BarChart data={chart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="0" stroke={CU.border2} vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 10.5, fill: CU.grey }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: CU.grey }} axisLine={false} tickLine={false} width={52} />
        <Tooltip {...CHART_TOOLTIP} formatter={(v) => [fmt(v), '']} />
        <Bar dataKey={key} radius={[4, 4, 0, 0]} maxBarSize={34}>
          {chart.map((_, i) => (
            <Cell key={i} fill={PAL[i % PAL.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  const thCls = 'px-3 py-2 text-left text-[10px] font-bold uppercase tracking-[0.5px] text-cu-grey';
  const tdCls = 'px-3 py-2 text-[12px] text-cu-dgrey';

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div />
        <SegmentedControl value={lang} onChange={setLang} size="sm" options={[{ id: 'es', label: 'ES' }, { id: 'en', label: 'EN' }]} />
      </div>

      <SectionHeader title={t.title} note={t.note} />
      <div className="mb-4 rounded-cu border border-cu-border border-l-4 border-l-cu-cyan bg-white px-4 py-3 text-[12px] leading-relaxed text-cu-dgrey shadow-cu">
        {t.disclaimer}
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {rows.map((r, i) => (
          <div key={r.id} className="rounded-cu border border-cu-border bg-white px-4 py-3.5 shadow-cu" style={{ borderTop: `3px solid ${PAL[i % PAL.length]}` }}>
            <div className="mb-1 text-[11.5px] font-bold leading-tight text-cu-dblue">{r.name}</div>
            <div className="mb-2 text-[9.5px] text-cu-grey">{t.cardMonths(monthLabels(r))}</div>
            <div className="text-[19px] font-bold leading-none text-cu-dblue">{money(r.totals.cost, c, lang)}</div>
            <div className="mt-1.5 text-[10.5px] text-cu-grey">
              {num(r.totals.clicks, lang)} clics · CTR {pct(r.totals.ctr, lang)} ·{' '}
              <span className="font-bold text-cu-dblue">{num(r.totals.conversions, lang)} conv.</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-5 grid gap-3 lg:grid-cols-2">
        <ChartCard title={t.chCost} subtitle={c}>{barChart('cost', (v) => money(v, c, lang))}</ChartCard>
        <ChartCard title={t.chClicks}>{barChart('clicks', (v) => num(v, lang))}</ChartCard>
        <ChartCard title={t.chConv}>{barChart('conversions', (v) => num(v, lang))}</ChartCard>
        <ChartCard title={t.chCpc} subtitle={c}>{barChart('cpc', (v) => money(v, c, lang))}</ChartCard>
      </div>

      <SectionHeader title={t.tableTitle} />
      <div className="mb-5 overflow-x-auto rounded-cu border border-cu-border bg-white shadow-cu">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="border-b-2 border-cu-cyan">
              <th className={thCls}>{t.thAcc}</th>
              <th className={thCls}>{YEAR_TH[lang].months}</th>
              <th className={thCls}>{YEAR_TH[lang].imp}</th>
              <th className={thCls}>{YEAR_TH[lang].clk}</th>
              <th className={thCls}>CTR</th>
              <th className={thCls}>CPC</th>
              <th className={thCls}>{YEAR_TH[lang].cost}</th>
              <th className={thCls}>{YEAR_TH[lang].conv}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-cu-border2">
                <td className={`${tdCls} font-medium text-cu-dblue`}>{r.name}</td>
                <td className={tdCls}>{monthLabels(r)}</td>
                <td className={tdCls}>{num(r.totals.impressions, lang)}</td>
                <td className={tdCls}>{num(r.totals.clicks, lang)}</td>
                <td className={tdCls}>{pct(r.totals.ctr, lang)}</td>
                <td className={tdCls}>{money(r.totals.cpc, c, lang)}</td>
                <td className={tdCls}>{money(r.totals.cost, c, lang)}</td>
                <td className={`${tdCls} font-medium text-cu-dblue`}>{num(r.totals.conversions, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {geoAccounts.length > 0 && (
        <div className="mb-5 rounded-cu border border-cu-border2 bg-cu-bg px-4 py-3 text-[12px] leading-relaxed text-cu-dgrey">
          ℹ️ {t.geoNote(geoAccounts.map((a) => a.name).join(', '))}
        </div>
      )}

      <Glossary keys="paid" />
    </div>
  );
}

const YEAR_TH = {
  es: { months: 'Meses', imp: 'Impresiones', clk: 'Clics', cost: 'Inversión', conv: 'Conversiones' },
  en: { months: 'Months', imp: 'Impressions', clk: 'Clicks', cost: 'Spend', conv: 'Conversions' },
};
