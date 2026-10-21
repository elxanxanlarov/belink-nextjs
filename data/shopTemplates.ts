import type { ShopPalette, ShopTemplate } from "@/types";

export const DEFAULT_SHOP_TEMPLATE_ID = "classic";
export const MAX_SHOP_BANNERS = 5;

const SANS = "var(--font-jakarta), system-ui, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

// Yeni şablon əlavə etmək üçün bu siyahıya bir obyekt əlavə edin.
// `layout` səhifənin quruluşunu (components/shop/storefront/*Layout.tsx),
// `palettes` isə mağaza sahibinin seçə biləcəyi rəngləri təyin edir.
// Nümunə mağaza məlumatı data/shopDemos.ts faylındadır.
export const SHOP_TEMPLATES: ShopTemplate[] = [
  {
    id: "classic",
    name: "Klassik",
    description: "Sadə və sürətli link səhifəsi. Bütün mağazalar üçün pulsuzdur.",
    premium: false,
    layout: "classic",
    shape: {
      radius: "24px",
      buttonRadius: "999px",
      headingFont: SANS,
      headingTransform: "none",
      headingSpacing: "-0.01em",
    },
    palettes: [
      {
        id: "belink",
        name: "Belink",
        bg: "#f9fafb",
        surface: "#ffffff",
        text: "#111827",
        muted: "#6b7280",
        border: "#f3f4f6",
        accent: "#1a7a4a",
        accentText: "#ffffff",
      },
    ],
  },
  {
    id: "boutique",
    name: "Butik",
    description: "Banner slayderi, dairəvi kateqoriyalar və yumşaq kartlar. Əl işi və hədiyyə mağazaları üçün.",
    premium: true,
    layout: "boutique",
    shape: {
      radius: "20px",
      buttonRadius: "999px",
      headingFont: SANS,
      headingTransform: "none",
      headingSpacing: "-0.02em",
    },
    palettes: [
      { id: "yarpaq", name: "Yarpaq", bg: "#f5f9f1", surface: "#ffffff", text: "#1f2a17", muted: "#5f6e53", border: "#dfe9d3", accent: "#44780f", accentText: "#ffffff" },
      { id: "deniz", name: "Dəniz", bg: "#f3f6fb", surface: "#ffffff", text: "#172033", muted: "#5b6880", border: "#dbe3f0", accent: "#1f4fd8", accentText: "#ffffff" },
      { id: "kerpic", name: "Kərpic", bg: "#f5f6f6", surface: "#ffffff", text: "#25282d", muted: "#646a73", border: "#e0e3e6", accent: "#b9482a", accentText: "#ffffff" },
      { id: "gavali", name: "Gavalı", bg: "#f9f5f9", surface: "#ffffff", text: "#2b1b29", muted: "#75627a", border: "#eadfe9", accent: "#7a2e6b", accentText: "#ffffff" },
    ],
  },
  {
    id: "noir",
    name: "Noir",
    description: "Tünd fon, iki sütunlu açılış və üfüqi seçilmişlər lenti. Zərgərlik və lüks brendlər üçün.",
    premium: true,
    layout: "showcase",
    shape: {
      radius: "2px",
      buttonRadius: "2px",
      headingFont: SERIF,
      headingTransform: "none",
      headingSpacing: "0em",
    },
    palettes: [
      { id: "tan", name: "Qızılı tan", bg: "#101012", surface: "#19191c", text: "#f2efe9", muted: "#a5a199", border: "#2d2d31", accent: "#d0a36a", accentText: "#14110c" },
      { id: "gumus", name: "Gümüş", bg: "#0e1013", surface: "#171a1f", text: "#eef1f4", muted: "#98a1ab", border: "#2a2f37", accent: "#c4ccd4", accentText: "#101216" },
      { id: "zumrud", name: "Zümrüd", bg: "#0c1210", surface: "#141c19", text: "#ecf3ef", muted: "#93a39c", border: "#25322d", accent: "#3fbf8a", accentText: "#07130e" },
      { id: "lale", name: "Lalə", bg: "#120e0f", surface: "#1c1617", text: "#f5eeee", muted: "#a89a9c", border: "#33282a", accent: "#e8667d", accentText: "#1a0c0f" },
    ],
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Böyük başlıq, yan panel kateqoriyalar və çərçivəsiz məhsul şəbəkəsi. Geyim və dizayn brendləri üçün.",
    premium: true,
    layout: "catalog",
    shape: {
      radius: "0px",
      buttonRadius: "0px",
      headingFont: SANS,
      headingTransform: "none",
      headingSpacing: "-0.04em",
    },
    palettes: [
      { id: "murekkeb", name: "Mürəkkəb", bg: "#ffffff", surface: "#f5f5f5", text: "#161616", muted: "#6f6f6f", border: "#e4e4e4", accent: "#161616", accentText: "#ffffff" },
      { id: "kobalt", name: "Kobalt", bg: "#ffffff", surface: "#f3f5fb", text: "#141824", muted: "#666d7d", border: "#e1e5ef", accent: "#1b3fd6", accentText: "#ffffff" },
      { id: "mese", name: "Meşə", bg: "#ffffff", surface: "#f2f6f3", text: "#14201a", muted: "#637068", border: "#dfe7e2", accent: "#1f5c3f", accentText: "#ffffff" },
      { id: "mercan", name: "Mərcan", bg: "#ffffff", surface: "#faf4f2", text: "#221614", muted: "#756663", border: "#ecdfdb", accent: "#c9402c", accentText: "#ffffff" },
    ],
  },
  {
    id: "mozaika",
    name: "Mozaika",
    description: "Üzən menyu, mozaika açılış və müxtəlif ölçülü plitələr. Çiçək, şirniyyat və hədiyyə mağazaları üçün.",
    premium: true,
    layout: "bento",
    shape: {
      radius: "28px",
      buttonRadius: "999px",
      headingFont: SANS,
      headingTransform: "none",
      headingSpacing: "-0.03em",
    },
    palettes: [
      { id: "cehrayi", name: "Çəhrayı", bg: "#fff5f4", surface: "#ffffff", text: "#3a2528", muted: "#8a7074", border: "#f4dcdc", accent: "#b84a60", accentText: "#ffffff" },
      { id: "zeytun", name: "Zeytun", bg: "#f4f6ee", surface: "#ffffff", text: "#2c3023", muted: "#6c7260", border: "#e0e4d4", accent: "#a8432f", accentText: "#ffffff" },
      { id: "sema", name: "Səma", bg: "#f0f6fb", surface: "#ffffff", text: "#152838", muted: "#5d7384", border: "#d7e5f0", accent: "#0e6ea8", accentText: "#ffffff" },
      { id: "nane", name: "Nanə", bg: "#eff8f5", surface: "#ffffff", text: "#14302a", muted: "#5b756e", border: "#d5eae3", accent: "#0f7a63", accentText: "#ffffff" },
    ],
  },
];

