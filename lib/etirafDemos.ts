import { ETIRAF_BASE_URL, ETIRAF_DESIGN_IDS, ETIRAF_DESIGNS, type EtirafDesign } from "@/lib/etirafShared";

// Nümunə etiraf səhifələri (/etiraf/numune/{id}) və satış paketləri (/etiraf/numuneler).

const PHOTOS = [
  "/demo/gul-urek.jpg",
  "/demo/gul-lale.jpg",
  "/demo/nar-sham.jpg",
  "/demo/zer-uzuk.jpg",
  "/demo/gul-buket.jpg",
  "/demo/nar-hediyye.jpg",
];

const MESSAGE =
  "Səninlə tanış olduğum gün həyatımın ən gözəl günü oldu.\nHər gülüşün mənim üçün bir hədiyyədir.\nYaxşı ki, varsan... ❤️";

const MELODY = "/etiraf/demo/melodiya.wav";

export interface EtirafDemo {
  id: string;
  label: string;
  photos: boolean;
  text: boolean;
  /** Səs yazısı — oxutma düyməsi ilə */
  audio: boolean;
  /** Arxa fon musiqisi — avtomatik başlayır */
  music: boolean;
  design: EtirafDesign;
}

/** Satış paketləri — nümunələr səhifəsində göstərilir. */
export interface EtirafPackage extends EtirafDemo {
  price: number;
  includes: string[];
}

export const ETIRAF_PACKAGES: EtirafPackage[] = [
  {
    id: "sekil",
    label: "Sadəcə şəkil",
    price: 5,
    includes: ["Şəkillər", "QR kodlu hədiyyə kartı"],
    photos: true,
    text: false,
    audio: false,
    music: false,
    design: "polaroid",
  },
  {
    id: "sekil-musiqi",
    label: "Şəkil + musiqi",
    price: 7,
    includes: ["Şəkillər", "Avtomatik açılan fon musiqisi", "QR kodlu hədiyyə kartı"],
    photos: true,
    text: false,
    audio: false,
    music: true,
    design: "night",
  },
  {
    id: "tam",
    label: "Şəkil + mətn + səs yazısı",
    price: 10,
    includes: ["Şəkillər", "Ürək sözləri (mətn)", "Səs yazısı", "QR kodlu hədiyyə kartı"],
    photos: true,
    text: true,
    audio: true,
    music: false,
    design: "red",
  },
];

// Əvvəl paylaşılmış nümunə linkləri işləməyə davam etsin deyə saxlanılır (siyahıda göstərilmir).
const LEGACY_DEMOS: EtirafDemo[] = [
  { id: "sekil-yazi", label: "Şəkil + Yazı", photos: true, text: true, audio: false, music: false, design: "red" },
  { id: "sekil-ses", label: "Şəkil + Səs", photos: true, text: false, audio: true, music: false, design: "night" },
  { id: "yazi-ses", label: "Yazı + Səs", photos: false, text: true, audio: true, music: false, design: "night" },
  { id: "yazi", label: "Yalnız yazı", photos: false, text: true, audio: false, music: false, design: "polaroid" },
  { id: "ses", label: "Yalnız səs", photos: false, text: false, audio: true, music: false, design: "red" },
];

const ALL_DEMOS: EtirafDemo[] = [...ETIRAF_PACKAGES, ...LEGACY_DEMOS];

export const getEtirafPackage = (id: string) => ETIRAF_PACKAGES.find((p) => p.id === id) ?? null;

export function getEtirafDemo(id: string, design?: string | null) {
  const demo = ALL_DEMOS.find((d) => d.id === id);
  if (!demo) return null;
  const chosen = ETIRAF_DESIGN_IDS.includes(design as EtirafDesign) ? (design as EtirafDesign) : demo.design;
  return {
    title: "Sənin üçün ♡",
    message: demo.text ? MESSAGE : null,
    photos: demo.photos ? PHOTOS : [],
    audioUrl: demo.audio ? MELODY : null,
    musicUrl: demo.music ? MELODY : null,
    design: chosen,
  };
}

export const ETIRAF_SAMPLES_PATH = "/etiraf/numuneler";
export const etirafSamplesUrl = () => `${ETIRAF_BASE_URL}${ETIRAF_SAMPLES_PATH}`;

export function etirafDemoPath(id: string, design?: EtirafDesign | null) {
  return `/etiraf/numune/${id}${design ? `?dizayn=${design}` : ""}`;
}

/** Paketi WhatsApp-da sifariş etmək üçün link. */
export function etirafOrderWhatsappUrl(pkg: EtirafPackage, design?: EtirafDesign | null) {
  const phone = (process.env.NEXT_PUBLIC_ETIRAF_WHATSAPP || "").replace(/\D/g, "");
  const designName = ETIRAF_DESIGNS.find((d) => d.id === (design || pkg.design))?.name;
  const text = encodeURIComponent(
    [
      "Salam! Etiraf sifariş etmək istəyirəm ❤️",
      `Paket: ${pkg.label} — ${pkg.price} AZN`,
      designName ? `Dizayn: ${designName}` : "",
    ]
      .filter(Boolean)
      .join("\n")
  );
  return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
}
