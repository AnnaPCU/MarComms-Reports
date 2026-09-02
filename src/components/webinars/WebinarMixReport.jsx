import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ExternalLink } from 'lucide-react';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { getScoring } from '@/services/webinarsService';
import { CU, PAL, CHART_TOOLTIP } from '@/constants/brand';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { Funnel } from '@/components/shared/Funnel';
import { NextStepsPanel } from '@/components/shared/PerformancePanels';
import { Glossary } from '@/components/shared/Glossary';
import { isExternalReport, isEmbedReport } from '@/utils/reportAudience';

const num = (v) => Number(v || 0).toLocaleString('es-AR');
const p1 = (v) => Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const usd = (v) => '$' + Number(v || 0).toLocaleString('es-AR');

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

function FichaRow({ k, v }) {
  return (
    <div className="flex gap-4 border-b border-cu-border2 px-4 py-2.5 text-[12px] last:border-b-0">
      <span className="w-36 shrink-0 font-bold text-cu-cyan">{k}</span>
      <span className="text-cu-dgrey">{v}</span>
    </div>
  );
}

// Reporte MIXTO de webinar: combina Livestorm (evento) + Mailchimp (campaña
// previa) + LinkedIn (posteos) + HubSpot (deals / hot leads). Pensado para
// entrega al cliente (vista externa) además de la mejora interna.
export function WebinarMixReport({ ev, accName }) {
  const external = isExternalReport();
  // Vistas del reporte: general (todo) o por canal. El descargable mantiene
  // la botonera funcionando (mismo patrón que las campañas GEO de Paid).
  const [view, setView] = useState('general');
  // General = resumen conciso (key insights + resumen por canal + comercial).
  // El detalle completo de cada canal vive en su propia vista.
  const isGeneral = view === 'general';
  const glossaryKey = view === 'email' ? 'email' : view === 'social' ? 'social' : 'webinars';
  const scoring = getScoring();
  const evScoring = ev.scoring ?? null; // scoring propio del evento (si lo hay)
  const classes = evScoring?.classes ?? scoring.classes;
  const hotRange = classes[0].range;
  const dealsOnly = ev.deals.total - ev.deals.hot;
  const prioritized = ev.deals.hot + (ev.deals.warm ?? 0);
  const hotRows = ev.hotLeads.rows.filter((r) => (r.tier ?? 'HOT') === 'HOT');
  const avgScore = hotRows.length ? hotRows.reduce((a, r) => a + r.score, 0) / hotRows.length : 0;
  const hasRegByCountry = ev.countries.some((c) => c.reg != null);

  return (
    <div className="animate-fade-in">
      {/* ── Ficha del evento ── */}
      <SectionHeader title={ev.title} note={`${accName} · ${ev.date}`} />
      <div className="mb-5 grid gap-3 lg:grid-cols-3">
        <div className="overflow-hidden rounded-cu border border-cu-border bg-white shadow-cu lg:col-span-2">
          <FichaRow k="Tema" v={ev.tema ?? ev.subtitle} />
          <FichaRow k="Fecha" v={`${ev.date}${ev.reagendado ? ' (reagendado desde una fecha anterior)' : ''}`} />
          <FichaRow k="Idioma" v={ev.idioma} />
          <FichaRow k="Audiencia objetivo" v={ev.audiencia} />
          <FichaRow k="Canales" v={ev.canales} />
        </div>
        <div className="rounded-cu bg-cu-dblue px-5 py-4 text-white shadow-cu">
          <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.5px]">Serie de emails</div>
          <ul className="flex flex-col gap-1.5 text-[11.5px] text-white/80">
            {ev.serieEmails.map((s) => (
              <li key={s} className="flex gap-2"><span className="text-cu-cyan">●</span>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Botonera de vistas + link al pipeline (siempre en paralelo) */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <SegmentedControl
          label="Vista"
          value={view}
          onChange={setView}
          size="sm"
          options={[
            { id: 'general', label: 'General' },
            { id: 'webinar', label: 'Webinar' },
            { id: 'email', label: 'Email Marketing' },
            { id: 'social', label: 'Social Media' },
          ]}
        />
        {ev.hotLeads.pipelineUrl && (
          <a
            href={ev.hotLeads.pipelineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-cu bg-cu-dblue px-4 py-2 text-[11px] font-bold text-white transition-opacity hover:opacity-90"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Link al pipeline
          </a>
        )}
      </div>

      {/* ── Key insights (general + webinar) ── */}
      {(isGeneral || view === 'webinar') && (
      <>
      <SectionHeader title="Key Insights del Evento" />
      <Note>
        <strong className="text-cu-dblue">Principal hallazgo:</strong> {ev.highlight}
      </Note>
      <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Registrados" value={num(ev.registered)} footnote={`${ev.regCountries} países · ${ev.externos.registered} externos`} />
        {/* Destacadas: Asistentes y Deals en HubSpot (hero-cards) */}
        <div className="rounded-cu bg-cu-dblue px-5 pb-3.5 pt-4 text-white shadow-cu">
          <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.6px] text-cu-cyan">Asistentes</div>
          <div className="mb-2 text-[30px] font-bold leading-none tracking-tight">{num(ev.attended)}</div>
          <span className="inline-block rounded-full bg-cu-cyan/20 px-2 py-0.5 text-[10.5px] font-bold text-cu-cyan">{p1(ev.showRate)} % show rate</span>
          <div className="mt-1.5 text-[9.5px] italic text-white/60">{ev.attendedNote ?? `${ev.externos.attended} externos · ${ev.internos.attended} internos`}</div>
        </div>
        <KpiCard label="Emails enviados" value={num(ev.email.totalSent)} footnote={`${ev.email.sends.length} envíos · ${num(ev.email.uniqueContacts)} contactos únicos`} />
        <div className="rounded-cu bg-cu-dblue px-5 pb-3.5 pt-4 text-white shadow-cu">
          <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.6px] text-cu-cyan">Deals en HubSpot</div>
          <div className="mb-2 text-[30px] font-bold leading-none tracking-tight">{num(ev.deals.total)}</div>
          <span className="inline-block rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10.5px] font-bold text-emerald-300">▲ {ev.deals.hot} hot {ev.deals.hot === 1 ? 'lead' : 'leads'}</span>
          <div className="mt-1.5 text-[9.5px] italic text-white/60">{ev.deals.note ?? `${ev.deals.hot} hot + ${dealsOnly} leads`}</div>
        </div>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="Duración total del evento"
          value={ev.durationTotalLabel ?? (ev.durationTotalMin != null ? `${p1(ev.durationTotalMin)} min` : '—')}
          footnote={ev.durationTotalLabel == null && ev.durationTotalMin == null ? 'Dato no disponible para este evento' : undefined}
        />
        <KpiCard label="Duración media de asistentes" value={`${p1(ev.durationAvgMin)} min`} footnote={`Mediana: ${p1(ev.durationMedianMin)} min`} />
        <KpiCard
          label="Empresas únicas"
          value={ev.companies.unique != null ? num(ev.companies.unique) : '—'}
          footnote={ev.companies.uniqueNote ?? (ev.companies.unique == null ? `${ev.companies.featured.length} empresas destacadas identificadas` : undefined)}
        />
        <KpiCard label="Alto engagement" value={num(ev.engagement.high)} footnote={`Asistentes que se quedaron ≥80% del webinar`} />
      </div>
      </>
      )}

      {/* Resumen por canal (solo vista General) */}
      {isGeneral && (
        <div className="mb-5 grid gap-3 lg:grid-cols-3">
          <div className="flex flex-col rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
            <div className="mb-2.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
              <span className="h-3 w-[3px] shrink-0 rounded-sm bg-cu-cyan" />
              Email Marketing
            </div>
            <ul className="mb-3 flex flex-col gap-1.5 text-[12px] text-cu-dgrey">
              <li><strong className="text-cu-dblue">{num(ev.email.totalSent)}</strong> emails · {ev.email.sends.length} envíos</li>
              <li><strong className="text-cu-dblue">{p1(ev.email.openedOncePct)} %</strong> abrió al menos un email</li>
              <li><strong className="text-cu-dblue">{num(ev.email.regFromEmail)}</strong> registrados con clic en la campaña</li>
            </ul>
            <button onClick={() => setView('email')} className="mt-auto self-start text-[11px] font-bold text-cu-cyan hover:underline">Ver vista completa →</button>
          </div>
          <div className="flex flex-col rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
            <div className="mb-2.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
              <span className="h-3 w-[3px] shrink-0 rounded-sm bg-cu-cyan" />
              Social Media
            </div>
            <ul className="mb-3 flex flex-col gap-1.5 text-[12px] text-cu-dgrey">
              <li><strong className="text-cu-dblue">{ev.social.posts.length}</strong> posteos · <strong className="text-cu-dblue">{num(ev.social.totals.imp)}</strong> impresiones</li>
              <li><strong className="text-cu-dblue">{num(ev.social.totals.clicks)}</strong> clics · {p1(ev.social.totals.ctr)} % CTR</li>
              {ev.social.regFromSocial != null ? (
                <li><strong className="text-cu-dblue">{num(ev.social.regFromSocial)}</strong> registrados vía LinkedIn</li>
              ) : ev.social.regOutsideEmail != null ? (
                <li><strong className="text-cu-dblue">{num(ev.social.regOutsideEmail)}</strong> registros fuera de la base de email</li>
              ) : null}
            </ul>
            <button onClick={() => setView('social')} className="mt-auto self-start text-[11px] font-bold text-cu-cyan hover:underline">Ver vista completa →</button>
          </div>
          <div className="flex flex-col rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
            <div className="mb-2.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
              <span className="h-3 w-[3px] shrink-0 rounded-sm bg-cu-cyan" />
              Webinar
            </div>
            <ul className="mb-3 flex flex-col gap-1.5 text-[12px] text-cu-dgrey">
              <li><strong className="text-cu-dblue">{num(ev.registered)}</strong> registrados → <strong className="text-cu-dblue">{num(ev.attended)}</strong> asistentes ({p1(ev.showRate)} %)</li>
              <li><strong className="text-cu-dblue">{num(ev.deals.total)}</strong> deals en HubSpot</li>
              <li><strong className="text-cu-dblue">{ev.deals.hot}</strong> hot {ev.deals.hot === 1 ? 'lead' : 'leads'}{ev.deals.warm != null ? ` + ${ev.deals.warm} warm` : ''}</li>
            </ul>
            <button onClick={() => setView('webinar')} className="mt-auto self-start text-[11px] font-bold text-cu-cyan hover:underline">Ver vista completa →</button>
          </div>
        </div>
      )}

      {/* ── Detalle del evento (solo vista Webinar) ── */}
      {view === 'webinar' && (
      <>
      {/* Países + interno/externo + empresas */}
      <div className="mb-5 grid gap-3 lg:grid-cols-2">
        <div className="rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
          <div className="mb-0.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
            <span className="h-3 w-[3px] shrink-0 rounded-sm bg-cu-cyan" />
            Países de los asistentes
          </div>
          <div className="mb-3.5 text-[10px] text-cu-grey">Entre los registrados hubo {ev.regCountries} países en total{hasRegByCountry ? ' · top por registros (externos)' : ''}</div>
          <div className="relative" style={{ height: ev.countries.length * (hasRegByCountry ? 38 : 30) + 40 }}>
            <ResponsiveContainer>
              <BarChart data={ev.countries} layout="vertical" margin={{ top: 0, right: 24, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="0" stroke={CU.border2} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: CU.grey }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={104} tick={{ fontSize: 10.5, fill: CU.dgrey }} axisLine={false} tickLine={false} />
                <Tooltip {...CHART_TOOLTIP} />
                {hasRegByCountry && <Legend wrapperStyle={{ fontSize: 11 }} />}
                {hasRegByCountry && <Bar dataKey="reg" name="Registrados" fill={CU.dblue} radius={[0, 4, 4, 0]} maxBarSize={12} />}
                <Bar dataKey="att" name="Asistentes" radius={[0, 4, 4, 0]} maxBarSize={12}>
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
              Interno vs externo
            </div>
            <div className="flex gap-8">
              <div>
                <div className="text-[24px] font-bold leading-none text-cu-dblue">{ev.internos.total}</div>
                <div className="mt-1 text-[11px] text-cu-grey">Control Union ({ev.internos.attended} asistieron)</div>
              </div>
              <div>
                <div className="text-[24px] font-bold leading-none text-cu-dblue">{ev.externos.registered}</div>
                <div className="mt-1 text-[11px] text-cu-grey">Audiencia externa · {Math.round((ev.externos.registered / ev.registered) * 100)}% de los registrados</div>
              </div>
            </div>
          </div>
          <div className="flex-1 rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
            <div className="mb-0.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
              <span className="h-3 w-[3px] shrink-0 rounded-sm bg-cu-cyan" />
              Empresas destacadas entre asistentes
            </div>
            {ev.companies.featuredNote && (
              <div className="mb-2 text-[10px] text-cu-grey">{ev.companies.featuredNote}</div>
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
                  Resto de empresas
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
      <SectionHeader title="Embudo — Del Registro a la Atención Sostenida" note="Livestorm" />
      <div className="mb-3 rounded-cu border border-cu-border bg-white px-7 pb-6 pt-6 shadow-cu">
        <div className="mx-auto max-w-[640px]">
          <Funnel
            stages={[
              { name: 'Registrados', value: ev.registered, desc: `${ev.regCountries} países`, retention: '100 %' },
              { name: 'Asistentes en vivo', value: ev.attended, desc: `${p1(ev.showRate)} % show rate`, retention: `${p1(ev.showRate)} %` },
              { name: 'Alto engagement (≥80%)', value: ev.engagement.high, desc: 'Se quedaron casi todo el webinar', retention: `${p1((ev.engagement.high / ev.registered) * 100)} %` },
              {
                name: 'Deals en HubSpot',
                value: ev.deals.total,
                desc: ev.deals.warm != null ? `${ev.deals.hot} hot · ${ev.deals.warm} warm` : `${ev.deals.hot} hot leads`,
                retention: `${p1((ev.deals.total / ev.registered) * 100)} %`,
              },
            ]}
          />
        </div>
      </div>
      <div className="mb-5 grid grid-cols-3 gap-3">
        <KpiCard label="Engagement alto (≥80%)" value={num(ev.engagement.high)} footnote={`${p1((ev.engagement.high / ev.attended) * 100)} % de los asistentes`} />
        <KpiCard label="Engagement medio (50-79%)" value={num(ev.engagement.mid)} footnote={`${p1((ev.engagement.mid / ev.attended) * 100)} % de los asistentes`} />
        <KpiCard label="Engagement bajo (<50%)" value={num(ev.engagement.low)} footnote={`${p1((ev.engagement.low / ev.attended) * 100)} % de los asistentes`} />
      </div>

      </>
      )}

      {/* ── Sección 1: Email Marketing ── */}
      {view === 'email' && (
      <>
      <SectionHeader title="Sección 1 — Email Marketing" note="Mailchimp · campaña previa al webinar" />
      <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Emails enviados" value={num(ev.email.totalSent)} footnote={`${ev.email.sends.length} envíos · ${num(ev.email.uniqueContacts)} contactos únicos`} />
        <KpiCard label="Abrieron al menos un email" value={num(ev.email.openedOnce)} delta={{ dir: 'flat', label: `${p1(ev.email.openedOncePct)} %` }} />
        <KpiCard label="Hicieron click al menos una vez" value={num(ev.email.clickedOnce)} delta={{ dir: 'flat', label: `${p1(ev.email.clickedOncePct)} %` }} />
        <KpiCard
          label="Registrados vía email"
          value={num(ev.email.regFromEmail)}
          accent="green"
          delta={{ dir: 'up', label: `▲ ${ev.email.regFromEmailPct}% de los registros` }}
          footnote={
            ev.email.regInBase != null
              ? `${ev.email.regFromEmailNote} · ${num(ev.email.regOpened)} abrieron algún email · ${num(ev.email.regInBase)} estaban en la base (${ev.email.regInBasePct}%)`
              : (ev.email.regFromEmailNote ?? 'Métrica final del canal')
          }
        />
      </div>
      <div className="mb-3 overflow-x-auto rounded-cu border border-cu-border bg-white shadow-cu">
        <table className="w-full min-w-[560px] border-collapse">
          <thead>
            <tr className="border-b-2 border-cu-cyan">
              <th className={thCls}>Email</th>
              <th className={thCls}>Enviados</th>
              <th className={thCls}>Open rate</th>
              <th className={thCls}>Click rate</th>
            </tr>
          </thead>
          <tbody>
            {ev.email.sends.map((s) => (
              <tr key={s.name} className="border-b border-cu-border2">
                <td className={`${tdCls} font-medium text-cu-dblue`}>{s.name}</td>
                <td className={tdCls}>{num(s.sent)}</td>
                <td className={tdCls}>{p1(s.open)} %</td>
                <td className={tdCls}>{p1(s.click)} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>{ev.email.nota}</Note>
      {ev.email.notaClics && (
        <Note>
          <strong className="text-cu-dblue">Cómo leer estos números:</strong> {ev.email.notaClics}
        </Note>
      )}
      </>
      )}

      {/* ── Sección 2: Social Media ── */}
      {view === 'social' && (
      <>
      <SectionHeader title="Sección 2 — Social Media" note="LinkedIn orgánico" />
      <div className={`mb-3 grid gap-3 ${ev.social.posts.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        {ev.social.posts.map((po) => (
          <div key={po.name} className="rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
            <div className="mb-2 text-[11px] font-bold text-cu-dblue">{po.name}</div>
            <div className="text-[26px] font-bold leading-none text-cu-dblue">{num(po.imp)}</div>
            <div className="mb-3 mt-0.5 text-[10px] text-cu-grey">impresiones</div>
            <div className="flex flex-col gap-1 text-[11.5px] text-cu-dgrey">
              <span>{num(po.inter)} interacciones · {p1(po.rate)} % tasa</span>
              <span>{num(po.clicks)} clics · {p1(po.ctr)} % CTR</span>
              <span>{num(po.reactions)} reacciones</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Posteos publicados" value={ev.social.posts.length} />
        <KpiCard label="Impresiones totales" value={num(ev.social.totals.imp)} delta={{ dir: 'flat', label: `${p1(ev.social.totals.rate)} % tasa promedio` }} />
        <KpiCard label="Clics totales" value={num(ev.social.totals.clicks)} delta={{ dir: 'flat', label: `${p1(ev.social.totals.ctr)} % CTR promedio` }} footnote={`${num(ev.social.totals.reactions)} reacciones · ${num(ev.social.totals.shares)} veces compartido`} />
        {ev.social.regFromSocial != null ? (
          <KpiCard
            label="Registrados vía LinkedIn"
            value={num(ev.social.regFromSocial)}
            accent="green"
            delta={{ dir: 'up', label: `▲ ${ev.social.regFromSocialPct}% de los registros` }}
            footnote="Métrica final del canal"
          />
        ) : ev.social.regOutsideEmail != null ? (
          <KpiCard
            label="Registros fuera de la base de email"
            value={num(ev.social.regOutsideEmail)}
            accent="green"
            delta={{ dir: 'up', label: `▲ ${ev.social.regOutsideEmailPct}% de los registros` }}
            footnote="LinkedIn u otros canales — el registro de este evento (Teams) no trae atribución por canal; Livestorm sí la tendría"
          />
        ) : (
          <KpiCard label="Registrados vía LinkedIn" value="—" footnote="Sin atribución por canal en este evento" />
        )}
      </div>
      <Note>{ev.social.lectura}</Note>
      </>
      )}

      {/* ── Sección 3: Hot Leads (solo vista Webinar) ── */}
      {view === 'webinar' && (
      <>
      <SectionHeader title="Sección 3 — Hot Leads" note="HubSpot · deals generados por el evento" />
      <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label={ev.scoring ? 'Leads priorizados' : 'Deals totales'} value={num(ev.scoring ? prioritized : ev.deals.total)} footnote={ev.scoring ? `${ev.deals.hot} hot + ${ev.deals.warm} warm sobre ${num(ev.externos.attended)} asistentes externos` : (ev.deals.note ?? 'Asistentes externos con deal real en HubSpot')} />
        <KpiCard label="Hot leads" value={num(ev.deals.hot)} accent="green" delta={{ dir: 'up', label: `▲ score ${hotRange}` }} footnote="Contacto comercial directo esta semana" />
        <KpiCard label={ev.scoring ? 'Warm leads' : 'Leads (resto)'} value={num(ev.deals.warm ?? dealsOnly)} footnote={`Score ${classes[1].range} · pasan a nurturing`} />
        <KpiCard label="Score (hot)" value={p1(avgScore)} footnote={hotRows.length === 1 ? hotRows[0].empresa : `Promedio de ${hotRows.length} hot leads`} />
      </div>
      {!external && ev.hotLeads.universeNote && <Note>{ev.hotLeads.universeNote}</Note>}

      {/* Metodología de scoring (global o propia del evento) */}
      <div className="mb-5 grid gap-3 lg:grid-cols-2">
        <div className="overflow-hidden rounded-cu border border-cu-border bg-white shadow-cu">
          <div className="bg-cu-dblue px-5 py-3 text-[11px] font-bold uppercase tracking-[0.5px] text-white">
            Cómo se califica un lead
          </div>
          {evScoring ? (
            <p className="px-5 py-4 text-[12px] leading-relaxed text-cu-dgrey">{evScoring.desc}</p>
          ) : (
          <table className="w-full border-collapse">
            <tbody>
              {scoring.formula.map((f) => (
                <tr key={f.name} className="border-b border-cu-border2 last:border-b-0">
                  <td className={`${tdCls} w-44 font-medium text-cu-dblue`}>{f.name}<br /><span className="text-[10px] font-bold text-cu-cyan">{f.pts} pts</span></td>
                  <td className={`${tdCls} text-[11px]`}>{f.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
        <div className="overflow-hidden rounded-cu border border-cu-border bg-white shadow-cu">
          <div className="bg-cu-dblue px-5 py-3 text-[11px] font-bold uppercase tracking-[0.5px] text-white">
            Clasificación y acción comercial
          </div>
          <table className="w-full border-collapse">
            <tbody>
              {classes.map((c) => (
                <tr key={c.name} className="border-b border-cu-border2 last:border-b-0">
                  <td className={`${tdCls} w-36 font-medium text-cu-dblue`}>{c.name}<br /><span className="text-[10px] font-bold text-cu-cyan">score {c.range}</span></td>
                  <td className={`${tdCls} text-[11px]`}>{c.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diagnóstico de madurez */}
      {ev.surveys?.length > 0 && (
      <>
      <SectionHeader title="Diagnóstico de Madurez" note="Encuestas respondidas durante el webinar" />
      <div className="mb-5 grid gap-3 lg:grid-cols-3">
        {ev.surveys.map((s) => (
          <div key={s.q} className="rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="text-[12px] font-bold leading-snug text-cu-dblue">{s.q}</div>
              <span className="shrink-0 text-[9.5px] text-cu-grey">{s.n} resp.</span>
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
      <SectionHeader title="Oportunidad Comercial — Cuánto Podría Traerle Este Webinar a Control Union" note="Proyección sobre benchmarks · no es una certeza" />
      {ev.commercial.pipelinePotential != null ? (
        <>
          <div className="mb-3 grid gap-3 lg:grid-cols-2">
            <div className="rounded-cu bg-cu-dblue px-6 py-5 text-white shadow-cu">
              <div className="text-[30px] font-bold leading-none">{usd(ev.commercial.pipelinePotential)}</div>
              <div className="mt-2 text-[12px] font-bold">$ Pipeline potencial generado</div>
              <div className="mt-1 text-[10.5px] text-white/60">{ev.commercial.pipelinePotentialNote}</div>
            </div>
            <div className="rounded-cu border border-cu-border bg-cu-cyan/[0.06] px-6 py-5 shadow-cu">
              <div className="text-[30px] font-bold leading-none text-cu-dblue">{usd(ev.commercial.hotPipeline)}</div>
              <div className="mt-2 text-[12px] font-bold text-cu-cyan">$ Pipeline potencial del segmento caliente</div>
              <div className="mt-1 text-[10.5px] text-cu-grey">{ev.commercial.hotPipelineNote}</div>
            </div>
          </div>
          <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
            <KpiCard label="$ Que podría cerrarse" value={usd(ev.commercial.closeLow)} footnote={ev.commercial.closeLowNote} />
            <KpiCard label="$ Que podría cerrarse" value={usd(ev.commercial.closeHigh)} footnote={ev.commercial.closeHighNote} />
            <KpiCard
              label="ROI potencial del webinar"
              value={ev.commercial.roi}
              accent="amber"
              footnote={ev.commercial.productionCost != null ? `Sobre el costo de producción (${usd(ev.commercial.productionCost)})` : 'Costo de producción: pendiente'}
            />
          </div>
        </>
      ) : null}
      <p className="mb-5 text-[10.5px] italic leading-relaxed text-cu-grey">
        Metodología: {ev.commercial.metodologia}
        {ev.commercial.productionCost != null && ` Costo de producción del webinar: ${usd(ev.commercial.productionCost)} USD.`}
      </p>

      {/* ── Plan de acción: SOLO en el descargable de uso interno ── */}
      {isEmbedReport() && !external && (
        <>
          <SectionHeader title="Conclusión — Próximos Pasos" />
          <NextStepsPanel steps={ev.actionPlan} subtitle={`${ev.title} · ${ev.date}`} title="Plan de acción" />
        </>
      )}

      </>
      )}

      <Glossary keys={glossaryKey} />
    </div>
  );
}
