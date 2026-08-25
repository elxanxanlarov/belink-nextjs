"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { UserCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";

export default function SetUsernameModal() {
  const { data: session, status, update } = useSession();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const needsUsername =
    status === "authenticated" && Boolean((session?.user as any)?.needsUsername);

  if (!needsUsername) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/user/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Xəta baş verdi.");
        setLoading(false);
        return;
      }

      await update({ username: data.user.username });
      window.location.reload();
    } catch {
      setError("Xəta baş verdi. Yenidən cəhd edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-1 shadow-md p-2.5 relative overflow-hidden">
            <Image src="/favicon.png" alt="Belink" width={44} height={44} className="object-contain" priority />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#1a7a4a] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Qeydiyyatın Tamamlanması
          </span>
          <h2 className="text-xl font-extrabold text-gray-900 mt-1">İstifadəçi Adınızı Qeyd Edin</h2>
          <p className="text-xs text-gray-500">
            Şəxsi səhifənizin ünvanı bu adla hazır olacaq: <br />
            <strong className="text-gray-800">belink.az/{username || "username"}</strong>
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="İstifadəçi Adı (Username)"
            type="text"
            required
            maxLength={30}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="məs: myshop"
            autoFocus
          />

          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full py-3.5 rounded-full bg-[#1a7a4a] hover:bg-[#156040] text-white font-bold text-sm transition-all shadow-md shadow-emerald-200 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Yoxlanılır..." : "Qeydiyyatı Tamamla"}
          </button>
        </form>
      </div>
    </div>
  );
}
