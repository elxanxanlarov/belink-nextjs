import { Link2, ShoppingBag, ShoppingCart, MessageCircle, Palette, Zap } from "lucide-react";
import InstagramIcon from "@/assets/icons/InstagramIcon";
import { FeatureItem, AvatarItem, SocialLinkItem, ProductItem, CartItem } from "@/types";

export const features: FeatureItem[] = [
  {
    icon: <Link2 size={28} className="text-[#1a7a4a]" />,
    title: "Şəxsi Link",
    desc: "belink.az/username ilə öz səhifən hazır olur.",
  },
  {
    icon: <ShoppingBag size={28} className="text-[#1a7a4a]" />,
    title: "Məhsullarını Paylaş",
    desc: "Məhsul əlavə et, qiymət, şəkil və açıqlama yaz.",
  },
  {
    icon: <ShoppingCart size={28} className="text-[#1a7a4a]" />,
    title: "Səbət Sistemi",
    desc: "Müştərilər məhsulları səbətə əlavə edib sifariş etsin.",
  },
  {
    icon: <MessageCircle size={28} className="text-[#1a7a4a]" />,
    title: "WhatsApp Sifariş",
    desc: "Sifarişlər birbaşa WhatsApp üzərindən sənə gəlsin.",
  },
  {
    icon: <Palette size={28} className="text-[#1a7a4a]" />,
    title: "Öz Səhifəni Özəlləşdir",
    desc: "Rəng, tema və görünüşü öz arzuna uyğunlaşdır.",
  },
];

export const avatars: AvatarItem[] = [
  { initials: "AH", bg: "bg-emerald-500" },
  { initials: "LM", bg: "bg-teal-400" },
  { initials: "RK", bg: "bg-green-600" },
  { initials: "SB", bg: "bg-emerald-700" },
];

export const socialLinks: SocialLinkItem[] = [
  { icon: <InstagramIcon size={22} />, label: "Instagram" },
  { icon: <MessageCircle size={22} />, label: "WhatsApp" },
  { icon: <Zap size={22} />, label: "TikTok" },
];

export const products: ProductItem[] = [
  { name: "Nike Sweatshirt", price: "35 AZN", emoji: "👕" },
  { name: "Smart Watch", price: "80 AZN", emoji: "⌚" },
  { name: "Dəri Çanta", price: "55 AZN", emoji: "👜" },
  { name: "Spiderman Bot", price: "45 AZN", emoji: "👟" },
];

export const cartItems: CartItem[] = [
  { name: "Nike Sweatshirt", price: "35 AZN" },
  { name: "Smart Watch", price: "80 AZN" },
];

