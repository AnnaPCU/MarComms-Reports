#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════
//  MAILCHIMP → SEED — herramienta de tooling (corre en Node, NO en la app).
//  Procesa los exports de destinatarios de Mailchimp (CSV) de una
//  secuencia/campaña y emite el objeto de período listo para pegar en
//  src/data/emailSeed.js (EMAIL_DB). Reutiliza la MISMA lógica pura que
//  la app (utils/mailchimp/*), así el seed y la vista quedan alineados.
//
//  Uso:
//    node scripts/mailchimp-to-seed.mjs <config.json>
//
//  config.json:
//  {
//    "accountId": "cu",
//    "accountName": "Control Union Argentina",
//    "handle": "",                     // opcional (ej. @cuarg)
//    "period": "m06",                  // id de MONTHS_2026
//    "campaignName": "Secuencia ESG — Junio 2026",
//    "emails": [
//      { "name": "Email 1 — Intro", "subject": "…",
//        "csv": "ruta/al/export-destinatarios.csv",   // para el ranking de hot leads
//        "stats": {                                     // resumen del reporte de Mailchimp
//          "sent": 1200, "delivered": 1180,             // (opcional pero recomendado)
//          "opens": 260, "clicks": 42,                  // aperturas/clics ÚNICOS
//          "bounces": 20, "unsubs": 3 }
//      }
//    ]
//  }
//
//  · Con "stats": las tasas se calculan sobre el volumen real de envío y el
//    CSV se usa sólo para armar los hot leads. Es el camino recomendado.
//  · Sin "stats": las métricas se derivan del propio CSV de destinatarios
//    (sirve cuando el export ya es la base completa de la campaña).
//
//  Emite por stdout el snippet JS. Con --write <ruta> escribe un .js aparte.
// ════════════════════════════════════════════════════════════════

import fs from 'node:fs';
import path from 'node:path';
import { extractLeads } from '../src/utils/mailchimp/leads.js';
import { buildCampaign } from '../src/utils/mailchimp/build.js';

// Parser CSV mínimo pero correcto (comillas, comas y saltos escapados).
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  const src = text.replace(/^﻿/, ''); // BOM
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\r') { /* ignore */ }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows
    .slice(1)
    .filter((r) => r.some((v) => String(v).trim() !== ''))
    .map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
}

function loadCsvRows(csvPath, baseDir) {
  const abs = path.isAbsolute(csvPath) ? csvPath : path.join(baseDir, csvPath);
  const text = fs.readFileSync(abs, 'utf8');
  return parseCSV(text);
}

// Serializa a JS legible (no JSON: sin comillas en keys simples, comillas simples).
function toJs(value, indent = 0) {
  const pad = '  '.repeat(indent);
  const pad1 = '  '.repeat(indent + 1);
  if (value === null) return 'null';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'null';
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'string') return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  if (Array.isArray(value)) {
    if (!value.length) return '[]';
    const items = value.map((v) => pad1 + toJs(v, indent + 1));
    return `[\n${items.join(',\n')}\n${pad}]`;
  }
  const keys = Object.keys(value);
  if (!keys.length) return '{}';
  const safe = (k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`);
  const entries = keys.map((k) => `${pad1}${safe(k)}: ${toJs(value[k], indent + 1)}`);
  return `{\n${entries.join(',\n')}\n${pad}}`;
}

function round(v, d = 2) {
  const f = 10 ** d;
  return Math.round((Number(v) || 0) * f) / f;
}

// Redondea las tasas para no arrastrar decimales infinitos al seed.
function tidy(campaign) {
  const r = (m) => {
    const o = { ...m };
    ['openRate', 'clickRate', 'ctor', 'bounceRate', 'unsubRate'].forEach((k) => {
      if (o[k] != null) o[k] = round(o[k]);
    });
    return o;
  };
  return {
    ...campaign,
    totals: campaign.totals ? r(campaign.totals) : campaign.totals,
    emails: campaign.emails.map((e) => ({ ...e, metrics: r(e.metrics) })),
  };
}

function main() {
  const args = process.argv.slice(2);
  const cfgPath = args.find((a) => !a.startsWith('--'));
  const writeIdx = args.indexOf('--write');
  const writePath = writeIdx >= 0 ? args[writeIdx + 1] : null;
  if (!cfgPath) {
    console.error('Uso: node scripts/mailchimp-to-seed.mjs <config.json> [--write out.js]');
    process.exit(1);
  }

  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  const baseDir = path.dirname(path.resolve(cfgPath));

  const emails = cfg.emails.map((e) => {
    const leads = e.csv ? extractLeads(loadCsvRows(e.csv, baseDir)) : [];
    return {
      name: e.name,
      subject: e.subject,
      leads,
      ...(e.stats ? { stats: e.stats } : {}),
    };
  });

  const campaign = tidy(buildCampaign({ campaignName: cfg.campaignName || '', emails }));

  const snippet =
    `// ${cfg.accountName} · ${cfg.period} — generado con scripts/mailchimp-to-seed.mjs\n` +
    `EMAIL_DB['${cfg.accountId}'] = {\n` +
    `  name: ${toJs(cfg.accountName)},\n` +
    (cfg.handle ? `  handle: ${toJs(cfg.handle)},\n` : '') +
    `  periods: {\n` +
    `    '${cfg.period}': ${toJs(campaign, 3)},\n` +
    `  },\n` +
    `};\n`;

  // Resumen a stderr (no ensucia el snippet de stdout).
  const t = campaign.totals || {};
  console.error(
    `✓ ${cfg.accountName} ${cfg.period}: ${t.emailCount} envíos · ${t.totalSent} enviados · ` +
      `apertura ${t.openRate}% · clics ${t.clickRate}% · ${campaign.hotLeadsCount} hot leads`,
  );

  if (writePath) {
    fs.writeFileSync(writePath, snippet);
    console.error(`→ escrito en ${writePath}`);
  } else {
    process.stdout.write(snippet);
  }
}

main();
