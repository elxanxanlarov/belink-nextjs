import type { Metadata } from "next";

// Etiraf səhifələrinin brauzer tab ikonu — 🎁
export const metadata: Metadata = {
  icons: {
    icon: "/etiraf/icon.svg",
    shortcut: "/etiraf/icon.svg",
    apple: "/etiraf/icon.svg",
  },
};

export default function EtirafLayout({ children }: { children: React.ReactNode }) {
  return children;
}
