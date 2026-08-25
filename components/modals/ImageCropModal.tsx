"use client";

import React, { useState, useRef } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { X, Check } from "lucide-react";

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (blob: Blob, dataUrl: string) => void;
}

export default function ImageCropModal({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
}: ImageCropModalProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  if (!isOpen || !imageSrc) return null;

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop({ unit: "%", width: 90 }, 1, width, height),
      width,
      height
    );
    setCrop(initialCrop);
  }

  const getCroppedImg = async () => {
    if (!imgRef.current || !completedCrop) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise<{ blob: Blob; dataUrl: string }>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas empty"));
            return;
          }
          const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
          resolve({ blob, dataUrl });
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleConfirm = async () => {
    try {
      const cropped = await getCroppedImg();
      if (cropped) {
        onCropComplete(cropped.blob, cropped.dataUrl);
        onClose();
      }
    } catch (error) {
      console.error("Crop error:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 z-10">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-extrabold text-gray-900 text-base">Şəkli Kəs</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative flex justify-center bg-gray-900 rounded-2xl overflow-hidden max-h-[55vh] p-2">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            circularCrop
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop target"
              onLoad={onImageLoad}
              className="max-h-[45vh] object-contain"
            />
          </ReactCrop>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Ləğv et
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#1a7a4a] hover:bg-[#156040] text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check size={16} /> Kəs və Təsdiqlə
          </button>
        </div>
      </div>
    </div>
  );
}
