"use client";

import { X, Mail, MessageCircle, Clock } from "lucide-react";
import { contactModalData } from "@/data/modalData";
import { BaseModalProps } from "@/types";

export default function ContactModal({ isOpen, onClose }: BaseModalProps) {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    if (type.includes("E-poçt")) return <Mail size={20} className="text-[#1a7a4a]" />;
    if (type.includes("WhatsApp")) return <MessageCircle size={20} className="text-[#1a7a4a]" />;
    return <Clock size={20} className="text-[#1a7a4a]" />;
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center gap-1.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#1a7a4a] mb-1">
            <Mail size={24} />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">{contactModalData.title}</h2>
          <p className="text-sm text-gray-500">{contactModalData.subtitle}</p>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {contactModalData.contacts.map((contact, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/70 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs flex-shrink-0">
                {getIcon(contact.type)}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{contact.type}</span>
                {contact.href ? (
                  <a
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-gray-800 hover:text-[#1a7a4a] transition-colors truncate"
                  >
                    {contact.value}
                  </a>
                ) : (
                  <span className="text-sm font-bold text-gray-800 truncate">{contact.value}</span>
                )}
                <span className="text-xs text-gray-500 mt-0.5">{contact.description}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors cursor-pointer"
        >
          Bağla
        </button>
      </div>
    </div>
  );
}
