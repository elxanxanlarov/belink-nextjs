import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailView from "@/components/shop/ProductDetailView";
import { getShopDemo } from "@/data/shopDemos";

interface TemplateProductPageProps {
  params: Promise<{ id: string; productId: string }>;
}

function getDemoProduct(templateId: string, productId: string) {
  const demo = getShopDemo(templateId);
  const product = demo?.products.find((p) => p.id === productId);
  return demo && product ? { demo, product } : null;
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

export default async function TemplateProductPage({ params }: TemplateProductPageProps) {
  const { id, productId } = await params;
  const found = getDemoProduct(id, productId);
  if (!found) {
    notFound();
  }

  const { demo, product } = found;

  return (
    <ProductDetailView
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
      shopHref={`/templates/${id}`}
      isDemo
    />
  );
}
