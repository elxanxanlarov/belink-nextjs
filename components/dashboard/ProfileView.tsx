"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Camera, Loader2, Check, Copy } from "lucide-react";
import { UserProfileData } from "@/types";
import { AvatarImage } from "@/components/ui/AvatarImage";
import { Input } from "@/components/ui/Input";
import { showToast } from "@/lib/swal";
import ImageCropModal from "@/components/modals/ImageCropModal";
import ImagePreviewModal from "@/components/modals/ImagePreviewModal";

export interface ProfileViewProps {
  initialProfile: UserProfileData | null;
  onProfileUpdated: (updated: UserProfileData) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  initialProfile,
  onProfileUpdated,
}) => {
  const { update: updateSession } = useSession();
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // Local pending cropped image state before saving to cloud
  const [pendingCropSrc, setPendingCropSrc] = useState<string>("");
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  // Image zoom preview modal
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.name || "");
      setShopName(initialProfile.shopName || "");
      setBio(initialProfile.bio || "");
      setImage(initialProfile.image || null);
    }
  }, [initialProfile]);

  // When user selects a file -> open crop modal (do not upload yet!)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPendingCropSrc(reader.result);
        setCropModalOpen(true);
      }
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // When user completes cropping in modal
  const handleCropComplete = (blob: Blob, dataUrl: string) => {
    setPendingBlob(blob);
    setLocalPreviewUrl(dataUrl);
    showToast("Şəkil kəsildi. Yadda saxla düyməsinə klikləyərək təsdiqləyin.", "info");
  };

  // Submit form -> upload to Cloud (if new image) and save profile
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalImageUrl = image;

      // Only upload to Cloudinary when saving!
      if (pendingBlob) {
        const formData = new FormData();
        formData.append("file", pendingBlob, "avatar.jpg");
        formData.append("folder", "avatars");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Şəkil bulud yaddaşına yüklənmədi.");

        finalImageUrl = uploadData.url;
        setImage(uploadData.url);
        setPendingBlob(null);
        setLocalPreviewUrl(null);
      }

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          shopName,
          bio,
          image: finalImageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Profil yenilənmədi.");

      onProfileUpdated(data.user);
      await updateSession({ name: data.user.name, image: data.user.image });
      showToast("Profil uğurla yeniləndi", "success");
    } catch (error: any) {
      showToast(error.message || "Xəta baş verdi. Yenidən cəhd edin", "error");
    } finally {
      setSaving(false);
    }
  };

  const copyStoreLink = () => {
    if (!initialProfile?.username) return;
    const url = `${window.location.origin}/${initialProfile.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast("Mağaza linki kopyalandı", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const currentDisplayImage = localPreviewUrl || image;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 max-w-2xl mx-auto shadow-xs">
      <ImageCropModal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={pendingCropSrc}
        onCropComplete={handleCropComplete}
      />

      <ImagePreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        imageUrl={currentDisplayImage || ""}
        altText={name || "Profil şəkli"}
      />

      <div className="flex flex-col items-center gap-4 mb-8 text-center">
        <div className="relative group">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          <div
            onClick={() => {
              if (currentDisplayImage) {
                setPreviewModalOpen(true);
              }
            }}
            className="cursor-pointer hover:scale-105 transition-transform"
            title="Şəklə böyük bax"
          >
            <AvatarImage
              src={currentDisplayImage}
              alt={name || "User"}
              size={88}
              fallbackInitials={name ? name[0] : "U"}
              className="border-2 border-emerald-100 shadow-md"
            />
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2.5 rounded-full bg-[#1a7a4a] text-white shadow-md hover:bg-[#156040] transition-colors cursor-pointer"
            title="Şəkli dəyişdir"
          >
            <Camera size={16} />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-gray-900">{name || "İstifadəçi"}</h3>
          <p className="text-xs text-gray-400">{initialProfile?.email}</p>
        </div>

        {initialProfile?.username && (
          <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
            <span className="text-xs font-bold text-[#1a7a4a]">
              belink.az/{initialProfile.username}
            </span>
            <button
              type="button"
              onClick={copyStoreLink}
              className="text-emerald-700 hover:text-emerald-900 p-0.5 cursor-pointer"
              title="Linki kopyala"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <Input
          label="Ad və Soyad"
          type="text"
          maxLength={50}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Adınız"
        />

        <Input
          label="Mağaza Adı"
          type="text"
          maxLength={50}
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          placeholder="məs: Butik Baku"
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-700">Mağaza Haqqında (Bio)</label>
          <textarea
            rows={3}
            maxLength={250}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Qısa məlumat, çatdırılma şərtləri və s."
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#1a7a4a] focus:ring-1 focus:ring-[#1a7a4a] resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-2 w-full py-3.5 rounded-full bg-[#1a7a4a] hover:bg-[#156040] text-white font-bold text-sm transition-all shadow-md shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : "Dəyişiklikləri Yadda Saxla"}
        </button>
      </form>
    </div>
  );
};

export default ProfileView;

