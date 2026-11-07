import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";

/**
 * Böyük fayllar (fon musiqisi) üçün Cloudinary-yə birbaşa yükləmə imzası.
 * Fayl Vercel-dən keçmir — 4.5 MB sorğu limiti tətbiq olunmur.
 */
export async function POST() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "İcazə verilmədi." }, { status: 401 });
  }

  const rate = checkRateLimit(`upload_sign_${userId}`, 1000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Çox tez-tez sorğu göndərirsiniz." }, { status: 429 });
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Cloudinary konfiqurasiyası tapılmadı." }, { status: 500 });
  }

  const folder = "etiraf/musiqi";
  const timestamp = Math.round(Date.now() / 1000);
  // Cloudinary imzası: parametrlər əlifba sırası ilə + API secret
  const signature = crypto
    .createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  return NextResponse.json({
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
    apiKey,
    timestamp,
    signature,
    folder,
  });
}
