// ════════════════════════════════════════════════════════════════
//  EXPORTAR VISTA A HTML — genera un .html autocontenido de la vista
//  actual: inlinea el CSS compilado (Tailwind), la fuente Ubuntu y los
//  dispositivos gráficos de marca. Los charts (SVG de Recharts) se
//  exportan tal cual se ven.
// ════════════════════════════════════════════════════════════════

function collectCss() {
  let css = '';
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) css += rule.cssText + '\n';
    } catch {
      // Hojas cross-origin (ej. Google Fonts): no se pueden leer; se re-linkean.
    }
  }
  return css;
}

export function exportViewAsHtml(node, { title = 'Reporte MarComms', filename = 'reporte.html' } = {}) {
  if (!node) return;
  const css = collectCss();
  const content = node.outerHTML;

  const doc = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap" rel="stylesheet" />
<style>
${css}
body { margin: 0; background: #f0f4f5; font-family: 'Ubuntu', Calibri, sans-serif; color: #4f6566; }
.cu-export-wrap { max-width: 1440px; margin: 0 auto; padding: 24px 36px 44px; }
.cu-bar-top { height: 5px; background: #3eb2ed; width: 100%; }
.cu-bar-bottom-wrap { display: flex; justify-content: flex-end; padding: 0 36px; }
.cu-bar-bottom { height: 5px; width: 65%; background: #1b1e42; border-radius: 3px 0 0 3px; }
.cu-footer { display: flex; align-items: center; justify-content: space-between; padding: 14px 36px 20px; flex-wrap: wrap; gap: 8px; }
.cu-footer p { font-size: 10px; color: #799495; margin: 0; }
.cu-tagline { font-size: 10px; font-weight: 700; color: #799495; text-transform: uppercase; letter-spacing: 1.2px; }
</style>
</head>
<body>
<div class="cu-bar-top"></div>
<div class="cu-export-wrap">${content}</div>
<div class="cu-bar-bottom-wrap"><div class="cu-bar-bottom"></div></div>
<footer class="cu-footer">
  <p>${title} · PCU Group · Exportado de Reportes MarComms</p>
  <span class="cu-tagline">The Proof to Your Promise</span>
</footer>
</body>
</html>`;

  const blob = new Blob([doc], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
