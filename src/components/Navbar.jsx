// src/components/Navbar.jsx
import LanguageToggle from "./LanguageToggle";
import CreatorCode from "./CreatorCode";
import CurrencyToggle from "./CurrencyToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-[#0f1115]/70 backdrop-blur supports-[backdrop-filter]:bg-[#0f1115]/60 border-b border-white/10 shadow-lg">
      <div className="container-app py-3 flex items-center justify-between gap-4">
        {/* Marca: logo + nombre (link al Home) */}
        <a href="/" className="flex items-center gap-3 group" aria-label="Ir al inicio">
          <img
            src="/kidstore-logo.svg" // si usas PNG, cambia a /kidstore-logo.png
            alt="KIDSTORE"
            className="h-9 w-9 object-contain select-none"
            draggable="false"
          />
          <span className="title-fn text-xl md:text-2xl leading-none">
            KIDSTORE
          </span>
        </a>

        {/* Controles */}
        <div className="flex flex-wrap items-center justify-end gap-3">
          <CreatorCode code="Kidme" />
          <LanguageToggle />
          <CurrencyToggle />
        </div>
      </div>
    </header>
  );
}
