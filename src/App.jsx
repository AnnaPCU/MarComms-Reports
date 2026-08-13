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

  // audience: 'internal' (reporte completo) | 'external' (sin "Próximos Pasos")
  async function doDownload(audience) {
    setShowDownload(false);
    const title = [PILAR_BY_ID[pilar].label, expandAccountName(accountName), periodLabel].filter(Boolean).join(' — ');
    const filename = reportFilename({ pilarLabel: PILAR_BY_ID[pilar].label, accountName, period, periodLabel, audience });
    const snapshot = await buildSnapshot(pilar, account, period);
    await exportViewAsHtml({
      pilar,
      account,
      period,
      audience,
      brand: brandOf(account, accountName),
      title,
      filename,
      snapshot,
    });
  }

  // Badge de estado de datos (regla de honestidad).
  let badge = null;
  if (periods.length && cfg.hasDataFor) {
    const has = cfg.hasDataFor(account, period);
    if (has) {
      const label = period === 'cmp' ? 'Mayo 2026' : periodLabel;
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
      <footer className="flex items-center justify-between px-9 pb-5 pt-3.5">
        <p className="text-[10px] text-cu-grey">
          Reportes MarComms · PCU Group · {PILAR_BY_ID[pilar].sources.join(' · ')}
        </p>
        <Tagline />
      </footer>

      {showDownload && <DownloadDialog onClose={() => setShowDownload(false)} onChoose={doDownload} />}
    </div>
  );
}
