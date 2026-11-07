"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink, Gift, Loader2, Store, X } from "lucide-react";
import { CustomerEtirafItem, CustomerUserItem } from "@/types";
import { cldImage } from "@/lib/cloudinaryUrl";
import { AvatarImage } from "@/components/ui/AvatarImage";
import { EtirafQrButton } from "@/components/etiraf/EtirafQrButton";

export function hasShop(c: CustomerUserItem) {
  return Boolean(c.username && !c.username.startsWith("pending_"));
}

export function CustomerEtirafsModal({
  customer,
  onClose,
}: {
  customer: CustomerUserItem;
  onClose: () => void;
}) {
  const [etirafs, setEtirafs] = useState<CustomerEtirafItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/customers/${customer.id}/etirafs`)
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.error || "Etirafları yükləmək mümkün olmadı.");
        if (!cancelled) setEtirafs(data.etirafs || []);
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Xəta baş verdi."));
    return () => {
      cancelled = true;
    };
  }, [customer.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-xl max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <AvatarImage src={customer.image} alt={customer.name || "Müştəri"} size={44} />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-extrabold text-gray-900 truncate">{customer.name || "Adsız"}</span>
            <span className="text-xs text-gray-400 truncate">{customer.email}</span>
          </div>
          {hasShop(customer) && (
            <a
              href={`/${customer.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-50 text-[#1a7a4a] text-xs font-bold"
            >
              <Store size={14} /> Mağaza
            </a>
          )}
          <button onClick={onClose} aria-label="Bağla" className="p-2 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex flex-col gap-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Etiraflar</h4>
          {error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : !etirafs ? (
            <div className="py-10 flex justify-center">
              <Loader2 size={22} className="animate-spin text-gray-300" />
            </div>
          ) : etirafs.length === 0 ? (
            <div className="py-10 flex flex-col items-center gap-2 text-center">
              <Gift size={32} className="text-gray-300" />
              <p className="text-sm font-bold text-gray-600">Bu müştərinin etirafı yoxdur</p>
            </div>
          ) : (
            etirafs.map((e) => (
              <div key={e.id} className="flex items-center gap-3 rounded-2xl border border-gray-100 p-2.5">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-rose-50 shrink-0 flex items-center justify-center">
                  {e.cover ? (
                    <Image src={cldImage(e.cover, 160)} alt="" fill unoptimized className="object-cover" />
                  ) : (
                    <Gift size={20} className="text-rose-300" />
                  )}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-bold text-sm text-gray-900 truncate">{e.title || `/etiraf/${e.slug}`}</span>
                  <span className="text-[11px] text-gray-400">
                    {[e.photoCount ? `${e.photoCount} şəkil` : null, e.hasMessage ? "mesaj" : null, e.hasAudio ? "audio" : null, e.hasMusic ? "musiqi" : null]
                      .filter(Boolean)
                      .join(" • ")}{" "}
                    · {new Date(e.createdAt).toLocaleDateString("az-AZ", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <a
                  href={`/etiraf/${e.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Etirafa bax"
                  className="p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <ExternalLink size={14} />
                </a>
                <EtirafQrButton
                  slug={e.slug}
                  label="QR"
                  className="px-3 py-2 rounded-full bg-[#8b1424] text-white text-xs font-bold"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerEtirafsModal;
