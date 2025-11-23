import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSubmissionByStripeSession } from './db/client';

/**
 * GET /api/check-status?session_id=xxx
 * Check the status of a submission by Stripe session ID
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id } = req.query;

  if (!session_id || typeof session_id !== 'string') {
    return res.status(400).json({ error: 'Missing session_id parameter' });
  }

  try {
    const submission = await getSubmissionByStripeSession(session_id);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Return submission status
    return res.status(200).json({
      id: submission.id,
      email: submission.email,
      payment_confirmed: submission.payment_confirmed,
      ai_result: submission.ai_result,
      ai_confidence: submission.ai_confidence,
      ai_reasoning: submission.ai_reasoning,
      ai_tips: submission.ai_tips,
      created_at: submission.created_at,
    });

  } catch (error) {
    console.error('Check status error:', error);
    return res.status(500).json({
      error: 'Failed to check status',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
