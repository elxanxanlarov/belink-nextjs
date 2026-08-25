"use client";

import Image from "next/image";

interface PreloaderProps {
  text?: string;
  fullScreen?: boolean;
}

export default function Preloader({
  text = "Yüklənir...",
  fullScreen = true,
}: PreloaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Animated spinning outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-emerald-100 border-t-[#1a7a4a] animate-spin" />

        {/* Centered circular image badge */}
        <div className="w-14 h-14 rounded-full bg-white border border-emerald-100 shadow-md flex items-center justify-center p-1.5 overflow-hidden z-10">
          <Image
            src="/favicon.png"
            alt="belink"
            width={56}
            height={56}
            className="w-full h-full object-cover rounded-full"
            priority
          />
        </div>
      </div>

      {text && (
        <span className="text-xs font-extrabold text-gray-500 tracking-widest uppercase animate-pulse mt-1">
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[200] bg-white/95 backdrop-none flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return content;
}

