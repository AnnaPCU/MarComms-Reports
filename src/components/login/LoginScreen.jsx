import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { BarTop, BarBottom } from '@/components/brand/BrandBars';
import { Tagline } from '@/components/brand/Tagline';

export function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const ok = onLogin(password);
    if (!ok) {
      setError(true);
      setPassword('');
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-cu-bg">
      <BarTop />
      <div className="flex flex-1 items-center justify-center px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm animate-fade-in rounded-cu border border-cu-border bg-white p-8 shadow-cu"
        >
          <Logo className="mb-6" />
          <h1 className="mb-1 text-lg font-bold tracking-tight text-cu-dblue">
            Reportes MarComms
          </h1>
          <p className="mb-6 text-[12px] text-cu-grey">
            Ingresá la contraseña del equipo para continuar.
          </p>

          <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.6px] text-cu-grey">
            Contraseña
          </label>
          <div className="relative mb-4">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cu-grey" />
            <input
              type="password"
              value={password}
              autoFocus
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className="w-full rounded-sm border border-cu-border bg-white py-2.5 pl-9 pr-3 text-[13px] text-cu-dgrey outline-none transition-colors focus:border-cu-cyan focus:ring-2 focus:ring-cu-cyan/15"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="mb-3 text-[11px] text-[#a02020]">Contraseña incorrecta.</p>
          )}

          <button
            type="submit"
            className="w-full rounded-sm bg-cu-cyan py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#2c9fd9]"
          >
            Ingresar
          </button>
        </form>
      </div>
      <footer className="flex items-center justify-between px-9 py-4">
        <p className="text-[10px] text-cu-grey">PCU Group — MarComms</p>
        <Tagline />
      </footer>
      <BarBottom />
    </div>
  );
}
