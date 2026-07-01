<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-30 -->

# app/lib

## Purpose

Shared utility libraries for the Next.js application: database access (Neon PostgreSQL), cloud storage (Cloudflare R2), payment processing (Stripe), notifications (Telegram bot), JSON-LD structured data builders, brand/site configuration, and small helper functions. These modules are imported across API routes, server components, and build scripts, providing a single source of truth for credentials, schemas, and external service integrations.

## Key Files

| File | Description |
|------|-------------|
| `db.ts` | Neon PostgreSQL client and data access layer. Exports typed queries for `Prediction` (scan uploads, AI results, refunds), `ReferralCode` (influencer tracking), and `EmailLead` (email signup). Uses parameterized SQL to prevent injection. |
| `r2.ts` | Cloudflare R2 (S3-compatible) image storage client. Handles ultrasound scan image uploads, signed URL generation, file validation (JPEG/PNG/WebP, max 10MB), and unique filename generation. |
| `stripe.ts` | Stripe API client. Lazily-instantiated, memoized server-side instance pinned to a stable API version (`2025-02-24.acacia`). Reads `STRIPE_SECRET_KEY` at call time (not import time) for clear runtime errors. |
| `telegram.ts` | Telegram bot client for notifications. Sends plain-text alerts, photo uploads with callback buttons (for manual prediction review), and message edits. Graceful no-op if credentials not configured. |
| `utils.ts` | Small utility function: `cn()` for Tailwind class composition (clsx + twMerge). |
| `site.ts` | Site-wide configuration: `SITE_URL`, brand metadata (name, description, "up to 94%" accuracy claim, £9.97 price), editorial team info (author "Nathaniel", reviewer "Ivy"), and `ABSOLUTE()` URL helper. |
| `schema.ts` | JSON-LD structured data builders: `organizationSchema()`, `websiteSchema()`, `productSchema()`, `breadcrumbSchema()`, `faqSchema()`, `articleSchema()`. All output valid JSON-LD compatible with FAQPage, Article, BreadcrumbList, etc. (Not a database schema — misleading name.) |

## For AI Agents

### Working In This Directory

- **Stripe is LIVE in production** (acct_1NibXhL81aLIwBUi, live mode since 2026-06-25). Test changes against Stripe's test mode before modifying `stripe.ts` or any checkout routes.
- **Secrets are never hardcoded.** `STRIPE_SECRET_KEY`, `NEON_DATABASE_URL`, `CLOUDFLARE_R2_*`, `TELEGRAM_*` are loaded from environment variables (via `.env.local`, GitHub Actions, or similar). Never commit them.
- **Database** (`db.ts`) uses Neon's serverless `neon()` client with template-literal SQL for parameterization. All queries are parameterized; do not construct SQL strings.
- **R2 storage** is configured via AWS SDK with Cloudflare endpoint. Image uploads are validated (type, size) before PutObject.
- **Telegram** integration is optional — gracefully skips if `TELEGRAM_BOT_TOKEN` or `TELEGRAM_CHAT_ID` are not set.
- **JSON-LD builders** (`schema.ts`) output plain JSON objects suitable for `<script type="application/ld+json">` tags. Verify schema compliance at https://schema.org or Google's Rich Results tester.

### Testing Requirements

- `db.ts`: integration tested against Neon in `app/e2e-test.mjs` (payment flow, lead capture).
- `r2.ts`: image validation tested locally; upload tested with real credentials (R2 sandbox or staging bucket).
- `stripe.ts`: tested via Stripe test-mode webhooks and API calls in checkout flow.
- `telegram.ts`: manual testing with test bot token; skipped in CI if not configured.
- `schema.ts`: unit-testable (pure functions); output validated in `app/components/seo/JsonLd.tsx`.

### Common Patterns

- Single client instance per service (Stripe, Neon) — lazy-loaded on first use, memoized thereafter.
- Environment variables validated at call time (not import time) to catch missing keys early in handlers.
- Typed database returns (`Prediction`, `ReferralCode`, etc.) with nullable/optional fields matching schema.
- R2 upload flow: validate → generate unique name → upload → return filename (caller constructs full URL).
- Telegram notifications are async fire-and-forget; errors logged but not thrown (don't interrupt main flow).

## Dependencies

### Internal

- Used by: API routes in `app/app/api/*`, server components, build scripts (`scripts/verify-content.mjs`).
- Imports: `types.ts` from `app/content` (for structured data); SiteConfig exported to `app/site.config.ts` (brand metadata).

### External

- **@neondatabase/serverless** — Neon PostgreSQL client.
- **@aws-sdk/client-s3, @aws-sdk/s3-request-presigner** — Cloudflare R2 access.
- **stripe** — Stripe API client (Node.js SDK).
- **clsx, tailwind-merge** — Tailwind class merging utility (`cn()` helper).
- No runtime dependencies for Telegram (uses native `fetch()` to Telegram API).

<!-- MANUAL: -->
