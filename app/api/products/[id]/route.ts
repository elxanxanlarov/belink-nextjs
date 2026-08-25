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
      return NextResponse.json(
        { error: "İcazə verilmədi." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { title, price, imageUrl, description } = body;

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Məhsul tapılmadı və ya icazəniz yoxdur." },
        { status: 404 }
      );
    }

    const numericPrice = parseFloat(price.toString());
    if (isNaN(numericPrice) || numericPrice < 0) {
      return NextResponse.json(
        { error: "Qiymət düzgün rəqəm olmalıdır." },
        { status: 400 }
      );
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title: title ? title.trim() : existing.title,
        price: numericPrice,
        imageUrl: imageUrl ? imageUrl.trim() : existing.imageUrl,
        description: description !== undefined ? (description ? description.trim() : null) : existing.description,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Məhsul yenilənərkən xəta baş verdi." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: RouteProps) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "İcazə verilmədi." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Məhsul tapılmadı və ya icazəniz yoxdur." },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Məhsul silinərkən xəta baş verdi." },
      { status: 500 }
    );
  }
}
