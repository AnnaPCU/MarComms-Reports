import Papa from 'papaparse';
import * as XLSX from 'xlsx';

// Parsea un CSV/Excel a { columns: string[], rows: object[] }.
// `headerOffset` salta N filas de preámbulo antes del encabezado real
// (ej. los export de Google Ads traen 2 filas arriba del header).
export function parseFile(file, { headerOffset = 0 } = {}) {
  const name = file.name.toLowerCase();
  if (name.endsWith('.csv') || name.endsWith('.tsv') || name.endsWith('.txt')) {
    return parseCsv(file, headerOffset);
  }
  return parseXlsx(file, headerOffset);
}

async function parseCsv(file, headerOffset) {
  let text = await file.text();
  if (headerOffset > 0) {
    text = text.split(/\r?\n/).slice(headerOffset).join('\n');
  }
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => resolve({ columns: res.meta.fields ?? [], rows: res.data }),
      error: reject,
    });
  });
}

async function parseXlsx(file, headerOffset) {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', range: headerOffset });
  const columns = rows.length ? Object.keys(rows[0]) : [];
  return { columns, rows };
}

// Coerción de valores según el tipo del campo destino.
// Soporta formatos es-AR/es-ES: "1.144" (miles), "35,33" (decimal), "26,91 EUR", "12.89%".
export function coerce(value, type) {
  if (value == null || value === '') return null;
  if (type === 'text') return String(value).trim();

  let s = String(value).trim().replace(/[%€$]/g, '').replace(/[A-Za-z]/g, '').trim();
  // Si tiene coma decimal (y no como separador de miles), normalizar.
  if (s.includes(',') && s.includes('.')) {
    // "1.144,50" → "1144.50"
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (s.includes(',')) {
    // "35,33" → "35.33"  ·  "1,144" se asume decimal salvo 3 dígitos → ambiguo; preferimos decimal
    s = s.replace(',', '.');
  }
  const n = Number(s);
  if (Number.isNaN(n)) return null;
  return type === 'int' ? Math.round(n) : n;
}
