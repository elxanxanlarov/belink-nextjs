"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { downloadEtirafQrCard } from "@/lib/etirafQrCard";
import { etirafPublicUrl } from "@/lib/etirafShared";
import { showToast } from "@/lib/swal";
import { etirafScript } from "@/components/etiraf/fonts";

export function EtirafQrButton({
  slug,
  className = "",
  label = "QR yüklə",
}: {
  slug: string;
  className?: string;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    setBusy(true);
    try {
      await downloadEtirafQrCard(
        etirafPublicUrl(slug),
        etirafScript.style.fontFamily,
        `etiraf-${slug}.png`
      );
    } catch (error) {
      showToast(error instanceof Error ? error.message : "QR yüklənə bilmədi.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className={`inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 ${className}`}
    >
      {busy ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
      {label}
    </button>
  );
}

export default EtirafQrButton;
