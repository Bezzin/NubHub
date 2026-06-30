import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE,
  createSessionValue,
  getAdminToken,
  verifyAdminToken,
} from '@/lib/admin-auth'
import { rateLimit, clientIp } from '@/lib/rate-limit'

/**
 * Exchanges the admin password for an httpOnly session cookie. The password is
 * compared, in constant time, against ADMIN_API_TOKEN on the server — it is
 * never evaluated in the browser.
 */
export async function POST(request: NextRequest) {
  const token = getAdminToken()
  if (!token) {
    console.error('ADMIN_API_TOKEN not configured')
    return NextResponse.json(
      { error: 'Server misconfiguration' },
      { status: 500 }
    )
  }

  // Throttle brute-force attempts per client IP. Defence-in-depth: the token's
  // entropy is the primary control, this caps online guessing rate.
  const limit = rateLimit(`admin-login:${clientIp(request)}`, {
    limit: 10,
    windowMs: 10 * 60 * 1000,
  })
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } }
    )
  }

  let password: unknown
  try {
    const body = await request.json()
    password = body?.password
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (typeof password !== 'string' || !verifyAdminToken(password)) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set(ADMIN_COOKIE_NAME, createSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE,
  })
  return response
}
