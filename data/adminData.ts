import { Users, Layers, ShoppingBag, ShieldCheck } from "lucide-react";
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
    id: "stats",
    label: "Statistika",
    icon: Layers,
  },
];

export const DEFAULT_ADMIN_STATS: AdminDashboardStats = {
  totalCustomers: 0,
  totalProducts: 0,
  totalStaff: 0,
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
    key: "totalStaff" as keyof AdminDashboardStats,
    label: "İnzibatçılar (Staff)",
    icon: ShieldCheck,
    bgClass: "bg-amber-50 text-amber-600",
  },
];
