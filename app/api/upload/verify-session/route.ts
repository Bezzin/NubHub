import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { session_id } = await request.json();

    if (!session_id) {
      return NextResponse.json({ valid: false, error: 'No session ID provided' }, { status: 400 });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Check if payment was successful
    if (session.payment_status === 'paid') {
      return NextResponse.json({ valid: true, session });
    } else {
      return NextResponse.json({ valid: false, error: 'Payment not completed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json({ valid: false, error: 'Invalid session' }, { status: 400 });
  }
}
