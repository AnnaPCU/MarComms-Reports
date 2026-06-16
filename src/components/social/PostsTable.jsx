import { classifyESG, ESG_LABEL, ESG_CHIP } from '@/utils/esg';
import { num } from '@/utils/format';

// Top publicaciones del mes, clasificadas por pilar ESG (ordenadas por impresiones).
export function PostsTable({ posts }) {
  const sorted = [...(posts || [])].sort((a, b) => b.imp - a.imp).slice(0, 5);

  return (
    <div className="mb-5 overflow-x-auto rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
      <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
          Datos reales LinkedIn Analytics
        </h3>
        <div className="ml-auto flex flex-wrap gap-1.5">
          {['E', 'S', 'G', 'X'].map((k) => (
            <span
              key={k}
              className={`rounded px-2 py-0.5 text-[9px] font-bold tracking-[0.4px] ${ESG_CHIP[k]}`}
            >
              {ESG_LABEL[k]}
            </span>
          ))}
        </div>
      </div>

      <table className="w-full min-w-[620px] border-collapse">
        <thead>
          <tr>
            {['#', 'Publicación', 'Pilar', 'Impresiones', 'Eng. Rate', 'Clics', 'Tipo'].map(
              (h) => (
                <th
                  key={h}
                  className="border-b-2 border-cu-cyan px-3 py-2 text-left text-[9px] font-bold uppercase tracking-[0.5px] text-cu-grey"
                >
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, i) => {
            const pl = p.p || classifyESG(p.t);
            const er = typeof p.er === 'number' ? `${p.er.toFixed(1)}%` : p.er;
            return (
              <tr
                key={i}
                className="border-b border-cu-border2 transition-colors hover:bg-cu-cyan/[0.03]"
              >
                <td className="px-3 py-2.5 text-[10px] text-cu-grey">{i + 1}</td>
                <td className="px-3 py-2.5">
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={p.t}
                      className="block max-w-[320px] truncate border-b border-transparent font-medium text-cu-dblue transition-colors hover:border-cu-cyan hover:text-cu-cyan"
                    >
                      {p.t}
                    </a>
                  ) : (
                    <span className="block max-w-[320px] truncate" title={p.t}>
                      {p.t}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <span className={`rounded px-2 py-0.5 text-[9px] font-bold ${ESG_CHIP[pl]}`}>
                    {pl}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-[12px] font-medium text-cu-dblue">
                  {num(p.imp)}
                </td>
                <td className="px-3 py-2.5 text-[12px] font-medium text-cu-dblue">{er}</td>
                <td className="px-3 py-2.5 text-[12px] font-medium text-cu-dblue">
                  {num(p.clk)}
                </td>
                <td className="px-3 py-2.5 text-[11px] text-cu-grey">{p.tp || 'Orgánico'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
