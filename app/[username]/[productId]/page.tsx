import React, { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getShopTitle } from "@/lib/shopTitle";
import { prisma } from "@/lib/prisma";
import ProductDetailView from "@/components/shop/ProductDetailView";
import StorefrontProductView from "@/components/shop/storefront/StorefrontProductView";
import { resolveShopTemplate } from "@/data/shopTemplates";

interface ProductPageProps {
  params: Promise<{ username: string; productId: string }>;
}

const productSelect = {
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
} as const;

const getProduct = cache(async (username: string, productId: string) => {
  if (!/^[a-f0-9]{24}$/i.test(productId)) return null;

  return prisma.product.findFirst({
    where: {
      id: productId,
      user: { username: username.toLowerCase().trim() },
    },
    select: {
      ...productSelect,
      user: {
        select: {
          id: true,
          username: true,
          shopName: true,
          name: true,
          image: true,
          whatsappPhone: true,
          isPremium: true,
          shopTemplate: true,
          shopPalette: true,
        },
      },
    },
  });
});

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { username, productId } = await params;
  const product = await getProduct(username, productId);
  if (!product) return {};

  const shopTitle = getShopTitle(product.user);
  return {
    title: `${product.title} — ${shopTitle} | Belink`,
    description: product.description || `${product.title} — ${product.price} AZN`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { username, productId } = await params;
  const product = await getProduct(username, productId);

  if (!product || !product.user.username) {
    notFound();
  }

  const otherProducts = await prisma.product.findMany({
    where: { userId: product.user.id, id: { not: product.id } },
    select: productSelect,
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  const { user, ...productData } = product;
  const shop = {
    username: product.user.username,
    shopName: user.shopName,
    name: user.name,
    image: user.image,
    whatsappPhone: user.whatsappPhone,
  };

  // Premium şablonu olan mağazada məhsul səhifəsi də həmin dizaynda göstərilir.
  const template = resolveShopTemplate(user.shopTemplate, user.isPremium);
  if (template.premium) {
    return (
      <StorefrontProductView
        key={productData.id}
        shop={shop}
        product={productData}
        otherProducts={otherProducts}
        template={template}
        paletteId={user.shopPalette}
        shopPath={`/${shop.username}`}
      />
    );
  }

  return <ProductDetailView key={productData.id} shop={shop} product={productData} otherProducts={otherProducts} />;
}
