import { PAID_STR, fxDate } from '@/utils/paidI18n';

// Nota del descargable convertido a otra moneda (§19 de DECISIONES):
// «Importes aproximados de referencia en USD, convertidos desde…».
// fx: { from, to, date, unit, value, quote, decimals, source, campaign }
export function FxNote({ fx, lang = 'es' }) {
  if (!fx) return null;
  const t = PAID_STR[lang];
  const loc = lang === 'en' ? 'en-US' : 'es-AR';
  return (
    <div className="mb-4 rounded-cu border border-cu-border border-l-4 border-l-cu-cyan bg-white px-4 py-3 text-[11.5px] leading-relaxed text-cu-dgrey shadow-cu">
      <strong className="text-cu-dblue">{t.fxLead(fx.to)}</strong>
      {t.fxRest(fx.from, fx.source, fx.campaign ? fxDate(fx.date, lang) : null)}
      <strong className="text-cu-dblue">
        1 {fx.unit} = {Number(fx.value).toLocaleString(loc, { maximumFractionDigits: fx.decimals })} {fx.quote}
      </strong>
      .
    </div>
  );
}
