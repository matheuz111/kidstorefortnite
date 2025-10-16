import { vbuckToCurrency, formatCurrency } from "../lib/pricing";

export default function PriceBlock({ vbucks = 800 }) {
  const pen = formatCurrency(vbuckToCurrency(vbucks, "PEN"), "PEN");
  const usd = formatCurrency(vbuckToCurrency(vbucks, "USD"), "USD");
  const eur = formatCurrency(vbuckToCurrency(vbucks, "EUR"), "EUR");

  return (
    <div className="grid grid-cols-3 gap-3 text-sm">
      <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-center">
        <div className="opacity-70">PEN</div>
        <div className="font-bold">{pen}</div>
      </div>
      <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-center">
        <div className="opacity-70">USD</div>
        <div className="font-bold">{usd}</div>
      </div>
      <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-center">
        <div className="opacity-70">EUR</div>
        <div className="font-bold">{eur}</div>
      </div>
    </div>
  );
}
