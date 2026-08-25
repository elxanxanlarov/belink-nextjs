import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function PUT(req: Request, { params }: RouteProps) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "İcazə verilmədi." }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, price, imageUrl, images, description, categoryId } = body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Məhsul tapılmadı və ya icazəniz yoxdur." }, { status: 404 });
    }

    const numericPrice = parseFloat(price.toString());
    if (isNaN(numericPrice) || numericPrice < 0) {
      return NextResponse.json({ error: "Qiymət düzgün rəqəm olmalıdır." }, { status: 400 });
    }

    if (categoryId) {
      const cat = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!cat || cat.userId !== session.user.id) {
        return NextResponse.json({ error: "Kateqoriya tapılmadı." }, { status: 400 });
      }
    }

    const cleanImages: string[] = Array.isArray(images)
      ? images.filter((u: any) => typeof u === "string" && u.trim()).map((u: string) => u.trim()).slice(0, 10)
      : existing.images;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title: title ? title.trim() : existing.title,
        price: numericPrice,
        imageUrl: imageUrl ? imageUrl.trim() : existing.imageUrl,
        images: cleanImages,
        description: description !== undefined ? (description ? description.trim() : null) : existing.description,
        categoryId: categoryId !== undefined ? (categoryId || null) : existing.categoryId,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch {
    return NextResponse.json({ error: "Məhsul yenilənərkən xəta baş verdi." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteProps) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "İcazə verilmədi." }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Məhsul tapılmadı və ya icazəniz yoxdur." }, { status: 404 });
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Məhsul silinərkən xəta baş verdi." }, { status: 500 });
  }
}
