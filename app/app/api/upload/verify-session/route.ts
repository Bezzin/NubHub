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

    // A *completed* checkout session means the customer finished checkout and
    // has committed to pay. For asynchronous / redirect-based methods (e.g.
    // Klarna) `payment_status` can still be `processing` or `unpaid` for a few
    // seconds at the moment Stripe redirects the customer back here, even
    // though `status` is already `complete`. Gating on `payment_status: paid`
    // alone wrongly blocks those customers from uploading their scan — they
    // paid, but get "Invalid or expired payment session" and give up. Accept a
    // complete session (or an explicitly paid one); the Stripe webhook
    // reconciles the final payment state.
    //
    // Return ONLY the boolean — never the full session object, which contains
    // customer PII (email, address) the client doesn't need and shouldn't receive.
    if (session.status === 'complete' || session.payment_status === 'paid') {
      return NextResponse.json({ valid: true });
    } else {
      return NextResponse.json({ valid: false, error: 'Payment not completed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json({ valid: false, error: 'Invalid session' }, { status: 400 });
  }
}
