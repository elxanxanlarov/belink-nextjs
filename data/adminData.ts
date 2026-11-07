import { Users, Layers, ShoppingBag, ShieldCheck, Store, Gift } from "lucide-react";
import { AdminDashboardStats, AdminTabType } from "@/types";

export interface NavItem {
  id: AdminTabType;
  label: string;
  icon: typeof Users;
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    id: "customers",
    label: "Müştərilər",
    icon: Users,
  },
  {
    id: "etiraf",
    label: "Etiraf",
    icon: Gift,
  },
  {
    id: "homeShops",
    label: "Ana səhifə mağazaları",
    icon: Store,
  },
  {
    id: "stats",
    label: "Statistika",
    icon: Layers,
  },
];

export const DEFAULT_ADMIN_STATS: AdminDashboardStats = {
  totalCustomers: 0,
  totalProducts: 0,
  totalStaff: 0,
  totalEtirafs: 0,
};

export const STAT_CARD_CONFIGS = [
  {
    key: "totalCustomers" as keyof AdminDashboardStats,
    label: "Ümumi Müştərilər",
    icon: Users,
    bgClass: "bg-emerald-50 text-[#1a7a4a]",
  },
  {
    key: "totalProducts" as keyof AdminDashboardStats,
    label: "Ümumi Məhsullar",
    icon: ShoppingBag,
    bgClass: "bg-teal-50 text-teal-700",
  },
  {
    key: "totalEtirafs" as keyof AdminDashboardStats,
    label: "Etiraflar",
    icon: Gift,
    bgClass: "bg-rose-50 text-rose-700",
  },
  {
    key: "totalStaff" as keyof AdminDashboardStats,
    label: "İnzibatçılar (Staff)",
    icon: ShieldCheck,
    bgClass: "bg-amber-50 text-amber-600",
  },
];

/** Hər bölmənin URL hissəsi: /admin-panel/{id}/{slug}. Müştərilər əsas ünvandır. */
export const ADMIN_TAB_SLUGS: Record<AdminTabType, string> = {
  customers: "",
  etiraf: "etiraf",
  homeShops: "magaza",
  stats: "statistika",
};

export function adminTabFromPath(pathname: string | null): AdminTabType {
  const last = pathname?.split("/").filter(Boolean)[2] ?? "";
  const entry = Object.entries(ADMIN_TAB_SLUGS).find(([, slug]) => slug === last);
  return (entry?.[0] as AdminTabType) ?? "customers";
}
