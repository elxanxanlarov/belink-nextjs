"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, Upload, Loader2, Trash2 } from "lucide-react";
import { DashboardProduct } from "@/types";
import { Input } from "@/components/ui/Input";
import ImageCropModal from "@/components/modals/ImageCropModal";
import { showToast } from "@/lib/swal";

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

  const [pendingCropSrc, setPendingCropSrc] = useState<string>("");
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

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
    setPendingBlob(null);
    setLocalPreviewUrl(null);
    setError("");
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPendingCropSrc(reader.result);
        setCropModalOpen(true);
      }
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCropComplete = (blob: Blob, dataUrl: string) => {
    setPendingBlob(blob);
    setLocalPreviewUrl(dataUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeImage = localPreviewUrl || imageUrl;
    if (!activeImage && !pendingBlob) {
      setError("Məhsulun şəklini seçin.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      let finalImageUrl = imageUrl;

      if (pendingBlob) {
        const formData = new FormData();
        formData.append("file", pendingBlob, "product.jpg");
        formData.append("folder", "products");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.error || "Şəkil bulud yaddaşına yüklənmədi.");
        }

        finalImageUrl = uploadData.url;
      }

      const url = productToEdit ? `/api/products/${productToEdit.id}` : "/api/products";
      const method = productToEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          price: parseFloat(price),
          imageUrl: finalImageUrl,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Əməliyyat uğursuz oldu.");
      }

      showToast(productToEdit ? "Məhsul yeniləndi" : "Məhsul əlavə edildi", "success");
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi. Yenidən cəhd edin.");
    } finally {
      setSubmitting(false);
    }
  };

  const displayImage = localPreviewUrl || imageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <ImageCropModal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={pendingCropSrc}
        onCropComplete={handleCropComplete}
      />

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
              onChange={handleFileSelect}
            />

            {displayImage ? (
              <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-gray-100 group bg-gray-50 flex items-center justify-center">
                <Image
                  src={displayImage}
                  alt="Product preview"
                  fill
                  unoptimized
                  className="object-contain"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-full bg-white text-gray-800 font-bold text-xs shadow-md hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Dəyiş
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl("");
                      setLocalPreviewUrl(null);
                      setPendingBlob(null);
                    }}
                    className="p-2 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#1a7a4a] bg-gray-50/50 hover:bg-emerald-50/30 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#1a7a4a] transition-all cursor-pointer"
              >
                <Upload size={24} />
                <span className="text-xs font-semibold">Şəkil seçin (Seçildikdən sonra kəsiləcək)</span>
              </button>
            )}
          </div>

          <Input
            label="Məhsulun Adı"
            type="text"
            required
            maxLength={80}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="məs: Qara Dəri Çanta"
          />

          <Input
            label="Qiymət (AZN)"
            type="number"
            step="0.01"
            required
            maxLength={10}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="məs: 45.00"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">Təsvir (İxtiyari)</label>
            <textarea
              rows={3}
              maxLength={300}
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
              className="flex-1 py-3 rounded-full border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Ləğv et
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 rounded-full bg-[#1a7a4a] hover:bg-[#156040] text-white font-bold text-sm transition-all shadow-md shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Yüklənir...
                </>
              ) : (
                "Yadda Saxla"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
