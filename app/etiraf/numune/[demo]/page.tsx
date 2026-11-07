import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEtirafDemo } from "@/lib/etirafDemos";
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
  const data = getEtirafDemo(demo, Array.isArray(dizayn) ? dizayn[0] : dizayn);
  if (!data) notFound();

  return (
    <main className="flex-1 relative">
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 rounded-full bg-black/55 backdrop-blur px-3 py-1 text-[11px] font-bold text-white tracking-wide">
        NÜMUNƏ
      </div>
      <EtirafView data={data} withIntro />
    </main>
  );
}
