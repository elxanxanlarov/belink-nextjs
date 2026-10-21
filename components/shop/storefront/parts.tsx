"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { AvatarImage } from "@/components/ui/AvatarImage";
import type { ShopSocialKey } from "@/lib/shopSocials";
import {
  InstagramIcon,
  TikTokIcon,
  LinkedInIcon,
  TwitterIcon,
  FacebookIcon,
  YouTubeIcon,
  WhatsAppIcon,
} from "@/assets/icons";
import type { ShopProduct } from "@/types";
import type { Storefront } from "./useStorefront";

export interface LayoutProps {
  sf: Storefront;
}

const SOCIAL_ICONS: Record<ShopSocialKey, React.ComponentType<{ size?: number; className?: string }>> = {
  whatsapp: WhatsAppIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  linkedin: LinkedInIcon,
  twitter: TwitterIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
};

const BANNER_INTERVAL_MS = 5000;

export const sfHeading =
  "[font-family:var(--sf-heading-font)] [text-transform:var(--sf-heading-transform)] [letter-spacing:var(--sf-heading-spacing)]";
const sfButton =
  "inline-flex items-center justify-center gap-2 min-h-11 px-6 font-bold text-sm whitespace-nowrap rounded-[var(--sf-btn-radius)] transition-[opacity,transform] duration-200 active:scale-[0.98] cursor-pointer";
export const sfBtnPrimary = `${sfButton} bg-[var(--sf-accent)] text-[var(--sf-accent-text)] hover:opacity-90`;
export const sfBtnOutline = `${sfButton} border border-[var(--sf-border)] text-[var(--sf-text)] hover:border-[var(--sf-accent)]`;
export const sfFocus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sf-accent)]";

export function ShopAvatar({ sf, size }: LayoutProps & { size: number }) {
  return (
    <AvatarImage
      src={sf.user.image}
      alt={sf.shopTitle}
      size={size}
      fallbackInitials={sf.shopTitle.replace(/^@/, "")[0]?.toUpperCase()}
    />
  );
}

/** Məhsul səhifəsinə link. */
export function ProductLink({
  sf,
  product,
  className,
  children,
}: LayoutProps & { product: ShopProduct; className?: string; children: React.ReactNode }) {
  const href = sf.productHref(product);
  return href ? (
    <Link href={href} className={`${className ?? ""} ${sfFocus}`}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  );
}

export function ProductImage({
  product,
  className = "",
  priority = false,
}: {
  product: ShopProduct;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={product.imageUrl}
      alt={product.title}
      fill
      unoptimized
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}

export function CartControl({
  sf,
  product,
  label = "Səbətə at",
  className = "",
}: LayoutProps & { product: ShopProduct; label?: string; className?: string }) {
  const inCart = sf.cart[product.id];

  if (inCart) {
    return (
      <div
        className={`flex items-center justify-between min-h-11 px-1 rounded-[var(--sf-btn-radius)] border border-[var(--sf-accent)] ${className}`}
      >
        <button
          onClick={() => sf.updateQuantity(product.id, -1)}
          aria-label="Azalt"
          className={`w-10 h-10 flex items-center justify-center text-[var(--sf-accent)] cursor-pointer ${sfFocus}`}
        >
          <Minus size={16} strokeWidth={2.5} />
        </button>
        <span className="text-sm font-bold">{inCart.quantity}</span>
        <button
          onClick={() => sf.updateQuantity(product.id, 1)}
          aria-label="Artır"
          className={`w-10 h-10 flex items-center justify-center text-[var(--sf-accent)] cursor-pointer ${sfFocus}`}
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => sf.addToCart(product)} className={`${sfBtnPrimary} ${sfFocus} !px-4 ${className}`}>
      <Plus size={15} strokeWidth={2.5} /> {label}
    </button>
  );
}

export function CartButton({ sf, className = "" }: LayoutProps & { className?: string }) {
  return (
    <button
      onClick={() => sf.setIsCartOpen(true)}
      aria-label={`Səbət, ${sf.totalItemsCount} məhsul`}
      className={`relative shrink-0 inline-flex items-center gap-2 min-h-11 px-4 text-sm font-bold rounded-[var(--sf-btn-radius)] border border-[var(--sf-border)] hover:border-[var(--sf-accent)] transition-colors duration-200 cursor-pointer ${sfFocus} ${className}`}
    >
      <ShoppingBag size={17} />
      <span className="hidden sm:inline">Səbət</span>
      {sf.totalItemsCount > 0 && (
        <span className="min-w-5 h-5 px-1 rounded-full bg-[var(--sf-accent)] text-[var(--sf-accent-text)] text-[11px] font-black flex items-center justify-center">
          {sf.totalItemsCount}
        </span>
      )}
    </button>
  );
}

export function SearchField({ sf, className = "" }: LayoutProps & { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <label htmlFor="sf-search" className="sr-only">
        Mağazada axtarış
      </label>
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sf-muted)] pointer-events-none"
      />
      <input
        id="sf-search"
        type="search"
        value={sf.searchQuery}
        onChange={(e) => sf.setSearchQuery(e.target.value)}
        placeholder="Məhsul axtar"
        className="w-full min-h-11 pl-10 pr-4 rounded-[var(--sf-btn-radius)] bg-[var(--sf-surface)] border border-[var(--sf-border)] text-sm text-[var(--sf-text)] placeholder:text-[var(--sf-muted)] focus:outline-none focus:border-[var(--sf-accent)] transition-colors duration-200"
      />
    </div>
  );
}

