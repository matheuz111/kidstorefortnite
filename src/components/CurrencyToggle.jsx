import { useEffect, useMemo } from "react";
import { useShop } from "../hooks/useShop";
import { useTranslation } from "react-i18next";

export default function CurrencyToggle() {
  const { currency, setCurrency } = useShop();
  const { i18n } = useTranslation();
  const lang = i18n.language || "es";

  // Monedas permitidas por idioma
  const options = useMemo(() => {
    return lang.startsWith("en") ? ["USD"] : ["PEN", "EUR"];
  }, [lang]);

  // Si el idioma cambia, normaliza la moneda al set permitido
  useEffect(() => {
    if (!options.includes(currency)) {
      // por defecto: EN -> USD, ES -> PEN
      setCurrency(options[0]);
    }
  }, [lang, options, currency, setCurrency]);

  const base = "px-3 py-1 rounded-full text-sm border";
  const on  = "bg-cyan-500/20 border-cyan-400";
  const off = "bg-transparent border-white/20";

  return (
    <div className="inline-flex gap-2">
      {options.map((c) => (
        <button
          key={c}
          onClick={() => setCurrency(c)}
          className={`${base} ${currency === c ? on : off}`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
