"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft } from "lucide-react";
import Preloader from "@/components/ui/Preloader";
import { ProductForm } from "@/components/dashboard/ProductForm";
import { showToast } from "@/lib/swal";
import { DashboardProduct } from "@/types";

const PRODUCTS_PATH = "/dashboard/products";

/** Məhsul əlavə etmə / redaktə səhifəsi: ayrıca səhifədir, alt menyu göstərilmir. */
export default function ProductFormPage({ productId }: { productId?: string }) {
  const { status } = useSession();
  const router = useRouter();
  const [product, setProduct] = useState<DashboardProduct | null>(null);
  const [loading, setLoading] = useState(Boolean(productId));

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/");
  }, [status, router]);

  useEffect(() => {
    if (!productId || status !== "authenticated") return;

    const load = async () => {
      try {
        const res = await fetch("/api/products");
        const data = res.ok ? await res.json() : null;
        const found: DashboardProduct | undefined = data?.products?.find((p: DashboardProduct) => p.id === productId);
        if (!found) {
          showToast("Məhsul tapılmadı", "error");
          router.replace(PRODUCTS_PATH);
          return;
        }
        setProduct(found);
      } catch {
        showToast("Məhsulu yükləyərkən xəta baş verdi", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId, status, router]);

  if (status === "loading" || loading) {
    return <Preloader fullScreen text="Yüklənir..." />;
  }

  const isEdit = Boolean(productId);
  const backToList = () => router.push(PRODUCTS_PATH);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link
            href={PRODUCTS_PATH}
            aria-label="Məhsullara qayıt"
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-extrabold text-gray-900 truncate">
              {isEdit ? "Məhsulu Redaktə Et" : "Yeni Məhsul Əlavə Et"}
            </h1>
            <p className="text-xs text-gray-400">Məhsul məlumatlarını qeyd edin</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6">
        <ProductForm productToEdit={product} onCancel={backToList} onSuccess={backToList} />
      </main>
    </div>
  );
}
