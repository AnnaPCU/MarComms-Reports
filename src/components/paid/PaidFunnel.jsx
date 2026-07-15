// Embudo de conversión Impresión → Clic → Lead (formas cónicas con clip-path)
// + tarjetas de coste (Coste, CPC medio, Coste/lead, Optimización).
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

function Stage({ gradient, clip, name, value, right, retention }) {
  return (
    <div className="relative flex w-full justify-center">
      <div className="relative flex h-[78px] w-full items-center justify-center gap-8 text-center text-white">
        <span
          className="absolute inset-0 z-[1]"
          style={{ clipPath: clip, background: gradient, filter: 'drop-shadow(0 3px 6px rgba(27,30,66,.14))' }}
        />
        <div className="z-[3] flex flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.6px] opacity-90">{name}</span>
          <span className="text-[26px] font-bold leading-none tracking-tight">{value}</span>
        </div>
        {right && <div className="z-[3] text-[10px] leading-tight opacity-95">{right}</div>}
        <span className="absolute right-4 top-1/2 z-[4] -translate-y-1/2 whitespace-nowrap rounded-full border border-cu-border bg-white px-2.5 py-[3px] text-[11px] font-bold text-cu-dblue shadow-cu">
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

  const wImp = 100,
    wClk = 70,
    wConv = conv > 0 ? 44 : 40;
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
            clip={trap(wImp, wClk)}
            name="Impresiones"
            value={numEs(imp)}
            right={
              <>
                El anuncio se mostró
                <br />
                <b className="text-[14px] font-bold">{numEs(imp)}</b> veces
              </>
            }
            retention="100 %"
          />
          <Drop>
            CTR <b className="font-bold text-cu-cyan">&nbsp;{pct(t.ctr)}</b>&nbsp;· impresión → clic
          </Drop>
          <Stage
            gradient="linear-gradient(135deg,#2069a8,#3eb2ed)"
            clip={trap(wClk, wConv)}
            name="Clics"
            value={numEs(clk)}
            right={
              <>
                CPC
                <br />
                <b className="text-[14px] font-bold">{money(t.cpc, currency)}</b>
              </>
            }
            retention={pct(retClk)}
          />
          <Drop>
            Conversión <b className="font-bold text-cu-cyan">&nbsp;{pct(clk ? (conv / clk) * 100 : 0)}</b>&nbsp;· clic → lead
          </Drop>
          <Stage
            gradient="linear-gradient(135deg,#247a44,#3fb86a)"
            clip={trap(wConv, Math.max(wConv - 14, 24))}
            name="Conversiones"
            value={numEs(conv)}
            right={
              conv > 0 ? (
                <>
                  Coste/lead
                  <br />
                  <b className="text-[14px] font-bold">{money(t.costPerConv, currency)}</b>
                </>
              ) : (
                <>Sin leads en el período</>
              )
            }
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
