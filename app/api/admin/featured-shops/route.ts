import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/adminAuth";

const MAX_FEATURED_SHOPS = 50;

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("belink_admin_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "İcazə verilmədi." }, { status: 401 });
    }

    const session = verifyAdminToken(token);
    if (!session) {
      return NextResponse.json({ error: "Sessiya bitib və ya etibarsızdır." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const ids: unknown = body?.ids;
    if (
      !Array.isArray(ids) ||
      ids.length > MAX_FEATURED_SHOPS ||
      !ids.every((id): id is string => typeof id === "string" && /^[a-f0-9]{24}$/i.test(id)) ||
      new Set(ids).size !== ids.length
    ) {
      return NextResponse.json({ error: "Yanlış sorğu." }, { status: 400 });
    }

    const users = await prisma.user.findMany({
      where: { id: { in: ids } },
      select: { id: true, username: true },
    });
    const eligible = users.filter((u) => u.username && !u.username.startsWith("pending_"));
    if (eligible.length !== ids.length) {
      return NextResponse.json(
        { error: "Seçilmiş mağazalardan biri tapılmadı və ya istifadəçi adı təyin etməyib." },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.user.updateMany({
        where: { isFeatured: true, id: { notIn: ids } },
        data: { isFeatured: false, featuredOrder: null },
      }),
      ...ids.map((id, index) =>
        prisma.user.update({
          where: { id },
          data: { isFeatured: true, featuredOrder: index },
        })
      ),
    ]);

    return NextResponse.json({ success: true, ids });
  } catch (error) {
    console.error("Featured shops update error:", error);
    return NextResponse.json(
      { error: "Dəyişikliyi yadda saxlayarkən xəta baş verdi." },
      { status: 500 }
    );
  }
}
