// src/hooks/useCountdown.js
import { useEffect, useMemo, useState } from "react";

export default function useCountdown(isoDate) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!isoDate) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [isoDate]);

  const { label, isOver } = useMemo(() => {
    if (!isoDate) return { label: "", isOver: false };
    const end = Date.parse(isoDate);
    const diff = end - now;
    if (isNaN(end) || diff <= 0) return { label: "Terminado", isOver: true };

    const totalSec = Math.floor(diff / 1000);
    const d = Math.floor(totalSec / 86400);
    const h = Math.floor((totalSec % 86400) / 3600);
    const m = Math.floor((totalSec % 3600) / 60);

    const parts = [];
    if (d) parts.push(`${d}d`);
    parts.push(`${h}h`);
    parts.push(`${m}m`);
    return { label: parts.join(" "), isOver: false };
  }, [isoDate, now]);

  return { label, isOver };
}
