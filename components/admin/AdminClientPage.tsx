"use client";

import React, { useEffect, useState } from "react";
import { AdminDashboardStats, AdminTabType, CustomerUserItem, StaffUser } from "@/types";
import { DEFAULT_ADMIN_STATS } from "@/data/adminData";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStats } from "@/components/admin/AdminStats";
import { CustomersTable } from "@/components/admin/CustomersTable";
import { AdminStatsView } from "@/components/admin/AdminStatsView";
import { confirmLogout } from "@/lib/swal";

export interface AdminClientPageProps {
  secretId: string;
}

export const AdminClientPage: React.FC<AdminClientPageProps> = ({ secretId }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<StaffUser | null>(null);
  const [customers, setCustomers] = useState<CustomerUserItem[]>([]);
  const [stats, setStats] = useState<AdminDashboardStats>(DEFAULT_ADMIN_STATS);

  const [activeTab, setActiveTab] = useState<AdminTabType>("customers");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const loadAdminData = async () => {
    try {
      setLoadingData(true);
      const res = await fetch("/api/admin/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
        setStats(data.stats || DEFAULT_ADMIN_STATS);
        setCurrentStaff(data.currentStaff || null);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleLoginSuccess = (user: StaffUser) => {
    setIsAuthenticated(true);
    setCurrentStaff(user);
    loadAdminData();
  };

  const handleLogout = async () => {
    const confirmed = await confirmLogout();
    if (!confirmed) return;

    await fetch("/api/admin/auth/logout", { method: "POST" });
    setIsAuthenticated(false);
    setCurrentStaff(null);
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/40 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1a7a4a] text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-emerald-100 animate-pulse">
            b
          </div>
          <div className="w-6 h-6 border-2 border-[#1a7a4a] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-gray-500">Yüklənir...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginForm secretId={secretId} onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentStaff={currentStaff}
        onLogout={handleLogout}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          activeTab={activeTab}
          currentStaff={currentStaff}
          onRefresh={loadAdminData}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <main className="p-4 sm:p-8 flex flex-col gap-6 max-w-7xl">
          <AdminStats stats={stats} />

          {activeTab === "customers" && (
            <CustomersTable
              customers={customers}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}

          {activeTab === "stats" && <AdminStatsView currentStaff={currentStaff} />}
        </main>
      </div>
    </div>
  );
};

export default AdminClientPage;
