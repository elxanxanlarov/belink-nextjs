import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/adminAuth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("belink_admin_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "İcazə verilmədi." }, { status: 401 });
    }

    const session = verifyAdminToken(token);
    if (!session) {
      return NextResponse.json({ error: "Sessiya bitib və ya etibarsızdır." }, { status: 401 });
    }

    const { id } = await params;
    if (!/^[a-f0-9]{24}$/i.test(id)) {
      return NextResponse.json({ error: "Yanlış istifadəçi identifikatoru." }, { status: 400 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body.isPremium !== "boolean") {
      return NextResponse.json({ error: "Yanlış sorğu." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ error: "İstifadəçi tapılmadı." }, { status: 404 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isPremium: body.isPremium },
      select: { id: true, isPremium: true },
    });

    return NextResponse.json({ success: true, customer: updated });
  } catch (error) {
    console.error("Admin customer update error:", error);
    return NextResponse.json(
      { error: "Dəyişikliyi yadda saxlayarkən xəta baş verdi." },
      { status: 500 }
    );
  }
}
