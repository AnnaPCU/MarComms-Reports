// Embudo de conversión Impresión → Clic → Lead (formas cónicas con clip-path)
// + tarjetas de coste (Coste, CPC medio, Coste/lead, Optimización).
// El texto de cada etapa se centra y se acota al ancho de la forma, para que
// NUNCA sobresalga del color del embudo.
const numEs = (v) => Number(v || 0).toLocaleString('es-AR');
const pct = (v) =>
  Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';
const money = (v, c) =>
  Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + (c || 'EUR');

// Trapecio: ancho superior t% → ancho inferior b%.
const trap = (t, b) => {
  const tl = (100 - t) / 2,
    tr = 100 - tl,
    bl = (100 - b) / 2,
    br = 100 - bl;
  return `polygon(${tl}% 0, ${tr}% 0, ${br}% 100%, ${bl}% 100%)`;
};

// Etapa del embudo. topW/botW = ancho % de la forma arriba/abajo.
// El contenido se centra y se limita al ancho de la parte más angosta,
// así queda siempre dentro del color.
function Stage({ gradient, topW, botW, name, value, desc, retention }) {
  const maxW = Math.max(Math.min(topW, botW) - 6, 20); // % de ancho para el texto
  return (
    <div className="relative flex w-full justify-center">
      <div className="relative flex h-[84px] w-full items-center justify-center text-center text-white">
        <span
          className="absolute inset-0 z-[1]"
          style={{ clipPath: trap(topW, botW), background: gradient, filter: 'drop-shadow(0 3px 6px rgba(27,30,66,.14))' }}
        />
        <div className="z-[3] mx-auto flex flex-col items-center gap-0.5 px-2" style={{ maxWidth: `${maxW}%` }}>
          <span className="text-[9px] font-bold uppercase leading-tight tracking-[0.6px] opacity-90">{name}</span>
          <span className="text-[24px] font-bold leading-none tracking-tight">{value}</span>
          {desc && <span className="mt-0.5 text-[9.5px] leading-tight opacity-95">{desc}</span>}
        </div>
        <span className="absolute right-3 top-1/2 z-[4] -translate-y-1/2 whitespace-nowrap rounded-full border border-cu-border bg-white px-2.5 py-[3px] text-[11px] font-bold text-cu-dblue shadow-cu">
          {retention}
        </span>
      </div>
    </div>
  );
}

function Drop({ children }) {
  return (
    <div className="flex w-full items-center justify-center gap-2 py-[7px] text-[10px] tracking-[0.3px] text-cu-grey">
      <span className="h-px w-8 bg-cu-border" />
      {children}
      <span className="h-px w-8 bg-cu-border" />
    </div>
  );
}

function CostCard({ dot, label, value, unit, sub }) {
  return (
    <div className="rounded-sm border border-cu-border2 bg-cu-bg px-4 py-3 transition-shadow hover:shadow-cu">
      <div className="mb-1.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.5px] text-cu-grey">
        <span className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ background: dot }} />
        {label}
      </div>
      <div className="text-[22px] font-bold leading-none tracking-tight text-cu-dblue">
        {value}
        {unit && <span className="text-[12px] font-normal text-cu-grey"> {unit}</span>}
      </div>
      {sub && <div className="mt-1 text-[10px] text-cu-grey">{sub}</div>}
    </div>
  );
}

export function PaidFunnel({ totals: t, campaigns = [] }) {
  const imp = t.impressions || 0;
  const clk = t.clicks || 0;
  const conv = t.conversions || 0;
  const currency = t.currency || 'EUR';

  const retClk = imp ? (clk / imp) * 100 : 0;
  const retConv = clk ? (conv / clk) * 100 : 0;

  // Optimización media (si alguna campaña trae opt_level).
  const withOpt = campaigns.filter((c) => c.optLevel != null);
  const optAvg = withOpt.length
    ? withOpt.reduce((a, c) => a + Number(c.optLevel), 0) / withOpt.length
    : null;

  return (
    <div className="mb-5 rounded-cu border border-cu-border bg-white px-7 pb-6 pt-6 shadow-cu">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.25fr_1fr]">
        {/* Embudo */}
        <div className="flex flex-col items-center">
          <Stage
            gradient="linear-gradient(135deg,#1b1e42,#343c7d)"
            topW={100}
            botW={76}
            name="Impresiones"
            value={numEs(imp)}
            desc={`El anuncio se mostró ${numEs(imp)} veces`}
            retention="100 %"
          />
          <Drop>
            CTR&nbsp;<b className="font-bold text-cu-cyan">{pct(t.ctr)}</b>&nbsp;· impresión → clic
          </Drop>
          <Stage
            gradient="linear-gradient(135deg,#2069a8,#3eb2ed)"
            topW={76}
            botW={54}
            name="Clics"
            value={numEs(clk)}
            desc={`CPC ${money(t.cpc, currency)}`}
            retention={pct(retClk)}
          />
          <Drop>
            Conversión&nbsp;<b className="font-bold text-cu-cyan">{pct(retConv)}</b>&nbsp;· clic → lead
          </Drop>
          <Stage
            gradient="linear-gradient(135deg,#247a44,#3fb86a)"
            topW={54}
            botW={40}
            name="Conversiones"
            value={numEs(conv)}
            desc={conv > 0 ? `Coste/lead ${money(t.costPerConv, currency)}` : 'Sin leads en el período'}
            retention={pct(retConv)}
          />
        </div>

        {/* Cost cards */}
        <div className="flex flex-col gap-3">
          <CostCard dot="#1b1e42" label="Coste total" value={money(t.cost, currency)} sub="Inversión ejecutada en el período" />
          <CostCard dot="#3eb2ed" label="CPC medio" value={money(t.cpc, currency)} sub="Coste promedio por clic" />
          <CostCard
            dot="#2d8a4e"
            label="Coste por lead"
            value={conv > 0 ? money(t.costPerConv, currency) : '—'}
            sub={conv > 0 ? `${numEs(conv)} conversión/es` : 'Sin conversiones en el período'}
          />
          <CostCard
            dot="#d4a72c"
            label="Optimización media"
            value={optAvg != null ? optAvg.toFixed(1) : '—'}
            unit={optAvg != null ? '%' : ''}
            sub={optAvg != null ? 'Nivel de optimización (Google Ads)' : 'Sin dato de optimización en el export'}
          />
        </div>
      </div>
    </div>
  );
}
