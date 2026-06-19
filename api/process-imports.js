// ════════════════════════════════════════════════════════════════
//  /api/process-imports — Importador autónomo (Vercel Serverless Function)
//
//  Detecta archivos nuevos en el bucket `imports/inbox` de Supabase Storage,
//  los parsea, los carga en las tablas y mueve el archivo a `processed/`
//  (o `failed/` si algo sale mal). El dashboard se actualiza solo por realtime.
//
//  Se dispara de dos formas:
//   1) Webhook de Supabase Storage (al subir un archivo) → procesa ese archivo.
//   2) Cron diario / llamada manual → barre todo `inbox/`.
//
//  Convención de nombre de archivo (separador "__"):
//     <pilar>__<cuenta>__<periodo>__<dataset>.csv|xlsx
//  Ejemplos:
//     paid__pt__m05__campaigns.csv
//     social__cul__m05__metrics.csv
//     social__cul__m05__posts.csv
//     social__cul__na__audience-seniority.csv
//     website__cua__q1-2026__site.csv
//
//  Seguridad: usa la SERVICE ROLE key (server-only) y exige el header
//  `x-autoimport-secret` == AUTOIMPORT_SECRET.
// ════════════════════════════════════════════════════════════════
import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const BUCKET = 'imports';
const INBOX = 'inbox';

// ── Coerción de valores (es-AR/es-ES: "1.144", "35,33", "26,91 EUR", "12.89%") ──
function coerce(value, type) {
  if (value == null || value === '') return null;
  if (type === 'text') return String(value).trim();
  let s = String(value).trim().replace(/[%€$]/g, '').replace(/[A-Za-z]/g, '').trim();
  if (s.includes(',') && s.includes('.')) s = s.replace(/\./g, '').replace(',', '.');
  else if (s.includes(',')) s = s.replace(',', '.');
  const n = Number(s);
  if (Number.isNaN(n)) return null;
  return type === 'int' ? Math.round(n) : n;
}

const cleanCampaignName = (name) => {
  if (!name) return name;
  const p = String(name).split(/\s*-\s*/).filter(Boolean);
  return p.length >= 3 ? p.slice(1, -1).join(' - ') : p.length === 2 ? p[0] : name;
};

// ── Definición de datasets: columnas esperadas (con alias) por tipo ──
// (Paid/Google Ads está validado con exports reales; el resto trae alias
//  provisionales — ajustar cuando haya un export real de cada plataforma.)
const DATASETS = {
  'paid:campaigns': {
    pilar: 'paid', source: 'google_ads', headerOffset: 2, cleanName: true,
    fields: {
      name: ['Campaña', 'Campaign', 'campaña'],
      impressions: ['Impr.', 'Impresiones', 'Impressions'],
      clicks: ['Clics', 'Clicks'],
      ctr: ['CTR'],
      cpc: ['Prom. CPC', 'CPC medio', 'Avg. CPC', 'CPC'],
      cost: ['Costo', 'Coste', 'Cost'],
      conversions: ['Conversiones', 'Conversions'],
      cost_per_conv: ['Costo/conv.', 'Coste/conv.', 'Cost / conv.'],
      conversion_rate: ['Porcentaje de conv.', 'Tasa de conversión'],
    },
    types: { name: 'text', impressions: 'int', clicks: 'int', ctr: 'num', cpc: 'num', cost: 'num', conversions: 'num', cost_per_conv: 'num', conversion_rate: 'num' },
  },
  'social:metrics': {
    pilar: 'social', source: 'linkedin',
    fields: {
      impressions: ['Impresiones', 'Impressions', 'Impr.'],
      clicks: ['Clics', 'Clicks'],
      engagement_rate: ['Engagement Rate', 'ER', 'Tasa de interacción', 'Engagement rate (%)'],
      profile_visits: ['Visitas al perfil', 'Profile visits', 'Visitas únicas al perfil'],
      new_followers: ['Seguidores nuevos', 'New followers', 'Nuevos seguidores'],
    },
    types: { impressions: 'int', clicks: 'int', engagement_rate: 'num', profile_visits: 'int', new_followers: 'int' },
  },
  'social:posts': {
    pilar: 'social', source: 'linkedin',
    fields: {
      title: ['Título', 'Title', 'Publicación', 'Texto de la publicación', 'Post title'],
      impressions: ['Impresiones', 'Impressions', 'Impr.'],
      engagement_rate: ['Engagement Rate', 'ER', 'Tasa de interacción'],
      clicks: ['Clics', 'Clicks'],
      post_type: ['Tipo', 'Type', 'Tipo de publicación'],
      url: ['URL', 'Link', 'Enlace'],
    },
    types: { title: 'text', impressions: 'int', engagement_rate: 'num', clicks: 'int', post_type: 'text', url: 'text' },
  },
  'social:audience-seniority': {
    pilar: 'social', source: 'linkedin', dimension: 'seniority',
    fields: { label: ['Nivel de responsabilidad', 'Seniority', 'Etiqueta'], value: ['Total', 'Seguidores', 'Value', 'Valor', 'Count'] },
    types: { label: 'text', value: 'int' },
  },
  'social:audience-function': {
    pilar: 'social', source: 'linkedin', dimension: 'function',
    fields: { label: ['Función laboral', 'Job function', 'Función', 'Etiqueta'], value: ['Total', 'Seguidores', 'Value', 'Valor', 'Count'] },
    types: { label: 'text', value: 'int' },
  },
  'website:site': {
    pilar: 'website', source: 'ga4',
    fields: {
      single_traffic: ['Single Traffic', 'Usuarios', 'Users', 'Usuarios activos', 'Visitantes únicos'],
      total_traffic: ['Total Traffic', 'Sesiones', 'Sessions', 'Visitas'],
      impressions: ['Impressions', 'Vistas de página', 'Page views', 'Pageviews', 'Impresiones'],
      conversions: ['Conversions', 'Conversiones'],
    },
    types: { single_traffic: 'int', total_traffic: 'int', impressions: 'int', conversions: 'int' },
  },
  'website:seo': {
    pilar: 'website', source: 'gsc',
    fields: {
      average_position: ['Average Position', 'Posición promedio', 'Avg position', 'Position'],
      impressions: ['Impressions', 'Impresiones'],
      total_clicks: ['Total Clicks', 'Clics', 'Clicks', 'Clics totales'],
    },
    types: { average_position: 'num', impressions: 'int', total_clicks: 'int' },
  },
};

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
function resolveColumn(columns, aliases) {
  const wanted = aliases.map(norm);
  return columns.find((c) => wanted.includes(norm(c))) || null;
}

