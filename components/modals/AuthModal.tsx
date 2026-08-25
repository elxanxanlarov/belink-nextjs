"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import GoogleIcon from "@/assets/icons/GoogleIcon";
import { authModalData } from "@/data/modalData";
import { AuthModalProps } from "@/types";

export default function AuthModal({ isOpen, onClose, onOpenTerms }: AuthModalProps) {
  const [checked, setChecked] = useState(false);
  const [showError, setShowError] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setChecked(false);
    setShowError(false);
    onClose();
  };

  const handleSignIn = () => {
    if (!checked) {
      setShowError(true);
      return;
    }
    signIn("google", { callbackUrl: "/dashboard/profile" });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-1 shadow-md p-2.5 relative overflow-hidden">
            <Image src="/favicon.png" alt="Belink" width={44} height={44} className="object-contain" priority />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">{authModalData.title}</h2>
          <p className="text-sm text-gray-500">{authModalData.subtitle}</p>
        </div>

        <div className="flex items-start gap-3">
          <label className="flex items-start cursor-pointer group mt-0.5">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => {
                setChecked(e.target.checked);
                if (e.target.checked) setShowError(false);
              }}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 min-w-[20px] rounded-md border-2 flex items-center justify-center transition-all ${
                checked
                  ? "bg-[#1a7a4a] border-[#1a7a4a]"
                  : showError
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 group-hover:border-[#1a7a4a]"
              }`}
            >
              {checked && (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </label>
          <span
            className={`text-sm leading-relaxed transition-colors ${
              showError && !checked ? "text-red-500" : "text-gray-600"
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onOpenTerms?.();
              }}
              className="underline font-semibold text-[#1a7a4a] hover:text-[#156040] transition-colors cursor-pointer"
            >
              {authModalData.termsLink}
            </button>{" "}
            {authModalData.termsSuffix}
          </span>
        </div>

        {showError && !checked && (
          <p className="text-xs text-red-500 -mt-3 pl-8">{authModalData.errorText}</p>
        )}

        <button
          onClick={handleSignIn}
          className="flex items-center justify-center gap-3 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3.5 rounded-full transition-all shadow-sm w-full cursor-pointer"
        >
          <GoogleIcon size={20} />
          {authModalData.buttonText}
        </button>
      </div>
    </div>
  );
}

