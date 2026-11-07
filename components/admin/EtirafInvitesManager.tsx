"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Check,
  Copy,
  ExternalLink,
  Eye,
  Gift,
  ImageIcon,
  Link2,
  Loader2,
  Mic,
  Music,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  Type,
  X,
} from "lucide-react";
import { EtirafInviteItem } from "@/types";
import { ETIRAF_PHOTOS_HARD_MAX, defaultMaxPhotos } from "@/lib/etirafShared";
import { ETIRAF_PACKAGES, etirafSamplesUrl } from "@/lib/etirafDemos";
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

interface InviteOptions {
  allowPhotos: boolean;
  allowText: boolean;
  allowAudio: boolean;
  allowMusic: boolean;
  /** Seçilmiş paket (null — fərdi seçim) */
  packageId: string | null;
  /** null — seçimə görə avtomatik (15 / 10) */
  maxPhotos: number | null;
  note: string;
}

const packageOptions = (id: string): Partial<InviteOptions> => {
  const pkg = ETIRAF_PACKAGES.find((p) => p.id === id)!;
  return {
    packageId: pkg.id,
    allowPhotos: pkg.photos,
    allowText: pkg.text,
    allowAudio: pkg.audio,
    allowMusic: pkg.music,
    maxPhotos: null,
  };
};

const DEFAULT_OPTIONS: InviteOptions = {
  allowPhotos: true,
  allowText: true,
  allowAudio: true,
  allowMusic: false,
  packageId: "tam",
  maxPhotos: null,
  note: "",
};

const packageLabel = (id: string | null) => {
  const pkg = ETIRAF_PACKAGES.find((p) => p.id === id);
  return pkg ? `${pkg.label} · ${pkg.price} AZN` : null;
};

const effectiveMax = (o: InviteOptions) => o.maxPhotos ?? defaultMaxPhotos(o);

const toPayload = (o: InviteOptions) => ({
  allowPhotos: o.allowPhotos,
  allowText: o.allowText,
  allowAudio: o.allowAudio,
  allowMusic: o.allowMusic,
  packageId: o.packageId,
  maxPhotos: effectiveMax(o),
  note: o.note,
});

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

/** Link seçimləri — həm yeni link, həm də düzəltmə üçün. */
function InviteOptionsFields({ value, onChange }: { value: InviteOptions; onChange: (v: InviteOptions) => void }) {
  const set = (patch: Partial<InviteOptions>) => onChange({ ...value, ...patch });
  // Məzmun növünü əllə dəyişmək paketi "fərdi" edir.
  const toggle = (patch: Partial<InviteOptions>) => set({ ...patch, packageId: null });
  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Paket</span>
        <div className="flex flex-wrap gap-2">
          {ETIRAF_PACKAGES.map((pkg) => {
            const active = value.packageId === pkg.id;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => set(packageOptions(pkg.id))}
                aria-pressed={active}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-colors cursor-pointer ${
                  active ? "bg-[#8b1424] border-[#8b1424] text-white" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {pkg.label}
                <span className={`rounded-full px-2 py-0.5 ${active ? "bg-white/20" : "bg-gray-100"}`}>{pkg.price} AZN</span>
              </button>
            );
          })}
          <span
            className={`flex items-center px-3.5 py-2 rounded-2xl border text-xs font-bold ${
              value.packageId ? "border-dashed border-gray-200 text-gray-400" : "border-[#8b1424] text-[#8b1424] bg-rose-50"
            }`}
          >
            Fərdi
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Məzmun növləri</span>
        <div className="flex flex-wrap gap-2">
          <TypeToggle active={value.allowPhotos} onClick={() => toggle({ allowPhotos: !value.allowPhotos })} icon={<ImageIcon size={16} />} label="Şəkil" />
          <TypeToggle active={value.allowText} onClick={() => toggle({ allowText: !value.allowText })} icon={<Type size={16} />} label="Yazı" />
          <TypeToggle active={value.allowAudio} onClick={() => toggle({ allowAudio: !value.allowAudio })} icon={<Mic size={16} />} label="Səs yazısı" />
          <TypeToggle active={value.allowMusic} onClick={() => toggle({ allowMusic: !value.allowMusic })} icon={<Music size={16} />} label="Fon musiqisi" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-3">
        <label className={`flex flex-col gap-1.5 ${value.allowPhotos ? "" : "opacity-40 pointer-events-none"}`}>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Maks. şəkil</span>
          <input
            type="number"
            min={1}
            max={ETIRAF_PHOTOS_HARD_MAX}
            value={effectiveMax(value)}
            onChange={(e) =>
              set({ maxPhotos: Math.max(1, Math.min(ETIRAF_PHOTOS_HARD_MAX, Number(e.target.value) || 1)) })
            }
            className="rounded-2xl border border-gray-200 px-4 py-2.5 text-sm font-bold outline-none focus:border-[#8b1424]"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Qeyd (istəyə bağlı)</span>
          <input
            value={value.note}
            onChange={(e) => set({ note: e.target.value })}
            maxLength={120}
            placeholder="Məs. Aysel, +994 50 ..."
            className="rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#8b1424]"
          />
        </label>
      </div>
    </>
  );
}

