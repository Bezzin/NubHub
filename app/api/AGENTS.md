<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-30 -->

# app/app/api (API Route Handlers)

## Purpose

This directory contains 14 Next.js API route handlers that power the core business logic:

- **Image Analysis** (`analyze/`) — Gemini AI nub-theory prediction engine
- **Payment & Checkout** (`stripe/create-checkout/`, `webhooks/stripe/`) — embedded Stripe checkout and webhook verification
- **Human Review Workflow** (`telegram/webhook/`, `admin/confirm/`, `admin/predictions/`) — Telegram bot integration for expert reviewer decisions
- **Email Dispatch** (`email/send-result/`, `email/send-unclear/`) — Resend transactional emails
- **Upload & Verification** (`upload/`, `upload/verify-session/`) — file handling, session validation
- **Predictions & Results** (`predictions/[id]/`) — fetch prediction by ID
- **Refunds** (`refund/process/`) — manual refund handling
- **Lead Capture** (`leads/capture/`, `leads/stats/`) — analytics and email capture

Each handler is a Next.js route module exporting `GET` and/or `POST` functions. All return JSON via `NextResponse`. Error handling is try-catch with specific error types; secrets are validated at route entry.

## Key Files

| File | Description |
|------|-------------|
| `admin/confirm/route.ts` | POST — Admin confirms/overrides AI prediction (boy/girl/unclear). Updates database, triggers email to customer. Requires admin auth. |
| `admin/predictions/route.ts` | GET — Fetch all predictions awaiting human review (used by admin dashboard). Requires auth. |
| `analyze/route.ts` | POST { prediction_id } — Core AI engine. Fetches scan image from R2, sends to Gemini, returns { prediction: BOY/GIRL/UNCLEAR, confidence: 0-100, explanation: string }. Triggers Telegram bot notification for human review. |
| `email/send-result/route.ts` | POST { prediction_id, result } — Sends customer email with prediction result + keepsake. Uses Resend. Called by Telegram webhook (human review) or analyze route (auto-send if confident). |
| `email/send-unclear/route.ts` | POST { prediction_id } — Sends customer email if scan is UNCLEAR. Offers refund or free re-scan. |
| `leads/capture/route.ts` | POST { email } — Captures email from landing page opt-in form. Stores in database, subscribes to Resend list. |
| `leads/stats/route.ts` | GET — Returns lead conversion metrics (total signups, paid conversions, refund requests). Used by admin dashboard. |
| `predictions/[id]/route.ts` | GET /api/predictions/:id — Fetch prediction record by ID. Returns { id, scan_url, ai_result, admin_result, status, created_at, ... }. Used by result page, admin, etc. |
| `refund/process/route.ts` | POST { prediction_id, reason } — Processes customer refund request. Calls Stripe refund API, updates database, sends confirmation email. |
| `stripe/create-checkout/route.ts` | POST { referral_code? } — Creates embedded Stripe Checkout Session (ui_mode: 'embedded'). Returns { sessionId, clientSecret } for `/checkout` page to render inline form. Normalizes app URL to avoid `url_invalid` errors. Returns user to `/upload?session_id=...` on success. |
| `telegram/webhook/route.ts` | POST (webhook) — Receives button presses from Telegram bot (boy/girl/unclear callbacks). Verifies webhook secret, updates prediction in database, sends customer email. **Webhook must validate secret header `x-telegram-bot-api-secret-token`.** |
| `upload/route.ts` | POST { file, sessionId? } — Accepts scan image file. Validates MIME type + dimensions. Compresses client-side (before upload). Stores in R2 with signed presigned URL. Returns { prediction_id, upload_status }. |
| `upload/verify-session/route.ts` | POST { session_id } — Verifies Stripe checkout.session.completed webhook was received. Called by `/upload` page after checkout success to confirm payment before creating prediction record. Returns { verified: boolean, prediction_id?: string }. |
| `webhooks/stripe/route.ts` | POST (webhook) — Receives Stripe webhook events (checkout.session.completed, charge.refunded). Verifies webhook signature. On success, marks session paid, creates prediction record, queues analyze job. **Signature validation is critical.** |

## Subdirectories

(None — all route handlers are direct .ts files in subdirectories for logical grouping)

## For AI Agents

### Working In This Directory

