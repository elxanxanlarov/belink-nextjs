"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import {
  Camera,
  Loader2,
  Check,
  Copy,
  Pencil,
  X,
  ExternalLink,
  AlertCircle,
  Link as LinkIcon,
  AtSign,
  Plus,
  Trash2,
  ChevronDown,
} from "lucide-react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Swal from "sweetalert2";
import { UserProfileData } from "@/types";
import { AvatarImage } from "@/components/ui/AvatarImage";
import { Input } from "@/components/ui/Input";
import { showToast } from "@/lib/swal";
import ImageCropModal from "@/components/modals/ImageCropModal";
import ImagePreviewModal from "@/components/modals/ImagePreviewModal";
import { SOCIAL_PLATFORMS, extractHandle } from "@/data/socialMedia";
import {
  InstagramIcon,
  TikTokIcon,
  LinkedInIcon,
  TwitterIcon,
  FacebookIcon,
  YouTubeIcon,
} from "@/assets/icons";

export interface ProfileViewProps {
  initialProfile: UserProfileData | null;
  onProfileUpdated: (updated: UserProfileData) => void;
}

type InputMode = "handle" | "link";

export const ProfileView: React.FC<ProfileViewProps> = ({
  initialProfile,
  onProfileUpdated,
}) => {
  const { update: updateSession } = useSession();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [whatsappPhone, setWhatsappPhone] = useState<string>("");
  const [highlightPhone, setHighlightPhone] = useState(false);

  useEffect(() => {
    if (searchParams?.get("phoneInput") === "true") {
      const timer = setTimeout(() => {
        const container = document.getElementById("whatsapp-phone-container");
        if (container) {
          container.scrollIntoView({ behavior: "smooth", block: "center" });
          const input = container.querySelector("input");
          if (input) {
            input.focus();
          }
          setHighlightPhone(true);
          setTimeout(() => setHighlightPhone(false), 3500);
        }
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const [socialValues, setSocialValues] = useState<Record<string, string>>({
    instagram: "",
    tiktok: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    youtube: "",
  });

  const [addedPlatforms, setAddedPlatforms] = useState<string[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);

  const [inputModes, setInputModes] = useState<Record<string, InputMode>>({
    instagram: "handle",
    tiktok: "handle",
    linkedin: "handle",
    twitter: "handle",
    facebook: "handle",
    youtube: "handle",
  });

  const [socialErrors, setSocialErrors] = useState<Record<string, string>>({});

  const [pendingCropSrc, setPendingCropSrc] = useState<string>("");
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [usernameSaving, setUsernameSaving] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setShowAddMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.name || "");
      setShopName(initialProfile.shopName || "");
      setBio(initialProfile.bio || "");
      setImage(initialProfile.image || null);
      setWhatsappPhone(initialProfile.whatsappPhone || "");

      const initialSocial: Record<string, string> = {
        instagram: extractHandle(initialProfile.instagram || "", "instagram.com/"),
        tiktok: extractHandle(initialProfile.tiktok || "", "tiktok.com/@"),
        linkedin: extractHandle(initialProfile.linkedin || "", "linkedin.com/in/"),
        twitter: extractHandle(initialProfile.twitter || "", "x.com/"),
        facebook: extractHandle(initialProfile.facebook || "", "facebook.com/"),
        youtube: extractHandle(initialProfile.youtube || "", "youtube.com/@"),
      };

      setSocialValues(initialSocial);

      const existingActive = Object.entries(initialSocial)
        .filter(([_, val]) => Boolean(val && val.trim()))
        .map(([key]) => key);

      setAddedPlatforms(existingActive);
    }
  }, [initialProfile]);

  const isDirty = useMemo(() => {
    if (!initialProfile) return false;
    if (name !== (initialProfile.name || "")) return true;
    if (shopName !== (initialProfile.shopName || "")) return true;
    if (bio !== (initialProfile.bio || "")) return true;
    if (whatsappPhone !== (initialProfile.whatsappPhone || "")) return true;
    if (pendingBlob !== null) return true;

    const initialInstagram = extractHandle(initialProfile.instagram || "", "instagram.com/");
    const initialTiktok = extractHandle(initialProfile.tiktok || "", "tiktok.com/@");
    const initialLinkedin = extractHandle(initialProfile.linkedin || "", "linkedin.com/in/");
    const initialTwitter = extractHandle(initialProfile.twitter || "", "x.com/");
    const initialFacebook = extractHandle(initialProfile.facebook || "", "facebook.com/");
    const initialYoutube = extractHandle(initialProfile.youtube || "", "youtube.com/@");

    const initialMap: Record<string, string> = {
      instagram: initialInstagram,
      tiktok: initialTiktok,
      linkedin: initialLinkedin,
      twitter: initialTwitter,
      facebook: initialFacebook,
      youtube: initialYoutube,
    };

    const initialActive = Object.entries(initialMap)
      .filter(([_, val]) => Boolean(val && val.trim()))
      .map(([key]) => key);

    if (
      addedPlatforms.length !== initialActive.length ||
      !addedPlatforms.every((p) => initialActive.includes(p))
    ) {
      return true;
    }

    for (const key of addedPlatforms) {
      if ((socialValues[key] || "").trim() !== (initialMap[key] || "").trim()) {
        return true;
      }
    }

    return false;
  }, [name, shopName, bio, whatsappPhone, pendingBlob, socialValues, addedPlatforms, initialProfile]);

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

  const handleCropComplete = (blob: Blob, dataUrl: string) => {
    setPendingBlob(blob);
    setLocalPreviewUrl(dataUrl);
    showToast("Şəkil kəsildi. Yadda saxla düyməsinə klikləyərək təsdiqləyin.", "info");
  };

  const handleSocialChange = (platformId: string, value: string) => {
    setSocialValues((prev) => ({ ...prev, [platformId]: value }));

    const platform = SOCIAL_PLATFORMS.find((p) => p.id === platformId);
    if (platform) {
      const res = platform.validateHandle(value);
      setSocialErrors((prev) => ({
        ...prev,
        [platformId]: res.isValid ? "" : (res.error || "Yanlış format"),
      }));
    }
  };

  const toggleInputMode = (platformId: string, mode: InputMode) => {
    setInputModes((prev) => ({ ...prev, [platformId]: mode }));
  };

  const handleAddPlatform = (platformId: string) => {
    if (!addedPlatforms.includes(platformId)) {
      setAddedPlatforms((prev) => [...prev, platformId]);
    }
    setShowAddMenu(false);
  };

  const handleRemovePlatform = (platformId: string) => {
    setAddedPlatforms((prev) => prev.filter((id) => id !== platformId));
    setSocialValues((prev) => ({ ...prev, [platformId]: "" }));
    setSocialErrors((prev) => ({ ...prev, [platformId]: "" }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");

    if (whatsappPhone && !isValidPhoneNumber(whatsappPhone)) {
      setPhoneError("Düzgün telefon nömrəsi daxil edin.");
      return;
    }

    const errors: Record<string, string> = {};
    const normalizedSocial: Record<string, string | null> = {};

    SOCIAL_PLATFORMS.forEach((platform) => {
      if (addedPlatforms.includes(platform.id)) {
        const rawVal = socialValues[platform.id] || "";
        const valRes = platform.validateHandle(rawVal);
        if (!valRes.isValid) {
          errors[platform.id] = valRes.error || "Yanlış format";
        } else {
          normalizedSocial[platform.id] = valRes.normalizedUrl || null;
        }
      } else {
        normalizedSocial[platform.id] = null;
      }
    });

    if (Object.keys(errors).length > 0) {
      setSocialErrors(errors);
      showToast("Lütfən sosial media xanalarındakı xətaları düzəldin", "error");
      return;
    }

    const confirmResult = await Swal.fire({
      title: "Dəyişiklikləri yadda saxla?",
      text: "Profil məlumatlarınız yenilənəcək.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Bəli, yadda saxla",
      cancelButtonText: "Ləğv et",
      customClass: {
        popup: "rounded-3xl shadow-2xl font-sans border border-gray-100",
        confirmButton: "px-6 py-2.5 rounded-full font-bold text-sm bg-[#1a7a4a] text-white cursor-pointer mr-2",
        cancelButton: "px-6 py-2.5 rounded-full font-bold text-sm bg-gray-100 text-gray-700 cursor-pointer",
      },
      buttonsStyling: false,
    });

    if (!confirmResult.isConfirmed) return;

    setSaving(true);
    try {
      let finalImageUrl = image;

      if (pendingBlob) {
        const formData = new FormData();
        formData.append("file", pendingBlob, "avatar.jpg");
        formData.append("folder", "avatars");
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
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
          whatsappPhone: whatsappPhone || null,
          instagram: normalizedSocial.instagram,
          tiktok: normalizedSocial.tiktok,
          linkedin: normalizedSocial.linkedin,
          twitter: normalizedSocial.twitter,
          facebook: normalizedSocial.facebook,
          youtube: normalizedSocial.youtube,
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

  const handleUsernameEdit = () => {
    setUsernameInput(initialProfile?.username || "");
    setUsernameError("");
    setEditingUsername(true);
  };

  const handleUsernameSave = async () => {
    if (!usernameInput.trim()) return;
    setUsernameSaving(true);
    setUsernameError("");
    try {
      const res = await fetch("/api/user/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setUsernameError(data.error || "Xəta baş verdi.");
        return;
      }
      onProfileUpdated({ ...initialProfile!, username: data.user.username });
      setEditingUsername(false);
      showToast("İstifadəçi adı dəyişdirildi", "success");
    } catch {
      setUsernameError("Xəta baş verdi. Yenidən cəhd edin.");
    } finally {
      setUsernameSaving(false);
    }
  };

  const handleReset = () => {
    if (!initialProfile) return;
    setName(initialProfile.name || "");
    setShopName(initialProfile.shopName || "");
    setBio(initialProfile.bio || "");
    setImage(initialProfile.image || null);
    setWhatsappPhone(initialProfile.whatsappPhone || "");

    const initialSocial: Record<string, string> = {
      instagram: extractHandle(initialProfile.instagram || "", "instagram.com/"),
      tiktok: extractHandle(initialProfile.tiktok || "", "tiktok.com/@"),
      linkedin: extractHandle(initialProfile.linkedin || "", "linkedin.com/in/"),
      twitter: extractHandle(initialProfile.twitter || "", "x.com/"),
      facebook: extractHandle(initialProfile.facebook || "", "facebook.com/"),
      youtube: extractHandle(initialProfile.youtube || "", "youtube.com/@"),
    };

    setSocialValues(initialSocial);

    const existingActive = Object.entries(initialSocial)
      .filter(([_, val]) => Boolean(val && val.trim()))
      .map(([key]) => key);

    setAddedPlatforms(existingActive);
    setPendingBlob(null);
    setLocalPreviewUrl(null);
    setSocialErrors({});
    setPhoneError("");
  };

  const currentDisplayImage = localPreviewUrl || image;

  const renderSocialIcon = (id: string) => {
    switch (id) {
      case "instagram":
        return <InstagramIcon size={18} className="text-pink-600" />;
      case "tiktok":
        return <TikTokIcon size={18} className="text-gray-900" />;
      case "linkedin":
        return <LinkedInIcon size={18} className="text-blue-600" />;
      case "twitter":
        return <TwitterIcon size={18} className="text-gray-900" />;
      case "facebook":
        return <FacebookIcon size={18} className="text-blue-700" />;
      case "youtube":
        return <YouTubeIcon size={18} className="text-red-600" />;
      default:
        return null;
    }
  };

  const availableToAdd = SOCIAL_PLATFORMS.filter((p) => !addedPlatforms.includes(p.id));

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 max-w-2xl mx-auto shadow-xs select-none">
      <ImageCropModal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={pendingCropSrc}
        onCropComplete={handleCropComplete}
        circular
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
              if (currentDisplayImage) setPreviewModalOpen(true);
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
          >
            <Camera size={16} />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-gray-900">{name || "İstifadəçi"}</h3>
          <p className="text-xs text-gray-400">{initialProfile?.email}</p>
        </div>

        {initialProfile?.username && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
              <span className="text-xs font-bold text-[#1a7a4a]">
                belink.az/{initialProfile.username}
              </span>
              <a
                href={`/${initialProfile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-900 p-0.5"
                title="Mağazaya get"
              >
                <ExternalLink size={14} />
              </a>
              <button
                type="button"
                onClick={copyStoreLink}
                className="text-emerald-700 hover:text-emerald-900 p-0.5 cursor-pointer"
                title="Linki kopyala"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            {editingUsername ? (
              <div className="flex flex-col items-center gap-1.5 w-full max-w-xs">
                <div className="flex items-center gap-2 w-full">
                  <span className="text-xs text-gray-400 font-bold shrink-0">belink.az/</span>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => {
                      setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""));
                      setUsernameError("");
                    }}
                    maxLength={30}
                    className="flex-1 min-w-0 px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#1a7a4a] focus:ring-1 focus:ring-[#1a7a4a]"
                    placeholder="yeni_ad"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleUsernameSave}
                    disabled={usernameSaving}
                    className="p-1.5 rounded-full bg-[#1a7a4a] text-white hover:bg-[#156040] transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {usernameSaving ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Check size={13} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingUsername(false);
                      setUsernameError("");
                    }}
                    className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer shrink-0"
                  >
                    <X size={13} />
                  </button>
                </div>
                {usernameError && (
                  <span className="text-xs text-red-500 font-semibold">{usernameError}</span>
                )}
                <span className="text-[10px] text-gray-400">
                  Yalnız kiçik hərf, rəqəm və _ istifadə edin
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleUsernameEdit}
                className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-[#1a7a4a] transition-colors cursor-pointer group"
              >
                <Pencil size={11} className="group-hover:text-[#1a7a4a]" />
                İstifadəçi adını dəyiş
              </button>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5 select-none">
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

        <div className="flex flex-col gap-1.5" id="whatsapp-phone-container">
          <label className="text-xs font-bold text-gray-700">
            WhatsApp Nömrəsi
            <span className="text-gray-400 font-normal ml-1">
              (müştərilər sifariş üçün bu nömrəyə yönləndiriləcək)
            </span>
          </label>
          <div
            className={`px-4 py-3 rounded-2xl border bg-white transition-all duration-300 ${
              highlightPhone
                ? "border-[#1a7a4a] ring-4 ring-emerald-200 shadow-lg scale-[1.01]"
                : phoneError
                ? "border-red-400 ring-2 ring-red-100"
                : "border-gray-200 focus-within:border-[#1a7a4a] focus-within:ring-2 focus-within:ring-emerald-100"
            }`}
          >
            <PhoneInput
              international
              defaultCountry="AZ"
              value={whatsappPhone}
              onChange={(val) => {
                setWhatsappPhone(val || "");
                setPhoneError("");
              }}
              className="w-full text-sm text-gray-900"
            />
          </div>
          {phoneError && <span className="text-xs text-red-500 font-semibold">{phoneError}</span>}
          <span className="text-[11px] text-gray-400">Beynəlxalq format: +994 50 XXX XX XX</span>
        </div>

        <div className="flex flex-col gap-3.5 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-gray-900">
                Sosial Şəbəkələr
              </label>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Mağazanız üçün sosial media hesablarını əlavə edin.
              </p>
            </div>

            {availableToAdd.length > 0 && (
              <div className="relative" ref={addMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowAddMenu(!showAddMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#1a7a4a] text-xs font-bold transition-all border border-emerald-200 cursor-pointer"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span>Əlavə et</span>
                  <ChevronDown size={13} className={`transition-transform ${showAddMenu ? "rotate-180" : ""}`} />
                </button>

                {showAddMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                    {availableToAdd.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleAddPlatform(p.id)}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-[#1a7a4a] transition-colors cursor-pointer text-left"
                      >
                        <div className="shrink-0">{renderSocialIcon(p.id)}</div>
                        <span>{p.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {addedPlatforms.length === 0 ? (
            <div className="p-5 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center flex flex-col items-center gap-2">
              <p className="text-xs text-gray-400 font-medium">
                Hələ heç bir sosial şəbəkə hesabı əlavə edilməyib.
              </p>
              {availableToAdd.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAddMenu(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a7a4a] hover:underline cursor-pointer"
                >
                  <Plus size={13} /> İlk sosial şəbəkəni əlavə et
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {addedPlatforms.map((platformId) => {
                const platform = SOCIAL_PLATFORMS.find((p) => p.id === platformId);
                if (!platform) return null;

                const val = socialValues[platform.id] || "";
                const err = socialErrors[platform.id];
                const isValidHandle = val && !err;
                const mode = inputModes[platform.id] || "handle";

                return (
                  <div
                    key={platform.id}
                    className="flex flex-col gap-1.5 p-3 rounded-2xl bg-gray-50/60 border border-gray-100 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="shrink-0">{renderSocialIcon(platform.id)}</div>
                        <span className="text-xs font-bold text-gray-800">{platform.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-gray-200/80 p-0.5 rounded-lg text-[11px] font-semibold">
                          <button
                            type="button"
                            onClick={() => toggleInputMode(platform.id, "handle")}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${mode === "handle"
                                ? "bg-white text-[#1a7a4a] shadow-2xs font-bold"
                                : "text-gray-500 hover:text-gray-700"
                              }`}
                          >
                            <AtSign size={12} />
                            İstifadəçi adı
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleInputMode(platform.id, "link")}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${mode === "link"
                                ? "bg-white text-[#1a7a4a] shadow-2xs font-bold"
                                : "text-gray-500 hover:text-gray-700"
                              }`}
                          >
                            <LinkIcon size={12} />
                            Link
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemovePlatform(platform.id)}
                          className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Sil"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border bg-white transition-all min-w-0 overflow-hidden ${err
                          ? "border-red-300 ring-1 ring-red-100"
                          : isValidHandle
                            ? "border-emerald-300 ring-1 ring-emerald-100"
                            : "border-gray-200 focus-within:border-[#1a7a4a] focus-within:ring-1 focus-within:ring-[#1a7a4a]"
                        }`}
                    >
                      {mode === "handle" && (
                        <span className="text-xs font-semibold text-gray-400 select-none shrink-0">
                          {platform.domainPrefix}
                        </span>
                      )}

                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleSocialChange(platform.id, e.target.value)}
                        placeholder={
                          mode === "handle"
                            ? platform.placeholder
                            : `https://${platform.domainPrefix}${platform.placeholder}`
                        }
                        className="flex-1 min-w-0 text-xs text-gray-900 focus:outline-none bg-transparent"
                      />

                      {isValidHandle && (
                        <div className="shrink-0 flex items-center justify-center text-emerald-500 pl-1">
                          <Check size={15} strokeWidth={2.5} />
                        </div>
                      )}
                      {err && (
                        <div className="shrink-0 flex items-center justify-center text-red-500 pl-1">
                          <AlertCircle size={15} />
                        </div>
                      )}
                    </div>

                    {err && (
                      <span className="text-[10px] text-red-500 font-semibold px-1">
                        {err}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          {isDirty && (
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="px-5 py-2.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Ləğv et
            </button>
          )}

          <button
            type="submit"
            disabled={!isDirty || saving}
            className="px-6 py-2.5 rounded-full bg-[#1a7a4a] hover:bg-[#156040] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Yadda saxlanılır...
              </>
            ) : (
              "Yadda Saxla"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileView;
