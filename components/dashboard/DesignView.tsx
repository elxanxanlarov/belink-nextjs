"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Check, Crown, ImagePlus, Loader2, Lock, Trash2 } from "lucide-react";
import { UserProfileData } from "@/types";
import { showToast } from "@/lib/swal";
import ImageCropModal from "@/components/modals/ImageCropModal";
import {
  DEFAULT_SHOP_TEMPLATE_ID,
  MAX_SHOP_BANNERS,
  SHOP_TEMPLATES,
  getShopPalette,
  resolveShopTemplate,
} from "@/data/shopTemplates";
import { getShopDemoCover } from "@/data/shopDemos";

export interface DesignViewProps {
  profile: UserProfileData | null;
  onProfileUpdated: (updated: UserProfileData) => void;
}

const BANNER_ASPECT = 21 / 9;

export const DesignView: React.FC<DesignViewProps> = ({ profile, onProfileUpdated }) => {
  const [savingTemplateId, setSavingTemplateId] = useState<string | null>(null);
  const [pickedPalettes, setPickedPalettes] = useState<Record<string, string>>({});
  const [bannerBusy, setBannerBusy] = useState(false);
  const [cropSrc, setCropSrc] = useState("");
  const [cropOpen, setCropOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!profile) return null;

  const isPremium = Boolean(profile.isPremium);
  const banners = profile.banners ?? [];
  const activeTemplate = resolveShopTemplate(profile.shopTemplate ?? DEFAULT_SHOP_TEMPLATE_ID, isPremium);
  const activePalette = getShopPalette(activeTemplate, profile.shopPalette);

  const saveDesign = async (payload: { shopTemplate?: string; shopPalette?: string; banners?: string[] }) => {
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || "Dəyişiklik yadda saxlanılmadı.");
    onProfileUpdated({ ...profile, ...data.user });
  };

  const handleApply = async (templateId: string, paletteId: string) => {
    setSavingTemplateId(templateId);
    try {
      await saveDesign({ shopTemplate: templateId, shopPalette: paletteId });
      showToast("Dizayn tətbiq edildi", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Xəta baş verdi", "error");
    } finally {
      setSavingTemplateId(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCropSrc(reader.result);
        setCropOpen(true);
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleBannerCropped = async (blob: Blob) => {
    setBannerBusy(true);
    try {
      const formData = new FormData();
      formData.append("file", blob, "banner.jpg");
      formData.append("folder", "banners");
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json().catch(() => null);
      if (!uploadRes.ok || !uploadData?.url) {
        throw new Error(uploadData?.error || "Şəkil yüklənmədi.");
      }
      await saveDesign({ banners: [...banners, uploadData.url] });
      showToast("Banner əlavə edildi", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Xəta baş verdi", "error");
    } finally {
      setBannerBusy(false);
    }
  };

  const handleRemoveBanner = async (url: string) => {
    setBannerBusy(true);
    try {
      await saveDesign({ banners: banners.filter((b) => b !== url) });
      showToast("Banner silindi", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Xəta baş verdi", "error");
    } finally {
      setBannerBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      <ImageCropModal
        isOpen={cropOpen}
        onClose={() => setCropOpen(false)}
        imageSrc={cropSrc}
        onCropComplete={handleBannerCropped}
        aspect={BANNER_ASPECT}
      />

      <div
        className={`rounded-3xl border p-5 sm:p-6 flex items-start gap-4 ${
          isPremium ? "bg-amber-50 border-amber-200" : "bg-white border-gray-100"
        }`}
      >
        <div
          className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center ${
            isPremium ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-400"
          }`}
        >
          <Crown size={20} />
        </div>
        <div className="min-w-0">
          <h3 className="font-extrabold text-gray-900 text-base">
            {isPremium ? "Premium mağaza" : "Premium şablonlar"}
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {isPremium
              ? "Bütün şablonlar, rənglər və banner slayderi sizin üçün açıqdır."
              : "Hər şablona nümunə mağazada və öz məhsullarınızla baxa bilərsiniz. Aktivləşdirmək üçün Belink komandası ilə əlaqə saxlayın."}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs flex flex-col gap-5">
        <div>
          <h3 className="font-extrabold text-gray-900 text-base">Mağaza şablonu</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Hazırda aktiv: <span className="font-bold text-gray-700">{activeTemplate.name}</span>
            {activeTemplate.palettes.length > 1 && (
              <>
                {" "}
                · rəng: <span className="font-bold text-gray-700">{activePalette.name}</span>
              </>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SHOP_TEMPLATES.map((template) => {
            const isActive = template.id === activeTemplate.id;
            const isLocked = template.premium && !isPremium;
            const isSaving = savingTemplateId === template.id;
            const cover = getShopDemoCover(template.id);
            const picked = getShopPalette(
              template,
              pickedPalettes[template.id] ?? (isActive ? activePalette.id : null)
            );
            const isCurrentDesign = isActive && picked.id === activePalette.id;
            const previewQuery = `template=${template.id}&palette=${picked.id}`;

            return (
              <div
                key={template.id}
                className={`rounded-2xl overflow-hidden flex flex-col border-2 transition-colors ${
                  isActive ? "border-[#1a7a4a]" : "border-gray-100"
                }`}
              >
                <div
                  className="relative aspect-[16/9] border-b border-gray-100 flex items-center justify-center"
                  style={{ background: picked.bg }}
                >
                  {cover ? (
                    <Image src={cover} alt={`${template.name} şablonunun nümunəsi`} fill unoptimized className="object-cover" />
                  ) : (
                    <span className="text-2xl font-black" style={{ color: picked.accent }}>
                      {template.name}
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900 text-sm">{template.name}</h4>
                      {template.premium && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <Crown size={10} /> Premium
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{template.description}</p>
                  </div>

                  {template.palettes.length > 1 && (
                    <div className="flex items-center gap-2" role="group" aria-label={`${template.name} rəngləri`}>
                      {template.palettes.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPickedPalettes((prev) => ({ ...prev, [template.id]: p.id }))}
                          aria-pressed={p.id === picked.id}
                          aria-label={p.name}
                          title={p.name}
                          className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${
                            p.id === picked.id ? "border-gray-900" : "border-gray-200"
                          }`}
                          style={{ background: `linear-gradient(135deg, ${p.accent} 50%, ${p.bg} 50%)` }}
                        />
                      ))}
                      <span className="text-xs font-semibold text-gray-500 ml-1">{picked.name}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs font-bold text-[#1a7a4a]">
                    {template.premium && (
                      <a
                        href={`/templates/${template.id}?palette=${picked.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Nümunə mağaza
                      </a>
                    )}
                    {profile.username && (
                      <a
                        href={`/${profile.username}?${previewQuery}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Öz mağazamda bax
                      </a>
                    )}
                  </div>

                  <div className="mt-auto pt-1">
                    {isCurrentDesign ? (
                      <span className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full bg-emerald-50 text-[#1a7a4a] text-xs font-bold border border-emerald-200">
                        <Check size={13} strokeWidth={2.5} /> Aktivdir
                      </span>
                    ) : isLocked ? (
                      <span className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full bg-gray-100 text-gray-400 text-xs font-bold">
                        <Lock size={12} /> Yalnız premium üçün
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(template.id, picked.id)}
                        disabled={savingTemplateId !== null}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full bg-[#1a7a4a] hover:bg-[#156040] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : isActive ? (
                          "Rəngi tətbiq et"
                        ) : (
                          "Tətbiq et"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isPremium && (
        <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-gray-900 text-base">Bannerlər</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Premium şablonlarda açılış şəkli və ya slayder kimi göstərilir (ən çoxu {MAX_SHOP_BANNERS} şəkil).
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={bannerBusy || banners.length >= MAX_SHOP_BANNERS}
              className="shrink-0 inline-flex items-center gap-1.5 bg-[#1a7a4a] hover:bg-[#156040] text-white font-bold text-xs px-4 py-2.5 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bannerBusy ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} />}
              <span className="hidden sm:inline">Banner əlavə et</span>
            </button>
          </div>

          {banners.length === 0 ? (
            <div className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center">
              <p className="text-xs text-gray-400 font-medium">Hələ banner əlavə edilməyib.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {banners.map((url, index) => (
                <div
                  key={url}
                  className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-gray-100 bg-gray-50"
                >
                  <Image src={url} alt={`Banner ${index + 1}`} fill unoptimized className="object-cover" />
                  <button
                    onClick={() => handleRemoveBanner(url)}
                    disabled={bannerBusy}
                    aria-label={`Banner ${index + 1} sil`}
                    title="Banneri sil"
                    className="absolute top-2 right-2 p-2.5 rounded-full bg-white/95 text-red-500 hover:text-red-600 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DesignView;
