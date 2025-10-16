import { DateTime } from "luxon";

// Base en Lima (tu horario)
const BASE_TZ = "America/Lima";
// 1..7 (Mon..Sun) según Luxon
const SLOTS = {
  1: ["09:00", "24:00"], // Lunes
  2: ["09:00", "24:00"],
  3: ["09:00", "24:00"],
  4: ["09:00", "24:00"],
  5: ["09:00", "24:00"], // Viernes
  6: ["14:00", "24:00"], // Sábado
  7: ["14:00", "24:00"]  // Domingo
};

function parseHM(hm) {
  const [h, m] = hm.split(":").map(Number);
  return { h, m };
}

export function getWindowForVisitor(visitorTZ = Intl.DateTimeFormat().resolvedOptions().timeZone) {
  const nowVisitor = DateTime.now().setZone(visitorTZ);

  // Día actual en Lima (tu referencia)
  const nowLima = nowVisitor.setZone(BASE_TZ);
  const weekdayLima = nowLima.weekday; // 1..7
  const slot = SLOTS[weekdayLima];

  const { h: sh, m: sm } = parseHM(slot[0]);
  const { h: eh, m: em } = parseHM(slot[1]);

  // Construye inicio/fin del día de hoy en Lima
  let startLima = nowLima.startOf("day").set({ hour: sh, minute: sm });
  // 24:00 -> 23:59 para comparación
  let endLima = nowLima.startOf("day").set({ hour: eh === 24 ? 23 : eh, minute: eh === 24 ? 59 : em });

  // Convierte esa ventana al huso del visitante
  const startVisitor = startLima.setZone(visitorTZ);
  const endVisitor = endLima.setZone(visitorTZ);

  const openNow = nowVisitor >= startVisitor && nowVisitor <= endVisitor;

  return {
    openNow,
    start: startVisitor,
    end: endVisitor,
    tz: visitorTZ,
  };
}

export function formatWindow({ start, end }) {
  // Ej: mar 09:00 – 23:59 GMT-5
  return `${start.toFormat("ccc HH:mm")} – ${end.toFormat("HH:mm")} ${start.offsetNameShort}`;
}
