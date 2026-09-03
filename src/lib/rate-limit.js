/**
 * Minimal in-memory rate limiter for API routes.
 *
 * NOTE: In-memory state is per-instance. On Vercel's serverless platform this
 * is not a hard guarantee across many function instances — use this to blunt
 * casual abuse (spam, brute-force) on top of auth, not as a strict control.
 * For a stricter guarantee, move the counter to a shared store (Redis/Neon).
 */

const buckets = new Map();

export function rateLimit({ key, limit = 10, windowMs = 60_000 }) {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now - entry.start > windowMs) {
    buckets.set(key, { start: now, count: 1 });
    return { ok: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { ok: false, remaining: 0, retryAfterMs: windowMs - (now - entry.start) };
  }

  entry.count += 1;
  return { ok: true, remaining: limit - entry.count };
}
