import { useEffect, useState } from 'react';
import { initialLang } from '@/utils/reportLang';
import { listAccounts, getPlan } from '@/services/plansService';
import { PLANS_STR } from '@/utils/plansI18n';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { KpiCard } from '@/components/shared/KpiCard';
import { NextStepsPanel } from '@/components/shared/PerformancePanels';
import { NoDataScreen } from '@/components/shared/NoDataScreen';

const EMBED = typeof window !== 'undefined' ? window.__REPORT_EMBED__ : null;

const STATUS_CLS = {
  done: 'bg-cu-cyan/10 text-[#1372a5]',
  progress: 'bg-[#d4a72c]/15 text-[#8a6a10]',
  pending: 'bg-cu-grey/10 text-cu-grey',
};
const PRIORITY_CLS = { high: 'font-bold text-[#a02020]', medium: 'text-cu-dgrey' };

function FichaRow({ k, v }) {
  return (
    <div className="flex gap-4 border-b border-cu-border2 px-4 py-2.5 text-[12px] last:border-b-0">
      <span className="w-36 shrink-0 font-bold text-cu-cyan">{k}</span>
      <span className="text-cu-dgrey">{v}</span>
    </div>
  );
}

const thCls = 'bg-cu-dblue px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.5px] text-white';
const tdCls = 'border-b border-cu-border2 px-4 py-2.5 text-[12px] text-cu-dgrey';

// ════════════════════════════════════════════════════════════════
//  Vista PLANES — informe mensual de avance de un plan regional de
//  marketing. Es información de gestión (objetivo, entregables, próximos
//  pasos y tracker), transcripta del informe del equipo: no se generan
//  insights ni métricas. Misma estética y estructura que los pilares
//  (ficha, KPIs, tablas, panel de próximos pasos) y toggle ES/EN.
// ════════════════════════════════════════════════════════════════
export function PlansApp({ account, period }) {
  const compute = () => getPlan(account, period);
  const [plan, setPlan] = useState(compute);
  const [lang, setLang] = useState(() => initialLang('es'));
  useEffect(() => {
    if (EMBED) return;
    setPlan(getPlan(account, period));
  }, [account, period]);

  const t = PLANS_STR[lang];
  const en = lang === 'en';
  const tx = (obj, field) => (en ? (obj[`${field}En`] ?? obj[field]) : obj[field]);
  const accName = listAccounts().find((a) => a.id === account)?.name ?? '';

  if (!plan) return <NoDataScreen lang={lang} detail={t.noData} />;

  const langToggle = (
    <SegmentedControl
      value={lang}
      onChange={setLang}
      size="sm"
      options={[
        { id: 'es', label: 'ES' },
        { id: 'en', label: 'EN' },
      ]}
    />
  );

  return (
    <div className="animate-fade-in">
      {/* ── Ficha del informe ── */}
      <SectionHeader title={tx(plan, 'title')} note={`${accName} · ${t.reportNo(plan.reportNo)}`} />
      <div className="mb-5 grid gap-3 lg:grid-cols-3">
        <div className="overflow-hidden rounded-cu border border-cu-border bg-white shadow-cu lg:col-span-2">
          <FichaRow k={t.fClient} v={accName} />
          <FichaRow k={t.fProgram} v={tx(plan, 'program')} />
          <FichaRow k={t.fPeriod} v={tx(plan, 'period')} />
          <FichaRow k={t.fMarket} v={tx(plan, 'market')} />
        </div>
        <div className="rounded-cu bg-cu-dblue px-5 py-4 text-white shadow-cu">
          <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.5px]">{tx(plan, 'objectiveTitle')}</div>
          <ul className="flex flex-col gap-1.5 text-[11.5px] text-white/80">
            {tx(plan, 'objective').map((s) => (
              <li key={s} className="flex gap-2"><span className="text-cu-cyan">●</span>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-4 flex justify-end">{langToggle}</div>

      {/* ── Objetivo del plan ── */}
      <div className="mb-5 rounded-cu border-l-4 border-cu-cyan bg-white px-5 py-4 text-[12.5px] leading-relaxed text-cu-dgrey shadow-cu">
        {tx(plan, 'intro')}
      </div>

      {/* ── Indicadores del mes ── */}
      <SectionHeader title={t.metricsTitle} note={tx(plan, 'period')} />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {plan.kpis.map((k) => (
          <KpiCard key={k.label} label={tx(k, 'label')} value={tx(k, 'value')} />
        ))}
      </div>

      {/* ── Entregables ── */}
      <SectionHeader title={t.deliverablesTitle} note={t.deliverablesNote} />
      <div className="mb-5 overflow-x-auto rounded-cu border border-cu-border bg-white shadow-cu">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={thCls}>{t.hDeliverable}</th>
              <th className={thCls}>{t.hStatus}</th>
              <th className={thCls}>{t.hOutcome}</th>
            </tr>
          </thead>
          <tbody>
            {plan.deliverables.map((d) => (
              <tr key={d.name} className="last:[&>td]:border-b-0">
                <td className={`${tdCls} font-medium text-cu-dblue`}>{tx(d, 'name')}</td>
                <td className={tdCls}>
                  <span className={`inline-flex rounded-full px-2.5 py-[3px] text-[10.5px] font-medium ${STATUS_CLS[d.status]}`}>{t.status[d.status]}</span>
                </td>
                <td className={tdCls}>{tx(d, 'outcome')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Próximos pasos (son contenido del informe: se muestran siempre) ── */}
      <NextStepsPanel steps={tx(plan, 'nextSteps')} title={tx(plan, 'nextTitle')} subtitle={`${tx(plan, 'title')} · ${t.reportNo(plan.reportNo)}`} />

      {/* ── Tracker de acciones ── */}
      <SectionHeader title={tx(plan, 'trackerTitle')} note={t.trackerNote} />
      <div className="mb-5 overflow-x-auto rounded-cu border border-cu-border bg-white shadow-cu">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={thCls}>{t.hAction}</th>
              <th className={thCls}>{t.hStatus}</th>
              <th className={thCls}>{t.hPriority}</th>
            </tr>
          </thead>
          <tbody>
            {plan.tracker.map((a) => (
              <tr key={a.name} className="last:[&>td]:border-b-0">
                <td className={`${tdCls} font-medium text-cu-dblue`}>{tx(a, 'name')}</td>
                <td className={tdCls}>
                  <span className={`inline-flex rounded-full px-2.5 py-[3px] text-[10.5px] font-medium ${STATUS_CLS[a.status]}`}>{t.status[a.status]}</span>
                </td>
                <td className={`${tdCls} ${a.priority ? PRIORITY_CLS[a.priority] : 'text-cu-grey'}`}>{a.priority ? t.priority[a.priority] : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {EMBED && <p className="mb-2 text-[10.5px] italic text-cu-grey">{t.embedNote}</p>}
    </div>
  );
}
