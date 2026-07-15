import { campaignStatus } from '@/utils/paidInsights';

const numEs = (v) => Number(v || 0).toLocaleString('es-AR');
const pct = (v) =>
  Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';
const money = (v, c) =>
  Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + (c || 'EUR');

const BADGE = {
  win: 'bg-[#2d8a4e]/10 text-[#1d6e3a] border border-[#2d8a4e]/30',
  opt: 'bg-[#d4a72c]/12 text-[#8a6d12] border border-[#d4a72c]/40',
  low: 'bg-cu-grey/10 text-[#3e5a5b] border border-cu-grey/30',
  none: 'bg-cu-bg text-cu-grey border border-cu-border',
};

function StatusChip({ c }) {
  const s = campaignStatus(c);
  return <span className={`whitespace-nowrap rounded-[3px] px-2 py-0.5 text-[9px] font-bold tracking-[0.4px] ${BADGE[s.key]}`}>● {s.label}</span>;
}

// Tabla de detalle por campaña (ordenada por impresiones desc).
export function CampaignsTable({ campaigns = [], currency = 'EUR', title = 'Google Ads — Search' }) {
  const rows = campaigns.slice().sort((a, b) => (b.impressions || 0) - (a.impressions || 0));

  return (
    <div className="mb-5 overflow-x-auto rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
      <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">{title}</h3>
        <div className="ml-auto flex flex-wrap gap-1.5">
          <span className="rounded-[3px] border border-[#2d8a4e]/30 bg-[#2d8a4e]/10 px-2 py-0.5 text-[9px] font-bold text-[#1d6e3a]">● Convierte</span>
          <span className="rounded-[3px] border border-[#d4a72c]/40 bg-[#d4a72c]/12 px-2 py-0.5 text-[9px] font-bold text-[#8a6d12]">● Optimizar</span>
          <span className="rounded-[3px] border border-cu-grey/30 bg-cu-grey/10 px-2 py-0.5 text-[9px] font-bold text-[#3e5a5b]">● Baja actividad</span>
        </div>
      </div>
      <table className="w-full min-w-[760px] border-collapse">
        <thead>
          <tr>
            {['Campaña', 'Estado', 'Impresiones', 'Clics', 'CTR', 'CPC medio', 'Coste', 'Conv.', 'Tasa conv.', 'Coste/lead'].map((h) => (
              <th
                key={h}
                className="whitespace-nowrap border-b-2 border-cu-cyan px-3 py-2 text-left text-[9px] font-bold uppercase tracking-[0.5px] text-cu-grey"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.name} className="border-b border-cu-border2 transition-colors hover:bg-cu-cyan/[0.03]">
              <td className="px-3 py-2 text-[12px] font-semibold text-cu-dblue">{c.name}</td>
              <td className="px-3 py-2"><StatusChip c={c} /></td>
              <td className="px-3 py-2 text-[12px] text-cu-dgrey">{numEs(c.impressions)}</td>
              <td className="px-3 py-2 text-[12px] text-cu-dgrey">{numEs(c.clicks)}</td>
              <td className="px-3 py-2 text-[12px] text-cu-dgrey">{pct(c.ctr)}</td>
              <td className="px-3 py-2 text-[12px] text-cu-dgrey">{(c.cpc || 0) > 0 ? money(c.cpc, currency) : '—'}</td>
              <td className="px-3 py-2 text-[12px] text-cu-dgrey">{(c.cost || 0) > 0 ? money(c.cost, currency) : '—'}</td>
              <td className="px-3 py-2 text-[12px] text-cu-dgrey">{numEs(c.conversions)}</td>
              <td className="px-3 py-2 text-[12px] text-cu-dgrey">{(c.conversions || 0) > 0 ? pct(c.convRate) : '—'}</td>
              <td className="px-3 py-2 text-[12px] text-cu-dgrey">{(c.conversions || 0) > 0 ? money(c.costPerConv, currency) : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
