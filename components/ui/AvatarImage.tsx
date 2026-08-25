"use client";

import React, { useState } from "react";
import Image from "next/image";

export interface AvatarImageProps {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
  fallbackInitials?: string;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({
  src,
  alt,
  size = 36,
  className = "",
  fallbackInitials,
}) => {
  const [hasError, setHasError] = useState(false);

  const initialLetter = fallbackInitials || (alt ? alt[0].toUpperCase() : "U");

  if (!src || hasError) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-full bg-emerald-50 text-[#1a7a4a] font-bold flex items-center justify-center text-xs border border-emerald-100 flex-shrink-0 ${className}`}
      >
        {initialLetter}
      </div>
    );
  }

  const isExternal = src.startsWith("http://") || src.startsWith("https://");

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      unoptimized={isExternal}
      priority
      onError={() => setHasError(true)}
      className={`rounded-full object-cover border border-emerald-100 flex-shrink-0 transition-opacity duration-200 ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default AvatarImage;
