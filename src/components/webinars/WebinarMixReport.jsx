import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ExternalLink } from 'lucide-react';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { getScoring } from '@/services/webinarsService';
import { WBN_STR, SCORING_EN } from '@/utils/webinarsI18n';
import { initialLang } from '@/utils/reportLang';
import { CU, PAL, CHART_TOOLTIP } from '@/constants/brand';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { Funnel } from '@/components/shared/Funnel';
import { NextStepsPanel } from '@/components/shared/PerformancePanels';
import { Glossary } from '@/components/shared/Glossary';
import { isExternalReport, isEmbedReport } from '@/utils/reportAudience';

const thCls = 'px-3 py-2 text-left text-[10px] font-bold uppercase tracking-[0.5px] text-cu-grey';
const tdCls = 'px-3 py-2 text-[12px] text-cu-dgrey';

function Note({ children, tone = 'cyan' }) {
  const border = tone === 'amber' ? 'border-l-amber-500' : 'border-l-cu-cyan';
  return (
    <div className={`mb-4 rounded-cu border border-cu-border border-l-4 ${border} bg-white px-4 py-3 text-[12px] leading-relaxed text-cu-dgrey shadow-cu`}>
      {children}
    </div>
  );
}

// Card destacada (azul marino) para las métricas clave de cada vista.
function HeroCard({ label, value, pill, pillTone = 'cyan', footnote }) {
  const pillCls =
    pillTone === 'green' ? 'bg-emerald-400/20 text-emerald-300' : 'bg-cu-cyan/20 text-cu-cyan';
  return (
    <div className="rounded-cu bg-cu-dblue px-5 pb-3.5 pt-4 text-white shadow-cu">
      <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.6px] text-cu-cyan">{label}</div>
      <div className="mb-2 text-[30px] font-bold leading-none tracking-tight">{value}</div>
      {pill && <span className={`inline-block rounded-full px-2 py-0.5 text-[10.5px] font-bold ${pillCls}`}>{pill}</span>}
      {footnote && <div className="mt-1.5 text-[9.5px] italic text-white/60">{footnote}</div>}
    </div>
  );
}

function FichaRow({ k, v }) {
  return (
    <div className="flex gap-4 border-b border-cu-border2 px-4 py-2.5 text-[12px] last:border-b-0">
      <span className="w-36 shrink-0 font-bold text-cu-cyan">{k}</span>
      <span className="text-cu-dgrey">{v}</span>
    </div>
  );
}

