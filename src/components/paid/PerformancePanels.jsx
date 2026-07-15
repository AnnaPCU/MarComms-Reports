// Panel de diagnóstico (grid 2-col) y panel de próximos pasos (lista numerada).
// Ambos con cabecera dark blue, al estilo del dashboard de referencia.

export function ConclusionsPanel({ items = [] }) {
  if (!items.length) return null;
  return (
    <div className="mb-5 overflow-hidden rounded-cu border border-cu-border bg-white shadow-cu">
      <div className="flex items-center gap-2.5 bg-cu-dblue px-5 py-3">
        <span className="text-[14px]">📌</span>
        <h3 className="text-[11px] font-bold uppercase tracking-[0.5px] text-white">Diagnóstico y recomendaciones</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {items.map((it, i) => (
          <div key={i} className="border-b border-r border-cu-border2 p-4 last:border-b-0 lg:[&:nth-child(2n)]:border-r-0">
            <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-cyan">{it.label}</div>
            <div
              className="text-[12px] leading-relaxed text-cu-dgrey [&_strong]:font-bold [&_strong]:text-cu-dblue"
              dangerouslySetInnerHTML={{ __html: it.text }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function NextStepsPanel({ steps = [], subtitle }) {
  if (!steps.length) return null;
  return (
    <div className="mb-5 overflow-hidden rounded-cu border border-cu-border bg-white shadow-cu">
      <div className="flex items-center gap-2.5 bg-cu-dblue px-5 py-3">
        <span className="text-[14px]">🎯</span>
        <h3 className="text-[11px] font-bold uppercase tracking-[0.5px] text-white">Próximos pasos</h3>
        {subtitle && <span className="ml-auto text-[10px] text-white/50">{subtitle}</span>}
      </div>
      <ol className="flex list-none flex-col gap-2.5 px-6 py-5">
        {steps.map((s, i) => (
          <li key={i} className="relative pl-8 text-[12.5px] leading-relaxed text-cu-dgrey [&_strong]:font-bold [&_strong]:text-cu-dblue">
            <span className="absolute left-0 top-0 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-cu-cyan text-[11px] font-bold text-white">
              {i + 1}
            </span>
            <span dangerouslySetInnerHTML={{ __html: s }} />
          </li>
        ))}
      </ol>
    </div>
  );
}
