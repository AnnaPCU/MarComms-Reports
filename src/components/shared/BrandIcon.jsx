// ════════════════════════════════════════════════════════════════
//  FRAMEWORK DE ÍCONOS DE MARCA — única forma permitida de renderizar
//  íconos decorativos en los reportes. Reglas (manual de marca CU):
//
//  · Nada de emojis (📌 🎯 ⚡…): traen colores propios fuera de paleta.
//  · Un solo color por contexto, elegido por CONTRASTE con el fondo:
//      tone="onDark"  → blanco       (cabeceras dark blue de paneles)
//      tone="accent"  → CU Cyan      (fondos claros: secciones, tablas)
//      tone="muted"   → CU Grey      (estados vacíos, texto secundario)
//  · Los íconos de ESTADO (alertas amber, éxito/error de badges) quedan
//    fuera de este framework: acompañan el color semántico de su caja.
//
//  Uso:  <BrandIcon icon={Target} tone="onDark" size="sm" />
// ════════════════════════════════════════════════════════════════

const TONES = {
  onDark: 'text-white',
  accent: 'text-cu-cyan',
  muted: 'text-cu-grey',
};

const SIZES = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-6 w-6',
};

export function BrandIcon({ icon: Icon, tone = 'accent', size = 'md', className = '' }) {
  if (!Icon) return null;
  return <Icon className={`shrink-0 ${SIZES[size] ?? SIZES.md} ${TONES[tone] ?? TONES.accent} ${className}`} />;
}
