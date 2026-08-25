"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, Plus, User, ExternalLink } from "lucide-react";
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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-gray-100 flex md:hidden items-center justify-around px-2 py-2 safe-bottom">
      <button
        onClick={() => onTabChange("products")}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
          activeTab === "products" ? "text-[#1a7a4a]" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <ShoppingBag size={20} />
        <span>Məhsullar</span>
      </button>

      <button
        onClick={onOpenAddModal}
        className="w-11 h-11 rounded-full bg-[#1a7a4a] text-white flex items-center justify-center shadow-lg shadow-emerald-200 active:scale-95 transition-transform cursor-pointer"
      >
        <Plus size={22} />
      </button>

      <button
        onClick={() => onTabChange("profile")}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
          activeTab === "profile" ? "text-[#1a7a4a]" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <User size={20} />
        <span>Profil</span>
      </button>

      {username && (
        <Link
          href={`/${username}`}
          target="_blank"
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ExternalLink size={20} />
          <span>Mağazam</span>
        </Link>
      )}
    </div>
  );
};

export default BottomNav;
