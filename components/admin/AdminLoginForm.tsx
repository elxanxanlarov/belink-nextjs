"use client";

import React, { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { AdminLoginFormProps } from "@/types";

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  secretId,
  onSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, secretId }),
        });

        const data = await res.json();
        if (!res.ok) {
          setLoginError(data.error || "Giriş uğursuz oldu.");
          return;
        }

        onSuccess(data.user);
      } catch {
        setLoginError("Xəta baş verdi. Yenidən cəhd edin.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/40 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-100 rounded-3xl shadow-xl p-8 sm:p-10 w-full max-w-md flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-[#1a7a4a] text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-emerald-100 mb-1">
            b
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#1a7a4a] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            İnzibatçı Paneli
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Admin Girişi</h1>
          <p className="text-xs text-gray-400">Daxil olmaq üçün məlumatlarınızı qeyd edin</p>
        </div>

        {loginError && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600">
            {loginError}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input
            label="E-poçt"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@belink.az"
          />

          <Input
            label="Şifrə"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full py-3.5 rounded-full bg-[#1a7a4a] hover:bg-[#156040] text-white font-bold text-sm transition-all shadow-md shadow-emerald-200 disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "Yoxlanılır..." : "Daxil ol"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginForm;
