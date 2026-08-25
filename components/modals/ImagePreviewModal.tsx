"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { ImagePreviewModalProps } from "@/types";

export default function ImagePreviewModal({
  isOpen,
  onClose,
  imageUrl,
  altText = "Profil şəkli",
}: ImagePreviewModalProps) {
  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 z-10 p-2 sm:p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
          <Image
            src={imageUrl}
            alt={altText}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
