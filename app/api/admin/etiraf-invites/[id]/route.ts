import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/adminAuth";
import { UNUSED_INVITE, normalizeInviteOptions } from "@/lib/etiraf";

/** İstifadə olunmamış linkin seçimlərini dəyişir (şəkil/yazı/səs, maks. şəkil, qeyd). */
export async function PATCH(
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

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Yanlış sorğu." }, { status: 400 });
  }

  const options = normalizeInviteOptions(body);
  if (!options.ok) {
    return NextResponse.json({ error: options.error }, { status: 400 });
  }

  try {
    const { count } = await prisma.etirafInvite.updateMany({
      where: { id, ...UNUSED_INVITE },
      data: options.data,
    });
    if (count === 0) {
      return NextResponse.json(
        { error: "Link tapılmadı və ya artıq istifadə olunub — dəyişmək olmaz." },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: true, invite: { id, ...options.data } });
  } catch (error) {
    console.error("Etiraf invite update error:", error);
    return NextResponse.json({ error: "Dəyişiklik yadda saxlanılmadı." }, { status: 500 });
  }
}

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
    const { count } = await prisma.etirafInvite.deleteMany({ where: { id, ...UNUSED_INVITE } });
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
