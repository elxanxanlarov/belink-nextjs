import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";
import { UNUSED_INVITE, generateSlug, validateEtirafPayload } from "@/lib/etiraf";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Davam etmək üçün daxil olun." }, { status: 401 });
  }

  const rate = checkRateLimit(`etiraf_${userId}`, 3000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Çox tez-tez sorğu göndərirsiniz." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || typeof body.token !== "string") {
    return NextResponse.json({ error: "Yanlış sorğu." }, { status: 400 });
  }

  const invite = await prisma.etirafInvite.findUnique({ where: { token: body.token } });
  if (!invite) {
    return NextResponse.json({ error: "Link etibarsızdır." }, { status: 404 });
  }
  if (invite.usedAt) {
    return NextResponse.json({ error: "Bu link artıq istifadə olunub." }, { status: 409 });
  }

  const result = validateEtirafPayload(invite, body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Linki atomik olaraq "istifadə olunub" kimi işarələyirik ki, eyni linklə iki etiraf yaranmasın.
  const claim = await prisma.etirafInvite.updateMany({
    where: { id: invite.id, ...UNUSED_INVITE },
    data: { usedAt: new Date(), usedById: userId },
  });
  if (claim.count === 0) {
    return NextResponse.json({ error: "Bu link artıq istifadə olunub." }, { status: 409 });
  }

  try {
    let slug: string | null = null;
    for (let attempt = 0; attempt < 3 && !slug; attempt++) {
      try {
        const created = await prisma.etiraf.create({
          data: { ...result.data, slug: generateSlug(), userId, inviteId: invite.id },
          select: { slug: true },
        });
        slug = created.slug;
      } catch (error: unknown) {
        // Slug toqquşması (P2002) — yenisi ilə təkrar cəhd edilir.
        const code = (error as { code?: string } | null)?.code;
        if (code !== "P2002" || attempt === 2) throw error;
      }
    }
    return NextResponse.json({ slug });
  } catch (error) {
    console.error("Etiraf create error:", error);
    // Etiraf yaranmadısa, link yenidən istifadəyə açılır.
    await prisma.etirafInvite
      .update({ where: { id: invite.id }, data: { usedAt: null, usedById: null } })
      .catch(() => {});
    return NextResponse.json({ error: "Etiraf yaradıla bilmədi. Yenidən cəhd edin." }, { status: 500 });
  }
}
