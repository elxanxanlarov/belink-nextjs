"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play, Gift, Music, VolumeX } from "lucide-react";
import { cldImage } from "@/lib/cloudinaryUrl";
import type { EtirafDesign } from "@/lib/etirafShared";
import { EtirafLogo } from "@/components/etiraf/EtirafLogo";
import { etirafScript } from "@/components/etiraf/fonts";

export interface EtirafViewData {
  title: string | null;
  message: string | null;
  photos: string[];
  audioUrl: string | null;
  /** Arxa fon musiqisi — "Sürprizi aç"-dan sonra avtomatik başlayır */
  musicUrl?: string | null;
  design: EtirafDesign | string;
}

/** Giriş ("Sürprizi aç") ekranı — hər dizayna uyğun. */
const INTRO_THEMES = {
  red: {
    bg: "bg-[radial-gradient(ellipse_at_center,#a3162b_0%,#4a0711_100%)]",
    text: "text-white",
    logo: "light" as const,
    box: "bg-white/15 border border-white/30 text-white",
    button: "bg-white text-[#8b1424]",
    petal: "#ff6b81",
  },
  polaroid: {
    bg: "bg-[radial-gradient(ellipse_at_center,#fffaf5_0%,#f3dfd2_100%)]",
    text: "text-[#8b1424]",
    logo: "dark" as const,
    box: "bg-white border border-rose-200 text-[#c8102e] shadow-[0_18px_40px_rgba(122,15,30,0.18)] rotate-[-3deg]",
    button: "bg-[#8b1424] text-white",
    petal: "#e2556b",
  },
  night: {
    bg: "etiraf-stars",
    text: "text-white",
    logo: "light" as const,
    box: "bg-white/10 border border-[#ffd98a]/60 text-[#ffd98a] shadow-[0_0_50px_rgba(255,217,138,0.25)]",
    button: "bg-[#ffd98a] text-[#0e1736]",
    petal: "#ffd98a",
  },
};

/** Cloudinary səsini mp3 kimi verir ki, iPhone-da da oxunsun (Chrome webm yazır). */
export function playableAudioUrl(url: string): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/video/upload/")) return url;
  return url.replace(/\.(webm|ogg|oga|m4a|mp4|wav|mpeg|mp3)$/i, "") + ".mp3";
}

interface Theme {
  page: string;
  title: string;
  logo: "light" | "dark";
  frame: string;
  message: string;
  audio: string;
  audioBtn: string;
  bar: string;
  barBg: string;
  dot: string;
  dotIdle: string;
  nav: string;
  petal: string;
}

const THEMES: Record<"red" | "polaroid" | "night", Theme> = {
  red: {
    page: "bg-[radial-gradient(ellipse_at_top,#a3162b_0%,#6b0a17_55%,#3d0610_100%)]",
    title: "text-white",
    logo: "light",
    frame: "bg-white p-2.5 pb-8 shadow-[0_20px_50px_rgba(0,0,0,0.45)]",
    message: "etiraf-paper text-[#2a1416]",
    audio: "bg-black/25 border border-white/15 text-white",
    audioBtn: "bg-white text-[#8b1424]",
    bar: "bg-white",
    barBg: "bg-white/25",
    dot: "bg-white",
    dotIdle: "bg-white/35",
    nav: "bg-black/30 text-white border border-white/40",
    petal: "#d81e3a",
  },
  polaroid: {
    page: "bg-[radial-gradient(ellipse_at_top,#fff8f1_0%,#f6e6da_60%,#ecd3c3_100%)]",
    title: "text-[#8b1424]",
    logo: "dark",
    frame: "bg-white p-2.5 pb-10 shadow-[0_18px_40px_rgba(122,15,30,0.25)]",
    message: "bg-[repeating-linear-gradient(#fffdf9,#fffdf9_37px,#f1d9d9_38px)] text-[#5b0d18] shadow-lg rotate-[-1deg]",
    audio: "bg-white/80 border border-[#ecc9c9] text-[#5b0d18]",
    audioBtn: "bg-[#8b1424] text-white",
    bar: "bg-[#8b1424]",
    barBg: "bg-[#8b1424]/20",
    dot: "bg-[#8b1424]",
    dotIdle: "bg-[#8b1424]/25",
    nav: "bg-white/80 text-[#8b1424] border border-[#ecc9c9]",
    petal: "#e2556b",
  },
  night: {
    page: "etiraf-stars",
    title: "text-white",
    logo: "light",
    frame: "bg-white/95 p-2 pb-7 shadow-[0_0_60px_rgba(147,170,255,0.35)]",
    message: "bg-white/10 backdrop-blur border border-white/20 text-white",
    audio: "bg-white/10 border border-white/20 text-white",
    audioBtn: "bg-white text-[#0e1736]",
    bar: "bg-[#ffd98a]",
    barBg: "bg-white/20",
    dot: "bg-[#ffd98a]",
    dotIdle: "bg-white/30",
    nav: "bg-white/10 text-white border border-white/30",
    petal: "#ffd98a",
  },
};

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function AudioPlayer({ src, theme }: { src: string; theme: Theme }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  return (
    <div className={`flex items-center gap-3 rounded-full px-3 py-2.5 ${theme.audio}`}>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Dayandır" : "Səsli mesajı dinlə"}
        className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center cursor-pointer ${theme.audioBtn}`}
      >
        {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
      </button>
      <div className={`relative h-1.5 flex-1 rounded-full cursor-pointer ${theme.barBg}`} onClick={seek}>
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${theme.bar}`}
          style={{ width: duration ? `${Math.min(100, (time / duration) * 100)}%` : "0%" }}
        />
      </div>
      <span className="text-xs font-semibold tabular-nums pr-1 opacity-90">
        {formatTime(time)} / {formatTime(duration)}
      </span>
    </div>
  );
}

