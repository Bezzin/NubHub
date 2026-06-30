import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  createPrediction,
  getActiveReferralCode,
  updateReferralCodeUsage,
  getPredictionByStripeSession,
} from '@/lib/db';
import { uploadImage, generateUniqueFileName } from '@/lib/r2';
import { sendTelegramNotification } from '@/lib/telegram';
import { internalAuthHeaders } from '@/lib/admin-auth';
import { getAppOrigin } from '@/lib/app-url';

export async function POST(request: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-02-24.acacia',
    });

    const formData = await request.formData();
    const image = formData.get('image') as File;
    const sessionId = formData.get('session_id') as string;

    if (!image || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify Stripe session. Accept a *completed* checkout session as well as
    // an explicitly `paid` one: for async/redirect methods like Klarna the
    // payment can still be `processing` for a few seconds after the session is
    // already `complete`, and a strict `paid` check would reject a legitimate
    // paying customer's scan. The webhook reconciles the final payment state.
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.status !== 'complete' && session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Idempotency: one paid session = one prediction. If this session already
    // has a record (e.g. the customer re-submitted, or a retry), return the
    // existing one instead of inserting a duplicate, re-uploading to R2, or
    // re-incrementing the referral commission counter.
    const existing = await getPredictionByStripeSession(sessionId);
    if (existing) {
      return NextResponse.json({ success: true, prediction_id: existing.id });
    }

    const customerEmail = session.customer_details?.email || '';
    const referralCode = session.metadata?.referral_code || null;

    // Upload image to Cloudflare R2
    const fileName = generateUniqueFileName(image.name);
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    await uploadImage(imageBuffer, fileName, image.type);

    // Create prediction record
    const prediction = await createPrediction({
      stripe_session_id: sessionId,
      stripe_payment_intent_id: session.payment_intent as string,
      customer_email: customerEmail,
      scan_image_url: fileName,
      scan_image_filename: fileName,
      referral_code: referralCode,
      amount_paid: 9.97,
      status: 'pending',
    });

    // Update referral code usage if applicable
    if (referralCode) {
      const refCode = await getActiveReferralCode(referralCode);

      if (refCode) {
        await updateReferralCodeUsage(
          refCode.id,
          refCode.uses_count + 1,
          refCode.total_commission_owed + refCode.commission_per_sale
        );
      }
    }

    // Trigger AI analysis (server-to-server; /api/analyze is admin-gated)
    fetch(`${getAppOrigin()}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...internalAuthHeaders(),
      },
      body: JSON.stringify({ prediction_id: prediction.id }),
    }).catch(() => {});

    // Send Telegram notification
    await sendTelegramNotification(
      `🆕 <b>New Prediction Submitted</b>\n\n` +
      `Email: ${customerEmail}\n` +
      `Prediction ID: ${prediction.id}\n` +
      `${referralCode ? `Referral: ${referralCode}\n` : ''}` +
      `\n<a href="${getAppOrigin()}/admin">View in Admin Dashboard</a>`
    );

    return NextResponse.json({ success: true, prediction_id: prediction.id });
  } catch (error) {
    // Log the real cause — this catch previously swallowed every failure
    // silently, leaving paid customers stuck with no diagnostic trail.
    console.error('Upload route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
