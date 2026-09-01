import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PILARES, PILAR_BY_ID } from '@/constants/pilares';
import { getPilarConfig } from '@/pilares/registry';

import { BarTop, BarBottom } from '@/components/brand/BrandBars';
import { Tagline } from '@/components/brand/Tagline';
import { Header } from '@/components/shared/Header';
import { PilarNav } from '@/components/shared/PilarNav';
import { LoginScreen } from '@/components/login/LoginScreen';
import { DownloadDialog } from '@/components/shared/DownloadDialog';
import { exportViewAsHtml } from '@/utils/exportHtml';
import { buildSnapshot } from '@/utils/snapshot';
import { reportFilename, expandAccountName } from '@/utils/reportFilename';
import { brandOf } from '@/constants/brand';
import { getSegConfig } from '@/services/socialService';
import { viewState } from '@/utils/viewState';

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
  async function doDownload(audience, periodIds) {
    setShowDownload(false);
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
    const labelOf = (pid) => periods.find((p) => p.id === pid)?.label ?? pid;
    // El país aplica a los períodos segmentables (no a la comparativa).
    const withCountry = socialCountry && ids.some((pid) => pid !== 'cmp');
    // Varios períodos → UN solo archivo con botonera interna de período.
    const multi = ids.length > 1;
    const multiPeriods = multi
      ? await Promise.all(
          ids.map(async (pid) => ({ id: pid, label: labelOf(pid), snapshot: await buildSnapshot(pilar, account, pid) })),
        )
      : null;
    const periodsLabel = multi
      ? ids.length <= 3
        ? ids.map(labelOf).join(' · ')
        : `${ids.length} períodos`
      : labelOf(ids[0]);
    const title = [PILAR_BY_ID[pilar].label, expandAccountName(accountName), withCountry ? countryName : null, periodsLabel]
      .filter(Boolean)
      .join(' — ');
    const filename = reportFilename({
      pilarLabel: PILAR_BY_ID[pilar].label,
      // 'multi' evita que el nombre salga como el 1er período: cae al label.
      accountName: withCountry ? `${accountName} ${countryName}` : accountName,
      period: multi ? 'multi' : ids[0],
      periodLabel: multi ? `Multi-Periodo (${ids.length})` : periodsLabel,
      audience,
    });
    await exportViewAsHtml({
      pilar,
      account,
      period: ids[0],
      audience,
      brand: brandOf(account, accountName),
      title,
      filename,
      snapshot: multi ? multiPeriods[0].snapshot : await buildSnapshot(pilar, account, ids[0]),
      socialCountry: withCountry ? socialCountry : null,
      periods: multiPeriods,
    });
  }

  // Badge de estado de datos (regla de honestidad).
  let badge = null;
  if (periods.length && cfg.hasDataFor) {
    const has = cfg.hasDataFor(account, period);
    if (has) {
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
        pilarLabel={PILAR_BY_ID[pilar].label}
        accounts={cfg.accounts.map((a) => ({ id: a.id, label: a.name }))}
        account={account}
        onAccountChange={changeAccount}
        periods={periods}
        period={period}
        onPeriodChange={setPeriod}
        periodFilterLabel={cfg.periodFilterLabel}
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

      <BarBottom />
      <footer className="flex items-center justify-end px-9 pb-5 pt-3.5">
        <Tagline />
      </footer>

      {showDownload && (
        <DownloadDialog
          onClose={() => setShowDownload(false)}
          onChoose={doDownload}
          periods={cfg.hasDataFor ? periods.filter((p) => cfg.hasDataFor(account, p.id)) : periods}
          currentPeriod={period}
        />
      )}
    </div>
  );
}
