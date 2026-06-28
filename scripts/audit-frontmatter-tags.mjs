/**
 * Audit frontmatter tags and keywords for slug-like values.
 *
 * Flags entries that look like URL slugs masquerading as human-readable topic
 * labels, e.g. 'ectopic-pregnancy:-symptoms,-treatment-&-recovery'.
 *
 * Run: node scripts/audit-frontmatter-tags.mjs   (from app/)
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LIB = join(ROOT, 'content', 'library');

const PILLARS = [
  'nub-theory', 'week-by-week', 'symptoms', 'scans-tests', 'nutrition',
  'mental-health', 'complications', 'lifestyle', 'relationships', 'baby-prep',
];

/**
 * A tag is slug-like if it:
 *  - Contains hyphens AND at least one of: colon, ampersand, comma
 *  - OR is all-lowercase-hyphenated with more than 4 hyphens (title-turned-slug)
 */
function isSlugLike(tag) {
  if (typeof tag !== 'string') return false;
  const t = tag.trim();
  if (!t) return false;
  // Has hyphens + special slug-title chars
  if (t.includes('-') && (t.includes(':') || t.includes('&') || t.includes(','))) return true;
  // All-lowercase hyphenated with 4+ hyphens (slug-style title)
  if (/^[a-z0-9][a-z0-9-]+$/.test(t) && (t.match(/-/g) || []).length >= 4) return true;
  return false;
}

const flagged = [];

for (const pillar of PILLARS) {
  const dir = join(LIB, pillar);
  if (!existsSync(dir)) continue;

  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md') && !f.startsWith('_'))) {
    const srcPath = join(dir, file);
    const rel = `${pillar}/${file}`;
    let data;
    try {
      ({ data } = matter(readFileSync(srcPath, 'utf8')));
    } catch {
      continue;
    }

    const issues = [];
    for (const field of ['tags', 'keywords']) {
      const raw = data[field];
      const vals = Array.isArray(raw) ? raw : typeof raw === 'string' && raw.trim() ? [raw.trim()] : [];
      for (const v of vals) {
        if (isSlugLike(String(v))) {
          issues.push({ field, value: String(v) });
        }
      }
    }

    if (issues.length) {
      flagged.push({ src: rel, srcPath, issues });
    }
  }
}

if (flagged.length === 0) {
  console.log('\n✓ No slug-like tags or keywords found.\n');
  process.exit(0);
} else {
  console.log(`\n=== Slug-like tags/keywords: ${flagged.length} files flagged ===\n`);
  for (const f of flagged) {
    console.log(`  [${f.src}]`);
    for (const i of f.issues) {
      console.log(`    ${i.field}: "${i.value}"`);
    }
  }
  console.log('');
  process.exit(1);
}
