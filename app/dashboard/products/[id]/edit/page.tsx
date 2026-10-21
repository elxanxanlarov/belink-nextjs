import ProductFormPage from "@/components/dashboard/ProductFormPage";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  return <ProductFormPage productId={id} />;
}
