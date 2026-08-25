"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MessageCircle,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  X,
  Share2,
  Check,
  Search,
} from "lucide-react";
import { AvatarImage } from "@/components/ui/AvatarImage";
import ImagePreviewModal from "@/components/modals/ImagePreviewModal";
import { showToast } from "@/lib/swal";
import {
  InstagramIcon,
  TikTokIcon,
  LinkedInIcon,
  TwitterIcon,
  FacebookIcon,
  YouTubeIcon,
  WhatsAppIcon,
} from "@/assets/icons";

interface CategoryItem {
  id: string;
  name: string;
}

interface ProductItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  description?: string | null;
  categoryId?: string | null;
  category?: CategoryItem | null;
}

interface UserShopData {
  id: string;
  name?: string | null;
  username?: string | null;
  shopName?: string | null;
  bio?: string | null;
  image?: string | null;
  whatsappPhone?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  youtube?: string | null;
  products: ProductItem[];
}

interface CartItem {
  product: ProductItem;
  quantity: number;
}

export default function PublicShopView({ user }: { user: UserShopData }) {
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const rawPhone = user.whatsappPhone || "";
  const cleanPhone = rawPhone.replace(/[^0-9]/g, "");

  const categories = useMemo<CategoryItem[]>(() => {
    const map = new Map<string, CategoryItem>();
    for (const p of user.products) {
      if (p.category) {
        map.set(p.category.id, p.category);
      }
    }
    return Array.from(map.values());
  }, [user.products]);

  const filteredProducts = useMemo(() => {
    let result = user.products;

    if (activeCategoryId) {
      result = result.filter((p) => p.categoryId === activeCategoryId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    return result;
  }, [user.products, searchQuery, activeCategoryId]);

  const addToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev[product.id];
      const newQty = existing ? existing.quantity + 1 : 1;
      return { ...prev, [product.id]: { product, quantity: newQty } };
    });
    showToast(`"${product.title}" səbətə əlavə edildi`, "success");
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const existing = prev[productId];
      if (!existing) return prev;
      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: { ...existing, quantity: newQty } };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const cartList = Object.values(cart);
  const totalItemsCount = cartList.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartList.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: user.shopName || user.name || "Belink Mağaza", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast("Mağaza linki kopyalandı", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSingleOrder = (product: ProductItem) => {
    const text = encodeURIComponent(
      `Salam! "${product.title}" məhsulu haqqında sifariş vermək istəyirəm.\n\nQiymət: ${product.price} AZN\nMağaza: belink.az/${user.username}`
    );
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${text}`
      : `https://wa.me/?text=${text}`;
    window.open(waUrl, "_blank");
  };

  const handleCheckoutCart = () => {
    if (cartList.length === 0) return;

    let itemsText = cartList
      .map(
        (item, index) =>
          `${index + 1}. ${item.product.title} - ${item.quantity} ədəd x ${item.product.price} AZN = ${(item.product.price * item.quantity).toFixed(2)} AZN`
      )
      .join("\n");

    const message = `Salam! Sizin belink.az/${user.username} mağazanızdan sifariş vermək istəyirəm:\n\n🛒 Səbətdəki Məhsullar:\n${itemsText}\n\n💵 Cəmi Məbləğ: ${totalPrice.toFixed(2)} AZN\n\nZəhmət olmasa sifarişi təsdiqləyin.`;

    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  const formatSocialUrl = (url: string, prefix: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${prefix}${url.replace(/^@/, "")}`;
  };

  const socialLinks = [
    { name: "WhatsApp", icon: <WhatsAppIcon size={16} className="text-emerald-600" />, url: cleanPhone ? `https://wa.me/${cleanPhone}` : null, color: "hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200" },
    { name: "Instagram", icon: <InstagramIcon size={16} className="text-pink-600" />, url: user.instagram ? formatSocialUrl(user.instagram, "https://instagram.com/") : null, color: "hover:text-pink-600 hover:bg-pink-50 border-pink-100" },
    { name: "TikTok", icon: <TikTokIcon size={16} className="text-gray-900" />, url: user.tiktok ? formatSocialUrl(user.tiktok, "https://tiktok.com/@") : null, color: "hover:text-black hover:bg-gray-100 border-gray-200" },
    { name: "LinkedIn", icon: <LinkedInIcon size={16} className="text-blue-600" />, url: user.linkedin ? formatSocialUrl(user.linkedin, "https://linkedin.com/in/") : null, color: "hover:text-blue-600 hover:bg-blue-50 border-blue-100" },
    { name: "Twitter", icon: <TwitterIcon size={16} className="text-gray-900" />, url: user.twitter ? formatSocialUrl(user.twitter, "https://x.com/") : null, color: "hover:text-black hover:bg-gray-100 border-gray-200" },
    { name: "Facebook", icon: <FacebookIcon size={16} className="text-blue-700" />, url: user.facebook ? formatSocialUrl(user.facebook, "https://facebook.com/") : null, color: "hover:text-blue-700 hover:bg-blue-50 border-blue-100" },
    { name: "YouTube", icon: <YouTubeIcon size={16} className="text-red-600" />, url: user.youtube ? formatSocialUrl(user.youtube, "https://youtube.com/") : null, color: "hover:text-red-600 hover:bg-red-50 border-red-100" },
  ].filter((s) => Boolean(s.url));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pb-24 select-none">
      {previewImage && (
        <ImagePreviewModal
          isOpen={Boolean(previewImage)}
          onClose={() => setPreviewImage(null)}
          imageUrl={previewImage}
          altText={user.shopName || user.name || "Şəkil"}
        />
      )}

      <header className="w-full bg-white border-b border-gray-100 py-3.5 px-4 sm:px-8 sticky top-0 z-30 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black text-[#1a7a4a] tracking-tight">
            belink
          </Link>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#1a7a4a] bg-gray-50 hover:bg-emerald-50 px-3 py-1.5 rounded-full border border-gray-200 transition-all cursor-pointer"
              title="Paylaş"
            >
              {copied ? <Check size={14} className="text-[#1a7a4a]" /> : <Share2 size={14} />}
              <span className="hidden sm:inline">Paylaş</span>
            </button>
            <Link
              href="/"
              className="text-xs font-bold text-white bg-[#1a7a4a] hover:bg-[#156040] px-3.5 py-1.5 rounded-full transition-all shadow-xs"
            >
              Öz mağazanı yarat
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full max-w-2xl px-3 sm:px-4 py-6 flex flex-col gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-7 flex flex-col items-center text-center gap-3.5 shadow-xs">
          <div
            onClick={() => user.image && setPreviewImage(user.image)}
            className="cursor-pointer hover:scale-105 transition-transform"
          >
            <AvatarImage
              src={user.image}
              alt={user.shopName || user.name || "Mağaza"}
              size={84}
              fallbackInitials={user.shopName ? user.shopName[0] : user.name ? user.name[0] : "B"}
              className="border-2 border-emerald-100 shadow-md"
            />
          </div>

          <div className="flex flex-col gap-0.5 min-w-0 max-w-full">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight break-words max-w-full">
              {user.shopName || user.name || `@${user.username}`}
            </h1>
            <span className="text-xs font-bold text-[#1a7a4a] truncate max-w-full">
              @{user.username}
            </span>
          </div>

          {user.bio && (
            <p className="text-xs sm:text-sm text-gray-600 max-w-md leading-relaxed whitespace-pre-line break-words max-w-full">
              {user.bio}
            </p>
          )}

          {socialLinks.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-gray-50 w-full">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold text-gray-700 bg-gray-50 transition-all ${social.color}`}
                >
                  {social.icon}
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-extrabold text-gray-900">
              Məhsullar ({user.products.length})
            </h2>
            {totalItemsCount > 0 && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-xs font-bold text-[#1a7a4a] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ShoppingBag size={14} /> Səbətə bax ({totalItemsCount})
              </button>
            )}
          </div>

          {user.products.length > 0 && (
            <div className="relative w-full">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Mağazada axtarış..."
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1a7a4a] focus:ring-1 focus:ring-[#1a7a4a] transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {categories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setActiveCategoryId(null)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  activeCategoryId === null
                    ? "bg-[#1a7a4a] text-white border-[#1a7a4a] shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#1a7a4a] hover:text-[#1a7a4a]"
                }`}
              >
                Hamısı
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() =>
                    setActiveCategoryId((prev) => (prev === cat.id ? null : cat.id))
                  }
                  className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    activeCategoryId === cat.id
                      ? "bg-[#1a7a4a] text-white border-[#1a7a4a] shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#1a7a4a] hover:text-[#1a7a4a]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {user.products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center flex flex-col items-center gap-3">
              <ShoppingBag size={32} className="text-gray-300" />
              <p className="text-sm font-bold text-gray-600">Məhsul yoxdur</p>
              <p className="text-xs text-gray-400">Bu mağazada hələ məhsul əlavə edilməyib.</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center flex flex-col items-center gap-2">
              <Search size={24} className="text-gray-300" />
              <p className="text-xs font-bold text-gray-700">
                {searchQuery
                  ? `"${searchQuery}" üzrə məhsul tapılmadı`
                  : "Bu kateqoriyada məhsul yoxdur"}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategoryId(null);
                }}
                className="text-xs text-[#1a7a4a] font-bold hover:underline cursor-pointer"
              >
                Hamısını göstər
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {filteredProducts.map((product) => {
                const inCart = cart[product.id];
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl border border-gray-100 p-3 sm:p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-2.5 group min-w-0 overflow-hidden"
                  >
                    <div className="flex flex-col gap-2.5 min-w-0">
                      <div
                        onClick={() => setPreviewImage(product.imageUrl)}
                        className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center cursor-pointer"
                      >
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 right-2 bg-white/95 text-[#1a7a4a] font-extrabold text-[11px] sm:text-xs px-2.5 py-1 rounded-full shadow-sm max-w-[100px] truncate">
                          {product.price} ₼
                        </span>
                        {product.category && (
                          <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full truncate max-w-[90%]">
                            {product.category.name}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 text-xs sm:text-sm break-words line-clamp-2 leading-tight">
                          {product.title}
                        </h3>
                        {product.description && (
                          <p className="text-[11px] text-gray-400 mt-1 line-clamp-1 break-words">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 pt-1">
                      {inCart ? (
                        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-full px-2 py-1">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            className="w-6 h-6 rounded-full bg-white text-[#1a7a4a] flex items-center justify-center shadow-xs hover:bg-emerald-100 cursor-pointer"
                          >
                            <Minus size={13} strokeWidth={2.5} />
                          </button>
                          <span className="text-xs font-bold text-[#1a7a4a]">{inCart.quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="w-6 h-6 rounded-full bg-[#1a7a4a] text-white flex items-center justify-center shadow-xs hover:bg-[#156040] cursor-pointer"
                          >
                            <Plus size={13} strokeWidth={2.5} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full flex items-center justify-center gap-1 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#1a7a4a] font-bold text-[11px] sm:text-xs transition-colors cursor-pointer border border-emerald-100"
                        >
                          <Plus size={13} strokeWidth={2.5} /> Səbətə at
                        </button>
                      )}

                      <button
                        onClick={() => handleSingleOrder(product)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-full bg-[#1a7a4a] hover:bg-[#156040] text-white font-bold text-[11px] sm:text-xs shadow-xs transition-all cursor-pointer"
                      >
                        <MessageCircle size={13} /> Sifariş Et
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {totalItemsCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-40 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="bg-gray-900 text-white rounded-3xl p-3.5 px-5 shadow-2xl flex items-center justify-between border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag size={22} className="text-emerald-400" />
                <span className="absolute -top-1.5 -right-2 bg-[#1a7a4a] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-gray-900">
                  {totalItemsCount}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium">{totalItemsCount} məhsul</span>
                <span className="text-sm font-black text-white">{totalPrice.toFixed(2)} AZN</span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#1a7a4a] hover:bg-[#156040] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              Səbətə Bax
            </button>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-black/60 transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg p-5 sm:p-7 flex flex-col gap-4 max-h-[85vh] overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-[#1a7a4a]" size={20} />
                <h3 className="text-base font-extrabold text-gray-900">Səbətiniz</h3>
                <span className="text-xs font-bold text-gray-400">({totalItemsCount} ədəd)</span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-3 py-1 pr-1">
              {cartList.length === 0 ? (
                <div className="py-10 text-center flex flex-col items-center gap-2 text-gray-400">
                  <ShoppingBag size={32} />
                  <p className="text-xs font-semibold">Səbətiniz boşdur.</p>
                </div>
              ) : (
                cartList.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0">
                        <Image src={product.imageUrl} alt={product.title} fill unoptimized className="object-cover" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate">{product.title}</h4>
                        {product.category && (
                          <span className="text-[10px] text-gray-400">{product.category.name}</span>
                        )}
                        <span className="text-[11px] text-[#1a7a4a] font-bold">{product.price} AZN</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-1.5 py-0.5">
                        <button onClick={() => updateQuantity(product.id, -1)} className="w-5 h-5 rounded-full text-gray-600 hover:bg-gray-100 flex items-center justify-center cursor-pointer">
                          <Minus size={11} />
                        </button>
                        <span className="text-xs font-bold text-gray-800 px-1">{quantity}</span>
                        <button onClick={() => updateQuantity(product.id, 1)} className="w-5 h-5 rounded-full text-gray-600 hover:bg-gray-100 flex items-center justify-center cursor-pointer">
                          <Plus size={11} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="p-1.5 rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartList.length > 0 && (
              <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500">Cəmi Məbləğ:</span>
                  <span className="text-lg font-black text-[#1a7a4a]">{totalPrice.toFixed(2)} AZN</span>
                </div>

                <button
                  onClick={handleCheckoutCart}
                  className="w-full py-3.5 rounded-full bg-[#1a7a4a] hover:bg-[#156040] text-white font-bold text-sm shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle size={18} /> WhatsApp ilə Sifariş Et
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
