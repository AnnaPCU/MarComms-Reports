import { useMemo } from 'react';
import { listAccounts } from '@/services/socialService';
import { useSocialMonthly } from '@/hooks/useSocialMonthly';
import { ML } from '@/data/socialSeed';
import { monthHasData } from '@/utils/hasData';
import { genMonthlyInsights, genSocialConclusions, genSocialNextSteps } from '@/utils/socialInsights';
import { fmt, num, computeDelta } from '@/utils/format';
import { InsightsPanel } from '@/components/shared/InsightsPanel';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { Funnel } from '@/components/shared/Funnel';
import { ConclusionsPanel, NextStepsPanel } from '@/components/shared/PerformancePanels';
import { isExternalReport } from '@/utils/reportAudience';
import { AudienceCharts } from '@/components/social/AudienceCharts';
import { PostsTable } from '@/components/social/PostsTable';
import { ComparativeView } from '@/components/social/ComparativeView';
import { Glossary } from '@/components/shared/Glossary';

// Vista del pilar Social Media (LinkedIn).
export function SocialApp({ account, period }) {
  const accName = useMemo(
    () => listAccounts().find((a) => a.id === account)?.name ?? '',
    [account],
  );

  // Hook reactivo (seed local o Supabase + realtime). Se llama siempre,
  // antes de cualquier return, por las reglas de hooks.
  const { mo, prev, audience, loading } = useSocialMonthly(account, period);

  // Vista comparativa multi-cuenta.
  if (period === 'cmp')
    return (
      <>
        <ComparativeView />
        <Glossary keys="social" />
      </>
    );

  if (loading) {
    return (
      <div className="flex animate-fade-in items-center justify-center py-24 text-[13px] text-cu-grey">
        Cargando datos…
      </div>
    );
  }

  // ── Regla de honestidad ──
  if (!monthHasData(mo)) {
    return (
      <>
        <NoDataScreen
          detail={
            <>
              No hay datos importados de <strong>{accName}</strong> para{' '}
              <strong>{ML[period] || period}</strong>. Importá el archivo
              correspondiente desde LinkedIn Analytics para verlos acá.
            </>
          }
          hint={
            <>
              Período con datos reales: <span className="font-bold text-cu-cyan">Mayo 2026</span>
            </>
          }
        />
        <Glossary keys="social" />
      </>
    );
  }

  const insights = genMonthlyInsights(mo, prev);

  return (
    <div className="animate-fade-in">
      <InsightsPanel subtitle={`${accName} · ${ML[period] || period}`} items={insights} />

      <SectionHeader title="Indicadores Clave" />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Impresiones totales" value={fmt(mo.imp)} delta={computeDelta(mo.imp, prev?.imp)} />
        <KpiCard label="Engagement Rate" value={Number(mo.er).toFixed(1)} unit="%" delta={computeDelta(mo.er, prev?.er)} />
        <KpiCard label="Clics totales" value={fmt(mo.clk)} delta={computeDelta(mo.clk, prev?.clk)} />
        <KpiCard
          label="Visitas únicas al perfil"
          value={mo.vis}
          delta={computeDelta(mo.vis, prev?.vis)}
          footnote="Visitas únicas al perfil (proxy — LinkedIn no exporta «conversiones»)"
        />
      </div>

      <SectionHeader title="Embudo de Interacción — Impresión → Clic → Perfil" note="LinkedIn Orgánico" />
      <div className="mb-5 rounded-cu border border-cu-border bg-white px-7 pb-6 pt-6 shadow-cu">
        <div className="mx-auto max-w-[640px]">
          <Funnel
            stages={[
              {
                name: 'Impresiones',
                value: num(mo.imp),
                desc: `El contenido se mostró ${num(mo.imp)} veces`,
                retention: '100 %',
              },
              {
                name: 'Clics',
                value: num(mo.clk),
                desc: `ER ${Number(mo.er).toFixed(1)}%`,
                retention: mo.imp ? `${((mo.clk / mo.imp) * 100).toFixed(2)} %` : '—',
                drop: (
                  <>
                    CTR&nbsp;<b className="font-bold text-cu-cyan">{mo.imp ? ((mo.clk / mo.imp) * 100).toFixed(2) : '0'} %</b>&nbsp;· impresión → clic
                  </>
                ),
              },
              {
                name: 'Visitas al perfil',
                value: num(mo.vis),
                desc: `+${num(mo.fol)} seguidores`,
                retention: mo.clk ? `${((mo.vis / mo.clk) * 100).toFixed(1)} %` : '—',
                drop: (
                  <>
                    <b className="font-bold text-cu-cyan">{mo.clk ? ((mo.vis / mo.clk) * 100).toFixed(1) : '0'} %</b>&nbsp;· clic → visita al perfil
                  </>
                ),
              },
            ]}
          />
        </div>
      </div>

      <SectionHeader title="Audiencia — Datos reales del perfil LinkedIn" />
      <AudienceCharts audience={audience} />

      <SectionHeader title="Top Publicaciones — Clasificadas por Pilar ESG" />
      <PostsTable posts={mo.posts} />

      <SectionHeader title="Lectura de Performance" />
      <ConclusionsPanel items={genSocialConclusions(mo, prev)} />

      {!isExternalReport() && (
        <>
          <SectionHeader title="Conclusión — Próximos Pasos" />
          <NextStepsPanel steps={genSocialNextSteps(mo, prev)} subtitle={`${accName} · ${ML[period] || period}`} />
        </>
      )}

      <Glossary keys="social" />
    </div>
  );
}
