/**
 * Audit / verify the additive markdown content library.
 *
 * Reports per-pillar counts, frontmatter completeness, meta-description length,
 * thin pages (quality gate), duplicate slugs within the library, and overlaps
 * with the existing TS posts (which the loader skips to avoid cannibalization).
 *
 * Run:  node scripts/audit-library.mjs
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LIB = join(ROOT, 'content', 'library');
const POSTS = join(ROOT, 'content', 'posts');

const PILLARS = [
  'nub-theory', 'week-by-week', 'symptoms', 'scans-tests', 'nutrition',
  'mental-health', 'complications', 'lifestyle', 'relationships', 'baby-prep',
];
const THIN = 400;

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
const stripBrand = (s) => s.replace(/\s*\|\s*Nub Hub\s*$/i, '');
const wordCount = (md) => (md.replace(/```[\s\S]*?```/g, ' ').match(/\b[\w'-]+\b/g) || []).length;

// Existing TS post identifiers (for overlap detection).
const existingSlugs = new Set();
const existingTitles = new Set();
if (existsSync(POSTS)) {
  for (const f of readdirSync(POSTS).filter((f) => f.endsWith('.ts'))) {
    const src = readFileSync(join(POSTS, f), 'utf8');
    const s = src.match(/\bslug:\s*'([^']+)'/);
    if (s) existingSlugs.add(s[1].toLowerCase());
    const t = src.match(/\btitle:\s*'([^']+)'/) || src.match(/\btitle:\s*"([^"]+)"/);
    if (t) existingTitles.add(norm(stripBrand(t[1])));
  }
}

const issues = [];
const add = (sev, file, msg) => issues.push({ sev, file, msg });
const perPillar = {};
const seen = {};
let total = 0, thin = 0, dup = 0, indexable = 0;

for (const pillar of PILLARS) {
  const dir = join(LIB, pillar);
  if (!existsSync(dir)) { perPillar[pillar] = 0; continue; }
  const files = readdirSync(dir).filter((f) => f.endsWith('.md') && !f.startsWith('_') && !f.startsWith('.'));
  perPillar[pillar] = files.length;
  total += files.length;

  for (const file of files) {
    const rel = `${pillar}/${file}`;
    let data, content;
    try { ({ data, content } = matter(readFileSync(join(dir, file), 'utf8'))); }
    catch { add('ERROR', rel, 'unparseable frontmatter'); continue; }

    for (const k of ['title', 'description', 'slug', 'category', 'keywords']) {
      const v = data[k];
      if (!v || (Array.isArray(v) && v.length === 0)) add('WARN', rel, `missing ${k}`);
    }

    const fmSlug = typeof data.slug === 'string' ? data.slug : '';
    const leaf = (fmSlug.split('/').filter(Boolean).pop() || file.replace(/\.md$/, '')).toLowerCase();
    if (seen[leaf]) add('ERROR', rel, `duplicate slug "${leaf}" (also ${seen[leaf]})`); else seen[leaf] = rel;

    const desc = typeof data.description === 'string' ? data.description : '';
    if (desc && (desc.length < 70 || desc.length > 165)) add('WARN', rel, `description ${desc.length} chars (ideal 150-160)`);

    const words = wordCount(content);
    const isThin = words < THIN;
    if (isThin) { thin++; add('WARN', rel, `thin: ${words} words (<${THIN}) → noindex`); }

    const title = typeof data.title === 'string' ? data.title : '';
    const isDup = existingSlugs.has(leaf) || existingTitles.has(norm(stripBrand(title)));
    if (isDup) { dup++; add('INFO', rel, 'overlaps an existing TS post → skipped (no cannibalization)'); }

    if (!isThin && !isDup && desc) indexable++;
  }
}

const bySev = (s) => issues.filter((i) => i.sev === s);
console.log(`\n=== Library audit: ${total} pages across ${PILLARS.length} pillars ===`);
for (const p of PILLARS) console.log(`  ${String(perPillar[p] ?? 0).padStart(4)}  ${p}`);
console.log(`\nRoutable (non-duplicate):              ${total - dup}`);
console.log(`Indexable (non-thin, non-dup, w/ desc): ${indexable}`);
console.log(`Thin (<${THIN} words → noindex):           ${thin}`);
console.log(`Overlaps existing TS posts (skipped):   ${dup}`);
console.log(`\nERRORS: ${bySev('ERROR').length}`);
bySev('ERROR').slice(0, 60).forEach((i) => console.log(`  [${i.file}] ${i.msg}`));
console.log(`\nWARNINGS: ${bySev('WARN').length}`);
bySev('WARN').slice(0, 80).forEach((i) => console.log(`  [${i.file}] ${i.msg}`));
console.log(`\nOVERLAPS (info): ${bySev('INFO').length}`);
bySev('INFO').slice(0, 80).forEach((i) => console.log(`  [${i.file}] ${i.msg}`));
console.log('');
process.exit(bySev('ERROR').length ? 1 : 0);
