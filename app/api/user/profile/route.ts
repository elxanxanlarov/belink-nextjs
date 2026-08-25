import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/sanitize";
import { checkRateLimit } from "@/lib/rateLimit";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "İcazə verilmədi." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { _count: { select: { products: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: "İstifadəçi tapılmadı." }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        username: user.username,
        shopName: user.shopName,
        bio: user.bio,
        whatsappPhone: user.whatsappPhone,
        instagram: user.instagram,
        tiktok: user.tiktok,
        linkedin: user.linkedin,
        twitter: user.twitter,
        facebook: user.facebook,
        youtube: user.youtube,
        productCount: user._count.products,
      },
    });
  } catch (error) {
    console.error("Fetch profile error:", error);
    return NextResponse.json({ error: "Profil yüklənərkən xəta baş verdi." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "İcazə verilmədi." }, { status: 401 });
    }

    const rateCheck = checkRateLimit(`profile_patch_${session.user.id}`, 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Çox tez-tez sorğu göndərirsiniz. Lütfən 1 saniyə gözləyin." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, shopName, bio, image, whatsappPhone, instagram, tiktok, linkedin, twitter, facebook, youtube } = body;

    const sanitizeUrl = (val: string | undefined | null, max: number) => {
      if (val === undefined) return undefined;
      if (!val) return null;
      return sanitizeText(val, max);
    };

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name !== undefined ? sanitizeText(name, 50) : undefined,
        shopName: shopName !== undefined ? sanitizeText(shopName, 50) : undefined,
        bio: bio !== undefined ? sanitizeText(bio, 250) : undefined,
        image: image !== undefined ? sanitizeText(image, 500) : undefined,
        whatsappPhone: whatsappPhone !== undefined ? sanitizeText(whatsappPhone, 20) : undefined,
        instagram: sanitizeUrl(instagram, 100),
        tiktok: sanitizeUrl(tiktok, 100),
        linkedin: sanitizeUrl(linkedin, 100),
        twitter: sanitizeUrl(twitter, 100),
        facebook: sanitizeUrl(facebook, 100),
        youtube: sanitizeUrl(youtube, 100),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        image: updated.image,
        username: updated.username,
        shopName: updated.shopName,
        bio: updated.bio,
        whatsappPhone: updated.whatsappPhone,
        instagram: updated.instagram,
        tiktok: updated.tiktok,
        linkedin: updated.linkedin,
        twitter: updated.twitter,
        facebook: updated.facebook,
        youtube: updated.youtube,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Profil yenilənərkən xəta baş verdi." }, { status: 500 });
  }
}
