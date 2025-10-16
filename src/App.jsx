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
import { specialBundles } from "./lib/mockBundles"; 

function Page() {
  const { t, i18n } = useTranslation();
  const { query } = useShop();
  const { sections, loading, err } = useShopData();
  const isEN = (i18n.language || "es").startsWith("en");

  const filteredApiSections = useMemo(() => {
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
  
  const specialOfferItems = useMemo(() => {
    return specialBundles.map(bundle => ({
      ...bundle,
      isRealMoney: true,
      realPrices: bundle.price,
      vbucks: 0,
      rarity: "epic",
      bgGradient: "linear-gradient(135deg, #5c2ab3 0%, #2a0066 100%)",
    }));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container-app mt-10 text-center">
        <h2 className="title-fn text-3xl md:text-4xl">{t("title")}</h2>
      </div>
      <div className="sep-md" />
      <DisclaimerBar />
      <div className="sep-md" />
      <HoursWidget />
      <div className="sep-sm" />
      <SearchBar />
      
      {/* Secciones de la API*/}
      {loading && <div className="container-app mt-8 opacity-70">{t("loading")}</div>}
      {err && !loading && <div className="container-app mt-8 text-red-400">{err}</div>}
      {!loading && !err && filteredApiSections.length === 0 && (
        <div className="container-app mt-8 opacity-70">{t("no_results")}</div>
      )}
      {!loading && !err && filteredApiSections.map((sec, i) => (
          <div key={`${sec.titleEs || "SEC"}-${i}`}>
            <SectionHeader
              title={isEN ? sec.titleEn || sec.titleEs : sec.titleEs || sec.titleEn}
              count={(sec.items || []).length}
            />
            <ShopGrid items={sec.items || []} />
          </div>
        ))}
        
      {/* Sección de Lotes y Ofertas Especiales (AHORA ESTÁ AL FINAL) */}
      <div>
        <SectionHeader
          title={isEN ? "Special Offers & Bundles" : "Lotes y Ofertas Especiales"}
          count={specialOfferItems.length}
        />
        <ShopGrid items={specialOfferItems} />
      </div>

      <div className="h-16" />
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