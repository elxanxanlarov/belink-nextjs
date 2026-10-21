"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { DashboardProduct, Category } from "@/types";
import { Input } from "@/components/ui/Input";
import { CategorySelect } from "@/components/ui/CategorySelect";
import { MultiImageUpload, UploadedImage } from "@/components/ui/MultiImageUpload";
import { CreateCategoryModal } from "@/components/modals/CreateCategoryModal";
import { showToast } from "@/lib/swal";

export interface ProductFormProps {
  productToEdit?: DashboardProduct | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const toUploadedImages = (product: DashboardProduct): UploadedImage[] => {
  const allImages = product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [];
  return allImages.map((url, i) => ({
    id: `existing-${i}`,
    url,
    isCover: url === product.imageUrl,
    isUploaded: true,
  }));
};

export const ProductForm: React.FC<ProductFormProps> = ({ productToEdit, onCancel, onSuccess }) => {
  const [title, setTitle] = useState(productToEdit?.title ?? "");
  const [price, setPrice] = useState(productToEdit ? productToEdit.price.toString() : "");
  const [description, setDescription] = useState(productToEdit?.description ?? "");
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(
    productToEdit ? toUploadedImages(productToEdit) : []
  );
  const [categoryId, setCategoryId] = useState<string | null>(productToEdit?.categoryId ?? null);
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [categoryKey, setCategoryKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
      // 1. Yüklənməmiş şəkilləri yüklə
      const uploadedImageUrls: string[] = [];

      for (const img of uploadedImages) {
        if (img.isUploaded) {
          // Artıq yüklənmiş şəkil
          uploadedImageUrls.push(img.url);
        } else if (img.blob) {
          // Yeni şəkil - indi yüklə
          const formData = new FormData();
          formData.append("file", img.blob, "product.jpg");
          formData.append("folder", "products");

          const res = await fetch("/api/upload", { method: "POST", body: formData });
          const data = await res.json();

          if (!res.ok) throw new Error(data.error || "Şəkil yükləmə xətası");

          uploadedImageUrls.push(data.url);
        }
      }

      // 2. Cover şəklin URL-ini tap
      const coverIndex = uploadedImages.findIndex((img) => img.isCover);
      const coverImgUrl = uploadedImageUrls[coverIndex] || uploadedImageUrls[0];

      // 3. Məhsulu yarat/yenilə
      const url = productToEdit ? `/api/products/${productToEdit.id}` : "/api/products";
      const method = productToEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          price: parseFloat(price),
          imageUrl: coverImgUrl,
          images: uploadedImageUrls,
          description,
          categoryId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Əməliyyat uğursuz oldu.");

      showToast(productToEdit ? "Məhsul yeniləndi" : "Məhsul əlavə edildi", "success");
      onSuccess();
    } catch (err) {
      setError((err instanceof Error && err.message) || "Xəta baş verdi. Yenidən cəhd edin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-5 sm:p-8 flex flex-col gap-5 select-none">
      <CreateCategoryModal
        isOpen={createCategoryOpen}
        onClose={() => setCreateCategoryOpen(false)}
        onCreated={handleCategoryCreated}
      />

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <MultiImageUpload images={uploadedImages} onChange={setUploadedImages} onDelete={undefined} productId={undefined} />

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
            rows={5}
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
            onClick={onCancel}
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
                <Loader2 size={16} className="animate-spin" />
                {uploadedImages.some((img) => !img.isUploaded) ? "Şəkillər yüklənir..." : "Saxlanılır..."}
              </>
            ) : (
              "Yadda Saxla"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
