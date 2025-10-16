// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// ✅ Importa desde tu ruta actual
import es from "./i18n/es.json";
import en from "./i18n/en.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en }
    },
    lng: localStorage.getItem("kid_lang") || "es",
    fallbackLng: "es",
    interpolation: { escapeValue: false },
    returnNull: false,
    keySeparator: false
  });

export default i18n;