/** Məhsul olmayanda və ya axtarış nəticəsiz qalanda göstərilir; əks halda `null`. */
export function ProductsEmptyState({ sf }: LayoutProps) {
  if (sf.filteredProducts.length > 0) return null;
  const isEmptyShop = sf.user.products.length === 0;

  return (
    <div className="rounded-[var(--sf-radius)] border border-[var(--sf-border)] p-10 sm:p-14 text-center flex flex-col items-center gap-3">
      {isEmptyShop ? <ShoppingBag size={28} className="text-[var(--sf-muted)]" /> : <Search size={28} className="text-[var(--sf-muted)]" />}
      <p className="text-sm font-bold">
        {isEmptyShop ? "Bu mağazada hələ məhsul yoxdur" : "Axtarışa uyğun məhsul tapılmadı"}
      </p>
      {!isEmptyShop && (
        <button onClick={sf.resetFilters} className={`text-sm font-bold text-[var(--sf-accent)] hover:underline cursor-pointer ${sfFocus}`}>
          Bütün məhsulları göstər
        </button>
      )}
    </div>
  );
}

export function BannerSlider({
  banners,
  alt,
  className = "aspect-[16/9] md:aspect-[21/9]",
}: {
  banners: string[];
  alt: string;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = banners.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % count), BANNER_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [count, paused]);

  if (count === 0) return null;
  const current = Math.min(active, count - 1);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[var(--sf-radius)] bg-[var(--sf-surface)] ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {banners.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={index === current ? `${alt}, banner ${index + 1}` : ""}
          fill
          unoptimized
          priority={index === 0}
          className={`object-cover transition-opacity duration-700 ${index === current ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      {count > 1 && (
        <>
          <button
            onClick={() => setActive((current - 1 + count) % count)}
            aria-label="Əvvəlki banner"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors duration-200 cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setActive((current + 1) % count)}
            aria-label="Növbəti banner"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors duration-200 cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                aria-label={`Banner ${index + 1}`}
                aria-current={index === current}
                className="p-1.5 cursor-pointer"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    index === current ? "w-6 bg-white" : "w-1.5 bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ContactButton({
  sf,
  label,
  className = sfBtnOutline,
}: LayoutProps & { label: string; className?: string }) {
  const content = (
    <>
      <MessageCircle size={16} /> {label}
    </>
  );
  return sf.contactUrl ? (
    <a href={sf.contactUrl} target="_blank" rel="noopener noreferrer" className={`${className} ${sfFocus}`}>
      {content}
    </a>
  ) : (
    <span className={className}>{content}</span>
  );
}

export function SocialLinks({ sf, className = "" }: LayoutProps & { className?: string }) {
  if (sf.socialLinks.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {sf.socialLinks.map((social) => {
        const Icon = SOCIAL_ICONS[social.key];
        return (
          <a
            key={social.key}
            href={sf.isDemo ? undefined : social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 min-h-11 px-4 rounded-[var(--sf-btn-radius)] border border-[var(--sf-border)] text-xs font-bold hover:border-[var(--sf-accent)] transition-colors duration-200 ${sfFocus}`}
          >
            <Icon size={15} className="text-[var(--sf-accent)]" />
            {social.name}
          </a>
        );
      })}
    </div>
  );
}

