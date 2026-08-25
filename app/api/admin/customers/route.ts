import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("belink_admin_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "İcazə verilmədi." }, { status: 401 });
    }

    const session = verifyAdminToken(token);
    if (!session) {
      return NextResponse.json({ error: "Sessiya bitib və ya etibarsızdır." }, { status: 401 });
    }

    const [users, totalProducts, totalStaff] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { products: true },
          },
        },
      }),
      prisma.product.count(),
      prisma.staff.count(),
    ]);

    const customers = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image,
      username: u.username,
      shopName: u.shopName,
      bio: u.bio,
      productCount: u._count.products,
      createdAt: u.createdAt.toISOString(),
    }));

    return NextResponse.json({
      customers,
      stats: {
        totalCustomers: users.length,
        totalProducts,
        totalStaff,
      },
      currentStaff: session,
    });
  } catch (error) {
    console.error("Admin customers fetch error:", error);
    return NextResponse.json(
      { error: "Məlumatları yükləyərkən xəta baş verdi." },
      { status: 500 }
    );
  }
}
