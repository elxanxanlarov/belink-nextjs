"use client";

import React from "react";
import Link from "next/link";
import { Home, Plus, User, ExternalLink, ShoppingBag } from "lucide-react";
import { DashboardTab } from "@/types";

export interface BottomNavProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onOpenAddModal: () => void;
  username?: string | null;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenAddModal,
  username,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 flex md:hidden items-end justify-around px-2 pb-3 pt-1 safe-bottom shadow-lg select-none">
      {/* 1. Ana səhifə (Yönləndirir /) */}
      <Link
        href="/"
        className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-gray-400 hover:text-gray-600 transition-all"
      >
        <Home size={21} strokeWidth={1.8} />
        <span>Ana səhifə</span>
      </Link>

      {/* 2. Məhsullarım (Tab: products) */}
      <button
        onClick={() => onTabChange("products")}
        className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
          activeTab === "products"
            ? "text-[#1a7a4a]"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <ShoppingBag size={21} strokeWidth={activeTab === "products" ? 2.5 : 1.8} />
        <span>Məhsullarım</span>
      </button>

      {/* 3. Ortada + (Əlavə et modalı) */}
      <div className="relative flex flex-col items-center -mt-5">
        <button
          onClick={onOpenAddModal}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1a7a4a] to-[#0f5c37] text-white flex items-center justify-center shadow-xl shadow-emerald-300/60 active:scale-95 transition-all cursor-pointer border-4 border-white ring-2 ring-emerald-100"
          title="Məhsul əlavə et"
        >
          <Plus size={26} strokeWidth={2.8} />
        </button>
        <span className="text-[10px] font-bold text-[#1a7a4a] mt-1">Əlavə et</span>
      </div>

      {/* 4. Profilim (Tab: profile) */}
      <button
        onClick={() => onTabChange("profile")}
        className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
          activeTab === "profile"
            ? "text-[#1a7a4a]"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <User size={21} strokeWidth={activeTab === "profile" ? 2.5 : 1.8} />
        <span>Profilim</span>
      </button>

      {/* 5. Mağazam (Yönləndirir /:username) */}
      {username && (
        <Link
          href={`/${username}`}
          target="_blank"
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-gray-400 hover:text-[#1a7a4a] transition-all"
        >
          <ExternalLink size={21} strokeWidth={1.8} />
          <span>Mağazam</span>
        </Link>
      )}
    </div>
  );
};

export default BottomNav;
