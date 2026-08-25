import { redirect } from "next/navigation";
import { validateAdminSecretId } from "@/lib/adminAuth";
import AdminClientPage from "@/components/admin/AdminClientPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminPanelPage({ params }: PageProps) {
  const { id: secretId } = await params;

  if (!validateAdminSecretId(secretId)) {
    redirect("/");
  }

  return <AdminClientPage secretId={secretId} />;
}
