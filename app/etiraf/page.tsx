import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cldImage } from "@/lib/cloudinaryUrl";
import { EtirafLogo } from "@/components/etiraf/EtirafLogo";
import { EtirafQrButton } from "@/components/etiraf/EtirafQrButton";
import { CopyEtirafLink, EtirafSignInButton, EtirafSignOutButton } from "@/components/etiraf/EtirafClientBits";

export const metadata: Metadata = {
  title: "Etiraf — Sevdiyinə unudulmaz sürpriz hazırla",
  description: "Şəkillər, ürək sözləri və səsli mesajla QR kodlu etiraf hədiyyəsi hazırla.",
};

export default async function EtirafHomePage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <main className="flex-1 min-h-dvh bg-[radial-gradient(ellipse_at_top,#a3162b_0%,#6b0a17_55%,#3d0610_100%)] flex flex-col items-center justify-center gap-8 px-6 py-12 text-center text-white">
        <EtirafLogo tone="light" size={90} />
        <h1 className="text-3xl font-extrabold leading-tight">
          Sevdiyinə unudulmaz
          <br />
          sürpriz hazırla ♡
        </h1>
        <ul className="flex flex-col gap-2 text-sm text-white/85">
          <li>📷 Şəkillər əlavə et</li>
          <li>✍️ Ürək sözlərini yaz</li>
          <li>🎙️ Səsli mesaj göndər</li>
        </ul>
        <EtirafSignInButton callbackUrl="/etiraf" />
        <p className="text-xs text-white/60 max-w-xs">
          Etiraf yaratmaq üçün sizə göndərilən xüsusi linkdən istifadə edin.
        </p>
      </main>
    );
  }

  const etirafs = await prisma.etiraf.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, slug: true, title: true, message: true, photos: true, audioUrl: true, createdAt: true },
  });

  return (
    <main className="flex-1 min-h-dvh bg-[#fdf3ee]">
      <header className="relative bg-[linear-gradient(180deg,#8b1424,#6b0a17)] pt-6 pb-14 px-4 text-center text-white">
        <div className="absolute right-4 top-6">
          <EtirafSignOutButton email={session.user?.email} />
        </div>
        <EtirafLogo tone="light" size={52} />
        <p className="mt-3 text-sm text-white/85">Xoş gəldin, {session.user?.name?.split(" ")[0] || "dost"}! 👋</p>
      </header>

      <div className="relative -mt-8 mx-auto max-w-lg rounded-t-[2rem] bg-[#fdf3ee] px-4 pt-6 pb-12 flex flex-col gap-4">
        <h1 className="text-xl font-extrabold text-gray-900">Etiraflarım</h1>

        {etirafs.length === 0 ? (
          <div className="rounded-3xl bg-white border border-rose-100 p-8 flex flex-col items-center gap-3 text-center">
            <Heart size={36} className="text-rose-300" />
            <p className="font-bold text-gray-800">Hələ etirafın yoxdur</p>
            <p className="text-sm text-gray-500">
              Etiraf yaratmaq üçün sizə göndərilən xüsusi linki açın.
            </p>
          </div>
        ) : (
          etirafs.map((e) => (
            <div key={e.id} className="rounded-3xl bg-white border border-rose-100 p-3 flex gap-3 shadow-sm">
              <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-rose-50 flex items-center justify-center">
                {e.photos[0] ? (
                  <Image src={cldImage(e.photos[0], 300)} alt="" fill unoptimized className="object-cover" />
                ) : (
                  <EtirafLogo tone="dark" size={40} />
                )}
              </div>
              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <span className="font-bold text-gray-900 truncate">{e.title || "Sənin etirafın ♡"}</span>
                <span className="text-xs text-gray-500">
                  {[
                    e.photos.length ? `${e.photos.length} şəkil` : null,
                    e.message ? "1 mesaj" : null,
                    e.audioUrl ? "1 audio" : null,
                  ]
                    .filter(Boolean)
                    .join(" • ")}{" "}
                  ·{" "}
                  {e.createdAt.toLocaleDateString("az-AZ", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  <Link
                    href={`/etiraf/${e.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-[#c8102e]"
                  >
                    <Eye size={14} /> Bax
                  </Link>
                  <CopyEtirafLink
                    slug={e.slug}
                    className="rounded-full border border-rose-100 px-3 py-1.5 text-xs font-bold text-gray-700"
                  />
                  <EtirafQrButton
                    slug={e.slug}
                    className="rounded-full border border-rose-100 px-3 py-1.5 text-xs font-bold text-gray-700"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
