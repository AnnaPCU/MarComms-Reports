// Panel de insights / plan de acción (cabecera dark blue + grid de tarjetas).
// Cada item: { m: tendencia, a: acción recomendada (HTML inline permitido) }.
export function InsightsPanel({ subtitle, items, label = 'Tendencia Mensual' }) {
  return (
    <div className="mb-5 overflow-hidden rounded-cu border border-cu-border bg-white shadow-cu">
      <div className="flex flex-wrap items-center gap-2.5 bg-cu-dblue px-5 py-3">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.6px] text-white">
          ⚡ Plan de Acción — Insights ESG B2B
        </h2>
        {subtitle && (
          <span className="ml-auto text-[10px] text-white/50">{subtitle}</span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="px-5 py-4 text-[12px] text-cu-grey">
          Sin información suficiente para este período
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((x, i) => (
            <div
              key={i}
              className="border-b border-r border-cu-border2 p-4 transition-colors hover:bg-cu-cyan/[0.025]"
            >
              <div className="mb-1.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.5px] text-cu-cyan">
                <span className="text-[7px]">◆</span>
                {label} {i + 1}
              </div>
              <div className="mb-2 text-[12px] leading-snug text-cu-dgrey">
                {x.m}
              </div>
              <div className="mb-1.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.3px] text-cu-dblue">
                <span className="h-[2px] w-3.5 rounded-sm bg-cu-cyan" />
                Acción recomendada
              </div>
              <div
                className="text-[11.5px] leading-relaxed text-cu-dgrey [&_strong]:font-bold [&_strong]:text-cu-dblue"
                dangerouslySetInnerHTML={{ __html: x.a }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
