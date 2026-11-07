/**
 * Cloudinary ünvanına transformasiya əlavə edir (məs. "c_fill,w_300,h_300,q_auto,f_auto").
 * Artıq transformasiyası olan və ya Cloudinary olmayan ünvanlar dəyişdirilmir.
 */
export function cldTransform(url: string, transformation: string): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  const [head, tail] = url.split("/upload/", 2);
  const firstSegment = tail.split("/")[0];
  // Versiya (v123...) və ya qovluq deyilsə, artıq transformasiya var deməkdir.
  if (/^[a-z]{1,3}_/.test(firstSegment)) return url;
  return `${head}/upload/${transformation}/${tail}`;
}

/** Məhsul/banner şəkilləri üçün: eni məhdudlaşdırır, keyfiyyəti və formatı avtomatik seçir. */
export function cldImage(url: string | null | undefined, width = 1200): string {
  if (!url) return "";
  return cldTransform(url, `c_limit,w_${width},q_auto,f_auto`);
}

/**
 * Avatar ünvanını göstərilən ölçüdən ~3x böyük, kəskin versiyaya çevirir.
 * Google profil şəkilləri default 96px (=s96-c) gəlir və böyüdüləndə bulanıq görünür.
 */
export function optimizeAvatarUrl(src: string, size: number): string {
  const px = Math.min(Math.round(size * 3), 600);

  if (src.includes("googleusercontent.com")) {
    if (/=s\d+(-c)?$/.test(src)) return src.replace(/=s\d+(-c)?$/, `=s${px}-c`);
    if (/=[\w-]+$/.test(src)) return src.replace(/=[\w-]+$/, `=s${px}-c`);
    return `${src}=s${px}-c`;
  }

  return cldTransform(src, `c_fill,g_face,w_${px},h_${px},q_auto,f_auto`);
}
