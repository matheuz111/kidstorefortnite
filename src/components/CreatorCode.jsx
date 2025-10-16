import { useTranslation } from "react-i18next";

export default function CreatorCode({ code = "Kidme" }) {
  const { t } = useTranslation();
  return (
    <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-white/5 border border-white/10">
      {t("creatorCode", { code })}
    </div>
  );
}
