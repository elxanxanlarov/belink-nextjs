"use client";

import React from "react";
import { Menu, RefreshCw } from "lucide-react";
import { AdminHeaderProps } from "@/types";

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  currentStaff,
  onRefresh,
  onToggleMobileMenu,
}) => {
  return (
    <header className="h-16 bg-white border-b border-gray-100 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600 cursor-pointer"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-extrabold text-gray-900">
          {activeTab === "customers" ? "Müştərilərin İdarə Edilməsi" : "Ümumi Statistika"}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          title="Yenilə"
          className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
        >
          <RefreshCw size={16} />
        </button>
        <span className="hidden sm:inline-block text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
          {currentStaff?.role || "ADMIN"}
        </span>
      </div>
    </header>
  );
};

export default AdminHeader;
