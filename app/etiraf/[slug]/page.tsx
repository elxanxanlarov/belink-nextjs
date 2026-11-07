import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cldTransform } from "@/lib/cloudinaryUrl";
import { EtirafView } from "@/components/etiraf/EtirafView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const getEtiraf = cache(async (slug: string) => {
  if (!/^[a-z0-9]{6,16}$/.test(slug)) return null;
  return prisma.etiraf.findUnique({
    where: { slug },
    select: { title: true, message: true, photos: true, audioUrl: true, audioDuration: true, musicUrl: true, design: true },
  });
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const etiraf = await getEtiraf(slug);
  const title = "Sənin üçün xüsusi bir etiraf var ♡";
  const cover = etiraf?.photos[0];
  return {
    title,
    description: "Sürprizi açmaq üçün toxun ♡ — belink.az/etiraf",
    robots: { index: false, follow: false },
    openGraph: {
      title,
      // Önizləmədə şəkil bulanıqlaşdırılır ki, sürpriz açılmamış görünməsin.
      images: cover ? [cldTransform(cover, "c_fill,w_1200,h_630,e_blur:1200,q_auto,f_jpg")] : [],
    },
  };
}

export default async function EtirafPublicPage({ params }: PageProps) {
  const { slug } = await params;
  const etiraf = await getEtiraf(slug);
  if (!etiraf) notFound();

  return (
    <main className="flex-1">
      <EtirafView data={etiraf} withIntro />
    </main>
  );
}
