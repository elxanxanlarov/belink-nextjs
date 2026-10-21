"use client";

import React, { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Search, Store, Trash2, X } from "lucide-react";
import { getShopTitle } from "@/lib/shopTitle";
import { CustomerUserItem, FeaturedShopsManagerProps } from "@/types";
import { Input } from "@/components/ui/Input";
import { AvatarImage } from "@/components/ui/AvatarImage";

const shopTitle = (c: CustomerUserItem) => getShopTitle(c);

export const FeaturedShopsManager: React.FC<FeaturedShopsManagerProps> = ({ customers, onChange }) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const featured = useMemo(
    () =>
      customers
        .filter((c) => c.isFeatured)
        .sort((a, b) => (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity)),
    [customers]
  );

  const available = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return customers.filter(
      (c) =>
        !c.isFeatured &&
        c.username &&
        !c.username.startsWith("pending_") &&
        (!q ||
          c.username.toLowerCase().includes(q) ||
          (c.shopName && c.shopName.toLowerCase().includes(q)) ||
          (c.name && c.name.toLowerCase().includes(q)))
    );
  }, [customers, searchQuery]);

  const featuredIds = featured.map((c) => c.id);

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= featuredIds.length) return;
    const next = [...featuredIds];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const closePicker = () => {
    setPickerOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden flex flex-col">
      <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-gray-900 text-base">Ana Səhifədəki Mağazalar</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Mağazalar ana səhifədə buradakı sıra ilə göstərilir.
          </p>
        </div>

        <button
          onClick={() => setPickerOpen(true)}
          className="shrink-0 flex items-center gap-1.5 bg-[#1a7a4a] hover:bg-[#156040] text-white font-bold text-xs px-4 py-2.5 rounded-full transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span className="hidden sm:inline">Mağaza əlavə et</span>
        </button>
      </div>

      {featured.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center gap-2">
          <Store size={36} className="text-gray-300" />
          <p className="text-sm font-bold text-gray-600">Hələ mağaza seçilməyib</p>
          <p className="text-xs text-gray-400">
            Ana səhifədə göstərmək üçün “+” düyməsi ilə mağaza əlavə edin.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {featured.map((shop, index) => (
            <li key={shop.id} className="flex items-center gap-3 px-4 sm:px-6 py-3.5">
              <span className="w-7 h-7 shrink-0 rounded-full bg-emerald-50 text-[#1a7a4a] text-xs font-extrabold flex items-center justify-center border border-emerald-100">
                {index + 1}
              </span>
              <AvatarImage
                src={shop.image}
                alt={shopTitle(shop)}
                size={36}
                fallbackInitials={shopTitle(shop).replace(/^@/, "")[0]?.toUpperCase()}
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-bold text-gray-900 text-sm truncate">{shopTitle(shop)}</span>
                <span className="text-xs text-gray-400 truncate">
                  @{shop.username} · {shop.productCount} məhsul
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  title="Yuxarı çək"
                  className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowUp size={15} />
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === featured.length - 1}
                  title="Aşağı çək"
                  className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowDown size={15} />
                </button>
                <button
                  onClick={() => onChange(featuredIds.filter((id) => id !== shop.id))}
                  title="Ana səhifədən çıxar"
                  className="p-2 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/60" onClick={closePicker} />

          <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg p-5 sm:p-6 flex flex-col gap-4 max-h-[85vh] z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-gray-900">Mağaza əlavə et</h3>
              <button
                onClick={closePicker}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Mağaza adı və ya istifadəçi adı ilə axtar..."
              icon={<Search size={16} />}
              className="!rounded-full !py-2.5 !text-xs"
              autoFocus
            />

            <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
              {available.length === 0 ? (
                <div className="py-10 text-center flex flex-col items-center gap-2 text-gray-400">
                  <Store size={28} />
                  <p className="text-xs font-semibold">Əlavə ediləcək mağaza tapılmadı.</p>
                </div>
              ) : (
                available.map((shop) => (
                  <button
                    key={shop.id}
                    onClick={() => onChange([...featuredIds, shop.id])}
                    className="group flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-emerald-50/60 border border-gray-100 hover:border-emerald-200 transition-all text-left cursor-pointer"
                  >
                    <AvatarImage
                      src={shop.image}
                      alt={shopTitle(shop)}
                      size={36}
                      fallbackInitials={shopTitle(shop).replace(/^@/, "")[0]?.toUpperCase()}
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-bold text-gray-900 text-sm truncate">{shopTitle(shop)}</span>
                      <span className="text-xs text-gray-400 truncate">
                        @{shop.username} · {shop.productCount} məhsul
                      </span>
                    </div>
                    <span className="w-8 h-8 shrink-0 rounded-full bg-white group-hover:bg-[#1a7a4a] text-[#1a7a4a] group-hover:text-white border border-emerald-200 flex items-center justify-center transition-colors">
                      <Plus size={16} strokeWidth={2.5} />
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedShopsManager;
