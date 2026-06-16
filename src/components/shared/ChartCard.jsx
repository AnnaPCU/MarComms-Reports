// Contenedor de gráfico con título (acento cyan) y subtítulo.
export function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <div className={`rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu ${className}`}>
      <div className="mb-0.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
        <span className="h-3 w-[3px] shrink-0 rounded-sm bg-cu-cyan" />
        {title}
      </div>
      {subtitle && <div className="mb-3.5 text-[10px] text-cu-grey">{subtitle}</div>}
      <div className="relative h-[230px]">{children}</div>
    </div>
  );
}
