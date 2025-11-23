import { neon } from '@neondatabase/serverless';

// Submission interface matching database schema
export interface Submission {
  id: string;
  email: string;
  image_url: string;
  stripe_payment_id: string | null;
  stripe_session_id: string | null;
  promo_code: string | null;
  ai_result: 'Boy' | 'Girl' | 'Unclear' | null;
  ai_confidence: number | null;
  ai_reasoning: string | null;
  ai_tips: string[] | null;
  final_result: 'Boy' | 'Girl' | null;
  status: 'pending_payment' | 'processing' | 'completed' | 'pending_review' | 'reviewed' | 'refunded';
  created_at: Date;
  reviewed_at: Date | null;
  reviewed_by: string | null;
  refunded_at: Date | null;
}

// Initialize Neon client
const getDb = () => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('NEON_DATABASE_URL environment variable is not set');
  }
  return neon(databaseUrl);
};

/**
 * Create a new submission
 */
export async function createSubmission(data: {
  email: string;
  image_url: string;
  promo_code?: string;
}): Promise<Submission> {
  const sql = getDb();

  const result = await sql`
    INSERT INTO submissions (email, image_url, promo_code, status)
    VALUES (${data.email}, ${data.image_url}, ${data.promo_code || null}, 'pending_payment')
    RETURNING *
  `;

  return result[0] as Submission;
}

/**
 * Get submission by ID
 */
export async function getSubmissionById(id: string): Promise<Submission | null> {
  const sql = getDb();

  const result = await sql`
    SELECT * FROM submissions WHERE id = ${id}
  `;

  return result[0] as Submission || null;
}

/**
 * Get submission by Stripe session ID
 */
export async function getSubmissionByStripeSession(sessionId: string): Promise<Submission | null> {
  const sql = getDb();

  const result = await sql`
    SELECT * FROM submissions WHERE stripe_session_id = ${sessionId}
  `;

  return result[0] as Submission || null;
}

/**
 * Update submission with Stripe session ID
 */
export async function updateStripeSession(id: string, sessionId: string): Promise<void> {
  const sql = getDb();

  await sql`
    UPDATE submissions
    SET stripe_session_id = ${sessionId}
    WHERE id = ${id}
  `;
}

/**
 * Update submission after payment confirmation
 */
export async function updatePaymentConfirmed(sessionId: string, paymentId: string): Promise<void> {
  const sql = getDb();

  await sql`
    UPDATE submissions
    SET
      stripe_payment_id = ${paymentId},
      status = 'processing'
    WHERE stripe_session_id = ${sessionId}
  `;
}

/**
 * Update submission with AI analysis results
 */
export async function updateAIResult(id: string, result: {
  ai_result: 'Boy' | 'Girl' | 'Unclear';
  ai_confidence: number;
  ai_reasoning: string;
  ai_tips: string[];
}): Promise<void> {
  const sql = getDb();

  // Determine status based on AI result
  const status = result.ai_result === 'Unclear' ? 'pending_review' : 'completed';
  const finalResult = result.ai_result === 'Unclear' ? null : result.ai_result;

  await sql`
    UPDATE submissions
    SET
      ai_result = ${result.ai_result},
      ai_confidence = ${result.ai_confidence},
      ai_reasoning = ${result.ai_reasoning},
      ai_tips = ${result.ai_tips},
      final_result = ${finalResult},
      status = ${status}
    WHERE id = ${id}
  `;
}

/**
 * Get all pending reviews for admin dashboard
 */
export async function getPendingReviews(): Promise<Submission[]> {
  const sql = getDb();

  const result = await sql`
    SELECT * FROM submissions
    WHERE status = 'pending_review'
    ORDER BY created_at ASC
  `;

  return result as Submission[];
}

/**
 * Update submission with manual review result
 */
export async function updateManualReview(id: string, data: {
  final_result: 'Boy' | 'Girl';
  reviewed_by: string;
}): Promise<void> {
  const sql = getDb();

  await sql`
    UPDATE submissions
    SET
      final_result = ${data.final_result},
      reviewed_by = ${data.reviewed_by},
      reviewed_at = NOW(),
      status = 'reviewed'
    WHERE id = ${id}
  `;
}

/**
 * Get submissions older than 2 hours that need refunds
 */
export async function getTimedOutSubmissions(): Promise<Submission[]> {
  const sql = getDb();

  const result = await sql`
    SELECT * FROM submissions
    WHERE status = 'pending_review'
    AND created_at < NOW() - INTERVAL '2 hours'
    AND refunded_at IS NULL
  `;

  return result as Submission[];
}

/**
 * Mark submission as refunded
 */
export async function markAsRefunded(id: string): Promise<void> {
  const sql = getDb();

  await sql`
    UPDATE submissions
    SET
      status = 'refunded',
      refunded_at = NOW()
    WHERE id = ${id}
  `;
}
