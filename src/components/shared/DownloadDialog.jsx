import { useState } from 'react';
import { X, Building2, Share2, Download, CalendarRange, Languages, FileCode2, FileText, Coins } from 'lucide-react';

// Modal de descarga: elegís QUÉ período/s bajar (por defecto el que estás
// viendo) y si el reporte es para uso interno o externo. Cada período
// seleccionado se descarga como su propio archivo HTML.
// mode: 'audience' (uso interno / externo, HTML) | 'format' (HTML interactivo /
// PDF, para las vistas que no tienen sección generada de próximos pasos).
// currencyInfo (solo Paid): (ids) => { native, months, options: [{ id, ok }] }
// para elegir la moneda del descargable (ARS / USD / EUR).
// externalHidden: secciones extra que el pilar oculta en uso externo (se listan en la nota).
export function DownloadDialog({ onClose, onChoose, periods = [], currentPeriod = null, mode = 'audience', currencyInfo = null, externalHidden = [] }) {
  const [selected, setSelected] = useState(() => new Set(currentPeriod != null ? [currentPeriod] : []));
  const [lang, setLang] = useState('es'); // idioma principal del descargable
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

  // Moneda (Paid): por defecto la original; si la elegida deja de estar
  // disponible para los períodos tildados, vuelve a la original.
  const [currencyPick, setCurrencyPick] = useState(null);
  const cur = currencyInfo ? currencyInfo(chosen) : null;
  const currency =
    cur && currencyPick && cur.options.find((o) => o.id === currencyPick)?.ok ? currencyPick : cur?.native ?? null;

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

          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
            <Languages className="h-3.5 w-3.5 text-cu-cyan" />
            Idioma principal del reporte
          </div>
          <div className="mb-1.5 grid grid-cols-2 gap-2">
            {[['es', 'Español'], ['en', 'English']].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setLang(id)}
                className={`rounded-cu border px-3 py-2 text-[12px] font-bold transition-colors ${
                  lang === id
                    ? 'border-cu-dblue bg-cu-dblue text-white'
                    : 'border-cu-border bg-white text-cu-dgrey hover:border-cu-cyan'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mb-4 text-[10.5px] leading-snug text-cu-grey">
            Es el idioma con el que se abre el reporte: adentro vas a poder cambiarlo al otro idioma
            igual.
          </p>

          {cur && cur.months > 0 && (
            <>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
                <Coins className="h-3.5 w-3.5 text-cu-cyan" />
                Moneda de los importes
              </div>
              <div className="mb-1.5 grid grid-cols-3 gap-2">
                {cur.options.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => o.ok && setCurrencyPick(o.id)}
                    disabled={!o.ok}
                    title={o.ok ? '' : 'Falta el tipo de cambio de alguno de los períodos elegidos'}
                    className={`rounded-cu border px-3 py-2 text-[12px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                      currency === o.id
                        ? 'border-cu-dblue bg-cu-dblue text-white'
                        : 'border-cu-border bg-white text-cu-dgrey hover:border-cu-cyan'
                    }`}
                  >
                    {o.id}
                    {o.id === cur.native && <span className="ml-1 text-[9.5px] font-medium opacity-80">(original)</span>}
                  </button>
                ))}
              </div>
              <p className="mb-4 text-[10.5px] leading-snug text-cu-grey">
                {!currency && 'Los períodos elegidos tienen monedas distintas: si no elegís una, cada uno sale en su moneda original. '}
                La conversión usa el tipo de cambio vendedor del Banco Nación al cierre de cada mes (en las
                campañas, al cierre de la campaña) y el reporte lo aclara como importe aproximado de referencia.
                El resumen anual y la comparativa se descargan en su moneda original.
              </p>
            </>
          )}

          {mode === 'format' ? (
            <>
              <p className="mb-4 text-[13px] text-cu-dgrey">
                ¿En qué formato querés descargar el informe?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => !none && onChoose('html', chosen, lang)}
                  disabled={none}
                  className="group flex flex-col items-center gap-2 rounded-cu border border-cu-border bg-white px-4 py-5 text-center transition-colors hover:border-cu-cyan hover:bg-cu-cyan/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FileCode2 className="h-6 w-6 text-cu-dblue" />
                  <span className="text-[13px] font-bold text-cu-dblue">HTML interactivo</span>
                  <span className="text-[10.5px] leading-tight text-cu-grey">Funciona offline, con cambio de idioma adentro</span>
                </button>
                <button
                  onClick={() => onChoose('pdf', [currentPeriod], lang)}
                  className="group flex flex-col items-center gap-2 rounded-cu border border-cu-border bg-white px-4 py-5 text-center transition-colors hover:border-cu-cyan hover:bg-cu-cyan/[0.04]"
                >
                  <FileText className="h-6 w-6 text-cu-cyan" />
                  <span className="text-[13px] font-bold text-cu-dblue">PDF</span>
                  <span className="text-[10.5px] leading-tight text-cu-grey">Para imprimir o adjuntar, en el idioma elegido</span>
                </button>
              </div>
              <div className="mt-4 rounded-cu border border-cu-border2 bg-cu-bg px-3.5 py-2.5 text-[11.5px] leading-relaxed text-cu-grey">
                ℹ️ El <strong className="text-cu-dgrey">PDF</strong> se genera con la impresión del navegador: en el
                diálogo que se abre elegí <strong className="text-cu-dgrey">«Guardar como PDF»</strong>. Es una copia fija de
                la vista actual (sin cambio de idioma ni interacciones).
              </div>
            </>
          ) : (
          <>
          <p className="mb-4 text-[13px] text-cu-dgrey">
            ¿Deseás descargar el reporte para <strong className="text-cu-dblue">uso interno</strong> o{' '}
            <strong className="text-cu-dblue">uso externo</strong>?
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => !none && onChoose('internal', chosen, lang, currency)}
              disabled={none}
              className="group flex flex-col items-center gap-2 rounded-cu border border-cu-border bg-white px-4 py-5 text-center transition-colors hover:border-cu-cyan hover:bg-cu-cyan/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Building2 className="h-6 w-6 text-cu-dblue" />
              <span className="text-[13px] font-bold text-cu-dblue">Uso interno</span>
              <span className="text-[10.5px] leading-tight text-cu-grey">Reporte completo (incluye próximos pasos)</span>
            </button>

            <button
              onClick={() => !none && onChoose('external', chosen, lang, currency)}
              disabled={none}
              className="group flex flex-col items-center gap-2 rounded-cu border border-cu-border bg-white px-4 py-5 text-center transition-colors hover:border-cu-cyan hover:bg-cu-cyan/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Share2 className="h-6 w-6 text-cu-cyan" />
              <span className="text-[13px] font-bold text-cu-dblue">Uso externo</span>
              <span className="text-[10.5px] leading-tight text-cu-grey">Para compartir con el cliente</span>
            </button>
          </div>

          {none && mode !== 'format' && (
            <p className="mt-3 text-center text-[11px] font-medium text-amber-700">
              Seleccioná al menos un período para descargar.
            </p>
          )}

          <div className="mt-4 rounded-cu border border-cu-border2 bg-cu-bg px-3.5 py-2.5 text-[11.5px] leading-relaxed text-cu-grey">
            ℹ️ En el reporte de <strong className="text-cu-dgrey">uso externo</strong>{' '}
            {externalHidden.length ? 'no estarán visibles las secciones' : 'no estará visible la sección'}{' '}
            <strong className="text-cu-dgrey">
              {(() => {
                const all = ['«Conclusión — Próximos Pasos»', ...externalHidden.map((x) => `«${x}»`)];
                return all.length > 1 ? `${all.slice(0, -1).join(', ')} y ${all[all.length - 1]}` : all[0];
              })()}
            </strong>
            .
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
