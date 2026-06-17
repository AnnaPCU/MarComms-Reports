// SERVICE — Pilar Website (Google Analytics + Search Console). Trimestral.
// Lee del seed local mientras Supabase no esté configurado.
import { WEBSITE_CLIENTS, WEBSITE_DB } from '@/data/websiteSeed';
import { QUARTERS_2026 } from '@/constants/periods';

export function listAccounts() {
  return WEBSITE_CLIENTS;
}

export function listPeriods() {
  return QUARTERS_2026;
}

const EMBED = typeof window !== 'undefined' ? window.__REPORT_EMBED__ : null;

export function getQuarter(accountId, periodId) {
  if (EMBED?.snapshot && 'quarter' in EMBED.snapshot) return EMBED.snapshot.quarter;
  return WEBSITE_DB[accountId]?.periods?.[periodId] ?? null;
}

export function getHandle(accountId) {
  if (EMBED?.snapshot?.handle != null) return EMBED.snapshot.handle;
  return WEBSITE_DB[accountId]?.handle ?? '';
}

export function hasDataFor(account, period) {
  return Boolean(getQuarter(account, period));
}
