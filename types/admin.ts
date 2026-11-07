export type StaffRole = "ADMIN" | "SUPERADMIN";

export type AdminTabType = "customers" | "etiraf" | "homeShops" | "stats";

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
  isFeatured: boolean;
  isPremium: boolean;
  shopTemplate?: string;
  featuredOrder: number | null;
  productCount: number;
  etirafCount: number;
  createdAt: string;
}

export interface AdminDashboardStats {
  totalCustomers: number;
  totalProducts: number;
  totalStaff: number;
  totalEtirafs: number;
}

export interface EtirafInviteItem {
  id: string;
  token: string;
  url: string;
  allowPhotos: boolean;
  allowText: boolean;
  allowAudio: boolean;
  allowMusic: boolean;
  packageId: string | null;
  maxPhotos: number;
  note: string | null;
  usedAt: string | null;
  createdAt: string;
  etiraf: {
    id: string;
    slug: string;
    title: string | null;
    cover: string | null;
    createdAt: string;
    user: { id: string; name: string | null; email: string | null; image: string | null };
  } | null;
}

export interface CustomerEtirafItem {
  id: string;
  slug: string;
  title: string | null;
  cover: string | null;
  photoCount: number;
  hasMessage: boolean;
  hasAudio: boolean;
  hasMusic: boolean;
  design: string;
  createdAt: string;
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
  onTogglePremium: (id: string, isPremium: boolean) => void;
  onShowEtirafs: (customer: CustomerUserItem) => void;
}

export interface FeaturedShopsManagerProps {
  customers: CustomerUserItem[];
  onChange: (orderedIds: string[]) => void;
}
