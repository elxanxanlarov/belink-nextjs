import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function DELETE(_req: Request, { params }: RouteProps) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "İcazə verilmədi." }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Kateqoriya tapılmadı." }, { status: 404 });
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Kateqoriya silinərkən xəta baş verdi." }, { status: 500 });
  }
}
