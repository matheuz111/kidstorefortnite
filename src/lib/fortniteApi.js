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

function pickImage({ it, entry, bundleImage, fallback }) {
  return (
    bundleImage ||
    it?.images?.featured ||
    it?.images?.icon ||
    it?.images?.smallIcon ||
    it?.albumArt ||
    it?.image ||
    entry?.newDisplayAsset?.materialInstances?.[0]?.images?.Background ||
    entry?.newDisplayAsset?.renderImages?.[0]?.image ||
    fallback ||
    "/placeholder.png"
  );
}

function isActiveNow(entry) {
  return true; 
}

function titleForSection(entry) {
  // Se añaden más comprobaciones para encontrar el nombre de la sección
  return entry?.section?.name || entry?.layout?.name || entry?.displayName || "Destacados";
}

function extractSectionsFromEntries(payload) {
  const root = payload?.data;
  if (!root) return { sections: [], vbuckIcon: null };

  const vbuckIcon = root?.vbuckIcon || null;
  const entries = (root.entries || []).filter(isActiveNow);

  const sectionsMap = new Map();
  const order = [];
  const seenCosmeticIds = new Set(); 

  for (const entry of entries) {
    const sectionTitle = titleForSection(entry);
    if (!sectionsMap.has(sectionTitle)) {
      sectionsMap.set(sectionTitle, []);
      order.push(sectionTitle);
    }
    
    const finalPrice = entry.finalPrice || 0;

    const processAndPush = (item, type, rarityGuess = 'common') => {
      const cosmeticId = item.id || entry.offerId;
      if (type !== 'bundle' && seenCosmeticIds.has(cosmeticId)) {
        return;
      }
      const rarityTag = (item.rarity?.value || item.series?.backendValue || rarityGuess).toLowerCase();
      
      sectionsMap.get(sectionTitle).push({
        id: `${entry.offerId}-${cosmeticId}`,
        name: item.name || item.title || "Objeto",
        image: pickImage({ it: item, entry, bundleImage: entry.bundle?.image }),
        vbucks: finalPrice,
        rarity: item.rarity?.displayValue || item.series?.value || "Común",
        rarityTag: rarityTag,
        expiresAt: entry.outDate || null,
        bgGradient: gradientCss(gradientFrom(entry, rarityTag)),
        vbuckIcon: vbuckIcon,
        set: item.set,
        type: item.type,
      });
      seenCosmeticIds.add(cosmeticId);
    };

    const brItems = entry.brItems || [];
    const legoItems = entry.legoKits || [];
    const isExplicitBundle = entry.bundle && entry.bundle.name;
    const isUnnamedBundle = !isExplicitBundle && (brItems.length > 1 || legoItems.length > 1);

    if (isExplicitBundle) {
      processAndPush({ ...entry.bundle, id: entry.offerId }, 'bundle', 'legendary');
      (entry.items || []).forEach(i => seenCosmeticIds.add(i.id));
    } else if (isUnnamedBundle) {
      const mainItem = brItems.find(it => it.type?.value === 'outfit') || legoItems[0] || brItems[0];
      processAndPush({ ...mainItem, id: entry.offerId, name: mainItem.name }, 'bundle', mainItem.rarity?.value || 'epic');
      brItems.forEach(i => seenCosmeticIds.add(i.id));
      legoItems.forEach(i => seenCosmeticIds.add(i.id));
    } else {
      (entry.brItems || []).forEach(item => processAndPush(item, 'cosmetic'));
      (entry.tracks || []).forEach(track => processAndPush(track, 'track', 'rare'));
      (entry.legoKits || []).forEach(kit => processAndPush(kit, 'lego', 'uncommon'));
      (entry.cars || []).forEach(carItem => processAndPush(carItem, 'car', carItem.rarity?.value || 'rare'));
      
      // SOLUCIÓN: Añadimos un bucle para el array genérico 'items'.
      // Esto capturará los accesorios de vehículos y otros cosméticos que no encajan en las categorías anteriores.
      (entry.items || []).forEach(item => processAndPush(item, 'cosmetic'));
    }
  }
  
  const itemTypeOrder = [
    'AthenaBundle', 'AthenaCharacter', 'AthenaBackpack', 'AthenaPickaxe', 
    'AthenaGlider', 'AthenaItemWrap', 'AthenaDance',
  ];

  sectionsMap.forEach((items) => {
    items.sort((a, b) => {
      const setNameA = a.set?.value || 'zzzz';
      const setNameB = b.set?.value || 'zzzz';
      if (setNameA < setNameB) return -1;
      if (setNameA > setNameB) return 1;

      const typeA = a.type?.backendValue || '';
      const typeB = b.type?.backendValue || '';
      const indexA = itemTypeOrder.indexOf(typeA);
      const indexB = itemTypeOrder.indexOf(typeB);
      if (indexA !== -1 && indexB !== -1) {
        if (indexA < indexB) return -1;
        if (indexA > indexB) return 1;
      }
      return a.name.localeCompare(b.name);
    });
  });

  const sections = order.map(title => ({
    title: title,
    items: sectionsMap.get(title) || []
  })).filter(sec => sec.items.length > 0);

  return { sections, vbuckIcon };
}


/* ---------- API fusion ES/EN ---------- */
export async function fetchShopDual(langKey = "ES") {
  const mainKey = langKey === "EN" ? "EN" : "ES";
  const altKey  = mainKey === "EN" ? "ES" : "EN";

  const [main, alt] = await Promise.all([
    fetchJSON(API_URLS[mainKey]),
    fetchJSON(API_URLS[altKey]),
  ]);

  const { sections: mainSecs, vbuckIcon } = extractSectionsFromEntries(main);
  const { sections: altSecs } = extractSectionsFromEntries(alt);

  const altIndex = new Map();
  for (const s of altSecs) for (const it of s.items) altIndex.set(it.id, it);
  
  const merged = mainSecs.map((sec) => {
    let altSecTitle = sec.title;
    const firstMainItem = sec.items[0];
    if (firstMainItem) {
      for (const altSec of altSecs) {
        if (altSec.items.some(altItem => altItem.id === firstMainItem.id)) {
          altSecTitle = altSec.title;
          break;
        }
      }
    }

    return {
      titleEs: mainKey === "ES" ? sec.title : altSecTitle,
      titleEn: mainKey === "EN" ? sec.title : altSecTitle,
      items: sec.items.map((it) => {
        const altIt = altIndex.get(it.id);
        return {
          ...it,
          nameEs: mainKey === "ES" ? it.name : (altIt?.name || it.name),
          nameEn: mainKey === "EN" ? it.name : (altIt?.name || it.name),
          vbuckIcon: it.vbuckIcon || vbuckIcon || null,
        };
      }),
    };
  });

  if (import.meta?.env?.DEV) {
    const total = merged.reduce((a, s) => a + s.items.length, 0);
    console.log(`[fetchShopDual:${mainKey}] secciones=${merged.length}, items=${total}`);
  }
  return merged;
}