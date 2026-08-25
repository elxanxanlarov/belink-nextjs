import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "İcazə verilmədi." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "İstifadəçi tapılmadı." },
        { status: 404 }
      );
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
        productCount: user._count.products,
      },
    });
  } catch (error) {
    console.error("Fetch profile error:", error);
    return NextResponse.json(
      { error: "Profil yüklənərkən xəta baş verdi." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "İcazə verilmədi." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, shopName, bio, image } = body;

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name !== undefined ? name?.trim() : undefined,
        shopName: shopName !== undefined ? shopName?.trim() : undefined,
        bio: bio !== undefined ? bio?.trim() : undefined,
        image: image !== undefined ? image?.trim() : undefined,
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
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Profil yenilənərkən xəta baş verdi." },
      { status: 500 }
    );
  }
}
