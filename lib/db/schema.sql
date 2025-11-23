-- NubHub Submissions Table
-- Stores ultrasound scan submissions with AI analysis and manual review results

CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  stripe_payment_id VARCHAR(255),
  stripe_session_id VARCHAR(255),
  promo_code VARCHAR(50),
  ai_result VARCHAR(20),
  ai_confidence INTEGER,
  ai_reasoning TEXT,
  ai_tips TEXT[],
  final_result VARCHAR(20),
  status VARCHAR(50) DEFAULT 'pending_payment' NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  reviewed_at TIMESTAMP,
  reviewed_by VARCHAR(255),
  refunded_at TIMESTAMP
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_email ON submissions(email);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_stripe_session ON submissions(stripe_session_id);

-- Status values:
-- 'pending_payment' - Initial upload, waiting for payment
-- 'processing' - Payment received, AI analysis in progress
-- 'completed' - AI returned Boy/Girl, result sent to user
-- 'pending_review' - AI returned Unclear, waiting for admin review
-- 'reviewed' - Admin completed manual review, result sent
-- 'refunded' - Timed out (>2hrs), refund issued

-- Result values: 'Boy', 'Girl', 'Unclear', NULL
