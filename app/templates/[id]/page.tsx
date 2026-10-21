import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StorefrontView from "@/components/shop/storefront/StorefrontView";
import { PREMIUM_SHOP_TEMPLATES } from "@/data/shopTemplates";
import { getShopDemo } from "@/data/shopDemos";

interface TemplateDemoPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ palette?: string | string[] }>;
}

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export async function generateMetadata({ params }: TemplateDemoPageProps): Promise<Metadata> {
  const { id } = await params;
  const template = PREMIUM_SHOP_TEMPLATES.find((t) => t.id === id);
  return template ? { title: `${template.name} şablonu | Belink`, description: template.description } : {};
}

export default async function TemplateDemoPage({ params, searchParams }: TemplateDemoPageProps) {
  const { id } = await params;
  const { palette } = await searchParams;

  const template = PREMIUM_SHOP_TEMPLATES.find((t) => t.id === id);
  const demo = template ? getShopDemo(template.id) : null;
  if (!template || !demo) {
    notFound();
  }

  return <StorefrontView user={demo} template={template} paletteId={first(palette)} mode="demo" />;
}
