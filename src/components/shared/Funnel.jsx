// Embudo genérico y reutilizable (cono con clip-path). El texto de cada etapa
// se centra y se acota al ancho de la forma, para que NUNCA sobresalga del color.
//
// Props:
//   stages: [{ name, value, desc, gradient?, retention?, drop? }]
//     · drop = texto del conector que va ARRIBA de la etapa (para i > 0)
//   Los anchos del cono se calculan solos (de 100% arriba a ~40% abajo).

const GRADIENTS = [
  'linear-gradient(135deg,#1b1e42,#343c7d)',
  'linear-gradient(135deg,#2069a8,#3eb2ed)',
  'linear-gradient(135deg,#247a44,#3fb86a)',
  'linear-gradient(135deg,#5a6aa8,#8a97cf)',
];

const trap = (t, b) => {
  const tl = (100 - t) / 2,
    tr = 100 - tl,
    bl = (100 - b) / 2,
    br = 100 - bl;
  return `polygon(${tl}% 0, ${tr}% 0, ${br}% 100%, ${bl}% 100%)`;
};

function Drop({ children }) {
  return (
    <div className="flex w-full items-center justify-center gap-2 py-[7px] text-[10px] tracking-[0.3px] text-cu-grey">
      <span className="h-px w-8 bg-cu-border" />
      {children}
      <span className="h-px w-8 bg-cu-border" />
    </div>
  );
}

function Stage({ gradient, topW, botW, name, value, desc, retention }) {
  const maxW = Math.max(Math.min(topW, botW) - 6, 20);
  return (
    <div className="relative flex h-[84px] w-full items-center justify-center text-center text-white">
      <span
        className="absolute inset-0 z-[1]"
        style={{ clipPath: trap(topW, botW), background: gradient, filter: 'drop-shadow(0 3px 6px rgba(27,30,66,.14))' }}
      />
      <div className="z-[3] mx-auto flex flex-col items-center gap-0.5 px-2" style={{ maxWidth: `${maxW}%` }}>
        <span className="text-[9px] font-bold uppercase leading-tight tracking-[0.6px] opacity-90">{name}</span>
        <span className="text-[24px] font-bold leading-none tracking-tight">{value}</span>
        {desc && <span className="mt-0.5 text-[9.5px] leading-tight opacity-95">{desc}</span>}
      </div>
      {retention != null && (
        <span className="absolute right-3 top-1/2 z-[4] -translate-y-1/2 whitespace-nowrap rounded-full border border-cu-border bg-white px-2.5 py-[3px] text-[11px] font-bold text-cu-dblue shadow-cu">
          {retention}
        </span>
      )}
    </div>
  );
}

export function Funnel({ stages = [] }) {
  const n = stages.length;
  if (!n) return null;
  // Fronteras de ancho: de 100% arriba a 40% abajo, repartidas entre las etapas.
  const bound = (i) => 100 - (60 * i) / n;

  return (
    <div className="flex flex-col items-center">
      {stages.map((s, i) => (
        <div key={i} className="w-full">
          {i > 0 && s.drop && <Drop>{s.drop}</Drop>}
          <Stage
            gradient={s.gradient ?? GRADIENTS[i % GRADIENTS.length]}
            topW={bound(i)}
            botW={bound(i + 1)}
            name={s.name}
            value={s.value}
            desc={s.desc}
            retention={s.retention}
          />
        </div>
      ))}
    </div>
  );
}
