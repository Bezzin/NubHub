<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-30 -->

# app/content/library

## Purpose

Additive markdown knowledge base of ~772 articles spread across 10 pregnancy/nub-theory topic categories (pillars). Articles are authored in markdown with YAML frontmatter, loaded at build time by `loader.ts`, rendered to HTML, and automatically routed via the `/[pillar]/[slug]` Next.js route. Two gates prevent conflicts: dedup (markdown articles whose slug/title match an existing TypeScript `Post` are excluded from routing) and quality (articles under 400 words are marked `thin` and noindexed until improved). The loader extracts FAQ Q&A from markdown for FAQPage schema and calculates reading time automatically.

## Key Files

| File | Description |
|------|-------------|
| `loader.ts` | Build-time filesystem loader. Reads all .md files from category subdirectories, parses YAML frontmatter + markdown body, renders to HTML, applies dedup/quality gates, extracts FAQ. Exports `getAllLibraryPages()`, `getRoutableLibraryPages()`, `getIndexableLibraryPages()`. |
| `pillars.ts` | Defines the 10 category ("pillar") slugs and labels, plus helpers (`pillarLabel()`, `PILLAR_SLUGS`). Mapped 1:1 to subdirectories. |

## Article Categories (Pillars)

| Slug | Label | Count | Purpose |
|------|-------|-------|---------|
| `nub-theory` | Nub Theory | 80 | Core prediction method: what it is, accuracy, variations, comparisons to Ramzi/skull theory. |
| `week-by-week` | Week by Week | 68 | Pregnancy milestones, development, and what to expect each week. |
| `symptoms` | Symptoms & Body Changes | 120 | Physical changes: nausea, fatigue, spotting, skin, mood, weight. |
| `scans-tests` | Scans & Tests | 97 | 12-week scan, NIPT, NT scan, glucose tolerance, anatomy scan. |
| `nutrition` | Nutrition & Diet | 112 | Food safety, vitamins, supplements, allergies, dietary restrictions (vegan, vegetarian). |
| `mental-health` | Mental Health | 43 | Depression, anxiety, tokophobia, perinatal mental health. |
| `complications` | Complications & Warning Signs | 76 | Miscarriage, ectopic, gestational diabetes, pre-eclampsia, bleeding, blood clots. |
| `lifestyle` | Lifestyle & Work | 56 | Work, exercise, sex, travel, hobbies, sleep, skincare. |
| `relationships` | Relationships | 31 | Partner dynamics, family, friends, support during pregnancy. |
| `baby-prep` | Baby Preparation | 55 | Antenatal classes, prams, car seats, nursery, budgeting, first steps as a parent. |
| **Total** | | **772** | |

## Frontmatter Schema

Each markdown file has YAML frontmatter with these fields:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | yes | Page title (used in meta if present; otherwise derived from first H1). |
| `description` | string | yes | Meta description (~150–160 chars). Pages without description are excluded from sitemap. |
| `slug` | string | conditional | URL slug. If omitted, filename is used. Loader derives final slug from last path segment. |
| `category` | string | no | Topic/category label for CMS/metadata. |
| `tags` | string[] or CSV | no | Human-readable topic tags (not URL slugs). Audited by `scripts/audit-frontmatter-tags.mjs`. |
| `keywords` | string[] or CSV | no | SEO keywords for on-page markup. |
| `author` | string | no | Author name. |
| `medical_reviewer` | string | no | Reviewer name (for YMYL credibility). |
| `last_updated` | string (YYYY-MM-DD) | no | ISO date; falls back to 2026-06-22 if omitted. |
| `reading_time` | number or string | no | Override reading-time calculation; otherwise auto-computed at ~200 words/minute. |
| `faq_schema` | boolean | no | Flag to include FAQPage JSON-LD markup. |
| `breadcrumb_schema` | boolean | no | Flag to include breadcrumb schema. |

## Markdown Content Structure

- **First H1** becomes the visible page title (can override frontmatter `title`).
- **Section headings** use H2 with optional anchor IDs: `## Heading {#anchor-id}` → `<h2 id="anchor-id">Heading</h2>` for TOC linking.
- **FAQ section** is detected by an H2 matching `/frequently asked|faq/i` (case-insensitive). H3 items under it become Q&A pairs.
- **Further reading / Related articles** blocks are parsed as internal markdown links `[text](/pillar/slug)`, validated by `scripts/audit-related-links.mjs`.

## For AI Agents

### Working In This Directory

- Articles live in subdirectories named after pillar slugs (e.g., `nub-theory/`, `nutrition/`).
- Do not create new pillar directories without updating `pillars.ts`.
- Filenames are arbitrary but conventionally kebab-case (e.g., `best-pregnancy-vitamins-uk-2025.md`).
- Use the frontmatter schema above; omit optional fields rather than leaving them empty.
- Tag and keyword values must be human-readable (not URL slugs like `ectopic-pregnancy:-symptoms,-treatment`). See `scripts/audit-frontmatter-tags.mjs` to flag slug-like entries.
- Internal links must use the format `[text](/pillar/slug)` with no leading `/app`. The loader's dedup logic matches filenames, so keep slugs consistent with actual filenames.

### Testing & Auditing Scripts

Run from `app/` (root of the Next.js project):

- **`node scripts/audit-library.mjs`** — per-pillar counts, frontmatter completeness, thin pages (word count < 400), duplicates (overlap with TS posts), missing descriptions.
- **`node scripts/audit-frontmatter-tags.mjs`** — flags tags/keywords that look like URL slugs (e.g., hyphenated with colons/ampersands/commas).
- **`node scripts/audit-related-links.mjs`** — validates all internal markdown links (`/pillar/slug`) against files on disk.
- **`node scripts/fix-related-links.mjs`** — bulk-fixes broken links using a hardcoded `REPLACEMENTS` map.
- **`node scripts/fix-frontmatter-tags.mjs`** — bulk-replaces slug-like tags with human-readable alternatives.
- **`node scripts/add-ymyl-citations.mjs`** — adds NHS/Tommy's/RCOG outbound citations to YMYL (Your Money or Your Life) pillars if not already present. Never fabricates URLs — falls back to pillar-level fallback links.

No automated rendering tests — content is validated at build time by the loader and schema-checked in E2E tests.

### Common Patterns

- Answer-engine-friendly: front-load the most useful information in the intro/opening paragraphs.
- Use numbered/bulleted lists and tables for scannability.
- FAQ sections use H3 for questions, plain-text/light-HTML answers; extracted automatically for FAQPage schema.
- Internal links to other library articles use `[text](/pillar/slug)` format; these are validated before routing.
- YMYL pillars (complications, symptoms, scans-tests, mental-health) should include outbound citations to NHS/Tommy's (added by `scripts/add-ymyl-citations.mjs` if missing).

## Dependencies

### Internal

- `index.ts` from `app/content` checks the library via dedup logic (`existingSlugs`, `existingTitles`).
- `app/app/[pillar]/[slug]/page.tsx` route renders library pages using `getLibraryPage()`.
- `app/app/sitemap.ts` includes indexable library pages (`getIndexableLibraryPages()`).

### External

- **marked** — markdown to HTML conversion.
- **gray-matter** — YAML frontmatter parsing.

<!-- MANUAL: -->
