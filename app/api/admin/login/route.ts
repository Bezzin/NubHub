import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE,
  getAdminToken,
  verifyAdminToken,
} from '@/lib/admin-auth'

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
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE,
  })
  return response
}
