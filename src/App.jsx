import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PILARES, navLabel } from '@/constants/pilares';
import { getPilarConfig } from '@/pilares/registry';

import { BarTop, BarBottom } from '@/components/brand/BrandBars';
import { Tagline } from '@/components/brand/Tagline';
import { MarCommsLogo } from '@/components/brand/Logo';
import { Header } from '@/components/shared/Header';
import { PilarNav } from '@/components/shared/PilarNav';
import { LoginScreen } from '@/components/login/LoginScreen';
import { DownloadDialog } from '@/components/shared/DownloadDialog';
import { exportViewAsHtml } from '@/utils/exportHtml';
import { buildSnapshot } from '@/utils/snapshot';
import { reportFilename, expandAccountName, localizeLabel, localizePilarLabel } from '@/utils/reportFilename';
import { brandOf } from '@/constants/brand';
import { getSegConfig } from '@/services/socialService';
import { listCampaigns } from '@/services/emailService';
import { getMonthly as getPaidMonthly } from '@/services/paidService';
import { CURRENCIES, canConvert } from '@/services/fxService';
import { emailLabelEn } from '@/utils/emailI18n';
import { viewState } from '@/utils/viewState';
import { SET_LANG_EVENT } from '@/components/plans/PlansApp';

export default function App() {
  const { authed, login, logout } = useAuth();

  const [pilar, setPilar] = useState('social');
  const initial = getPilarConfig('social');
  const [account, setAccount] = useState(initial.accounts[0]?.id ?? '');
  const [period, setPeriod] = useState(initial.defaultPeriod ?? '');
  const [showDownload, setShowDownload] = useState(false);

  // Períodos visibles: si el pilar define periodsFor (dependiente de la
  // cuenta, ej. Paid), solo se listan los que tienen datos.
  function periodsOf(cfg, accountId) {
    return cfg.periodsFor ? cfg.periodsFor(accountId) : cfg.periods;
  }

  // Al cambiar de pilar, reseteamos cuenta/período a los defaults del pilar.
  function changePilar(id) {
    setPilar(id);
    const cfg = getPilarConfig(id);
    const firstAccount = cfg.accounts[0]?.id ?? '';
    setAccount(firstAccount);
    const list = periodsOf(cfg, firstAccount);
    setPeriod(
      list.some((p) => p.id === cfg.defaultPeriod) ? cfg.defaultPeriod : (list[0]?.id ?? cfg.defaultPeriod ?? ''),
    );
  }

  // Al cambiar de cuenta, si el período actual no existe para esa cuenta,
  // saltamos al más reciente disponible.
  function changeAccount(id) {
    setAccount(id);
    const cfg = getPilarConfig(pilar);
    const list = periodsOf(cfg, id);
    if (!list.some((p) => p.id === period)) setPeriod(list[0]?.id ?? '');
  }

  if (!authed) return <LoginScreen onLogin={login} />;

  const cfg = getPilarConfig(pilar);
  const Pilar = cfg.Component;
  const accountName = cfg.accounts.find((a) => a.id === account)?.name ?? '';
  const periods = periodsOf(cfg, account);
  const periodLabel = periods.find((p) => p.id === period)?.label ?? period;

  // audience: 'internal' (reporte completo) | 'external' (sin "Próximos Pasos").
  // periodIds: períodos elegidos en el diálogo (cada uno baja su propio HTML).
  // Paid: moneda original de los meses elegidos y a qué monedas se pueden
  // convertir (hace falta el tipo de cambio de cada mes en fxRates.js). El
  // resumen anual, la comparativa y las campañas de Meta van en su moneda.
  function paidCurrencyInfo(ids) {
    const months = ids
      .filter((pid) => /^m\d\d$/.test(pid))
      .map((pid) => ({ pid, cur: getPaidMonthly(account, pid)?.totals?.currency }))
      .filter((m) => m.cur);
    const natives = [...new Set(months.map((m) => m.cur))];
    return {
      native: natives.length === 1 ? natives[0] : null,
      months: months.length,
      options: CURRENCIES.map((c) => ({ id: c, ok: months.length > 0 && months.every((m) => canConvert(m.cur, c, m.pid)) })),
    };
  }

  async function doDownload(audience, periodIds, lang = 'es', currency = null) {
    setShowDownload(false);
    // Planes: el diálogo ofrece HTML interactivo o PDF. El PDF sale de la
    // impresión del navegador (sin backend): se fija el idioma en la vista,
    // se ocultan los controles (`print:hidden`) y el nombre sugerido del
    // archivo viaja en document.title mientras dura el diálogo de impresión.
    if (audience === 'pdf') {
      window.dispatchEvent(new CustomEvent(SET_LANG_EVENT, { detail: lang }));
      const base = reportFilename({ pilarLabel: 'Plan', accountName, period, periodLabel, audience: 'internal', lang }).replace(/\.html$/, '');
      const prevTitle = document.title;
      document.title = base;
      await new Promise((r) => setTimeout(r, 150));
      window.print();
      document.title = prevTitle;
      return;
    }
    if (audience === 'html') audience = 'internal';
    const ids = periodIds?.length ? periodIds : [period];
    // Social segmentado: si hay un país seleccionado, la descarga es el
    // reporte de ESE país (queda fijo en el archivo, sin botonera).
    let socialCountry = null;
    let countryName = '';
    if (pilar === 'social' && viewState.socialCountry !== 'all') {
      const cInfo = getSegConfig(account)?.countries.find((c) => c.id === viewState.socialCountry);
      if (cInfo) {
        socialCountry = viewState.socialCountry;
        countryName = cInfo.name;
      }
    }
    // Email con varias campañas en el mes: la descarga es la campaña elegida
    // (queda fija en el archivo, sin botonera). Solo aplica a ese período.
    let emailCampaign = null;
    let campaignLabel = '';
    if (pilar === 'email' && viewState.emailCampaign && ids.includes(period)) {
      const c = listCampaigns(account, period).find((x) => x.id === viewState.emailCampaign);
      if (c) {
        emailCampaign = c.id;
        campaignLabel = lang === 'en' ? emailLabelEn(c.label) : c.label;
      }
    }
    // Moneda del descargable de Paid: solo si cambia algún mes elegido.
    const fxTo =
      pilar === 'paid' && currency && ids.some((pid) => {
        const cur = /^m\d\d$/.test(pid) ? getPaidMonthly(account, pid)?.totals?.currency : null;
        return cur && cur !== currency;
      })
        ? currency
        : null;
    const snapOpts = { emailCampaign, currency: fxTo };
    // Etiqueta del período en el idioma elegido (labelEn del seed si existe; si no, traducción de la ES).
    const labelOf = (pid) => {
      const p = periods.find((x) => x.id === pid);
      if (!p) return pid;
      return lang === 'en' ? (p.labelEn ?? localizeLabel(p.label, lang)) : p.label;
    };
    // El país aplica a los períodos segmentables (no a la comparativa).
    const withCountry = socialCountry && ids.some((pid) => pid !== 'cmp');
    // Varios períodos → UN solo archivo con botonera interna de período.
    const multi = ids.length > 1;
    const multiPeriods = multi
      ? await Promise.all(
          ids.map(async (pid) => ({ id: pid, label: labelOf(pid), snapshot: await buildSnapshot(pilar, account, pid, snapOpts) })),
        )
      : null;
    const periodsLabel = multi
      ? ids.length <= 3
        ? ids.map(labelOf).join(' · ')
        : `${ids.length} ${lang === 'en' ? 'periods' : 'períodos'}`
      : labelOf(ids[0]);
    // La vista por cliente se descarga como «Reporte Cliente» (solo la General).
    const pilarLabel = pilar === 'clients' ? 'Cliente' : pilar === 'plans' ? 'Plan' : navLabel(pilar);
    // Título y nombre de archivo en el idioma elegido, sea cual sea el pilar.
    const title = [localizePilarLabel(pilarLabel, lang), expandAccountName(accountName), withCountry ? countryName : null, campaignLabel || null, periodsLabel, fxTo]
      .filter(Boolean)
      .join(' — ');
    const baseFilename = reportFilename({
      pilarLabel,
      // 'multi' evita que el nombre salga como el 1er período: cae al label.
      accountName: [accountName, withCountry ? countryName : null, campaignLabel || null].filter(Boolean).join(' '),
      period: multi ? 'multi' : ids[0],
      periodLabel: multi ? (lang === 'en' ? `Multi-Period (${ids.length})` : `Multi-Periodo (${ids.length})`) : periodsLabel,
      audience,
      lang,
    });
    const filename = fxTo ? baseFilename.replace(/\.html$/, `_${fxTo}.html`) : baseFilename;
    await exportViewAsHtml({
      pilar,
      account,
      period: ids[0],
      audience,
      brand: brandOf(account, accountName),
      title,
      filename,
      snapshot: multi ? multiPeriods[0].snapshot : await buildSnapshot(pilar, account, ids[0], snapOpts),
      socialCountry: withCountry ? socialCountry : null,
      periods: multiPeriods,
      lang,
    });
  }

  // Badge de estado de datos (regla de honestidad).
  let badge = null;
  if (periods.length && cfg.hasDataFor) {
    const has = cfg.hasDataFor(account, period);
    if (has && cfg.badgeText) {
      badge = { variant: 'real', text: cfg.badgeText(account) };
    } else if (has) {
      // La comparativa de Social compara sobre Mayo 2026 (dato fijo del seed).
      const label = pilar === 'social' && period === 'cmp' ? 'Mayo 2026' : periodLabel;
      badge = { variant: 'real', text: `Datos reales — ${label}` };
    } else {
      badge = { variant: 'nodata', text: 'Sin datos para este período' };
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <BarTop />
      <Header
        pilarLabel={navLabel(pilar)}
        accounts={cfg.accounts.map((a) => ({ id: a.id, label: a.name }))}
        account={account}
        onAccountChange={changeAccount}
        periods={periods}
        period={period}
        onPeriodChange={setPeriod}
        periodFilterLabel={cfg.periodFilterLabel}
        accountFilterLabel={cfg.accountFilterLabel}
        hidePeriod={cfg.hidePeriod}
        badge={badge}
        onDownload={() => setShowDownload(true)}
        onLogout={logout}
      />
      <PilarNav active={pilar} onChange={changePilar} />

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-9 pb-11 pt-6">
        <div id="report-view">
          <Pilar account={account} period={period} />
        </div>
      </main>

      {/* Al imprimir (PDF de Planes) el cierre lo dibuja la propia vista, dentro del flujo. */}
      <div className="print:hidden">
      <BarBottom />
      {/* Al pie: logo MarComms (autor del reporte) enfrentado al tagline. */}
      <footer className="flex flex-wrap items-center justify-between gap-3 px-9 pb-5 pt-3.5">
        <MarCommsLogo className="h-5" />
        <Tagline brand={brandOf(account, accountName) ?? 'cu'} />
      </footer>
      </div>

      {showDownload && (
        <DownloadDialog
          onClose={() => setShowDownload(false)}
          onChoose={doDownload}
          periods={cfg.hasDataFor ? periods.filter((p) => cfg.hasDataFor(account, p.id)) : periods}
          currentPeriod={period}
          mode={pilar === 'plans' ? 'format' : 'audience'}
          currencyInfo={pilar === 'paid' ? paidCurrencyInfo : null}
        />
      )}
    </div>
  );
}
