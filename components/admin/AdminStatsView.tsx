"use client";

import React from "react";
import { StaffUser } from "@/types";

export interface AdminStatsViewProps {
  currentStaff: StaffUser | null;
}

export const AdminStatsView: React.FC<AdminStatsViewProps> = ({ currentStaff }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 flex flex-col gap-6 shadow-xs">
      <h3 className="font-extrabold text-gray-900 text-lg">Sistem İcmalı</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col gap-2">
          <span className="text-xs text-gray-400 font-semibold uppercase">Platforma</span>
          <p className="text-lg font-bold text-gray-800">Belink E-Ticarət</p>
          <span className="text-xs text-emerald-600 font-medium">Bütün xidmətlər aktivdir</span>
        </div>
        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col gap-2">
          <span className="text-xs text-gray-400 font-semibold uppercase">Admin İcazəsi</span>
          <p className="text-lg font-bold text-gray-800">{currentStaff?.role}</p>
          <span className="text-xs text-gray-500 truncate">{currentStaff?.email}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsView;
