"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { showToast } from "@/lib/swal";
import type { ShopCart, ShopProduct } from "@/types";

const EMPTY_CART: ShopCart = {};
const carts = new Map<string, ShopCart>();
const listeners = new Set<() => void>();

const storageKey = (username: string) => `belink_cart_${username}`;

function readCart(key: string): ShopCart {
  const cached = carts.get(key);
  if (cached) return cached;

  let cart = EMPTY_CART;
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      cart = parsed as ShopCart;
    }
  } catch {
    cart = EMPTY_CART;
  }
  carts.set(key, cart);
  return cart;
}

function writeCart(key: string, cart: ShopCart) {
  carts.set(key, cart);
  try {
    window.localStorage.setItem(key, JSON.stringify(cart));
  } catch {
    // storage əlçatan deyilsə səbət yalnız yaddaşda qalır
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key) carts.delete(e.key);
    else carts.clear();
    listener();
  };
  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useShopCart(username: string | null | undefined) {
  const key = storageKey(username || "");

  const cart = useSyncExternalStore(
    subscribe,
    () => readCart(key),
    () => EMPTY_CART
  );

  const addToCart = useCallback(
    (product: ShopProduct) => {
      const prev = readCart(key);
      const quantity = (prev[product.id]?.quantity ?? 0) + 1;
      writeCart(key, { ...prev, [product.id]: { product, quantity } });
      showToast(`"${product.title}" səbətə əlavə edildi`, "success");
    },
    [key]
  );

  const updateQuantity = useCallback(
    (productId: string, delta: number) => {
      const prev = readCart(key);
      const existing = prev[productId];
      if (!existing) return;
      const quantity = existing.quantity + delta;
      const next = { ...prev };
      if (quantity <= 0) delete next[productId];
      else next[productId] = { ...existing, quantity };
      writeCart(key, next);
    },
    [key]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      const next = { ...readCart(key) };
      delete next[productId];
      writeCart(key, next);
    },
    [key]
  );

  const cartList = useMemo(() => Object.values(cart), [cart]);
  const totalItemsCount = cartList.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartList.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return { cart, cartList, totalItemsCount, totalPrice, addToCart, updateQuantity, removeFromCart };
}
