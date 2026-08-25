"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ShoppingCart, MessageCircle, Star, Zap, ArrowRight, Store } from "lucide-react";
import Navbar from "../components/Navbar";
import { features, avatars, socialLinks, products, cartItems } from "@/data/landingData";
import GoogleIcon from "@/assets/icons/GoogleIcon";
import Image from "next/image";
import AuthModal from "@/components/modals/AuthModal";
import PrivacyModal from "@/components/modals/PrivacyModal";
import TermsModal from "@/components/modals/TermsModal";
import ContactModal from "@/components/modals/ContactModal";
import ImagePreviewModal from "@/components/modals/ImagePreviewModal";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function Home() {
  const { status } = useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  const handleOpenImagePreview = (url: string) => {
    setPreviewImageUrl(url);
    setPreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans pb-16 md:pb-0">
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onOpenTerms={() => setTermsOpen(true)}
      />
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      <ImagePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        imageUrl={previewImageUrl}
      />
      <Navbar
        onGoogleClick={() => setAuthOpen(true)}
        onOpenImagePreview={handleOpenImagePreview}
      />

      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <span className="inline-flex items-center gap-2 bg-emerald-50 text-[#1a7a4a] text-sm font-semibold px-4 py-2 rounded-full w-fit border border-emerald-100">
              <Zap size={14} className="fill-[#1a7a4a]" />
              Sənin linkin. Sənin mağazan.
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Bir linklə{" "}
              <span className="text-[#1a7a4a]">biznesini böyüt.</span>
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed max-w-md">
              Belink ilə öz şəxsi səhifəni yarat, məhsullarını paylaş,
              müştərilərinlə daha asan əlaqə qur.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              {status === "authenticated" ? (
                <Link
                  href="/dashboard/products"
                  className="flex items-center justify-center gap-2.5 bg-[#1a7a4a] hover:bg-[#156040] text-white font-bold px-7 py-3.5 rounded-full transition-all shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 active:scale-95 cursor-pointer"
                >
                  <Store size={18} /> Mağazam
                </Link>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="flex items-center justify-center gap-2.5 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-7 py-3.5 rounded-full transition-all shadow-sm cursor-pointer"
                >
                  <GoogleIcon size={20} /> Google ilə davam et
                </button>
              )}

              <button
                onClick={() => {
                  document.getElementById("niye-belink")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-7 py-3.5 rounded-full transition-all shadow-sm cursor-pointer"
              >
                Niyə Belink? <ArrowRight size={18} />
              </button>
            </div>

            {/* 1000+ istifadəçi hissəsi müvəqqəti deaktiv edildi */}
          </div>

          <div className="relative flex justify-center md:justify-end">
            <div className="relative w-72 md:w-80">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 relative z-10">
                <div className="flex flex-col items-center gap-1 mb-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center p-2.5 shadow-md relative overflow-hidden ring-4 ring-emerald-50/60">
                    <Image src="/favicon.png" alt="belink" width={40} height={40} className="object-contain" priority />
                  </div>
                  <p className="font-bold text-gray-900 text-base mt-1">My Shop</p>
                  <p className="text-xs text-gray-400">Keyfiyyətli məhsullar, münasib qiymət ✨</p>
                </div>

                <div className="flex justify-center gap-5 mb-4">
                  {socialLinks.map((s, i) => (
                    <button
                      key={i}
                      className="flex flex-col items-center gap-1 text-[#1a7a4a] hover:scale-110 transition-transform"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                        {s.icon}
                      </div>
                      <span className="text-xs text-gray-500">{s.label}</span>
                    </button>
                  ))}
                </div>

                <p className="text-xs font-semibold text-gray-700 mb-2">Məhsullar</p>
                <div className="grid grid-cols-2 gap-2">
                  {products.map((p, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-2.5 flex flex-col gap-1.5">
                      <div className="w-full h-16 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-2xl">
                        {p.emoji}
                      </div>
                      <p className="text-xs font-semibold text-gray-800 leading-tight">{p.name}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1a7a4a]">{p.price}</span>
                        <button className="w-6 h-6 rounded-full bg-[#1a7a4a] flex items-center justify-center">
                          <ShoppingCart size={11} className="text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -right-6 top-1/4 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-48 z-20">
                <p className="text-xs font-bold text-gray-700 mb-2">Səbət (2)</p>
                <div className="flex flex-col gap-1.5 mb-3">
                  {cartItems.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs text-gray-600">
                      <span>{item.name}</span>
                      <span className="text-[#1a7a4a] font-semibold">{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-800 mb-2 pt-2 border-t border-gray-100">
                  <span>Cəmi:</span>
                  <span className="text-[#1a7a4a]">115 AZN</span>
                </div>
                <button className="w-full flex items-center justify-center gap-1.5 bg-[#1a7a4a] text-white text-xs font-semibold py-2 rounded-xl">
                  <MessageCircle size={12} /> WhatsApp ilə sifariş et
                </button>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-2.5 flex items-center gap-2 z-20">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-gray-800">4.9</span>
                {/* 1200+ istifadəçi dəyəri müvəqqəti deaktiv edildi */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="niye-belink" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#1a7a4a] text-sm font-semibold uppercase tracking-widest">
              Niyə Belink?
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">
              Bütün ehtiyacların bir yerdə
            </h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto text-base">
              Məhsullarını əlavə et, linklərini paylaş və müştərilərindən sifarişləri asanlıqla qəbul et.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 flex flex-col items-center text-center gap-3 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-sm">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xl font-bold text-[#1a7a4a]">belink</span>
          <p className="text-sm text-gray-400">© 2026 Belink. Bütün hüquqlar qorunur.</p>
          <div className="flex gap-5 text-sm text-gray-500">
            <button
              onClick={() => setTermsOpen(true)}
              className="hover:text-gray-800 transition-colors cursor-pointer"
            >
              Şərtlər
            </button>
            <button
              onClick={() => setPrivacyOpen(true)}
              className="hover:text-gray-800 transition-colors cursor-pointer"
            >
              Məxfilik
            </button>
            <button
              onClick={() => setContactOpen(true)}
              className="hover:text-gray-800 transition-colors cursor-pointer"
            >
              Əlaqə
            </button>
          </div>
        </div>
      </footer>
      <MobileBottomNav
        onOpenAuth={() => setAuthOpen(true)}
        onOpenContact={() => setContactOpen(true)}
      />
    </div>
  );
}
