"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, Upload, Loader2, Trash2 } from "lucide-react";
import { DashboardProduct } from "@/types";
import { Input } from "@/components/ui/Input";

export interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productToEdit?: DashboardProduct | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  productToEdit,
}) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setPrice(productToEdit.price.toString());
      setDescription(productToEdit.description || "");
      setImageUrl(productToEdit.imageUrl);
    } else {
      setTitle("");
      setPrice("");
      setDescription("");
      setImageUrl("");
    }
    setError("");
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "products");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Şəkil yüklənmədi.");
      }

      setImageUrl(data.url);
    } catch (err: any) {
      setError(err.message || "Şəkil yüklənərkən xəta baş verdi.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setError("Məhsulun şəklini yükləyin.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const url = productToEdit ? `/api/products/${productToEdit.id}` : "/api/products";
      const method = productToEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          price: parseFloat(price),
          imageUrl,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Əməliyyat uğursuz oldu.");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi. Yenidən cəhd edin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">
              {productToEdit ? "Məhsulu Redaktə Et" : "Yeni Məhsul Əlavə Et"}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Məhsul məlumatlarını və şəklini qeyd edin
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">Məhsul Şəkli</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            {imageUrl ? (
              <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-gray-100 group bg-gray-50 flex items-center justify-center">
                <Image
                  src={imageUrl}
                  alt="Product preview"
                  fill
                  unoptimized
                  className="object-contain"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-full bg-white text-gray-800 font-bold text-xs shadow-md hover:bg-gray-100 transition-colors"
                  >
                    Dəyiş
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="p-2 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="w-full h-40 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#1a7a4a] bg-gray-50/50 hover:bg-emerald-50/30 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#1a7a4a] transition-all cursor-pointer disabled:opacity-50"
              >
                {uploadingImage ? (
                  <Loader2 size={24} className="animate-spin text-[#1a7a4a]" />
                ) : (
                  <>
                    <Upload size={24} />
                    <span className="text-xs font-semibold">Şəkil seçin və ya yükləyin (Cloudinary)</span>
                  </>
                )}
              </button>
            )}
          </div>

          <Input
            label="Məhsulun Adı"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="məs: Qara Dəri Çanta"
          />

          <Input
            label="Qiymət (AZN)"
            type="number"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="məs: 45.00"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">Təsvir (İxtiyari)</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Məhsul haqqında qısa məlumat..."
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#1a7a4a] focus:ring-1 focus:ring-[#1a7a4a] resize-none"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
            >
              Ləğv et
            </button>
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="flex-1 py-3 rounded-full bg-[#1a7a4a] hover:bg-[#156040] text-white font-bold text-sm transition-all shadow-md shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : productToEdit ? "Yadda Saxla" : "Əlavə Et"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
