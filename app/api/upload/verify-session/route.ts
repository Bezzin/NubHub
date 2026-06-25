import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();

    const { session_id } = await request.json();

    if (!session_id) {
      return NextResponse.json({ valid: false, error: 'No session ID provided' }, { status: 400 });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Check if payment was successful. Return ONLY the boolean — never the
    // full session object, which contains customer PII (email, address) and
    // payment details that the client doesn't need and shouldn't receive.
    if (session.payment_status === 'paid') {
      return NextResponse.json({ valid: true });
    } else {
      return NextResponse.json({ valid: false, error: 'Payment not completed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json({ valid: false, error: 'Invalid session' }, { status: 400 });
  }
}
