import { num } from '@/utils/format';
import { genQuarterlyInsights, genQuarterlyConclusions, genQuarterlyNextSteps } from '@/utils/socialInsights';
import { InsightsPanel } from '@/components/shared/InsightsPanel';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { Funnel } from '@/components/shared/Funnel';
import { ConclusionsPanel, NextStepsPanel } from '@/components/shared/PerformancePanels';
import { AudienceCharts } from '@/components/social/AudienceCharts';
import { isExternalReport } from '@/utils/reportAudience';

function Mini({ label, value }) {
  return (
    <div className="rounded-sm bg-cu-bg px-2 py-1.5">
      <div className="mb-0.5 text-[9px] font-medium uppercase tracking-[0.4px] text-cu-grey">{label}</div>
      <div className="text-[15px] font-bold tracking-tight text-cu-dblue">{value}</div>
    </div>
  );
}

// Vista TRIMESTRAL de Social (LinkedIn). El reporte trimestral trae reactions y
// cantidad de posteos, pero no ER ni visitas al perfil (se omiten).
export function SocialQuarterlyView({ mo, audience, accName, periodLabel }) {
  const ctr = mo.imp ? (mo.clk / mo.imp) * 100 : 0;
  const react = mo.clk ? (mo.reactions / mo.clk) * 100 : 0;

  return (
    <div className="animate-fade-in">
      <InsightsPanel
        title="⚡ Plan de Acción — Insights Social Media"
        label="Insight"
        subtitle={`${accName} · ${periodLabel}`}
        items={genQuarterlyInsights(mo)}
      />

      <SectionHeader title="Indicadores Clave" note={`${accName} · ${num(mo.postsCount)} posteos`} />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Seguidores nuevos" value={num(mo.fol)} accent="green" />
        <KpiCard label="Impresiones" value={num(mo.imp)} delta={{ dir: 'flat', label: `CTR ${ctr.toFixed(1)}%` }} />
        <KpiCard label="Reacciones" value={num(mo.reactions)} />
        <KpiCard label="Clics" value={num(mo.clk)} />
      </div>

      <SectionHeader title="Embudo de Interacción — Impresión → Clic → Reacción" note="LinkedIn Orgánico" />
      <div className="mb-5 rounded-cu border border-cu-border bg-white px-7 pb-6 pt-6 shadow-cu">
        <div className="mx-auto max-w-[640px]">
          <Funnel
            stages={[
              { name: 'Impresiones', value: num(mo.imp), desc: `El contenido se mostró ${num(mo.imp)} veces`, retention: '100 %' },
              {
                name: 'Clics',
                value: num(mo.clk),
                desc: `CTR ${ctr.toFixed(2)} %`,
                retention: `${ctr.toFixed(2)} %`,
                drop: (
                  <>
                    CTR&nbsp;<b className="font-bold text-cu-cyan">{ctr.toFixed(2)} %</b>&nbsp;· impresión → clic
                  </>
                ),
              },
              {
                name: 'Reacciones',
                value: num(mo.reactions),
                desc: `${num(mo.postsCount)} posteos publicados`,
                retention: `${react.toFixed(1)} %`,
                drop: (
                  <>
                    <b className="font-bold text-cu-cyan">{react.toFixed(1)} %</b>&nbsp;· clic → reacción
                  </>
                ),
              },
            ]}
          />
        </div>
      </div>

      <SectionHeader title="Audiencia — Datos reales del perfil LinkedIn" />
      <AudienceCharts audience={audience} />

      <SectionHeader title="Top 3 Posteos del Trimestre" note="por impresiones · el reporte no incluye títulos" />
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {mo.top.map((t, i) => (
          <div key={i} className="relative overflow-hidden rounded-cu border border-cu-border bg-white px-4 py-4 shadow-cu">
            <span className="absolute inset-y-0 left-0 w-[3px] bg-cu-cyan" />
            <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.5px] text-cu-cyan">Top posteo #{i + 1}</div>
            <div className="grid grid-cols-3 gap-2">
              <Mini label="Impr." value={num(t.imp)} />
              <Mini label="Reacc." value={num(t.reactions)} />
              <Mini label="Clics" value={num(t.clk)} />
            </div>
          </div>
        ))}
      </div>

      <SectionHeader title="Lectura de Performance" />
      <ConclusionsPanel items={genQuarterlyConclusions(mo)} />

      {!isExternalReport() && (
        <>
          <SectionHeader title="Conclusión — Próximos Pasos" />
          <NextStepsPanel steps={genQuarterlyNextSteps(mo)} subtitle={`${accName} · ${periodLabel}`} />
        </>
      )}
    </div>
  );
}
