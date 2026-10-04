/**
 * EmbeddedLab OS — lib/ai/rate-limiter.ts
 *
 * Lightweight, in-memory sliding-window rate limiter for the AI Assistant endpoint.
 * Requires zero paid infrastructure, external Redis instances, or third-party SDKs.
 * Provides protection against denial-of-service, automated scraping, and token quota exhaustion.
 */

interface RateBucket {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateBucket>();
const WINDOW_MS = 60 * 1000; // 1-minute sliding window

export const RATE_LIMIT_CONFIG = {
  GUEST_MAX_REQUESTS: 30, // 30 requests per minute for unauthenticated guest sessions
  AUTH_MAX_REQUESTS: 60, // 60 requests per minute for registered students
  WINDOW_SECONDS: 60,
};

/**
 * Extracts client IP identifier from standard reverse-proxy headers.
 */
export function extractClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0].trim();
    if (firstIp) return firstIp;
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp && realIp.trim()) return realIp.trim();

  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp && cfIp.trim()) return cfIp.trim();

  return "127.0.0.1";
}

/**
 * Periodic cleanup of stale rate-limit buckets to prevent memory accumulation.
 */
let lastCleanup = Date.now();
function cleanupStaleBuckets(now: number) {
  if (now - lastCleanup < WINDOW_MS) return;
  lastCleanup = now;

  for (const [ip, bucket] of rateLimitMap.entries()) {
    bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < WINDOW_MS);
    if (bucket.timestamps.length === 0) {
      rateLimitMap.delete(ip);
    }
  }
}

/**
 * Checks whether the incoming request is within allowable rate limits.
 */
export function checkAIRateLimit(
  req: Request,
  isAuthenticated = false
): { allowed: boolean; remaining: number; resetSeconds: number } {
  const now = Date.now();
  cleanupStaleBuckets(now);

  const ip = extractClientIp(req);
  const maxRequests = isAuthenticated
    ? RATE_LIMIT_CONFIG.AUTH_MAX_REQUESTS
    : RATE_LIMIT_CONFIG.GUEST_MAX_REQUESTS;

  let bucket = rateLimitMap.get(ip);
  if (!bucket) {
    bucket = { timestamps: [] };
    rateLimitMap.set(ip, bucket);
  }

  // Filter out timestamps outside the active window
  bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < WINDOW_MS);

  if (bucket.timestamps.length >= maxRequests) {
    const oldestTimestamp = bucket.timestamps[0] || now;
    const resetSeconds = Math.ceil((WINDOW_MS - (now - oldestTimestamp)) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  // Record this request timestamp
  bucket.timestamps.push(now);

  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - bucket.timestamps.length),
    resetSeconds: RATE_LIMIT_CONFIG.WINDOW_SECONDS,
  };
}

/**
 * Resets the in-memory rate limiter table (primarily for testing suites).
 */
export function resetAIRateLimiter(): void {
  rateLimitMap.clear();
  lastCleanup = Date.now();
}
