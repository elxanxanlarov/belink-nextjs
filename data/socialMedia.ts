export interface SocialPlatformConfig {
  id: "instagram" | "tiktok" | "linkedin" | "twitter" | "facebook" | "youtube";
  name: string;
  domainPrefix: string;
  baseUrl: string;
  placeholder: string;
  colorClass: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  validateHandle: (input: string) => { isValid: boolean; normalizedUrl: string; handle: string; error?: string };
}

// Clean handle by stripping domain, protocols, query params and leading @
export function extractHandle(input: string, platformBase: string): string {
  if (!input) return "";
  let clean = input.trim();
  // Remove protocol
  clean = clean.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  // Remove platform domain if present
  const regex = new RegExp(`^${platformBase.replace(/^https?:\/\//i, "").replace(/^www\./i, "")}`, "i");
  clean = clean.replace(regex, "");
  // Remove query params or trailing slashes
  clean = clean.split("?")[0].replace(/^\/+|\/+$/g, "");
  // Remove leading @
  clean = clean.replace(/^@+/, "");
  return clean;
}

export const SOCIAL_PLATFORMS: SocialPlatformConfig[] = [
  {
    id: "instagram",
    name: "Instagram",
    domainPrefix: "instagram.com/",
    baseUrl: "https://instagram.com/",
    placeholder: "istifadeci_adi",
    colorClass: "hover:text-pink-600 hover:border-pink-300 hover:bg-pink-50/50",
    badgeBg: "bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600",
    badgeText: "text-pink-600",
    badgeBorder: "border-pink-200",
    validateHandle: (input: string) => {
      const handle = extractHandle(input, "instagram.com/");
      if (!handle) return { isValid: true, normalizedUrl: "", handle: "" };
      const isValid = /^[a-zA-Z0-9._]{1,30}$/.test(handle);
      return {
        isValid,
        normalizedUrl: isValid ? `https://instagram.com/${handle}` : input,
        handle,
        error: isValid ? undefined : "Yalnız hərf, rəqəm, nöqtə və alt xətt ola bilər (max 30 simvol).",
      };
    },
  },
  {
    id: "tiktok",
    name: "TikTok",
    domainPrefix: "tiktok.com/@",
    baseUrl: "https://tiktok.com/@",
    placeholder: "istifadeci_adi",
    colorClass: "hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50",
    badgeBg: "bg-black",
    badgeText: "text-gray-900",
    badgeBorder: "border-gray-300",
    validateHandle: (input: string) => {
      const handle = extractHandle(input, "tiktok.com/@").replace(/^@/, "");
      if (!handle) return { isValid: true, normalizedUrl: "", handle: "" };
      const isValid = /^[a-zA-Z0-9._]{2,24}$/.test(handle);
      return {
        isValid,
        normalizedUrl: isValid ? `https://tiktok.com/@${handle}` : input,
        handle,
        error: isValid ? undefined : "TikTok adı 2-24 simvol, hərf, rəqəm və alt xətt ola bilər.",
      };
    },
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    domainPrefix: "linkedin.com/in/",
    baseUrl: "https://linkedin.com/in/",
    placeholder: "ad-soyad",
    colorClass: "hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50",
    badgeBg: "bg-[#0a66c2]",
    badgeText: "text-blue-600",
    badgeBorder: "border-blue-200",
    validateHandle: (input: string) => {
      const handle = extractHandle(input, "linkedin.com/in/");
      if (!handle) return { isValid: true, normalizedUrl: "", handle: "" };
      const isValid = /^[a-zA-Z0-9-_]{3,100}$/.test(handle);
      return {
        isValid,
        normalizedUrl: isValid ? `https://linkedin.com/in/${handle}` : input,
        handle,
        error: isValid ? undefined : "Düzgün LinkedIn istifadəçi adı və ya profil linki daxil edin.",
      };
    },
  },
  {
    id: "twitter",
    name: "Twitter / X",
    domainPrefix: "x.com/",
    baseUrl: "https://x.com/",
    placeholder: "istifadeci_adi",
    colorClass: "hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50",
    badgeBg: "bg-black",
    badgeText: "text-gray-900",
    badgeBorder: "border-gray-300",
    validateHandle: (input: string) => {
      const handle = extractHandle(input, "x.com/");
      if (!handle) return { isValid: true, normalizedUrl: "", handle: "" };
      const isValid = /^[a-zA-Z0-9_]{1,15}$/.test(handle);
      return {
        isValid,
        normalizedUrl: isValid ? `https://x.com/${handle}` : input,
        handle,
        error: isValid ? undefined : "X istifadəçi adı 1-15 simvol ola bilər.",
      };
    },
  },
  {
    id: "facebook",
    name: "Facebook",
    domainPrefix: "facebook.com/",
    baseUrl: "https://facebook.com/",
    placeholder: "sehife_ve_ya_ad",
    colorClass: "hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50/50",
    badgeBg: "bg-[#1877f2]",
    badgeText: "text-blue-700",
    badgeBorder: "border-blue-200",
    validateHandle: (input: string) => {
      const handle = extractHandle(input, "facebook.com/");
      if (!handle) return { isValid: true, normalizedUrl: "", handle: "" };
      const isValid = /^[a-zA-Z0-9.]{3,50}$/.test(handle);
      return {
        isValid,
        normalizedUrl: isValid ? `https://facebook.com/${handle}` : input,
        handle,
        error: isValid ? undefined : "Düzgün Facebook səhifə və ya istifadəçi adı daxil edin.",
      };
    },
  },
  {
    id: "youtube",
    name: "YouTube",
    domainPrefix: "youtube.com/@",
    baseUrl: "https://youtube.com/@",
    placeholder: "kanal_adi",
    colorClass: "hover:text-red-600 hover:border-red-300 hover:bg-red-50/50",
    badgeBg: "bg-[#ff0000]",
    badgeText: "text-red-600",
    badgeBorder: "border-red-200",
    validateHandle: (input: string) => {
      const handle = extractHandle(input, "youtube.com/@").replace(/^@/, "");
      if (!handle) return { isValid: true, normalizedUrl: "", handle: "" };
      const isValid = /^[a-zA-Z0-9._-]{3,30}$/.test(handle);
      return {
        isValid,
        normalizedUrl: isValid ? `https://youtube.com/@${handle}` : input,
        handle,
        error: isValid ? undefined : "Düzgün YouTube kanal adı daxil edin.",
      };
    },
  },
];
