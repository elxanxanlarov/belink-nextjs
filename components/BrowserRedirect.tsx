"use client";

import { useEffect, useState } from "react";
import { ExternalLink, X } from "lucide-react";

export default function BrowserRedirect() {
  const [showBanner, setShowBanner] = useState(false);
  const [platform, setPlatform] = useState<string>("");

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const currentUrl = window.location.href;

    // Instagram in-app browser detection
    if (userAgent.includes("Instagram")) {
      setPlatform("Instagram");
      setShowBanner(true);
    }
    // Facebook in-app browser detection
    else if (userAgent.includes("FBAN") || userAgent.includes("FBAV")) {
      setPlatform("Facebook");
      setShowBanner(true);
    }
    // TikTok in-app browser detection
    else if (userAgent.includes("TikTok") || userAgent.includes("BytedanceWebview")) {
      setPlatform("TikTok");
      setShowBanner(true);
    }
    // Snapchat in-app browser detection
    else if (userAgent.includes("Snapchat")) {
      setPlatform("Snapchat");
      setShowBanner(true);
    }
    // Twitter/X in-app browser detection
    else if (userAgent.includes("Twitter")) {
      setPlatform("Twitter");
      setShowBanner(true);
    }
    // LinkedIn in-app browser detection
    else if (userAgent.includes("LinkedInApp")) {
      setPlatform("LinkedIn");
      setShowBanner(true);
    }
  }, []);

  const handleOpenInBrowser = () => {
    const currentUrl = window.location.href;
    
    // Try multiple methods to open in external browser
    try {
      // Method 1: Open in new window (works on some platforms)
      window.open(currentUrl, "_blank");
      
      // Method 2: Create and click a link (backup method)
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = currentUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, 100);
    } catch (error) {
      console.error("Error opening in browser:", error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link kopyalandı! Brauzerinizdə yapışdırın.");
      setShowBanner(false);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        alert("Link kopyalandı! Brauzerinizdə yapışdırın.");
        setShowBanner(false);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
      document.body.removeChild(textArea);
    }
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Fixed Banner at Top */}
      <div className="fixed top-0 left-0 right-0 z-[200] bg-gradient-to-r from-[#1a7a4a] to-[#156040] text-white shadow-lg animate-in slide-in-from-top duration-300">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <ExternalLink size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-tight">
                {platform} tətbiqində tam funksionallıq olmaya bilər
              </p>
              <p className="text-xs opacity-90 leading-tight mt-0.5">
                Daha yaxşı təcrübə üçün brauzerdə açın
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleOpenInBrowser}
              className="px-4 py-2 rounded-full bg-white text-[#1a7a4a] font-bold text-xs hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              Brauzerdə Aç
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Bağla"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Alternative (shows if banner is dismissed and user scrolls) */}
      <div className="fixed bottom-4 left-4 right-4 z-[200] max-w-md mx-auto animate-in fade-in slide-in-from-bottom duration-300 md:left-auto md:right-4 md:bottom-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-50 text-[#1a7a4a] flex items-center justify-center">
              <ExternalLink size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 text-sm">
                {platform}-da problem yaşayırsınız?
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Səhifəni xarici brauzerdə açın
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleOpenInBrowser}
              className="flex-1 px-4 py-2.5 rounded-full bg-[#1a7a4a] hover:bg-[#156040] text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Brauzerdə Aç
            </button>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Linki Kopyala
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
