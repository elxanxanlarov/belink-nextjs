"use client";

import React, { useState } from "react";
import { X, Loader2, Tag } from "lucide-react";
import { Category } from "@/types";
import { Input } from "@/components/ui/Input";
import { showToast } from "@/lib/swal";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (category: Category) => void;
}

export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Xəta baş verdi.");
        return;
      }

      showToast(`"${data.category.name}" kateqoriyası yaradıldı`, "success");
      onCreated(data.category);
      setName("");
      onClose();
    } catch {
      setError("Xəta baş verdi. Yenidən cəhd edin.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setName("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 select-none">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Tag size={18} className="text-[#1a7a4a]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Yeni Kateqoriya</h3>
              <p className="text-[11px] text-gray-400">Məhsullarınızı qruplaşdırın</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Kateqoriya Adı"
            type="text"
            required
            maxLength={50}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder="məs: Geyim, Çanta, Aksesuar..."
            autoFocus
          />

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 rounded-full border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Ləğv et
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="flex-1 py-3 rounded-full bg-[#1a7a4a] hover:bg-[#156040] text-white font-bold text-sm transition-all shadow-md shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Yaradılır...
                </>
              ) : (
                "Yarat"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryModal;
