<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-30 -->

# app/scripts

## Purpose

Manual maintenance and audit scripts for the markdown content library and hand-authored posts. These are Node.js CLI tools (`.mjs` files) that developers run on-demand to validate content integrity, fix bulk issues, generate assets, and verify SEO compliance. None are part of the build pipeline or runtime — they audit or transform the source files and report findings.

## Key Files

| File | Description |
|------|-------------|
| `audit-library.mjs` | Validates the markdown library integrity: per-pillar counts, frontmatter completeness, meta-description length, thin pages (word count < 400), duplicate slugs within library, and overlaps with existing TS posts. Reports all issues with severity levels. Run: `node scripts/audit-library.mjs`. |
| `audit-frontmatter-tags.mjs` | Flags tags/keywords that look like URL slugs (e.g., hyphenated with colons/ampersands or 4+ hyphens). Helps catch copy-paste errors where slugified titles sneak into human-readable metadata. Run: `node scripts/audit-frontmatter-tags.mjs`. |
| `audit-related-links.mjs` | Validates all internal markdown links (`[text](/pillar/slug)`) against files on disk. Reports broken or non-existent links. Run: `node scripts/audit-related-links.mjs`. |
| `fix-frontmatter-tags.mjs` | Bulk-replaces slug-like tags with clean, human-readable alternatives using a hardcoded `FIXES` map. Run: `node scripts/fix-frontmatter-tags.mjs`. |
| `fix-related-links.mjs` | Bulk-fixes broken related-article links using a hardcoded `REPLACEMENTS` map. Maps old bad slugs to correct ones, or removes the entire list item if set to `null`. Run: `node scripts/fix-related-links.mjs`. |
| `add-ymyl-citations.mjs` | Adds outbound citations (NHS, Tommy's, RCOG) to YMYL ("Your Money or Your Life") library pages if not already present. Only adds safe, verifiable section-level URLs; falls back to pillar-level links if unsure. Inserts before disclaimer divider or Related-articles block. Run: `node scripts/add-ymyl-citations.mjs`. |
| `verify-content.mjs` | Content integrity linter for hand-authored TS posts. Catches orphaned files (on disk but not imported), duplicate slugs, slug↔path mismatches, SEO meta length violations, broken `relatedSlugs` and in-body links. Run: `node scripts/verify-content.mjs`. |
| `genclay.mjs` | Clay asset (3D illustration) generator using Gemini image models via REST API. Reads jobs from `_gen/jobs.json` (prompt, optional input image for img2img). Generates PNG images and validates color type. Requires `GEMINI_API_KEY`. Run: `node scripts/genclay.mjs [jobsFile]`. |
| `cutout.mjs` | Background removal utility for clay-generated images. Flood-fills near-white edges to transparent RGBA PNG, then crops to content bounds. Useful for post-processing clay renders. Run: `node scripts/cutout.mjs <inDir> <outDir> [tolerance]`. |

## For AI Agents

### Working In This Directory

- **All scripts are manual, on-demand tools.** None are part of the build/deploy pipeline.
- **They read and write source markdown files directly** — always commit or back up before running bulk-fix scripts (`fix-*.mjs`).
- **Scripts are idempotent for audits** (no side effects) but destructive for fixes. Review the output of audit scripts before running fix scripts.
- **Run from `app/` directory** (parent), not from `app/scripts/`. Example: `cd app && node scripts/audit-library.mjs`.
- **Environment variables required** for some scripts:
  - `genclay.mjs` needs `GEMINI_API_KEY` (reads from `process.env` or `.env.local`).
  - Others are file-system only (no external dependencies).

### Common Patterns

- **Audit scripts** output text/JSON summaries; exit code 0 even if issues found (they report, not fail the build).
- **Fix scripts** require explicit hardcoded `FIXES`/`REPLACEMENTS` maps — they never auto-apply rules. Add entries to the map, run once, verify, commit.
- **Markdown parsing** uses `gray-matter` for YAML frontmatter and `marked` for rendering (matching the build-time loader).
- **Slug normalization** is consistent across all scripts: lowercase, remove non-alphanumeric characters (except hyphens).
- **YMYL detection**: scripts treat four pillars as "Your Money or Your Life" content: `complications`, `symptoms`, `scans-tests`, `mental-health`.

### Testing & Validation

- Run audit scripts **before and after** bulk edits to verify no regressions.
- `verify-content.mjs` should pass **before every commit** (catches orphaned posts, broken links).
- `audit-library.mjs` should pass **before a content library release** (ensures completeness, no thin pages).
- Clay generation (`genclay.mjs`) output is inspected visually before use; `cutout.mjs` is a post-process step.

## Dependencies

### Internal

- Reads source files from `app/content/posts/` (TS files) and `app/content/library/` (markdown).
- Loads the central post registry (`app/content/index.ts`) to detect overlaps.
- Loads pillar definitions (`app/content/library/pillars.ts`).

### External

- **gray-matter** — YAML frontmatter parsing.
- **marked** — markdown rendering (to HTML, for word count).
- **jimp** — image processing (clay background removal).
- **node:fs, node:path** — filesystem operations.

<!-- MANUAL: -->