export const PREMIUM_SHOP_TEMPLATES = SHOP_TEMPLATES.filter((t) => t.premium);

export function getShopTemplate(id: string | null | undefined): ShopTemplate {
  return SHOP_TEMPLATES.find((t) => t.id === id) ?? SHOP_TEMPLATES[0];
}

export function isShopTemplateId(id: unknown): id is string {
  return typeof id === "string" && SHOP_TEMPLATES.some((t) => t.id === id);
}

/** Tanınmayan və ya başqa şablona aid palitra üçün şablonun standart rəngini qaytarır. */
export function getShopPalette(template: ShopTemplate, paletteId: string | null | undefined): ShopPalette {
  return template.palettes.find((p) => p.id === paletteId) ?? template.palettes[0];
}

export function isShopPaletteId(template: ShopTemplate, paletteId: unknown): paletteId is string {
  return typeof paletteId === "string" && template.palettes.some((p) => p.id === paletteId);
}

/** Premium şablon yalnız premium mağazada tətbiq olunur; əks halda klassik göstərilir. */
export function resolveShopTemplate(id: string | null | undefined, isPremium: boolean): ShopTemplate {
  const template = getShopTemplate(id);
  return template.premium && !isPremium ? getShopTemplate(DEFAULT_SHOP_TEMPLATE_ID) : template;
}
