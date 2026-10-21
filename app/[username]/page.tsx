import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PublicShopView from "@/components/shop/PublicShopView";
import StorefrontView from "@/components/shop/storefront/StorefrontView";
import { getShopTemplate, isShopTemplateId, resolveShopTemplate } from "@/data/shopTemplates";

interface ShopPageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ template?: string | string[]; palette?: string | string[] }>;
}

export default async function UserShopPage({ params, searchParams }: ShopPageProps) {
  const { username } = await params;
  const { template: previewParam, palette: paletteParam } = await searchParams;

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
      isPremium: true,
      shopTemplate: true,
      shopPalette: true,
      banners: true,
      products: {
        select: {
          id: true,
          title: true,
          price: true,
          imageUrl: true,
          images: true,
          description: true,
          categoryId: true,
          category: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const { isPremium, shopTemplate, shopPalette, ...shop } = user;

  // ?template=<id> şablona önbaxış üçündür; mağazanın saxlanmış seçimini dəyişmir.
  const isPreview = isShopTemplateId(previewParam);
  const template = isPreview ? getShopTemplate(previewParam) : resolveShopTemplate(shopTemplate, isPremium);

  if (!template.premium) {
    return <PublicShopView user={shop} />;
  }

  const previewPalette = Array.isArray(paletteParam) ? paletteParam[0] : paletteParam;

  return (
    <StorefrontView
      user={shop}
      template={template}
      paletteId={isPreview ? (previewPalette ?? shopPalette) : shopPalette}
      mode={isPreview ? "preview" : "live"}
    />
  );
}
