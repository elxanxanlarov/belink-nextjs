import crypto from "node:crypto";

export async function uploadToCloudinary(fileBuffer: Buffer | ArrayBuffer, folder: string = "belink"): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary konfiqurasiyası tapılmadı.");
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

  const uint8 = new Uint8Array(fileBuffer);
  const blob = new Blob([uint8]);

  const formData = new FormData();
  formData.append("file", blob);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || "Cloudinary şəkil yüklənməsi xətası");
  }

  return data.secure_url as string;
}
