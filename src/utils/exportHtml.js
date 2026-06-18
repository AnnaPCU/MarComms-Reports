// ════════════════════════════════════════════════════════════════
//  EXPORTAR VISTA A HTML INTERACTIVO
//  En producción: embebe el bundle JS + CSS de la app + un snapshot de
//  los datos, y marca `window.__REPORT_EMBED__` para que main.jsx
//  renderice SOLO esa vista, interactiva y offline (hover, tabs, etc.).
//  En dev (sin bundle único) cae a un snapshot estático del DOM.
// ════════════════════════════════════════════════════════════════

import { BRAND_LOGOS } from '@/constants/brand';

const FONT_LINK =
  '<link href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap" rel="stylesheet" />';

// Convierte un asset (logo) a data URI para que funcione offline en el HTML.
async function fetchAsDataUri(url) {
  try {
    const blob = await (await fetch(url)).blob();
    return await new Promise((resolve) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = () => resolve(null);
      fr.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function triggerDownload(html, filename) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function fetchText(url) {
  try {
    const r = await fetch(url);
    return await r.text();
  } catch {
    return '';
  }
}

function collectInlineCss() {
  let css = '';
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) css += rule.cssText + '\n';
    } catch {
      /* cross-origin */
    }
  }
  return css;
}

// Escapa para poder inyectar dentro de <script> sin romper el parser.
const safeForScript = (s) => s.replace(/<\/script>/gi, '<\\/script>');
const safeJson = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');

export async function exportViewAsHtml({ pilar, account, period, brand, title, filename, snapshot }) {
  // Logo de la marca como data URI (para que no se rompa en el archivo offline).
  const logoSrc = brand && BRAND_LOGOS[brand] ? await fetchAsDataUri(BRAND_LOGOS[brand].src) : null;

  // Buscar el bundle de producción (Vite emite 1 JS + 1 CSS en /assets/).
  const moduleSrc = [...document.querySelectorAll('script[type="module"][src]')]
    .map((s) => s.src)
    .find((src) => src.includes('/assets/'));
  const cssHrefs = [...document.querySelectorAll('link[rel="stylesheet"][href]')]
    .map((l) => l.href)
    .filter((h) => h.includes('/assets/'));

  // ── Modo interactivo (producción) ──
  if (moduleSrc) {
    const js = await fetchText(moduleSrc);
    let css = '';
    for (const href of cssHrefs) css += (await fetchText(href)) + '\n';
    if (!css) css = collectInlineCss();

    const embed = safeJson({ pilar, account, period, brand, title, snapshot, logoSrc });

    const doc = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
${FONT_LINK}
<style>${css}</style>
</head>
<body>
<div id="root"></div>
<script>window.__REPORT_EMBED__ = ${embed};</script>
<script type="module">${safeForScript(js)}</script>
</body>
</html>`;
    triggerDownload(doc, filename);
    return { interactive: true };
  }

  // ── Fallback estático (dev: no hay bundle único) ──
  const node = document.getElementById('report-view');
  const css = collectInlineCss();
  const content = node ? node.outerHTML : '<p>Vista no encontrada</p>';
  const doc = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8" />${FONT_LINK}<title>${title}</title>
<style>${css}
body{margin:0;background:#f0f4f5;font-family:'Ubuntu',Calibri,sans-serif;color:#4f6566;}
.cu-wrap{max-width:1440px;margin:0 auto;padding:24px 36px 44px;}
.cu-bar-top{height:5px;background:#3eb2ed;}
</style></head>
<body><div class="cu-bar-top"></div><div class="cu-wrap">${content}</div></body></html>`;
  triggerDownload(doc, filename);
  return { interactive: false };
}
