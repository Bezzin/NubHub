<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-30 -->

# app (Next.js Application Root)

## Purpose

This directory holds the complete Next.js 16 + React 19 web application for NubHub — the AI + expert-reviewed baby gender prediction service deployed at nubhub.baby. The app uses the App Router and includes:

- **Pages & Routes** — static marketing pages, content library (680+ articles), AI prediction upload/result flow, admin/human-review tools, checkout (Stripe embedded), and Telegram webhook for human reviewer workflow
- **API Routes** — 14 handlers covering image analysis (Gemini), payment (Stripe), email (Resend), lead capture, admin confirmation, refunds, and Telegram integration
- **Components** — UI primitives (shadcn), marketing sections, article layouts, SEO/JSON-LD builders, clay/kawaii design system
- **Content Pipeline** — markdown-based article library ingested from a separate project, with frontmatter parsing and pillar-based taxonomy
- **Static Assets** — hero images, clay mascot illustrations, video, mockups, team photos

Database: Neon (Postgres) via `@neondatabase/serverless`. Storage: Cloudflare R2 via `@aws-sdk/client-s3`. Payment: Stripe (LIVE since 2026-06-25, embedded checkout). Image analysis: Google Gemini AI. Email: Resend. Human review: Telegram bot workflow.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | Next.js 16, React 19, 28 prod dependencies (Stripe, Gemini, Resend, Tailwind, Radix, Framer Motion, etc.) |
| `tsconfig.json` | Path aliases (`@/`), JSX preset, strict mode |
| `tailwind.config.ts` | Claymorphism/kawaii color tokens (`--clay-*`, `--pastel-*`), custom radius scales |
| `next.config.ts` | Image optimization, webpack config for pdf processing |
| `.env.example` | Template for Stripe, Gemini, Neon, R2, Resend, Telegram, GA4, feature flags |
| `app/app/` | App Router root — layout, globals.css, pages, API routes (see `app/app/AGENTS.md`) |
| `app/components/` | All UI, marketing, layout, SEO components (see `app/components/AGENTS.md`) |
| `app/public/` | Static assets: images, clay illustrations, video (see `app/public/AGENTS.md`) |
| `app/lib/` | Utilities: database (Neon), R2 storage, Stripe, Gemini, Telegram, email, schema builders, site metadata |
| `app/content/` | Markdown article library + related content (sibling AGENTS.md: `app/content/library/AGENTS.md`) |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `app/app/` | Next.js App Router root — layout, pages, and API routes (documented in `app/app/AGENTS.md`) |
| `app/components/` | React components — UI, marketing, layout, article, SEO (documented in `app/components/AGENTS.md`) |
| `app/public/` | Static assets — images, illustrations, video, mockups (documented in `app/public/AGENTS.md`) |
| `app/lib/` | Shared utilities — database, storage, Stripe, Gemini, Telegram, email, schema, metadata |
| `app/content/` | Markdown article library + taxonomy (documented separately in `app/content/library/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- **Payment Code is Production-Critical.** Stripe is LIVE (since 2026-06-25, dedicated NubHub account `acct_1NibXhL81aLIwBUi`). Any changes to `lib/stripe.ts`, checkout routes (`api/stripe/create-checkout`), webhook handlers (`api/webhooks/stripe`), or cart/pricing logic must be verified against Stripe test mode before touching production. The embedded checkout form renders inline on `/checkout` — no redirect to external Stripe.
- **Image Analysis Drives Business Logic.** The `analyze/` endpoint (Google Gemini) returns BOY/GIRL/UNCLEAR predictions. This flows into email results, Telegram human-review workflow, and the refund process. Changes to the prompt or response parsing must be tested end-to-end.
- **Telegram Webhook Completes Human Review.** The `/api/telegram/webhook` endpoint receives button presses (boy/girl/unclear) from human reviewers via a Telegram bot. Updates flow back to the database and trigger customer emails. Webhook secret validation is critical — fail closed if not configured.
- **Content Library is a Separate Project.** The markdown library at `app/content/library/` is ingested from an external project via a pipeline. Changes to library markdown or taxonomy are authored in that project, not here. This codebase reads frontmatter and renders the markdown as trusted HTML.
- **Secrets are Never Hardcoded.** All credentials (Stripe, Gemini, Neon, R2, Resend, Telegram) come from env vars. Use the PowerShell script pattern (at repo root: `set-nubhub-stripe-live-env.ps1`) to load secrets locally — never paste them into chat or commit them.

### Testing Requirements

- **E2E Testing:** Use the provided Playwright suite (`e2e-test.mjs` in repo root). Cover: upload → payment → analysis → result email. Include edge cases: declined card, unclear scan, refund request.
- **API Integration Tests:** Test Stripe webhook delivery, Telegram button callbacks, email dispatch. Mock external services (Gemini, Resend, Telegram).
- **Database Isolation:** Use a test Neon branch for integration tests. Run migrations before each test suite.
- **No Production Secrets in Tests:** Test mode keys only. If a test accidentally touches production, audit and rotate credentials immediately.

### Common Patterns

- **Immutability:** Always spread or construct new objects; never mutate. Example: `const updatedUser = { ...user, name }` not `user.name = name`.
- **Error Handling:** Try-catch with specific error types; re-throw user-friendly messages. Wrap external API calls (Stripe, Gemini, Telegram) in try-catch.
- **Input Validation:** Use Zod schemas at route entry points. Validate file types, image dimensions, email format.
- **Async Operations:** Use async/await; avoid `.then()` chains. Handle promise rejections.
- **Environment Variables:** All external config loaded from env vars. Provide `.env.example` template.
- **Component Structure:** Small, focused files (<400 lines). Extract hooks and utilities. Prefer composition over inheritance.

## Dependencies

### Internal

- `app/content/library/` — markdown article library ingested via a separate pipeline (documented separately)
- `app/lib/` — core utilities used across all pages and API routes

### External

**Core Framework & UI:**
- `next@16` — App Router, Server Components, image optimization
- `react@19` — Latest React with compiler support
- `@tailwindcss/tailwindcss` — utility CSS, clay/kawaii design tokens
- `@radix-ui/*` — unstyled accessible components (button, dialog, table, tabs, etc.)
- `class-variance-authority`, `tailwind-merge`, `clsx` — component variant management
- `framer-motion` — animations (header slide-in, mobile menu, counters)

**Database & Storage:**
- `@neondatabase/serverless` — Postgres client for Neon
- `@aws-sdk/client-s3`, `s3-request-presigner` — R2 (Cloudflare S3-compatible) presigned URLs

**Payment (LIVE in Production):**
- `stripe@latest`, `@stripe/react-stripe-js`, `@stripe/stripe-js` — embedded checkout (ui_mode: 'embedded'), webhook validation

**AI & Analysis:**
- `@google/generative-ai` — Gemini 2.0 Flash for nub-theory image analysis

**Email:**
- `resend` — transactional email (result notifications)

**Content & Markdown:**
- `gray-matter` — frontmatter parsing from markdown
- `marked` — markdown to HTML rendering
- `@radix-ui/avatar` — author/reviewer avatars in articles

**UX & Utilities:**
- `browser-image-compression` — client-side image optimization before upload
- `react-countup` — animated number counters (testimonials, accuracy %)
- `embla-carousel-react` — carousel/slider (testimonials)
- `lucide-react` — icon library

**Monitoring & Analytics:**
- Google Analytics 4 (via `gtag` script, configured via NEXT_PUBLIC_GA_ID env var)

**Telegram (Human Review Workflow):**
- Custom Telegram API calls (no SDK) via `fetch` and `app/lib/telegram.ts`

<!-- MANUAL: -->
