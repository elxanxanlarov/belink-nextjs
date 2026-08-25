"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, LogOut, ChevronDown, User as UserIcon, Store } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import GoogleIcon from "@/assets/icons/GoogleIcon";
import { NavbarProps } from "@/types";
import { confirmLogout } from "@/lib/swal";
import { AvatarImage } from "@/components/ui/AvatarImage";

export default function Navbar({ onGoogleClick, onOpenImagePreview }: NavbarProps) {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGoogle = () => {
    if (onGoogleClick) {
      onGoogleClick();
    } else {
      signIn("google", { callbackUrl: "/dashboard/products" });
    }
  };

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    setMenuOpen(false);
    const confirmed = await confirmLogout();
    if (confirmed) {
      signOut({ callbackUrl: "/" });
    }
  };

  const user = session?.user;
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const userUsername = (user as any)?.username;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-[#1a7a4a] tracking-tight">
            belink
          </Link>

          <div className="hidden md:flex items-center gap-3">
            {status === "authenticated" && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-gray-50 border border-gray-200 transition-all cursor-pointer"
                >
                  <div
                    onClick={(e) => {
                      if (user.image && onOpenImagePreview) {
                        e.stopPropagation();
                        onOpenImagePreview(user.image);
                      }
                    }}
                    className="cursor-pointer hover:scale-105 transition-transform"
                    title="Şəklə böyük bax"
                  >
                    <AvatarImage
                      src={user.image}
                      alt={user.name || "User"}
                      size={32}
                      fallbackInitials={userInitials}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 max-w-[140px] truncate">
                    {user.name || "İstifadəçi"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-150 z-50">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1a7a4a] transition-colors"
                      >
                        <UserIcon size={16} />
                        Profilim
                      </Link>

                      {userUsername && (
                        <Link
                          href={`/${userUsername}`}
                          target="_blank"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1a7a4a] transition-colors"
                        >
                          <Store size={16} />
                          Mağazam
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-gray-100">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                      >
                        <LogOut size={16} />
                        Çıxış et
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleGoogle}
                className="flex items-center gap-2.5 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm cursor-pointer"
              >
                <GoogleIcon size={18} /> Google ilə davam et
              </button>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-3">
          {status === "authenticated" && user ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <AvatarImage
                  src={user.image}
                  alt={user.name || "User"}
                  size={40}
                  fallbackInitials={userInitials}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-gray-900 truncate">{user.name}</span>
                  <span className="text-xs text-gray-500 truncate">{user.email}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  <UserIcon size={18} className="text-[#1a7a4a]" />
                  Profilim
                </Link>

                {userUsername && (
                  <Link
                    href={`/${userUsername}`}
                    target="_blank"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50"
                  >
                    <Store size={18} className="text-[#1a7a4a]" />
                    Mağazam
                  </Link>
                )}
              </div>

              <button
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 border border-red-200 text-red-600 bg-red-50 text-sm font-semibold px-5 py-3 rounded-full w-full cursor-pointer hover:bg-red-100 transition-colors"
              >
                <LogOut size={16} /> Çıxış et
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleGoogle();
              }}
              className="flex items-center justify-center gap-2.5 border border-gray-200 bg-white text-gray-700 text-sm font-semibold px-5 py-3 rounded-full w-full cursor-pointer"
            >
              <GoogleIcon size={18} /> Google ilə davam et
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
