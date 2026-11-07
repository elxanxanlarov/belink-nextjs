"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlertCircle, Check, Eye, ImageIcon, Mic, Music, Type } from "lucide-react";
import { ETIRAF_DESIGNS, type EtirafDesign } from "@/lib/etirafShared";
import { ETIRAF_PACKAGES, etirafDemoPath, etirafOrderWhatsappUrl, type EtirafPackage } from "@/lib/etirafDemos";
import { EtirafLogo } from "@/components/etiraf/EtirafLogo";

const DESIGN_SWATCH: Record<EtirafDesign, string> = {
  red: "bg-[radial-gradient(ellipse_at_top,#a3162b,#4a0711)]",
  polaroid: "bg-[radial-gradient(ellipse_at_top,#fff8f1,#ecd3c3)]",
  night: "bg-[radial-gradient(ellipse_at_top,#1d2d5c,#060a1c)]",
};

const COVERS: Record<string, string> = {
  sekil: "/demo/gul-lale.jpg",
  "sekil-musiqi": "/demo/nar-sham.jpg",
  tam: "/demo/gul-urek.jpg",
};

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88zm8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41z" />
    </svg>
  );
}

const includeIcon = (item: string) =>
  item.startsWith("Şəkil") ? (
    <ImageIcon size={14} />
  ) : item.includes("musiqi") ? (
    <Music size={14} />
  ) : item.includes("Səs") ? (
    <Mic size={14} />
  ) : item.includes("mətn") ? (
    <Type size={14} />
  ) : (
    <Check size={14} />
  );

export function EtirafSamples({ initialDesign }: { initialDesign: EtirafDesign | null }) {
  // Seçilmiş dizayn URL-də (?dizayn=) saxlanılır — nümunədən geri qayıdanda və yeniləyəndə itmir.
  const [design, setDesign] = useState<EtirafDesign | null>(initialDesign);
  const [highlight, setHighlight] = useState(false);
  const [toast, setToast] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const chooseDesign = (id: EtirafDesign) => {
    setDesign(id);
    setToast(false);
    window.history.replaceState(null, "", `?dizayn=${id}`);
  };

  /** Dizayn seçilməyibsə aşağıdan xəbərdarlıq çıxarır və seçim bölməsini işıqlandırır. */
  const warnDesign = () => {
    pickerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlight(true);
    setToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setHighlight(false);
      setToast(false);
    }, 2600);
  };

  const view = (pkg: EtirafPackage) => {
    if (!design) return warnDesign();
    router.push(etirafDemoPath(pkg.id, design));
  };

  // Sifariş dizaynsız da verilə bilər — dizayn seçilibsə mesaja əlavə olunur.
  const order = (pkg: EtirafPackage) => {
    window.open(etirafOrderWhatsappUrl(pkg, design), "_blank", "noopener,noreferrer");
  };

  return (
    <main className="flex-1 min-h-dvh bg-[#fdf3ee]">
      <header className="bg-[linear-gradient(180deg,#8b1424,#6b0a17)] pt-8 pb-16 px-4 text-center text-white">
        <EtirafLogo tone="light" size={60} />
        <h1 className="mt-4 text-2xl font-extrabold">Etiraf nümunələri</h1>
        <p className="mt-1.5 text-sm text-white/80">Nümunəyə bax, bəyəndiyin paketi WhatsApp-dan sifariş ver ♡</p>
      </header>

      <div className="relative -mt-8 mx-auto max-w-lg rounded-t-[2rem] bg-[#fdf3ee] px-4 pt-6 pb-12 flex flex-col gap-5">
        {/* Dizayn seçimi */}
        <div
          ref={pickerRef}
          className={`flex flex-col gap-2 rounded-3xl p-2 -m-2 transition-shadow ${highlight ? "ring-4 ring-rose-300" : ""}`}
        >
          <span className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
            Dizayn seç
            {!design && (
              <span
                className={`w-5 h-5 rounded-full bg-[#c8102e] text-white flex items-center justify-center text-[12px] font-black ${
                  highlight ? "animate-bounce" : ""
                }`}
                aria-label="Dizayn seçilməyib"
              >
                !
              </span>
            )}
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            {ETIRAF_DESIGNS.map((d) => {
              const active = design === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => chooseDesign(d.id)}
                  aria-pressed={active}
                  className={`relative h-20 rounded-2xl flex items-end justify-center p-2 border-2 cursor-pointer transition-all ${
                    DESIGN_SWATCH[d.id]
                  } ${active ? "border-[#c8102e] ring-2 ring-rose-200" : "border-transparent"}`}
                >
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      d.id === "polaroid" ? "bg-[#8b1424] text-white" : "bg-white/90 text-gray-900"
                    }`}
                  >
                    {d.name}
                  </span>
                  {active && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#c8102e] text-white flex items-center justify-center">
                      <Check size={12} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Paketlər */}
        {ETIRAF_PACKAGES.map((pkg) => (
          <div key={pkg.id} className="rounded-3xl bg-white border border-rose-100 p-3 flex gap-3 shadow-[0_4px_20px_rgba(139,20,36,0.06)]">
            <button
              type="button"
              onClick={() => view(pkg)}
              className="relative w-28 shrink-0 rounded-2xl overflow-hidden bg-rose-50 cursor-pointer"
              aria-label={`${pkg.label} nümunəsinə bax`}
            >
              <Image src={COVERS[pkg.id]} alt="" fill unoptimized className="object-cover" />
              <span className="absolute inset-x-0 bottom-0 bg-black/45 text-white text-[11px] font-bold py-1 text-center">
                Nümunə
              </span>
            </button>

            <div className="flex flex-col gap-2 min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-extrabold text-gray-900 leading-tight">{pkg.label}</h2>
                <span className="shrink-0 rounded-full bg-[#8b1424] text-white text-sm font-extrabold px-3 py-1">
                  {pkg.price} AZN
                </span>
              </div>
              <ul className="flex flex-col gap-1">
                {pkg.includes.map((item) => (
                  <li key={item} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="text-[#c8102e]">{includeIcon(item)}</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="grid grid-cols-2 gap-1.5 mt-auto pt-1">
                <button
                  type="button"
                  onClick={() => view(pkg)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-rose-200 px-3 py-2 text-xs font-bold text-[#8b1424] cursor-pointer"
                >
                  <Eye size={14} /> Bax
                </button>
                <button
                  type="button"
                  onClick={() => order(pkg)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#25d366] px-3 py-2 text-xs font-bold text-white cursor-pointer"
                >
                  <WhatsAppIcon /> Sifariş ver
                </button>
              </div>
            </div>
          </div>
        ))}

        <p className="text-center text-xs text-gray-400 leading-relaxed">
          Sifarişdən sonra sizə xüsusi link göndərilir — şəkillərinizi özünüz əlavə edirsiniz,
          biz isə QR kodlu hədiyyə kartını hazırlayırıq.
        </p>
      </div>

      <div
        role="status"
        aria-live="polite"
        className={`fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pointer-events-none transition-all duration-300 ${
          toast ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <div className="flex items-center gap-2.5 rounded-2xl bg-[#2a1416] text-white px-4 py-3 shadow-2xl max-w-sm w-full">
          <AlertCircle size={20} className="text-[#ff6b81] shrink-0" />
          <span className="text-sm font-semibold">Nümunəyə baxmaq üçün əvvəlcə dizayn seçin</span>
        </div>
      </div>
    </main>
  );
}

export default EtirafSamples;
