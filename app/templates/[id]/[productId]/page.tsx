import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StorefrontProductView from "@/components/shop/storefront/StorefrontProductView";
import { PREMIUM_SHOP_TEMPLATES } from "@/data/shopTemplates";
import { getShopDemo } from "@/data/shopDemos";

interface TemplateProductPageProps {
  params: Promise<{ id: string; productId: string }>;
  searchParams: Promise<{ palette?: string | string[] }>;
}

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

function getDemoProduct(templateId: string, productId: string) {
  const template = PREMIUM_SHOP_TEMPLATES.find((t) => t.id === templateId);
  const demo = template ? getShopDemo(template.id) : null;
  const product = demo?.products.find((p) => p.id === productId);
  return template && demo && product ? { template, demo, product } : null;
}

export async function generateMetadata({ params }: TemplateProductPageProps): Promise<Metadata> {
  const { id, productId } = await params;
  const found = getDemoProduct(id, productId);
  if (!found) return {};

  return {
    title: `${found.product.title} — ${found.demo.shopName} | Belink`,
    description: found.product.description || `${found.product.title} — ${found.product.price} AZN`,
  };
}

export default async function TemplateProductPage({ params, searchParams }: TemplateProductPageProps) {
  const { id, productId } = await params;
  const { palette } = await searchParams;
  const found = getDemoProduct(id, productId);
  if (!found) {
    notFound();
  }

  const { template, demo, product } = found;

  return (
    <StorefrontProductView
      key={product.id}
      shop={{
        username: demo.username ?? `demo-${id}`,
        shopName: demo.shopName,
        name: demo.name,
        image: demo.image,
        whatsappPhone: demo.whatsappPhone,
      }}
      product={product}
      otherProducts={demo.products.filter((p) => p.id !== product.id).slice(0, 8)}
      template={template}
      paletteId={first(palette)}
      shopPath={`/templates/${id}`}
      isDemo
    />
  );
}
