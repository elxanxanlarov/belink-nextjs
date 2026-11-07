import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

const IMAGE_MAX_BYTES = 10 * 1024 * 1024;
const AUDIO_MAX_BYTES = 4 * 1024 * 1024; // Vercel sorğu limiti 4.5 MB-dır

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "İcazə verilmədi." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const rawFolder = (formData.get("folder") as string) || "belink";
    const folder = /^[a-z0-9_/-]{1,40}$/i.test(rawFolder) ? rawFolder : "belink";
    const kind = formData.get("kind") === "audio" ? "audio" : "image";

    if (!file) {
      return NextResponse.json(
        { error: kind === "audio" ? "Səs faylı seçilməyib." : "Şəkil faylı seçilməyib." },
        { status: 400 }
      );
    }

    // Kəsilmiş şəkillər canvas-dan tipsiz blob kimi gələ bilər, ona görə boş tip qəbul olunur.
    const type = file.type || "";
    if (kind === "audio") {
      if (type && !type.startsWith("audio/") && !type.startsWith("video/")) {
        return NextResponse.json({ error: "Yalnız səs faylı yükləmək olar." }, { status: 400 });
      }
      if (file.size > AUDIO_MAX_BYTES) {
        return NextResponse.json({ error: "Səs faylı çox böyükdür (maks. 4 MB)." }, { status: 400 });
      }
    } else {
      if (type && !type.startsWith("image/")) {
        return NextResponse.json({ error: "Yalnız şəkil faylı yükləmək olar." }, { status: 400 });
      }
      if (file.size > IMAGE_MAX_BYTES) {
        return NextResponse.json({ error: "Şəkil çox böyükdür (maks. 10 MB)." }, { status: 400 });
      }
    }

    const bytes = await file.arrayBuffer();
    // Cloudinary səs fayllarını "video" resurs tipi kimi saxlayır.
    const url = await uploadToCloudinary(bytes, folder, kind === "audio" ? "video" : "image");

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: error?.message || "Fayl yüklənərkən xəta baş verdi." },
      { status: 500 }
    );
  }
}
