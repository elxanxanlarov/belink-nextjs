"use client";

import React, { useState, useRef, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { X, Check, ZoomIn, ZoomOut, RotateCw, RefreshCcw } from "lucide-react";

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (blob: Blob, dataUrl: string) => void;
  /** Set true for circular crop (profile photo). Default: false (free rectangular) */
  circular?: boolean;
  /** Optional fixed aspect ratio (e.g. 1 for square, 4/3 for product). Undefined = free */
  aspect?: number;
}

export default function ImageCropModal({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  circular = false,
  aspect,
}: ImageCropModalProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.1, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  }, []);

  const handleRotate = useCallback(() => {
    setRotate((prev) => (prev + 90) % 360);
  }, []);

  const handleReset = useCallback(() => {
    setScale(1);
    setRotate(0);
  }, []);

  // Determine the effective aspect ratio
  const effectiveAspect = circular ? 1 : aspect;

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;

    if (effectiveAspect) {
      // Fixed or circular aspect — center crop
      const initialCrop = centerCrop(
        makeAspectCrop({ unit: "%", width: 85 }, effectiveAspect, width, height),
        width,
        height
      );
      setCrop(initialCrop);
    } else {
      // Free crop — default to full image selection
      setCrop({
        unit: "%",
        x: 5,
        y: 5,
        width: 90,
        height: 90,
      });
    }
  }, [effectiveAspect]);

  const getCroppedImg = useCallback(async () => {
    if (!imgRef.current || !completedCrop) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Calculate dimensions considering rotation
    const rotRad = (rotate * Math.PI) / 180;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    // Set canvas size
    if (rotate === 90 || rotate === 270) {
      canvas.width = cropHeight;
      canvas.height = cropWidth;
    } else {
      canvas.width = cropWidth;
      canvas.height = cropHeight;
    }

    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotRad);
    ctx.scale(scale, scale);
    ctx.translate(-cropWidth / 2, -cropHeight / 2);

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    ctx.restore();

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
  }, [completedCrop, rotate, scale]);

  const handleConfirm = useCallback(async () => {
    try {
      const cropped = await getCroppedImg();
      if (cropped) {
        onCropComplete(cropped.blob, cropped.dataUrl);
        onClose();
      }
    } catch (error) {
      console.error("Crop error:", error);
    }
  }, [getCroppedImg, onCropComplete, onClose]);

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-2xl w-full p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 z-10 max-h-[95vh]">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-extrabold text-gray-900 text-base">Şəkli Redaktə Et</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {circular ? "Dairəvi kəsim (profil şəkli)" : "İstədiyiniz hissəni seçin və zoom/rotate edin"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleZoomOut}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
            title="Kiçilt"
          >
            <ZoomOut size={16} /> Kiçilt
          </button>
          <span className="text-xs font-bold text-gray-600 px-2">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
            title="Böyüt"
          >
            <ZoomIn size={16} /> Böyüt
          </button>
          <div className="w-px h-6 bg-gray-300" />
          <button
            type="button"
            onClick={handleRotate}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
            title="Fırlat (90°)"
          >
            <RotateCw size={16} /> Fırlat
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
            title="Sıfırla"
          >
            <RefreshCcw size={16} /> Sıfırla
          </button>
        </div>

        <div 
          ref={containerRef}
          className="relative flex justify-center items-center bg-gray-900 rounded-2xl overflow-auto max-h-[55vh] p-4"
          style={{ touchAction: 'pan-x pan-y' }}
        >
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={effectiveAspect}
            circularCrop={circular}
            className="max-w-full"
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop target"
              onLoad={onImageLoad}
              style={{
                transform: `scale(${scale}) rotate(${rotate}deg)`,
                transformOrigin: 'center',
                transition: 'transform 0.2s ease-out',
                maxHeight: '50vh',
                maxWidth: '100%',
              }}
              className="object-contain"
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
            disabled={!completedCrop}
            className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#1a7a4a] hover:bg-[#156040] text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={16} /> Təsdiqlə
          </button>
        </div>
      </div>
    </div>
  );
}
