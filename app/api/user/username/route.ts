import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeUsername } from "@/lib/sanitize";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "İcazə verilmədi." },
        { status: 401 }
      );
    }

    const rateCheck = checkRateLimit(`username_${session.user.id}`, 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Çox tez-tez sorğu göndərirsiniz. Lütfən 1 saniyə gözləyin." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { username } = body;

    const cleanUsername = sanitizeUsername(username);

    if (!cleanUsername || cleanUsername.length < 3) {
      return NextResponse.json(
        { error: "İstifadəçi adı ən azı 3 simvol olmalıdır." },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9_]{3,30}$/.test(cleanUsername)) {
      return NextResponse.json(
        { error: "İstifadəçi adı 3-30 simvol, yalnız kiçik hərflər, rəqəmlər və '_' ola bilər." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findFirst({
      where: {
        username: cleanUsername,
        NOT: { id: session.user.id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu istifadəçi adı artıq götürülüb. Başqa bir ad sınayın." },
        { status: 409 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        username: cleanUsername,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
      },
    });
  } catch (error) {
    console.error("Set username error:", error);
    return NextResponse.json(
      { error: "Sistem xətası baş verdi." },
      { status: 500 }
    );
  }
}
