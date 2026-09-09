// Card destacada (azul marino) para las métricas clave de una vista.
// La usan el reporte de Webinars y la vista General por cliente.
export function HeroCard({ label, value, pill, pillTone = 'cyan', footnote }) {
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
