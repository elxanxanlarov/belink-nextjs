import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EtirafLogo } from "@/components/etiraf/EtirafLogo";
import { EtirafWizard } from "@/components/etiraf/EtirafWizard";
import { EtirafSignInButton, EtirafSignOutButton } from "@/components/etiraf/EtirafClientBits";

export const metadata: Metadata = {
  title: "Yeni Etiraf Yarat — Etiraf",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ token: string }>;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 min-h-dvh bg-[radial-gradient(ellipse_at_top,#a3162b_0%,#6b0a17_55%,#3d0610_100%)] flex flex-col items-center justify-center gap-8 px-6 py-12 text-center text-white">
      <EtirafLogo tone="light" size={84} />
      {children}
    </main>
  );
}

export default async function EtirafCreatePage({ params }: PageProps) {
  const { token } = await params;

  const invite = /^[A-Za-z0-9]{8,32}$/.test(token)
    ? await prisma.etirafInvite.findUnique({
        where: { token },
        select: {
          token: true,
          allowPhotos: true,
          allowText: true,
          allowAudio: true,
          maxPhotos: true,
          usedAt: true,
          usedById: true,
          etiraf: { select: { slug: true } },
        },
      })
    : null;

  if (!invite) {
    return (
      <Shell>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-extrabold">Link etibarsızdır</h1>
          <p className="text-white/75 text-sm">Bu link mövcud deyil və ya ləğv olunub.</p>
        </div>
        <Link href="/etiraf" className="px-6 py-3 rounded-full bg-white text-[#8b1424] font-bold text-sm">
          Etiraf səhifəsinə keç
        </Link>
      </Shell>
    );
  }

  const session = await auth();
  const userId = session?.user?.id;

  if (invite.usedAt) {
    const isMine = userId && invite.usedById === userId;
    return (
      <Shell>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-extrabold">Bu link artıq istifadə olunub</h1>
          <p className="text-white/75 text-sm max-w-xs">
            Hər link ilə yalnız bir etiraf yaratmaq olar. Yeni etiraf üçün bizimlə əlaqə saxlayın.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {isMine && invite.etiraf && (
            <Link
              href={`/etiraf/${invite.etiraf.slug}`}
              className="px-6 py-3 rounded-full bg-white text-[#8b1424] font-bold text-sm"
            >
              Etirafıma bax
            </Link>
          )}
          <Link href="/etiraf" className="px-6 py-3 rounded-full border border-white/50 font-bold text-sm">
            Etiraflarım
          </Link>
        </div>
        {userId && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-white/60">Başqa hesabla daxil olmaq üçün:</span>
            <EtirafSignOutButton email={session?.user?.email} />
          </div>
        )}
      </Shell>
    );
  }

  if (!userId) {
    return (
      <Shell>
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-extrabold leading-tight">
            Sevdiyinə unudulmaz
            <br />
            sürpriz hazırla ♡
          </h1>
          <ul className="flex flex-col gap-2 text-sm text-white/85 mt-2">
            {invite.allowPhotos && <li>📷 Şəkillər əlavə et</li>}
            {invite.allowText && <li>✍️ Ürək sözlərini yaz</li>}
            {invite.allowAudio && <li>🎙️ Səsli mesaj göndər</li>}
          </ul>
        </div>
        <EtirafSignInButton callbackUrl={`/etiraf/yarat/${invite.token}`} />
        <p className="text-xs text-white/60 max-w-xs">Davam etmək üçün Google hesabınızla daxil olun.</p>
      </Shell>
    );
  }

  return (
    <EtirafWizard
      invite={{
        token: invite.token,
        allowPhotos: invite.allowPhotos,
        allowText: invite.allowText,
        allowAudio: invite.allowAudio,
        maxPhotos: invite.maxPhotos,
      }}
      customer={{ name: session.user?.name ?? null, email: session.user?.email ?? null }}
    />
  );
}
