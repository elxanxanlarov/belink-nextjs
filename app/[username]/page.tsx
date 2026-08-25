import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PublicShopView from "@/components/shop/PublicShopView";

interface ShopPageProps {
  params: Promise<{ username: string }>;
}

export default async function UserShopPage({ params }: ShopPageProps) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase().trim() },
    select: {
      id: true,
      name: true,
      username: true,
      shopName: true,
      bio: true,
      image: true,
      whatsappPhone: true,
      instagram: true,
      tiktok: true,
      linkedin: true,
      twitter: true,
      facebook: true,
      youtube: true,
      products: {
        select: {
          id: true,
          title: true,
          price: true,
          imageUrl: true,
          description: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return <PublicShopView user={user} />;
}
