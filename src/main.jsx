import React from "react";
import { createRoot } from "react-dom/client";

// 🧩 Importa estilos en orden correcto
import "./index.css";           // ← Tailwind base
import "./styles/globals.css";  // ← Tus estilos personalizados

// 🌐 Importa i18n antes de renderizar la app
import "./i18n";

import App from "./App.jsx";

// 🪄 Render principal
const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("No se encontró el elemento #root en index.html");
}

createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
