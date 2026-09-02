// Idioma inicial de una vista. En la app siempre arranca en español (o el
// default del componente); en un HTML descargado respeta el idioma principal
// elegido en el diálogo de descarga (window.__REPORT_EMBED__.lang) — y el
// toggle ES/EN sigue disponible para cambiarlo después.
export function initialLang(fallback = 'es') {
  if (typeof window !== 'undefined' && window.__REPORT_EMBED__?.lang) {
    return window.__REPORT_EMBED__.lang;
  }
  return fallback;
}
