import { neon } from '@neondatabase/serverless'

// Initialize Neon client
const getDb = () => {
  const databaseUrl = process.env.NEON_DATABASE_URL
  if (!databaseUrl) {
    throw new Error('NEON_DATABASE_URL environment variable is not set')
  }
  return neon(databaseUrl)
}

// --- Type Definitions ---

export type Prediction = {
  id: string
  stripe_session_id: string
  stripe_payment_intent_id: string | null
  customer_email: string
  scan_image_url: string
  scan_image_filename: string | null
  ai_prediction: string | null
  ai_confidence: number | null
  ai_raw_response: string | null
  manual_review_result: string | null
  final_result: string | null
  status: string
  referral_code: string | null
  amount_paid: number | null
  created_at: string
  reviewed_at: string | null
  result_sent_at: string | null
  refund_requested_at: string | null
  refund_processed_at: string | null
  confirmation_scan_url: string | null
  confirmed_gender: string | null
  notes: string | null
  payment_confirmed_via_webhook: boolean
}

export type ReferralCode = {
  id: string
  code: string
  influencer_name: string
  influencer_contact: string | null
  commission_percent: number
  commission_per_sale: number
  is_active: boolean
  uses_count: number
  total_commission_owed: number
  total_commission_paid: number
  created_at: string
  created_by: string | null
  notes: string | null
}

export type EmailLead = {
  id: string
  email: string
  source: string
  discount_code: string | null
  discount_used: boolean
  converted_to_sale: boolean
  prediction_id: string | null
  created_at: string
  converted_at: string | null
}

// --- Predictions ---

export async function getPredictionById(id: string): Promise<Prediction | null> {
  const sql = getDb()
  const result = await sql`
    SELECT * FROM predictions WHERE id = ${id}
  `
  return (result[0] as Prediction) || null
}

export async function getPredictionByStripeSession(sessionId: string): Promise<Prediction | null> {
  const sql = getDb()
  const result = await sql`
    SELECT * FROM predictions WHERE stripe_session_id = ${sessionId}
  `
  return (result[0] as Prediction) || null
}

export async function getAllPredictions(): Promise<Prediction[]> {
  const sql = getDb()
  const result = await sql`
    SELECT * FROM predictions ORDER BY created_at DESC
  `
  return result as Prediction[]
}

export async function createPrediction(data: {
  stripe_session_id: string
  stripe_payment_intent_id: string
  customer_email: string
  scan_image_url: string
  scan_image_filename: string
  referral_code: string | null
  amount_paid: number
  status: string
}): Promise<Prediction> {
  const sql = getDb()
  const result = await sql`
    INSERT INTO predictions (
      stripe_session_id, stripe_payment_intent_id, customer_email,
      scan_image_url, scan_image_filename, referral_code, amount_paid, status
    ) VALUES (
      ${data.stripe_session_id}, ${data.stripe_payment_intent_id}, ${data.customer_email},
      ${data.scan_image_url}, ${data.scan_image_filename}, ${data.referral_code},
      ${data.amount_paid}, ${data.status}
    )
    RETURNING *
  `
  return result[0] as Prediction
}

export async function updatePredictionAI(id: string, data: {
  ai_prediction: string
  ai_confidence: number
  ai_raw_response: string
}): Promise<void> {
  const sql = getDb()
  await sql`
    UPDATE predictions SET
      ai_prediction = ${data.ai_prediction},
      ai_confidence = ${data.ai_confidence},
      ai_raw_response = ${data.ai_raw_response}
    WHERE id = ${id}
  `
}

export async function updatePredictionConfirmResult(id: string, data: {
  manual_review_result: string
  final_result: string
  status: string
  reviewed_at: string
  result_sent_at: string
}): Promise<void> {
  const sql = getDb()
  await sql`
    UPDATE predictions SET
      manual_review_result = ${data.manual_review_result},
      final_result = ${data.final_result},
      status = ${data.status},
      reviewed_at = ${data.reviewed_at},
      result_sent_at = ${data.result_sent_at}
    WHERE id = ${id}
  `
}

export async function updatePredictionUnclear(id: string): Promise<void> {
  const sql = getDb()
  await sql`
    UPDATE predictions SET
      manual_review_result = 'unclear',
      final_result = 'unclear',
      status = 'refunded',
      reviewed_at = ${new Date().toISOString()}
    WHERE id = ${id}
  `
}

export async function updatePredictionRefunded(paymentIntentId: string): Promise<void> {
  const sql = getDb()
  await sql`
    UPDATE predictions SET
      status = 'refunded',
      refund_processed_at = ${new Date().toISOString()}
    WHERE stripe_payment_intent_id = ${paymentIntentId}
  `
}

export async function updatePredictionRefundedById(id: string): Promise<void> {
  const sql = getDb()
  await sql`
    UPDATE predictions SET
      status = 'refunded',
      refund_processed_at = ${new Date().toISOString()}
    WHERE id = ${id}
  `
}

export async function updatePredictionPaymentFailed(paymentIntentId: string): Promise<void> {
  const sql = getDb()
  await sql`
    UPDATE predictions SET status = 'payment_failed'
    WHERE stripe_payment_intent_id = ${paymentIntentId}
  `
}

export async function updatePredictionWebhookConfirmed(
  column: 'stripe_session_id' | 'stripe_payment_intent_id',
  value: string
): Promise<void> {
  const sql = getDb()
  if (column === 'stripe_session_id') {
    await sql`
      UPDATE predictions SET payment_confirmed_via_webhook = true
      WHERE stripe_session_id = ${value}
    `
  } else {
    await sql`
      UPDATE predictions SET payment_confirmed_via_webhook = true
      WHERE stripe_payment_intent_id = ${value}
    `
  }
}

// --- Referral Codes ---

export async function getActiveReferralCode(code: string): Promise<ReferralCode | null> {
  const sql = getDb()
  const result = await sql`
    SELECT * FROM referral_codes
    WHERE code = ${code} AND is_active = true
  `
  return (result[0] as ReferralCode) || null
}

export async function updateReferralCodeUsage(
  id: string,
  newUsesCount: number,
  newTotalCommission: number
): Promise<void> {
  const sql = getDb()
  await sql`
    UPDATE referral_codes SET
      uses_count = ${newUsesCount},
      total_commission_owed = ${newTotalCommission}
    WHERE id = ${id}
  `
}

// --- Email Leads ---

export async function getEmailLeadByEmail(email: string): Promise<{ id: string } | null> {
  const sql = getDb()
  const result = await sql`
    SELECT id FROM email_leads WHERE email = ${email}
  `
  return (result[0] as { id: string }) || null
}

export async function createEmailLead(data: {
  email: string
  source: string
  discount_code: string | null
}): Promise<void> {
  const sql = getDb()
  await sql`
    INSERT INTO email_leads (email, source, discount_code, discount_used, converted_to_sale)
    VALUES (${data.email}, ${data.source}, ${data.discount_code}, false, false)
  `
}

export async function getLeadStats(): Promise<{
  total: number
  converted: number
  recent: number
}> {
  const sql = getDb()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const [totalResult, convertedResult, recentResult] = await Promise.all([
    sql`SELECT COUNT(*)::int AS count FROM email_leads`,
    sql`SELECT COUNT(*)::int AS count FROM email_leads WHERE converted_to_sale = true`,
    sql`SELECT COUNT(*)::int AS count FROM email_leads WHERE created_at >= ${sevenDaysAgo.toISOString()}`,
  ])

  return {
    total: totalResult[0]?.count || 0,
    converted: convertedResult[0]?.count || 0,
    recent: recentResult[0]?.count || 0,
  }
}
