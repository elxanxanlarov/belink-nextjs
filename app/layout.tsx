import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import SetUsernameModal from "@/components/modals/SetUsernameModal";
import { auth } from "@/lib/auth";

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html
      lang="az"
      className={`${jakarta.variable} font-sans h-full antialiased`}
    >
      <body className={`${jakarta.className} min-h-full flex flex-col`}>
        <AuthProvider session={session}>
          <SetUsernameModal />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
