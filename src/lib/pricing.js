export const PRICE_PER_100 = { PEN: 1.5, USD: 0.45, EUR: 0.4 };

export function vbuckToCurrency(vbucks, currency = "PEN", digits = 2) {
  const per100 = PRICE_PER_100[currency];
  if (!per100) return 0;
  const value = (vbucks / 100) * per100;
  return Number(value.toFixed(digits));
}

export function formatCurrency(value, currency) {
  const locales = { PEN: "es-PE", USD: "en-US", EUR: "de-DE" };
  const codes = { PEN: "PEN", USD: "USD", EUR: "EUR" };
  return new Intl.NumberFormat(locales[currency], {
    style: "currency",
    currency: codes[currency],
    maximumFractionDigits: 2,
  }).format(value);
}

export function pricesFor(vbucks) {
  return {
    PEN: formatCurrency(vbuckToCurrency(vbucks, "PEN"), "PEN"),
    USD: formatCurrency(vbuckToCurrency(vbucks, "USD"), "USD"),
    EUR: formatCurrency(vbuckToCurrency(vbucks, "EUR"), "EUR"),
  };
}

export function priceByCurrency(vbucks, currency) {
  return formatCurrency(vbuckToCurrency(vbucks, currency), currency);
}