import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/adminAuth";
import {
  ETIRAF_PHOTOS_HARD_MAX,
  defaultMaxPhotos,
  etirafInviteUrl,
  generateInviteToken,
} from "@/lib/etiraf";

function getAdmin(req: NextRequest) {
  const token = req.cookies.get("belink_admin_token")?.value;
  return token ? verifyAdminToken(token) : null;
}

export async function GET(req: NextRequest) {
  if (!getAdmin(req)) {
    return NextResponse.json({ error: "İcazə verilmədi." }, { status: 401 });
  }

  try {
    const invites = await prisma.etirafInvite.findMany({
      orderBy: { createdAt: "desc" },
      take: 300,
      include: {
        etiraf: {
          select: {
            id: true,
            slug: true,
            title: true,
            photos: true,
            createdAt: true,
            user: { select: { id: true, name: true, email: true, image: true } },
          },
        },
      },
    });

    return NextResponse.json({
      invites: invites.map((i) => ({
        id: i.id,
        token: i.token,
        url: etirafInviteUrl(i.token),
        allowPhotos: i.allowPhotos,
        allowText: i.allowText,
        allowAudio: i.allowAudio,
        maxPhotos: i.maxPhotos,
        note: i.note,
        usedAt: i.usedAt?.toISOString() ?? null,
        createdAt: i.createdAt.toISOString(),
        etiraf: i.etiraf
          ? {
              id: i.etiraf.id,
              slug: i.etiraf.slug,
              title: i.etiraf.title,
              cover: i.etiraf.photos[0] ?? null,
              createdAt: i.etiraf.createdAt.toISOString(),
              user: i.etiraf.user,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error("Etiraf invites fetch error:", error);
    return NextResponse.json({ error: "Linkləri yükləmək mümkün olmadı." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!getAdmin(req)) {
    return NextResponse.json({ error: "İcazə verilmədi." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Yanlış sorğu." }, { status: 400 });
  }

  const allowance = {
    allowPhotos: body.allowPhotos !== false,
    allowText: body.allowText !== false,
    allowAudio: body.allowAudio !== false,
  };

  if (!allowance.allowPhotos && !allowance.allowText && !allowance.allowAudio) {
    return NextResponse.json({ error: "Ən azı bir məzmun növü seçilməlidir." }, { status: 400 });
  }

  let maxPhotos = Number.isInteger(body.maxPhotos) ? body.maxPhotos : defaultMaxPhotos(allowance);
  maxPhotos = Math.max(1, Math.min(ETIRAF_PHOTOS_HARD_MAX, maxPhotos));
  if (!allowance.allowPhotos) maxPhotos = 0;

  const note = typeof body.note === "string" ? body.note.trim().slice(0, 120) || null : null;

  try {
    const invite = await prisma.etirafInvite.create({
      data: { token: generateInviteToken(), ...allowance, maxPhotos, note },
    });

    return NextResponse.json({
      invite: {
        id: invite.id,
        token: invite.token,
        url: etirafInviteUrl(invite.token),
      },
    });
  } catch (error) {
    console.error("Etiraf invite create error:", error);
    return NextResponse.json({ error: "Link yaradıla bilmədi." }, { status: 500 });
  }
}
