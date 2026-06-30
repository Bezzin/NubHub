<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-30 -->

# app/app (App Router Root)

## Purpose

This is the Next.js App Router root directory. It contains the root layout, global styles, page routes (marketing, content library, checkout, admin), dynamic routes for pillar/article pages, and all 14 API route handlers. The directory structure reflects the URL structure (e.g., `/about` maps to `about/page.tsx`, `/api/analyze` maps to `api/analyze/route.ts`).

## Key Files

| File | Description |
|------|-------------|
| `layout.tsx` | Root layout — metadata (OG, Twitter, robots), GA4 script injection, JsonLd schemas (organization, website) |
| `page.tsx` | Landing page (marketing, hero, testimonials, pricing, CTA) |
| `globals.css` | Global styles: Tailwind directives, clay/kawaii tokens, typography, theme colors |
| `robots.ts` | `robots.txt` generation — controls crawler access |
| `sitemap.ts` | Dynamic sitemap.xml generation (static pages + all library articles + blog posts) |
| `about/page.tsx` | About page — team info (links to EDITORIAL.reviewer photo), company story |
| `admin/page.tsx` | Admin dashboard — shows predictions awaiting human review, live stats |
| `admin/referrals/page.tsx` | Referral tracking & payouts UI (admin only) |
| `blog/page.tsx` | Blog index — lists all hand-authored articles from `app/content/` |
| `blog/[slug]/page.tsx` | Dynamic blog post page — fetches from `app/content/`, wraps in `ArticleLayout` |
| `checkout/page.tsx` | Embedded Stripe Checkout — renders `@stripe/react-stripe-js` inline form |
| `contact/page.tsx` | Contact form — uses Resend to send inquiry emails |
| `faq/page.tsx` | FAQ page — static Q&A with accordion UI |
| `how-our-ai-works/page.tsx` | Explains Gemini image analysis & nub-theory prediction logic |
| `nub-theory/page.tsx` | Educational page on nub theory (vs. Ramzi, skull) |
| `privacy/page.tsx` | Privacy policy (GDPR, data handling, YMYL disclaimer) |
| `refund/page.tsx` | Refund policy & request form |
| `result/page.tsx` | Customer result page — displays prediction after payment + analysis |
| `terms/page.tsx` | Terms of Service (entertainment purposes, liability limits) |
| `upload/page.tsx` | Core upload flow — file input, preview, session verification, redirects to checkout |
| `upload/verify-session/route.ts` | Verifies Stripe session ID after checkout.session.completed webhook |
| `[pillar]/page.tsx` | Dynamic pillar hub page (e.g., `/week-by-week`) — lists all articles in that pillar |
| `[pillar]/[slug]/page.tsx` | Dynamic library article page — fetches from markdown library, wraps in `LibraryArticle` |
| `api/` | 14 API route handlers (documented separately in `app/app/api/AGENTS.md`) |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `api/` | API route handlers — Stripe, Gemini, Telegram, email, admin, upload, refunds (documented in `app/app/api/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- **App Router Mental Model:** Pages (page.tsx, layout.tsx, not-found.tsx, error.tsx) are Server Components by default. Use `'use client'` only where needed (checkout form, mobile nav, client state). Route segments map to URL paths: `app/about/page.tsx` = `/about`, `app/[pillar]/[slug]/page.tsx` = `/:pillar/:slug`.
- **Metadata & SEO:** Root layout exports static `metadata`; child layouts and pages export their own. Canonical URLs and OG images are set via `SITE_URL` from `app/lib/site.ts`. All article pages inject JSON-LD schemas (article, breadcrumb, FAQ) via the `JsonLd` component.
- **Dynamic Routes & ISR:** Pages using dynamic params (e.g., `[pillar]/[slug]`) should export `generateStaticParams()` to pre-render known routes at build time. Use `revalidate` for Incremental Static Regeneration if content changes.
- **Checkout is Embedded, Not Redirected:** The `/checkout` page renders Stripe's EmbeddedCheckout component inline — no popup, no redirect to Stripe domain. On success, Stripe sends customer to `return_url` (`/upload?session_id=...`), which verifies the session and creates a prediction record.
- **Content Library Integration:** The `[pillar]/` and `[pillar]/[slug]/` routes fetch markdown articles from `app/content/library/loader.ts` and render them via `LibraryArticle` component. Markdown is trusted (first-party, vetted content) — rendered as-is via `dangerouslySetInnerHTML`.

### Testing Requirements

- **E2E:** Test the full user flow (upload → checkout → analysis → result). Use Playwright. Test mobile & desktop viewports.
- **Metadata & SEO:** Verify page title, description, OG image, canonical URL. Check that JSON-LD renders in HTML source (not hidden).
- **Dynamic Routes:** Generate static params for all pillar/article combos. Verify ISR cache revalidation if articles change.
- **Checkout Flow:** Test payment success/decline scenarios. Verify session verification redirects correctly. Check webhook delivery (Stripe → `/api/webhooks/stripe`).

### Common Patterns

- **Server Components for Data Fetching:** Use async `page.tsx` to fetch articles, metadata, etc. during server-side rendering. Avoid N+1 queries.
- **Client Interactivity Isolated:** Checkout form, mobile nav, modals use `'use client'`. Keep them small and far from data-fetching logic.
- **Error Boundaries:** Each route can export an `error.tsx` to catch and handle errors within that segment.
- **Dynamic Imports:** For large client components (checkout form, AI widgets), use `dynamic()` with `ssr: false` to reduce main bundle.

## Dependencies

### Internal

- `app/lib/` — database, Stripe, R2, Gemini, Telegram, email, site config, schema builders
- `app/components/` — layout (Header, Footer, SiteHeader, SiteFooter), UI primitives, marketing sections, article layouts, SEO (JsonLd)
- `app/content/` — markdown library loader & taxonomy

### External

- `next` — App Router, dynamic route handling, metadata API, Image optimization
- `@stripe/react-stripe-js`, `@stripe/stripe-js` — checkout form
- `framer-motion` — header/menu animations
- `google-analytics` script (injected via GA_ID env var)

<!-- MANUAL: -->
