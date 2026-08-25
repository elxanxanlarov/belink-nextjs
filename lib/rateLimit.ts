/**
 * In-memory API Rate Limiter
 * Enforces minimum delay between requests (default: 1000ms = 1 request per second).
 */

const rateLimitMap = new Map<string, number>();

// Clean up stale entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, timestamp] of rateLimitMap.entries()) {
      if (now - timestamp > 60000) {
        rateLimitMap.delete(key);
      }
    }
  }, 300000);
}

export function checkRateLimit(key: string, minIntervalMs = 1000): { allowed: boolean; remainingMs: number } {
  const now = Date.now();
  const lastTime = rateLimitMap.get(key) || 0;
  const elapsed = now - lastTime;

  if (elapsed < minIntervalMs) {
    return {
      allowed: false,
      remainingMs: minIntervalMs - elapsed,
    };
  }

  rateLimitMap.set(key, now);
  return {
    allowed: true,
    remainingMs: 0,
  };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}
