import { BRAND_LOGOS, MARCOMMS_LOGO } from '@/constants/brand';

const EMBED = typeof window !== 'undefined' ? window.__REPORT_EMBED__ : null;

// ════════════════════════════════════════════════════════════════
//  JERARQUÍA DE MARCA DE LOS REPORTES
//  · MarComms (equipo autor) = logo principal — header y favicon.
//  · Cliente (CU / Peterson) = segundo plano — chip discreto con la
//    leyenda «Cliente» / «Reporte para», más chico y sin competir.
//  En modo embed (HTML descargado) se usan los data URI embebidos para
//  que los logos no se rompan offline.
// ════════════════════════════════════════════════════════════════

// Logo principal MarComms (isotipo + wordmark).
export function MarCommsLogo({ className = '', variant = 'full' }) {
  const src = EMBED?.marcommsLogoSrc && variant === 'full' ? EMBED.marcommsLogoSrc : MARCOMMS_LOGO[variant];
  return (
    <img
      src={src}
      alt={MARCOMMS_LOGO.alt}
      className={`block w-auto shrink-0 ${className || 'h-8'}`}
    />
  );
}

// Logo del cliente cuyas métricas se reportan.
//  brand = 'cu' | 'peterson' | null (null → no se muestra nada).
export function Logo({ brand = 'cu', className = '' }) {
  const fallback = BRAND_LOGOS[brand];
  const src = EMBED?.logoSrc && brand === EMBED.brand ? EMBED.logoSrc : fallback?.src;
  if (!src) return null;
  return (
    <img
      src={src}
      alt={fallback?.alt || 'Logo'}
      className={`block w-auto shrink-0 ${className || 'h-9'}`}
    />
  );
}

// Cliente en segundo plano: solo el logo, reducido y sin etiqueta.
export function ClientLogo({ brand, className = '' }) {
  if (!BRAND_LOGOS[brand]) return null;
  return (
    // Tope de ancho: los wordmarks anchos (Peterson) no deben competir con
    // el logo de MarComms, que es el principal del reporte.
    <Logo brand={brand} className={`h-6 max-w-[124px] object-contain opacity-90 ${className}`} />
  );
}
