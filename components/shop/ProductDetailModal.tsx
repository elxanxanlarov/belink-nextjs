"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  MessageCircle,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Tag,
  ShoppingBag,
} from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
}

interface ProductItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  images?: string[];
  description?: string | null;
  categoryId?: string | null;
  category?: CategoryItem | null;
}

interface ProductDetailModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  cartQuantity: number;
  onAddToCart: (product: ProductItem) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onOrder: (product: ProductItem) => void;
  relatedProducts: ProductItem[];
  onSelectProduct: (product: ProductItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  cartQuantity,
  onAddToCart,
  onUpdateQuantity,
  onOrder,
  relatedProducts,
  onSelectProduct,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setActiveIdx(0);
  }, [product]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const allImages: string[] =
    product.images && product.images.length > 0
      ? product.images
      : [product.imageUrl];

  const safeIdx = Math.min(activeIdx, allImages.length - 1);

  const prev = () => setActiveIdx((i) => (i === 0 ? allImages.length - 1 : i - 1));
  const next = () => setActiveIdx((i) => (i === allImages.length - 1 ? 0 : i + 1));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center select-none">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] sm:max-h-[88vh] overflow-y-auto z-10 animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h2 className="text-sm font-extrabold text-gray-900 truncate max-w-[260px]">
            {product.title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-5 p-5">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            <Image
              src={allImages[safeIdx]}
              alt={product.title}
              fill
              unoptimized
              className="object-contain transition-opacity duration-200"
            />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md text-gray-700 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md text-gray-700 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      className={`rounded-full transition-all cursor-pointer ${
                        i === safeIdx
                          ? "w-4 h-1.5 bg-[#1a7a4a]"
                          : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="absolute top-3 right-3 bg-white/95 text-[#1a7a4a] font-black text-sm px-3 py-1.5 rounded-full shadow-sm">
              {product.price} ₼
            </div>
          </div>

          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    i === safeIdx
                      ? "border-[#1a7a4a] shadow-sm scale-105"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image src={img} alt={`Şəkil ${i + 1}`} fill unoptimized className="object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl font-extrabold text-gray-900 leading-tight">
                {product.title}
              </h1>
              <span className="shrink-0 text-xl font-black text-[#1a7a4a]">
                {product.price} ₼
              </span>
            </div>

            {product.category && (
              <div className="flex items-center gap-1.5">
                <Tag size={13} className="text-gray-400" />
                <span className="text-xs font-semibold text-gray-500">
                  {product.category.name}
                </span>
              </div>
            )}

            {product.description ? (
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">Ətraflı məlumat yoxdur.</p>
            )}
          </div>

          <div className="flex flex-col gap-2.5 pt-2 border-t border-gray-100">
            {cartQuantity > 0 ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-full px-4 py-3">
                <button
                  onClick={() => onUpdateQuantity(product.id, -1)}
                  className="w-8 h-8 rounded-full bg-white text-[#1a7a4a] flex items-center justify-center shadow-xs hover:bg-emerald-100 cursor-pointer"
                >
                  <Minus size={16} strokeWidth={2.5} />
                </button>
                <div className="flex items-center gap-2">
                  <ShoppingBag size={15} className="text-[#1a7a4a]" />
                  <span className="text-sm font-bold text-[#1a7a4a]">
                    {cartQuantity} ədəd əlavə edildi
                  </span>
                </div>
                <button
                  onClick={() => onUpdateQuantity(product.id, 1)}
                  className="w-8 h-8 rounded-full bg-[#1a7a4a] text-white flex items-center justify-center shadow-xs hover:bg-[#156040] cursor-pointer"
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAddToCart(product)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#1a7a4a] font-bold text-sm transition-colors cursor-pointer border border-emerald-200"
              >
                <Plus size={16} strokeWidth={2.5} /> Səbətə əlavə et
              </button>
            )}

            <button
              onClick={() => onOrder(product)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#1a7a4a] hover:bg-[#156040] text-white font-bold text-sm shadow-md shadow-emerald-200 transition-all cursor-pointer"
            >
              <MessageCircle size={18} /> WhatsApp ilə Sifariş Et
            </button>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="flex flex-col gap-3 px-5 pb-6 border-t border-gray-100 pt-4">
            <h3 className="text-sm font-extrabold text-gray-900">Digər Məhsullar</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {relatedProducts.map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => onSelectProduct(rel)}
                  className="group text-left bg-gray-50 hover:bg-emerald-50/50 rounded-2xl p-2.5 border border-gray-100 hover:border-emerald-200 transition-all cursor-pointer"
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white border border-gray-100 mb-2">
                    <Image
                      src={rel.imageUrl}
                      alt={rel.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-1.5 right-1.5 bg-white/95 text-[#1a7a4a] font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                      {rel.price} ₼
                    </span>
                  </div>
                  <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight">
                    {rel.title}
                  </p>
                  {rel.category && (
                    <p className="text-[10px] text-gray-400 mt-0.5">{rel.category.name}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailModal;
