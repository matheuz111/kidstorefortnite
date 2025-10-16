// src/App.jsx
import { useMemo } from "react";
import ShopProvider from "./contexts/ShopProvider";
import { useShop } from "./hooks/useShop";
import { useTranslation } from "react-i18next";

import Navbar from "./components/Navbar";
import DisclaimerBar from "./components/DisclaimerBar";
import HoursWidget from "./components/HoursWidget";
import SectionHeader from "./components/SectionHeader";
import ShopGrid from "./components/ShopGrid";
import SearchBar from "./components/SearchBar";
import ErrorBoundary from "./components/ErrorBoundary";
import ContactDock from "./components/ContactDock";
import { useShopData } from "./hooks/useShopData";

function Page() {
  const { t, i18n } = useTranslation();
  const { query } = useShop();
  const { sections, loading, err } = useShopData();
  const isEN = (i18n.language || "es").startsWith("en");

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return sections;
    return sections
      .map((sec) => {
        const items = (sec.items || []).filter((it) => {
          const es = (it.nameEs || "").toLowerCase();
          const en = (it.nameEn || "").toLowerCase();
          return es.includes(q) || en.includes(q);
        });
        return { ...sec, items };
      })
      .filter((sec) => (sec.items || []).length > 0);
  }, [sections, query]);

  return (
    <div>
      <Navbar />

      {/* Título */}
      <div className="container-app mt-10 text-center">
        <h2 className="title-fn text-3xl md:text-4xl">{t("title")}</h2>
      </div>
      <div className="sep-md" />

      {/* Aviso */}
      <DisclaimerBar />
      <div className="sep-md" />

      {/* Horario + búsqueda */}
      <HoursWidget />
      <div className="sep-sm" />
      <SearchBar />

      {/* Estados */}
      {loading && (
        <div className="container-app mt-8 opacity-70">{t("loading")}</div>
      )}
      {err && !loading && (
        <div className="container-app mt-8 text-red-400">{err}</div>
      )}
      {!loading && !err && filtered.length === 0 && (
        <div className="container-app mt-8 opacity-70">{t("no_results")}</div>
      )}

      {/* Secciones */}
      {!loading &&
        !err &&
        filtered.map((sec, i) => (
          <div key={`${sec.titleEs || "SEC"}-${i}`}>
            <SectionHeader
              title={isEN ? sec.titleEn || sec.titleEs : sec.titleEs || sec.titleEn}
              count={(sec.items || []).length}
            />
            <ShopGrid items={sec.items || []} />
          </div>
        ))}

      <div className="h-16" />

      {/* Dock flotante de contacto */}
      <ContactDock />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ShopProvider>
        <Page />
      </ShopProvider>
    </ErrorBoundary>
  );
}
