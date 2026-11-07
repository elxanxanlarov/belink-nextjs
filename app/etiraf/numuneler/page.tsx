import type { Metadata } from "next";
import { EtirafSamples } from "@/components/etiraf/EtirafSamples";
import { ETIRAF_DESIGN_IDS, type EtirafDesign } from "@/lib/etirafShared";

export const metadata: Metadata = {
  title: "Etiraf nümunələri və qiymətlər",
  description: "Şəkil, musiqi, mətn və səs yazısı ilə QR kodlu etiraf hədiyyəsi — nümunələrə bax və WhatsApp-dan sifariş ver.",
};

interface PageProps {
  searchParams: Promise<{ dizayn?: string | string[] }>;
}

export default async function EtirafSamplesPage({ searchParams }: PageProps) {
  const { dizayn } = await searchParams;
  const value = Array.isArray(dizayn) ? dizayn[0] : dizayn;
  const initialDesign = ETIRAF_DESIGN_IDS.includes(value as EtirafDesign) ? (value as EtirafDesign) : null;
  return <EtirafSamples initialDesign={initialDesign} />;
}