function parseBuffer(bytes, ext, headerOffset = 0) {
  if (['csv', 'tsv', 'txt'].includes(ext)) {
    let text = new TextDecoder('utf-8').decode(bytes);
    if (headerOffset > 0) text = text.split(/\r?\n/).slice(headerOffset).join('\n');
    const res = Papa.parse(text, { header: true, skipEmptyLines: true });
    return { columns: res.meta.fields || [], rows: res.data };
  }
  const wb = XLSX.read(bytes, { type: 'array' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', range: headerOffset });
  return { columns: rows.length ? Object.keys(rows[0]) : [], rows };
}

// Mapea filas crudas → registros con los campos canónicos.
function buildRecords(def, columns, rows) {
  const mapping = {};
  for (const key of Object.keys(def.fields)) mapping[key] = resolveColumn(columns, def.fields[key]);
  const required = def.dimension ? ['label', 'value'] : Object.keys(def.fields).slice(0, 1);
  const make = (row) => {
    const rec = {};
    for (const key of Object.keys(def.fields)) {
      const col = mapping[key];
      rec[key] = col ? coerce(row[col], def.types[key]) : null;
    }
    if (def.cleanName && rec.name) rec.name = cleanCampaignName(rec.name);
    return rec;
  };
  return rows.map(make).filter((r) => required.every((k) => r[k] != null && r[k] !== ''));
}

function computePaidTotals(rows) {
  const sum = (k) => rows.reduce((a, r) => a + (Number(r[k]) || 0), 0);
  const impressions = sum('impressions'), clicks = sum('clicks'), cost = sum('cost'), conversions = sum('conversions');
  return {
    impressions, clicks, conversions, cost: Number(cost.toFixed(2)),
    ctr: impressions ? Number(((clicks / impressions) * 100).toFixed(2)) : 0,
    cpc: clicks ? Number((cost / clicks).toFixed(2)) : 0,
    conversion_rate: clicks ? Number(((conversions / clicks) * 100).toFixed(2)) : 0,
    cost_per_conv: conversions ? Number((cost / conversions).toFixed(2)) : 0,
  };
}

// Interpreta el nombre del archivo → { pilar, account, period, datasetKey, def }.
function parseName(path) {
  const base = path.split('/').pop();
  const dot = base.lastIndexOf('.');
  const ext = base.slice(dot + 1).toLowerCase();
  const stem = base.slice(0, dot);
  const [pilar, account, periodRaw, dataset] = stem.split('__');
  if (!pilar || !account || !dataset) throw new Error(`Nombre inválido: ${base} (esperado pilar__cuenta__periodo__dataset.ext)`);
  const period = !periodRaw || periodRaw === 'na' || periodRaw === '_' ? null : periodRaw;
  const datasetKey = `${pilar}:${dataset}`;
  const def = DATASETS[datasetKey];
  if (!def) throw new Error(`Dataset desconocido: ${datasetKey}`);
  return { pilar, account, period, datasetKey, dataset, ext, def };
}

async function ensureClient(supa, pilar, id, name) {
  const table = { social: 'social_clients', paid: 'paid_clients', website: 'web_clients' }[pilar];
  if (!table) return;
  await supa.from(table).upsert({ id, name: name || id }, { onConflict: 'id' });
}

async function processFile(supa, path) {
  const meta = parseName(path);
  const { def, pilar, account, period, dataset } = meta;

  // Descargar y parsear
  const { data: blob, error: dlErr } = await supa.storage.from(BUCKET).download(path);
  if (dlErr) throw dlErr;
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const { columns, rows } = parseBuffer(bytes, meta.ext, def.headerOffset || 0);
  const records = buildRecords(def, columns, rows);
  if (!records.length) throw new Error('Sin filas válidas (revisar columnas/encabezado)');

  await ensureClient(supa, pilar, account);

  // Ledger
  const { data: imp } = await supa
    .from('imports')
    .insert({ pilar, source: def.source, client_id: account, period_id: period, file_name: path.split('/').pop(), row_count: records.length, status: 'ok' })
    .select().single();
  const import_id = imp?.id;

  // Carga según dataset
  if (dataset === 'metrics') {
    await supa.from('social_metrics').upsert({ client_id: account, period_id: period, ...records[0], import_id }, { onConflict: 'client_id,period_id' });
  } else if (dataset === 'posts') {
    await supa.from('social_posts').delete().eq('client_id', account).eq('period_id', period);
    await supa.from('social_posts').insert(records.map((r) => ({ client_id: account, period_id: period, ...r, import_id })));
  } else if (dataset.startsWith('audience')) {
    await supa.from('social_audience').delete().eq('client_id', account).eq('dimension', def.dimension);
    await supa.from('social_audience').insert(records.map((r) => ({ client_id: account, dimension: def.dimension, ...r, import_id })));
  } else if (dataset === 'campaigns') {
    await supa.from('paid_campaigns').delete().eq('client_id', account).eq('period_id', period).eq('platform', 'google_ads');
    await supa.from('paid_campaigns').insert(records.map((r) => ({ client_id: account, period_id: period, platform: 'google_ads', ...r, import_id })));
    await supa.from('paid_metrics').upsert({ client_id: account, period_id: period, platform: 'google_ads', currency: 'EUR', ...computePaidTotals(records), import_id }, { onConflict: 'client_id,period_id,platform' });
  } else if (dataset === 'site') {
    await supa.from('web_site_metrics').upsert({ client_id: account, period_id: period, ...records[0], import_id }, { onConflict: 'client_id,period_id' });
  } else if (dataset === 'seo') {
    await supa.from('web_seo_metrics').upsert({ client_id: account, period_id: period, ...records[0], import_id }, { onConflict: 'client_id,period_id' });
  }

  return { ok: true, pilar, account, period, dataset, rows: records.length };
}

async function moveTo(supa, path, folder) {
  const name = path.split('/').pop();
  await supa.storage.from(BUCKET).move(path, `${folder}/${Date.now()}_${name}`).catch(() => {});
}

export default async function handler(req, res) {
  // Seguridad: acepta el webhook (header secreto) o el cron de Vercel (Bearer).
  const importSecret = process.env.AUTOIMPORT_SECRET;
  const cronSecret = process.env.CRON_SECRET;
  const okImport = importSecret && (req.headers['x-autoimport-secret'] === importSecret || req.query?.secret === importSecret);
  const okCron = cronSecret && req.headers['authorization'] === `Bearer ${cronSecret}`;
  // Si hay algún secreto configurado, exigir que matchee alguno.
  if ((importSecret || cronSecret) && !okImport && !okCron) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return res.status(500).json({ error: 'Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY' });
  const supa = createClient(url, serviceKey, { auth: { persistSession: false } });

  // Qué procesar: webhook (un archivo) o barrido de inbox/
  let files = [];
  const rec = req.body?.record;
  if (req.method === 'POST' && rec?.name) {
    if (!rec.name.startsWith(`${INBOX}/`)) return res.status(200).json({ skipped: rec.name });
    files = [rec.name];
  } else {
    const { data } = await supa.storage.from(BUCKET).list(INBOX, { limit: 200 });
    files = (data || []).filter((f) => f.id).map((f) => `${INBOX}/${f.name}`);
  }

  const results = [];
  for (const path of files) {
    try {
      const out = await processFile(supa, path);
      await moveTo(supa, path, 'processed');
      results.push(out);
    } catch (e) {
      await moveTo(supa, path, 'failed');
      results.push({ ok: false, path, error: e.message });
    }
  }
  return res.status(200).json({ processed: results.length, results });
}
