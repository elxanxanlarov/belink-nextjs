// Həm server, həm də client tərəfində istifadə olunan etiraf sabitləri (node:crypto yoxdur).

export const ETIRAF_MESSAGE_MAX = 500;
export const ETIRAF_TITLE_MAX = 60;
export const ETIRAF_PHOTOS_ALL_TYPES = 15;
export const ETIRAF_PHOTOS_DEFAULT = 10;
export const ETIRAF_PHOTOS_HARD_MAX = 20;
export const ETIRAF_AUDIO_MAX_SECONDS = 60;

export const ETIRAF_DESIGN_IDS = ["red", "polaroid", "night"] as const;
export type EtirafDesign = (typeof ETIRAF_DESIGN_IDS)[number];

export const ETIRAF_DESIGNS: { id: EtirafDesign; name: string }[] = [
  { id: "red", name: "Qırmızı ürək" },
  { id: "polaroid", name: "Xatirə albomu" },
  { id: "night", name: "Ulduzlu gecə" },
];

export interface EtirafAllowance {
  allowPhotos: boolean;
  allowText: boolean;
  allowAudio: boolean;
  /** Arxa fon musiqisi */
  allowMusic?: boolean;
}

/** Şəkil ilə birlikdə ən azı 3 məzmun növü açıqdırsa 15, əks halda 10 şəkil. */
export function defaultMaxPhotos(a: EtirafAllowance): number {
  const types = [a.allowPhotos, a.allowText, a.allowAudio, Boolean(a.allowMusic)].filter(Boolean).length;
  return a.allowPhotos && types >= 3 ? ETIRAF_PHOTOS_ALL_TYPES : ETIRAF_PHOTOS_DEFAULT;
}

/** Fon musiqisi faylının maksimum ölçüsü (birbaşa Cloudinary-yə yüklənir). */
export const ETIRAF_MUSIC_MAX_BYTES = 15 * 1024 * 1024;

export const ETIRAF_BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://belink.az").replace(/\/$/, "");

export const etirafPublicUrl = (slug: string) => `${ETIRAF_BASE_URL}/etiraf/${slug}`;
export const etirafInviteUrl = (token: string) => `${ETIRAF_BASE_URL}/etiraf/yarat/${token}`;

/** Sifarişi tamamlamaq üçün admin WhatsApp linki. */
export function etirafWhatsappUrl(slug: string, customer?: { name?: string | null; email?: string | null }) {
  const phone = (process.env.NEXT_PUBLIC_ETIRAF_WHATSAPP || "").replace(/\D/g, "");
  const lines = [
    "Salam! Etiraf hədiyyəm hazırdır 🎁",
    etirafPublicUrl(slug),
    customer?.name ? `Ad: ${customer.name}` : "",
    customer?.email ? `Email: ${customer.email}` : "",
  ].filter(Boolean);
  const text = encodeURIComponent(lines.join("\n"));
  return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
}
