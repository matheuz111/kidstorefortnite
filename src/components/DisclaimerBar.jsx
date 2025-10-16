import { useTranslation } from "react-i18next";

export default function DisclaimerBar() {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-yellow-500/15 text-yellow-200 border-b border-yellow-500/30">
      <div className="container-app py-2 text-xs md:text-sm text-center font-burbankSmall">
        ⚠️ {t("disclaimer")}
      </div>
    </div>
  );
}
