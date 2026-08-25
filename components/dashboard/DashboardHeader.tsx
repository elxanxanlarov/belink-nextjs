"use client";

import React from "react";
import Link from "next/link";
import { Plus, ExternalLink, ShoppingBag, User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { DashboardTab, UserProfileData } from "@/types";
import { AvatarImage } from "@/components/ui/AvatarImage";
import { confirmLogout } from "@/lib/swal";

export interface DashboardHeaderProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onOpenAddModal: () => void;
  profile: UserProfileData | null;
  productCount: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenAddModal,
  profile,
  productCount,
}) => {
  const handleLogout = async () => {
    const confirmed = await confirmLogout();
    if (confirmed) {
      signOut({ callbackUrl: "/" });
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30 px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-black text-[#1a7a4a] tracking-tight">
            belink
          </Link>

          <div className="hidden md:flex items-center bg-gray-100 p-1 rounded-2xl">
            <button
              onClick={() => onTabChange("products")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "products"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <ShoppingBag size={14} />
              Məhsullarım ({productCount})
            </button>
            <button
              onClick={() => onTabChange("profile")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <User size={14} />
              Profilim
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {profile?.username && (
            <Link
              href={`/${profile.username}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors"
            >
              <span className="hidden sm:inline">Mağazama Bax</span>
              <span className="sm:hidden">Mağaza</span>
              <ExternalLink size={13} />
            </Link>
          )}

          <button
            onClick={onOpenAddModal}
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a7a4a] hover:bg-[#156040] text-white font-bold text-xs shadow-md shadow-emerald-200 transition-all cursor-pointer"
          >
            <Plus size={16} /> Məhsul Əlavə Et
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
            <AvatarImage
              src={profile?.image}
              alt={profile?.name || "User"}
              size={34}
              fallbackInitials={profile?.name ? profile.name[0] : "U"}
            />
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Çıxış et"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
