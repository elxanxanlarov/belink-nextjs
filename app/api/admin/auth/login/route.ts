import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  ensureSuperAdminExists,
  signAdminToken,
  validateAdminSecretId,
  verifyPassword,
} from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, secretId } = body;

    if (!email || !password || !secretId) {
      return NextResponse.json(
        { error: "Bütün xanaları doldurun." },
        { status: 400 }
      );
    }

    if (!validateAdminSecretId(secretId)) {
      return NextResponse.json(
        { error: "Giriş qadağandır. Yanlış admin ID." },
        { status: 403 }
      );
    }

    // Ensure superadmin exists in DB if configured in env
    await ensureSuperAdminExists();

    const staff = await prisma.staff.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!staff) {
      return NextResponse.json(
        { error: "E-poçt və ya şifrə yanlışdır." },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(password, staff.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "E-poçt və ya şifrə yanlışdır." },
        { status: 401 }
      );
    }

    const token = signAdminToken({
      id: staff.id,
      email: staff.email,
      role: staff.role,
      name: staff.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: staff.id,
        email: staff.email,
        name: staff.name,
        role: staff.role,
      },
    });

    response.cookies.set("belink_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Sistem xətası baş verdi." },
      { status: 500 }
    );
  }
}
