"use client";

import { useMemo, useState } from "react";
import { useShopCart } from "@/lib/useShopCart";
import { buildWhatsappUrl } from "@/lib/shopOrder";
import { getShopSocialLinks } from "@/lib/shopSocials";
import { showToast } from "@/lib/swal";
import type { ShopCategory, ShopPageData, ShopProduct } from "@/types";

export interface StorefrontCategory extends ShopCategory {
  cover: string;
  count: number;
}

export function useStorefront(user: ShopPageData, isDemo: boolean) {
  const cartState = useShopCart(user.username);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const shopUrl = `/${user.username}`;
  const shopTitle = user.shopName || user.name || `@${user.username}`;
  const socialLinks = useMemo(() => getShopSocialLinks(user), [user]);

  const categories = useMemo(() => {
    const map = new Map<string, StorefrontCategory>();
    for (const p of user.products) {
      if (!p.category) continue;
      const existing = map.get(p.category.id);
      if (existing) existing.count += 1;
      else map.set(p.category.id, { ...p.category, cover: p.imageUrl, count: 1 });
    }
    return Array.from(map.values());
  }, [user.products]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return user.products.filter(
      (p) =>
        (!activeCategoryId || p.categoryId === activeCategoryId) &&
        (!q || p.title.toLowerCase().includes(q) || Boolean(p.description?.toLowerCase().includes(q)))
    );
  }, [user.products, searchQuery, activeCategoryId]);

  const isFiltering = Boolean(searchQuery.trim() || activeCategoryId);

  const resetFilters = () => {
    setSearchQuery("");
    setActiveCategoryId(null);
  };

  /** Kateqoriyanı seçir və məhsullar bölməsinə sürüşdürür. */
  const selectCategory = (id: string | null) => {
    setActiveCategoryId(id);
    document.getElementById("mehsullar")?.scrollIntoView({ behavior: "smooth" });
  };

  /** Nümunə mağazada məhsulun ayrıca səhifəsi yoxdur. */
  const productHref = (product: ShopProduct) => (isDemo ? null : `${shopUrl}/${product.id}`);

  const contactUrl = isDemo
    ? null
    : buildWhatsappUrl(user.whatsappPhone, `Salam! belink.az/${user.username} mağazanızla bağlı sualım var.`);

  const checkout = () => {
    const { cartList, totalPrice } = cartState;
    if (cartList.length === 0) return;
    if (isDemo) {
      showToast("Bu nümunə mağazadır, sifariş göndərilmir", "info");
      return;
    }
    const itemsText = cartList
      .map(
        (item, index) =>
          `${index + 1}. ${item.product.title} - ${item.quantity} ədəd x ${item.product.price} AZN = ${(item.product.price * item.quantity).toFixed(2)} AZN`
      )
      .join("\n");
    const message = `Salam! Sizin belink.az/${user.username} mağazanızdan sifariş vermək istəyirəm:\n\n🛒 Səbətdəki Məhsullar:\n${itemsText}\n\n💵 Cəmi Məbləğ: ${totalPrice.toFixed(2)} AZN\n\nZəhmət olmasa sifarişi təsdiqləyin.`;
    window.open(buildWhatsappUrl(user.whatsappPhone, message), "_blank");
  };

  return {
    ...cartState,
    user,
    isDemo,
    shopTitle,
    socialLinks,
    categories,
    filteredProducts,
    isFiltering,
    searchQuery,
    setSearchQuery,
    activeCategoryId,
    setActiveCategoryId,
    selectCategory,
    resetFilters,
    productHref,
    contactUrl,
    checkout,
    isCartOpen,
    setIsCartOpen,
  };
}

export type Storefront = ReturnType<typeof useStorefront>;
