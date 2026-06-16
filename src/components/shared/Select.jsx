import { ChevronDown } from 'lucide-react';

// Select de marca (reemplaza el <select> nativo estilizado del original).
export function Select({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-[3px]">
      {label && (
        <label className="text-[9px] font-bold uppercase tracking-[0.6px] text-cu-grey">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-[200px] cursor-pointer appearance-none rounded-sm border border-cu-border bg-white py-[7px] pl-3 pr-8 text-[13px] text-cu-dgrey outline-none transition-colors focus:border-cu-cyan focus:ring-2 focus:ring-cu-cyan/15"
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cu-grey" />
      </div>
    </div>
  );
}
