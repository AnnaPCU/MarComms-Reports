import { Trophy } from 'lucide-react';

const numEs = (v) => Number(v || 0).toLocaleString('es-AR');

// Benchmark de competidores del mes (export COMPETITORS de LinkedIn).
// Filas ordenadas por interacciones del mes; la fila propia va resaltada.
export function CompetitorsTable({ comp = [] }) {
  if (!comp.length) return null;
  const rows = comp.slice().sort((a, b) => (b.eng || 0) - (a.eng || 0));
  const ownIdx = rows.findIndex((r) => r.own);

  return (
    <div className="mb-5 overflow-x-auto rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
      <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
        <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
          <Trophy className="h-3.5 w-3.5 text-cu-cyan" />
          Set de competidores — definido en LinkedIn
        </h3>
        {ownIdx >= 0 && (
          <span className="ml-auto rounded-[3px] border border-cu-cyan/30 bg-cu-cyan/10 px-2 py-0.5 text-[9px] font-bold text-[#1372a5]">
            Posición propia: {ownIdx + 1}º de {rows.length} por interacciones
          </span>
        )}
      </div>
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr>
            {['#', 'Página', 'Seguidores', 'Nuevos en el mes', 'Interacciones', 'Posts'].map((h) => (
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
          {rows.map((r, i) => (
            <tr
              key={r.name}
              className={`border-b border-cu-border2 transition-colors ${
                r.own ? 'bg-cu-cyan/[0.07] font-semibold' : 'hover:bg-cu-cyan/[0.03]'
              }`}
            >
              <td className="px-3 py-2 text-[11px] text-cu-grey">{i + 1}</td>
              <td className={`px-3 py-2 text-[12px] ${r.own ? 'text-cu-dblue' : 'text-cu-dgrey'}`}>
                {r.name}
                {r.own && <span className="ml-2 rounded-[3px] bg-cu-cyan px-1.5 py-0.5 text-[8px] font-bold text-white">PROPIA</span>}
              </td>
              <td className="px-3 py-2 text-[12px] text-cu-dgrey">{numEs(r.fol)}</td>
              <td className="px-3 py-2 text-[12px] text-cu-dgrey">{r.nfol >= 0 ? `+${numEs(r.nfol)}` : numEs(r.nfol)}</td>
              <td className="px-3 py-2 text-[12px] font-medium text-cu-dblue">{numEs(r.eng)}</td>
              <td className="px-3 py-2 text-[12px] text-cu-dgrey">{numEs(r.posts)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Lectura por reglas del benchmark (para el diagnóstico del mes) ──
export function competitorSummary(comp = []) {
  const own = comp.find((r) => r.own);
  if (!own || comp.length < 2) return null;
  const others = comp.filter((r) => !r.own);
  const rankEng = comp.slice().sort((a, b) => (b.eng || 0) - (a.eng || 0)).findIndex((r) => r.own) + 1;
  const totalEng = comp.reduce((s, r) => s + (r.eng || 0), 0);
  const share = totalEng ? ((own.eng || 0) / totalEng) * 100 : 0;
  const medNfol = others.map((r) => r.nfol || 0).sort((a, b) => a - b)[Math.floor(others.length / 2)] || 0;
  return {
    label: 'Competencia',
    text: `En el set de ${comp.length} páginas, la cuenta quedó <strong>${rankEng}º por interacciones</strong> (${share.toFixed(1)}% del total del set) y sumó <strong>${(own.nfol >= 0 ? '+' : '') + Number(own.nfol || 0).toLocaleString('es-AR')} seguidores</strong> frente a una mediana de +${Number(medNfol).toLocaleString('es-AR')} de los competidores.`,
  };
}
