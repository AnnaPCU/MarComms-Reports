import { useState, useEffect } from 'react';
import { CalendarClock } from 'lucide-react';
import { listAccounts } from '@/services/paidService';
import { usePaidMonthly } from '@/hooks/usePaidMonthly';
import { MONTHS_2026 } from '@/constants/periods';
import { hasData } from '@/utils/hasData';
import { genPaidInsights, genPaidConclusions, genPaidNextSteps, campaignStatus } from '@/utils/paidInsights';
import { InsightsPanel } from '@/components/shared/InsightsPanel';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { Select } from '@/components/shared/Select';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { Glossary } from '@/components/shared/Glossary';
import { PaidFunnel } from '@/components/paid/PaidFunnel';
import { PaidCharts } from '@/components/paid/PaidCharts';
import { CampaignsTable } from '@/components/paid/CampaignsTable';
import { ConclusionsPanel, NextStepsPanel } from '@/components/shared/PerformancePanels';
import { ComparativeCampaigns } from '@/components/paid/ComparativeCampaigns';
import { isExternalReport } from '@/utils/reportAudience';

const numEs = (v) => Number(v || 0).toLocaleString('es-AR');
const pct = (v) =>
  Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';
const money = (v, c) =>
  Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + (c || 'EUR');

const ALL = 'all';
const CMP = 'cmp';

// Fila de KPIs (sirve para totales de cuenta o para una campaña).
function KpiRow({ d, currency, partial }) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <KpiCard
        label={`Impresiones${partial ? ' (parcial)' : ''}`}
        value={numEs(d.impressions)}
        delta={{ dir: 'flat', label: `CTR ${pct(d.ctr)}` }}
      />
      <KpiCard label="Clics" value={numEs(d.clicks)} delta={{ dir: 'flat', label: `CPC ${money(d.cpc, currency)}` }} />
      <KpiCard
        label="Conversiones (leads)"
        value={numEs(d.conversions)}
        accent="green"
        delta={(d.conversions || 0) > 0 ? { dir: 'up', label: `▲ ${numEs(d.conversions)} leads` } : { dir: 'down', label: '0 leads' }}
        footnote={`Tasa de conversión ${pct(d.convRate)}`}
      />
      <KpiCard
        label={`Coste total${partial ? ' (parcial)' : ''}`}
        value={money(d.cost, currency)}
        accent="amber"
        delta={(d.conversions || 0) > 0 ? { dir: 'flat', label: `${money(d.costPerConv, currency)}/lead` } : { dir: 'flat', label: 'Sin conversión' }}
      />
    </div>
  );
}

// Vista de UNA campaña (drill-down).
function CampaignDetail({ c, currency, accName, periodLabel }) {
  const st = campaignStatus(c);
  const STATUS_TEXT = {
    win: 'Campaña con conversiones en el período: es la que hay que proteger y escalar.',
    opt: 'Tuvo clics pero no conversiones: revisar landing page y textos de anuncio para mejorar el cierre.',
    low: 'Tuvo impresiones pero ningún clic: ajustar anuncios y palabras clave para mejorar el CTR.',
    none: 'Sin impresiones en el período: revisar pujas, presupuesto y estado de la campaña.',
  };
  return (
    <>
      <SectionHeader title={`Campaña — ${c.name}`} note={[accName, periodLabel].filter(Boolean).join(' · ')} />
      <div className="mb-4 rounded-cu border border-cu-border border-l-4 border-l-cu-cyan bg-white px-4 py-3 text-[12.5px] text-cu-dgrey shadow-cu">
        <strong className="text-cu-dblue">Estado: {st.label}.</strong> {STATUS_TEXT[st.key]}
      </div>
      <KpiRow d={c} currency={currency} />
      <SectionHeader title="Embudo de Conversión — Impresión → Clic → Lead" note="Search · Google Ads" />
      <PaidFunnel totals={{ ...c, currency }} campaigns={[c]} />
    </>
  );
}

// Pilar Paid Media — reporte completo con selector global / campaña / comparativa.
export function PaidApp({ account, period }) {
  const { mo, loading } = usePaidMonthly(account, period);
  const [view, setView] = useState(ALL);
  useEffect(() => setView(ALL), [account, period]);

  const accName = listAccounts().find((a) => a.id === account)?.name ?? '';
  const periodLabel = MONTHS_2026.find((p) => p.id === period)?.label ?? period;

  if (loading) {
    return (
      <div className="flex animate-fade-in items-center justify-center py-24 text-[13px] text-cu-grey">
        Cargando datos…
      </div>
    );
  }

  if (!hasData([mo].filter(Boolean))) {
    return (
      <div className="animate-fade-in">
        <NoDataScreen
          detail={
            <>
              No hay datos de Paid Media importados de <strong>{accName}</strong> para{' '}
              <strong>{periodLabel}</strong>.
            </>
          }
        />
        <Glossary keys="paid" />
      </div>
    );
  }

  const t = mo.totals;
  const c = t.currency || 'EUR';
  const partial = Boolean(mo.partial);
  const selected = mo.campaigns.find((x) => x.name === view);

  const campOptions = [
    { id: ALL, label: '⚡ Todas las campañas — Vista global' },
    ...mo.campaigns.map((x) => ({ id: x.name, label: x.name })),
    { id: CMP, label: '📊 Comparativa de campañas' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Selector de vista / campaña (sub-filtro del pilar Paid) */}
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <Select label="Vista / Campaña" value={view} onChange={setView} options={campOptions} />
      </div>

      {partial && (
        <div className="mb-4 flex items-start gap-2 rounded-cu border border-amber-300 bg-amber-50 px-4 py-3 text-[12px] text-amber-800">
          <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong>Período parcial.</strong> {mo.partialNote} Las métricas no son comparables contra meses completos.
          </span>
        </div>
      )}

      {view === CMP ? (
        <ComparativeCampaigns mo={mo} currency={c} />
      ) : selected ? (
        <CampaignDetail c={selected} currency={c} accName={accName} periodLabel={periodLabel} />
      ) : (
        <>
          <InsightsPanel
            title="⚡ Plan de Acción — Insights Paid Media"
            label="Insight"
            subtitle={[accName, periodLabel, mo.channel].filter(Boolean).join(' · ')}
            items={genPaidInsights(mo)}
          />

          <SectionHeader title="Indicadores Clave" note={[accName, mo.objetivo].filter(Boolean).join(' · ')} />
          <KpiRow d={t} currency={c} partial={partial} />

          <SectionHeader title="Embudo de Conversión — Impresión → Clic → Lead" note="Search · Google Ads" />
          <PaidFunnel totals={t} campaigns={mo.campaigns} />

          <SectionHeader title="Distribución por Campaña" note={`${mo.campaigns.length} campañas`} />
          <PaidCharts campaigns={mo.campaigns} currency={c} />

          <SectionHeader title="Detalle por Campaña" />
          <CampaignsTable campaigns={mo.campaigns} currency={c} title={`${mo.channel || 'Google Ads'} — Search`} />

          <SectionHeader title="Lectura de Performance" />
          <ConclusionsPanel items={genPaidConclusions(mo)} />

          {!isExternalReport() && (
            <>
              <SectionHeader title="Conclusión — Próximos Pasos" />
              <NextStepsPanel steps={genPaidNextSteps(mo)} subtitle={[accName, periodLabel].filter(Boolean).join(' · ')} />
            </>
          )}
        </>
      )}

      <Glossary keys="paid" />
    </div>
  );
}
