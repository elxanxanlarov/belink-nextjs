export type DashboardTab = "products" | "profile";

export interface DashboardProduct {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  description?: string | null;
  userId: string;
  createdAt: string | Date;
}

export interface ProductFormData {
  title: string;
  price: number | string;
  imageUrl: string;
  description?: string;
}

export interface UserProfileData {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string | null;
  shopName?: string | null;
  bio?: string | null;
  whatsappPhone?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  youtube?: string | null;
  productCount?: number;
}
