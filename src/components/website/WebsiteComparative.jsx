import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getComparative } from '@/services/websiteService';
import { WEB_STR } from '@/utils/websiteI18n';
import { CU, PAL, CHART_TOOLTIP } from '@/constants/brand';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Glossary } from '@/components/shared/Glossary';

const numL = (v, lang) => Number(v || 0).toLocaleString(lang === 'en' ? 'en-US' : 'es-AR');
const posL = (v, lang) =>
  Number(v || 0).toLocaleString(lang === 'en' ? 'en-US' : 'es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const shortName = (n) => n.replace('Control Union', 'CU').replace('Peterson Solutions', 'PS');

// Gráfico horizontal (12 cuentas no entran verticales con etiquetas legibles).
function HBarCard({ title, subtitle, data, dataKey, fmt }) {
  return (
    <div className="rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
      <div className="mb-0.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
        <span className="h-3 w-[3px] shrink-0 rounded-sm bg-cu-cyan" />
        {title}
      </div>
      {subtitle && <div className="mb-3.5 text-[10px] text-cu-grey">{subtitle}</div>}
      <div className="relative" style={{ height: Math.max(230, data.length * 26 + 40) }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" stroke={CU.border2} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: CU.grey }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" width={104} tick={{ fontSize: 10, fill: CU.dgrey }} axisLine={false} tickLine={false} />
            <Tooltip {...CHART_TOOLTIP} formatter={(v) => [fmt(v), '']} />
            <Bar dataKey={dataKey} radius={[0, 4, 4, 0]} maxBarSize={16}>
              {data.map((_, i) => (
                <Cell key={i} fill={PAL[i % PAL.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Comparativa multi-cuenta de Website: acumulado anual (GA4 + Search Console)
// de cada cuenta con sus trimestres activos a la vista. Los datos salen del
// seed en el bundle, por eso el snapshot embebido solo lleva el marcador.
export function WebsiteComparative({ lang = 'es' }) {
  const t = WEB_STR[lang];
  const num = (v) => numL(v, lang);
  const pos = (v) => posL(v, lang);
  const rows = getComparative();
  const chart = [...rows]
    .map((r) => ({
      name: shortName(r.name),
      visitors: r.totals.visitors,
      conversions: r.totals.conversions,
      seoClicks: r.totals.seoClicks,
    }))
    .sort((a, b) => b.visitors - a.visitors);

  const thCls = 'px-3 py-2 text-left text-[10px] font-bold uppercase tracking-[0.5px] text-cu-grey';
  const tdCls = 'px-3 py-2 text-[12px] text-cu-dgrey';

  return (
    <div className="animate-fade-in">
      <SectionHeader title={t.cmpTitle} note={t.cmpNote} />
      <div className="mb-4 rounded-cu border border-cu-border border-l-4 border-l-cu-cyan bg-white px-4 py-3 text-[12px] leading-relaxed text-cu-dgrey shadow-cu">
        {t.cmpIntro}
      </div>

      <div className="mb-5 grid gap-3 lg:grid-cols-3">
        <HBarCard title={t.cmpChVis} subtitle="GA4" data={chart} dataKey="visitors" fmt={num} />
        <HBarCard title={t.cmpChConv} subtitle="GA4" data={[...chart].sort((a, b) => b.conversions - a.conversions)} dataKey="conversions" fmt={num} />
        <HBarCard
          title={t.cmpChSeo}
          subtitle={t.cmpChSeoSub}
          data={rows.filter((r) => r.totals.hasSeo).map((r) => ({ name: shortName(r.name), seoClicks: r.totals.seoClicks })).sort((a, b) => b.seoClicks - a.seoClicks)}
          dataKey="seoClicks"
          fmt={num}
        />
      </div>

      <SectionHeader title={t.cmpTableSection} />
      <div className="mb-5 overflow-x-auto rounded-cu border border-cu-border bg-white shadow-cu">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr className="border-b-2 border-cu-cyan">
              {t.cmpTh.map((h) => (
                <th key={h} className={thCls}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...rows]
              .sort((a, b) => b.totals.visitors - a.totals.visitors)
              .map((r) => (
                <tr key={r.id} className="border-b border-cu-border2">
                  <td className={`${tdCls} font-medium text-cu-dblue`}>{r.name}</td>
                  <td className={tdCls}>{r.quarters.map((q) => q.label).join(' · ')}</td>
                  <td className={tdCls}>{num(r.totals.visitors)}</td>
                  <td className={tdCls}>{num(r.totals.total)}</td>
                  <td className={`${tdCls} font-medium text-cu-dblue`}>{num(r.totals.conversions)}</td>
                  <td className={tdCls}>{r.totals.hasSeo ? num(r.totals.seoImp) : '—'}</td>
                  <td className={tdCls}>{r.totals.hasSeo ? num(r.totals.seoClicks) : '—'}</td>
                  <td className={tdCls}>{r.totals.hasSeo ? pos(r.totals.avgPos) : '—'}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Glossary keys={t.glossarySite} />
    </div>
  );
}
