import { useShop } from "../hooks/useShop";
import { waLink, tgLink, fbLink, dcLink } from "../lib/contact";
import { useTranslation } from "react-i18next";

export default function ContactButtons({ item }) {
  const { currency } = useShop();
  const { i18n } = useTranslation();
  const lang = i18n.language || "es";

  const base =
    "flex-1 inline-flex items-center justify-center rounded-xl border px-3 py-2 text-xs font-burbankSmall transition";

  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      <a href={waLink(item, currency, lang)} target="_blank" rel="noreferrer"
         className={`${base} border-emerald-400/40 bg-emerald-500/15 hover:bg-emerald-500/25`}>WhatsApp</a>
      <a href={tgLink(item, currency, lang)} target="_blank" rel="noreferrer"
         className={`${base} border-sky-400/40 bg-sky-500/15 hover:bg-sky-500/25`}>Telegram</a>
      <a href={fbLink()} target="_blank" rel="noreferrer"
         className={`${base} border-blue-400/40 bg-blue-500/15 hover:bg-blue-500/25`}>Facebook</a>
      <a href={dcLink()} target="_blank" rel="noreferrer"
         className={`${base} border-indigo-400/40 bg-indigo-500/15 hover:bg-indigo-500/25`}>Discord</a>
    </div>
  );
}
