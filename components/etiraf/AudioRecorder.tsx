"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mic, Square, Trash2, Upload } from "lucide-react";
import { ETIRAF_AUDIO_MAX_SECONDS } from "@/lib/etirafShared";
import { showToast } from "@/lib/swal";

const MIME_CANDIDATES = ["audio/webm;codecs=opus", "audio/mp4", "audio/webm", "audio/ogg;codecs=opus"];

/** Cihazda saxlanılan səs — Cloudinary-yə yalnız "Təsdiqlə"-dən sonra yüklənir. */
export interface LocalAudio {
  blob: Blob;
  fileName: string;
  /** Dinləmək üçün obyekt URL-i */
  preview: string;
  /** Yükləndikdən sonra Cloudinary ünvanı */
  url?: string;
}

export async function uploadAudio(blob: Blob, fileName: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", blob, fileName);
  formData.append("folder", "etiraf");
  formData.append("kind", "audio");
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.url) throw new Error(data?.error || "Səs faylı yüklənmədi.");
  return data.url as string;
}

export function AudioRecorder({
  value,
  onChange,
}: {
  value: LocalAudio | null;
  onChange: (audio: LocalAudio | null) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(
    () => () => {
      stopTimer();
      recorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    },
    []
  );

  const keep = (blob: Blob, fileName: string) => {
    if (value) URL.revokeObjectURL(value.preview);
    onChange({ blob, fileName, preview: URL.createObjectURL(blob) });
  };

  const remove = () => {
    if (value) URL.revokeObjectURL(value.preview);
    onChange(null);
  };

  const start = async () => {
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      showToast("Brauzeriniz səs yazmağı dəstəkləmir — fayl yükləyin.", "error");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MIME_CANDIDATES.find((m) => MediaRecorder.isTypeSupported(m));
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType, audioBitsPerSecond: 64000 } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const type = recorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        const ext = type.includes("mp4") ? "m4a" : type.includes("ogg") ? "ogg" : "webm";
        if (blob.size > 0) keep(blob, `etiraf-ses.${ext}`);
      };
      recorderRef.current = recorder;
      recorder.start();
      setSeconds(0);
      setRecording(true);
      let elapsed = 0;
      timerRef.current = setInterval(() => {
        elapsed += 1;
        setSeconds(elapsed);
        // Maksimum müddətə çatanda yazı avtomatik dayanır.
        if (elapsed >= ETIRAF_AUDIO_MAX_SECONDS) stop();
      }, 1000);
    } catch {
      showToast("Mikrofona icazə verilmədi.", "error");
    }
  };

  const stop = () => {
    stopTimer();
    setRecording(false);
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      showToast("Səs faylı 4 MB-dan böyük olmamalıdır.", "error");
      return;
    }
    keep(file, file.name);
  };

  if (value) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-white px-3 py-2.5">
        <audio src={value.preview} controls className="h-10 flex-1 min-w-0" />
        <button
          type="button"
          onClick={remove}
          aria-label="Səsi sil"
          className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-[#c8102e] hover:bg-rose-50 cursor-pointer"
        >
          <Trash2 size={18} />
        </button>
      </div>
    );
  }

  if (recording) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
        <span className="w-3 h-3 rounded-full bg-[#c8102e] animate-pulse" />
        <span className="text-sm font-bold text-[#8b1424] tabular-nums flex-1">
          Yazılır... 0:{seconds.toString().padStart(2, "0")} / 0:{ETIRAF_AUDIO_MAX_SECONDS}
        </span>
        <button
          type="button"
          onClick={stop}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#8b1424] text-white text-xs font-bold cursor-pointer"
        >
          <Square size={12} fill="currentColor" /> Dayandır
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={start}
        className="flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white px-3 py-3.5 text-sm font-bold text-[#8b1424] hover:bg-rose-50 cursor-pointer"
      >
        <Mic size={18} /> Səs yaz
      </button>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-rose-200 bg-white px-3 py-3.5 text-sm font-bold text-gray-600 hover:bg-rose-50 cursor-pointer"
      >
        <Upload size={18} /> Fayl seç
      </button>
      <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

export default AudioRecorder;
