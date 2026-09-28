import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { initialLang } from '@/utils/reportLang';
import { listAccounts, getPlan } from '@/services/plansService';
import { PLANS_STR } from '@/utils/plansI18n';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { KpiCard } from '@/components/shared/KpiCard';
import { HeroCard } from '@/components/shared/HeroCard';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { BarBottom } from '@/components/brand/BrandBars';
import { MarCommsLogo } from '@/components/brand/Logo';
import { Tagline } from '@/components/brand/Tagline';

const EMBED = typeof window !== 'undefined' ? window.__REPORT_EMBED__ : null;

// Evento con el que App fija el idioma de la vista antes de imprimir a PDF.
export const SET_LANG_EVENT = 'marcomms:setlang';

const STATUS_CLS = {
  done: 'bg-cu-cyan/10 text-[#1372a5]',
  progress: 'bg-[#d4a72c]/15 text-[#8a6a10]',
  pending: 'bg-cu-grey/10 text-cu-grey',
};

function FichaRow({ k, v }) {
  return (
    <div className="flex gap-4 border-b border-cu-border2 px-4 py-2.5 text-[12px] last:border-b-0">
      <span className="w-36 shrink-0 font-bold text-cu-cyan">{k}</span>
      <span className="text-cu-dgrey">{v}</span>
    </div>
  );
}

// Tailwind no genera clases dinámicas: span de la etiqueta según la cantidad de KPIs del grupo.
const GRIDCOLS_CLS = { 4: 'sm:grid-cols-4 print:grid-cols-4', 5: 'sm:grid-cols-5 print:grid-cols-5', 6: 'sm:grid-cols-6 print:grid-cols-6', 7: 'sm:grid-cols-7 print:grid-cols-7', 8: 'sm:grid-cols-8 print:grid-cols-8' };
const COLSPAN_CLS = { 1: 'sm:col-span-1 print:col-span-1', 2: 'sm:col-span-2 print:col-span-2', 3: 'sm:col-span-3 print:col-span-3', 4: 'sm:col-span-4 print:col-span-4' };

const thCls = 'bg-cu-dblue px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.5px] text-white';
const tdCls = 'border-b border-cu-border2 px-4 py-2.5 text-[12px] text-cu-dgrey';