- **Webhook Signature Validation is Mandatory.** Stripe (`webhooks/stripe/`) and Telegram (`telegram/webhook/`) both require signature/secret validation. Both must fail closed — if validation fails, return 401/403 immediately. Never process an unverified webhook.
- **Image Analysis is the Core Engine.** The `analyze/` route calls Gemini with a detailed prompt designed to detect nub orientation (upward = BOY, flat = GIRL). The response format is strict: `prediction\nconfidence\nexplanation`. Any changes to the prompt or parsing must be tested end-to-end with sample ultrasound images.
- **Telegram Workflow is Time-Sensitive.** When `analyze/` completes, it sends a Telegram message to the human reviewer with the AI prediction + a photo. The reviewer presses a button (boy/girl/unclear). The `telegram/webhook/` handler updates the database and sends the customer email. If the webhook handler crashes, the review is lost — error handling must be robust.
- **Stripe Checkout Returns Via Query Param.** The `return_url` in `create-checkout/` points to `/upload?session_id=...`. The client-side upload page must verify this session ID via `/api/upload/verify-session/` before creating a prediction. This prevents fraudulent predictions without payment.
- **Refunds Reverse Stripe Charges.** The `refund/process/` route calls `stripe.refunds.create()` with the original charge ID. Update the prediction status to `refunded` and send a confirmation email. Manual review required — never auto-refund.
- **Email Dispatch Uses Resend.** Both `email/send-result/` and `email/send-unclear/` use the Resend client to send transactional emails. Resend requires a valid `RESEND_API_KEY` env var. Emails include the prediction result, keepsake image, and T&Cs.
- **Lead Capture is Low-Touch.** The `leads/capture/` route simply stores email + timestamp in the database and optionally subscribes to a Resend audience. No validation beyond basic email regex.

### Testing Requirements

- **Stripe Webhook Signature:** Use Stripe's test webhook signing library to generate valid signatures. Verify that invalid signatures are rejected (401).
- **Telegram Webhook Secret:** Mock the Telegram API and test that missing/invalid `x-telegram-bot-api-secret-token` returns 401.
- **Image Analysis (Gemini):** Mock Gemini responses (BOY, GIRL, UNCLEAR with confidence scores). Test that the prompt is sent correctly and responses are parsed as `prediction\nconfidence\nexplanation`.
- **Stripe Session Verification:** Create a test session, mock webhook delivery, call `verify-session/`, confirm it returns `{ verified: true }`.
- **Email Dispatch:** Mock Resend API. Verify that `send-result/` includes the prediction result and customer email. Verify `send-unclear/` includes refund option.
- **Upload Validation:** Test file type validation (reject non-image), image dimension validation, compression.

### Common Patterns

- **Try-Catch with Detailed Logging:** Wrap external API calls (Stripe, Gemini, Telegram, Resend) in try-catch. Log errors to console/observability (Google Cloud Logging if available). Re-throw user-friendly error messages.
- **Environment Variable Validation:** At route entry, validate all required env vars (e.g., `GEMINI_API_KEY`, `STRIPE_SECRET_KEY`). Fail early if missing.
- **Database Transactions:** For multi-step flows (payment → analysis → email), use database transactions to prevent partial state. Example: payment received → create prediction → send email (all or nothing).
- **Response Format:** All successful responses return `{ success: true, data: ... }`. Errors return `{ error: "message" }` with appropriate HTTP status (400 bad request, 401 unauthorized, 404 not found, 500 server error).
- **Idempotency:** Webhook handlers (Stripe, Telegram) may be retried. Use idempotency keys or database constraints to prevent duplicate processing.

## Dependencies

### Internal

- `app/lib/db` — `getPredictionById()`, `createPrediction()`, `updatePrediction*()`, database queries
- `app/lib/stripe` — `getStripe()` client, `stripe.checkout.sessions.create()`, `stripe.refunds.create()`
- `app/lib/r2` — `getSignedImageUrl()`, R2 file upload/download
- `app/lib/telegram` — `sendTelegramPhotoWithButtons()`, `editTelegramMessageCaption()`, `answerCallbackQuery()`
- `app/lib/email` — Resend client (if abstracted) or direct Resend imports
- `app/lib/gemini` — Gemini API client setup (if abstracted) or direct `@google/generative-ai` import

### External

- `next` — `NextRequest`, `NextResponse`, `NextApiRequest`, `NextApiResponse`
- `@google/generative-ai` — Gemini image analysis
- `stripe` — Checkout sessions, refunds, webhook signature verification
- `resend` — Transactional email
- Node.js `crypto` — HMAC-SHA256 for webhook signature verification

<!-- MANUAL: -->
