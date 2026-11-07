import { notFound, redirect } from "next/navigation";
import { validateAdminSecretId } from "@/lib/adminAuth";
import AdminClientPage from "@/components/admin/AdminClientPage";
import { ADMIN_TAB_SLUGS } from "@/data/adminData";

interface PageProps {
  params: Promise<{ id: string; tab?: string[] }>;
}

export default async function AdminPanelPage({ params }: PageProps) {
  const { id: secretId, tab } = await params;

  if (!validateAdminSecretId(secretId)) {
    redirect("/");
  }

  // /admin-panel/{id}, /admin-panel/{id}/etiraf, /magaza, /statistika
  if (tab && (tab.length > 1 || !Object.values(ADMIN_TAB_SLUGS).includes(tab[0]))) {
    notFound();
  }

  return <AdminClientPage secretId={secretId} />;
}
