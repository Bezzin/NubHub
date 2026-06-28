import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

const UNIT_AMOUNT = 997; // £9.97 in pence
const CURRENCY = 'gbp';

/**
 * Creates an EMBEDDED Stripe Checkout Session (ui_mode: 'embedded').
 *
 * The payment form renders inline on /checkout (no redirect, no popup). On
 * success Stripe sends the customer to return_url (/upload?session_id=...),
 * which the upload page verifies via /api/upload/verify-session, and the
 * webhook confirms via checkout.session.completed — same downstream flow as
 * before, just without leaving the site to pay.
 */
export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();

    const { referral_code } = await request
      .json()
      .catch(() => ({ referral_code: '' }));

    // Normalise the base URL so a misconfigured NEXT_PUBLIC_APP_URL (missing
    // scheme, trailing slash, or blank) can't produce an invalid Stripe
    // return_url — which hard-fails checkout with `url_invalid`.
    let appUrl = (process.env.NEXT_PUBLIC_APP_URL || '').trim().replace(/\/+$/, '');
    if (!appUrl) appUrl = 'https://nubhub.baby';
    else if (!/^https?:\/\//i.test(appUrl)) appUrl = `https://${appUrl}`;
    const priceId = process.env.STRIPE_PRICE_ID;
    const descriptorSuffix = process.env.STRIPE_STATEMENT_DESCRIPTOR_SUFFIX;

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode: 'payment',
      // Prefer a real Price object when configured; fall back to inline price
      // data so the route works before the live Price has been created.
      line_items: [
        priceId
          ? { price: priceId, quantity: 1 }
          : {
              price_data: {
                currency: CURRENCY,
                product_data: {
                  name: 'Nub Theory Gender Prediction',
                  description:
                    'AI + expert-reviewed baby gender prediction from your 12-week ultrasound scan',
                },
                unit_amount: UNIT_AMOUNT,
              },
              quantity: 1,
            },
      ],
      // Stripe replaces the {CHECKOUT_SESSION_ID} template at redirect time.
      return_url: `${appUrl}/upload?session_id={CHECKOUT_SESSION_ID}`,
      metadata: { referral_code: referral_code || '' },
      // Optional: a recognisable suffix on the customer's bank statement.
      // Only sent when explicitly configured (set once the live account /
      // descriptor is decided) to avoid surprising account-level errors.
      ...(descriptorSuffix
        ? { payment_intent_data: { statement_descriptor_suffix: descriptorSuffix } }
        : {}),
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
