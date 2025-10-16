// src/lib/fortniteApi.js

const API_URLS = {
  ES: "https://fortnite-api.com/v2/shop?language=es-419",
  EN: "https://fortnite-api.com/v2/shop?language=en",
};

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error al obtener datos: ${res.status}`);
  return res.json();
}

/* ---------- helpers de color/gradiente ---------- */
const RARITY_GRADIENTS = {
  common: ["#3a3f47", "#23272e", "#171a1f"],
  uncommon: ["#3ccf7a", "#1aa95c", "#0e6a3a"],
  rare: ["#2aa7ff", "#0b79d0", "#094b84"],
  epic: ["#a955ff", "#7d38d6", "#4c1f8b"],
  legendary: ["#ff9a2a", "#e66a00", "#993d00"],
  mythic: ["#ffcf33", "#df9a00", "#a46a00"],
  darkseries: ["#6a00ff", "#4700b3", "#2a0066"],
  marvelseries: ["#ff3131", "#b51b1b", "#6f0f0f"],
  starwarsseries: ["#52b6ff", "#286f9e", "#133a54"],
  dcu: ["#00c7ff", "#007aa6", "#003f57"],
  gaminglegends: ["#53f3db", "#199f8d", "#0d5d54"],
};

function hexify(v) {
  if (!v) return null;
  const s = v.startsWith("#") ? v : `#${v}`;
  return /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(s) ? s : null;
}

function materialHintToGradient(tileMaterial = "") {
  const m = String(tileMaterial || "").toLowerCase();
  if (m.includes("fnmares")) return ["#ff6b1c", "#87167f", "#d53554"];
  if (m.includes("idol")) return ["#ff7a7a", "#e43d3d", "#941f1f"];
  return null;
}

function gradientFrom(entry, rarityTag) {
  const c1 = hexify(entry?.colors?.color1);
  const c2 = hexify(entry?.colors?.color2);
  const c3 = hexify(entry?.colors?.color3);
  if (c1 && c2 && c3) return [c1, c2, c3];

  const mat = entry?.tileBackgroundMaterial || entry?.newDisplayAsset?.tileBackgroundMaterial;
  const hinted = materialHintToGradient(mat);
  if (hinted) return hinted;

  const key = String(rarityTag || "common").toLowerCase();
  return RARITY_GRADIENTS[key] || RARITY_GRADIENTS.common;
}

function gradientCss(parts) {
  if (!parts || parts.length < 2) return undefined;
  const [a, b, c] = parts;
  return c
    ? `linear-gradient(180deg, ${a} 0%, ${b} 55%, ${c} 100%)`
    : `linear-gradient(180deg, ${a} 0%, ${b} 100%)`;
}

/* ---------- helpers de parsing ---------- */

function pickImage({ it, entry, bundleImage, fallback }) {
  return (
    bundleImage ||
    it?.images?.featured ||
    it?.images?.icon ||
    it?.images?.smallIcon ||
    it?.albumArt ||
    it?.image ||
    entry?.newDisplayAsset?.renderImages?.[0]?.image ||
    fallback ||
    "/placeholder.png"
  );
}

function isActiveNow(entry) {
  const now = Date.now();
  const start = entry?.inDate ? Date.parse(entry.inDate) : null;
  const end = entry?.outDate ? Date.parse(entry.outDate) : null;
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
}

function titleForSection(entry) {
  return entry?.layout?.name || entry?.layout?.id || entry?.offerTag?.text || "General";
}

function makeItemId(kind, entry, it, index = 0) {
  const offer = entry?.offerId || entry?.devName || "offer";
  switch (kind) {
    case "bundle":   return `${offer}#bundle`;
    case "track":    return it?.id || `${offer}#track:${it?.title || it?.devName || index}`;
    case "lego":     return it?.id || `${offer}#lego:${it?.name || index}`;
    case "cosmetic": return it?.id || `${offer}#cos:${it?.templateId || it?.devName || index}`;
    default:         return it?.id || `${offer}#fallback`;
  }
}

/**
 * PARSER principal de la tienda del día (sin filtros restrictivos).
 * Incluye BR, Bundles, Jam Tracks, LEGO… todo lo que traiga /v2/shop.
 */
