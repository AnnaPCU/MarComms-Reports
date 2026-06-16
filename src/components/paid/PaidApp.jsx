import { CalendarClock, Info } from 'lucide-react';
import { listAccounts } from '@/services/paidService';
import { usePaidMonthly } from '@/hooks/usePaidMonthly';
import { MONTHS_2026 } from '@/constants/periods';
import { hasData } from '@/utils/hasData';
import { num } from '@/utils/format';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { AnalysisCard } from '@/components/shared/AnalysisCard';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { Glossary } from '@/components/shared/Glossary';

const money = (v, c) => `${num(Number(v).toFixed(2))} ${c}`;

// Pilar Paid Media — mensual, con una VISTA POR CAMPAÑA (cada campaña en su
// propia tarjeta; las que tuvieron poca o ninguna actividad se aclaran y explican).
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

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title={`Paid Media — ${periodLabel}`}
        note={[accName, mo.channel, mo.objetivo].filter(Boolean).join(' · ')}
      />

      {/* Aviso de período parcial (ej. Junio hasta el 12) */}
      {mo.partial && (
        <div className="mb-4 flex items-start gap-2 rounded-cu border border-amber-300 bg-amber-50 px-4 py-3 text-[12px] text-amber-800">
          <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong>Período parcial.</strong> {mo.partialNote} Las métricas no son
            comparables contra meses completos.
          </span>
        </div>
      )}

      {/* Totales del período */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Impresiones" value={num(t.impressions)} />
        <KpiCard label="Clics" value={num(t.clicks)} />
        <KpiCard label="CTR" value={t.ctr.toFixed(2)} unit="%" />
        <KpiCard label="CPC medio" value={money(t.cpc, t.currency)} />
        <KpiCard label="Coste" value={money(t.cost, t.currency)} />
        <KpiCard label="Conversiones" value={num(t.conversions)} />
        <KpiCard label="Tasa de conversión" value={t.convRate.toFixed(2)} unit="%" />
        <KpiCard label="Coste por conversión" value={t.costPerConv ? money(t.costPerConv, t.currency) : '—'} />
      </div>

      {/* Vista por campaña */}
      <SectionHeader title="Campañas" note={`${mo.campaigns.length} campañas`} />
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {mo.campaigns.map((c) => (
          <CampaignCard key={c.name} c={c} currency={t.currency} />
        ))}
      </div>

      {mo.analysis && <AnalysisCard>{mo.analysis}</AnalysisCard>}

      <Glossary keys="paid" />
    </div>
  );
}

function CampaignCard({ c, currency }) {
  const imps = c.impressions || 0;
  const clicks = c.clicks || 0;
  const noActivity = imps === 0;
  const noClicks = !noActivity && clicks === 0;
  const lowVolume = !noActivity && !noClicks && imps < 200;
  const hasConv = (c.conversions || 0) > 0;

  // ── Campaña habilitada pero sin impresiones ──
  if (noActivity) {
    return (
      <div className="rounded-cu border border-dashed border-cu-border bg-cu-bg/40 px-4 py-4">
        <div className="mb-1.5 text-[13px] font-bold text-cu-grey">{c.name}</div>
        <div className="flex items-start gap-1.5 text-[11px] text-cu-grey">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>Sin actividad en el período — campaña habilitada, pero sin impresiones.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-cu border border-cu-border bg-white px-4 py-4 shadow-cu">
      <span className="absolute inset-y-0 left-0 w-[3px] bg-cu-cyan" />
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-[13px] font-bold text-cu-dblue">{c.name}</div>
        {hasConv && (
          <span className="rounded-full bg-cu-cyan/10 px-2 py-0.5 text-[10px] font-bold text-[#1372a5]">
            {num(c.conversions)} conv.
          </span>
        )}
      </div>

      {noClicks ? (
        <>
          <div className="grid grid-cols-2 gap-2">
            <Metric label="Impresiones" value={num(imps)} />
            <Metric label="Clics" value="0" />
          </div>
          <Note>Tuvo impresiones pero ningún clic — volumen muy bajo para sacar conclusiones.</Note>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            <Metric label="Impresiones" value={num(imps)} />
            <Metric label="Clics" value={num(clicks)} />
            <Metric label="CTR" value={`${c.ctr.toFixed(2)}%`} />
            <Metric label="CPC" value={money(c.cpc, currency)} />
            <Metric label="Coste" value={money(c.cost, currency)} />
            <Metric label={hasConv ? 'Coste/conv.' : 'Conversiones'} value={hasConv ? money(c.costPerConv, currency) : '0'} />
          </div>
          {c.optLevel != null && (
            <div className="mt-2 text-[10px] text-cu-grey">
              Nivel de optimización: <strong className="text-cu-dgrey">{c.optLevel.toFixed(1)}%</strong>
            </div>
          )}
          {lowVolume && (
            <Note>Volumen bajo ({num(imps)} impresiones): interpretá las tasas con cautela.</Note>
          )}
        </>
      )}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-sm bg-cu-bg px-2.5 py-1.5">
      <div className="mb-0.5 text-[9px] font-medium uppercase tracking-[0.4px] text-cu-grey">{label}</div>
      <div className="text-[15px] font-bold tracking-tight text-cu-dblue">{value}</div>
    </div>
  );
}

function Note({ children }) {
  return (
    <div className="mt-2 flex items-start gap-1.5 text-[10.5px] italic text-cu-grey">
      <Info className="mt-0.5 h-3 w-3 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
