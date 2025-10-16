// src/components/SearchBar.jsx
import { useEffect, useRef, useState } from "react";
import { useShop } from "../hooks/useShop";

export default function SearchBar() {
  const { query, setQuery } = useShop();
  const [local, setLocal] = useState(query);
  const tRef = useRef(null);

  // Debounce 250ms
  useEffect(() => {
    clearTimeout(tRef.current);
    tRef.current = setTimeout(() => setQuery(local), 250);
    return () => clearTimeout(tRef.current);
  }, [local, setQuery]);

  const clear = () => {
    setLocal("");
    setQuery("");
  };

  return (
    <div className="container-app mt-4">
      <div className="relative">
        <input
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          placeholder="Buscar / Search..."
          className="w-full bg-[#151823] border border-white/10 rounded-xl pl-4 pr-10 py-2 outline-none focus:border-cyan-400"
        />
        {local && (
          <button
            onClick={clear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs opacity-80 hover:opacity-100"
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
