// SERVICE — Pilar Email Marketing (Mailchimp / Apollo). Mensual.
// Fuente de datos: seed en código (src/data/emailSeed.js). Sin base de datos.
import { EMAIL_CLIENTS, EMAIL_DB, emailPeriodsPresent } from '@/data/emailSeed';

const EMBED = typeof window !== 'undefined' ? window.__REPORT_EMBED__ : null;

export function listAccounts() {
  return EMAIL_CLIENTS;
}

export function listPeriods() {
  return emailPeriodsPresent();
}

// Un período trae una campaña, o varias si en el mes salió más de una
// (`{ campaigns: [...] }`, en orden de envío, cada una con id y label).
// Devuelve siempre la lista; en modo embed el archivo trae una sola.
export function listCampaigns(accountId, periodId) {
  if (EMBED?.snapshot && 'campaign' in EMBED.snapshot) {
    return EMBED.snapshot.campaign ? [EMBED.snapshot.campaign] : [];
  }
  const p = EMAIL_DB[accountId]?.periods?.[periodId];
  if (!p) return [];
  return Array.isArray(p.campaigns) ? p.campaigns : [p];
}

// Campaña elegida (por id); sin id, o si el id no está en el período, la
// más reciente.
export function getCampaign(accountId, periodId, campaignId = null) {
  const list = listCampaigns(accountId, periodId);
  if (!list.length) return null;
  return list.find((c) => campaignId && c.id === campaignId) ?? list[list.length - 1];
}

export function getHandle(accountId) {
  if (EMBED?.snapshot?.handle != null) return EMBED.snapshot.handle;
  return EMAIL_DB[accountId]?.handle ?? '';
}

export function hasDataFor(account, period) {
  return Boolean(getCampaign(account, period));
}
