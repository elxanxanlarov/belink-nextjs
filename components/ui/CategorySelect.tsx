"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, Plus, Check, Loader2 } from "lucide-react";
import { Category } from "@/types";

interface CategorySelectProps {
  value: string | null;
  onChange: (categoryId: string | null) => void;
  onCreateNew: () => void;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onChange,
  onCreateNew,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (res.ok) setCategories(data.categories || []);
    } finally {
      setLoading(false);
    }
  };

  const refreshCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    if (res.ok) setCategories(data.categories || []);
  };

  const selected = categories.find((c) => c.id === value);
  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (id: string | null) => {
    onChange(id);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="text-xs font-bold text-gray-700 mb-1.5 block">
        Kateqoriya <span className="text-gray-400 font-normal">(İxtiyari)</span>
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 hover:border-[#1a7a4a] focus:outline-none focus:border-[#1a7a4a] focus:ring-1 focus:ring-[#1a7a4a] transition-all cursor-pointer"
      >
        <span className={selected ? "text-gray-900 font-medium" : "text-gray-400"}>
          {loading ? "Yüklənir..." : selected ? selected.name : "Kateqoriya seçin..."}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-gray-200 shadow-xl z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-gray-50">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Axtar..."
                className="flex-1 text-xs text-gray-900 bg-transparent outline-none"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-44 overflow-y-auto py-1">
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-gray-500 hover:bg-gray-50 transition-colors text-left cursor-pointer"
            >
              <span className="italic">Kateqoriyasız</span>
              {!value && <Check size={13} className="ml-auto text-[#1a7a4a]" />}
            </button>

            {loading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 size={16} className="animate-spin text-gray-400" />
              </div>
            )}

            {!loading && filtered.length === 0 && search && (
              <div className="px-3.5 py-3 text-xs text-gray-400 text-center">
                Nəticə tapılmadı
              </div>
            )}

            {!loading &&
              filtered.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelect(cat.id)}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-gray-800 hover:bg-emerald-50 hover:text-[#1a7a4a] transition-colors text-left cursor-pointer font-medium"
                >
                  <span className="flex-1">{cat.name}</span>
                  {value === cat.id && <Check size={13} className="text-[#1a7a4a] shrink-0" />}
                </button>
              ))}
          </div>

          <div className="border-t border-gray-100 p-1.5">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setSearch("");
                onCreateNew();
              }}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-[#1a7a4a] hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
            >
              <Plus size={14} strokeWidth={2.5} />
              Yeni kateqoriya yarat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
