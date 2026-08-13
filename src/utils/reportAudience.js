// ¿El reporte embebido (HTML descargado) es de USO EXTERNO?
// En uso externo se oculta la sección "Conclusión — Próximos Pasos".
// En la app en vivo (sin embed) siempre devuelve false → se muestra todo.
export function isExternalReport() {
  const e = typeof window !== 'undefined' ? window.__REPORT_EMBED__ : null;
  return Boolean(e && e.audience === 'external');
}

// ¿Estamos dentro de un HTML descargado (embed)?
// El descargable muestra TODO el contenido de una vez (sin toggles de vista),
// para que el archivo entregue el reporte completo.
export function isEmbedReport() {
  return Boolean(typeof window !== 'undefined' && window.__REPORT_EMBED__);
}
