"use client";

import React from "react";
import Image from "next/image";
import { Edit2, Trash2, ShoppingBag, Plus } from "lucide-react";
import { DashboardProduct } from "@/types";

export interface ProductListProps {
  products: DashboardProduct[];
  loading: boolean;
  onEdit: (product: DashboardProduct) => void;
  onDelete: (productId: string) => void;
  onAdd: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  loading,
  onEdit,
  onDelete,
  onAdd,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="bg-white rounded-3xl p-4 border border-gray-100 animate-pulse flex flex-col gap-3"
          >
            <div className="w-full h-44 bg-gray-100 rounded-2xl" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-[#1a7a4a] flex items-center justify-center">
          <ShoppingBag size={30} />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-extrabold text-gray-900 text-lg">Hələ heç bir məhsul yoxdur</h3>
          <p className="text-xs text-gray-400 max-w-sm">
            Mağazanıza ilk məhsulunuzu əlavə edərək satışa başlayın.
          </p>
        </div>
        <button
          onClick={onAdd}
          className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a7a4a] hover:bg-[#156040] text-white font-bold text-sm shadow-md shadow-emerald-200 transition-all cursor-pointer"
        >
          <Plus size={18} /> İlk Məhsulunu Əlavə Et
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-3xl border border-gray-100 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex flex-col gap-3">
            <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-gray-50 border border-gray-50 flex items-center justify-center">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 right-3 bg-white/90 text-[#1a7a4a] font-extrabold text-xs px-3 py-1.5 rounded-full shadow-sm">
                {product.price} AZN
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{product.title}</h4>
              {product.description && (
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-50">
            <button
              onClick={() => onEdit(product)}
              className="p-2 rounded-xl text-gray-500 hover:text-[#1a7a4a] hover:bg-emerald-50 transition-colors cursor-pointer"
              title="Redaktə et"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="p-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Sil"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
