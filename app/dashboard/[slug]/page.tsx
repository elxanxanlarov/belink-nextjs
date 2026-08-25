"use client";

import Preloader from "@/components/ui/Preloader";
import React, { use, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { DashboardProduct, DashboardTab, UserProfileData } from "@/types";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProductList } from "@/components/dashboard/ProductList";
import { ProfileView } from "@/components/dashboard/ProfileView";
import { ProductModal } from "@/components/dashboard/ProductModal";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { showToast } from "@/lib/swal";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function DashboardSlugPage({ params }: PageProps) {
  const { slug } = use(params);
  const { status } = useSession();
  const router = useRouter();

  const initialTab: DashboardTab = slug === "profile" ? "profile" : "products";
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<DashboardProduct | null>(null);

  useEffect(() => {
    if (slug === "profile" || slug === "products") {
      setActiveTab(slug);
    }
  }, [slug]);

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    router.push(`/dashboard/${tab}`);
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [productsRes, profileRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/user/profile"),
      ]);

      if (productsRes.ok) {
        const prodData = await productsRes.json();
        setProducts(prodData.products || []);
      }

      if (profileRes.ok) {
        const profData = await profileRes.json();
        setProfile(profData.user || null);
      }
    } catch {
      showToast("Məlumatları yükləyərkən xəta baş verdi", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    } else if (status === "authenticated") {
      loadDashboardData();
    }
  }, [status, router]);

  const handleOpenAdd = () => {
    if (!profile?.whatsappPhone) {
      Swal.fire({
        title: "WhatsApp Nömrəsi Tələb Olunur",
        text: "Məhsul yaratmaq üçün əvvəlcə profilinizdə WhatsApp nömrənizi qeyd etməlisiniz ki, müştərilər sizinlə əlaqə saxlaya bilsin.",
        icon: "info",
        confirmButtonText: "Profilə Get",
        showCancelButton: true,
        cancelButtonText: "Bağla",
        customClass: {
          popup: "rounded-3xl shadow-2xl font-sans border border-gray-100",
          confirmButton: "px-6 py-2.5 rounded-full font-bold text-sm bg-[#1a7a4a] text-white cursor-pointer mr-2",
          cancelButton: "px-6 py-2.5 rounded-full font-bold text-sm bg-gray-100 text-gray-700 cursor-pointer",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/dashboard/profile?phoneInput=true");
          setActiveTab("profile");
        }
      });
      return;
    }
    setProductToEdit(null);
    setModalOpen(true);
  };

  const handleEdit = (product: DashboardProduct) => {
    setProductToEdit(product);
    setModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    const result = await Swal.fire({
      title: "Məhsulu silmək istəyirsiniz?",
      text: "Bu əməliyyat geri qaytarılmır.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Bəli, sil",
      cancelButtonText: "Ləğv et",
      customClass: {
        popup: "rounded-3xl shadow-2xl font-sans border border-gray-100",
        confirmButton: "px-6 py-2.5 rounded-full font-bold text-sm bg-red-600 text-white cursor-pointer mr-2",
        cancelButton: "px-6 py-2.5 rounded-full font-bold text-sm bg-gray-100 text-gray-700 cursor-pointer",
      },
      buttonsStyling: false,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Silinmədi.");

      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showToast("Məhsul silindi", "success");
    } catch {
      showToast("Məhsul silinərkən xəta baş verdi", "error");
    }
  };

  const handleProfileUpdated = (updated: UserProfileData) => {
    setProfile(updated);
  };

  if (status === "loading" || (loading && !profile)) {
    return <Preloader fullScreen text="Yüklənir..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-12">
      <DashboardHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenAddModal={handleOpenAdd}
        profile={profile}
        productCount={products.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8">
        {activeTab === "products" && (
          <ProductList
            products={products}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleOpenAdd}
          />
        )}

        {activeTab === "profile" && (
          <ProfileView
            initialProfile={profile}
            onProfileUpdated={handleProfileUpdated}
          />
        )}
      </main>

      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={loadDashboardData}
        productToEdit={productToEdit}
      />

      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenAddModal={handleOpenAdd}
        username={profile?.username}
      />
    </div>
  );
}
