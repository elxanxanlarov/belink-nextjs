import { ETIRAF_BASE_URL, ETIRAF_DESIGN_IDS, type EtirafDesign } from "@/lib/etirafShared";

// Müştərilərə göndərmək üçün nümunə etiraf səhifələri (/etiraf/numune/{id}).

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

const AUDIO = "/etiraf/demo/melodiya.wav";

export interface EtirafDemo {
  id: string;
  label: string;
  photos: boolean;
  text: boolean;
  audio: boolean;
  design: EtirafDesign;
}

export const ETIRAF_DEMOS: EtirafDemo[] = [
  { id: "tam", label: "Şəkil + Yazı + Səs", photos: true, text: true, audio: true, design: "red" },
  { id: "sekil", label: "Yalnız şəkil", photos: true, text: false, audio: false, design: "polaroid" },
  { id: "sekil-yazi", label: "Şəkil + Yazı", photos: true, text: true, audio: false, design: "red" },
  { id: "sekil-ses", label: "Şəkil + Səs", photos: true, text: false, audio: true, design: "night" },
  { id: "yazi-ses", label: "Yazı + Səs", photos: false, text: true, audio: true, design: "night" },
  { id: "yazi", label: "Yalnız yazı", photos: false, text: true, audio: false, design: "polaroid" },
  { id: "ses", label: "Yalnız səs", photos: false, text: false, audio: true, design: "red" },
];

export function getEtirafDemo(id: string, design?: string | null) {
  const demo = ETIRAF_DEMOS.find((d) => d.id === id);
  if (!demo) return null;
  const chosen = ETIRAF_DESIGN_IDS.includes(design as EtirafDesign) ? (design as EtirafDesign) : demo.design;
  return {
    title: "Sənin üçün ♡",
    message: demo.text ? MESSAGE : null,
    photos: demo.photos ? PHOTOS : [],
    audioUrl: demo.audio ? AUDIO : null,
    design: chosen,
  };
}

export function etirafDemoUrl(id: string, design?: EtirafDesign | null) {
  return `${ETIRAF_BASE_URL}/etiraf/numune/${id}${design ? `?dizayn=${design}` : ""}`;
}
