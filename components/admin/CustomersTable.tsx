"use client";

import React from "react";
import { Users, Search } from "lucide-react";
import { CustomersTableProps } from "@/types";
import { Table, ColumnDefinition } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { AvatarImage } from "@/components/ui/AvatarImage";

const TABLE_COLUMNS: ColumnDefinition[] = [
  { header: "Müştəri" },
  { header: "Mağaza Adı" },
  { header: "İstifadəçi Adı" },
  { header: "Məhsul Sayı" },
  { header: "Qeydiyyat Tarixi" },
];

export const CustomersTable: React.FC<CustomersTableProps> = ({
  customers,
  searchQuery,
  onSearchChange,
}) => {
  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.shopName && c.shopName.toLowerCase().includes(q)) ||
      (c.username && c.username.toLowerCase().includes(q))
    );
  });

  const emptyState = (
    <div className="p-12 text-center flex flex-col items-center gap-2">
      <Users size={36} className="text-gray-300" />
      <p className="text-sm font-bold text-gray-600">Müştəri tapılmadı</p>
      <p className="text-xs text-gray-400">Axtarışa uyğun və ya qeydiyyatdan keçmiş istifadəçi yoxdur.</p>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden flex flex-col">
      <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-gray-900 text-base">Qeydiyyatdan Keçmiş Müştərilər</h3>
          <p className="text-xs text-gray-400 mt-0.5">Platformadakı istifadəçilərin siyahısı</p>
        </div>

        <div className="w-full sm:w-72">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Ad, email, mağaza ilə axtar..."
            icon={<Search size={16} />}
            className="!rounded-full !py-2.5 !text-xs"
          />
        </div>
      </div>

      <Table
        columns={TABLE_COLUMNS}
        isEmpty={filteredCustomers.length === 0}
        emptyState={emptyState}
      >
        {filteredCustomers.map((customer) => (
          <tr key={customer.id} className="hover:bg-gray-50/60 transition-colors">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <AvatarImage
                  src={customer.image}
                  alt={customer.name || "Customer"}
                  size={36}
                  fallbackInitials={customer.name ? customer.name[0] : "U"}
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-gray-900 truncate">
                    {customer.name || "Adsız"}
                  </span>
                  <span className="text-xs text-gray-400 truncate">{customer.email}</span>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 font-semibold text-gray-700">
              {customer.shopName || (
                <span className="text-xs text-gray-300 italic">Təyin edilməyib</span>
              )}
            </td>
            <td className="px-6 py-4">
              {customer.username ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1a7a4a] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  @{customer.username}
                </span>
              ) : (
                <span className="text-xs text-gray-300 italic">—</span>
              )}
            </td>
            <td className="px-6 py-4">
              <span className="font-bold text-gray-800 text-xs bg-gray-100 px-2.5 py-1 rounded-full">
                {customer.productCount} məhsul
              </span>
            </td>
            <td className="px-6 py-4 text-xs text-gray-500">
              {new Date(customer.createdAt).toLocaleDateString("az-AZ", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

export default CustomersTable;