export function StorefrontFooter({ sf, align = "center" }: LayoutProps & { align?: "center" | "left" }) {
  const isCenter = align === "center";
  return (
    <footer id="elaqe" className="scroll-mt-24 mt-auto border-t border-[var(--sf-border)]">
      <div
        className={`max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-6 ${
          isCenter ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"
        }`}
      >
        <div className={`flex flex-col gap-4 ${isCenter ? "items-center" : ""}`}>
          <span className={`text-lg font-extrabold ${sfHeading}`}>{sf.shopTitle}</span>
          <SocialLinks sf={sf} className={isCenter ? "justify-center" : ""} />
        </div>
        <p className="text-xs text-[var(--sf-muted)]">
          © {new Date().getFullYear()} {sf.shopTitle} ·{" "}
          <Link href="/" className={`font-bold hover:text-[var(--sf-text)] transition-colors duration-200 ${sfFocus}`}>
            Belink ilə hazırlanıb
          </Link>
        </p>
      </div>
    </footer>
  );
}

export function CartModal({ sf }: LayoutProps) {
  const { isCartOpen, setIsCartOpen } = sf;
  const close = () => setIsCartOpen(false);

  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCartOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60" onClick={close} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Səbət"
        className="relative z-10 w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col gap-4 p-5 sm:p-7 bg-[var(--sf-bg)] text-[var(--sf-text)] border border-[var(--sf-border)] rounded-t-[var(--sf-radius)] sm:rounded-[var(--sf-radius)] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[var(--sf-border)] pb-3">
          <h3 className={`text-lg font-extrabold ${sfHeading}`}>
            Səbət <span className="text-sm font-bold text-[var(--sf-muted)]">({sf.totalItemsCount})</span>
          </h3>
          <button
            onClick={close}
            aria-label="Səbəti bağla"
            className={`w-11 h-11 -mr-2 flex items-center justify-center text-[var(--sf-muted)] hover:text-[var(--sf-text)] transition-colors duration-200 cursor-pointer ${sfFocus}`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
          {sf.cartList.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center gap-3 text-[var(--sf-muted)]">
              <ShoppingBag size={28} />
              <p className="text-sm font-semibold">Səbətiniz boşdur. Bəyəndiyiniz məhsulu əlavə edin.</p>
            </div>
          ) : (
            sf.cartList.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-14 h-14 shrink-0 overflow-hidden rounded-[var(--sf-radius)] bg-[var(--sf-surface)]">
                    <ProductImage product={product} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h4 className="text-sm font-bold truncate">{product.title}</h4>
                    <span className="text-xs font-bold text-[var(--sf-accent)]">{product.price} AZN</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => sf.updateQuantity(product.id, -1)}
                    aria-label="Azalt"
                    className={`w-9 h-9 flex items-center justify-center cursor-pointer ${sfFocus}`}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-5 text-center text-sm font-bold">{quantity}</span>
                  <button
                    onClick={() => sf.updateQuantity(product.id, 1)}
                    aria-label="Artır"
                    className={`w-9 h-9 flex items-center justify-center cursor-pointer ${sfFocus}`}
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => sf.removeFromCart(product.id)}
                    aria-label={`${product.title} məhsulunu sil`}
                    className={`w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-500 transition-colors duration-200 cursor-pointer ${sfFocus}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {sf.cartList.length > 0 && (
          <div className="flex flex-col gap-3 pt-3 border-t border-[var(--sf-border)]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[var(--sf-muted)]">Cəmi</span>
              <span className="text-xl font-black">{sf.totalPrice.toFixed(2)} AZN</span>
            </div>
            <button onClick={sf.checkout} className={`${sfBtnPrimary} ${sfFocus} w-full`}>
              <MessageCircle size={18} /> WhatsApp ilə sifariş et
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
