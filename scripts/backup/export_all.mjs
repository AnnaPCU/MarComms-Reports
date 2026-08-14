// ════════════════════════════════════════════════════════════════
// BACKUP DE REPORTES — descarga TODOS los reportes de la web (interno
// y externo) recorriendo pilar → cuenta → período, y los guarda en una
// estructura de carpetas lista para subir a OneDrive:
//
//   <outDir>/<Pilar>/<Cuenta>/<archivo>.html
//
// Solo descarga períodos CON datos (respeta el badge de honestidad).
// La vista comparativa de Social se baja una sola vez (es global).
//
// Uso (con la app corriendo, p. ej. `npm run preview -- --port 4300`):
//   node scripts/backup/export_all.mjs http://localhost:4300 /ruta/salida [pilar]
//   · pilar opcional: "Social Media" | "Paid Media" | "Website"
// Requiere playwright-core y el chromium preinstalado del entorno.
// ════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const [baseUrl, outDir, onlyPilar] = process.argv.slice(2);
if (!baseUrl || !outDir) {
  console.error('Uso: node export_all.mjs <baseUrl> <outDir> [pilar]');
  process.exit(1);
}
const EXECUTABLE = process.env.CHROME_BIN ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const PASSWORD = process.env.REPORTS_PASSWORD ?? 'marcomms2026';
const PILARES = ['Social Media', 'Paid Media', 'Website'].filter(
  (p) => !onlyPilar || p === onlyPilar,
);
const AUDIENCIAS = ['Uso interno', 'Uso externo'];

const b = await chromium.launch({ executablePath: EXECUTABLE });
const ctx = await b.newContext({ acceptDownloads: true });
const page = await ctx.newPage();
await page.goto(baseUrl);
await page.fill('input[type="password"]', PASSWORD);
await page.click('button[type="submit"]');
await page.waitForTimeout(800);

let total = 0;
for (const pilar of PILARES) {
  await page.click(`nav >> text=${pilar}`);
  await page.waitForTimeout(600);
  const accounts = await (await page.$$('header select'))[0].$$eval('option', (os) => os.map((o) => o.textContent));

  for (const [ai, account] of accounts.entries()) {
    let sels = await page.$$('header select');
    await sels[0].selectOption({ label: account });
    await page.waitForTimeout(500);
    const periods = await (await page.$$('header select'))[1].$$eval('option', (os) => os.map((o) => o.textContent));

    for (const period of periods) {
      // La comparativa multi-cuenta es global: se baja solo con la 1ra cuenta.
      if (period === 'Comparativa Multi-Cuenta' && ai > 0) continue;
      sels = await page.$$('header select');
      await sels[1].selectOption({ label: period });
      await page.waitForTimeout(900);
      const header = await page.$eval('header', (h) => h.innerText);
      if (header.includes('Sin datos para este período')) {
        console.log(`  · skip (sin datos): ${pilar} / ${account} / ${period}`);
        continue;
      }

      const dir = path.join(outDir, pilar, account.replace(/[/\\:]/g, '-'));
      fs.mkdirSync(dir, { recursive: true });
      for (const aud of AUDIENCIAS) {
        await page.click('header >> text=Descargar');
        await page.waitForTimeout(350);
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          page.click(`button:has-text("${aud}")`),
        ]);
        const dest = path.join(dir, download.suggestedFilename());
        await download.saveAs(dest);
        total++;
      }
      console.log(`  ✓ ${pilar} / ${account} / ${period}`);
    }
  }
}

console.log(`Listo: ${total} archivos en ${outDir}`);
await b.close();
