import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { getTimedOutSubmissions, markAsRefunded } from '../../db/client';
import { sendRefundApology } from '../../services/emailService';

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

/**
 * POST /api/cron/check-timeouts
 * Check for submissions older than 2 hours and issue refunds
 * Called by Vercel Cron every 30 minutes
 *
 * Security: Vercel Cron jobs are authenticated with a secret header
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify this is a legitimate Vercel Cron request
  // Vercel Cron Jobs set the 'x-vercel-cron' header automatically
  // For additional security, we also check CRON_SECRET if set
  const isVercelCron = req.headers['x-vercel-cron'] === '1';
  const authHeader = req.headers['authorization'];
  const expectedSecret = process.env.CRON_SECRET ? `Bearer ${process.env.CRON_SECRET}` : null;

  // Check if it's a Vercel cron OR has valid secret (for manual triggers)
  if (!isVercelCron && expectedSecret && authHeader !== expectedSecret) {
    console.error('Unauthorized cron request');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('Starting timeout check...');

  try {
    // Get all submissions older than 2 hours that need refunds
    const timedOutSubmissions = await getTimedOutSubmissions();

    console.log(`Found ${timedOutSubmissions.length} timed-out submissions`);

    if (timedOutSubmissions.length === 0) {
      return res.status(200).json({
        message: 'No timed-out submissions found',
        refunded: 0,
      });
    }

    const results = [];

    // Process each timed-out submission
    for (const submission of timedOutSubmissions) {
      try {
        console.log(`Processing refund for submission ${submission.id}`);

        // Only refund if there's a payment ID
        if (submission.stripe_payment_id) {
          // Create full refund via Stripe
          const refund = await getStripe().refunds.create({
            payment_intent: submission.stripe_payment_id,
            reason: 'requested_by_customer',
            metadata: {
              submissionId: submission.id,
              reason: 'Exceeded 2-hour review time',
            },
          });

          console.log(`Refund created: ${refund.id} for £${(refund.amount / 100).toFixed(2)}`);

          results.push({
            submissionId: submission.id,
            refundId: refund.id,
            amount: refund.amount / 100,
            success: true,
          });
        } else {
          console.warn(`No payment ID found for submission ${submission.id}, skipping refund`);
          results.push({
            submissionId: submission.id,
            success: false,
            error: 'No payment ID',
          });
        }

        // Mark as refunded in database
        await markAsRefunded(submission.id);

        // Send apology email
        await sendRefundApology(submission.email, submission.id);

        console.log(`Sent refund apology email to ${submission.email}`);

      } catch (error) {
        console.error(`Failed to process refund for ${submission.id}:`, error);
        results.push({
          submissionId: submission.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    console.log(`Refund processing complete: ${successCount} successful, ${failureCount} failed`);

    return res.status(200).json({
      message: 'Timeout check complete',
      totalProcessed: timedOutSubmissions.length,
      successful: successCount,
      failed: failureCount,
      results,
    });

  } catch (error) {
    console.error('Cron job failed:', error);
    return res.status(500).json({
      error: 'Cron job failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
