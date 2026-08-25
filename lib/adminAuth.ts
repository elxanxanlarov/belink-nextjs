import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { AdminSessionPayload, StaffRole } from "@/types";

const SECRET_KEY = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "belink-admin-secret-fallback-key-2026";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

export function verifyPassword(password: string, hash: string): boolean {
  const [salt, key] = hash.split(":");
  if (!salt || !key) return false;
  const derivedKey = crypto.scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");
  return crypto.timingSafeEqual(derivedKey, keyBuffer);
}

export function signAdminToken(payload: AdminSessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET_KEY).update(data).digest("base64url");
  return `${data}.${signature}`;
}

export function verifyAdminToken(token: string): AdminSessionPayload | null {
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature) return null;
    const expectedSignature = crypto.createHmac("sha256", SECRET_KEY).update(data).digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }
    const jsonStr = Buffer.from(data, "base64url").toString("utf-8");
    return JSON.parse(jsonStr) as AdminSessionPayload;
  } catch {
    return null;
  }
}

export function validateAdminSecretId(id: string): boolean {
  const expectedId = process.env.ADMIN_SECRET_ID;
  if (!expectedId) return true;
  return id === expectedId;
}

export async function ensureSuperAdminExists() {
  const superadminEmail = process.env.SUPERADMIN_EMAIL;
  const superadminPass = process.env.SUPERADMIN_PASSWORD;

  if (!superadminEmail || !superadminPass) {
    return null;
  }

  try {
    const existing = await prisma.staff.findUnique({
      where: { email: superadminEmail },
    });

    if (!existing) {
      const hashedPassword = hashPassword(superadminPass);
      const created = await prisma.staff.create({
        data: {
          email: superadminEmail,
          password: hashedPassword,
          name: "Super Admin",
          role: "SUPERADMIN" as StaffRole,
        },
      });
      return created;
    }
    return existing;
  } catch (error) {
    console.error("Superadmin auto-creation error:", error);
    return null;
  }
}
