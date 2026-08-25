import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AvatarImage } from "@/components/ui/AvatarImage";

interface ShopPageProps {
  params: Promise<{ username: string }>;
}

export default async function UserShopPage({ params }: ShopPageProps) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase().trim() },
    include: {
      products: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <header className="w-full bg-white border-b border-gray-100 py-4 px-4 sm:px-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black text-[#1a7a4a] tracking-tight">
            belink
          </Link>
          <Link
            href="/"
            className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
          >
            Öz səhifəni yarat
          </Link>
        </div>
      </header>

      <main className="w-full max-w-2xl px-4 py-8 flex flex-col gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 flex flex-col items-center text-center gap-4 shadow-xs">
          <AvatarImage
            src={user.image}
            alt={user.shopName || user.name || "Mağaza"}
            size={88}
            fallbackInitials={user.shopName ? user.shopName[0] : user.name ? user.name[0] : "B"}
            className="border-2 border-emerald-100 shadow-md"
          />

          <div className="flex flex-col gap-1 min-w-0 max-w-full">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight break-words max-w-full">
              {user.shopName || user.name || `@${user.username}`}
            </h1>
            <span className="text-xs font-bold text-[#1a7a4a] truncate max-w-full">@{user.username}</span>
          </div>

          {user.bio && (
            <p className="text-sm text-gray-600 max-w-md leading-relaxed whitespace-pre-line break-words max-w-full">
              {user.bio}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-extrabold text-gray-900">
              Məhsullar ({user.products.length})
            </h2>
          </div>

          {user.products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center flex flex-col items-center gap-3">
              <ShoppingBag size={32} className="text-gray-300" />
              <p className="text-sm font-bold text-gray-600">Məhsul yoxdur</p>
              <p className="text-xs text-gray-400">Bu mağazada hələ məhsul əlavə edilməyib.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.products.map((product) => {
                const message = encodeURIComponent(
                  `Salam, "${product.title}" məhsulu haqqında məlumat almaq istəyirəm. Qiymət: ${product.price} AZN. Səhifə: belink.az/${user.username}`
                );
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl border border-gray-100 p-4 shadow-xs flex flex-col justify-between gap-3 group min-w-0 overflow-hidden"
                  >
                    <div className="flex flex-col gap-3 min-w-0">
                      <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-gray-50 border border-gray-50 flex items-center justify-center">
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 right-3 bg-white/90 text-[#1a7a4a] font-extrabold text-xs px-3 py-1.5 rounded-full shadow-sm max-w-[120px] truncate">
                          {product.price} AZN
                        </span>
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm break-words line-clamp-2">{product.title}</h3>
                        {product.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed break-words">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/?text=${message}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#1a7a4a] hover:bg-[#156040] text-white font-bold text-xs shadow-md shadow-emerald-100 transition-all"
                    >
                      <MessageCircle size={15} /> Sifariş Et
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
