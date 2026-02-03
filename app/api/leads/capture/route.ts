import { NextRequest, NextResponse } from 'next/server'
import { getEmailLeadByEmail, createEmailLead } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, source, discount_code } = await request.json()

    if (!email || !source) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
