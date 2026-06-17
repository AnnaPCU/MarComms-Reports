import { supabase } from '@/lib/supabaseClient';
import { coerce } from '@/utils/import/parseFile';

// ════════════════════════════════════════════════════════════════
//  SERVICE de import manual.
//  Construye los registros a partir del mapeo de columnas y los persiste
//  en Supabase + escribe una fila en el ledger `imports`. El realtime de
//  cada tabla hace que la vista abierta se refresque sola.
// ════════════════════════════════════════════════════════════════

// "CU Portugal - GMP+ - Search" → "GMP+"  (limpia prefijo de cuenta y sufijo de tipo)
export function cleanCampaignName(name) {
  if (!name) return name;
  const parts = String(name).split(/\s*-\s*/).filter(Boolean);
  if (parts.length >= 3) return parts.slice(1, -1).join(' - ');
  if (parts.length === 2) return parts[0];
  return name;
}

// Aplica el mapeo (campo destino → columna origen) a las filas parseadas.
export function buildRecords(dataset, rows, mapping) {
  const make = (row) => {
    const rec = {};
    for (const f of dataset.fields) {
      const col = mapping[f.key];
      rec[f.key] = col ? coerce(row[col], f.type) : null;
    }
    if (dataset.cleanName && rec.name) rec.name = cleanCampaignName(rec.name);
    return rec;
  };
  if (dataset.mode === 'single') {
    return rows.length ? [make(rows[0])] : [];
  }
  // mode 'rows': descarta filas sin los campos requeridos.
  return rows
    .map(make)
    .filter((rec) => dataset.fields.every((f) => !f.required || rec[f.key] != null && rec[f.key] !== ''));
}

// Tabla de clientes por pilar (para crear cuentas nuevas al importar).
const CLIENT_TABLE = { social: 'social_clients', paid: 'paid_clients', website: 'web_clients' };

// slug estable a partir de un nombre ("CU Brasil" → "cu-brasil").
export function slugify(name) {
  return String(name)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 32);
}

async function ensureClient(pilar, id, name) {
  const table = CLIENT_TABLE[pilar];
  if (!table || !id) return;
  const { error } = await supabase.from(table).upsert({ id, name: name || id }, { onConflict: 'id' });
  if (error) throw error;
}

// Persiste un import. `extra.dimension` (audience) y `extra.clientName` (cuenta nueva).
export async function runImport({ pilar, source, clientId, periodId, dataset, records, extra = {} }) {
  if (!supabase) throw new Error('Supabase no está configurado — no se puede guardar.');
  if (!records.length) throw new Error('No hay filas válidas para importar.');

  // 0) Si es una cuenta nueva, crearla antes de escribir datos.
  if (extra.clientName) await ensureClient(pilar, clientId, extra.clientName);

  // 1) Ledger
  const { data: imp, error: impErr } = await supabase
    .from('imports')
    .insert({
      pilar,
      source,
      client_id: clientId,
      period_id: periodId,
      row_count: records.length,
      status: 'ok',
    })
    .select()
    .single();
  if (impErr) throw impErr;
  const importId = imp?.id;

  // 2) Datos (reemplaza lo existente de ese período para no duplicar)
  if (dataset.id === 'metrics') {
    const { error } = await supabase
      .from('social_metrics')
      .upsert(
        { client_id: clientId, period_id: periodId, ...records[0], import_id: importId },
        { onConflict: 'client_id,period_id' },
      );
    if (error) throw error;
  } else if (dataset.id === 'posts') {
    await supabase.from('social_posts').delete().eq('client_id', clientId).eq('period_id', periodId);
    const { error } = await supabase
      .from('social_posts')
      .insert(records.map((r) => ({ client_id: clientId, period_id: periodId, ...r, import_id: importId })));
    if (error) throw error;
  } else if (dataset.id === 'audience') {
    await supabase
      .from('social_audience')
      .delete()
      .eq('client_id', clientId)
      .eq('dimension', extra.dimension);
    const { error } = await supabase
      .from('social_audience')
      .insert(
        records.map((r) => ({ client_id: clientId, dimension: extra.dimension, ...r, import_id: importId })),
      );
    if (error) throw error;
  } else if (dataset.id === 'campaigns') {
    // ── Paid Media: reemplaza campañas y recalcula los totales del período ──
    const platform = 'google_ads';
    await supabase
      .from('paid_campaigns')
      .delete()
      .eq('client_id', clientId)
      .eq('period_id', periodId)
      .eq('platform', platform);
    const { error: cErr } = await supabase.from('paid_campaigns').insert(
      records.map((r) => ({ client_id: clientId, period_id: periodId, platform, ...r, import_id: importId })),
    );
    if (cErr) throw cErr;

    const totals = computePaidTotals(records);
    const { error: mErr } = await supabase.from('paid_metrics').upsert(
      {
        client_id: clientId,
        period_id: periodId,
        platform,
        currency: 'EUR',
        ...totals,
        import_id: importId,
      },
      { onConflict: 'client_id,period_id,platform' },
    );
    if (mErr) throw mErr;
  }

  return { importId, count: records.length };
}

// Suma las campañas y deriva las tasas del período.
function computePaidTotals(rows) {
  const sum = (k) => rows.reduce((a, r) => a + (Number(r[k]) || 0), 0);
  const impressions = sum('impressions');
  const clicks = sum('clicks');
  const cost = sum('cost');
  const conversions = sum('conversions');
  return {
    impressions,
    clicks,
    cost: Number(cost.toFixed(2)),
    conversions,
    ctr: impressions ? Number(((clicks / impressions) * 100).toFixed(2)) : 0,
    cpc: clicks ? Number((cost / clicks).toFixed(2)) : 0,
    conversion_rate: clicks ? Number(((conversions / clicks) * 100).toFixed(2)) : 0,
    cost_per_conv: conversions ? Number((cost / conversions).toFixed(2)) : 0,
  };
}

// Recuerda el mapeo por (pilar, dataset, fuente) en localStorage.
const mapKey = (pilar, dataset, source) => `reports_import_map_${pilar}_${dataset}_${source}`;

export function loadMapping(pilar, dataset, source) {
  try {
    return JSON.parse(localStorage.getItem(mapKey(pilar, dataset, source)) || '{}');
  } catch {
    return {};
  }
}

export function saveMapping(pilar, dataset, source, mapping) {
  localStorage.setItem(mapKey(pilar, dataset, source), JSON.stringify(mapping));
}
