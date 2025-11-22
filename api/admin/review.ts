import type { VercelRequest, VercelResponse } from '@vercel/node';
import { updateManualReview, getSubmissionById } from '../../db/client';
import { sendReviewedResult } from '../../services/emailService';
import { verifyAdminAuth } from '../../services/authService';

/**
 * POST /api/admin/review
 * Submit manual review result for a submission
 * Requires admin authentication
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify admin authentication
  const authHeader = req.headers.authorization;
  if (!verifyAdminAuth(authHeader)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Parse request body
    let data;
    try {
      if (typeof req.body === 'string') {
        data = JSON.parse(req.body);
      } else {
        data = req.body;
      }
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }

    const { submissionId, result, reviewerName } = data;

    // Validate inputs
    if (!submissionId || !result || !reviewerName) {
      return res.status(400).json({
        error: 'Missing required fields: submissionId, result, reviewerName',
      });
    }

    if (result !== 'Boy' && result !== 'Girl') {
      return res.status(400).json({ error: 'Result must be either "Boy" or "Girl"' });
    }

    // Get submission to verify it exists and get email
    const submission = await getSubmissionById(submissionId);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    if (submission.status !== 'pending_review') {
      return res.status(400).json({
        error: 'Submission is not pending review',
        currentStatus: submission.status,
      });
    }

    // Update database with manual review result
    await updateManualReview(submissionId, {
      final_result: result,
      reviewed_by: reviewerName,
    });

    // Send result email to user
    await sendReviewedResult(
      submission.email,
      {
        gender: result,
        confidence: 95, // Manual review gets high confidence
        reasoning: submission.ai_reasoning || `After careful expert review, we've determined your baby's gender based on the nub angle and positioning in your ultrasound scan.`,
        tips: submission.ai_tips || [
          'Congratulations on your pregnancy!',
          'Remember to stay hydrated and get plenty of rest',
          'Schedule your next prenatal checkup',
        ],
      },
      reviewerName
    );

    console.log(`Manual review completed for ${submissionId} by ${reviewerName}: ${result}`);

    return res.status(200).json({
      success: true,
      submissionId,
      result,
      reviewedBy: reviewerName,
    });

  } catch (error) {
    console.error('Failed to process manual review:', error);
    return res.status(500).json({
      error: 'Failed to process manual review',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
