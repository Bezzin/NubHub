import { NextRequest } from 'next/server'

/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * NOTE: state lives in the module scope of a single serverless instance, so on
 * Vercel it is per-instance and resets on cold start — it is NOT a distributed
 * limiter. It still meaningfully raises the cost of rapid brute-force/abuse
 * against a single instance. For strong guarantees use a shared store (e.g.
 * Upstash/Redis); this is intentionally dependency-free defence-in-depth.
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

// Opportunistic cleanup so the Map can't grow unbounded across many keys.
function sweep(now: number): void {
  if (buckets.size < 5000) return
  for (const [key, b] of buckets) {
    if (now >= b.resetAt) buckets.delete(key)
  }
}

export type RateLimitResult = { ok: boolean; retryAfterSec: number }

export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number }
): RateLimitResult {
  const now = Date.now()
  sweep(now)

  const bucket = buckets.get(key)
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs })
    return { ok: true, retryAfterSec: 0 }
  }

  bucket.count++
  if (bucket.count > opts.limit) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) }
  }
  return { ok: true, retryAfterSec: 0 }
}

/**
 * Best-effort client IP for rate-limit keying. Trusts x-forwarded-for, which is
 * safe on Vercel (the platform sets it at the edge). Behind a different proxy
 * that forwards a client-supplied XFF, this key becomes spoofable — pin to the
 * platform's trusted client-IP header in that case.
 */
export function clientIp(request: NextRequest): string {
  const fwd = request.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}
