import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PILARES, PILAR_BY_ID } from '@/constants/pilares';
import { getPilarConfig } from '@/pilares/registry';

import { BarTop, BarBottom } from '@/components/brand/BrandBars';
import { Tagline } from '@/components/brand/Tagline';
import { Header } from '@/components/shared/Header';
import { PilarNav } from '@/components/shared/PilarNav';
import { LoginScreen } from '@/components/login/LoginScreen';
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

  // Al cambiar de pilar, reseteamos cuenta/período a los defaults del pilar.
  function changePilar(id) {
    setPilar(id);
    const cfg = getPilarConfig(id);
    setAccount(cfg.accounts[0]?.id ?? '');
    setPeriod(cfg.defaultPeriod ?? '');
  }

  if (!authed) return <LoginScreen onLogin={login} />;

  const cfg = getPilarConfig(pilar);
  const Pilar = cfg.Component;
  const accountName = cfg.accounts.find((a) => a.id === account)?.name ?? '';
  const periodLabel = cfg.periods.find((p) => p.id === period)?.label ?? period;

  async function handleDownload() {
    const title = [PILAR_BY_ID[pilar].label, expandAccountName(accountName), periodLabel].filter(Boolean).join(' — ');
    const filename = reportFilename({ pilarLabel: PILAR_BY_ID[pilar].label, accountName, period, periodLabel });
    const snapshot = await buildSnapshot(pilar, account, period);
    await exportViewAsHtml({
      pilar,
      account,
      period,
      brand: brandOf(account, accountName),
      title,
      filename,
      snapshot,
    });
  }

  // Badge de estado de datos (regla de honestidad).
  let badge = null;
  if (cfg.periods.length && cfg.hasDataFor) {
    const has = cfg.hasDataFor(account, period);
    if (has) {
      const label =
        period === 'cmp' ? 'Mayo 2026' : cfg.periods.find((p) => p.id === period)?.label ?? period;
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
        onAccountChange={setAccount}
        periods={cfg.periods}
        period={period}
        onPeriodChange={setPeriod}
        badge={badge}
        onDownload={handleDownload}
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
    </div>
  );
}
