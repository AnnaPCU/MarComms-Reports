import { useEffect, useMemo, useState } from 'react';
import { X, UploadCloud, CheckCircle2, AlertTriangle, Database } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { IMPORT_TARGETS, DIMENSION_OPTIONS } from '@/constants/importTargets';
import * as socialSvc from '@/services/socialService';
import * as paidSvc from '@/services/paidService';
import { parseFile } from '@/utils/import/parseFile';
import { buildRecords, runImport, loadMapping, saveMapping } from '@/services/importService';
import { Select } from '@/components/shared/Select';

// Cuentas + períodos por pilar (para los selectores del wizard).
const PILAR_DATA = {
  social: { accounts: socialSvc.listAccounts(), periods: [...socialSvc.listPeriods()].reverse() },
  paid: { accounts: paidSvc.listAccounts(), periods: [...paidSvc.listPeriods()].reverse() },
};
const PILAR_OPTIONS = Object.entries(IMPORT_TARGETS).map(([id, t]) => ({ id, label: t.label }));

function autoMatch(columns, field) {
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const target = norm(field.label.split('(')[0]);
  const key = norm(field.key);
  return (
    columns.find((c) => norm(c) === target || norm(c) === key) ||
    columns.find((c) => norm(c).includes(key) || norm(c).includes(target)) ||
    ''
  );
}

