import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ETIRAF_SAMPLES_PATH, etirafOrderWhatsappUrl, getEtirafDemo, getEtirafPackage } from "@/lib/etirafDemos";
import { EtirafView } from "@/components/etiraf/EtirafView";

export const metadata: Metadata = {
  title: "Sənin üçün xüsusi bir etiraf var ♡ — Nümunə",
  description: "Etiraf nümunəsi — QR kod oxunanda açılan səhifə belə görünür.",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ demo: string }>;
  searchParams: Promise<{ dizayn?: string | string[] }>;
}

export default async function EtirafDemoPage({ params, searchParams }: PageProps) {
  const { demo } = await params;
  const { dizayn } = await searchParams;
  const chosen = Array.isArray(dizayn) ? dizayn[0] : dizayn;
  const data = getEtirafDemo(demo, chosen);
  if (!data) notFound();
  const pkg = getEtirafPackage(demo);

  return (
    <main className="flex-1 relative">
      <EtirafView data={data} withIntro />

      {/* Giriş ekranı (z-30) açılandan sonra görünür */}
      <div className="fixed inset-x-0 bottom-0 z-20 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-md flex items-center gap-2 rounded-full bg-black/65 backdrop-blur p-1.5 pl-2 text-white shadow-2xl">
          <Link
            href={chosen ? `${ETIRAF_SAMPLES_PATH}?dizayn=${data.design}` : ETIRAF_SAMPLES_PATH}
            aria-label="Bütün nümunələr"
            className="w-9 h-9 shrink-0 rounded-full bg-white/15 flex items-center justify-center"
          >
            <ChevronLeft size={18} />
          </Link>
          <div className="flex flex-col min-w-0 flex-1 leading-tight">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Nümunə</span>
            <span className="text-xs font-bold truncate">
              {pkg ? `${pkg.label} · ${pkg.price} AZN` : "Etiraf nümunəsi"}
            </span>
          </div>
          {pkg && (
            <a
              href={etirafOrderWhatsappUrl(pkg, chosen ? data.design : null)}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full bg-[#25d366] px-4 py-2.5 text-xs font-bold text-white"
            >
              Sifariş ver
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
