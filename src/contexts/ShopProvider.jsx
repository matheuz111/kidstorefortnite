// src/contexts/ShopProvider.jsx
import { useMemo, useState } from "react";
import { ShopContext } from "./shopContext";

export default function ShopProvider({ children }) {
  // Lee localStorage de forma segura (SSR/errores de permisos)
  let savedCurrency = null;
  try {
    if (typeof localStorage !== "undefined") {
      savedCurrency = localStorage.getItem("kid_currency");
    }
  } catch (e) {
    // Si falla la lectura, lo dejamos en null
    console.warn("[ShopProvider] localStorage getItem failed:", e);
  }

  const [currency, setCurrency] = useState(savedCurrency || "PEN"); // PEN | USD | EUR
  const [query, setQuery] = useState("");

  const value = useMemo(
    () => ({
      currency,
      setCurrency: (c) => {
        // Escribe localStorage de forma segura (sin catch vacío)
        try {
          if (typeof localStorage !== "undefined") {
            localStorage.setItem("kid_currency", c);
          }
        } catch (e) {
          console.warn("[ShopProvider] localStorage setItem failed:", e);
        }
        setCurrency(c);
      },
      query,
      setQuery,
      // idioma derivado por divisa
      lang: currency === "USD" ? "en" : "es",
    }),
    [currency, query]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
