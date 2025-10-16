import { useMemo } from "react";
import { useShop } from "../hooks/useShop";
import useCountdown from "../hooks/useCountdown";
import { FaWhatsapp, FaTelegramPlane, FaFacebookF, FaDiscord } from "react-icons/fa";

/* Conversión: precio por 100 V-Bucks */
const PER_100 = { PEN: 1.5, USD: 0.45, EUR: 0.40 };

function vbucksToFiat(vb, currency, lang = "es") {
  const per100 = PER_100[currency];
  if (!per100) return null;
  const amount = (Number(vb || 0) / 100) * per100;

  const locale =
    currency === "USD" ? "en-US" :
    currency === "EUR" ? (lang.startsWith("en") ? "en-IE" : "es-ES") :
    "es-PE";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
}

const enc = (s) => {
  try { return encodeURIComponent(s); } catch { return s; }
};

export default function ItemCard({ item }) {
  const { currency, lang } = useShop();

  // ✅ nombre según idioma elegido
  const name =
    lang === "en"
      ? (item?.nameEn || item?.nameEs || item?.name || "Item")
      : (item?.nameEs || item?.nameEn || item?.name || "Objeto");

  const vb = item?.vbucks ?? 0;
  const fiat = vbucksToFiat(vb, currency, lang);
  const { label: timeLeft, isOver } = useCountdown(item?.expiresAt);

  const shareText = useMemo(() => {
    const es = `Hola, quiero este objeto: ${name} — ${vb} VB${fiat ? ` (${fiat})` : ""}`;
    const en = `Hi! I'm interested in: ${name} — ${vb} VB${fiat ? ` (${fiat})` : ""}`;
    return lang === "en" ? en : es;
  }, [name, vb, fiat, lang]);

  const waNumber = "51983454837";
  const links = {
    wa: `https://wa.me/${waNumber}?text=${enc(shareText)}`,
    tg: `https://t.me/kidstore.peru`,
    fb: `https://www.facebook.com/kidstore.gg`,
    dc: `https://discord.gg/kidstore`,
  };

  const bg = item?.bgGradient || "linear-gradient(180deg,#2e3240 0%,#1b1f28 100%)";
  const vbIcon = item?.vbuckIcon || "/vbucks.png";

  return (
    <div
      className="h-[300px] overflow-hidden rounded-2xl border"
      style={{
        borderColor: "rgba(255,255,255,.08)",
        boxShadow: "0 12px 30px rgba(0,0,0,.45)",
        background: "#12141a",
        display: "grid",
        gridTemplateRows: "200px 34px 66px",
      }}
    >
      {/* Top: imagen + overlay inferior-izquierda */}
      <div
        className="relative"
        style={{ backgroundImage: bg, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <img
          src={item?.image}
          alt={name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-contain origin-bottom pointer-events-none select-none transition-transform duration-300"
          style={{
            transform: "scale(1.06)",
            filter: "drop-shadow(0 10px 18px rgba(0,0,0,.55))",
          }}
        />

        <div
          className="absolute left-0 right-0 bottom-0 h-16"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.35) 55%, rgba(0,0,0,.55) 100%)",
          }}
        />

        {/* Nombre + V-Bucks */}
        <div className="absolute left-3 right-3 bottom-3">
          <div
            className="uppercase text-white leading-tight"
            style={{
              fontFamily: "'Burbank Big','Burbank Small',sans-serif",
              fontWeight: 900,
              fontSize: "1.02rem",
              textShadow: "0 2px 4px rgba(0,0,0,.8), 0 0 12px rgba(255,255,255,.07)",
            }}
          >
            {name}
          </div>

          <div className="mt-1 flex items-center gap-1">
            <img src={vbIcon} alt="VB" className="h-4 w-4 object-contain" />
            <span
              className="text-white"
              style={{
                fontFamily: "'Burbank Small',sans-serif",
                fontWeight: 800,
                fontSize: "0.98rem",
                textShadow: "0 1px 2px rgba(0,0,0,.65)",
              }}
            >
              {vb.toLocaleString()} VB
            </span>
          </div>
        </div>
      </div>

      {/* Precio en divisa — centrado */}
      <div className="flex items-center justify-center">
        <span
          className="text-white"
          style={{
            fontFamily: "'Burbank Small',sans-serif",
            fontWeight: 800,
            textShadow: "0 1px 2px rgba(0,0,0,.55)",
          }}
        >
          {fiat ?? (lang === "en" ? "N/A" : "N/D")}
        </span>
      </div>

      {/* Tiempo + iconos — centrados */}
      <div className="flex flex-col items-center justify-between">
        <div
          className="mt-1 text-white"
          style={{
            fontFamily: "'Burbank Small',sans-serif",
            fontWeight: 800,
            textShadow: "0 1px 2px rgba(0,0,0,.6)",
          }}
        >
          <span role="img" aria-label="time">🕑</span>{" "}
          {item?.expiresAt && !isOver ? timeLeft : (lang === "en" ? "Unavailable" : "Sin fecha")}
        </div>

        <div className="mb-2 flex items-center justify-center gap-3">
          <a href={links.wa} target="_blank" rel="noreferrer" title="WhatsApp"
             className="h-8 w-8 grid place-items-center rounded-full text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 transition-colors"
             style={{ boxShadow: "0 6px 14px rgba(0,0,0,.35)" }}>
            <FaWhatsapp size={18} />
          </a>
          <a href={links.tg} target="_blank" rel="noreferrer" title="Telegram"
             className="h-8 w-8 grid place-items-center rounded-full text-[#2AABEE] bg-[#2AABEE]/10 hover:bg-[#2AABEE]/20 border border-[#2AABEE]/30 transition-colors"
             style={{ boxShadow: "0 6px 14px rgba(0,0,0,.35)" }}>
            <FaTelegramPlane size={18} />
          </a>
          <a href={links.fb} target="_blank" rel="noreferrer" title="Facebook"
             className="h-8 w-8 grid place-items-center rounded-full text-[#1877F2] bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 transition-colors"
             style={{ boxShadow: "0 6px 14px rgba(0,0,0,.35)" }}>
            <FaFacebookF size={16} />
          </a>
          <a href={links.dc} target="_blank" rel="noreferrer" title="Discord"
             className="h-8 w-8 grid place-items-center rounded-full text-[#5865F2] bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/30 transition-colors"
             style={{ boxShadow: "0 6px 14px rgba(0,0,0,.35)" }}>
            <FaDiscord size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}
