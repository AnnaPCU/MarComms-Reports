import { useMemo, useState } from 'react';
import { initialLang } from '@/utils/reportLang';
import { listAccounts } from '@/services/emailService';
import { useEmailCampaign } from '@/hooks/useEmailCampaign';
import { MONTHS_2026 } from '@/constants/periods';
import { genEmailInsights, genEmailConclusions, genEmailNextSteps } from '@/utils/emailInsights';
import { EMAIL_STR } from '@/utils/emailI18n';
import { MONTHS_EN } from '@/utils/paidI18n';
import { InsightsPanel } from '@/components/shared/InsightsPanel';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { Funnel } from '@/components/shared/Funnel';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { ConclusionsPanel, NextStepsPanel } from '@/components/shared/PerformancePanels';
import { isExternalReport } from '@/utils/reportAudience';
import { EmailCharts } from '@/components/email/EmailCharts';
import { HotLeadsTable } from '@/components/email/HotLeadsTable';
import { Glossary } from '@/components/shared/Glossary';

// Pilar Email Marketing (Mailchimp / Apollo). Reporte de secuencia/campaña.
// Idioma base español; toggle EN disponible (también en el descargable).
export function EmailApp({ account, period }) {
  const accName = useMemo(
    () => listAccounts().find((a) => a.id === account)?.name ?? '',
    [account],
  );
  const [lang, setLang] = useState(() => initialLang('es'));
  const t9 = EMAIL_STR[lang];
  const numL = (v) => Number(v || 0).toLocaleString(lang === 'en' ? 'en-US' : 'es-AR');
  const pct = (v) =>
    (lang === 'en' ? Number(v || 0).toFixed(1) : Number(v || 0).toFixed(1).replace('.', ',')) + '%';
  const periodLabel =
    lang === 'en'
      ? MONTHS_EN[period] ?? period
      : MONTHS_2026.find((p) => p.id === period)?.label ?? period;

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
      {/* Toggle de idioma del reporte */}
      <div className="mb-4 flex justify-end">
        <SegmentedControl
          value={lang}
          onChange={setLang}
          size="sm"
          options={[
            { id: 'es', label: 'ES' },
            { id: 'en', label: 'EN' },
          ]}
        />
      </div>

      <InsightsPanel
        title={t9.insightsTitle}
        label={t9.insightLabel}
        actionLabel={t9.actionLabel}
        emptyText={t9.emptyInsights}
        subtitle={subtitle}
        items={genEmailInsights(campaign, lang)}
      />

      <SectionHeader
        title={t9.kpiSection}
        note={[accName, `${numL(t.emailCount)} ${t9.sendsWord(t.emailCount)}`].filter(Boolean).join(' · ')}
      />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label={t9.kSent}
          value={numL(t.totalSent)}
          delta={t.totalDelivered ? { dir: 'flat', label: t9.deliveredLabel(numL(t.totalDelivered)) } : undefined}
        />
        <KpiCard
          label={t9.kOpen}
          value={Number(t.openRate).toFixed(1)}
          unit="%"
          delta={{ dir: t.openRate >= 21 ? 'up' : 'down', label: t9.refOpen }}
          footnote={t9.openFoot(numL(t.totalOpens))}
        />
        <KpiCard
          label={t9.kClick}
          value={Number(t.clickRate).toFixed(1)}
          unit="%"
          accent="green"
          delta={{ dir: t.clickRate >= 2.5 ? 'up' : 'down', label: t9.refClick }}
          footnote={t9.clickFoot(numL(t.totalClicks))}
        />
        <KpiCard
          label={t9.kCtor}
          value={Number(t.ctor).toFixed(1)}
          unit="%"
          accent="amber"
          delta={{ dir: t.ctor >= 11 ? 'up' : 'down', label: t9.refCtor }}
          footnote={t9.ctorFoot}
        />
      </div>

      {(t.bounceRate != null || t.unsubRate != null) && (
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {t.bounceRate != null && (
            <KpiCard
              label={t9.kBounce}
              value={Number(t.bounceRate).toFixed(1)}
              unit="%"
              delta={{ dir: t.bounceRate <= 2 ? 'up' : 'down', label: t9.refBounce }}
              footnote={t9.bounceFoot(numL(t.totalBounces))}
            />
          )}
          {t.unsubRate != null && (
            <KpiCard
              label={t9.kUnsub}
              value={Number(t.unsubRate).toFixed(2)}
              unit="%"
              delta={{ dir: t.unsubRate <= 0.5 ? 'up' : 'down', label: t9.refUnsub }}
              footnote={t9.unsubFoot(numL(t.totalUnsubs))}
            />
          )}
        </div>
      )}

      <SectionHeader title={t9.funnelSection} note="Mailchimp" />
      <div className="mb-5 rounded-cu border border-cu-border bg-white px-7 pb-6 pt-6 shadow-cu">
        <div className="mx-auto max-w-[640px]">
          <Funnel
            stages={[
              {
                name: t.totalDelivered ? t9.fDelivered : t9.fSent,
                value: numL(t.totalDelivered || t.totalSent),
                desc: t.totalDelivered
                  ? t9.fSentDesc(numL(t.totalSent))
                  : `${numL(t.emailCount)} ${t9.sendsWord(t.emailCount)}`,
                retention: '100 %',
              },
              {
                name: t9.fOpens,
                value: numL(t.totalOpens),
                desc: t9.fOpenDesc(pct(t.openRate)),
                retention: pct(t.openRate),
                drop: (
                  <>
                    {t9.fOpenDrop}&nbsp;<b className="font-bold text-cu-cyan">{pct(t.openRate)}</b>&nbsp;· {t9.fOpenDropNote}
                  </>
                ),
              },
              {
                name: t9.fClicks,
                value: numL(t.totalClicks),
                desc: t9.fCtorDesc(pct(t.ctor)),
                retention: pct(t.ctor),
                drop: (
                  <>
                    CTOR&nbsp;<b className="font-bold text-cu-cyan">{pct(t.ctor)}</b>&nbsp;· {t9.fCtorDropNote}
                  </>
                ),
              },
            ]}
          />
        </div>
      </div>

      {campaign.comparison?.length > 1 && (
        <>
          <SectionHeader title={t9.cmpSection} note={t9.cmpNote(numL(t.emailCount))} />
          <EmailCharts comparison={campaign.comparison} emails={campaign.emails} lang={lang} />
        </>
      )}

      <SectionHeader title={t9.hotSection} note={t9.hotNote} />
      <HotLeadsTable leads={campaign.hotLeads} lang={lang} />

      <SectionHeader title={t9.perfSection} />
      <ConclusionsPanel items={genEmailConclusions(campaign, lang)} title={t9.conclusionsTitle} />

      {!isExternalReport() && (
        <>
          <SectionHeader title={t9.nextSection} />
          <NextStepsPanel steps={genEmailNextSteps(campaign, lang)} subtitle={subtitle} title={t9.nextTitle} />
        </>
      )}

      <Glossary keys={t9.glossaryKey} />
    </div>
  );
}
