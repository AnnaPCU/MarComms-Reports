import { Flame } from 'lucide-react';
import { priorityOf } from '@/utils/mailchimp/aggregate';

const numEs = (v) => Number(v || 0).toLocaleString('es-AR');

const BADGE = {
  Crítica: 'bg-[#b42828]/10 text-[#a02020] border border-[#b42828]/30',
  Alta: 'bg-[#d4a72c]/12 text-[#8a6d12] border border-[#d4a72c]/40',
  Media: 'bg-cu-cyan/10 text-[#1372a5] border border-cu-cyan/30',
  Baja: 'bg-cu-grey/10 text-[#3e5a5b] border border-cu-grey/30',
};

function fullName(l) {
  const n = `${l.firstName || ''} ${l.lastName || ''}`.trim();
  return n || '—';
}

// Tabla de hot leads (contactos que hicieron clic), ordenada por clics desc.
// Incluye el email completo del contacto (acordado con el cliente).
export function HotLeadsTable({ leads = [] }) {
  if (!leads.length) {
    return (
      <div className="mb-5 rounded-cu border border-cu-border bg-white px-5 py-6 text-center text-[12px] text-cu-grey shadow-cu">
        Todavía no hay contactos con clics registrados en esta secuencia.
      </div>
    );
  }

  return (
    <div className="mb-5 overflow-x-auto rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
      <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
          <Flame className="h-3.5 w-3.5 text-[#e06a2c]" />
          {numEs(leads.length)} hot leads — contactos con clic
        </div>
        <div className="ml-auto flex flex-wrap gap-1.5">
          <span className="rounded-[3px] border border-[#b42828]/30 bg-[#b42828]/10 px-2 py-0.5 text-[9px] font-bold text-[#a02020]">● Crítica (3+ clics)</span>
          <span className="rounded-[3px] border border-[#d4a72c]/40 bg-[#d4a72c]/12 px-2 py-0.5 text-[9px] font-bold text-[#8a6d12]">● Alta (2 clics)</span>
          <span className="rounded-[3px] border border-cu-cyan/30 bg-cu-cyan/10 px-2 py-0.5 text-[9px] font-bold text-[#1372a5]">● Media (1 clic)</span>
        </div>
      </div>
      <table className="w-full min-w-[720px] border-collapse">
        <thead>
          <tr>
            {['#', 'Contacto', 'Empresa', 'Email', 'Clics', 'Aperturas', 'En envíos', 'Prioridad'].map((h) => (
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
          {leads.map((l, i) => {
            const prio = priorityOf(l);
            return (
              <tr key={l.email} className="border-b border-cu-border2 transition-colors hover:bg-cu-cyan/[0.03]">
                <td className="px-3 py-2 text-[11px] font-semibold text-cu-grey">{i + 1}</td>
                <td className="px-3 py-2 text-[12px] font-semibold text-cu-dblue">{fullName(l)}</td>
                <td className="px-3 py-2 text-[12px] text-cu-dgrey">{l.company || '—'}</td>
                <td className="px-3 py-2 text-[11.5px] text-cu-dgrey">{l.email}</td>
                <td className="px-3 py-2 text-[12px] font-bold text-cu-dblue">{numEs(l.clicks)}</td>
                <td className="px-3 py-2 text-[12px] text-cu-dgrey">{numEs(l.opens)}</td>
                <td className="px-3 py-2 text-[12px] text-cu-dgrey">{l.campaigns || (l.emailAppearances?.length ?? 1)}</td>
                <td className="px-3 py-2">
                  <span className={`whitespace-nowrap rounded-[3px] px-2 py-0.5 text-[9px] font-bold tracking-[0.4px] ${BADGE[prio]}`}>
                    ● {prio}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
