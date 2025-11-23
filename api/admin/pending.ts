import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPendingReviews } from '../../lib/db/client';
import { getSignedImageUrl } from '../../lib/services/r2Service';
import { verifyAdminAuth } from '../../lib/services/authService';

/**
 * GET /api/admin/pending
 * Get all submissions pending manual review
 * Requires admin authentication
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify admin authentication
  const authHeader = req.headers.authorization;
  if (!verifyAdminAuth(authHeader)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Get all pending reviews from database
    const submissions = await getPendingReviews();

    // Generate signed URLs for each image
    const submissionsWithSignedUrls = await Promise.all(
      submissions.map(async (submission) => {
        const signedUrl = await getSignedImageUrl(submission.image_url);

        return {
          id: submission.id,
          email: submission.email,
          imageUrl: signedUrl,
          aiResult: submission.ai_result,
          aiConfidence: submission.ai_confidence,
          aiReasoning: submission.ai_reasoning,
          createdAt: submission.created_at,
        };
      })
    );

    return res.status(200).json({
      submissions: submissionsWithSignedUrls,
      count: submissionsWithSignedUrls.length,
    });

  } catch (error) {
    console.error('Failed to fetch pending reviews:', error);
    return res.status(500).json({
      error: 'Failed to fetch pending reviews',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
