import { CalendarClock } from 'lucide-react';
import { listAccounts } from '@/services/paidService';
import { usePaidMonthly } from '@/hooks/usePaidMonthly';
import { MONTHS_2026 } from '@/constants/periods';
import { hasData } from '@/utils/hasData';
import { genPaidInsights, genPaidConclusions, genPaidNextSteps } from '@/utils/paidInsights';
import { InsightsPanel } from '@/components/shared/InsightsPanel';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { Glossary } from '@/components/shared/Glossary';
import { PaidFunnel } from '@/components/paid/PaidFunnel';
import { PaidCharts } from '@/components/paid/PaidCharts';
import { CampaignsTable } from '@/components/paid/CampaignsTable';
import { ConclusionsPanel, NextStepsPanel } from '@/components/paid/PerformancePanels';

const numEs = (v) => Number(v || 0).toLocaleString('es-AR');
const pct = (v) =>
  Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';
const money = (v, c) =>
  Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + (c || 'EUR');

// Pilar Paid Media — reporte completo: insights, KPIs, embudo, gráficos,
// detalle por campaña, diagnóstico y próximos pasos.
export function PaidApp({ account, period }) {
  const { mo, loading } = usePaidMonthly(account, period);
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
  const insights = genPaidInsights(mo);
  const conclusions = genPaidConclusions(mo);
  const nextSteps = genPaidNextSteps(mo);
  const partial = Boolean(mo.partial);

  return (
    <div className="animate-fade-in">
      <InsightsPanel
        title="⚡ Plan de Acción — Insights Paid Media"
        label="Insight"
        subtitle={[accName, periodLabel, mo.channel].filter(Boolean).join(' · ')}
        items={insights}
      />

      {partial && (
        <div className="mb-4 flex items-start gap-2 rounded-cu border border-amber-300 bg-amber-50 px-4 py-3 text-[12px] text-amber-800">
          <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong>Período parcial.</strong> {mo.partialNote} Las métricas no son comparables contra
            meses completos.
          </span>
        </div>
      )}

      {/* ── Indicadores Clave ── */}
      <SectionHeader title="Indicadores Clave" note={[accName, mo.objetivo].filter(Boolean).join(' · ')} />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label={`Impresiones${partial ? ' (parcial)' : ''}`}
          value={numEs(t.impressions)}
          delta={{ dir: 'flat', label: `CTR ${pct(t.ctr)}` }}
        />
        <KpiCard label="Clics" value={numEs(t.clicks)} delta={{ dir: 'flat', label: `CPC ${money(t.cpc, c)}` }} />
        <KpiCard
          label="Conversiones (leads)"
          value={numEs(t.conversions)}
          accent="green"
          delta={
            (t.conversions || 0) > 0
              ? { dir: 'up', label: `▲ ${numEs(t.conversions)} leads` }
              : { dir: 'down', label: '0 leads' }
          }
          footnote={`Tasa de conversión ${pct(t.convRate)}`}
        />
        <KpiCard
          label={`Coste total${partial ? ' (parcial)' : ''}`}
          value={money(t.cost, c)}
          accent="amber"
          delta={
            (t.conversions || 0) > 0
              ? { dir: 'flat', label: `${money(t.costPerConv, c)}/lead` }
              : { dir: 'flat', label: 'Sin conversión' }
          }
        />
      </div>

      {/* ── Embudo de Conversión ── */}
      <SectionHeader title="Embudo de Conversión — Impresión → Clic → Lead" note="Search · Google Ads" />
      <PaidFunnel totals={t} campaigns={mo.campaigns} />

      {/* ── Distribución por Campaña ── */}
      <SectionHeader title="Distribución por Campaña" note={`${mo.campaigns.length} campañas`} />
      <PaidCharts campaigns={mo.campaigns} currency={c} />

      {/* ── Detalle por Campaña ── */}
      <SectionHeader title="Detalle por Campaña" />
      <CampaignsTable campaigns={mo.campaigns} currency={c} title={`${mo.channel || 'Google Ads'} — Search`} />

      {/* ── Lectura de Performance ── */}
      <SectionHeader title="Lectura de Performance" />
      <ConclusionsPanel items={conclusions} />

      {/* ── Próximos Pasos ── */}
      <SectionHeader title="Conclusión — Próximos Pasos" />
      <NextStepsPanel steps={nextSteps} subtitle={[accName, periodLabel].filter(Boolean).join(' · ')} />

      <Glossary keys="paid" />
    </div>
  );
}
