import type { Metadata } from "next";
import { EtirafSamples } from "@/components/etiraf/EtirafSamples";

export const metadata: Metadata = {
  title: "Etiraf nümunələri və qiymətlər",
  description: "Şəkil, musiqi, mətn və səs yazısı ilə QR kodlu etiraf hədiyyəsi — nümunələrə bax və WhatsApp-dan sifariş ver.",
};

export default function EtirafSamplesPage() {
  return <EtirafSamples />;
}
