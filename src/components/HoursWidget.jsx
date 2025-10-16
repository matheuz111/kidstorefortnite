import { useEffect, useState } from "react";
import { getWindowForVisitor, formatWindow } from "../lib/schedule";
import { useTranslation } from "react-i18next";

export default function HoursWidget() {
  const { t } = useTranslation();
  const [win, setWin] = useState(null);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setWin(getWindowForVisitor(tz));
  }, []);

  if (!win) return null;

  return (
    <div className="container-app mt-4 grid md:grid-cols-3 gap-4">
      <div className="card p-4">
        <div className="text-xs md:text-sm opacity-70 font-burbankSmall">{t("todayHours")}</div>
        <div className="text-lg md:text-xl font-burbankSmall mt-1">{formatWindow(win)}</div>
      </div>
      <div className="card p-4">
        <div className="text-xs md:text-sm opacity-70 font-burbankSmall">Status</div>
        <div className={`text-lg md:text-xl font-burbankSmall mt-1 ${win.openNow ? "text-green-400" : "text-red-400"}`}>
          {win.openNow ? t("open") : t("closed")}
        </div>
      </div>
      <div className="card p-4">
        <div className="text-xs md:text-sm opacity-70 font-burbankSmall">{t("timezone")}</div>
        <div className="text-lg md:text-xl font-burbankSmall mt-1">{win.tz}</div>
      </div>
    </div>
  );
}
