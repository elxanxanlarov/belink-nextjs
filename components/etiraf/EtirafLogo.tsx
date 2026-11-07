import React from "react";

/** Hədiyyə qutusu + "Etiraf" yazısı. `tone="light"` tünd fonlar üçündür. */
export function EtirafLogo({
  tone = "light",
  size = 56,
  className = "",
}: {
  tone?: "light" | "dark";
  size?: number;
  className?: string;
}) {
  const text = tone === "light" ? "#ffffff" : "#8b1424";
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <svg width={size} height={size * 0.8} viewBox="0 0 100 80" aria-hidden="true">
        <path d="M50 22 C40 4 20 6 26 18 C30 26 44 24 50 22 Z" fill="#c8102e" stroke="#fff" strokeWidth="2" />
        <path d="M50 22 C60 4 80 6 74 18 C70 26 56 24 50 22 Z" fill="#c8102e" stroke="#fff" strokeWidth="2" />
        <rect x="14" y="22" width="72" height="16" rx="4" fill="#8b1424" stroke="#fff" strokeWidth="2" />
        <rect x="20" y="38" width="60" height="38" rx="5" fill="#c8102e" stroke="#fff" strokeWidth="2" />
        <path
          d="M50 70 C34 58 36 46 44 46 C47 46 49 48 50 50 C51 48 53 46 56 46 C64 46 66 58 50 70 Z"
          fill="#fff"
        />
      </svg>
      <span
        className="font-black italic tracking-tight -mt-1"
        style={{ color: text, fontSize: size * 0.62 }}
      >
        Etiraf
      </span>
    </div>
  );
}

export default EtirafLogo;
