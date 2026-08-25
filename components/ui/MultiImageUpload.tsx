"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Star, Loader2, Plus } from "lucide-react";
import ImageCropModal from "@/components/modals/ImageCropModal";
import { showToast } from "@/lib/swal";

export interface UploadedImage {
  id: string;
  url: string;
  isCover: boolean;
}

interface MultiImageUploadProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  onDelete?: (imageUrl: string) => void;
  productId?: string;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  images,
  onChange,
  maxImages = 8,
  onDelete,
  productId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingCropSrc, setPendingCropSrc] = useState("");
  const [cropOpen, setCropOpen] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      showToast(`Maksimum ${maxImages} şəkil yükləyə bilərsiniz.`, "error");
      return;
    }

    const toProcess = files.slice(0, remaining);

    toProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPendingCropSrc(reader.result);
          setCropOpen(true);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCropComplete = async (blob: Blob, _dataUrl: string) => {
    setCropOpen(false);

    setUploadingCount((c) => c + 1);
    try {
      const formData = new FormData();
      formData.append("file", blob, "product.jpg");
      formData.append("folder", "products");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yükləmə xətası");

      const isFirst = images.length === 0;
      const newImg: UploadedImage = {
        id: crypto.randomUUID(),
        url: data.url,
        isCover: isFirst,
      };
      onChange([...images, newImg]);
    } catch (err: any) {
      showToast(err.message || "Şəkil yüklənmədi", "error");
    } finally {
      setUploadingCount((c) => c - 1);
    }
  };

  const setCover = (id: string) => {
    onChange(images.map((img) => ({ ...img, isCover: img.id === id })));
  };

  const removeImage = (id: string, url: string) => {
    if (images.length <= 1) {
      showToast("Ən azı 1 şəkil qalmalıdır.", "error");
      return;
    }

    const filtered = images.filter((img) => img.id !== id);
    if (filtered.length > 0 && !filtered.some((img) => img.isCover)) {
      filtered[0].isCover = true;
    }
    onChange(filtered);
    
    if (onDelete) {
      onDelete(url);
    }
  };

  const coverImage = images.find((img) => img.isCover);

  return (
    <div className="flex flex-col gap-3">
      <ImageCropModal
        isOpen={cropOpen}
        onClose={() => setCropOpen(false)}
        imageSrc={pendingCropSrc}
        onCropComplete={handleCropComplete}
      />

      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700">
          Məhsul Şəkilləri
          <span className="text-gray-400 font-normal ml-1">
            (maksimum {maxImages} şəkil, ilk şəkil avtomatik cover olur)
          </span>
        </label>
        {images.length > 0 && (
          <span className="text-[11px] font-bold text-[#1a7a4a]">
            {images.length}/{maxImages}
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {images.length === 0 && uploadingCount === 0 ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-40 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#1a7a4a] bg-gray-50/50 hover:bg-emerald-50/30 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#1a7a4a] transition-all cursor-pointer"
        >
          <Upload size={24} />
          <span className="text-xs font-semibold">Şəkillər seçin</span>
          <span className="text-[11px] text-gray-400">Çoxlu şəkil seçə bilərsiniz</span>
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          {coverImage && (
            <div className="relative w-full h-52 rounded-2xl overflow-hidden border-2 border-[#1a7a4a] bg-gray-50 group">
              <Image src={coverImage.url} alt="Cover şəkli" fill unoptimized className="object-contain" />
              <div className="absolute top-2 left-2 bg-[#1a7a4a] text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Star size={10} className="fill-white" /> Cover
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                {images.length < maxImages && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-full bg-white text-gray-800 font-bold text-xs shadow-md hover:bg-gray-100 cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus size={13} /> Şəkil əlavə et
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-2">
            {images.map((img) => (
              <div
                key={img.id}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group cursor-pointer ${
                  img.isCover ? "border-[#1a7a4a]" : "border-gray-200 hover:border-gray-400"
                }`}
                onClick={() => !img.isCover && setCover(img.id)}
              >
                <Image src={img.url} alt="Product image" fill unoptimized className="object-cover" />

                {img.isCover && (
                  <div className="absolute bottom-0.5 left-0.5 bg-[#1a7a4a] rounded-full p-0.5">
                    <Star size={9} className="fill-white text-white" />
                  </div>
                )}

                {!img.isCover && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(img.id, img.url);
                    }}
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                  >
                    <X size={10} />
                  </button>
                )}

                {!img.isCover && (
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[9px] text-white font-bold">Cover et</span>
                  </div>
                )}
              </div>
            ))}

            {Array.from({ length: uploadingCount }).map((_, i) => (
              <div key={`uploading-${i}`} className="relative aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                <Loader2 size={18} className="animate-spin text-gray-400" />
              </div>
            ))}

            {images.length + uploadingCount < maxImages && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-[#1a7a4a] bg-gray-50 hover:bg-emerald-50/30 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-[#1a7a4a] transition-all cursor-pointer"
              >
                <Plus size={18} />
                <span className="text-[10px] font-semibold">Əlavə et</span>
              </button>
            )}
          </div>

          {images.length > 1 && (
            <p className="text-[11px] text-gray-400 text-center">
              Şəkil üzərinə klikləyin → cover olaraq seçin
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;
