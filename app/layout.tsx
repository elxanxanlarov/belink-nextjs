import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Belink — Bir linklə biznesini böyüt",
  description: "Belink ilə öz şəxsi səhifəni yarat, məhsullarını paylaş, müştərilərinlə daha asan əlaqə qur.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="az"
      className={`${jakarta.variable} font-sans h-full antialiased`}
    >
      <body className={`${jakarta.className} min-h-full flex flex-col`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}


