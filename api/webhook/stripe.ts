import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import {
  getSubmissionByStripeSession,
  updatePaymentConfirmed,
  updateAIResult,
} from '../db/client.js';
import { getSignedImageUrl } from '../services/r2Service.js';
import { analyzeUltrasound, extractBase64FromDataUrl } from '../services/geminiService.backend.js';
import { sendImmediateResult, sendUnderReview } from '../services/emailService.js';

let stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    });
  }
  return stripe;
}

// Disable body parsing for webhook (Vercel)
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Helper to read raw body from request
 */
async function getRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

/**
 * POST /api/webhook/stripe
 * Handle Stripe webhook events
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  try {
    // Get raw body and signature
    const rawBody = await getRawBody(req);
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log('Payment completed for session:', session.id);

      // Get submission from database
      const submission = await getSubmissionByStripeSession(session.id);

      if (!submission) {
        console.error('Submission not found for session:', session.id);
        return res.status(404).json({ error: 'Submission not found' });
      }

      // Update submission with payment confirmation
      await updatePaymentConfirmed(session.id, session.payment_intent as string);

      console.log('Processing AI analysis for submission:', submission.id);

      try {
        // Get signed URL for the image
        const signedUrl = await getSignedImageUrl(submission.image_url);

        // Download image from R2
        const imageResponse = await fetch(signedUrl);
        if (!imageResponse.ok) {
          throw new Error('Failed to download image from R2');
        }

        const imageBuffer = await imageResponse.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');

        // Run Gemini AI analysis
        const aiResult = await analyzeUltrasound(base64Image);

        console.log('AI Result:', aiResult);

        // Update database with AI result
        await updateAIResult(submission.id, {
          ai_result: aiResult.gender,
          ai_confidence: aiResult.confidence,
          ai_reasoning: aiResult.reasoning,
          ai_tips: aiResult.tips,
        });

        // Send appropriate email based on result
        if (aiResult.gender === 'Unclear') {
          // Send "under review" email
          await sendUnderReview(submission.email, submission.id);
          console.log('Sent under review email to:', submission.email);
        } else {
          // Send immediate result email
          await sendImmediateResult(submission.email, {
            gender: aiResult.gender,
            confidence: aiResult.confidence,
            reasoning: aiResult.reasoning,
            tips: aiResult.tips,
          });
          console.log('Sent immediate result email to:', submission.email);
        }

      } catch (analysisError) {
        console.error('AI analysis failed:', analysisError);

        // On analysis error, mark as unclear and send for manual review
        await updateAIResult(submission.id, {
          ai_result: 'Unclear',
          ai_confidence: 0,
          ai_reasoning: 'Automated analysis failed. Manual review in progress.',
          ai_tips: ['Image will be reviewed by our expert team'],
        });

        await sendUnderReview(submission.email, submission.id);
      }
    }

    // Return 200 to acknowledge receipt
    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return res.status(500).json({
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
