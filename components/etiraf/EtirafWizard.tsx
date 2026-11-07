"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Eye,
  ImageIcon,
  Loader2,
  Mic,
  Palette,
  Plus,
  Type,
  X,
} from "lucide-react";
import {
  ETIRAF_DESIGNS,
  ETIRAF_MESSAGE_MAX,
  ETIRAF_TITLE_MAX,
  etirafPublicUrl,
  etirafWhatsappUrl,
  type EtirafDesign,
} from "@/lib/etirafShared";
import { cldImage } from "@/lib/cloudinaryUrl";
import { showToast } from "@/lib/swal";
import { EtirafLogo } from "@/components/etiraf/EtirafLogo";
import { EtirafView } from "@/components/etiraf/EtirafView";
import { AudioRecorder } from "@/components/etiraf/AudioRecorder";

export interface EtirafWizardInvite {
  token: string;
  allowPhotos: boolean;
  allowText: boolean;
  allowAudio: boolean;
  maxPhotos: number;
}

interface PhotoItem {
  id: string;
  preview: string;
  url: string | null;
}

const STEPS = ["Məzmun", "Baxış", "Hazır"];

/** Şəkli yükləmədən əvvəl kiçildir (ən uzun tərəf 1600px) — sürətli yüklənmə və 4.5 MB limitinə uyğunluq üçün. */
async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const max = 1600;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b || file), "image/jpeg", 0.86));
}

