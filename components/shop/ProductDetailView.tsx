"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Minus,
  Plus,
  Share2,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { AvatarImage } from "@/components/ui/AvatarImage";
import { useShopCart } from "@/lib/useShopCart";
import { buildSingleOrderUrl } from "@/lib/shopOrder";
import { showToast } from "@/lib/swal";
import type { ShopProduct, ShopSummary } from "@/types";

interface ProductDetailViewProps {
  shop: ShopSummary;
  product: ShopProduct;
  otherProducts: ShopProduct[];
  /** Mağaza səhifəsinin yolu; nümunə mağazada şablon səhifəsi. */
  shopHref?: string;
  /** Nümunə mağaza: sifariş göndərilmir. */
  isDemo?: boolean;
}

export default function ProductDetailView({
  shop,
  product,
  otherProducts,
  shopHref,
  isDemo = false,
}: ProductDetailViewProps) {
  const { cart, totalItemsCount, addToCart, updateQuantity } = useShopCart(shop.username);
  const [activeIdx, setActiveIdx] = useState(0);

  const shopUrl = shopHref ?? `/${shop.username}`;
  const shopTitle = shop.shopName || shop.name || `@${shop.username}`;
  const cartQuantity = cart[product.id]?.quantity ?? 0;

  const allImages = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
  const prev = () => setActiveIdx((i) => (i === 0 ? allImages.length - 1 : i - 1));
  const next = () => setActiveIdx((i) => (i === allImages.length - 1 ? 0 : i + 1));

  const handleOrder = () => {
    if (isDemo) {
      showToast("Bu nümunə mağazadır, sifariş göndərilmir", "info");
      return;
    }
    window.open(buildSingleOrderUrl(product, shop.username, shop.whatsappPhone), "_blank");
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.title, text: `${product.title} — ${product.price} AZN`, url });
      } catch {
        // İstifadəçi paylaşımı ləğv etdi.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link kopyalandı", "success");
    } catch {
      showToast("Linki kopyalamaq mümkün olmadı", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pb-16">
      <header className="w-full bg-white border-b border-gray-100 py-3.5 px-4 sm:px-8 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <Link href="/" className="text-xl font-black text-[#1a7a4a] tracking-tight">
            belink
          </Link>
          {totalItemsCount > 0 && (
            <Link
              href={shopUrl}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#1a7a4a] hover:bg-[#156040] px-3.5 py-1.5 rounded-full transition-all shadow-xs"
            >
              <ShoppingBag size={14} /> Səbətə bax ({totalItemsCount})
            </Link>
          )}
        </div>
      </header>

      <main className="w-full max-w-4xl px-3 sm:px-4 py-6 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            href={shopUrl}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#1a7a4a] transition-colors"
          >
            <ArrowLeft size={15} /> Mağazaya qayıt
          </Link>
          <Link href={shopUrl} className="flex items-center gap-2 min-w-0">
            <AvatarImage
              src={shop.image}
              alt={shopTitle}
              size={28}
              fallbackInitials={shopTitle.replace(/^@/, "")[0]?.toUpperCase()}
            />
            <span className="text-xs font-bold text-gray-900 truncate">{shopTitle}</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-4 sm:p-6 shadow-xs grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-3 min-w-0">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image
                src={allImages[activeIdx]}
                alt={product.title}
                fill
                unoptimized
                priority
                className="object-contain"
              />

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    aria-label="Əvvəlki şəkil"
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md text-gray-700 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Növbəti şəkil"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md text-gray-700 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                    {allImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIdx(i)}
                        aria-label={`Şəkil ${i + 1}`}
                        className={`rounded-full transition-all cursor-pointer ${
                          i === activeIdx
                            ? "w-4 h-1.5 bg-[#1a7a4a]"
                            : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      i === activeIdx
                        ? "border-[#1a7a4a] shadow-sm"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Image src={img} alt={`Şəkil ${i + 1}`} fill unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 min-w-0">
            <div className="flex flex-col gap-2">
              {product.category && (
                <span className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                  <Tag size={12} /> {product.category.name}
                </span>
              )}
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight break-words">
                {product.title}
              </h1>
              <span className="text-2xl font-black text-[#1a7a4a]">{product.price} AZN</span>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 mb-2">Məhsul haqqında</h2>
              {product.description ? (
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line break-words">
                  {product.description}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">Ətraflı məlumat yoxdur.</p>
              )}
            </div>

            <div className="flex flex-col gap-2.5 pt-4 border-t border-gray-100 md:mt-auto">
              {cartQuantity > 0 ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2.5">
                  <button
                    onClick={() => updateQuantity(product.id, -1)}
                    aria-label="Azalt"
                    className="w-8 h-8 rounded-full bg-white text-[#1a7a4a] flex items-center justify-center shadow-xs hover:bg-emerald-100 cursor-pointer"
                  >
                    <Minus size={16} strokeWidth={2.5} />
                  </button>
                  <span className="text-sm font-bold text-[#1a7a4a]">Səbətdə: {cartQuantity} ədəd</span>
                  <button
                    onClick={() => updateQuantity(product.id, 1)}
                    aria-label="Artır"
                    className="w-8 h-8 rounded-full bg-[#1a7a4a] text-white flex items-center justify-center shadow-xs hover:bg-[#156040] cursor-pointer"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(product)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#1a7a4a] font-bold text-sm transition-colors cursor-pointer border border-emerald-200"
                >
                  <Plus size={16} strokeWidth={2.5} /> Səbətə at
                </button>
              )}

              <button
                onClick={handleOrder}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#1a7a4a] hover:bg-[#156040] text-white font-bold text-sm shadow-md shadow-emerald-200 transition-all cursor-pointer"
              >
                <MessageCircle size={18} /> WhatsApp ilə sifariş et
              </button>

              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm transition-colors cursor-pointer border border-gray-200"
              >
                <Share2 size={16} /> Paylaş
              </button>
            </div>
          </div>
        </div>

        {otherProducts.length > 0 && (
          <section className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base font-extrabold text-gray-900">Mağazanın digər məhsulları</h2>
              <Link href={shopUrl} className="text-xs font-bold text-[#1a7a4a] hover:underline">
                Hamısına bax
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {otherProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`${shopUrl}/${item.id}`}
                  className="group bg-white rounded-3xl border border-gray-100 p-3 shadow-xs hover:shadow-md transition-all flex flex-col gap-2.5 min-w-0 overflow-hidden"
                >
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 bg-white/95 text-[#1a7a4a] font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-sm max-w-[100px] truncate">
                      {item.price} ₼
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm break-words line-clamp-2 leading-tight">
                      {item.title}
                    </h3>
                    {item.category && (
                      <p className="text-[11px] text-gray-400 mt-1 truncate">{item.category.name}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
