import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/adminAuth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("belink_admin_token")?.value;
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: "İcazə verilmədi." }, { status: 401 });
  }

  const { id } = await params;
  if (!/^[a-f0-9]{24}$/i.test(id)) {
    return NextResponse.json({ error: "Yanlış istifadəçi identifikatoru." }, { status: 400 });
  }

  try {
    const etirafs = await prisma.etiraf.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        message: true,
        photos: true,
        audioUrl: true,
        musicUrl: true,
        design: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      etirafs: etirafs.map((e) => ({
        id: e.id,
        slug: e.slug,
        title: e.title,
        cover: e.photos[0] ?? null,
        photoCount: e.photos.length,
        hasMessage: Boolean(e.message),
        hasAudio: Boolean(e.audioUrl),
        hasMusic: Boolean(e.musicUrl),
        design: e.design,
        createdAt: e.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Customer etirafs fetch error:", error);
    return NextResponse.json({ error: "Etirafları yükləmək mümkün olmadı." }, { status: 500 });
  }
}
