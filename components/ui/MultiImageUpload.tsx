"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Star, Plus, Edit2, ImageIcon } from "lucide-react";
import ImageCropModal from "@/components/modals/ImageCropModal";
import { showToast } from "@/lib/swal";

export interface UploadedImage {
  id: string;
  url: string;
  isCover: boolean;
  blob?: Blob;
  isUploaded?: boolean;
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
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFiles, setPendingFiles] = useState<string[]>([]);
  const [currentCropIndex, setCurrentCropIndex] = useState(0);
  const [cropOpen, setCropOpen] = useState(false);
  const [editingImageId, setEditingImageId] = useState<string | null>(null); // Hansı şəkil edit olunur
  const [editingImageSrc, setEditingImageSrc] = useState<string>(""); // Edit olunan şəklin source

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      showToast(`Maksimum ${maxImages} şəkil yükləyə bilərsiniz.`, "error");
      return;
    }

    const toProcess = files.slice(0, maxImages - images.length);
    const fileUrls: string[] = [];

    toProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          fileUrls.push(reader.result);
          if (fileUrls.length === toProcess.length) {
            setPendingFiles(fileUrls);
            setCurrentCropIndex(0);
            setCropOpen(true);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEditFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !editingImageId) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setEditingImageSrc(reader.result);
        setPendingFiles([reader.result]);
        setCurrentCropIndex(0);
        setCropOpen(true);
      }
    };
    reader.readAsDataURL(file);

    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };

  const handleCropComplete = (blob: Blob, dataUrl: string) => {
    if (editingImageId) {
      // Şəkil dəyişdirilir - köhnəsini yenilə (cover statusunu saxla)
      const updatedImages = images.map((img) =>
        img.id === editingImageId
          ? { ...img, url: dataUrl, blob: blob, isUploaded: false }
          : img
      );
      onChange(updatedImages);
      setEditingImageId(null);
      setEditingImageSrc("");
      setCropOpen(false);
      setPendingFiles([]);
      setCurrentCropIndex(0);
    } else {
      // Yeni şəkil əlavə edilir
      const isFirst = images.length === 0 && currentCropIndex === 0;
      const newImg: UploadedImage = {
        id: crypto.randomUUID(),
        url: dataUrl,
        isCover: isFirst,
        blob: blob,
        isUploaded: false,
      };
      onChange([...images, newImg]);

      // Növbəti şəkilə keç
      if (currentCropIndex < pendingFiles.length - 1) {
        setCurrentCropIndex(currentCropIndex + 1);
      } else {
        // Hamısı bitdi
        setCropOpen(false);
        setPendingFiles([]);
        setCurrentCropIndex(0);
      }
    }
  };

  const handleCropSkip = () => {
    // Bu şəkli skip et
    if (currentCropIndex < pendingFiles.length - 1) {
      setCurrentCropIndex(currentCropIndex + 1);
    } else {
      setCropOpen(false);
      setPendingFiles([]);
      setCurrentCropIndex(0);
    }
  };

  const handleCropCancel = () => {
    setCropOpen(false);
    setPendingFiles([]);
    setCurrentCropIndex(0);
    setEditingImageId(null); // Edit mode-dan çıx
    setEditingImageSrc("");
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

  const handleEditImage = (imageId: string) => {
    // Mövcud şəkli tap və crop modal aç
    const imageToEdit = images.find(img => img.id === imageId);
    if (!imageToEdit) return;
    
    setEditingImageId(imageId);
    setEditingImageSrc(imageToEdit.url);
    setPendingFiles([imageToEdit.url]);
    setCurrentCropIndex(0);
    setCropOpen(true);
  };

  const handleChangeImageInEdit = () => {
    // Edit modaldan "Şəkli Dəyişdir" buttonuna click edəndə
    editFileInputRef.current?.click();
  };

  const coverImage = images.find((img) => img.isCover);

  return (
    <div className="flex flex-col gap-3">
      <ImageCropModal
        isOpen={cropOpen}
        onClose={handleCropCancel}
        imageSrc={pendingFiles[currentCropIndex] || ""}
        onCropComplete={handleCropComplete}
        isEditMode={!!editingImageId}
        onChangeImage={handleChangeImageInEdit}
      />

      {/* Crop Progress */}
      {cropOpen && pendingFiles.length > 1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon size={18} className="text-blue-600" />
            <span className="text-xs font-bold text-blue-900">
              Şəkil {currentCropIndex + 1} / {pendingFiles.length}
            </span>
          </div>
          <button
            onClick={handleCropSkip}
            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
          >
            Bu şəkli keç
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700">
          Məhsul Şəkilləri
          <span className="text-gray-400 font-normal ml-1">
            (maksimum {maxImages} şəkil)
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

      <input
        ref={editFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleEditFileSelect}
      />

      {images.length === 0 ? (
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
          {/* Cover Image */}
          {coverImage && (
            <div className="relative w-full h-64 rounded-2xl overflow-hidden border-2 border-[#1a7a4a] bg-gray-50 group">
              <Image src={coverImage.url} alt="Cover şəkli" fill unoptimized className="object-contain" />
              
              {/* Cover Badge */}
              <div className="absolute top-3 left-3 bg-[#1a7a4a] text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Star size={10} className="fill-white" /> Cover Şəkil
              </div>

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleEditImage(coverImage.id)}
                  className="px-5 py-3 rounded-full bg-white text-gray-800 font-bold text-sm shadow-md hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <Edit2 size={18} /> Şəkli Dəyişdir
                </button>
              </div>
            </div>
          )}

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-4 gap-2.5">
            {images.map((img) => (
              <div
                key={img.id}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group ${
                  img.isCover ? "border-[#1a7a4a] ring-2 ring-[#1a7a4a] ring-offset-2" : "border-gray-200 hover:border-gray-400 cursor-pointer"
                }`}
                onClick={() => !img.isCover && setCover(img.id)}
              >
                <Image src={img.url} alt="Product image" fill unoptimized className="object-cover" />

                {/* Cover indicator */}
                {img.isCover && (
                  <div className="absolute bottom-1 left-1 bg-[#1a7a4a] rounded-full p-1 z-10">
                    <Star size={8} className="fill-white text-white" />
                  </div>
                )}

                {/* Edit button - həm cover həm də digər şəkillər üçün */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditImage(img.id);
                  }}
                  className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white/90 text-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md hover:bg-white z-20"
                  title="Şəkli Dəyişdir"
                >
                  <Edit2 size={12} />
                </button>

                {/* Delete button - bütün şəkillər üçün (amma ən azı 1 şəkil qalmalıdır) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.id, img.url);
                  }}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md hover:bg-red-700 z-20"
                  title="Sil"
                >
                  <X size={12} />
                </button>

                {/* "Cover et" overlay - yalnız cover olmayan şəkillər üçün */}
                {!img.isCover && (
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 pointer-events-none">
                    <span className="text-[9px] text-white font-bold">Cover et</span>
                  </div>
                )}
              </div>
            ))}

            {/* Add more button */}
            {images.length < maxImages && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-[#1a7a4a] bg-gray-50 hover:bg-emerald-50/30 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-[#1a7a4a] transition-all cursor-pointer"
              >
                <Plus size={20} />
                <span className="text-[9px] font-bold">Əlavə et</span>
              </button>
            )}
          </div>

          {images.length > 1 && (
            <p className="text-[11px] text-gray-400 text-center">
              💡 Şəkil üzərinə klikləyin və cover olaraq təyin edin
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;
