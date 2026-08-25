import React from "react";

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  bgClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  bgClass = "bg-emerald-50 text-[#1a7a4a]",
}) => {
  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bgClass}`}>
        {icon}
      </div>
      <div>
        <span className="text-xs font-semibold text-gray-400">{title}</span>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
};
