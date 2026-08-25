"use client";

import React from "react";
import Image from "next/image";
import { LogOut, X } from "lucide-react";
import { AdminSidebarProps } from "@/types";
import { ADMIN_NAV_ITEMS } from "@/data/adminData";

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  currentStaff,
  onLogout,
  mobileOpen,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-100 p-6 flex-shrink-0 justify-between">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center p-1.5 shadow-sm relative overflow-hidden">
              <Image src="/favicon.png" alt="belink" width={24} height={24} className="object-contain" priority />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight">belink</h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Admin Panel
              </span>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all text-left cursor-pointer ${
                    isActive
                      ? "bg-[#1a7a4a] text-white shadow-md shadow-emerald-100"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="flex flex-col gap-3 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#1a7a4a] flex items-center justify-center font-bold text-xs">
              {currentStaff?.name ? currentStaff.name[0] : "A"}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-gray-900 truncate">
                {currentStaff?.name || "Admin"}
              </span>
              <span className="text-[11px] text-gray-400 truncate">{currentStaff?.email}</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-xs font-bold text-red-600 hover:bg-red-50 p-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            Çıxış et
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50" onClick={onCloseMobile} />
          <div className="relative w-64 bg-white h-full p-6 flex flex-col justify-between z-10">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-lg text-[#1a7a4a]">belink Admin</span>
                <button onClick={onCloseMobile} className="p-1 text-gray-400 cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex flex-col gap-2">
                {ADMIN_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        onCloseMobile();
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm ${
                        isActive ? "bg-[#1a7a4a] text-white" : "text-gray-700"
                      }`}
                    >
                      <Icon size={18} /> {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-xs font-bold text-red-600 p-2 cursor-pointer"
            >
              <LogOut size={16} /> Çıxış et
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
