import { priceByCurrency } from "./pricing";

// Números y enlaces oficiales
const CONTACT = {
  whatsapp: "51983454837", // E.164 sin '+'
  telegram: "kidstore.peru",
  facebook: "https://www.facebook.com/kidstore.gg",
  discord: "https://discord.gg/kidstore"
};

// Mensaje según idioma elegido
function message(item, currency, lang) {
  const price = priceByCurrency(item.vbucks, currency);
  const lines = lang === "en"
    ? [
        "Hi! I'm interested in this cosmetic:",
        `• ${item.displayName}`,
        `• ${item.vbucks} V-Bucks`,
        `• ${currency}: ${price}`,
        "Is it available today?"
      ]
    : [
        "¡Hola! Estoy interesado en este cosmético:",
        `• ${item.displayName}`,
        `• ${item.vbucks} Pavos`,
        `• ${currency}: ${price}`,
        "¿Está disponible hoy?"
      ];
  return encodeURIComponent(lines.join("\n"));
}

export function waLink(item, currency, lang) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${message(item, currency, lang)}`;
}

export function tgLink(item, currency, lang) {
  return `https://t.me/${CONTACT.telegram}?start=${message(item, currency, lang)}`;
}

export function fbLink() { return CONTACT.facebook; }
export function dcLink() { return CONTACT.discord; }
