import type { Metadata } from "next";

// Etiraf səhifələrinin brauzer tab ikonu — Etiraf hədiyyə qutusu loqosu
export const metadata: Metadata = {
  icons: {
    icon: "/etiraf/icon.png",
    shortcut: "/etiraf/icon.png",
    apple: "/etiraf/apple-icon.png",
  },
};

export default function EtirafLayout({ children }: { children: React.ReactNode }) {
  return children;
}
