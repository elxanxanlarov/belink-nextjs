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

    const products = await prisma.product.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      { error: "Məhsulları yükləyərkən xəta baş verdi." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "İcazə verilmədi." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, price, imageUrl, description } = body;

    if (!title || price === undefined || !imageUrl) {
      return NextResponse.json(
        { error: "Başlıq, qiymət və şəkil mütləq qeyd edilməlidir." },
        { status: 400 }
      );
    }

    const numericPrice = parseFloat(price.toString());
    if (isNaN(numericPrice) || numericPrice < 0) {
      return NextResponse.json(
        { error: "Qiymət düzgün rəqəm olmalıdır." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        price: numericPrice,
        imageUrl: imageUrl.trim(),
        description: description ? description.trim() : null,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Məhsul yaradılarkən xəta baş verdi." },
      { status: 500 }
    );
  }
}