export function ImportApp({ onClose, defaultPilar = 'social', defaultAccount }) {
  const [pilar, setPilar] = useState(IMPORT_TARGETS[defaultPilar] ? defaultPilar : 'social');
  const target = IMPORT_TARGETS[pilar];
  const { accounts, periods } = PILAR_DATA[pilar];

  const [datasetId, setDatasetId] = useState(target.datasets[0].id);
  const dataset = target.datasets.find((d) => d.id === datasetId) ?? target.datasets[0];

  const [clientId, setClientId] = useState(defaultAccount ?? accounts[0]?.id ?? '');
  const [periodId, setPeriodId] = useState(periods[0]?.id ?? '');
  const [dimension, setDimension] = useState('seniority');
  const [headerOffset, setHeaderOffset] = useState(dataset.headerOffset ?? 0);

  const [fileRef, setFileRef] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [mapping, setMapping] = useState({});
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  // Cambio de pilar → resetear dataset/cuenta/período/archivo.
  function changePilar(id) {
    setPilar(id);
    const t = IMPORT_TARGETS[id];
    setDatasetId(t.datasets[0].id);
    setClientId(PILAR_DATA[id].accounts[0]?.id ?? '');
    setPeriodId(PILAR_DATA[id].periods[0]?.id ?? '');
    setHeaderOffset(t.datasets[0].headerOffset ?? 0);
    setFileRef(null);
    setParsed(null);
    setStatus('idle');
    setMessage('');
  }

  // Cambio de dataset → ajustar offset por defecto y re-parsear si hay archivo.
  function changeDataset(id) {
    setDatasetId(id);
    const ds = target.datasets.find((d) => d.id === id);
    const off = ds.headerOffset ?? 0;
    setHeaderOffset(off);
    if (fileRef) doParse(fileRef, off, ds);
  }

  async function doParse(file, offset, ds = dataset) {
    setStatus('parsing');
    setMessage('');
    try {
      const res = await parseFile(file, { headerOffset: offset });
      setParsed(res);
      const saved = loadMapping(pilar, ds.id, target.source);
      const next = {};
      for (const f of ds.fields) next[f.key] = saved[f.key] || autoMatch(res.columns, f);
      setMapping(next);
      setStatus('ready');
    } catch (err) {
      setStatus('error');
      setMessage('No se pudo leer el archivo: ' + err.message);
    }
  }

  function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileRef(file);
    doParse(file, headerOffset);
  }

  function changeOffset(v) {
    const off = Math.max(0, parseInt(v, 10) || 0);
    setHeaderOffset(off);
    if (fileRef) doParse(fileRef, off);
  }

  const records = useMemo(() => {
    if (!parsed) return [];
    try {
      return buildRecords(dataset, parsed.rows, mapping);
    } catch {
      return [];
    }
  }, [parsed, dataset, mapping]);

  async function doImport() {
    setStatus('importing');
    setMessage('');
    try {
      saveMapping(pilar, datasetId, target.source, mapping);
      const { count } = await runImport({
        pilar,
        source: target.source,
        clientId,
        periodId,
        dataset,
        records,
        extra: { dimension },
      });
      setStatus('done');
      setMessage(`Importadas ${count} fila(s). La vista se actualizó sola.`);
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-cu-dblue/40 p-6">
      <div className="my-8 w-full max-w-2xl animate-fade-in rounded-cu border border-cu-border bg-white shadow-cu-h">
        <div className="flex items-center gap-2.5 rounded-t-cu bg-cu-dblue px-5 py-3.5">
          <UploadCloud className="h-4 w-4 text-white" />
          <h2 className="text-[12px] font-bold uppercase tracking-[0.5px] text-white">Importar datos</h2>
          <button onClick={onClose} className="ml-auto text-white/70 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">
          {!isSupabaseConfigured && (
            <div className="mb-4 flex items-start gap-2 rounded-cu border border-amber-300 bg-amber-50 px-3 py-2.5 text-[11.5px] text-amber-800">
              <Database className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Supabase no está configurado. Podés mapear y previsualizar, pero para{' '}
                <strong>guardar</strong> necesitás conectar el proyecto (ver <code>SETUP_SUPABASE.md</code>).
              </span>
            </div>
          )}

          <div className="mb-4 grid grid-cols-2 gap-3">
            <Select label="Pilar" value={pilar} onChange={changePilar} options={PILAR_OPTIONS} />
            <Select
              label="Tipo de dato"
              value={datasetId}
              onChange={changeDataset}
              options={target.datasets.map((d) => ({ id: d.id, label: d.label }))}
            />
            <Select
              label="Cuenta"
              value={clientId}
              onChange={setClientId}
              options={accounts.map((a) => ({ id: a.id, label: a.name }))}
            />
            <Select label="Período" value={periodId} onChange={setPeriodId} options={periods} />
            {dataset.dimension && (
              <Select label="Dimensión de audiencia" value={dimension} onChange={setDimension} options={DIMENSION_OPTIONS} />
            )}
            <div className="flex flex-col gap-[3px]">
              <label className="text-[9px] font-bold uppercase tracking-[0.6px] text-cu-grey">
                Filas a saltar (preámbulo)
              </label>
              <input
                type="number"
                min={0}
                value={headerOffset}
                onChange={(e) => changeOffset(e.target.value)}
                className="rounded-sm border border-cu-border bg-white px-2.5 py-[7px] text-[13px] text-cu-dgrey outline-none focus:border-cu-cyan"
              />
            </div>
          </div>

          <label className="mb-4 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-cu border-2 border-dashed border-cu-border bg-cu-bg px-4 py-6 text-center transition-colors hover:border-cu-cyan">
            <UploadCloud className="h-6 w-6 text-cu-grey" />
            <span className="text-[12px] text-cu-dgrey">{fileRef ? fileRef.name : 'Subí un CSV o Excel'}</span>
            <span className="text-[10px] text-cu-grey">.csv · .xlsx · .xls</span>
            <input type="file" accept=".csv,.tsv,.txt,.xlsx,.xls" className="hidden" onChange={onFile} />
          </label>

          {status === 'parsing' && <p className="text-[12px] text-cu-grey">Leyendo archivo…</p>}

          {parsed && (
            <>
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
                Mapear columnas — {parsed.rows.length} fila(s) detectada(s)
              </h3>
              {parsed.columns.length === 0 && (
                <p className="mb-3 text-[11.5px] italic text-[#a02020]">
                  No se detectaron columnas. Ajustá “filas a saltar” (Google Ads suele necesitar 2).
                </p>
              )}
              <div className="mb-4 space-y-2">
                {dataset.fields.map((f) => (
                  <div key={f.key} className="flex items-center gap-3">
                    <span className="w-44 shrink-0 text-[12px] text-cu-dgrey">
                      {f.label}
                      {f.required && <span className="text-[#a02020]"> *</span>}
                    </span>
                    <select
                      value={mapping[f.key] || ''}
                      onChange={(e) => setMapping((m) => ({ ...m, [f.key]: e.target.value }))}
                      className="flex-1 cursor-pointer rounded-sm border border-cu-border bg-white px-2.5 py-1.5 text-[12px] text-cu-dgrey outline-none focus:border-cu-cyan"
                    >
                      <option value="">— sin asignar —</option>
                      {parsed.columns.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {records.length > 0 && (
                <div className="mb-4 rounded-cu border border-cu-border2 bg-cu-bg/50 p-3">
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-grey">
                    Vista previa ({records.length} registro/s válido/s)
                  </div>
                  <pre className="overflow-x-auto text-[11px] text-cu-dgrey">{JSON.stringify(records[0], null, 2)}</pre>
                </div>
              )}
            </>
          )}

          {message && (
            <div
              className={`mb-4 flex items-start gap-2 rounded-cu px-3 py-2.5 text-[12px] ${
                status === 'done' ? 'bg-cu-cyan/10 text-[#1372a5]' : 'bg-[#b42828]/10 text-[#a02020]'
              }`}
            >
              {status === 'done' ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <span>{message}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2">
            <button onClick={onClose} className="rounded-sm border border-cu-border px-4 py-2 text-[12px] text-cu-grey hover:text-cu-dgrey">
              Cerrar
            </button>
            <button
              onClick={doImport}
              disabled={!isSupabaseConfigured || !records.length || status === 'importing'}
              className="rounded-sm bg-cu-cyan px-4 py-2 text-[12px] font-bold text-white transition-colors hover:bg-[#2c9fd9] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {status === 'importing' ? 'Importando…' : 'Importar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
