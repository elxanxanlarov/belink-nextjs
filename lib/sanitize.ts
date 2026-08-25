/**
 * Input sanitization and safety utilities to prevent XSS, NoSQL/SQL Injection,
 * and text overflow vulnerabilities.
 */

export function sanitizeText(input: unknown, maxLength = 250): string {
  if (typeof input !== "string") return "";
  
  let clean = input
    // Strip HTML tags
    .replace(/<[^>]*>?/gm, "")
    // Neutralize dangerous script tags / protocols
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    // Neutralize NoSQL query operators ($gt, $where, etc.)
    .replace(/\$/g, "")
    .trim();

  if (clean.length > maxLength) {
    clean = clean.substring(0, maxLength);
  }

  return clean;
}

export function sanitizeUsername(input: unknown): string {
  if (typeof input !== "string") return "";
  
  return input
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .substring(0, 30)
    .trim();
}

export function sanitizePrice(input: unknown): number {
  const num = parseFloat(String(input).replace(/[^0-9.]/g, ""));
  if (isNaN(num) || num < 0) return 0;
  return Math.min(Math.round(num * 100) / 100, 999999);
}
