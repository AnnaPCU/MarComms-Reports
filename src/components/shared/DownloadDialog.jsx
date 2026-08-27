import { useState } from 'react';
import { X, Building2, Share2, Download, CalendarRange } from 'lucide-react';

// Modal de descarga: elegís QUÉ período/s bajar (por defecto el que estás
// viendo) y si el reporte es para uso interno o externo. Cada período
// seleccionado se descarga como su propio archivo HTML.
export function DownloadDialog({ onClose, onChoose, periods = [], currentPeriod = null }) {
  const [selected, setSelected] = useState(() => new Set(currentPeriod != null ? [currentPeriod] : []));
  const many = periods.length > 1;

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const chosen = periods.filter((p) => selected.has(p.id)).map((p) => p.id);
  const none = chosen.length === 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-cu-dblue/40 p-6" onClick={onClose}>
      <div className="my-16 w-full max-w-md animate-fade-in rounded-cu border border-cu-border bg-white shadow-cu-h" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2.5 rounded-t-cu bg-cu-dblue px-5 py-3.5">
          <Download className="h-4 w-4 text-white" />
          <h2 className="text-[12px] font-bold uppercase tracking-[0.5px] text-white">Descargar reporte</h2>
          <button onClick={onClose} className="ml-auto text-white/70 hover:text-white" aria-label="Cerrar">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">
          {many && (
            <>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
                <CalendarRange className="h-3.5 w-3.5 text-cu-cyan" />
                Períodos a descargar
              </div>
              <div className="mb-4 max-h-44 overflow-y-auto rounded-cu border border-cu-border">
                {periods.map((p) => (
                  <label
                    key={p.id}
                    className="flex cursor-pointer items-center gap-2.5 border-b border-cu-border2 px-3.5 py-2 text-[12.5px] text-cu-dgrey last:border-b-0 hover:bg-cu-cyan/[0.04]"
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      onChange={() => toggle(p.id)}
                      className="h-3.5 w-3.5 accent-cu-cyan"
                    />
                    <span className={selected.has(p.id) ? 'font-medium text-cu-dblue' : ''}>{p.label}</span>
                    {p.id === currentPeriod && (
                      <span className="ml-auto rounded-[3px] bg-cu-cyan/10 px-1.5 py-0.5 text-[9px] font-bold text-cu-cyan">
                        VISTA ACTUAL
                      </span>
                    )}
                  </label>
                ))}
              </div>
              <p className="mb-4 text-[10.5px] leading-snug text-cu-grey">
                Si tildás varios, se descarga <strong className="text-cu-dgrey">un solo HTML</strong> con
                una botonera para filtrar entre los períodos elegidos.
              </p>
            </>
          )}

          <p className="mb-4 text-[13px] text-cu-dgrey">
            ¿Deseás descargar el reporte para <strong className="text-cu-dblue">uso interno</strong> o{' '}
            <strong className="text-cu-dblue">uso externo</strong>?
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => !none && onChoose('internal', chosen)}
              disabled={none}
              className="group flex flex-col items-center gap-2 rounded-cu border border-cu-border bg-white px-4 py-5 text-center transition-colors hover:border-cu-cyan hover:bg-cu-cyan/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Building2 className="h-6 w-6 text-cu-dblue" />
              <span className="text-[13px] font-bold text-cu-dblue">Uso interno</span>
              <span className="text-[10.5px] leading-tight text-cu-grey">Reporte completo (incluye próximos pasos)</span>
            </button>

            <button
              onClick={() => !none && onChoose('external', chosen)}
              disabled={none}
              className="group flex flex-col items-center gap-2 rounded-cu border border-cu-border bg-white px-4 py-5 text-center transition-colors hover:border-cu-cyan hover:bg-cu-cyan/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Share2 className="h-6 w-6 text-cu-cyan" />
              <span className="text-[13px] font-bold text-cu-dblue">Uso externo</span>
              <span className="text-[10.5px] leading-tight text-cu-grey">Para compartir con el cliente</span>
            </button>
          </div>

          {none && (
            <p className="mt-3 text-center text-[11px] font-medium text-amber-700">
              Seleccioná al menos un período para descargar.
            </p>
          )}

          <div className="mt-4 rounded-cu border border-cu-border2 bg-cu-bg px-3.5 py-2.5 text-[11.5px] leading-relaxed text-cu-grey">
            ℹ️ En el reporte de <strong className="text-cu-dgrey">uso externo</strong>, la sección
            <strong className="text-cu-dgrey"> «Conclusión — Próximos Pasos»</strong> no estará visible.
          </div>
        </div>
      </div>
    </div>
  );
}
