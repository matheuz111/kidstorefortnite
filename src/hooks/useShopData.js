// src/hooks/useShopData.js
import { useEffect, useState } from "react";
import { fetchShopDual } from "../lib/fortniteApi";
import { useShop } from "./useShop";
import { useTranslation } from "react-i18next";

export function useShopData() {
  const { lang } = useShop(); // "es" | "en"
  const { i18n } = useTranslation();

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;

    setLoading(true);
    setErr(null);

    // Forzamos la clave para la API: EN -> "EN", ES -> "ES"
    const apiLangKey = lang === "en" ? "EN" : "ES";

    // Importante: evitamos condiciones de carrera si cambia el idioma
    (async () => {
      try {
        const data = await fetchShopDual(apiLangKey);
        if (!alive) return;

        // Aseguramos que siempre sea un array
        setSections(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        console.error("[useShopData] fetch error:", e);
        setSections([]);
        setErr(
          i18n.language?.startsWith("en")
            ? "Failed to load the shop."
            : "Error al cargar la tienda."
        );
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      // si llega otra petición por cambio de idioma, cancelamos el setState de esta
      alive = false;
    };
  }, [lang, i18n.language]);

  return { sections, loading, err };
}
