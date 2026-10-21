import { ReactNode } from "react";

export interface FeatureItem {
  icon: ReactNode;
  title: string;
  desc: string;
}

export interface AvatarItem {
  initials: string;
  bg: string;
}

export interface SocialLinkItem {
  icon: ReactNode;
  label: string;
}

export interface ProductItem {
  name: string;
  price: string;
  emoji: string;
}

export interface CartItem {
  name: string;
  price: string;
}

export interface FeaturedShop {
  id: string;
  username: string;
  shopName?: string | null;
  name?: string | null;
  image?: string | null;
  bio?: string | null;
  productCount: number;
}