function extractSectionsFromEntries(payload) {
  const root = payload?.data;
  if (!root) return { sections: [], vbuckIcon: null };

  const vbuckIcon = root?.vbuckIcon || null;
  const raw = Array.isArray(root.entries) ? root.entries : [];
  const entries = raw.filter(isActiveNow); // si no hay fechas, se considera vigente

  const sectionsMap = new Map();
  const order = [];
  const seen = new Set();

  for (const entry of entries) {
    const sectionTitle = titleForSection(entry);
    if (!sectionsMap.has(sectionTitle)) {
      sectionsMap.set(sectionTitle, []);
      order.push(sectionTitle);
    }

    const finalPrice =
      entry?.finalPrice ??
      entry?.regularPrice ??
      entry?.price?.finalPrice ??
      entry?.price ??
      0;

    const push = (norm, rarityGuess) => {
      const uid = norm.uid;
      if (!uid || seen.has(uid)) return;

      const rarityTag = String(
        norm.series?.backendValue ||
        norm.rarity?.value ||
        norm.rarity ||
        rarityGuess ||
        "common"
      ).toLowerCase();

      const bgParts = gradientFrom(entry, rarityTag);

      sectionsMap.get(sectionTitle).push({
        id: uid,
        name: norm.name || "Objeto desconocido",
        image: pickImage({ it: norm, entry, bundleImage: norm.bundleImage }),
        rarity: norm.series?.value || norm.rarity?.displayValue || norm.rarity?.value || norm.rarity || "Común",
        rarityTag,
        vbucks: norm.vbucks ?? finalPrice ?? 800,
        expiresAt: entry?.outDate || null,
        bgGradient: gradientCss(bgParts),
        vbuckIcon,
      });

      seen.add(uid);
    };

    // Bundles
    if (entry?.bundle?.name) {
      push(
        {
          uid: makeItemId("bundle", entry),
          name: entry.bundle.name,
          bundleImage: entry.bundle?.image,
          vbucks: finalPrice,
        },
        "legendary"
      );
    }

    // Jam Tracks
    if (Array.isArray(entry.tracks) && entry.tracks.length) {
      entry.tracks.forEach((tr, i) =>
        push(
          {
            uid: makeItemId("track", entry, tr, i),
            name: tr?.title || tr?.devName,
            albumArt: tr?.albumArt,
            vbucks: finalPrice,
          },
          "rare"
        )
      );
    }

    // LEGO
    if (Array.isArray(entry.legoKits) && entry.legoKits.length) {
      entry.legoKits.forEach((kit, i) =>
        push(
          {
            uid: makeItemId("lego", entry, kit, i),
            name: kit?.name,
            images: { icon: kit?.images?.small },
            vbucks: finalPrice,
          },
          "epic"
        )
      );
    }

    // Cosméticos
    if (Array.isArray(entry.items) && entry.items.length) {
      entry.items.forEach((it, i) =>
        push(
          {
            uid: makeItemId("cosmetic", entry, it, i),
            name: it?.name || it?.devName,
            images: it?.images,
            rarity: it?.rarity,
            series: it?.series,
            vbucks: it?.price ?? finalPrice,
          },
          it?.rarity?.value || it?.rarity
        )
      );
    }

    // Fallback (por si acaso)
    if (!sectionsMap.get(sectionTitle).length) {
      push(
        {
          uid: makeItemId("fallback", entry),
          name: entry?.layout?.name || entry?.devName || "Oferta",
          image: entry?.newDisplayAsset?.renderImages?.[0]?.image,
          vbucks: finalPrice,
        },
        "common"
      );
    }
  }

  const sections = [];
  for (const title of order) {
    const items = sectionsMap.get(title) || [];
    if (items.length) sections.push({ title, items });
  }
  return { sections, vbuckIcon };
}

/* ---------- API fusion ES/EN ---------- */
export async function fetchShopDual(langKey = "ES") {
  // langKey SIEMPRE decide qué API se usa para los textos principales
  const mainKey = langKey === "EN" ? "EN" : "ES";
  const altKey  = mainKey === "EN" ? "ES" : "EN";

  const [main, alt] = await Promise.all([
    fetchJSON(API_URLS[mainKey]),
    fetchJSON(API_URLS[altKey]),
  ]);

  const { sections: mainSecs, vbuckIcon } = extractSectionsFromEntries(main);
  const { sections: altSecs } = extractSectionsFromEntries(alt);

  // índice alterno para traducir nombres por id
  const altIndex = new Map();
  for (const s of altSecs) for (const it of s.items) altIndex.set(it.id, it);

  // devolvemos títulos tal cual del idioma actual (al cambiar, se re-fetch)
  const merged = mainSecs.map((sec) => ({
    titleEs: sec.title,
    titleEn: sec.title,
    items: sec.items.map((it) => {
      const altIt = altIndex.get(it.id);
      return {
        id: it.id,
        nameEs: mainKey === "ES" ? it.name : (altIt?.name || it.name),
        nameEn: mainKey === "EN" ? it.name : (altIt?.name || it.name),
        image: it.image,
        vbucks: it.vbucks,
        rarity: it.rarity,
        rarityTag: it.rarityTag,
        expiresAt: it.expiresAt || null,
        bgGradient: it.bgGradient || null,
        vbuckIcon: it.vbuckIcon || vbuckIcon || null,
      };
    }),
  }));

  if (import.meta?.env?.DEV) {
    const total = merged.reduce((a, s) => a + s.items.length, 0);
    console.log(`[fetchShopDual:${mainKey}] secciones=${merged.length}, items=${total}`);
  }
  return merged;
}
