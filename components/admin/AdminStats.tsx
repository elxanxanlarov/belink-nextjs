"use client";

import React from "react";
import { AdminStatsProps } from "@/types";
import { StatCard } from "@/components/ui/StatCard";
import { STAT_CARD_CONFIGS } from "@/data/adminData";

export const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STAT_CARD_CONFIGS.map((config) => {
        const Icon = config.icon;
        const value = stats[config.key] ?? 0;
        return (
          <StatCard
            key={config.key}
            title={config.label}
            value={value}
            icon={<Icon size={22} />}
            bgClass={config.bgClass}
          />
        );
      })}
    </div>
  );
};

export default AdminStats;
