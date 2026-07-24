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

export function getCampaign(accountId, periodId) {
  if (EMBED?.snapshot && 'campaign' in EMBED.snapshot) return EMBED.snapshot.campaign;
  return EMAIL_DB[accountId]?.periods?.[periodId] ?? null;
}

export function getHandle(accountId) {
  if (EMBED?.snapshot?.handle != null) return EMBED.snapshot.handle;
  return EMAIL_DB[accountId]?.handle ?? '';
}

export function hasDataFor(account, period) {
  return Boolean(getCampaign(account, period));
}
