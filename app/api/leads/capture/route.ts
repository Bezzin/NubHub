import { NextRequest, NextResponse } from 'next/server'
import { getEmailLeadByEmail, createEmailLead } from '@/lib/db'
import { rateLimit, clientIp } from '@/lib/rate-limit'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    // Public endpoint — throttle per IP to prevent lead-table spam.
    const limit = rateLimit(`leads-capture:${clientIp(request)}`, {
      limit: 20,
      windowMs: 60 * 1000,
    })
    if (!limit.ok) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } }
      )
    }

    const { email, source, discount_code } = await request.json()

    if (
      typeof email !== 'string' ||
      email.length > 254 ||
      !EMAIL_RE.test(email) ||
      typeof source !== 'string' ||
      source.length < 1 ||
      source.length > 100
    ) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      )
    }

    if (
      discount_code != null &&
      (typeof discount_code !== 'string' || discount_code.length > 100)
    ) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      )
    }

    const existing = await getEmailLeadByEmail(email)

    if (existing) {
      return NextResponse.json(
        { success: true, message: 'Email already captured' },
        { status: 200 }
      )
    }

    await createEmailLead({
      email,
      source,
      discount_code: discount_code || null,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lead capture error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
