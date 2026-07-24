import { useMemo } from 'react';
import { listAccounts } from '@/services/emailService';
import { useEmailCampaign } from '@/hooks/useEmailCampaign';
import { MONTHS_2026 } from '@/constants/periods';
import { genEmailInsights, genEmailConclusions, genEmailNextSteps } from '@/utils/emailInsights';
import { InsightsPanel } from '@/components/shared/InsightsPanel';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { Funnel } from '@/components/shared/Funnel';
import { ConclusionsPanel, NextStepsPanel } from '@/components/shared/PerformancePanels';
import { isExternalReport } from '@/utils/reportAudience';
import { EmailCharts } from '@/components/email/EmailCharts';
import { HotLeadsTable } from '@/components/email/HotLeadsTable';
import { Glossary } from '@/components/shared/Glossary';

const numEs = (v) => Number(v || 0).toLocaleString('es-AR');
const pct = (v) => Number(v || 0).toFixed(1) + '%';

// Pilar Email Marketing (Mailchimp / Apollo). Reporte de secuencia/campaña.
export function EmailApp({ account, period }) {
  const accName = useMemo(
    () => listAccounts().find((a) => a.id === account)?.name ?? '',
    [account],
  );
  const periodLabel = MONTHS_2026.find((p) => p.id === period)?.label ?? period;

  const { campaign, loading } = useEmailCampaign(account, period);

  if (loading) {
    return (
      <div className="flex animate-fade-in items-center justify-center py-24 text-[13px] text-cu-grey">
        Cargando datos…
      </div>
    );
  }

  // ── Regla de honestidad ──
  if (!campaign || !campaign.totals) {
    return (
      <div className="animate-fade-in">
        <SectionHeader title="Email Marketing" note="Fuentes: Mailchimp · Apollo" />
        <NoDataScreen
          detail={
            <>
              El pilar <strong>Email Marketing</strong> todavía no tiene datos importados
              {accName ? (
                <>
                  {' '}de <strong>{accName}</strong>
                </>
              ) : null}
              {period ? (
                <>
                  {' '}para <strong>{periodLabel}</strong>
                </>
              ) : null}
              . Los KPIs a medir están definidos en el glosario de abajo.
            </>
          }
          hint={<>Pendiente del primer import (Mailchimp / Apollo)</>}
        />
        <Glossary keys="email" />
      </div>
    );
  }

  const t = campaign.totals;
  const subtitle = [accName, periodLabel, campaign.campaignName].filter(Boolean).join(' · ');

  return (
    <div className="animate-fade-in">
      <InsightsPanel
        title="⚡ Plan de Acción — Insights Email Marketing"
        label="Insight"
        subtitle={subtitle}
        items={genEmailInsights(campaign)}
      />

      <SectionHeader title="Indicadores Clave" note={[accName, `${numEs(t.emailCount)} ${t.emailCount === 1 ? 'envío' : 'envíos'}`].filter(Boolean).join(' · ')} />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="Correos enviados"
          value={numEs(t.totalSent)}
          delta={t.totalDelivered ? { dir: 'flat', label: `${numEs(t.totalDelivered)} entregados` } : undefined}
        />
        <KpiCard
          label="Tasa de apertura"
          value={Number(t.openRate).toFixed(1)}
          unit="%"
          delta={{ dir: t.openRate >= 21 ? 'up' : 'down', label: 'ref. B2B 21%' }}
          footnote={`${numEs(t.totalOpens)} aperturas únicas`}
        />
        <KpiCard
          label="Tasa de clics"
          value={Number(t.clickRate).toFixed(1)}
          unit="%"
          accent="green"
          delta={{ dir: t.clickRate >= 2.5 ? 'up' : 'down', label: 'ref. B2B 2,5%' }}
          footnote={`${numEs(t.totalClicks)} clics únicos`}
        />
        <KpiCard
          label="CTOR (click-to-open)"
          value={Number(t.ctor).toFixed(1)}
          unit="%"
          accent="amber"
          delta={{ dir: t.ctor >= 11 ? 'up' : 'down', label: 'ref. B2B 11%' }}
          footnote="Clics sobre aperturas"
        />
      </div>

      {(t.bounceRate != null || t.unsubRate != null) && (
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {t.bounceRate != null && (
            <KpiCard label="Tasa de rebote" value={Number(t.bounceRate).toFixed(1)} unit="%" delta={{ dir: t.bounceRate <= 2 ? 'up' : 'down', label: 'ref. sano <2%' }} footnote={`${numEs(t.totalBounces)} rebotes`} />
          )}
          {t.unsubRate != null && (
            <KpiCard label="Tasa de bajas" value={Number(t.unsubRate).toFixed(2)} unit="%" delta={{ dir: t.unsubRate <= 0.5 ? 'up' : 'down', label: 'ref. sano <0,5%' }} footnote={`${numEs(t.totalUnsubs)} bajas`} />
          )}
        </div>
      )}

      <SectionHeader title="Embudo de Interacción — Enviados → Aperturas → Clics" note="Mailchimp" />
      <div className="mb-5 rounded-cu border border-cu-border bg-white px-7 pb-6 pt-6 shadow-cu">
        <div className="mx-auto max-w-[640px]">
          <Funnel
            stages={[
              {
                name: t.totalDelivered ? 'Entregados' : 'Enviados',
                value: numEs(t.totalDelivered || t.totalSent),
                desc: t.totalDelivered ? `${numEs(t.totalSent)} enviados` : `${numEs(t.emailCount)} ${t.emailCount === 1 ? 'envío' : 'envíos'}`,
                retention: '100 %',
              },
              {
                name: 'Aperturas',
                value: numEs(t.totalOpens),
                desc: `Apertura ${pct(t.openRate)}`,
                retention: pct(t.openRate),
                drop: (
                  <>
                    Tasa de apertura&nbsp;<b className="font-bold text-cu-cyan">{pct(t.openRate)}</b>&nbsp;· entrega → apertura
                  </>
                ),
              },
              {
                name: 'Clics',
                value: numEs(t.totalClicks),
                desc: `CTOR ${pct(t.ctor)}`,
                retention: pct(t.ctor),
                drop: (
                  <>
                    CTOR&nbsp;<b className="font-bold text-cu-cyan">{pct(t.ctor)}</b>&nbsp;· apertura → clic
                  </>
                ),
              },
            ]}
          />
        </div>
      </div>

      {campaign.comparison?.length > 1 && (
        <>
          <SectionHeader title="Comparativa de la Secuencia" note={`${numEs(t.emailCount)} envíos`} />
          <EmailCharts comparison={campaign.comparison} emails={campaign.emails} />
        </>
      )}

      <SectionHeader title="Hot Leads — Contactos con Interés Comercial" note="Ordenados por clics" />
      <HotLeadsTable leads={campaign.hotLeads} />

      <SectionHeader title="Lectura de Performance" />
      <ConclusionsPanel items={genEmailConclusions(campaign)} />

      {!isExternalReport() && (
        <>
          <SectionHeader title="Conclusión — Próximos Pasos" />
          <NextStepsPanel steps={genEmailNextSteps(campaign)} subtitle={subtitle} />
        </>
      )}

      <Glossary keys="email" />
    </div>
  );
}
