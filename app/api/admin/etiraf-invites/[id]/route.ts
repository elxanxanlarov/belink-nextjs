import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/adminAuth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("belink_admin_token")?.value;
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: "İcazə verilmədi." }, { status: 401 });
  }

  const { id } = await params;
  if (!/^[a-f0-9]{24}$/i.test(id)) {
    return NextResponse.json({ error: "Yanlış identifikator." }, { status: 400 });
  }

  try {
    // Yalnız istifadə olunmamış linklər silinir — hazır etiraflar toxunulmaz qalır.
    const { count } = await prisma.etirafInvite.deleteMany({ where: { id, usedAt: null } });
    if (count === 0) {
      return NextResponse.json(
        { error: "Link tapılmadı və ya artıq istifadə olunub." },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Etiraf invite delete error:", error);
    return NextResponse.json({ error: "Link silinə bilmədi." }, { status: 500 });
  }
}
