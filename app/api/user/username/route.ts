import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    const { username } = body;

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { error: "İstifadəçi adı qeyd edilməlidir." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();

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
