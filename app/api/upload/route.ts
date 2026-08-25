import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

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
    const folder = (formData.get("folder") as string) || "belink";

    if (!file) {
      return NextResponse.json(
        { error: "Şəkil faylı seçilməyib." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const url = await uploadToCloudinary(bytes, folder);

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: error?.message || "Şəkil yüklənərkən xəta baş verdi." },
      { status: 500 }
    );
  }
}
