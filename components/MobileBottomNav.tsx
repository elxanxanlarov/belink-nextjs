"use client";

import { Home, ShoppingBag, Palette, Phone, User, Store } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface MobileBottomNavProps {
  onOpenAuth: () => void;
  onOpenContact: () => void;
}

export default function MobileBottomNav({ onOpenAuth, onOpenContact }: MobileBottomNavProps) {
  const { data: session, status } = useSession();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-gray-100 px-2 py-2 flex items-center justify-around shadow-lg backdrop-none">
      {/* Solda Ana Səhifə */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex flex-col items-center gap-0.5 text-[#1a7a4a] hover:text-[#156040] transition-colors cursor-pointer py-1"
      >
        <Home size={20} />
        <span className="text-[11px] font-bold">Ana səhifə</span>
      </button>

      {/* Mağazalar */}
      <button
        onClick={() => scrollToSection("magazalar")}
        className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer py-1"
      >
        <ShoppingBag size={20} />
        <span className="text-[11px] font-medium">Mağazalar</span>
      </button>

      {/* Dizaynlar */}
      <button
        onClick={() => scrollToSection("sablonlar")}
        className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer py-1"
      >
        <Palette size={20} />
        <span className="text-[11px] font-medium">Dizaynlar</span>
      </button>

      {/* Əlaqə */}
      <button
        onClick={onOpenContact}
        className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer py-1"
      >
        <Phone size={20} />
        <span className="text-[11px] font-medium">Əlaqə</span>
      </button>

      {/* Profil / Giriş */}
      {status === "authenticated" && session?.user ? (
        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-0.5 text-[#1a7a4a] hover:text-[#156040] transition-colors cursor-pointer py-1"
        >
          <Store size={20} />
          <span className="text-[11px] font-bold truncate max-w-[64px]">
            {session.user.name?.split(" ")[0] || "Mağazam"}
          </span>
        </Link>
      ) : (
        <button
          onClick={onOpenAuth}
          className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer py-1"
        >
          <User size={20} />
          <span className="text-[11px] font-medium">Daxil ol</span>
        </button>
      )}
    </div>
  );
}
