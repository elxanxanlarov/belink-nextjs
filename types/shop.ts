export interface ShopCategory {
  id: string;
  name: string;
}

export interface ShopProduct {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  images?: string[];
  description?: string | null;
  categoryId?: string | null;
  category?: ShopCategory | null;
}

export interface ShopCartItem {
  product: ShopProduct;
  quantity: number;
}

export type ShopCart = Record<string, ShopCartItem>;

export type ShopLayout = "classic" | "boutique" | "showcase" | "catalog" | "bento";

export interface ShopPalette {
  id: string;
  name: string;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
  accentText: string;
}

export interface ShopTemplateShape {
  radius: string;
  buttonRadius: string;
  headingFont: string;
  headingTransform: "none" | "uppercase";
  headingSpacing: string;
}

export interface ShopTemplate {
  id: string;
  name: string;
  description: string;
  premium: boolean;
  layout: ShopLayout;
  shape: ShopTemplateShape;
  /** İlk palitra şablonun standart rəngidir. */
  palettes: ShopPalette[];
}

export interface ShopPageData {
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
  banners: string[];
  products: ShopProduct[];
}

export interface ShopSummary {
  username: string;
  shopName?: string | null;
  name?: string | null;
  image?: string | null;
  whatsappPhone?: string | null;
}
