// ════════════════════════════════════════════════════════════════
//  MODO DEMO — TEMPORAL (pedido del 10/9/2026 para grabar un recorrido
//  del sistema sin exponer cifras reales). Cuando la app se abre en la
//  ruta /demo (o con ?demo=1), todos los dígitos visibles se reemplazan
//  por «x» en el DOM: KPIs, tablas, embudos, ejes y tooltips de los
//  gráficos, insights… Los datos NO se tocan: la vista se calcula igual
//  y solo se enmascara lo que se ve. Se conservan años, fechas, «Q1-Q4»
//  y nombres de normas (ISO 14064), para que la navegación se entienda.
//
//  Cómo se saca cuando ya no haga falta (ver PROJECT_CONTEXT.md):
//    1. borrar este archivo;
//    2. quitar el import y la llamada en src/main.jsx;
//    3. quitar `demo` en App.jsx / Header.jsx (chip + descarga bloqueada);
//    4. quitar el atributo data-demo-keep de Glossary.jsx;
//    5. quitar el rewrite de /demo en vercel.json.
// ════════════════════════════════════════════════════════════════

export function isDemoMode() {
  if (typeof window === 'undefined') return false;
  const { pathname, search, hash } = window.location;
  return (
    pathname.replace(/\/+$/, '') === '/demo' ||
    /[?&]demo(?:=[^&]*)?(?:&|$)/.test(search) ||
    hash === '#demo'
  );
}

// Fragmentos que NO se enmascaran (se necesitan para orientarse en la demo):
// años, fechas, trimestres, normas ISO y rangos horarios.
const KEEP = new RegExp(
  // Orden importa: las fechas completas van antes que el año suelto, porque la
  // alternancia toma la primera opción que matchea en cada posición.
  [
    String.raw`\b\d{4}-\d{2}-\d{2}\b`, // 2026-08-10
    String.raw`\b\d{1,2}\/\d{1,2}(?:\/\d{2,4})?\b`, // 10/8, 21/08/2026
    String.raw`\b\d{1,2}\s+de\s+(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)(?:\s+de\s+\d{4})?`, // 26 de agosto de 2026
    String.raw`\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2}\b`, // Aug 26
    String.raw`\b\d{1,2}\s*[–-]\s*\d{1,2}\s*h\b`, // 10–19 h
    String.raw`\b(?:19|20)\d{2}\b`, // años
    String.raw`\bISO[\s-]?\d[\d-]*`, // ISO 14064, ISO 27001
    String.raw`\bQ[1-4]\b`, // trimestres
  ].join('|'),
  'gi',
);

export function maskDigits(text) {
  if (!/\d/.test(text)) return text;
  let out = '';
  let last = 0;
  KEEP.lastIndex = 0;
  for (const m of text.matchAll(KEEP)) {
    out += text.slice(last, m.index).replace(/\d/g, 'x') + m[0];
    last = m.index + m[0].length;
  }
  return out + text.slice(last).replace(/\d/g, 'x');
}

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT']);

function shouldSkip(textNode) {
  let el = textNode.parentElement;
  while (el) {
    if (SKIP_TAGS.has(el.tagName) || el.hasAttribute('data-demo-keep')) return true;
    el = el.parentElement;
  }
  return false;
}

function maskNode(textNode) {
  if (shouldSkip(textNode)) return;
  const v = textNode.nodeValue;
  const masked = maskDigits(v);
  if (masked !== v) textNode.nodeValue = masked; // sin dígitos → no vuelve a disparar
}

function maskTree(root) {
  if (root.nodeType === Node.TEXT_NODE) return maskNode(root);
  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) maskNode(n);
}

// Enmascara lo que ya está en pantalla y todo lo que React vaya pintando
// después (cambios de vista, tooltips de los gráficos, etc.).
export function installDemoMask(root = document.body) {
  maskTree(root);
  const obs = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === 'characterData') maskNode(m.target);
      else m.addedNodes.forEach(maskTree);
    }
  });
  obs.observe(root, { childList: true, characterData: true, subtree: true });
  document.title = `${document.title} — DEMO`;
  return obs;
}
