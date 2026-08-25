import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "İcazə verilmədi." }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json({ error: "Kateqoriyaları yükləyərkən xəta baş verdi." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "İcazə verilmədi." }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Kateqoriya adı tələb olunur." }, { status: 400 });
    }

    const cleanName = name.trim().slice(0, 50);

    const existing = await prisma.category.findFirst({
      where: { name: cleanName, userId: session.user.id },
    });

    if (existing) {
      return NextResponse.json({ error: "Bu adda kateqoriya artıq mövcuddur." }, { status: 409 });
    }

    const category = await prisma.category.create({
      data: { name: cleanName, userId: session.user.id },
    });

    return NextResponse.json({ success: true, category });
  } catch {
    return NextResponse.json({ error: "Kateqoriya yaradılarkən xəta baş verdi." }, { status: 500 });
  }
}
