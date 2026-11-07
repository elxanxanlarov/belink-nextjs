import crypto from "node:crypto";
import {
  ETIRAF_DESIGN_IDS,
  ETIRAF_MESSAGE_MAX,
  ETIRAF_TITLE_MAX,
  type EtirafAllowance,
  type EtirafDesign,
} from "@/lib/etirafShared";

export * from "@/lib/etirafShared";

const BASE62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const LOWER_ALNUM = "abcdefghijklmnopqrstuvwxyz0123456789";

function randomString(length: number, alphabet: string): string {
  const bytes = crypto.randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

/** Admin dəvət linki üçün token (/etiraf/yarat/{token}). */
export const generateInviteToken = () => randomString(12, BASE62);

/** İctimai etiraf səhifəsinin ünvanı (/etiraf/{slug}). Sonda rəqəm olduğu üçün "yarat" ilə toqquşmur. */
export const generateSlug = () => randomString(7, LOWER_ALNUM) + randomString(1, "0123456789");

function isCloudinaryUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}

export interface EtirafPayload {
  title: string | null;
  message: string | null;
  photos: string[];
  audioUrl: string | null;
  design: EtirafDesign;
}

export function validateEtirafPayload(
  invite: EtirafAllowance & { maxPhotos: number },
  body: Record<string, unknown>
): { ok: true; data: EtirafPayload } | { ok: false; error: string } {
  const title = typeof body.title === "string" ? body.title.trim().slice(0, ETIRAF_TITLE_MAX) : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const photos: unknown[] = Array.isArray(body.photos) ? body.photos : [];
  const audioUrl = body.audioUrl || null;
  const design = ETIRAF_DESIGN_IDS.includes(body.design as EtirafDesign) ? (body.design as EtirafDesign) : "red";

  if (photos.length && !invite.allowPhotos) return { ok: false, error: "Bu link ilə şəkil əlavə etmək olmaz." };
  if (message && !invite.allowText) return { ok: false, error: "Bu link ilə yazı əlavə etmək olmaz." };
  if (audioUrl && !invite.allowAudio) return { ok: false, error: "Bu link ilə səsli mesaj əlavə etmək olmaz." };

  if (photos.length > invite.maxPhotos) return { ok: false, error: `Maksimum ${invite.maxPhotos} şəkil əlavə etmək olar.` };
  if (!photos.every(isCloudinaryUrl)) return { ok: false, error: "Şəkil ünvanları yanlışdır." };
  if (message.length > ETIRAF_MESSAGE_MAX) return { ok: false, error: `Mətn ${ETIRAF_MESSAGE_MAX} simvoldan çox ola bilməz.` };
  if (audioUrl !== null && !isCloudinaryUrl(audioUrl)) return { ok: false, error: "Səs faylının ünvanı yanlışdır." };

  if (!photos.length && !message && !audioUrl) {
    return { ok: false, error: "Etiraf boş ola bilməz — ən azı bir məzmun əlavə edin." };
  }

  return {
    ok: true,
    data: {
      title: title || null,
      message: message || null,
      photos: photos as string[],
      audioUrl: audioUrl as string | null,
      design,
    },
  };
}
