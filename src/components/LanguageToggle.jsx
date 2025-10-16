import { useTranslation } from "react-i18next";
import { useShop } from "../hooks/useShop";

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const { setCurrency } = useShop();
  const current = i18n.language || "es";

  const switchTo = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("kid_lang", lng);
    // Normaliza moneda tras cambiar idioma
    if (lng.startsWith("en")) setCurrency("USD");
    else setCurrency("PEN"); // predeterminado para ES
  };

  const base = "px-3 py-1 rounded-full text-sm border";
  const on  = "bg-cyan-500/20 border-cyan-400";
  const off = "bg-transparent border-white/20";

  return (
    <div className="inline-flex gap-2">
      <button
        onClick={() => switchTo("es")}
        className={`${base} ${current.startsWith("es") ? on : off}`}
      >
        ES
      </button>
      <button
        onClick={() => switchTo("en")}
        className={`${base} ${current.startsWith("en") ? on : off}`}
      >
        EN
      </button>
    </div>
  );
}
