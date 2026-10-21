import { cleanWhatsappPhone } from "@/lib/shopOrder";

export type ShopSocialKey =
  | "whatsapp"
  | "instagram"
  | "tiktok"
  | "linkedin"
  | "twitter"
  | "facebook"
  | "youtube";

export interface ShopSocialLink {
  key: ShopSocialKey;
  name: string;
  url: string;
}

interface ShopSocialSource {
  whatsappPhone?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  youtube?: string | null;
}

const formatSocialUrl = (value: string, prefix: string) =>
  value.startsWith("http://") || value.startsWith("https://")
    ? value
    : `${prefix}${value.replace(/^@/, "")}`;

export function getShopSocialLinks(shop: ShopSocialSource): ShopSocialLink[] {
  const phone = cleanWhatsappPhone(shop.whatsappPhone);
  const links: (ShopSocialLink | null)[] = [
    phone ? { key: "whatsapp", name: "WhatsApp", url: `https://wa.me/${phone}` } : null,
    shop.instagram
      ? { key: "instagram", name: "Instagram", url: formatSocialUrl(shop.instagram, "https://instagram.com/") }
      : null,
    shop.tiktok
      ? { key: "tiktok", name: "TikTok", url: formatSocialUrl(shop.tiktok, "https://tiktok.com/@") }
      : null,
    shop.linkedin
      ? { key: "linkedin", name: "LinkedIn", url: formatSocialUrl(shop.linkedin, "https://linkedin.com/in/") }
      : null,
    shop.twitter
      ? { key: "twitter", name: "Twitter", url: formatSocialUrl(shop.twitter, "https://x.com/") }
      : null,
    shop.facebook
      ? { key: "facebook", name: "Facebook", url: formatSocialUrl(shop.facebook, "https://facebook.com/") }
      : null,
    shop.youtube
      ? { key: "youtube", name: "YouTube", url: formatSocialUrl(shop.youtube, "https://youtube.com/") }
      : null,
  ];
  return links.filter((l): l is ShopSocialLink => l !== null);
}
