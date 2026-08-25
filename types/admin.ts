export type StaffRole = "ADMIN" | "SUPERADMIN";

export type AdminTabType = "customers" | "stats";

export interface StaffUser {
  id: string;
  name?: string | null;
  email: string;
  role: StaffRole;
  createdAt?: string | Date;
}

export interface AdminSessionPayload {
  id: string;
  email: string;
  role: StaffRole;
  name?: string | null;
}

export interface CustomerUserItem {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string | null;
  shopName?: string | null;
  bio?: string | null;
  productCount: number;
  createdAt: string;
}

export interface AdminDashboardStats {
  totalCustomers: number;
  totalProducts: number;
  totalStaff: number;
}

export interface AdminLoginFormProps {
  secretId: string;
  onSuccess: (user: StaffUser) => void;
}

export interface AdminSidebarProps {
  activeTab: AdminTabType;
  onTabChange: (tab: AdminTabType) => void;
  currentStaff: StaffUser | null;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export interface AdminHeaderProps {
  activeTab: AdminTabType;
  currentStaff: StaffUser | null;
  onRefresh: () => void;
  onToggleMobileMenu: () => void;
}

export interface AdminStatsProps {
  stats: AdminDashboardStats;
}

export interface CustomersTableProps {
  customers: CustomerUserItem[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}
