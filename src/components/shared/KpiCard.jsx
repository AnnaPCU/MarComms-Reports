// Tarjeta de KPI con acento cyan a la izquierda y delta vs período anterior.
const DELTA_CLS = {
  up: 'bg-cu-cyan/10 text-[#1372a5]',
  down: 'bg-[#b42828]/10 text-[#a02020]',
  flat: 'bg-cu-grey/10 text-cu-grey',
  none: 'bg-cu-grey/10 text-cu-grey',
};

export function KpiCard({ label, value, unit, delta, footnote }) {
  return (
    <div className="relative overflow-hidden rounded-cu border border-cu-border bg-white px-5 pb-3.5 pt-4 shadow-cu transition-shadow hover:shadow-cu-h">
      <span className="absolute inset-y-0 left-0 w-[3px] bg-cu-cyan" />
      <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.6px] text-cu-grey">
        {label}
      </div>
      <div className="mb-2 text-[30px] font-bold leading-none tracking-tight text-cu-dblue">
        {value}
        {unit && <span className="text-[15px] font-normal text-cu-grey">{unit}</span>}
      </div>
      {delta && (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-[3px] text-[11px] font-medium ${DELTA_CLS[delta.dir]}`}
        >
          {delta.label}
        </span>
      )}
      {footnote && (
        <div className="mt-1.5 text-[9px] italic leading-tight text-cu-grey">
          {footnote}
        </div>
      )}
    </div>
  );
}