function PhotoCarousel({ photos, theme, design }: { photos: string[]; theme: Theme; design: string }) {
  const [rawIndex, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);
  const count = photos.length;
  // Şəkil silinəndə indeks sərhəddən çıxmasın.
  const index = count ? rawIndex % count : 0;
  const go = (delta: number) => setIndex((i) => (((i % count) + delta + count) % count));

  if (!count) return null;

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div
        className="relative w-full max-w-[320px] aspect-[4/5]"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {/* Arxadakı polaroidlər */}
        {count > 1 && (
          <>
            <div className={`absolute inset-3 rotate-[-7deg] ${theme.frame} opacity-90`} />
            <div className={`absolute inset-3 rotate-[5deg] ${theme.frame} opacity-90`} />
          </>
        )}
        <div className={`absolute inset-0 rotate-[-1.5deg] ${theme.frame}`}>
          <div className="relative w-full h-full overflow-hidden bg-gray-100">
            {photos.map((src, i) => (
              <Image
                key={src + i}
                src={cldImage(src, 900)}
                alt={`Xatirə ${i + 1}`}
                fill
                unoptimized
                priority={i === 0}
                className={`object-cover transition-opacity duration-500 ${i === index ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </div>
          {design !== "night" && (
            <svg className="absolute -bottom-4 -right-4 w-14 h-14 drop-shadow-lg" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.6.7-1.4 2.2-2.6 4.3-2.6 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"
                fill="#d0102e"
              />
            </svg>
          )}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Əvvəlki şəkil"
              className={`absolute left-0 top-1/2 -translate-x-1/3 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer backdrop-blur ${theme.nav}`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Növbəti şəkil"
              className={`absolute right-0 top-1/2 translate-x-1/3 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer backdrop-blur ${theme.nav}`}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-[280px]">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Şəkil ${i + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${i === index ? `w-5 ${theme.dot}` : `w-2 ${theme.dotIdle}`}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Petals({ color }: { color: string }) {
  const petals = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {petals.map((i) => (
        <span
          key={i}
          className="etiraf-petal"
          style={
            {
              left: `${(i * 83) % 100}%`,
              background: color,
              animationDelay: `${(i * 1.7) % 9}s`,
              animationDuration: `${9 + (i % 5) * 2}s`,
              "--petal-scale": `${0.6 + (i % 4) * 0.2}`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function EtirafView({
  data,
  preview = false,
  withIntro = false,
}: {
  data: EtirafViewData;
  preview?: boolean;
  withIntro?: boolean;
}) {
  const design = (data.design in THEMES ? data.design : "red") as keyof typeof THEMES;
  const theme = THEMES[design];
  const [opened, setOpened] = useState(!withIntro);
  const audioOnly = Boolean(data.audioUrl) && data.photos.length === 0 && !data.message;
  const intro = INTRO_THEMES[design];
  const musicRef = useRef<HTMLAudioElement>(null);
  const [musicOn, setMusicOn] = useState(false);

  const playMusic = () => {
    musicRef.current?.play().catch(() => setMusicOn(false));
  };

  // "Sürprizi aç" toxunuşu istifadəçi hərəkəti sayılır — musiqi brauzerdə avtomatik başlaya bilir.
  const openSurprise = () => {
    setOpened(true);
    playMusic();
  };

  const toggleMusic = () => {
    const m = musicRef.current;
    if (!m) return;
    if (m.paused) playMusic();
    else m.pause();
  };

  return (
    <div
      className={`relative overflow-hidden ${theme.page} ${preview ? "min-h-[640px] rounded-[2rem]" : "min-h-dvh"}`}
    >
      <Petals color={theme.petal} />
      {design === "night" && (
        <svg className="absolute top-10 right-8 w-16 h-16 opacity-90" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="#ffd98a" />
        </svg>
      )}

      <div
        className={`relative z-10 mx-auto max-w-md px-6 pt-8 pb-16 flex flex-col items-center gap-7 ${
          // Şəkil yoxdursa məzmun ekranın ortasında görünsün.
          data.photos.length === 0 ? (preview ? "min-h-[640px] justify-center" : "min-h-dvh justify-center") : ""
        }`}
      >
        <EtirafLogo tone={theme.logo} size={58} />

        {data.title && (
          <h1 className={`${etirafScript.className} text-4xl font-bold text-center ${theme.title}`}>{data.title}</h1>
        )}

        {data.photos.length > 0 && <PhotoCarousel photos={data.photos} theme={theme} design={design} />}

        {data.message && (
          <div className={`w-full px-6 py-6 ${design === "night" ? "rounded-3xl" : ""} ${theme.message}`}>
            <p
              className={`${etirafScript.className} text-[1.7rem] leading-[38px] whitespace-pre-line break-words text-center`}
            >
              {data.message}
            </p>
          </div>
        )}

        {audioOnly && (
          <div className="flex flex-col items-center gap-3 my-4">
            <svg className="w-28 h-28 etiraf-gift-bounce drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.6.7-1.4 2.2-2.6 4.3-2.6 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"
                fill={design === "night" ? "#ffd98a" : "#e11d48"}
              />
            </svg>
            <p className={`${etirafScript.className} text-3xl text-center ${theme.title}`}>Sənin üçün bir səsli mesaj var...</p>
          </div>
        )}

        {data.audioUrl && (
          <div className="w-full">
            <AudioPlayer src={playableAudioUrl(data.audioUrl)} theme={theme} />
          </div>
        )}

        {!preview && (
          <Link
            href="/etiraf"
            className={`mt-4 text-xs font-semibold opacity-70 hover:opacity-100 ${theme.title}`}
          >
            belink.az/etiraf ilə hazırlanıb ♡
          </Link>
        )}
      </div>

      {data.musicUrl && (
        <>
          <audio
            ref={musicRef}
            src={playableAudioUrl(data.musicUrl)}
            loop
            preload="auto"
            onPlay={() => setMusicOn(true)}
            onPause={() => setMusicOn(false)}
          />
          {opened && (
            <button
              type="button"
              onClick={toggleMusic}
              aria-label={musicOn ? "Musiqini söndür" : "Musiqini aç"}
              className={`${preview ? "absolute" : "fixed"} top-4 right-4 z-20 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur cursor-pointer ${theme.nav}`}
            >
              {musicOn ? <Music size={18} className="animate-pulse" /> : <VolumeX size={18} />}
            </button>
          )}
        </>
      )}

      {!opened && (
        <button
          type="button"
          onClick={openSurprise}
          className={`fixed inset-0 z-30 overflow-hidden flex flex-col items-center justify-center gap-6 px-6 text-center cursor-pointer ${intro.bg} ${intro.text}`}
        >
          <Petals color={intro.petal} />
          {design === "night" && (
            <svg className="absolute top-12 right-10 w-16 h-16" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="#ffd98a" />
            </svg>
          )}
          <EtirafLogo tone={intro.logo} size={72} />
          <div className={`etiraf-gift-bounce w-28 h-28 rounded-[2rem] flex items-center justify-center ${intro.box}`}>
            <Gift size={56} />
          </div>
          <span className={`${etirafScript.className} text-4xl`}>Sənin üçün bir sürpriz var...</span>
          <span className={`px-6 py-3 rounded-full font-bold text-sm shadow-xl ${intro.button}`}>Sürprizi aç ♡</span>
        </button>
      )}
    </div>
  );
}

export default EtirafView;
