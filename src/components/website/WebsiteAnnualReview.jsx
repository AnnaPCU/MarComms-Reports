import { useEffect, useState } from 'react';
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
import { getYear, listAccounts } from '@/services/websiteService';
import { CU, CHART_TOOLTIP } from '@/constants/brand';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { ChartCard } from '@/components/shared/ChartCard';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { Glossary } from '@/components/shared/Glossary';

const EMBED = typeof window !== 'undefined' ? window.__REPORT_EMBED__ : null;
const num = (v) => Number(v || 0).toLocaleString('es-AR');
const pos = (v) => Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function useYear(account) {
  const compute = () =>
    EMBED?.snapshot?.kind === 'website-year' ? EMBED.snapshot.year : getYear(account);
  const [year, setYear] = useState(compute);
  useEffect(() => {
    if (EMBED) return;
    setYear(getYear(account));
  }, [account]);
  return year;
}

// Resumen anual de Website: acumulado de los trimestres con datos (GA4 +
// Search Console) + evolución trimestral y tops del año.
export function WebsiteAnnualReview({ account }) {
  const year = useYear(account);
  const accName = listAccounts().find((a) => a.id === account)?.name ?? '';

  if (!year) {
    return (
      <div className="animate-fade-in">
        <NoDataScreen
          detail={
            <>
              No hay trimestres de Website importados de <strong>{accName}</strong> para armar el
              resumen anual.
            </>
          }
        />
        <Glossary keys="website" />
      </div>
    );
  }

  const tt = year.totals;
  const activeLabels = year.quarters.map((q) => q.label).join(' · ');
  const series = year.quarters.map((q) => ({
    name: q.label,
    visitors: q.visitors,
    conversions: q.conversions,
    seoClicks: q.seoClicks,
    avgPos: Number(q.avgPos.toFixed(1)),
  }));

  const thCls = 'px-3 py-2 text-left text-[10px] font-bold uppercase tracking-[0.5px] text-cu-grey';
  const tdCls = 'px-3 py-2 text-[12px] text-cu-dgrey';

  return (
    <div className="animate-fade-in">
      <SectionHeader title="Resumen del Año 2026" note={`${accName} · GA4 + Search Console · Acumulado de los trimestres con datos`} />
      <div className="mb-4 rounded-cu border border-cu-border border-l-4 border-l-cu-cyan bg-white px-4 py-3 text-[12px] text-cu-dgrey shadow-cu">
        <strong className="text-cu-dblue">Trimestres con datos: {activeLabels}</strong>
      </div>

      <SectionHeader title="Indicadores del Año — Acumulado" note={accName} />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Visitantes únicos" value={num(tt.visitors)} delta={{ dir: 'flat', label: `${num(tt.total)} sesiones` }} />
        <KpiCard label="Vistas de página" value={num(tt.pageviews)} />
        <KpiCard
          label="Conversiones"
          value={num(tt.conversions)}
          accent="green"
          delta={(tt.conversions || 0) > 0 ? { dir: 'up', label: `▲ ${num(tt.conversions)}` } : { dir: 'down', label: '0' }}
          footnote="Formularios, consultas y acciones de contacto"
        />
        {tt.hasSeo ? (
          <KpiCard
            label="Clics SEO"
            value={num(tt.seoClicks)}
            delta={{ dir: 'flat', label: `${num(tt.seoImp)} impresiones` }}
            footnote={`Posición media ~${pos(tt.avgPos)} (promedio simple de trimestres)`}
          />
        ) : (
          <KpiCard label="Clics SEO" value="—" footnote="Sin Search Console conectado" />
        )}
      </div>

      <SectionHeader title="Evolución Trimestral" note="Solo trimestres con datos importados" />
      <div className="mb-5 grid gap-3 lg:grid-cols-2">
        <ChartCard title="Visitantes y conversiones por trimestre" subtitle="GA4">
          <ResponsiveContainer>
            <ComposedChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="0" stroke={CU.border2} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: CU.grey }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: CU.grey }} axisLine={false} tickLine={false} width={52} />
              <Tooltip {...CHART_TOOLTIP} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="visitors" name="Visitantes únicos" fill={CU.cyan} radius={[4, 4, 0, 0]} maxBarSize={30} />
              <Line dataKey="conversions" name="Conversiones" stroke={CU.dblue} strokeWidth={2} dot={{ r: 3.5, fill: CU.dblue, strokeWidth: 2, stroke: '#fff' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
        {tt.hasSeo && (
        <ChartCard title="Clics SEO por trimestre" subtitle="Search Console">
          <ResponsiveContainer>
            <BarChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="0" stroke={CU.border2} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: CU.grey }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: CU.grey }} axisLine={false} tickLine={false} width={44} />
              <Tooltip {...CHART_TOOLTIP} formatter={(v) => [num(v), 'Clics SEO']} />
              <Bar dataKey="seoClicks" fill={CU.cyan} radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        )}
      </div>

      <SectionHeader title="Detalle por Trimestre" />
      <div className="mb-5 overflow-x-auto rounded-cu border border-cu-border bg-white shadow-cu">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="border-b-2 border-cu-cyan">
              <th className={thCls}>Trimestre</th>
              <th className={thCls}>Visitantes únicos</th>
              <th className={thCls}>Sesiones</th>
              <th className={thCls}>Vistas</th>
              <th className={thCls}>Conversiones</th>
              <th className={thCls}>Impresiones SEO</th>
              <th className={thCls}>Clics SEO</th>
              <th className={thCls}>Posición media</th>
            </tr>
          </thead>
          <tbody>
            {year.quarters.map((q) => (
              <tr key={q.id} className="border-b border-cu-border2">
                <td className={`${tdCls} font-medium text-cu-dblue`}>{q.label}</td>
                <td className={tdCls}>{num(q.visitors)}</td>
                <td className={tdCls}>{num(q.total)}</td>
                <td className={tdCls}>{num(q.pageviews)}</td>
                <td className={`${tdCls} font-medium text-cu-dblue`}>{num(q.conversions)}</td>
                <td className={tdCls}>{q.hasSeo ? num(q.seoImp) : '—'}</td>
                <td className={tdCls}>{q.hasSeo ? num(q.seoClicks) : '—'}</td>
                <td className={tdCls}>{q.hasSeo ? pos(q.avgPos) : '—'}</td>
              </tr>
            ))}
            <tr className="bg-cu-bg/60">
              <td className={`${tdCls} font-bold text-cu-dblue`}>Total</td>
              <td className={`${tdCls} font-bold`}>{num(tt.visitors)}</td>
              <td className={`${tdCls} font-bold`}>{num(tt.total)}</td>
              <td className={`${tdCls} font-bold`}>{num(tt.pageviews)}</td>
              <td className={`${tdCls} font-bold text-cu-dblue`}>{num(tt.conversions)}</td>
              <td className={`${tdCls} font-bold`}>{tt.hasSeo ? num(tt.seoImp) : '—'}</td>
              <td className={`${tdCls} font-bold`}>{tt.hasSeo ? num(tt.seoClicks) : '—'}</td>
              <td className={`${tdCls} font-bold`}>{tt.hasSeo ? `${pos(tt.avgPos)} *` : '—'}</td>
            </tr>
          </tbody>
        </table>
        <p className="px-3 pb-2 pt-1 text-[10px] italic text-cu-grey">
          * La posición media no se acumula: es el promedio simple de los trimestres.
        </p>
      </div>

      <div className="mb-5 grid gap-3 lg:grid-cols-2">
        <div className="overflow-x-auto rounded-cu border border-cu-border bg-white shadow-cu">
          <div className="flex items-center gap-2 px-4 pt-3.5 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
            <span className="h-3 w-[3px] shrink-0 rounded-sm bg-cu-cyan" />
            Top Landing Pages del Año
          </div>
          <table className="w-full border-collapse">
            <tbody>
              {year.topPages.map((p) => (
                <tr key={p.key} className="border-b border-cu-border2 last:border-b-0">
                  <td className={`${tdCls} max-w-[340px] truncate`} title={p.key}>{p.key.replace(/^https?:\/\//, '')}</td>
                  <td className={`${tdCls} whitespace-nowrap text-right font-medium text-cu-dblue`}>{num(p.value)} vistas</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {year.topKeywords.length > 0 && (
        <div className="overflow-x-auto rounded-cu border border-cu-border bg-white shadow-cu">
          <div className="flex items-center gap-2 px-4 pt-3.5 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
            <span className="h-3 w-[3px] shrink-0 rounded-sm bg-cu-cyan" />
            Top Keywords del Año
          </div>
          <table className="w-full border-collapse">
            <tbody>
              {year.topKeywords.map((k) => (
                <tr key={k.key} className="border-b border-cu-border2 last:border-b-0">
                  <td className={tdCls}>{k.key}</td>
                  <td className={`${tdCls} whitespace-nowrap text-right font-medium text-cu-dblue`}>{num(k.value)} clics</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      <Glossary keys="website" />
    </div>
  );
}
