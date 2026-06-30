<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-30 -->

# app/content

## Purpose

Central content registry for hand-authored editorial pages. Holds the `Post` interface definition, metadata helpers, and a curated set of TypeScript-authored pillar guides, blog posts, and standalone pages (FAQ, "How Our AI Works"). Each file is a self-contained object implementing the `Post` interface with answer-engine-friendly structure: answer-first `intro`, question-style section headings, a `keyTakeaways` summary box for AEO, and a structured `faq` list for both on-page Q&A and FAQPage JSON-LD markup. The registry in `index.ts` automatically routes these posts and feeds them into the sitemap and related-post resolution.

## Key Files

| File | Description |
|------|-------------|
| `types.ts` | `Post` interface and related types (`ArticleSection`, `FaqItem`, `Citation`, `Collection`). Defines the answer-engine-friendly content model (intro, sections with IDs, structured FAQ, citations). |
| `metadata.ts` | Site metadata (title, description, social links). |
| `index.ts` | Central registry of all hand-authored posts and helper functions (`getPostBySlug`, `getBlogPosts`, `getPostByCollection`). |
| `posts/nub-theory.ts` | Pillar guide for "Nub Theory" — the core prediction method. |
| `posts/faq.ts` | FAQ page (all-in-one Q&A for common customer questions). |
| `posts/how-our-ai-works.ts` | Explainer page on the AI prediction model. |
| `posts/nub-theory-*.ts` (15 files) | Blog posts deep-diving into nub theory accuracy, variations, competing methods (Ramzi, skull theory, NIPT), and user experience (gender reveal ideas, disappointment). |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `posts/` | Hand-authored TypeScript post files (~28 total); each exports a `Post` object. Curated editorial pieces, not auto-generated. |
| `library/` | Additive markdown knowledge base (~772 articles across 10 categories); rendered separately via loader. See `library/AGENTS.md`. |

## For AI Agents

### Working In This Directory

- Posts in `posts/` are written in TypeScript (not markdown) and must implement the `Post` interface exactly.
- Each post must be imported in `index.ts` and added to the `allPosts` array to be routable and discoverable.
- The `intro` field must be answer-first HTML (40–60 words), suitable for answer-engine snippets.
- The `faq` array is rendered on-page and also powers FAQPage JSON-LD; keep Q&A concise and self-contained.
- `relatedSlugs` are resolved at build time — broken links are caught by `scripts/verify-content.mjs`.
- `keywords` and `keyTakeaways` are used for SEO and AEO respectively; keep them lean (3–6 items).
- Collection type ('pillar', 'blog', 'page') determines routing: pillar posts live at `/[slug]`, blog at `/blog/[slug]`, pages at custom paths.

### Testing Requirements

- Run `node scripts/verify-content.mjs` to catch:
  - Posts referenced in `index.ts` but missing from disk (orphaned imports).
  - Duplicate slugs, slug↔path mismatches.
  - Meta title / description outside SEO length budgets.
  - `relatedSlugs` and in-body internal links pointing to nonexistent pages.
- No automated tests for content rendering — integration tested in `app/e2e-test.mjs`.

### Common Patterns

- Answer-first design: the `intro` field answers the page's main question in 1–2 sentences, then the `sections` expand with context.
- Sections use kebab-case `id` anchors (`nub-theory-basics`, etc.) for in-page TOC links.
- FAQ items are extracted and rendered as a schema-friendly list; keep answers plain text or light HTML.
- Citations are labeled, outbound links for E-E-A-T (Expertise, Experience, Authoritativeness, Trustworthiness) — use sparingly and verify URLs.

## Dependencies

### Internal

- Uses `library/loader.ts` to read markdown articles (separate, non-competing set).
- `types.ts` is imported by `app/components/seo/JsonLd.tsx` and `app/app/[collection]/[slug]/page.tsx`.

### External

- No external runtime dependencies for the content model itself (types are pure TypeScript).
- Build-time markdown rendering in `library/` uses `marked`, `gray-matter`.

<!-- MANUAL: -->