function EditInviteModal({
  invite,
  onClose,
  onSaved,
}: {
  invite: EtirafInviteItem;
  onClose: () => void;
  onSaved: (updated: Partial<EtirafInviteItem> & { id: string }) => void;
}) {
  const [options, setOptions] = useState<InviteOptions>({
    allowPhotos: invite.allowPhotos,
    allowText: invite.allowText,
    allowAudio: invite.allowAudio,
    allowMusic: invite.allowMusic,
    packageId: invite.packageId,
    maxPhotos: invite.allowPhotos ? invite.maxPhotos : null,
    note: invite.note || "",
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/etiraf-invites/${invite.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(options)),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Dəyişiklik yadda saxlanılmadı.");
      onSaved(data.invite);
      showToast("Link yeniləndi", "success");
      onClose();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Xəta baş verdi.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-extrabold text-gray-900">Linki düzəlt</h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{invite.url}</p>
          </div>
          <button onClick={onClose} aria-label="Bağla" className="p-2 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <InviteOptionsFields value={options} onChange={setOptions} />
        <p className="text-xs text-gray-400 -mt-2">
          Link eyni qalır — müştəri səhifəni yenilədikdə yeni seçimləri görəcək.
        </p>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#8b1424] text-white text-sm font-bold hover:bg-[#6b0a17] disabled:opacity-60 cursor-pointer"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
          Yadda saxla
        </button>
      </div>
    </div>
  );
}

function DemoLinksCard() {
  const url = etirafSamplesUrl();
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Sparkles size={20} />
        </div>
        <div className="min-w-0">
          <h3 className="font-extrabold text-gray-900 text-base">Nümunələr səhifəsi</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Bütün paketlər (5 / 7 / 10 / 12 / 15 AZN), dizaynlar və WhatsApp sifariş düyməsi bir səhifədə.
          </p>
          <p className="text-xs font-semibold text-[#8b1424] mt-1 truncate">{url}</p>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
        >
          <Eye size={14} /> Bax
        </a>
        <button
          type="button"
          onClick={() => copy(url, "Nümunələr linki kopyalandı")}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#8b1424] text-white text-xs font-bold hover:bg-[#6b0a17] cursor-pointer"
        >
          <Copy size={14} /> Kopyala
        </button>
      </div>
    </div>
  );
}

export function EtirafInvitesManager() {
  const [invites, setInvites] = useState<EtirafInviteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [options, setOptions] = useState<InviteOptions>(DEFAULT_OPTIONS);
  const [lastUrl, setLastUrl] = useState<string | null>(null);
  const [editing, setEditing] = useState<EtirafInviteItem | null>(null);

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
    if (!options.allowPhotos && !options.allowText && !options.allowAudio && !options.allowMusic) {
      showToast("Ən azı bir məzmun növü seçin.", "error");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/etiraf-invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(options)),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Link yaradıla bilmədi.");
      setLastUrl(data.invite.url);
      copy(data.invite.url, "Link yaradıldı və kopyalandı");
      setOptions((o) => ({ ...o, note: "" }));
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
            <Gift size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 text-base">Yeni etiraf linki</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Hər link ilə müştəri yalnız <b>bir</b> etiraf yarada bilər. Linki yaradıb müştəriyə göndərin.
            </p>
          </div>
        </div>

        <InviteOptionsFields value={options} onChange={setOptions} />

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

      <DemoLinksCard />

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
                <Gift size={36} className="text-gray-300" />
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
                  {packageLabel(invite.packageId) && (
                    <span className="block mb-1.5 text-[11px] font-bold text-[#8b1424] whitespace-nowrap">
                      {packageLabel(invite.packageId)}
                    </span>
                  )}
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
                      <span title="Səs yazısı" className="inline-flex bg-gray-100 p-1.5 rounded-full">
                        <Mic size={12} />
                      </span>
                    )}
                    {invite.allowMusic && (
                      <span title="Fon musiqisi" className="inline-flex bg-gray-100 p-1.5 rounded-full">
                        <Music size={12} />
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
                          onClick={() => setEditing(invite)}
                          aria-label="Linki düzəlt"
                          title="Düzəlt"
                          className="p-2 rounded-full text-gray-600 hover:bg-gray-100 cursor-pointer"
                        >
                          <Pencil size={14} />
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

      {editing && (
        <EditInviteModal
          invite={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated) =>
            setInvites((prev) => prev.map((i) => (i.id === updated.id ? { ...i, ...updated } : i)))
          }
        />
      )}
    </div>
  );
}

export default EtirafInvitesManager;
