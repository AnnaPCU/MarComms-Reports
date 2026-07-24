// ════════════════════════════════════════════════════════════════
//  MAILCHIMP · PARSEO DE LEADS — lógica portada del MailchimpReportTool
//  del MarComms Hub. Funciones PURAS y testeables: detectan columnas de
//  forma tolerante (inglés/español) y normalizan cada fila a un lead.
//
//  NO dependen del DOM ni de librerías de parseo: reciben filas ya
//  parseadas (array de objetos {columna: valor}). El parseo real de
//  CSV/Excel vive en el script de tooling (scripts/mailchimp-to-seed.mjs),
//  fuera del bundle de la app.
// ════════════════════════════════════════════════════════════════

// "12,5%" | "12.5" | 12.5 → 12.5 · valores inválidos → 0.
export function parsePercentage(str) {
  if (str == null || str === '') return 0;
  const n = parseFloat(String(str).replace('%', '').replace(',', '.'));
  return Number.isNaN(n) ? 0 : n;
}

// Entero tolerante: "1.234" no aplica acá (Mailchimp exporta enteros planos).
export function safeInt(v) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? 0 : n;
}

// Detecta las columnas relevantes por nombre (case-insensitive, ES/EN).
// Devuelve las CLAVES ORIGINALES (con su casing) para poder indexar las filas.
export function detectKeys(row) {
  const keys = Object.keys(row);
  const find = (pred) => keys.find((k) => pred(k.toLowerCase().trim()));
  return {
    emailKey: find((l) => l.includes('email')),
    clicksKey: find((l) => l === 'clicks' || l.includes('clic') || l === 'total clicks'),
    opensKey: find((l) => l === 'opens' || l.includes('apertura') || l === 'total opens'),
    companyKey: find((l) => l.includes('company') || l.includes('empresa') || l.includes('organization')),
    firstNameKey: find((l) => l.includes('first') || l.includes('nombre')),
    lastNameKey: find((l) => l.includes('last') || l.includes('apellido')),
  };
}

// Convierte filas crudas → leads normalizados. Filtra las que no tienen email
// válido. La empresa se infiere del dominio del email si no viene columna.
export function extractLeads(rows) {
  if (!rows || rows.length === 0) return [];
  const { emailKey, clicksKey, opensKey, companyKey, firstNameKey, lastNameKey } = detectKeys(rows[0]);
  if (!emailKey) return [];

  return rows
    .filter((r) => r[emailKey] && String(r[emailKey]).includes('@'))
    .map((r) => {
      const email = String(r[emailKey]).trim();
      const domain = email.split('@')[1]?.split('.')[0];
      return {
        email,
        clicks: safeInt(r[clicksKey]),
        opens: safeInt(r[opensKey]),
        company: (companyKey && r[companyKey]) || domain || 'Desconocido',
        firstName: (firstNameKey && r[firstNameKey]) || '',
        lastName: (lastNameKey && r[lastNameKey]) || '',
      };
    });
}