async function uploadPhoto(file: File): Promise<string> {
  const blob = await compressImage(file);
  const formData = new FormData();
  formData.append("file", blob, "etiraf.jpg");
  formData.append("folder", "etiraf");
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.url) throw new Error(data?.error || "Şəkil yüklənmədi.");
  return data.url as string;
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-start justify-between px-2">
      {STEPS.map((label, i) => (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center gap-1.5 w-16">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                i < step
                  ? "bg-[#8b1424] border-[#8b1424] text-white"
                  : i === step
                    ? "bg-[#c8102e] border-[#c8102e] text-white"
                    : "bg-white border-gray-300 text-gray-500"
              }`}
            >
              {i < step ? <Check size={14} /> : i + 1}
            </span>
            <span className={`text-xs font-semibold ${i === step ? "text-[#c8102e]" : "text-gray-500"}`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mt-4 ${i < step ? "bg-[#8b1424]" : "bg-gray-200"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function Section({
  icon,
  title,
  hint,
  aside,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  hint?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-rose-100 bg-white p-4 flex flex-col gap-3 shadow-[0_4px_20px_rgba(139,20,36,0.05)]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-bold text-gray-900 text-[15px]">
          <span className="text-[#c8102e]">{icon}</span>
          {title}
          {hint && <span className="text-xs font-medium text-gray-400">({hint})</span>}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

const DESIGN_SWATCH: Record<EtirafDesign, string> = {
  red: "bg-[radial-gradient(ellipse_at_top,#a3162b,#4a0711)]",
  polaroid: "bg-[radial-gradient(ellipse_at_top,#fff8f1,#ecd3c3)]",
  night: "bg-[radial-gradient(ellipse_at_top,#1d2d5c,#060a1c)]",
};

export function EtirafWizard({
  invite,
  customer,
}: {
  invite: EtirafWizardInvite;
  customer: { name: string | null; email: string | null };
}) {
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [message, setMessage] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [design, setDesign] = useState<EtirafDesign>("red");
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [slug, setSlug] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploading = photos.some((p) => !p.url);
  const readyPhotos = photos.filter((p) => p.url).map((p) => p.url!) as string[];
  const hasContent = readyPhotos.length > 0 || message.trim().length > 0 || Boolean(audioUrl);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    const room = invite.maxPhotos - photos.length;
    if (room <= 0) {
      showToast(`Maksimum ${invite.maxPhotos} şəkil əlavə etmək olar.`, "error");
      return;
    }
    if (files.length > room) showToast(`Yalnız ${room} şəkil əlavə olundu (maks. ${invite.maxPhotos}).`, "info");

    const items = files.slice(0, room).map((file) => ({
      id: crypto.randomUUID(),
      preview: URL.createObjectURL(file),
      url: null,
      file,
    }));
    setPhotos((prev) => [...prev, ...items.map(({ id, preview, url }) => ({ id, preview, url }))]);

    // Paralel, amma eyni anda ən çox 3 yükləmə.
    const queue = [...items];
    const worker = async () => {
      while (queue.length) {
        const item = queue.shift()!;
        try {
          const url = await uploadPhoto(item.file);
          setPhotos((prev) => prev.map((p) => (p.id === item.id ? { ...p, url } : p)));
        } catch (error) {
          setPhotos((prev) => prev.filter((p) => p.id !== item.id));
          showToast(error instanceof Error ? error.message : "Şəkil yüklənmədi.", "error");
        }
      }
    };
    await Promise.all([worker(), worker(), worker()]);
  };

  const removePhoto = (id: string) => setPhotos((prev) => prev.filter((p) => p.id !== id));

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/etiraf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: invite.token,
          title: title.trim(),
          message: invite.allowText ? message.trim() : "",
          photos: invite.allowPhotos ? readyPhotos : [],
          audioUrl: invite.allowAudio ? audioUrl : null,
          design,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.slug) throw new Error(data?.error || "Etiraf yaradıla bilmədi.");
      setSlug(data.slug);
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Etiraf yaradıla bilmədi.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const viewData = {
    title: title.trim() || null,
    message: message.trim() || null,
    photos: readyPhotos,
    audioUrl,
    design,
  };

  return (
    <div className="min-h-dvh bg-[#fdf3ee]">
      <header className="bg-[linear-gradient(180deg,#8b1424,#6b0a17)] pt-6 pb-14 px-4 relative">
        {step === 1 && (
          <button
            type="button"
            onClick={() => setStep(0)}
            aria-label="Geri"
            className="absolute left-4 top-6 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <EtirafLogo tone="light" size={52} />
      </header>

      <main className="relative -mt-8 mx-auto max-w-lg rounded-t-[2rem] bg-[#fdf3ee] px-4 pt-6 pb-10 flex flex-col gap-5">
        <h1 className="text-center text-xl font-extrabold text-gray-900">Yeni Etiraf Yarat</h1>
        <Stepper step={step} />

        {step === 0 && (
          <>
            {invite.allowPhotos && (
              <Section
                icon={<ImageIcon size={18} />}
                title="Şəkillər"
                aside={
                  <span className="text-xs font-semibold text-gray-500">
                    {photos.length} / {invite.maxPhotos} şəkil
                  </span>
                }
              >
                <div className="grid grid-cols-4 gap-2">
                  {photos.map((p) => (
                    <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                      <Image src={p.preview} alt="" fill unoptimized className="object-cover" />
                      {!p.url && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Loader2 size={18} className="animate-spin text-white" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removePhoto(p.id)}
                        aria-label="Şəkli sil"
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {photos.length < invite.maxPhotos && (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-rose-200 text-[#c8102e] flex flex-col items-center justify-center gap-0.5 hover:bg-rose-50 cursor-pointer"
                    >
                      <Plus size={22} />
                      <span className="text-[10px] font-semibold text-gray-500">Əlavə et</span>
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
              </Section>
            )}

            {invite.allowText && (
              <Section icon={<Type size={18} />} title="Ürək sözləri">
                <div className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, ETIRAF_MESSAGE_MAX))}
                    rows={5}
                    placeholder="Sevdiyinizə demək istədiklərinizi yazın ♡"
                    className="w-full resize-none rounded-2xl border border-rose-100 bg-[#fffaf7] px-4 py-3 pb-7 text-[15px] leading-relaxed text-gray-800 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-rose-100"
                  />
                  <span className="absolute bottom-3 right-4 text-[11px] text-gray-400 tabular-nums">
                    {message.length} / {ETIRAF_MESSAGE_MAX}
                  </span>
                </div>
              </Section>
            )}

            {invite.allowAudio && (
              <Section icon={<Mic size={18} />} title="Səsli mesaj" hint="istəyə bağlı, maks. 60 san">
                <AudioRecorder value={audioUrl} onChange={setAudioUrl} />
              </Section>
            )}

            <Section icon={<Palette size={18} />} title="Dizayn">
              <div className="grid grid-cols-3 gap-2.5">
                {ETIRAF_DESIGNS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDesign(d.id)}
                    className={`relative aspect-[3/4] rounded-2xl overflow-hidden flex flex-col items-center justify-end p-2 border-2 cursor-pointer transition-all ${
                      DESIGN_SWATCH[d.id]
                    } ${design === d.id ? "border-[#c8102e] ring-2 ring-rose-200" : "border-transparent"}`}
                  >
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        d.id === "polaroid" ? "bg-[#8b1424] text-white" : "bg-white/90 text-gray-900"
                      }`}
                    >
                      {d.name}
                    </span>
                    {design === d.id && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#c8102e] text-white flex items-center justify-center">
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, ETIRAF_TITLE_MAX))}
                placeholder="Səhifə başlığı (istəyə bağlı), məs. Sənin üçün ♡"
                className="w-full rounded-2xl border border-rose-100 bg-[#fffaf7] px-4 py-3 text-sm outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-rose-100"
              />
            </Section>

            <button
              type="button"
              disabled={!hasContent || uploading}
              onClick={() => {
                setStep(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="h-14 rounded-full bg-[linear-gradient(180deg,#a3162b,#7a0f1e)] text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-200 disabled:opacity-50 cursor-pointer"
            >
              {uploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Şəkillər yüklənir...
                </>
              ) : (
                <>
                  Baxışa keç <ArrowRight size={18} />
                </>
              )}
            </button>
            {!hasContent && (
              <p className="text-center text-xs text-gray-400 -mt-2">Davam etmək üçün ən azı bir məzmun əlavə edin.</p>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <p className="text-center text-sm text-gray-500">QR oxunanda açılacaq səhifə belə görünəcək:</p>
            <div className="rounded-[2.2rem] border-[6px] border-[#2a1416] shadow-2xl overflow-hidden">
              <EtirafView data={viewData} preview />
            </div>
            <div className="rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3 text-xs text-amber-800 leading-relaxed">
              Diqqət: təsdiqlədikdən sonra etirafı dəyişmək mümkün olmayacaq.
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="h-14 rounded-full border-2 border-[#8b1424] text-[#8b1424] font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft size={18} /> Düzəlt
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="h-14 rounded-full bg-[linear-gradient(180deg,#a3162b,#7a0f1e)] text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-200 disabled:opacity-60 cursor-pointer"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                Təsdiqlə
              </button>
            </div>
          </>
        )}

        {step === 2 && slug && (
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="w-24 h-24 rounded-full bg-[#c8102e] text-white flex items-center justify-center shadow-xl shadow-rose-200 mt-2">
              <Check size={48} strokeWidth={3} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Etirafın hazırdır! 🎉</h2>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Sifarişini tamamlamaq üçün indi bizimlə WhatsApp-da əlaqə saxla.
              </p>
            </div>

            <div className="w-full rounded-3xl bg-white border border-rose-100 p-3 flex items-center gap-3 text-left shadow-sm">
              <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-rose-50 flex items-center justify-center">
                {readyPhotos[0] ? (
                  <Image src={cldImage(readyPhotos[0], 240)} alt="" fill unoptimized className="object-cover" />
                ) : (
                  <EtirafLogo tone="dark" size={36} />
                )}
              </div>
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="font-bold text-gray-900">Sənin etirafın</span>
                <span className="text-xs text-gray-500">
                  {[
                    readyPhotos.length ? `${readyPhotos.length} şəkil` : null,
                    message.trim() ? "1 mesaj" : null,
                    audioUrl ? "1 audio" : null,
                  ]
                    .filter(Boolean)
                    .join(" • ")}
                </span>
                <Link
                  href={`/etiraf/${slug}`}
                  target="_blank"
                  className="inline-flex w-fit items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-[#c8102e]"
                >
                  <Eye size={14} /> Nəticəyə bax
                </Link>
              </div>
            </div>

            <a
              href={etirafWhatsappUrl(slug, customer)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-14 rounded-2xl bg-[#25d366] text-white font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-green-200"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88zm8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41z" />
              </svg>
              Sifarişi WhatsApp-da Tamamla
            </a>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(etirafPublicUrl(slug));
                showToast("Link kopyalandı", "success");
              }}
              className="w-full h-12 rounded-2xl border-2 border-[#8b1424] text-[#8b1424] font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Copy size={16} /> Linki kopyala
            </button>

            <p className="rounded-2xl bg-white border border-rose-100 px-4 py-3 text-xs text-gray-500 leading-relaxed">
              “Sifarişi Tamamla” düyməsinə klik etdikdə WhatsApp-da bizə hazır etirafın məlumatı avtomatik göndəriləcək.
            </p>

            <Link href="/etiraf" className="text-sm font-semibold text-[#8b1424] underline underline-offset-4">
              Etiraflarım
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default EtirafWizard;
