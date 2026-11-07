"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Check, Copy, ExternalLink, Heart, ImageIcon, Link2, Loader2, Mic, Plus, Trash2, Type } from "lucide-react";
import { EtirafInviteItem } from "@/types";
import { ETIRAF_PHOTOS_HARD_MAX, defaultMaxPhotos } from "@/lib/etirafShared";
import { cldImage } from "@/lib/cloudinaryUrl";
import { showToast } from "@/lib/swal";
import { Table, ColumnDefinition } from "@/components/ui/Table";
import { EtirafQrButton } from "@/components/etiraf/EtirafQrButton";

const COLUMNS: ColumnDefinition[] = [
  { header: "Status" },
  { header: "Məzmun" },
  { header: "Müştəri / Qeyd" },
  { header: "Yaradılıb" },
  { header: "Əməliyyatlar", className: "text-right" },
];

const copy = (text: string, label = "Link kopyalandı") => {
  navigator.clipboard?.writeText(text);
  showToast(label, "success");
};

function TypeToggle({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-bold transition-colors cursor-pointer ${
        active ? "bg-rose-50 border-rose-200 text-[#8b1424]" : "bg-white border-gray-200 text-gray-400"
      }`}
    >
      <span
        className={`w-5 h-5 rounded-md border flex items-center justify-center ${
          active ? "bg-[#8b1424] border-[#8b1424] text-white" : "border-gray-300"
        }`}
      >
        {active && <Check size={12} />}
      </span>
      {icon}
      {label}
    </button>
  );
}

export function EtirafInvitesManager() {
  const [invites, setInvites] = useState<EtirafInviteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [allowPhotos, setAllowPhotos] = useState(true);
  const [allowText, setAllowText] = useState(true);
  const [allowAudio, setAllowAudio] = useState(true);
  const [customMax, setCustomMax] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [lastUrl, setLastUrl] = useState<string | null>(null);

  // Admin limiti əllə dəyişməyibsə, seçimə görə 15 / 10 avtomatik götürülür.
  const maxPhotos = customMax ?? defaultMaxPhotos({ allowPhotos, allowText, allowAudio });

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/etiraf-invites");
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Linkləri yükləmək mümkün olmadı.");
      setInvites(data.invites || []);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Xəta baş verdi.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/etiraf-invites")
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.error || "Linkləri yükləmək mümkün olmadı.");
        if (!cancelled) setInvites(data.invites || []);
      })
      .catch((error) => !cancelled && showToast(error instanceof Error ? error.message : "Xəta baş verdi.", "error"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const create = async () => {
    if (!allowPhotos && !allowText && !allowAudio) {
      showToast("Ən azı bir məzmun növü seçin.", "error");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/etiraf-invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ allowPhotos, allowText, allowAudio, maxPhotos, note }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Link yaradıla bilmədi.");
      setLastUrl(data.invite.url);
      copy(data.invite.url, "Link yaradıldı və kopyalandı");
      setNote("");
      load();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Xəta baş verdi.", "error");
    } finally {
      setCreating(false);
    }
  };

  const revoke = async (id: string) => {
    const previous = invites;
    setInvites((prev) => prev.filter((i) => i.id !== id));
    try {
      const res = await fetch(`/api/admin/etiraf-invites/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Link silinə bilmədi.");
      }
      showToast("Link ləğv edildi", "success");
    } catch (error) {
      setInvites(previous);
      showToast(error instanceof Error ? error.message : "Xəta baş verdi.", "error");
    }
  };

  const usedCount = invites.filter((i) => i.usedAt).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Yeni link */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-5 sm:p-6 flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-[#c8102e] flex items-center justify-center shrink-0">
            <Heart size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 text-base">Yeni etiraf linki</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Hər link ilə müştəri yalnız <b>bir</b> etiraf yarada bilər. Linki yaradıb müştəriyə göndərin.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Məzmun növləri</span>
          <div className="flex flex-wrap gap-2">
            <TypeToggle active={allowPhotos} onClick={() => setAllowPhotos((v) => !v)} icon={<ImageIcon size={16} />} label="Şəkil" />
            <TypeToggle active={allowText} onClick={() => setAllowText((v) => !v)} icon={<Type size={16} />} label="Yazı" />
            <TypeToggle active={allowAudio} onClick={() => setAllowAudio((v) => !v)} icon={<Mic size={16} />} label="Səs" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-3">
          <label className={`flex flex-col gap-1.5 ${allowPhotos ? "" : "opacity-40 pointer-events-none"}`}>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Maks. şəkil</span>
            <input
              type="number"
              min={1}
              max={ETIRAF_PHOTOS_HARD_MAX}
              value={maxPhotos}
              onChange={(e) =>
                setCustomMax(Math.max(1, Math.min(ETIRAF_PHOTOS_HARD_MAX, Number(e.target.value) || 1)))
              }
              className="rounded-2xl border border-gray-200 px-4 py-2.5 text-sm font-bold outline-none focus:border-[#8b1424]"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Qeyd (istəyə bağlı)</span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={120}
              placeholder="Məs. Aysel, +994 50 ..."
              className="rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#8b1424]"
            />
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <button
            type="button"
            onClick={create}
            disabled={creating}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#8b1424] text-white text-sm font-bold hover:bg-[#6b0a17] disabled:opacity-60 cursor-pointer"
          >
            {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Link yarat
          </button>

          {lastUrl && (
            <div className="flex items-center gap-2 min-w-0 flex-1 rounded-full bg-rose-50 border border-rose-100 pl-4 pr-1.5 py-1.5">
              <Link2 size={14} className="text-[#c8102e] shrink-0" />
              <span className="text-xs font-semibold text-[#8b1424] truncate flex-1">{lastUrl}</span>
              <button
                type="button"
                onClick={() => copy(lastUrl)}
                className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-xs font-bold text-[#8b1424] cursor-pointer"
              >
                <Copy size={12} /> Kopyala
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Linklər */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100">
          <h3 className="font-extrabold text-gray-900 text-base">Etiraf linkləri</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {invites.length} link · {usedCount} hazırdır · {invites.length - usedCount} gözləyir
          </p>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 size={24} className="animate-spin text-gray-300" />
          </div>
        ) : (
          <Table
            columns={COLUMNS}
            isEmpty={invites.length === 0}
            emptyState={
              <div className="p-12 text-center flex flex-col items-center gap-2">
                <Heart size={36} className="text-gray-300" />
                <p className="text-sm font-bold text-gray-600">Hələ link yaradılmayıb</p>
              </div>
            }
          >
            {invites.map((invite) => (
              <tr key={invite.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-6 py-4">
                  {invite.usedAt ? (
                    <span className="inline-flex text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                      Hazırdır
                    </span>
                  ) : (
                    <span className="inline-flex text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                      Gözləyir
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    {invite.allowPhotos && (
                      <span title="Şəkil" className="inline-flex items-center gap-1 text-[11px] font-bold bg-gray-100 px-2 py-1 rounded-full">
                        <ImageIcon size={12} /> {invite.maxPhotos}
                      </span>
                    )}
                    {invite.allowText && (
                      <span title="Yazı" className="inline-flex bg-gray-100 p-1.5 rounded-full">
                        <Type size={12} />
                      </span>
                    )}
                    {invite.allowAudio && (
                      <span title="Səs" className="inline-flex bg-gray-100 p-1.5 rounded-full">
                        <Mic size={12} />
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {invite.etiraf ? (
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-rose-50 shrink-0">
                        {invite.etiraf.cover && (
                          <Image src={cldImage(invite.etiraf.cover, 120)} alt="" fill unoptimized className="object-cover" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-gray-900 truncate text-sm">
                          {invite.etiraf.user.name || invite.etiraf.user.email || "—"}
                        </span>
                        <span className="text-xs text-gray-400 truncate">{invite.note || invite.etiraf.user.email}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">{invite.note || <span className="text-gray-300 italic">—</span>}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                  {new Date(invite.createdAt).toLocaleDateString("az-AZ", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    {invite.etiraf ? (
                      <>
                        <a
                          href={`/etiraf/${invite.etiraf.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                        >
                          <ExternalLink size={13} /> Bax
                        </a>
                        <EtirafQrButton
                          slug={invite.etiraf.slug}
                          className="px-3 py-1.5 rounded-full bg-[#8b1424] text-white text-xs font-bold hover:bg-[#6b0a17] whitespace-nowrap"
                        />
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => copy(invite.url)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                        >
                          <Copy size={13} /> Linki kopyala
                        </button>
                        <button
                          type="button"
                          onClick={() => revoke(invite.id)}
                          aria-label="Linki ləğv et"
                          title="Linki ləğv et"
                          className="p-2 rounded-full text-red-500 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  );
}

export default EtirafInvitesManager;
