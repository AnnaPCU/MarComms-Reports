import { useMemo } from 'react';
import { CLIENT_STR } from '@/utils/clientI18n';
import { buildClientSummary } from '@/utils/clientSummary';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { HeroCard } from '@/components/shared/HeroCard';
import { InsightsPanel } from '@/components/shared/InsightsPanel';
import { ConclusionsPanel, NextStepsPanel } from '@/components/shared/PerformancePanels';
import { Glossary } from '@/components/shared/Glossary';
import { isExternalReport, isEmbedReport } from '@/utils/reportAudience';

function FichaRow({ k, v }) {
  return (
    <div className="flex gap-4 border-b border-cu-border2 px-4 py-2.5 text-[12px] last:border-b-0">
      <span className="w-40 shrink-0 font-bold text-cu-cyan">{k}</span>
      <span className="text-cu-dgrey">{v}</span>
    </div>
  );
}

// Vista GENERAL de un cliente: lo más importante de cada pilar que se le
// trabaja, en un solo lugar (mismo criterio que la vista General del
// reporte de Webinars: conciso, con «Ver vista completa →» hacia el
// detalle). Todo sale del último período con datos reales de cada pilar.
export function ClientOverview({ overview, lang = 'es', onOpen }) {
  const t = CLIENT_STR[lang];
  const summary = useMemo(() => buildClientSummary(overview, lang), [overview, lang]);
  if (!overview || !summary) return null;
  const { client } = overview;
  const { pillars, insights, conclusions, nextSteps, glossaryKeys } = summary;
  const embed = isEmbedReport();
  const external = isExternalReport();
  const cols = { 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' }[pillars.length] ?? 'lg:grid-cols-3';
  const unitName = t.units[client.unit] ?? client.unitName;

  return (
    <div className="animate-fade-in">
      {/* ── Ficha del cliente ── */}
      <SectionHeader title={client.name} note={t.pillarsCount(pillars.length)} />
      <div className="mb-5 grid gap-3 lg:grid-cols-3">
        <div className="overflow-hidden rounded-cu border border-cu-border bg-white shadow-cu lg:col-span-2">
          <FichaRow k={t.fichaUnit} v={unitName} />
          <FichaRow k={t.fichaRegion} v={client.region} />
          <FichaRow
            k={t.fichaAccounts}
            v={
              <ul className="flex flex-col gap-1">
                {pillars.map((s) => (
                  <li key={s.pilar}>
                    <strong className="font-medium text-cu-dblue">{s.title}:</strong> {s.accName}
                    {s.note && <span className="text-cu-grey"> · {s.note}</span>}
                  </li>
                ))}
              </ul>
            }
          />
        </div>
        <div className="rounded-cu bg-cu-dblue px-5 py-4 text-white shadow-cu">
          <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.5px]">{t.fichaPeriods}</div>
          <ul className="flex flex-col gap-1.5 text-[11.5px] text-white/80">
            {pillars.map((s) => (
              <li key={s.pilar} className="flex gap-2">
                <span className="text-cu-cyan">●</span>
                <span>
                  <strong className="font-medium text-white">{s.title}</strong> · {s.periodLabel}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {embed && (
        <div className="mb-4 rounded-cu border border-cu-border border-l-4 border-l-cu-cyan bg-white px-4 py-3 text-[12px] leading-relaxed text-cu-dgrey shadow-cu">
          {t.embedNote}
        </div>
      )}

      {/* ── Indicadores clave: una hero card por pilar ── */}
      <SectionHeader title={t.heroSection} note={t.heroNote} />
      <div className={`mb-5 grid grid-cols-2 gap-3 ${cols}`}>
        {pillars.map((s) => (
          <HeroCard key={s.pilar} label={`${s.title} — ${s.hero.label}`} value={s.hero.value} pill={s.hero.pill} footnote={s.periodLabel} />
        ))}
      </div>

      {/* ── Plan de acción consolidado ── */}
      <InsightsPanel
        title={t.insightsTitle}
        label={t.insightLabel}
        actionLabel={t.actionLabel}
        emptyText={t.emptyInsights}
        subtitle={client.name}
        items={insights}
      />

      {/* ── Resumen por pilar (tarjetas de canal) ── */}
      <SectionHeader title={t.channelsSection} note={t.channelsNote} />
      <div className={`mb-5 grid gap-3 sm:grid-cols-2 ${cols}`}>
        {pillars.map((s) => (
          <div key={s.pilar} className="flex flex-col rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
            <div className="mb-0.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
              <span className="h-3 w-[3px] shrink-0 rounded-sm bg-cu-cyan" />
              {s.title}
            </div>
            <div className="mb-2.5 text-[10px] text-cu-grey">
              {s.subtitle ?? s.accName} · {s.periodLabel}
            </div>
            <ul className="mb-3 flex flex-col gap-1.5 text-[12px] text-cu-dgrey">
              <li>
                <strong className="text-cu-dblue">{s.hero.value}</strong> {s.hero.label.toLowerCase()}
                {s.hero.pill && <span className="text-cu-grey"> · {s.hero.pill}</span>}
              </li>
              {s.lines.map((l, i) => (
                <li key={i}>
                  <strong className="text-cu-dblue">{l.value}</strong> {l.text.toLowerCase()}
                </li>
              ))}
            </ul>
            {s.note && (
              <div className="mb-3 text-[10px] italic leading-snug text-cu-grey">
                {t.noteScope} {s.note}
              </div>
            )}
            {!embed && onOpen && (
              <button onClick={() => onOpen(s.pilar)} className="mt-auto self-start text-[11px] font-bold text-cu-cyan hover:underline">
                {t.verVista}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ── Lectura de performance ── */}
      <SectionHeader title={t.perfSection} />
      <ConclusionsPanel items={conclusions} title={t.conclusionsTitle} />

      {!external && nextSteps.length > 0 && (
        <>
          <SectionHeader title={t.nextSection} />
          <NextStepsPanel steps={nextSteps} subtitle={client.name} title={t.nextTitle} />
        </>
      )}

      <Glossary keys={glossaryKeys} />
    </div>
  );
}
