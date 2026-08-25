"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { DashboardProduct, Category } from "@/types";
import { Input } from "@/components/ui/Input";
import { CategorySelect } from "@/components/ui/CategorySelect";
import { MultiImageUpload, UploadedImage } from "@/components/ui/MultiImageUpload";
import { CreateCategoryModal } from "@/components/modals/CreateCategoryModal";
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
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [categoryKey, setCategoryKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setPrice(productToEdit.price.toString());
      setDescription(productToEdit.description || "");
      setCategoryId(productToEdit.categoryId || null);

      const allImages = productToEdit.images?.length
        ? productToEdit.images
        : productToEdit.imageUrl
        ? [productToEdit.imageUrl]
        : [];

      setUploadedImages(
        allImages.map((url, i) => ({
          id: `existing-${i}`,
          url,
          isCover: url === productToEdit.imageUrl || i === 0,
        }))
      );
    } else {
      setTitle("");
      setPrice("");
      setDescription("");
      setCategoryId(null);
      setUploadedImages([]);
    }
    setError("");
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleCategoryCreated = (category: Category) => {
    setCategoryId(category.id);
    setCategoryKey((k) => k + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadedImages.length === 0) {
      setError("Ən azı 1 şəkil yükləyin.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const coverImg = uploadedImages.find((img) => img.isCover) || uploadedImages[0];
      const imageUrls = uploadedImages.map((img) => img.url);

      const url = productToEdit ? `/api/products/${productToEdit.id}` : "/api/products";
      const method = productToEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          price: parseFloat(price),
          imageUrl: coverImg.url,
          images: imageUrls,
          description,
          categoryId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Əməliyyat uğursuz oldu.");

      showToast(productToEdit ? "Məhsul yeniləndi" : "Məhsul əlavə edildi", "success");
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi. Yenidən cəhd edin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <CreateCategoryModal
        isOpen={createCategoryOpen}
        onClose={() => setCreateCategoryOpen(false)}
        onCreated={handleCategoryCreated}
      />

      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 flex flex-col gap-5 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">
              {productToEdit ? "Məhsulu Redaktə Et" : "Yeni Məhsul Əlavə Et"}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Məhsul məlumatlarını qeyd edin
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
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
          <MultiImageUpload
            images={uploadedImages}
            onChange={setUploadedImages}
            onDelete={undefined}
            productId={undefined}
          />

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

          <CategorySelect
            key={categoryKey}
            value={categoryId}
            onChange={setCategoryId}
            onCreateNew={() => setCreateCategoryOpen(true)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">Təsvir (İxtiyari)</label>
            <textarea
              rows={4}
              maxLength={600}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Məhsul haqqında ətraflı məlumat, ölçülər, rənglər, çatdırılma şərtləri..."
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#1a7a4a] focus:ring-1 focus:ring-[#1a7a4a] resize-none"
            />
          </div>

          <div className="flex gap-3 mt-1">
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
                  <Loader2 size={16} className="animate-spin" /> Saxlanılır...
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
