import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual, createHmac } from 'crypto'

/**
 * Server-side authentication for admin and internal API routes.
 *
 * A single secret, ADMIN_API_TOKEN, gates every privileged route. It is used
 * two ways:
 *   1. As the password an administrator types to obtain an httpOnly session
 *      cookie (browser → /api/admin/*).
 *   2. As a shared bearer token sent in the `x-admin-token` header for
 *      server-to-server calls between internal routes (e.g. confirm → refund).
 *
 * ADMIN_API_TOKEN MUST be a server-only variable — never prefix it with
 * NEXT_PUBLIC_, which would ship it to the browser bundle and defeat the gate.
 * Every guard fails closed: if the secret is not configured, access is denied.
 */

export const ADMIN_COOKIE_NAME = 'admin_session'
export const ADMIN_TOKEN_HEADER = 'x-admin-token'

// 8 hours — long enough for a review session, short enough to limit exposure.
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8

/** The configured admin secret, or null when it is unset/blank. */
export function getAdminToken(): string | null {
  const token = process.env.ADMIN_API_TOKEN
  // Treat a whitespace-only value as unconfigured so it can't become a weak,
  // accidentally-valid password.
  return token && token.trim().length > 0 ? token : null
}

/** Constant-time string comparison; returns false (never throws) on mismatch. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'utf8')
  const bb = Buffer.from(b, 'utf8')
  // timingSafeEqual requires equal-length buffers; differing lengths => not equal.
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

/** Constant-time check of a candidate secret (e.g. a typed password). */
export function verifyAdminToken(candidate: string): boolean {
  const expected = getAdminToken()
  if (!expected) return false
  return safeEqual(candidate, expected)
}

// --- Session cookie (stateless, signed, expiring) ---
//
// The cookie value is "<expiryMs>.<hmac>" rather than the raw ADMIN_API_TOKEN,
// so the browser never holds the master secret and the session carries its own
// expiry. The HMAC is keyed on ADMIN_API_TOKEN, so rotating the token instantly
// invalidates all outstanding sessions.

function signSession(payload: string): string {
  const secret = getAdminToken()
  if (!secret) return ''
  return createHmac('sha256', secret).update(payload).digest('hex')
}

/** Builds a fresh signed session cookie value. */
export function createSessionValue(): string {
  const payload = String(Date.now() + ADMIN_SESSION_MAX_AGE * 1000)
  return `${payload}.${signSession(payload)}`
}

/** Validates a session cookie value produced by createSessionValue(). */
export function verifySessionValue(value: string): boolean {
  if (!getAdminToken()) return false
  const dot = value.indexOf('.')
  if (dot <= 0) return false
  const payload = value.slice(0, dot)
  const sig = value.slice(dot + 1)
  const exp = Number(payload)
  if (!Number.isFinite(exp) || Date.now() > exp) return false
  const expected = signSession(payload)
  if (!expected || !sig) return false
  return safeEqual(sig, expected)
}

/**
 * True when the request carries a valid admin credential, via either the
 * httpOnly session cookie (browser) or the x-admin-token header
 * (server-to-server). Fails closed when ADMIN_API_TOKEN is unset.
 */
export function isAuthorizedAdmin(request: NextRequest): boolean {
  const expected = getAdminToken()
  if (!expected) return false

  const header = request.headers.get(ADMIN_TOKEN_HEADER)
  if (header && safeEqual(header, expected)) return true

  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  if (cookie && verifySessionValue(cookie)) return true

  return false
}

/**
 * Guard for admin/internal API routes. Returns a NextResponse to return
 * immediately when the caller is not authorized (500 when the server is
 * misconfigured, 401 otherwise), or null when the request may proceed.
 *
 * Usage:
 *   const denied = requireAdmin(request)
 *   if (denied) return denied
 */
export function requireAdmin(request: NextRequest): NextResponse | null {
  if (!getAdminToken()) {
    console.error('ADMIN_API_TOKEN not configured')
    return NextResponse.json(
      { error: 'Server misconfiguration' },
      { status: 500 }
    )
  }
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

/** Header object for internal server-to-server calls to protected routes. */
export function internalAuthHeaders(): Record<string, string> {
  return { [ADMIN_TOKEN_HEADER]: getAdminToken() ?? '' }
}