function StatusPill({ status, t }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-[3px] text-[10.5px] font-medium ${STATUS_CLS[status]}`}>{t.status[status]}</span>;
}

// ════════════════════════════════════════════════════════════════
//  Vista PLANES — informe mensual de avance de un plan regional de
//  marketing. Es información de gestión (KPIs, entregables, iniciativas),
//  transcripta del informe del equipo: no se generan insights ni métricas.
//  Misma estética y estructura que los pilares (ficha, KPIs, tablas) y
//  toggle ES/EN. Imprimible: la descarga en PDF usa la impresión del
//  navegador con los controles ocultos (`print:hidden`).
// ════════════════════════════════════════════════════════════════
export function PlansApp({ account, period }) {
  const compute = () => getPlan(account, period);
  const [plan, setPlan] = useState(compute);
  const [lang, setLang] = useState(() => initialLang('es'));
  useEffect(() => {
    if (EMBED) return;
    setPlan(getPlan(account, period));
  }, [account, period]);
  // App fija el idioma antes de imprimir a PDF (el toggle queda oculto en el papel).
  useEffect(() => {
    const onSet = (e) => e.detail && setLang(e.detail);
    window.addEventListener(SET_LANG_EVENT, onSet);
    return () => window.removeEventListener(SET_LANG_EVENT, onSet);
  }, []);

  const t = PLANS_STR[lang];
  const en = lang === 'en';
  const tx = (obj, field) => (en ? (obj[`${field}En`] ?? obj[field]) : obj[field]);
  const accName = listAccounts().find((a) => a.id === account)?.name ?? '';

  if (!plan) return <NoDataScreen lang={lang} detail={t.noData} />;

  const done = plan.deliverables.filter((d) => d.status === 'done');
  const progress = plan.deliverables.filter((d) => d.status === 'progress');

  // La columna «Link» aparece solo en la tabla cuyas filas traen `links`
  // ([{ label, labelEn?, url }]). En el PDF los links quedan clicables con su etiqueta.
  const deliverablesTable = (rows) => {
    const hasLinks = rows.some((d) => d.links?.length);
    return (
    <div className="mb-5 overflow-x-auto rounded-cu border border-cu-border bg-white shadow-cu">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className={`${thCls} w-10`}>#</th>
            <th className={thCls}>{t.hDeliverable}</th>
            <th className={thCls}>{t.hStatus}</th>
            <th className={thCls}>{t.hDetail}</th>
            {hasLinks && <th className={thCls}>{t.hLink}</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((d, i) => (
            <tr key={d.name} className="last:[&>td]:border-b-0">
              <td className={`${tdCls} text-cu-grey`}>{i + 1}</td>
              <td className={`${tdCls} font-medium text-cu-dblue`}>{tx(d, 'name')}</td>
              <td className={tdCls}><StatusPill status={d.status} t={t} /></td>
              <td className={tdCls}>{tx(d, 'desc')}</td>
              {hasLinks && (
                <td className={`${tdCls} whitespace-nowrap`}>
                  <div className="flex flex-col gap-1">
                    {(d.links ?? []).map((l) => (
                      <a
                        key={l.url}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11.5px] font-bold text-cu-cyan hover:underline print:underline"
                      >
                        <ExternalLink className="h-3 w-3 print:hidden" />
                        {tx(l, 'label')}
                      </a>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
  };

  return (
    <table className="print-page-wrap w-full table-fixed border-collapse">
      {/* Solo al imprimir: filas espaciadoras que se repiten en cada hoja como
          margen superior e inferior (con @page margin 0 no hay otro modo). */}
      <thead className="print-page-spacer hidden print:table-header-group"><tr><td /></tr></thead>
      <tfoot className="print-page-spacer hidden print:table-footer-group"><tr><td /></tr></tfoot>
      <tbody>
      <tr>
      <td className="p-0 align-top">
    <div className="animate-fade-in">
      {/* ── Ficha del informe ── */}
      <SectionHeader title={tx(plan, 'title')} note={`${accName} · ${t.reportNote(tx(plan, 'period'))}`} />
      <div className="mb-5 grid gap-3 lg:grid-cols-3 print:grid-cols-3">
        <div className="overflow-hidden rounded-cu border border-cu-border bg-white shadow-cu lg:col-span-2 print:col-span-2">
          <FichaRow k={t.fClient} v={accName} />
          <FichaRow k={t.fProgram} v={tx(plan, 'program')} />
          <FichaRow k={t.fPeriod} v={tx(plan, 'period')} />
          <FichaRow k={t.fMarket} v={tx(plan, 'market')} />
        </div>
        <div className="rounded-cu bg-cu-dblue px-5 py-4 text-white shadow-cu">
          <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.5px]">{tx(plan, 'summaryTitle')}</div>
          <ul className="flex flex-col gap-1.5 text-[11.5px] text-white/80">
            {tx(plan, 'summary').map((s) => (
              <li key={s} className="flex gap-2"><span className="text-cu-cyan">●</span>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-4 flex justify-end print:hidden">
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

      {/* ── Objetivo del plan ── */}
      <div className="mb-5 rounded-cu border-l-4 border-cu-cyan bg-white px-5 py-4 text-[12.5px] leading-relaxed text-cu-dgrey shadow-cu">
        {tx(plan, 'intro')}
      </div>

      {/* ── KPIs ── */}
      <SectionHeader title={t.kpisTitle} note={t.kpisNote} />
      {/* Una sola fila de 5 columnas iguales: etiqueta de cada grupo arriba, cards del
          mismo ancho y alto (grid). Performance va en la card destacada (azul marino). */}
      <div className={`mb-5 grid grid-cols-1 gap-3 print:break-inside-avoid ${GRIDCOLS_CLS[plan.kpiGroups.reduce((n, g) => n + g.items.length, 0)] ?? GRIDCOLS_CLS[6]}`}>
        {plan.kpiGroups.map((g, gi) => (
          <div
            key={`lbl-${g.name}`}
            className={`print-keep -mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue ${COLSPAN_CLS[g.items.length] ?? ''}`}
          >
            <span className={`h-2 w-2 rounded-full ${gi === 0 ? 'bg-cu-cyan' : 'border-[1.5px] border-cu-cyan'}`} />
            {tx(g, 'name')}
          </div>
        ))}
        {plan.kpiGroups.flatMap((g, gi) =>
          g.items.map((k) =>
            gi === 0 ? (
              <KpiCard
                key={k.label}
                label={tx(k, 'label')}
                value={k.value == null ? '—' : tx(k, 'value')}
                accent={k.value == null ? 'amber' : 'cyan'}
                footnote={k.value == null ? t.noValue : (tx(k, 'note') ?? undefined)}
              />
            ) : (
              <HeroCard
                key={k.label}
                label={tx(k, 'label')}
                value={k.value == null ? '—' : tx(k, 'value')}
                unit={k.value == null ? undefined : k.unit}
                pill={tx(k, 'pill')}
                footnote={k.value == null ? t.noValue : (tx(k, 'note') ?? undefined)}
              />
            ),
          ),
        )}
      </div>

      {/* ── Entregables ── */}
      <SectionHeader title={t.deliverablesTitle} note={t.deliverablesNote} />
      <div className="print-keep mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
        <span className="h-2 w-2 rounded-full bg-cu-cyan" />
        {t.groupDone(done.length)}
      </div>
      {deliverablesTable(done)}
      <div className="print-keep mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
        <span className="h-2 w-2 rounded-full border-[1.5px] border-cu-cyan" />
        {t.groupProgress(progress.length)}
      </div>
      {deliverablesTable(progress)}

      {/* ── Iniciativas ── */}
      <SectionHeader title={t.initiativesTitle} note={t.initiativesNote} />
      {plan.initiativeGroups.map((g) => (
        <div key={g.name}>
          <div className="print-keep mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
            <span className="h-2 w-2 rounded-full bg-cu-cyan" />
            {tx(g, 'name')} · {g.items.length}
          </div>
          <div className="mb-5 overflow-x-auto rounded-cu border border-cu-border bg-white shadow-cu">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={`${thCls} w-10`}>#</th>
                  <th className={thCls}>{t.hInitiative}</th>
                  <th className={thCls}>{t.hDetail}</th>
                </tr>
              </thead>
              <tbody>
                {g.items.map((it, i) => (
                  <tr key={it.name} className="last:[&>td]:border-b-0">
                    <td className={`${tdCls} text-cu-grey`}>{i + 1}</td>
                    <td className={`${tdCls} font-medium text-cu-dblue`}>{tx(it, 'name')}</td>
                    <td className={tdCls}>{tx(it, 'desc')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      {EMBED && <p className="mb-2 text-[10.5px] italic text-cu-grey print:hidden">{t.embedNote}</p>}
      {/* Cierre de marca solo en el PDF (en pantalla lo dibuja App al pie): barra
          azul + logo MarComms enfrentado al tagline, dentro del flujo para que
          no quede solo en una hoja aparte. */}
      <div className="hidden print:block print:break-inside-avoid">
        <BarBottom />
        <div className="flex items-center justify-between pt-3.5">
          <MarCommsLogo className="h-5" />
          <Tagline />
        </div>
      </div>
    </div>
      </td>
      </tr>
      </tbody>
    </table>
  );
}