// Reporte MIXTO de webinar (Teams/Livestorm + Mailchimp + LinkedIn + HubSpot).
// Bilingüe ES/EN (default ES): labels en WBN_STR; los textos narrativos por
// evento viven en el seed con variante `...En` (fallback al español).
export function WebinarMixReport({ ev, accName }) {
  const external = isExternalReport();
  const [view, setView] = useState('general');
  const [lang, setLang] = useState(() => initialLang('es'));
  const t = WBN_STR[lang];
  const en = lang === 'en';
  // Texto narrativo del seed con variante EN (fallback al español).
  const tx = (obj, field) => (en ? (obj[`${field}En`] ?? obj[field]) : obj[field]);
  const num = (v) => Number(v || 0).toLocaleString(en ? 'en-US' : 'es-AR');
  const p1 = (v) => Number(v || 0).toLocaleString(en ? 'en-US' : 'es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const usd = (v) => '$' + Number(v || 0).toLocaleString(en ? 'en-US' : 'es-AR');

  const isGeneral = view === 'general';
  const glossaryKey = t.glossaryKeys[view === 'email' ? 'email' : view === 'social' ? 'social' : 'webinars'];
  const scoring = en ? SCORING_EN : getScoring();
  const evScoring = ev.scoring ?? null;
  const classes = evScoring?.classes ?? scoring.classes;
  const hotRange = classes[0].range;
  const dealsOnly = ev.deals.total - ev.deals.hot;
  const prioritized = ev.deals.hot + (ev.deals.warm ?? 0);
  const hotRows = ev.hotLeads.rows.filter((r) => (r.tier ?? 'HOT') === 'HOT');
  const avgScore = hotRows.length ? hotRows.reduce((a, r) => a + r.score, 0) / hotRows.length : 0;
  const hasRegByCountry = ev.countries.some((c) => c.reg != null);
  const sendName = (s, i) => (en ? (ev.email.sendNamesEn?.[i] ?? s.name) : s.name);
  const postName = (po, i) => (en ? (ev.social.postNamesEn?.[i] ?? po.name) : po.name);

  return (
    <div className="animate-fade-in">
      {/* ── Ficha del evento ── */}
      <SectionHeader title={ev.title} note={`${accName} · ${tx(ev, 'date')}`} />
      <div className="mb-5 grid gap-3 lg:grid-cols-3">
        <div className="overflow-hidden rounded-cu border border-cu-border bg-white shadow-cu lg:col-span-2">
          <FichaRow k={t.fTema} v={ev.tema ?? ev.subtitle} />
          <FichaRow k={t.fFecha} v={`${tx(ev, 'date')}${ev.reagendado ? t.reagendado : ''}`} />
          <FichaRow k={t.fIdioma} v={tx(ev, 'idioma')} />
          <FichaRow k={t.fAud} v={tx(ev, 'audiencia')} />
          <FichaRow k={t.fCanales} v={tx(ev, 'canales')} />
        </div>
        <div className="rounded-cu bg-cu-dblue px-5 py-4 text-white shadow-cu">
          <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.5px]">{t.serie}</div>
          <ul className="flex flex-col gap-1.5 text-[11.5px] text-white/80">
            {tx(ev, 'serieEmails').map((s) => (
              <li key={s} className="flex gap-2"><span className="text-cu-cyan">●</span>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Botonera de vistas + idioma + link al pipeline (siempre en paralelo) */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <SegmentedControl
          label={t.viewLabel}
          value={view}
          onChange={setView}
          size="sm"
          options={[
            { id: 'general', label: t.views.general },
            { id: 'webinar', label: t.views.webinar },
            { id: 'email', label: t.views.email },
            { id: 'social', label: t.views.social },
          ]}
        />
        <div className="flex items-end gap-3">
          <SegmentedControl value={lang} onChange={setLang} size="sm" options={[{ id: 'es', label: 'ES' }, { id: 'en', label: 'EN' }]} />
          {ev.hotLeads.pipelineUrl && (
            <a
              href={ev.hotLeads.pipelineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-cu bg-cu-dblue px-4 py-2 text-[11px] font-bold text-white transition-opacity hover:opacity-90"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {t.pipelineBtn}
            </a>
          )}
        </div>
      </div>

      {/* ── Key insights (general + webinar) ── */}
      {(isGeneral || view === 'webinar') && (
      <>
      <SectionHeader title={t.keyTitle} />
      <Note>
        <strong className="text-cu-dblue">{t.hallazgo}</strong> {tx(ev, 'highlight')}
      </Note>
      <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label={t.kReg} value={num(ev.registered)} footnote={t.regFoot(ev.regCountries, ev.externos.registered)} />
        <HeroCard
          label={t.kAtt}
          value={num(ev.attended)}
          pill={t.showRate(p1(ev.showRate))}
          footnote={t.attFoot(ev.externos.attended, ev.internos.attended)}
        />
        <KpiCard label={t.kEmails} value={num(ev.email.totalSent)} footnote={t.emailsFoot(ev.email.sends.length, num(ev.email.uniqueContacts))} />
        <HeroCard
          label={t.kDeals}
          value={num(ev.deals.total)}
          pill={t.hotPill(ev.deals.hot)}
          pillTone="green"
          footnote={tx(ev.deals, 'note') ?? `${ev.deals.hot} hot + ${dealsOnly} leads`}
        />
      </div>
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label={t.kDurTotal}
          value={ev.durationTotalLabel ?? (ev.durationTotalMin != null ? `${p1(ev.durationTotalMin)} min` : '—')}
          footnote={ev.durationTotalLabel == null && ev.durationTotalMin == null ? t.durNA : undefined}
        />
        <KpiCard label={t.kDurAvg} value={`${p1(ev.durationAvgMin)} min`} footnote={t.median(p1(ev.durationMedianMin))} />
        <KpiCard
          label={t.kUnique}
          value={ev.companies.unique != null ? num(ev.companies.unique) : '—'}
          footnote={tx(ev.companies, 'uniqueNote') ?? (ev.companies.unique == null ? t.uniqueFallback(ev.companies.featured.length) : undefined)}
        />
        <KpiCard label={t.kHighEng} value={num(ev.engagement.high)} footnote={t.highEngFoot} />
      </div>
      </>
      )}

      {/* Resumen por canal (solo vista General) */}
      {isGeneral && (
        <div className="mb-5 grid gap-3 lg:grid-cols-3">
          <div className="flex flex-col rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
            <div className="mb-2.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
              <span className="h-3 w-[3px] shrink-0 rounded-sm bg-cu-cyan" />
              {t.views.email}
            </div>
            <ul className="mb-3 flex flex-col gap-1.5 text-[12px] text-cu-dgrey">
              <li><strong className="text-cu-dblue">{num(ev.email.totalSent)}</strong>{t.sumEmail1('', ev.email.sends.length)[1]}</li>
              <li><strong className="text-cu-dblue">{p1(ev.email.openedOncePct)} %</strong>{t.sumEmail2}</li>
              <li><strong className="text-cu-dblue">{num(ev.email.regFromEmail)}</strong>{t.sumEmail3}</li>
            </ul>
            <button onClick={() => setView('email')} className="mt-auto self-start text-[11px] font-bold text-cu-cyan hover:underline">{t.verVista}</button>
          </div>
          <div className="flex flex-col rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
            <div className="mb-2.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
              <span className="h-3 w-[3px] shrink-0 rounded-sm bg-cu-cyan" />
              {t.views.social}
            </div>
            <ul className="mb-3 flex flex-col gap-1.5 text-[12px] text-cu-dgrey">
              <li><strong className="text-cu-dblue">{ev.social.posts.length}</strong>{t.sumSocial1()[0]}<strong className="text-cu-dblue">{num(ev.social.totals.imp)}</strong>{t.sumSocial1()[1]}</li>
              <li><strong className="text-cu-dblue">{num(ev.social.totals.clicks)}</strong>{t.sumSocial2(p1(ev.social.totals.ctr))}</li>
              {ev.social.regFromSocial != null ? (
                <li><strong className="text-cu-dblue">{num(ev.social.regFromSocial)}</strong>{t.sumSocial3lkd}</li>
              ) : ev.social.regOutsideEmail != null ? (
                <li><strong className="text-cu-dblue">{num(ev.social.regOutsideEmail)}</strong>{t.sumSocial3out}</li>
              ) : null}
            </ul>
            <button onClick={() => setView('social')} className="mt-auto self-start text-[11px] font-bold text-cu-cyan hover:underline">{t.verVista}</button>
          </div>
          <div className="flex flex-col rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
            <div className="mb-2.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
              <span className="h-3 w-[3px] shrink-0 rounded-sm bg-cu-cyan" />
              {t.views.webinar}
            </div>
            <ul className="mb-3 flex flex-col gap-1.5 text-[12px] text-cu-dgrey">
              <li><strong className="text-cu-dblue">{num(ev.registered)}</strong>{t.sumWbn1('', p1(ev.showRate))[0]}<strong className="text-cu-dblue">{num(ev.attended)}</strong>{t.sumWbn1('', p1(ev.showRate))[1]}</li>
              <li><strong className="text-cu-dblue">{num(ev.deals.total)}</strong>{t.sumWbn2}</li>
              <li><strong className="text-cu-dblue">{ev.deals.hot}</strong>{t.sumWbn3(ev.deals.hot, ev.deals.warm)}</li>
            </ul>
            <button onClick={() => setView('webinar')} className="mt-auto self-start text-[11px] font-bold text-cu-cyan hover:underline">{t.verVista}</button>
          </div>
        </div>
      )}

      {/* ── Detalle del evento (solo vista Webinar) ── */}
      {view === 'webinar' && (
      <>
      <div className="mb-5 grid gap-3 lg:grid-cols-2">
        <div className="rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
          <div className="mb-0.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
            <span className="h-3 w-[3px] shrink-0 rounded-sm bg-cu-cyan" />
            {t.countriesTitle}
          </div>
          <div className="mb-3.5 text-[10px] text-cu-grey">{t.countriesSub(ev.regCountries, hasRegByCountry)}</div>
          <div className="relative" style={{ height: ev.countries.length * (hasRegByCountry ? 38 : 30) + 40 }}>
            <ResponsiveContainer>
              <BarChart data={ev.countries} layout="vertical" margin={{ top: 0, right: 24, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="0" stroke={CU.border2} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: CU.grey }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={104} tick={{ fontSize: 10.5, fill: CU.dgrey }} axisLine={false} tickLine={false} />
                <Tooltip {...CHART_TOOLTIP} />
                {hasRegByCountry && <Legend wrapperStyle={{ fontSize: 11 }} />}
                {hasRegByCountry && <Bar dataKey="reg" name={t.serReg} fill={CU.dblue} radius={[0, 4, 4, 0]} maxBarSize={12} />}
                <Bar dataKey="att" name={t.serAtt} radius={[0, 4, 4, 0]} maxBarSize={12}>
                  {ev.countries.map((_, i) => (
                    <Cell key={i} fill={hasRegByCountry ? CU.cyan : PAL[i % PAL.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
            <div className="mb-2.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
              <span className="h-3 w-[3px] shrink-0 rounded-sm bg-cu-cyan" />
              {t.intExt}
            </div>
            <div className="flex gap-8">
              <div>
                <div className="text-[24px] font-bold leading-none text-cu-dblue">{ev.internos.total}</div>
                <div className="mt-1 text-[11px] text-cu-grey">{t.cuLabel(ev.internos.attended)}</div>
              </div>
              <div>
                <div className="text-[24px] font-bold leading-none text-cu-dblue">{ev.externos.registered}</div>
                <div className="mt-1 text-[11px] text-cu-grey">{t.extLabel(Math.round((ev.externos.registered / ev.registered) * 100))}</div>
              </div>
            </div>
          </div>
          <div className="flex-1 rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
            <div className="mb-0.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
              <span className="h-3 w-[3px] shrink-0 rounded-sm bg-cu-cyan" />
              {t.featured}
            </div>
            {ev.companies.featuredNote && (
              <div className="mb-2 text-[10px] text-cu-grey">{tx(ev.companies, 'featuredNote')}</div>
            )}
            <div className="flex flex-wrap gap-1.5">
              {ev.companies.featured.map((c) => (
                <span key={c} className="rounded-full bg-cu-bg px-2.5 py-1 text-[10.5px] font-medium text-cu-dgrey">{c}</span>
              ))}
            </div>
            {ev.companies.others?.length > 0 && (
              <>
                <div className="mb-2 mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-grey">
                  <span className="h-3 w-[3px] shrink-0 rounded-sm bg-cu-border" />
                  {t.resto}
                </div>
                <div className="flex flex-wrap gap-1">
                  {ev.companies.others.map((c) => (
                    <span key={c} className="rounded-full border border-cu-border2 px-2 py-0.5 text-[9.5px] text-cu-grey">{c}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Embudo del evento */}
      <SectionHeader title={t.funnelTitle} note="Livestorm / Teams" />
      <div className="mb-3 rounded-cu border border-cu-border bg-white px-7 pb-6 pt-6 shadow-cu">
        <div className="mx-auto max-w-[640px]">
          <Funnel
            stages={[
              { name: t.fsReg, value: ev.registered, desc: t.fsRegDesc(ev.regCountries), retention: '100 %' },
              { name: t.fsAtt, value: ev.attended, desc: t.showRate(p1(ev.showRate)), retention: `${p1(ev.showRate)} %` },
              { name: t.fsHigh, value: ev.engagement.high, desc: t.fsHighDesc, retention: `${p1((ev.engagement.high / ev.registered) * 100)} %` },
              {
                name: t.fsDeals,
                value: ev.deals.total,
                desc: ev.deals.warm != null ? `${ev.deals.hot} hot · ${ev.deals.warm} warm` : `${ev.deals.hot} hot leads`,
                retention: `${p1((ev.deals.total / ev.registered) * 100)} %`,
              },
            ]}
          />
        </div>
      </div>
      <div className="mb-5 grid grid-cols-3 gap-3">
        <KpiCard label={t.engHigh} value={num(ev.engagement.high)} footnote={t.engFoot(p1((ev.engagement.high / ev.attended) * 100))} />
        <KpiCard label={t.engMid} value={num(ev.engagement.mid)} footnote={t.engFoot(p1((ev.engagement.mid / ev.attended) * 100))} />
        <KpiCard label={t.engLow} value={num(ev.engagement.low)} footnote={t.engFoot(p1((ev.engagement.low / ev.attended) * 100))} />
      </div>

      </>
      )}

      {/* ── Sección 1: Email Marketing ── */}
      {view === 'email' && (
      <>
      <SectionHeader title={t.s1} note={t.s1note} />
      <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label={t.kEmails} value={num(ev.email.totalSent)} footnote={t.emailsFoot(ev.email.sends.length, num(ev.email.uniqueContacts))} />
        <KpiCard label={t.kOpened} value={num(ev.email.openedOnce)} delta={{ dir: 'flat', label: `${p1(ev.email.openedOncePct)} %` }} />
        <KpiCard label={t.kClicked} value={num(ev.email.clickedOnce)} delta={{ dir: 'flat', label: `${p1(ev.email.clickedOncePct)} %` }} />
        <HeroCard
          label={t.kRegEmail}
          value={num(ev.email.regFromEmail)}
          pill={t.regPill(ev.email.regFromEmailPct)}
          pillTone="green"
          footnote={
            ev.email.regInBase != null
              ? t.emailLayers(tx(ev.email, 'regFromEmailNote'), num(ev.email.regOpened), num(ev.email.regInBase), ev.email.regInBasePct)
              : (tx(ev.email, 'regFromEmailNote') ?? t.finalMetric)
          }
        />
      </div>
      <div className="mb-3 overflow-x-auto rounded-cu border border-cu-border bg-white shadow-cu">
        <table className="w-full min-w-[560px] border-collapse">
          <thead>
            <tr className="border-b-2 border-cu-cyan">
              <th className={thCls}>{t.thEmail}</th>
              <th className={thCls}>{t.thSent}</th>
              <th className={thCls}>{t.thOpen}</th>
              <th className={thCls}>{t.thClick}</th>
            </tr>
          </thead>
          <tbody>
            {ev.email.sends.map((s, i) => (
              <tr key={s.name} className="border-b border-cu-border2">
                <td className={`${tdCls} font-medium text-cu-dblue`}>{sendName(s, i)}</td>
                <td className={tdCls}>{num(s.sent)}</td>
                <td className={tdCls}>{p1(s.open)} %</td>
                <td className={tdCls}>{p1(s.click)} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>{tx(ev.email, 'nota')}</Note>
      {ev.email.notaClics && (
        <Note>
          <strong className="text-cu-dblue">{t.howRead}</strong> {tx(ev.email, 'notaClics')}
        </Note>
      )}
      </>
      )}

      {/* ── Sección 2: Social Media ── */}
      {view === 'social' && (
      <>
      <SectionHeader title={t.s2} note={t.s2note} />
      <div className={`mb-3 grid gap-3 ${ev.social.posts.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        {ev.social.posts.map((po, i) => (
          <div key={po.name} className="rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
            <div className="mb-2 text-[11px] font-bold text-cu-dblue">{postName(po, i)}</div>
            <div className="text-[26px] font-bold leading-none text-cu-dblue">{num(po.imp)}</div>
            <div className="mb-3 mt-0.5 text-[10px] text-cu-grey">{t.imprWord}</div>
            <div className="flex flex-col gap-1 text-[11.5px] text-cu-dgrey">
              <span>{t.postLine1(num(po.inter), p1(po.rate))}</span>
              <span>{t.postLine2(num(po.clicks), p1(po.ctr))}</span>
              <span>{t.postLine3(num(po.reactions))}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label={t.kPosts} value={ev.social.posts.length} />
        <KpiCard label={t.kImpTotal} value={num(ev.social.totals.imp)} delta={{ dir: 'flat', label: t.rateAvg(p1(ev.social.totals.rate)) }} />
        <KpiCard label={t.kClkTotal} value={num(ev.social.totals.clicks)} delta={{ dir: 'flat', label: t.ctrAvg(p1(ev.social.totals.ctr)) }} footnote={t.clkFoot(num(ev.social.totals.reactions), num(ev.social.totals.shares))} />
        {ev.social.regFromSocial != null ? (
          <HeroCard
            label={t.kRegLkd}
            value={num(ev.social.regFromSocial)}
            pill={t.regPill(ev.social.regFromSocialPct)}
            pillTone="green"
            footnote={t.finalMetric}
          />
        ) : ev.social.regOutsideEmail != null ? (
          <HeroCard
            label={t.kRegOut}
            value={num(ev.social.regOutsideEmail)}
            pill={t.regPill(ev.social.regOutsideEmailPct)}
            pillTone="green"
            footnote={t.regOutFoot}
          />
        ) : (
          <KpiCard label={t.kRegLkd} value="—" footnote={t.noAttr} />
        )}
      </div>
      <Note>{tx(ev.social, 'lectura')}</Note>
      </>
      )}

      {/* ── Sección 3: Hot Leads (solo vista Webinar) ── */}
      {view === 'webinar' && (
      <>
      <SectionHeader title={t.s3} note={t.s3note} />
      <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label={ev.scoring ? t.kPrior : t.kDealsTot} value={num(ev.scoring ? prioritized : ev.deals.total)} footnote={ev.scoring ? t.priorFoot(ev.deals.hot, ev.deals.warm, num(ev.externos.attended)) : (tx(ev.deals, 'note') ?? t.dealsTotFoot)} />
        <KpiCard label={t.kHot} value={num(ev.deals.hot)} accent="green" delta={{ dir: 'up', label: t.scorePill(hotRange) }} footnote={t.hotFoot} />
        <KpiCard label={ev.scoring ? t.kWarm : t.kRest} value={num(ev.deals.warm ?? dealsOnly)} footnote={t.warmFoot(classes[1].range)} />
        <KpiCard label={t.kScoreHot} value={p1(avgScore)} footnote={hotRows.length === 1 ? hotRows[0].empresa : t.scoreHotFoot(hotRows.length)} />
      </div>
      {!external && ev.hotLeads.universeNote && <Note>{tx(ev.hotLeads, 'universeNote')}</Note>}

      {/* Metodología de scoring (global o propia del evento) */}
      <div className="mb-5 grid gap-3 lg:grid-cols-2">
        <div className="overflow-hidden rounded-cu border border-cu-border bg-white shadow-cu">
          <div className="bg-cu-dblue px-5 py-3 text-[11px] font-bold uppercase tracking-[0.5px] text-white">
            {t.scoringTitle}
          </div>
          {evScoring ? (
            <p className="px-5 py-4 text-[12px] leading-relaxed text-cu-dgrey">{tx(evScoring, 'desc')}</p>
          ) : (
          <table className="w-full border-collapse">
            <tbody>
              {scoring.formula.map((f) => (
                <tr key={f.name} className="border-b border-cu-border2 last:border-b-0">
                  <td className={`${tdCls} w-44 font-medium text-cu-dblue`}>{f.name}<br /><span className="text-[10px] font-bold text-cu-cyan">{f.pts} {t.ptsWord}</span></td>
                  <td className={`${tdCls} text-[11px]`}>{f.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
        <div className="overflow-hidden rounded-cu border border-cu-border bg-white shadow-cu">
          <div className="bg-cu-dblue px-5 py-3 text-[11px] font-bold uppercase tracking-[0.5px] text-white">
            {t.clasifTitle}
          </div>
          <table className="w-full border-collapse">
            <tbody>
              {classes.map((c) => (
                <tr key={c.name} className="border-b border-cu-border2 last:border-b-0">
                  <td className={`${tdCls} w-36 font-medium text-cu-dblue`}>{c.name}<br /><span className="text-[10px] font-bold text-cu-cyan">{t.scoreWord} {c.range}</span></td>
                  <td className={`${tdCls} text-[11px]`}>{en ? (c.actionEn ?? c.action) : c.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diagnóstico de madurez */}
      {ev.surveys?.length > 0 && (
      <>
      <SectionHeader title={t.surveysTitle} note={t.surveysNote} />
      <div className="mb-5 grid gap-3 lg:grid-cols-3">
        {ev.surveys.map((s) => (
          <div key={s.q} className="rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="text-[12px] font-bold leading-snug text-cu-dblue">{s.q}</div>
              <span className="shrink-0 text-[9.5px] text-cu-grey">{s.n} {t.resp}</span>
            </div>
            <div className="flex flex-col gap-2">
              {s.items.map(([label, pct]) => (
                <div key={label}>
                  <div className="mb-0.5 flex justify-between text-[11px] text-cu-dgrey">
                    <span>{label}</span>
                    <span className="font-bold text-cu-dblue">{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-cu-bg">
                    <div className="h-1.5 rounded-full bg-cu-cyan" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      </>
      )}

      </>
      )}

      {/* ── Oportunidad comercial (general + webinar) ── */}
      {(isGeneral || view === 'webinar') && (
      <>
      <SectionHeader title={t.comTitle} note={t.comNote} />
      {ev.commercial.pipelinePotential != null ? (
        <>
          <div className="mb-3 grid gap-3 lg:grid-cols-2">
            <div className="rounded-cu bg-cu-dblue px-6 py-5 text-white shadow-cu">
              <div className="text-[30px] font-bold leading-none">{usd(ev.commercial.pipelinePotential)}</div>
              <div className="mt-2 text-[12px] font-bold">{t.pipePot}</div>
              <div className="mt-1 text-[10.5px] text-white/60">{tx(ev.commercial, 'pipelinePotentialNote')}</div>
            </div>
            <div className="rounded-cu border border-cu-border bg-cu-cyan/[0.06] px-6 py-5 shadow-cu">
              <div className="text-[30px] font-bold leading-none text-cu-dblue">{usd(ev.commercial.hotPipeline)}</div>
              <div className="mt-2 text-[12px] font-bold text-cu-cyan">{t.pipeHot}</div>
              <div className="mt-1 text-[10.5px] text-cu-grey">{tx(ev.commercial, 'hotPipelineNote')}</div>
            </div>
          </div>
          <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
            <KpiCard label={t.close} value={usd(ev.commercial.closeLow)} footnote={tx(ev.commercial, 'closeLowNote')} />
            <KpiCard label={t.close} value={usd(ev.commercial.closeHigh)} footnote={tx(ev.commercial, 'closeHighNote')} />
            <KpiCard
              label={t.roi}
              value={ev.commercial.roi}
              accent="amber"
              footnote={ev.commercial.productionCost != null ? t.roiFoot(usd(ev.commercial.productionCost)) : t.costPend}
            />
          </div>
        </>
      ) : null}
      <p className="mb-5 text-[10.5px] italic leading-relaxed text-cu-grey">
        {t.metod} {tx(ev.commercial, 'metodologia')}
        {ev.commercial.productionCost != null && t.costLine(usd(ev.commercial.productionCost))}
      </p>

      {/* ── Plan de acción: SOLO en el descargable de uso interno ── */}
      {isEmbedReport() && !external && (
        <>
          <SectionHeader title={t.nextTitle} />
          <NextStepsPanel steps={tx(ev, 'actionPlan')} subtitle={`${ev.title} · ${tx(ev, 'date')}`} title={t.planTitle} />
        </>
      )}

      </>
      )}

      <Glossary keys={glossaryKey} />
    </div>
  );
}
