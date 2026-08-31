// SERVICE — Pilar Webinars. Reportes mixtos por evento (Livestorm +
// Mailchimp + LinkedIn + HubSpot). Lee del seed en código.
import { WEBINAR_CLIENTS, WEBINARS_DB, WEBINAR_PERIODS, SCORING } from '@/data/webinarsSeed';

const EMBED = typeof window !== 'undefined' ? window.__REPORT_EMBED__ : null;

export function listAccounts() {
  return WEBINAR_CLIENTS;
}

export function listPeriods() {
  return WEBINAR_PERIODS;
}

export function getEvent(accountId, periodId) {
  if (EMBED?.snapshot && 'event' in EMBED.snapshot) return EMBED.snapshot.event;
  return WEBINARS_DB[accountId]?.[periodId] ?? null;
}

export function getScoring() {
  return SCORING;
}

export function hasDataFor(account, period) {
  return Boolean(WEBINARS_DB[account]?.[period]);
}
