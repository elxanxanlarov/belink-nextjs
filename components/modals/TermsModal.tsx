"use client";

import { X } from "lucide-react";
import { termsModalData } from "@/data/modalData";
import { BaseModalProps } from "@/types";

export default function TermsModal({ isOpen, onClose }: BaseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-extrabold text-gray-900">{termsModalData.title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto px-7 py-6 flex flex-col gap-5">
          <p className="text-xs text-gray-400 font-medium">{termsModalData.lastUpdated}</p>
          {termsModalData.sections.map((section, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <h3 className="text-sm font-bold text-gray-800">{section.heading}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>

        <div className="px-7 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors"
          >
            Bağla
          </button>
        </div>
      </div>
    </div>
  );
}
