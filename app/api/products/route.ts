import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizePrice, sanitizeText } from "@/lib/sanitize";
import { checkRateLimit } from "@/lib/rateLimit";

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

    const rateCheck = checkRateLimit(`product_create_${session.user.id}`, 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Çox tez-tez sorğu göndərirsiniz. Lütfən 1 saniyə gözləyin." },
        { status: 429 }
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

    const cleanTitle = sanitizeText(title, 80);
    const numericPrice = sanitizePrice(price);
    const cleanImageUrl = sanitizeText(imageUrl, 500);
    const cleanDescription = description ? sanitizeText(description, 300) : null;

    if (!cleanTitle) {
      return NextResponse.json(
        { error: "Məhsul adı keçərsizdir." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        title: cleanTitle,
        price: numericPrice,
        imageUrl: cleanImageUrl,
        description: cleanDescription,
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
